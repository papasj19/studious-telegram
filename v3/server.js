const net = require('net');

//node server.js <type> <ip> <port>
//READ WRIITE
//node server.js 1 127.0.0.1 5001
//READ ONLY
//node server.js 2 127.0.0.1 5002

const SERVER_TYPE = process.argv[2]; // 1 = readwrite, 2 = read only
const HOST = process.argv[3] || '127.0.0.1';
const PORT = Number(process.argv[4] || 5001);

if (SERVER_TYPE !== '1' && SERVER_TYPE !== '2') {
  console.log('Usage: node server.js <1 readwrite | 2 readonly> <ip> <port>');
  process.exit(1);
}

let currentValue = 0;

function serverName() {
  if (SERVER_TYPE === '1') {
    return 'ReadWrite';
  }

  return 'Read';
}

function startListening() {
  const server = net.createServer((socket) => {
    console.log(`Incoming request from server: ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', (data) => {


      //wrap into function 
      const message = data.toString().trim();
      console.log(`data obtained: ${message}`);

      if (message === 'READ') {
        socket.write(`VALUE ${currentValue}\n`);
        return;
      }

      if (message.startsWith('UPDATE ')) {
        const newValue = Number(message.split(' ')[1]);

        if (Number.isInteger(newValue)) {
          currentValue = newValue;


          //here call the function and ddpending on what it returns, send back OK or ERROR
          socket.write('OK\n');
        } else {
          socket.write('ERROR\n');
        }

        return;
      }

      socket.write('ERROR\n');
    });
  });

  server.listen(PORT, HOST, () => {
    console.log(`${serverName()} server has now started on ${HOST}:${PORT}`);
  });
}



async function getCurrentValue() {

  //first thing is to yell that im going to grab it
  //so socket here



  //grab it

  return currentValue;
}

async function updateCurrentValue(value) {
  //value in param is already incremented
  //first thing is to yell that im going to set it with param value



  currentValue = value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readWriteLoop() {
  for (let i = 0; i < 10; i++) {
    const value = await getCurrentValue();

    await updateCurrentValue(value + 1);

    await sleep(1000);
  }
}

async function readOnlyLoop() {
  for (let i = 0; i < 10; i++) {
    const value = await getCurrentValue();

    await sleep(1000);
  }
}

async function main() {
  startListening();

  if (SERVER_TYPE === '1') {
    await readWriteLoop();
  } else {
    await readOnlyLoop();
  }
}

main();
