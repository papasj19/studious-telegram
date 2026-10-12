const net = require('net');

const SERVER_TYPE = process.env.SERVER_TYPE || '1';
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 5001);
const PREVIOUS_HOST = process.env.PREVIOUS_HOST || '127.0.0.1';
const PREVIOUS_PORT = Number(process.env.PREVIOUS_PORT || 5001);
const NEXT_HOST = process.env.NEXT_HOST || '127.0.0.1';
const NEXT_PORT = Number(process.env.NEXT_PORT || 5002);
let hasToken = process.env.HAS_TOKEN === '1';

if (SERVER_TYPE !== '1' && SERVER_TYPE !== '2') {
  console.log('SERVER_TYPE must be 1 for readwrite or 2 for read only');
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
      const message = data.toString().trim();
      const response = handleFrame(message);

      socket.write(`${response}\n`);
    });
  });

  server.listen(PORT, HOST, () => {
    console.log(`${serverName()} server started on ${HOST}:${PORT}`);
    console.log(`Previous server is ${PREVIOUS_HOST}:${PREVIOUS_PORT}`);
    console.log(`Next server is ${NEXT_HOST}:${NEXT_PORT}`);

    if (hasToken) {
      console.log('This server starts with the token');
    }
  });
}

function sendFrame(host, port, frame) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(port, host, () => {
      socket.write(`${frame}\n`);
    });

    socket.on('data', (data) => {
      const response = data.toString().trim();
      socket.end();
      resolve(response);
    });

    socket.on('error', (error) => {
      reject(error);
    });
  });
}

function handleRead() {
  return `VALUE ${currentValue}`;
}

function handleUpdate(message) {
  const newValue = Number(message.split(' ')[1]);

  if (!Number.isInteger(newValue)) {
    return 'ERROR';
  }

  currentValue = newValue;
  return 'OK';
}

async function passToken() {
  const response = await sendFrame(NEXT_HOST, NEXT_PORT, 'TOKEN');
  console.log(`Token sent to ${NEXT_HOST}:${NEXT_PORT}: ${response}`);
}

async function consumeToken() {
  console.log('Token received');

  try {
    if (SERVER_TYPE === '1') {
      await readWriteLoop();
    } else {
      await readOnlyLoop();
    }

    await passToken();
  } catch (error) {
    console.log(`Error consuming token: ${error.message}`);
  }

  return 'OK';
}

function handleFrame(message) {
  console.log(`data obtained: ${message}`);

  if (message === 'READ') {
    return handleRead();
  }

  if (message === 'TOKEN') {
    consumeToken();
    return 'OK';
  }

  if (message.startsWith('UPDATE ')) {
    return handleUpdate(message);
  }

  return 'ERROR';
}

async function getCurrentValue() {
  return currentValue;
}

async function updateCurrentValue(value) {
  currentValue = value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendFirstToken() {
  if (!hasToken) {
    return;
  }

  await sleep(1000);

  try {
    await passToken();
    hasToken = false;
  } catch (error) {
    console.log(`Error sending token: ${error.message}`);
  }
}

async function readWriteLoop() {
  const value = await getCurrentValue();

  await updateCurrentValue(value + 1);

  await sleep(1000);
}

async function readOnlyLoop() {
  await getCurrentValue();

  await sleep(1000);
}

async function main() {
  startListening();
  await sendFirstToken();
}

main();
