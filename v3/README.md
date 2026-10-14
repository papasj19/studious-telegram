# Distributed Counter System - Distributed Systems 2026

by Spencer Johnson

## System requirements

* This program is written in JavaScript
* Node.js libraries:
	* net
	* readline
	* child_process

It was tested from the terminal using Node.js.

## System Architecture

* **menu.js**: Launcher used to start the servers in a ring.
* **server.js**: Server process that stores the integer value and communicates with its neighbors.

### Ring Structure

* Socket communication between servers
* Read-write and read-only server behavior
* Token passing between neighbors
* READ and UPDATE frame handling

## Running

Begin inside the v3 folder.

```bash
$  node menu.js
```

### Menu Options

1. default
2. config

## Communication Protocol

To communicate between servers this project utilizes frames.

### Frame Types

* READ: Returns the current local value.
* UPDATE <value>: Changes the current local value.
* TOKEN: Gives a server permission to take its turn.

## Contact

Spencer Johnson - spencerjames.johnson@students.salle.url.edu
