/*

This is the server code 

it does the networking 
    TOKEN 
    READ 
    UPDATE 

Gets arranged in a ring and passes a token 

can run with two algorithms 
  1) token pass with neighbor update 
  2) token pass with broadcast update

MUST KNOW its neighbors information 

course i learned about servers from
https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/?couponCode=PMNVD2025
*/


const net = require('net');

let SERVER_TYPE = process.env.SERVER_TYPE;
let HOST = process.env.HOST;
let PORT = Number(process.env.PORT);
let PREVIOUS_HOST = process.env.PREVIOUS_HOST;
let PREVIOUS_PORT = Number(process.env.PREVIOUS_PORT);
let NEXT_HOST = process.env.NEXT_HOST;
let NEXT_PORT = Number(process.env.NEXT_PORT);
let SERVER_PORTS = process.env.SERVER_PORTS;
let ALGORITHM = process.env.ALGORITHM;
let hasToken = process.env.HAS_TOKEN === '1';

if (!ALGORITHM) {
  ALGORITHM = '1';
}

if (SERVER_TYPE !== '1' && SERVER_TYPE !== '2') {
  console.error('SERVER_TYPE must be 1 for readwrite or 2 for read only');
  process.exit(1);
}

let currentValue = 0;
let turnsDone = 0;
const MAX_TURNS = 10;

function serverName() {
  if (SERVER_TYPE === '1') {
    return 'ReadWrite';
  }

  return 'Read';
}

function printServerInfo() {
  console.log(`${serverName()} server started on ${HOST}:${PORT}`);
}

function startListening() {
  const server = net.createServer((socket) => {
    socket.on('data', (data) => {
      const message = data.toString().trim();
      const response = handleFrame(message);

      socket.write(`${response}\n`);
    });
  });

  server.listen(PORT, HOST, () => {
    printServerInfo();
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
    console.error(`${new Date().toISOString()} | Server ${PORT} | Invalid update: ${message}`);
    return 'ERROR';
  }

  currentValue = newValue;
  return 'OK';
}

async function passToken() {
  const response = await sendFrame(NEXT_HOST, NEXT_PORT, 'TOKEN');

  if (response !== 'OK') {
    console.error(`${new Date().toISOString()} | Server ${PORT} | Token response from ${NEXT_HOST}:${NEXT_PORT}: ${response}`);
  }
}

async function consumeToken() {
  try {
    if (turnsDone >= MAX_TURNS) {
      await passToken();
      return 'OK';
    }

    turnsDone++;

    if (SERVER_TYPE === '1') {
      await readWriteLoop();
    } else {
      await readOnlyLoop();
    }

    if (turnsDone === MAX_TURNS) {
      console.log(`${new Date().toISOString()} | Server ${PORT} | Completed ${MAX_TURNS} turns`);
    }

    await passToken();
  } catch (error) {
    console.error(`${new Date().toISOString()} | Server ${PORT} | Error consuming token: ${error.message}`);
  }

  return 'OK';
}

function handleFrame(message) {
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

  console.error(`${new Date().toISOString()} | Server ${PORT} | Unknown frame: ${message}`);
  return 'ERROR';
}

async function getCurrentValue() {
  if (ALGORITHM === '2') {
    return currentValue;
  }

  const response = await sendFrame(PREVIOUS_HOST, PREVIOUS_PORT, 'READ');
  const value = Number(response.split(' ')[1]);

  currentValue = value;
  return currentValue;
}

async function broadcastUpdate(value) {
  const ports = SERVER_PORTS.split(',');

  for (const portText of ports) {
    const port = Number(portText);

    if (port !== PORT) {
      await sendFrame(HOST, port, `UPDATE ${value}`);
    }
  }
}

async function updateCurrentValue(value) {
  currentValue = value;

  if (ALGORITHM === '2') {
    await broadcastUpdate(value);
    return;
  }

  await sendFrame(NEXT_HOST, NEXT_PORT, `UPDATE ${value}`);
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
    console.log(`${new Date().toISOString()} | Server ${PORT} | Releasing first token`);
    await passToken();
    hasToken = false;
  } catch (error) {
    console.error(`${new Date().toISOString()} | Server ${PORT} | Error sending token: ${error.message}`);
  }
}

async function readWriteLoop() {
  const value = await getCurrentValue();

  await updateCurrentValue(value + 1);
  console.log(`${new Date().toISOString()} | Server ${PORT} | ${serverName()} | Turn ${turnsDone} | Read ${value} | Value ${currentValue}`);

  await sleep(1000);
}

async function readOnlyLoop() {
  const value = await getCurrentValue();
  console.log(`${new Date().toISOString()} | Server ${PORT} | ${serverName()} | Turn ${turnsDone} | Read ${value} | Value ${currentValue}`);

  await sleep(1000);
}

async function main() {
  startListening();
  await sendFirstToken();
}

main();
