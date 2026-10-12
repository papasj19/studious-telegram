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

function startRing(totalServers, basePort, readWriteServers, host) {
  console.log('\nStarting ring...');

  for (let i = 0; i < totalServers; i++) {
    let serverType = '2';
    if (i < readWriteServers) {
      serverType = '1';
    }

    const myPort = basePort + i;
    let nextPort = basePort + i + 1;
    if (i === totalServers - 1) {
      nextPort = basePort;
    }

    let previousPort = basePort + i - 1;
    if (i === 0) {
      previousPort = basePort + totalServers - 1;
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
        HAS_TOKEN: hasToken
      },
      stdio: 'inherit'
    });

    servers.push(server);
  }

  console.log(`\n${totalServers} servers started.`);
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
    startRing(3, 5001, 2, '127.0.0.1');
    return;
  }

  if (option !== '2') {
    console.log('Unknown option');
    reader.close();
    return;
  }

  const serversAnswer = await ask(reader, 'how many servers? ');
  const portAnswer = await ask(reader, 'base port? ');
  const readWriteAnswer = await ask(reader, 'how many read-write? ');
  const hostAnswer = await ask(reader, 'host? ');

  reader.close();

  const totalServers = toNumber(serversAnswer, 3);
  const basePort = toNumber(portAnswer, 5001);
  const readWriteServers = toNumber(readWriteAnswer, 1);
  const host = hostAnswer || '127.0.0.1';

  startRing(totalServers, basePort, readWriteServers, host);
}

process.on('SIGINT', () => {
  console.log('\nStopping launched servers...');
  stopServers();
  process.exit(0);
});

main();
