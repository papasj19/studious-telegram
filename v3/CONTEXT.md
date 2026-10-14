# Distributed Counter - Project Context

## Assignment

This is Exercise 1 for Distributed Systems 2026-2027. The program shares an integer between N server processes.

Requirements from the statement:

* Servers communicate only through sockets. Shared memory, semaphores, message queues and other IPC mechanisms are prohibited.
* `READ` returns the shared integer and `UPDATE <value>` replaces it.
* Each server must have a correct value before using it.
* A server is read-write or read-only at startup and keeps that role.
* Each server performs 10 turns and sleeps for 1000ms after each turn.
* Extra control frames are allowed if they do not directly change the integer.
* The report must explain the algorithm, limitations, scaling and adding servers mid-run. It also requires visualizations.

## Current Design

`menu.js` launches all server processes locally with Node.js. The host is fixed to `127.0.0.1`, starting at port `5001`.

Port `5432` is deliberately skipped because it was already occupied on the development machine. The ring still contains the requested number of servers: for example, a 750-server ring uses ports 5001 through 5751 except 5432. Port 5431 connects directly to port 5433.

`server.js` uses Node's built-in `net` module. Every process stores its own `currentValue`.

Frames:

* `READ` returns `VALUE <currentValue>`.
* `UPDATE <value>` replaces the local copy and returns `OK`.
* `TOKEN` is only permission to take the next turn. It does not carry the counter value.

The first server holds the initial token and sends it to the next server after one second. Each token holder does one turn and then passes the token to its next neighbor.

## Algorithms

The token ring is common to both algorithms. The difference is how the value is made current.

### Algorithm 1 - Neighbor Read

1. Receive `TOKEN` from the previous server.
2. Send `READ` to the previous server and store the returned value locally.
3. A read-write server increments it and sends `UPDATE <value>` to the next server. A read-only server does not update.
4. Sleep for one second.
5. Send `TOKEN` to the next server.

This satisfies the requirement that a server obtains a correct value before using it, even though only the next server receives an update immediately.

### Algorithm 2 - Broadcast Update

1. Receive `TOKEN`.
2. Use the local value.
3. A read-write server increments it and sends `UPDATE <value>` to every other server, sequentially. A read-only server does not update.
4. Sleep for one second.
5. Send `TOKEN` to the next server.

Algorithm 2 performs much more communication per write than Algorithm 1. It has no socket `READ` during a turn because the previous broadcasts should already have synchronized its local copy.

## Important Files

* `menu.js` - asks for server count, read-write count and algorithm, then creates the ring.
* `server.js` - socket server, frames, token handling and both algorithms.
* `README.md` - short running and protocol guide.
* `timings.md` - collected results and interpretations.
* `logs/algorithm1-750-20.log` - saved Algorithm 1 timestamps.
* `logs/algorithm2-750-20.log` - saved initial Algorithm 2 timestamps.
* `report/report_contents/report.tex` - LaTeX report source.

## Measurements Collected

### Algorithm 1 - 750 Servers / 20 Writers / 730 Readers

* All 750 servers started successfully after skipping port 5432.
* One full first rotation completed correctly.
* Counter after first rotation: 20.
* Measured rotation time from server 5002 turn 1 to server 5002 turn 2: 759.602 seconds (12 minutes 39.602 seconds).
* Mean interval per turn: 1012.803ms.
* The run was manually stopped during the second rotation, at value 39. It did not reach the ten-turn completion value of 200.

### Algorithm 2 - 750 Servers / 20 Writers / 730 Readers

* All 750 servers started successfully.
* One full first rotation completed correctly, with the counter reaching 20.
* Measured rotation time from server 5002 turn 1 to server 5002 turn 2: 762.979 seconds (12 minutes 42.979 seconds).
* Mean interval per turn: 1017.305ms.
* The matching Algorithm 1 rotation took 759.602 seconds. Algorithm 2 was 3.377 seconds, or 0.445%, slower in this one-run comparison.
* The writer-only interval is more revealing: Algorithm 2 averaged 1273.389ms compared with Algorithm 1's 1014.889ms, because Algorithm 2 broadcasts every write sequentially.

### Completed Functional Test - Algorithm 1, 100 Servers / 25 Writers

* All 100 servers completed all 10 configured turns.
* All 1000 turn summaries are correct and in ring order.
* Final counter: 250, matching 25 writers multiplied by 10 increments.
* Measured duration from server 5002 turn 1 to server 5001 completion: 1006.813 seconds (16 minutes 46.813 seconds).
* The 1000 one-second sleeps account for 1000 seconds; the remaining 6.813 seconds is overhead.
* A post-completion EADDRNOTAVAIL error occurred because the token continued circulating after every server finished. This confirms that termination behavior must be fixed before calling the program robust.

### Completed Functional Test - Algorithm 1, 100 Servers / 75 Writers

* All 100 servers completed 10 configured turns in the correct ring order.
* Final counter: 750, matching 75 writers multiplied by 10 increments.
* Full duration: 1006.991 seconds (16 minutes 46.991 seconds).
* Compared with 100 servers / 25 writers at 1006.813 seconds, the difference is only 0.178 seconds because each token turn contains the required one-second sleep.
* The same post-completion EADDRNOTAVAIL error occurred because completed servers continue passing the token.

## What Still Needs Attention

1. Add the two measured rotation times and a communication-count comparison to the report. The report currently has no actual performance graph.
2. Decide and implement end-of-run behavior. At present, after a server reaches 10 turns, it passes the token immediately forever. This causes the ring to continue rather than finish cleanly.
3. Replace the fixed one-second initial delay with a manual ready action or a readiness protocol. At high server counts, the first token can be released while other servers are still starting.
4. Fix TCP frame handling before treating the system as robust. A TCP `data` event is not guaranteed to contain exactly one complete newline-terminated frame; the current code assumes that it does.
5. Update the report's Results section. It still describes old 3- and 100-server output and the obsolete `Value updated: ... at ...ms` log format.
6. Add the required performance visualization and ensure Algorithm 2's section matches its actual broadcast behavior.

## Expected Result

With 20 read-write servers, each incrementing 10 times, the final counter should be 200 if the program finishes all configured turns correctly.

## Working Style

Keep edits small and direct. The project intentionally uses plain JavaScript, built-in Node.js modules and explicit control flow. Do not add frameworks, complex abstractions or a large build system.

Do not commit or push unless the user explicitly asks and gives the commit message.
