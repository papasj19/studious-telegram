const { spawn } = require('child_process');
const readline = require('readline');

const servers = [];

function ask(reader, question) {
  return new Promise((resolve) => {
    reader.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function toNumber(value, fallback) {
  const number = Number(value);

  if (!Number.isInteger(number)) {
    return fallback;
  }

  return number;
}

function startRing(totalServers, readWriteServers, algorithm, basePort) {
  const host = '127.0.0.1';

  console.log('\nRun configuration');
  console.log(`Servers: ${totalServers}`);
  console.log(`Read-write: ${readWriteServers}`);
  console.log(`Read-only: ${totalServers - readWriteServers}`);
  console.log(`Algorithm: ${algorithm}`);
  console.log(`Host: ${host}`);
  console.log(`Base port: ${basePort}`);
  console.log('Turns per server: 10');
  console.log('Sleep per turn: 1000ms');
  console.log('\nStarting ring...');

  const serverPorts = [];
  let port = basePort;

  for (let i = 0; i < totalServers; i++) {
    if (port === 5432) {
      console.log('Skipping port 5432.');
      port++;
    }

    serverPorts.push(String(port));
    port++;
  }

  for (let i = 0; i < totalServers; i++) {
    let serverType = '2';
    if (i < readWriteServers) {
      serverType = '1';
    }

    const myPort = serverPorts[i];
    let nextPort = serverPorts[i + 1];
    if (i === totalServers - 1) {
      nextPort = serverPorts[0];
    }

    let previousPort = serverPorts[i - 1];
    if (i === 0) {
      previousPort = serverPorts[totalServers - 1];
    }

    let hasToken = '0';
    if (i === 0) {
      hasToken = '1';
    }

    const server = spawn('node', ['server.js'], {
      cwd: __dirname,
      env: {
        ...process.env,
        SERVER_TYPE: serverType,
        HOST: host,
        PORT: String(myPort),
        PREVIOUS_HOST: host,
        PREVIOUS_PORT: String(previousPort),
        NEXT_HOST: host,
        NEXT_PORT: String(nextPort),
        HAS_TOKEN: hasToken,
        SERVER_PORTS: serverPorts.join(','),
        ALGORITHM: algorithm
      },
      stdio: 'inherit'
    });

    servers.push(server);
  }

  console.log('Press CTRL+C to stop all launched servers.');
}

function stopServers() {
  for (const server of servers) {
    server.kill('SIGINT');
  }
}

async function main() {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\nDistributed Counter Launcher');
  console.log('1. default');
  console.log('2. config\n');

  const option = await ask(reader, 'Choice: ');

  if (option === '1') {
    reader.close();
    startRing(3, 2, '1', 5001);
    return;
  }

  if (option !== '2') {
    console.log('Unknown option');
    reader.close();
    return;
  }

  const serversAnswer = await ask(reader, 'how many servers? ');
  const readWriteAnswer = await ask(reader, 'how many read-write? ');
  const basePortAnswer = await ask(reader, 'base port? ');
  const algorithmAnswer = await ask(reader, 'algorithm? 1. neighbor read 2. broadcast update ');

  reader.close();

  let totalServers = toNumber(serversAnswer, 3);
  let readWriteServers = toNumber(readWriteAnswer, 1);
  let basePort = toNumber(basePortAnswer, 5001);
  let algorithm = algorithmAnswer;

  if (totalServers < 1) {
    totalServers = 3;
  }

  if (readWriteServers < 0) {
    readWriteServers = 0;
  }

  if (readWriteServers > totalServers) {
    readWriteServers = totalServers;
  }

  if (basePort < 1 || basePort > 65535) {
    basePort = 5001;
  }

  if (algorithm !== '2') {
    algorithm = '1';
  }

  startRing(totalServers, readWriteServers, algorithm, basePort);
}

process.on('SIGINT', () => {
  console.log('\nStopping launched servers...');
  stopServers();
  process.exit(0);
});

main();
