# Timing Notes

These are the timing outputs collected from the terminal runs so far.

## Run 1 - Token Movement Only

Configuration:

* Algorithm 1
* 3 servers
* Ports 5001-5003
* Token movement was visible
* No `Value updated: ... at ...ms` timings were captured in this pasted output

Notes:

* The output showed repeated `TOKEN` frames.
* This run proved that the ring continued passing the token.
* It did not show useful read/update timing data.

## Run 2 - Default Configuration

Configuration:

* Algorithm 1
* 3 servers
* Ports 5001-5003
* 2 read-write servers
* 1 read-only server

Timings:

```text
Value updated: 1 at 1006ms
Value updated: 2 at 3031ms
Value updated: 3 at 4034ms
Value updated: 4 at 6054ms
Value updated: 5 at 7058ms
Value updated: 6 at 9073ms
Value updated: 7 at 10077ms
Value updated: 8 at 12095ms
Value updated: 9 at 13099ms
```

Notes:

* The token moved through the ring.
* `READ` and `UPDATE` frames were visible.
* Only read-write servers updated the value.

## Run 3 - 100 Server Configuration

Configuration:

* Algorithm 1
* 100 servers
* Ports 5001-5100
* 50 read-write servers
* 50 read-only servers

Timings:

```text
Value updated: 33 at 33314ms
Value updated: 34 at 34323ms
Value updated: 35 at 35335ms
Value updated: 36 at 36323ms
Value updated: 37 at 37350ms
Value updated: 38 at 38295ms
Value updated: 39 at 39350ms
Value updated: 40 at 40353ms
Value updated: 41 at 41335ms
Value updated: 42 at 42372ms
Value updated: 43 at 43354ms
Value updated: 44 at 44319ms
Value updated: 45 at 45371ms
Value updated: 46 at 46339ms
Value updated: 47 at 47392ms
Value updated: 48 at 48289ms
Value updated: 49 at 49370ms
Value updated: 50 at 101278ms
Value updated: 51 at 102277ms
Value updated: 52 at 103292ms
Value updated: 53 at 104299ms
Value updated: 54 at 105303ms
Value updated: 55 at 106313ms
Value updated: 56 at 107325ms
Value updated: 57 at 108315ms
Value updated: 58 at 109340ms
Value updated: 59 at 110344ms
Value updated: 60 at 111343ms
Value updated: 61 at 112343ms
Value updated: 62 at 113345ms
Value updated: 63 at 114353ms
Value updated: 64 at 115338ms
Value updated: 65 at 116337ms
Value updated: 66 at 117348ms
Value updated: 67 at 118354ms
Value updated: 68 at 119346ms
```

Notes:

* The ring reached port 5100 and returned to port 5001.
* Read-write servers updated the value.
* Read-only servers read the value and passed the token without updating.
* The large jump between `49 at 49370ms` and `50 at 101278ms` happened while the token passed through the read-only servers.

## Run 4 - Broadcast Update Configuration

Configuration:

* Algorithm 2
* Timings still need to be collected

Notes:

* This version does not use a socket `READ` to the previous server during each token turn.
* Read-write servers use `UPDATE <value>` to broadcast the new value to all servers.
* This run should be compared against the Algorithm 1 timings above.

## Additional Logs - 13 October 2026

### Earlier Partial Output

The first excerpt uses the older neighbor-read logging. Its startup configuration is not included, so it has not been combined with an earlier run. It reaches turn 3 and value 126 before CTRL+C.

Captured timings:

```text
Value updated: 100 at 202055ms
Value updated: 101 at 203054ms
Value updated: 102 at 204074ms
Value updated: 103 at 205079ms
Value updated: 104 at 206080ms
Value updated: 105 at 207086ms
Value updated: 106 at 208101ms
Value updated: 107 at 209089ms
Value updated: 108 at 210112ms
Value updated: 109 at 211118ms
Value updated: 110 at 212115ms
Value updated: 111 at 213119ms
Value updated: 112 at 214125ms
Value updated: 113 at 215131ms
Value updated: 114 at 216119ms
Value updated: 115 at 217120ms
Value updated: 116 at 218129ms
Value updated: 117 at 219131ms
Value updated: 118 at 220120ms
Value updated: 119 at 221150ms
Value updated: 120 at 222155ms
Value updated: 121 at 223165ms
Value updated: 122 at 224158ms
Value updated: 123 at 225159ms
Value updated: 124 at 226140ms
Value updated: 125 at 227165ms
Value updated: 126 at 228170ms
```

These elapsed times are relative to each reporting process's startup, as in the earlier logs. This excerpt does not establish full completion.

### Capped 100-Server Run

Configuration:

* Requested: 1000 servers, 250 read-write
* Actual configuration printed by the launcher: 100 servers, 100 read-write, 0 read-only
* Algorithm 1
* Host: 127.0.0.1
* Ports: 5001-5100
* 10 turns per server, 1000ms sleep per turn
* All 100 distinct server startup messages are present

Captured timings (UTC):

```text
2026-10-13T19:24:00.552Z | Server 5001 | Releasing first token
2026-10-13T19:24:00.560Z | Server 5002 | ReadWrite | Turn 1 | Read 0 | Value 1
2026-10-13T19:24:01.572Z | Server 5003 | ReadWrite | Turn 1 | Read 1 | Value 2
2026-10-13T19:24:02.586Z | Server 5004 | ReadWrite | Turn 1 | Read 2 | Value 3
2026-10-13T19:24:03.600Z | Server 5005 | ReadWrite | Turn 1 | Read 3 | Value 4
2026-10-13T19:24:04.615Z | Server 5006 | ReadWrite | Turn 1 | Read 4 | Value 5
2026-10-13T19:24:05.629Z | Server 5007 | ReadWrite | Turn 1 | Read 5 | Value 6
2026-10-13T19:24:06.644Z | Server 5008 | ReadWrite | Turn 1 | Read 6 | Value 7
2026-10-13T19:24:07.657Z | Server 5009 | ReadWrite | Turn 1 | Read 7 | Value 8
2026-10-13T19:24:08.671Z | Server 5010 | ReadWrite | Turn 1 | Read 8 | Value 9
2026-10-13T19:24:09.687Z | Server 5011 | ReadWrite | Turn 1 | Read 9 | Value 10
2026-10-13T19:24:10.701Z | Server 5012 | ReadWrite | Turn 1 | Read 10 | Value 11
2026-10-13T19:24:11.711Z | Server 5013 | ReadWrite | Turn 1 | Read 11 | Value 12
2026-10-13T19:24:12.727Z | Server 5014 | ReadWrite | Turn 1 | Read 12 | Value 13
2026-10-13T19:24:13.740Z | Server 5015 | ReadWrite | Turn 1 | Read 13 | Value 14
2026-10-13T19:24:14.748Z | Server 5016 | ReadWrite | Turn 1 | Read 14 | Value 15
2026-10-13T19:24:15.757Z | Server 5017 | ReadWrite | Turn 1 | Read 15 | Value 16
2026-10-13T19:24:16.773Z | Server 5018 | ReadWrite | Turn 1 | Read 16 | Value 17
2026-10-13T19:24:17.790Z | Server 5019 | ReadWrite | Turn 1 | Read 17 | Value 18
2026-10-13T19:24:18.806Z | Server 5020 | ReadWrite | Turn 1 | Read 18 | Value 19
2026-10-13T19:24:19.821Z | Server 5021 | ReadWrite | Turn 1 | Read 19 | Value 20
2026-10-13T19:24:20.833Z | Server 5022 | ReadWrite | Turn 1 | Read 20 | Value 21
2026-10-13T19:24:21.849Z | Server 5023 | ReadWrite | Turn 1 | Read 21 | Value 22
```

Notes:

* The old 100-server cap also caused the requested writer count to be reduced to 100.
* Values increased consecutively from 1 to 22.
* The last update was 21297ms (21.297 seconds) after the first token release.
* The run was stopped manually before one complete rotation. This is not a full-run completion time.
* No errors appear in the supplied output.
* These results are for 100 servers, not 1000.

### 1000-Server Attempt - Stopped During First Rotation

Source: two overlapping batches of logs supplied on 13 October 2026. The first-token timestamp and all 34 updates from the first batch match the second batch exactly. They are one run; duplicate timings are included only once below.

Configuration and startup:

* The configuration header is missing from this excerpt; the algorithm number is unconfirmed.
* Observed role boundaries are consistent with 1000 configured servers: 250 read-write (5001-5250) and 750 read-only (5251-6000).
* The first excerpt contains 971 distinct successful startup messages: 222 read-write and 749 read-only.
* It begins during startup. Missing early startup messages do not establish that those servers failed; several of them subsequently log turns.
* Server 5432 explicitly failed to bind. The intended ring therefore has a missing server.

Startup error:

```text
Error: listen EADDRINUSE: address already in use 127.0.0.1:5432
```

Captured timings (UTC):

```text
2026-10-13T21:16:00.147Z | Server 5001 | Releasing first token
2026-10-13T21:16:00.153Z | Server 5002 | ReadWrite | Turn 1 | Read 0 | Value 1
2026-10-13T21:16:01.160Z | Server 5003 | ReadWrite | Turn 1 | Read 1 | Value 2
2026-10-13T21:16:02.168Z | Server 5004 | ReadWrite | Turn 1 | Read 2 | Value 3
2026-10-13T21:16:03.181Z | Server 5005 | ReadWrite | Turn 1 | Read 3 | Value 4
2026-10-13T21:16:04.189Z | Server 5006 | ReadWrite | Turn 1 | Read 4 | Value 5
2026-10-13T21:16:05.201Z | Server 5007 | ReadWrite | Turn 1 | Read 5 | Value 6
2026-10-13T21:16:06.209Z | Server 5008 | ReadWrite | Turn 1 | Read 6 | Value 7
2026-10-13T21:16:07.223Z | Server 5009 | ReadWrite | Turn 1 | Read 7 | Value 8
2026-10-13T21:16:08.231Z | Server 5010 | ReadWrite | Turn 1 | Read 8 | Value 9
2026-10-13T21:16:09.244Z | Server 5011 | ReadWrite | Turn 1 | Read 9 | Value 10
2026-10-13T21:16:10.254Z | Server 5012 | ReadWrite | Turn 1 | Read 10 | Value 11
2026-10-13T21:16:11.268Z | Server 5013 | ReadWrite | Turn 1 | Read 11 | Value 12
2026-10-13T21:16:12.285Z | Server 5014 | ReadWrite | Turn 1 | Read 12 | Value 13
2026-10-13T21:16:13.299Z | Server 5015 | ReadWrite | Turn 1 | Read 13 | Value 14
2026-10-13T21:16:14.313Z | Server 5016 | ReadWrite | Turn 1 | Read 14 | Value 15
2026-10-13T21:16:15.329Z | Server 5017 | ReadWrite | Turn 1 | Read 15 | Value 16
2026-10-13T21:16:16.342Z | Server 5018 | ReadWrite | Turn 1 | Read 16 | Value 17
2026-10-13T21:16:17.357Z | Server 5019 | ReadWrite | Turn 1 | Read 17 | Value 18
2026-10-13T21:16:18.373Z | Server 5020 | ReadWrite | Turn 1 | Read 18 | Value 19
2026-10-13T21:16:19.389Z | Server 5021 | ReadWrite | Turn 1 | Read 19 | Value 20
2026-10-13T21:16:20.404Z | Server 5022 | ReadWrite | Turn 1 | Read 20 | Value 21
2026-10-13T21:16:21.419Z | Server 5023 | ReadWrite | Turn 1 | Read 21 | Value 22
2026-10-13T21:16:22.433Z | Server 5024 | ReadWrite | Turn 1 | Read 22 | Value 23
2026-10-13T21:16:23.450Z | Server 5025 | ReadWrite | Turn 1 | Read 23 | Value 24
2026-10-13T21:16:24.466Z | Server 5026 | ReadWrite | Turn 1 | Read 24 | Value 25
2026-10-13T21:16:25.481Z | Server 5027 | ReadWrite | Turn 1 | Read 25 | Value 26
2026-10-13T21:16:26.496Z | Server 5028 | ReadWrite | Turn 1 | Read 26 | Value 27
2026-10-13T21:16:27.509Z | Server 5029 | ReadWrite | Turn 1 | Read 27 | Value 28
2026-10-13T21:16:28.525Z | Server 5030 | ReadWrite | Turn 1 | Read 28 | Value 29
2026-10-13T21:16:29.539Z | Server 5031 | ReadWrite | Turn 1 | Read 29 | Value 30
2026-10-13T21:16:30.555Z | Server 5032 | ReadWrite | Turn 1 | Read 30 | Value 31
2026-10-13T21:16:31.571Z | Server 5033 | ReadWrite | Turn 1 | Read 31 | Value 32
2026-10-13T21:16:32.584Z | Server 5034 | ReadWrite | Turn 1 | Read 32 | Value 33
2026-10-13T21:16:33.599Z | Server 5035 | ReadWrite | Turn 1 | Read 33 | Value 34
2026-10-13T21:16:34.613Z | Server 5036 | ReadWrite | Turn 1 | Read 34 | Value 35
2026-10-13T21:16:35.629Z | Server 5037 | ReadWrite | Turn 1 | Read 35 | Value 36
2026-10-13T21:16:36.635Z | Server 5038 | ReadWrite | Turn 1 | Read 36 | Value 37
2026-10-13T21:16:37.649Z | Server 5039 | ReadWrite | Turn 1 | Read 37 | Value 38
2026-10-13T21:16:38.665Z | Server 5040 | ReadWrite | Turn 1 | Read 38 | Value 39
2026-10-13T21:16:39.683Z | Server 5041 | ReadWrite | Turn 1 | Read 39 | Value 40
2026-10-13T21:16:40.697Z | Server 5042 | ReadWrite | Turn 1 | Read 40 | Value 41
2026-10-13T21:16:41.708Z | Server 5043 | ReadWrite | Turn 1 | Read 41 | Value 42
2026-10-13T21:16:42.719Z | Server 5044 | ReadWrite | Turn 1 | Read 42 | Value 43
2026-10-13T21:16:43.733Z | Server 5045 | ReadWrite | Turn 1 | Read 43 | Value 44
2026-10-13T21:16:44.744Z | Server 5046 | ReadWrite | Turn 1 | Read 44 | Value 45
2026-10-13T21:16:45.756Z | Server 5047 | ReadWrite | Turn 1 | Read 45 | Value 46
2026-10-13T21:16:46.766Z | Server 5048 | ReadWrite | Turn 1 | Read 46 | Value 47
2026-10-13T21:16:47.779Z | Server 5049 | ReadWrite | Turn 1 | Read 47 | Value 48
2026-10-13T21:16:48.790Z | Server 5050 | ReadWrite | Turn 1 | Read 48 | Value 49
2026-10-13T21:16:49.803Z | Server 5051 | ReadWrite | Turn 1 | Read 49 | Value 50
2026-10-13T21:16:50.815Z | Server 5052 | ReadWrite | Turn 1 | Read 50 | Value 51
2026-10-13T21:16:51.828Z | Server 5053 | ReadWrite | Turn 1 | Read 51 | Value 52
2026-10-13T21:16:52.836Z | Server 5054 | ReadWrite | Turn 1 | Read 52 | Value 53
2026-10-13T21:16:53.849Z | Server 5055 | ReadWrite | Turn 1 | Read 53 | Value 54
2026-10-13T21:16:54.865Z | Server 5056 | ReadWrite | Turn 1 | Read 54 | Value 55
2026-10-13T21:16:55.881Z | Server 5057 | ReadWrite | Turn 1 | Read 55 | Value 56
2026-10-13T21:16:56.893Z | Server 5058 | ReadWrite | Turn 1 | Read 56 | Value 57
2026-10-13T21:16:57.899Z | Server 5059 | ReadWrite | Turn 1 | Read 57 | Value 58
2026-10-13T21:16:58.914Z | Server 5060 | ReadWrite | Turn 1 | Read 58 | Value 59
2026-10-13T21:16:59.927Z | Server 5061 | ReadWrite | Turn 1 | Read 59 | Value 60
2026-10-13T21:17:00.942Z | Server 5062 | ReadWrite | Turn 1 | Read 60 | Value 61
2026-10-13T21:17:01.953Z | Server 5063 | ReadWrite | Turn 1 | Read 61 | Value 62
2026-10-13T21:17:02.960Z | Server 5064 | ReadWrite | Turn 1 | Read 62 | Value 63
2026-10-13T21:17:03.967Z | Server 5065 | ReadWrite | Turn 1 | Read 63 | Value 64
2026-10-13T21:17:04.976Z | Server 5066 | ReadWrite | Turn 1 | Read 64 | Value 65
2026-10-13T21:17:05.982Z | Server 5067 | ReadWrite | Turn 1 | Read 65 | Value 66
2026-10-13T21:17:06.996Z | Server 5068 | ReadWrite | Turn 1 | Read 66 | Value 67
2026-10-13T21:17:08.003Z | Server 5069 | ReadWrite | Turn 1 | Read 67 | Value 68
2026-10-13T21:17:09.016Z | Server 5070 | ReadWrite | Turn 1 | Read 68 | Value 69
2026-10-13T21:17:10.025Z | Server 5071 | ReadWrite | Turn 1 | Read 69 | Value 70
2026-10-13T21:17:11.040Z | Server 5072 | ReadWrite | Turn 1 | Read 70 | Value 71
2026-10-13T21:17:12.056Z | Server 5073 | ReadWrite | Turn 1 | Read 71 | Value 72
2026-10-13T21:17:13.062Z | Server 5074 | ReadWrite | Turn 1 | Read 72 | Value 73
2026-10-13T21:17:14.075Z | Server 5075 | ReadWrite | Turn 1 | Read 73 | Value 74
2026-10-13T21:17:15.089Z | Server 5076 | ReadWrite | Turn 1 | Read 74 | Value 75
2026-10-13T21:17:16.106Z | Server 5077 | ReadWrite | Turn 1 | Read 75 | Value 76
2026-10-13T21:17:17.121Z | Server 5078 | ReadWrite | Turn 1 | Read 76 | Value 77
2026-10-13T21:17:18.135Z | Server 5079 | ReadWrite | Turn 1 | Read 77 | Value 78
2026-10-13T21:17:19.152Z | Server 5080 | ReadWrite | Turn 1 | Read 78 | Value 79
2026-10-13T21:17:20.167Z | Server 5081 | ReadWrite | Turn 1 | Read 79 | Value 80
2026-10-13T21:17:21.182Z | Server 5082 | ReadWrite | Turn 1 | Read 80 | Value 81
2026-10-13T21:17:22.199Z | Server 5083 | ReadWrite | Turn 1 | Read 81 | Value 82
2026-10-13T21:17:23.214Z | Server 5084 | ReadWrite | Turn 1 | Read 82 | Value 83
2026-10-13T21:17:24.227Z | Server 5085 | ReadWrite | Turn 1 | Read 83 | Value 84
2026-10-13T21:17:25.241Z | Server 5086 | ReadWrite | Turn 1 | Read 84 | Value 85
2026-10-13T21:17:26.256Z | Server 5087 | ReadWrite | Turn 1 | Read 85 | Value 86
2026-10-13T21:17:27.270Z | Server 5088 | ReadWrite | Turn 1 | Read 86 | Value 87
2026-10-13T21:17:28.284Z | Server 5089 | ReadWrite | Turn 1 | Read 87 | Value 88
2026-10-13T21:17:29.294Z | Server 5090 | ReadWrite | Turn 1 | Read 88 | Value 89
2026-10-13T21:17:30.308Z | Server 5091 | ReadWrite | Turn 1 | Read 89 | Value 90
2026-10-13T21:17:31.322Z | Server 5092 | ReadWrite | Turn 1 | Read 90 | Value 91
2026-10-13T21:17:32.335Z | Server 5093 | ReadWrite | Turn 1 | Read 91 | Value 92
2026-10-13T21:17:33.351Z | Server 5094 | ReadWrite | Turn 1 | Read 92 | Value 93
2026-10-13T21:17:34.365Z | Server 5095 | ReadWrite | Turn 1 | Read 93 | Value 94
2026-10-13T21:17:35.382Z | Server 5096 | ReadWrite | Turn 1 | Read 94 | Value 95
2026-10-13T21:17:36.396Z | Server 5097 | ReadWrite | Turn 1 | Read 95 | Value 96
2026-10-13T21:17:37.409Z | Server 5098 | ReadWrite | Turn 1 | Read 96 | Value 97
2026-10-13T21:17:38.422Z | Server 5099 | ReadWrite | Turn 1 | Read 97 | Value 98
2026-10-13T21:17:39.435Z | Server 5100 | ReadWrite | Turn 1 | Read 98 | Value 99
2026-10-13T21:17:40.451Z | Server 5101 | ReadWrite | Turn 1 | Read 99 | Value 100
2026-10-13T21:17:41.464Z | Server 5102 | ReadWrite | Turn 1 | Read 100 | Value 101
2026-10-13T21:17:42.474Z | Server 5103 | ReadWrite | Turn 1 | Read 101 | Value 102
2026-10-13T21:17:43.481Z | Server 5104 | ReadWrite | Turn 1 | Read 102 | Value 103
2026-10-13T21:17:44.495Z | Server 5105 | ReadWrite | Turn 1 | Read 103 | Value 104
2026-10-13T21:17:45.509Z | Server 5106 | ReadWrite | Turn 1 | Read 104 | Value 105
2026-10-13T21:17:46.521Z | Server 5107 | ReadWrite | Turn 1 | Read 105 | Value 106
2026-10-13T21:17:47.536Z | Server 5108 | ReadWrite | Turn 1 | Read 106 | Value 107
2026-10-13T21:17:48.548Z | Server 5109 | ReadWrite | Turn 1 | Read 107 | Value 108
2026-10-13T21:17:49.557Z | Server 5110 | ReadWrite | Turn 1 | Read 108 | Value 109
2026-10-13T21:17:50.567Z | Server 5111 | ReadWrite | Turn 1 | Read 109 | Value 110
2026-10-13T21:17:51.580Z | Server 5112 | ReadWrite | Turn 1 | Read 110 | Value 111
2026-10-13T21:17:52.594Z | Server 5113 | ReadWrite | Turn 1 | Read 111 | Value 112
2026-10-13T21:17:53.607Z | Server 5114 | ReadWrite | Turn 1 | Read 112 | Value 113
2026-10-13T21:17:54.622Z | Server 5115 | ReadWrite | Turn 1 | Read 113 | Value 114
2026-10-13T21:17:55.635Z | Server 5116 | ReadWrite | Turn 1 | Read 114 | Value 115
2026-10-13T21:17:56.647Z | Server 5117 | ReadWrite | Turn 1 | Read 115 | Value 116
2026-10-13T21:17:57.657Z | Server 5118 | ReadWrite | Turn 1 | Read 116 | Value 117
2026-10-13T21:17:58.668Z | Server 5119 | ReadWrite | Turn 1 | Read 117 | Value 118
2026-10-13T21:17:59.676Z | Server 5120 | ReadWrite | Turn 1 | Read 118 | Value 119
2026-10-13T21:18:00.688Z | Server 5121 | ReadWrite | Turn 1 | Read 119 | Value 120
2026-10-13T21:18:01.696Z | Server 5122 | ReadWrite | Turn 1 | Read 120 | Value 121
2026-10-13T21:18:02.704Z | Server 5123 | ReadWrite | Turn 1 | Read 121 | Value 122
2026-10-13T21:18:03.710Z | Server 5124 | ReadWrite | Turn 1 | Read 122 | Value 123
2026-10-13T21:18:04.723Z | Server 5125 | ReadWrite | Turn 1 | Read 123 | Value 124
2026-10-13T21:18:05.732Z | Server 5126 | ReadWrite | Turn 1 | Read 124 | Value 125
2026-10-13T21:18:06.745Z | Server 5127 | ReadWrite | Turn 1 | Read 125 | Value 126
2026-10-13T21:18:07.765Z | Server 5128 | ReadWrite | Turn 1 | Read 126 | Value 127
2026-10-13T21:18:08.777Z | Server 5129 | ReadWrite | Turn 1 | Read 127 | Value 128
2026-10-13T21:18:09.790Z | Server 5130 | ReadWrite | Turn 1 | Read 128 | Value 129
2026-10-13T21:18:10.800Z | Server 5131 | ReadWrite | Turn 1 | Read 129 | Value 130
2026-10-13T21:18:11.813Z | Server 5132 | ReadWrite | Turn 1 | Read 130 | Value 131
2026-10-13T21:18:12.822Z | Server 5133 | ReadWrite | Turn 1 | Read 131 | Value 132
2026-10-13T21:18:13.834Z | Server 5134 | ReadWrite | Turn 1 | Read 132 | Value 133
2026-10-13T21:18:14.844Z | Server 5135 | ReadWrite | Turn 1 | Read 133 | Value 134
2026-10-13T21:18:15.855Z | Server 5136 | ReadWrite | Turn 1 | Read 134 | Value 135
2026-10-13T21:18:16.864Z | Server 5137 | ReadWrite | Turn 1 | Read 135 | Value 136
2026-10-13T21:18:17.870Z | Server 5138 | ReadWrite | Turn 1 | Read 136 | Value 137
2026-10-13T21:18:18.881Z | Server 5139 | ReadWrite | Turn 1 | Read 137 | Value 138
2026-10-13T21:18:19.892Z | Server 5140 | ReadWrite | Turn 1 | Read 138 | Value 139
2026-10-13T21:18:20.905Z | Server 5141 | ReadWrite | Turn 1 | Read 139 | Value 140
2026-10-13T21:18:21.914Z | Server 5142 | ReadWrite | Turn 1 | Read 140 | Value 141
2026-10-13T21:18:22.919Z | Server 5143 | ReadWrite | Turn 1 | Read 141 | Value 142
2026-10-13T21:18:23.934Z | Server 5144 | ReadWrite | Turn 1 | Read 142 | Value 143
2026-10-13T21:18:24.945Z | Server 5145 | ReadWrite | Turn 1 | Read 143 | Value 144
2026-10-13T21:18:25.954Z | Server 5146 | ReadWrite | Turn 1 | Read 144 | Value 145
2026-10-13T21:18:26.963Z | Server 5147 | ReadWrite | Turn 1 | Read 145 | Value 146
2026-10-13T21:18:27.969Z | Server 5148 | ReadWrite | Turn 1 | Read 146 | Value 147
2026-10-13T21:18:28.982Z | Server 5149 | ReadWrite | Turn 1 | Read 147 | Value 148
2026-10-13T21:18:29.997Z | Server 5150 | ReadWrite | Turn 1 | Read 148 | Value 149
```

Measurements for the combined excerpts only:

* First token release: 2026-10-13T21:16:00.147Z.
* Last observed update: value 149 at 2026-10-13T21:18:29.997Z, from server 5150.
* Time from first token release to that update: 149850ms (2 minutes 29.850 seconds). The later manual stop has no timestamp.
* 149 turn summaries, all read-write and all turn 1.
* Observed values increase consecutively from 1 to 149; each update equals its logged read value plus one.
* Mean interval between these writer updates: 1012.459ms (about 1.012 seconds), including the programmed sleep between turns.
* The second batch shows CTRL+C and the launcher stopping the servers after the last update.
* No full rotation or completed server is shown. The token had not reached the failed server at port 5432 before the manual stop.

Status:

* Partial run with a startup failure, not a successful 1000-server benchmark.
* The early writer timings cannot establish whole-ring throughput or completion time.
* Resolve the occupied port and verify that every intended server starts before recording a full performance run.

### 500-Server Attempt - Before Skipping Port 5432

Source: terminal output supplied in chat on 13 October 2026.

Configuration:

* 500 servers: 150 read-write and 350 read-only.
* Algorithm 1: neighbor read.
* Host 127.0.0.1, base port 5001.
* 10 turns per server, with 1000ms sleep per turn.
* Startup error: `listen EADDRINUSE: address already in use 127.0.0.1:5432`.

Recorded timings:

```text
2026-10-13T21:20:40.836Z | Server 5001 | Releasing first token
2026-10-13T21:20:40.848Z | Server 5002 | ReadWrite | Turn 1 | Read 0 | Value 1
2026-10-13T21:20:41.861Z | Server 5003 | ReadWrite | Turn 1 | Read 1 | Value 2
2026-10-13T21:20:42.873Z | Server 5004 | ReadWrite | Turn 1 | Read 2 | Value 3
2026-10-13T21:20:43.882Z | Server 5005 | ReadWrite | Turn 1 | Read 3 | Value 4
2026-10-13T21:20:44.892Z | Server 5006 | ReadWrite | Turn 1 | Read 4 | Value 5
2026-10-13T21:20:45.907Z | Server 5007 | ReadWrite | Turn 1 | Read 5 | Value 6
2026-10-13T21:20:46.916Z | Server 5008 | ReadWrite | Turn 1 | Read 6 | Value 7
2026-10-13T21:20:47.927Z | Server 5009 | ReadWrite | Turn 1 | Read 7 | Value 8
2026-10-13T21:20:48.942Z | Server 5010 | ReadWrite | Turn 1 | Read 8 | Value 9
2026-10-13T21:20:49.956Z | Server 5011 | ReadWrite | Turn 1 | Read 9 | Value 10
2026-10-13T21:20:50.965Z | Server 5012 | ReadWrite | Turn 1 | Read 10 | Value 11
2026-10-13T21:20:51.973Z | Server 5013 | ReadWrite | Turn 1 | Read 11 | Value 12
2026-10-13T21:20:52.982Z | Server 5014 | ReadWrite | Turn 1 | Read 12 | Value 13
```

Measurements for this excerpt only:

* Time from first token release to the last observed update: 12146ms (12.146 seconds).
* 13 read-write turns, all turn 1, with consecutive values from 1 to 13.
* Mean interval between writer updates: 1011.167ms, including the programmed sleep between turns.
* No full rotation, completed server, or manual stop is shown in this excerpt.

Status: partial run with a startup failure, not a successful 500-server benchmark. Keep these timings separate from runs made after the port fix.

### Stopped Excerpt Before the 750-Server Run

Source: `bda444c6-910d-4f65-b17e-1e09d3b73523/pasted-text.txt`, before the new launcher menu.

The configuration and first token release are missing from this earlier excerpt. It contains 16 read-only startup messages and eight read-write turn summaries, followed by CTRL+C. Do not combine these timestamps with the later 750-server run.

```text
2026-10-13T22:46:24.939Z | Server 5004 | ReadWrite | Turn 1 | Read 2 | Value 3
2026-10-13T22:46:25.953Z | Server 5005 | ReadWrite | Turn 1 | Read 3 | Value 4
2026-10-13T22:46:26.966Z | Server 5006 | ReadWrite | Turn 1 | Read 4 | Value 5
2026-10-13T22:46:27.981Z | Server 5007 | ReadWrite | Turn 1 | Read 5 | Value 6
2026-10-13T22:46:28.995Z | Server 5008 | ReadWrite | Turn 1 | Read 6 | Value 7
2026-10-13T22:46:30.009Z | Server 5009 | ReadWrite | Turn 1 | Read 7 | Value 8
2026-10-13T22:46:31.024Z | Server 5010 | ReadWrite | Turn 1 | Read 8 | Value 9
2026-10-13T22:46:32.038Z | Server 5011 | ReadWrite | Turn 1 | Read 9 | Value 10
```

* Observed values: 3 through 10, all turn 1.
* Time between first and last supplied updates: 7099ms.
* Mean interval between supplied updates: 1014.143ms, including sleep.
* No errors are shown in this excerpt; it does not establish complete startup or a full rotation.

### 750 Servers - 20 Read-Write - Algorithm 1

Source: the same attachment, after the new launcher menu. Log timestamps are UTC on 13 October 2026.

Configuration and startup:

* 750 servers: 20 read-write and 730 read-only.
* Algorithm 1: neighbor read.
* Host 127.0.0.1, base port 5001, port 5432 skipped.
* 10 turns per server, with 1000ms sleep per turn.
* Verified 750 unique startup messages: 20 read-write and 730 read-only.
* Every expected port from 5001 through 5751, excluding 5432, appears once.
* No errors are present in the supplied run excerpt.

Recorded timings:

```text
2026-10-13T22:46:50.686Z | Server 5001 | Releasing first token
2026-10-13T22:46:50.704Z | Server 5002 | ReadWrite | Turn 1 | Read 0 | Value 1
2026-10-13T22:46:51.722Z | Server 5003 | ReadWrite | Turn 1 | Read 1 | Value 2
2026-10-13T22:46:52.754Z | Server 5004 | ReadWrite | Turn 1 | Read 2 | Value 3
2026-10-13T22:46:53.780Z | Server 5005 | ReadWrite | Turn 1 | Read 3 | Value 4
2026-10-13T22:46:54.788Z | Server 5006 | ReadWrite | Turn 1 | Read 4 | Value 5
2026-10-13T22:46:55.800Z | Server 5007 | ReadWrite | Turn 1 | Read 5 | Value 6
2026-10-13T22:46:56.807Z | Server 5008 | ReadWrite | Turn 1 | Read 6 | Value 7
2026-10-13T22:46:57.820Z | Server 5009 | ReadWrite | Turn 1 | Read 7 | Value 8
2026-10-13T22:46:58.827Z | Server 5010 | ReadWrite | Turn 1 | Read 8 | Value 9
2026-10-13T22:46:59.841Z | Server 5011 | ReadWrite | Turn 1 | Read 9 | Value 10
2026-10-13T22:47:00.852Z | Server 5012 | ReadWrite | Turn 1 | Read 10 | Value 11
2026-10-13T22:47:01.864Z | Server 5013 | ReadWrite | Turn 1 | Read 11 | Value 12
2026-10-13T22:47:02.881Z | Server 5014 | ReadWrite | Turn 1 | Read 12 | Value 13
2026-10-13T22:47:03.895Z | Server 5015 | ReadWrite | Turn 1 | Read 13 | Value 14
2026-10-13T22:47:04.912Z | Server 5016 | ReadWrite | Turn 1 | Read 14 | Value 15
2026-10-13T22:47:05.928Z | Server 5017 | ReadWrite | Turn 1 | Read 15 | Value 16
2026-10-13T22:47:06.944Z | Server 5018 | ReadWrite | Turn 1 | Read 16 | Value 17
2026-10-13T22:47:07.959Z | Server 5019 | ReadWrite | Turn 1 | Read 17 | Value 18
2026-10-13T22:47:08.972Z | Server 5020 | ReadWrite | Turn 1 | Read 18 | Value 19
2026-10-13T22:47:09.984Z | Server 5021 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:10.997Z | Server 5022 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:12.011Z | Server 5023 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:13.021Z | Server 5024 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:14.033Z | Server 5025 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:15.048Z | Server 5026 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:16.063Z | Server 5027 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:17.075Z | Server 5028 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:18.082Z | Server 5029 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:19.094Z | Server 5030 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:20.111Z | Server 5031 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:21.125Z | Server 5032 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:22.138Z | Server 5033 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:23.145Z | Server 5034 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:24.159Z | Server 5035 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:25.174Z | Server 5036 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:26.186Z | Server 5037 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:27.200Z | Server 5038 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:28.207Z | Server 5039 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:29.220Z | Server 5040 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:30.236Z | Server 5041 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:31.251Z | Server 5042 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:32.264Z | Server 5043 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:33.275Z | Server 5044 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:34.289Z | Server 5045 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:35.303Z | Server 5046 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:36.319Z | Server 5047 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:37.333Z | Server 5048 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:38.346Z | Server 5049 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:39.360Z | Server 5050 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:40.373Z | Server 5051 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:41.386Z | Server 5052 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:42.401Z | Server 5053 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:43.416Z | Server 5054 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:44.429Z | Server 5055 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:45.442Z | Server 5056 | Read | Turn 1 | Read 19 | Value 19
2026-10-13T22:47:46.449Z | Server 5057 | Read | Turn 1 | Read 19 | Value 19
```

Measurements for this excerpt only:

* First token release: 2026-10-13T22:46:50.686Z.
* Last observed turn: server 5057 at 2026-10-13T22:47:46.449Z, read 19 and value 19.
* Time from token release to that log: 55763ms (55.763 seconds).
* 56 turn summaries, all turn 1: 19 read-write and 37 read-only.
* Writer values increase consecutively from 1 to 19; every writer adds exactly one to its logged read.
* Every observed read-only turn reads and retains 19.
* No gaps in the observed server sequence from 5002 through 5057, and each turn reads the preceding turn's value.
* Mean interval between turn summaries: 1013.545ms (about 1.014 seconds), including sleep.
* No completed server, full rotation, or manual stop is shown for this run.

Interpretation:

* Server 5001 releases the initial token without taking a turn. Therefore the other 19 writers run first, followed by 730 readers. Server 5001 should make the counter 20 at the end of the first rotation.
* The reader plateau at 19 is expected, not evidence that the token stopped.
* Startup confirms that port 5432 is excluded, but this excerpt ends before the token traverses the 5431-to-5433 connection.
* The first token is released while other servers are still starting. Successful startup in this run does not resolve the fixed-delay startup limitation.
* Sleep alone accounts for 750 seconds (12 minutes 30 seconds) per full rotation and 7500 seconds (2 hours 5 minutes) for ten rotations.
* Extrapolating the observed interval gives roughly 12 minutes 40 seconds per rotation and 2 hours 7 minutes for ten rotations. These are estimates, not measured completion times.
* Expected counter after all 20 writers complete ten turns: 200, assuming correct execution throughout.
* Status: successful startup and consistent early progress, but still a partial performance sample. The next useful evidence is server 5001 completing turn 1 with value 20, followed by server 5002 starting turn 2 with value 21.

### Algorithm 1 - 750/20 - First Rotation Confirmed

Continuation of the same 750-server run above, not a separate experiment.

Sources:

* Earlier batch: `bda444c6-910d-4f65-b17e-1e09d3b73523/pasted-text.txt`.
* New batch: `01aed55d-fce6-4012-a8d2-f01f62b6423f/pasted-text.txt`.
* Combined timestamp records: [Algorithm 1, 750 servers, 20 writers](logs/algorithm1-750-20.log).
* The new batch has 754 turn summaries, including 54 exact overlaps with the earlier batch. Combining them gives 756 distinct turn summaries.

Configuration: Algorithm 1 (neighbor read), 750 servers, 20 read-write, 730 read-only, 10 turns per server, 1000ms sleep per turn, port 5432 skipped.

Verified results:

* All 750 expected servers have exactly one turn-1 summary: 20 writers and 730 readers.
* The server order matches the configured ring, including 5431 directly followed by 5433.
* Every writer adds one; every reader retains its read value; each successive turn reads the previous turn's value.
* The counter reaches 20 on server 5001's first turn.
* Six turn-2 summaries follow, ending at value 26 on server 5007.
* No errors or ten-turn completion messages are present. No manual stop is shown.
* This confirms a complete first rotation, not completion of the ten-turn experiment.

Measured milestones:

| Milestone | UTC timestamp | Value |
| --- | --- | --- |
| Initial token release | 2026-10-13T22:46:50.686Z | Not logged |
| Server 5002, turn 1 | 2026-10-13T22:46:50.704Z | 1 |
| Server 5431, turn 1 | 2026-10-13T22:54:05.084Z | 19 |
| Server 5433, turn 1 | 2026-10-13T22:54:06.095Z | 19 |
| Server 5001, turn 1 | 2026-10-13T22:59:29.296Z | 20 |
| Server 5002, turn 2 | 2026-10-13T22:59:30.306Z | 21 |
| Last supplied log: server 5007, turn 2 | 2026-10-13T22:59:35.347Z | 26 |

Performance:

* Rotation duration measured between the same server's consecutive turn summaries (5002, turn 1 to turn 2): **759602ms = 759.602 seconds = 12 minutes 39.602 seconds**.
* This interval covers 750 turn intervals and includes all 750 programmed one-second sleeps. Use the same measurement boundary for Algorithm 2.
* Mean interval per turn over this rotation: **1012.803ms**.
* Time above the nominal 750000ms sleep total: **9602ms = 9.602 seconds**. This includes networking, scheduling, processing, logging and timer delays; it is not a measurement of network latency alone.
* Initial token release to the value-20 log: **758610ms**. This log is before server 5001's sleep, so it is not the same boundary as the rotation-duration measurement.
* Initial token release to server 5002's turn-2 log: **759620ms**.
* Ten-turn completion time and final value 200 are not yet observed.

Graph data:

| Algorithm | Servers | Writers | Readers | Completed rotations observed | First rotation duration (s) | Counter at end of first rotation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 - Neighbor read | 750 | 20 | 730 | 1 | 759.602 | 20 |

This is one measured rotation from one run, not an average across repeated experiments. Algorithm 2 still needs a matched measurement before drawing an empirical comparison.

### Algorithm 1 - 750/20 - Manual Stop Recorded

The beginning of attachment `66b7204b-7a94-4bd0-98f4-bd34dd25b53e/pasted-text.txt` continues Algorithm 1 before the user stops it and launches Algorithm 2.

* Added 148 new turn summaries to [the Algorithm 1 log](logs/algorithm1-750-20.log), excluding exact overlaps.
* Total recorded: 904 turns, comprising all 750 first turns and 154 second turns.
* Last logged turn: 2026-10-13T23:02:04.404Z, server 5155, read-only, turn 2, read 39, value 39.
* CTRL+C and `Stopping launched servers...` follow. The stop itself has no timestamp.
* No counter inconsistency was found in the combined turn summaries.
* The first rotation measurement remains **759.602 seconds**.
* Final status: manually stopped during the second rotation, not a completed ten-turn run. Do not use this as a full-run completion measurement.

### Algorithm 2 - 750/20 - Startup and First Writers

Source: the same attachment, after the new launcher menu. Algorithm selection is explicitly **2 - broadcast update**.

Configuration and startup:

* 750 servers: 20 read-write, 730 read-only.
* Host 127.0.0.1, base port 5001, skipping 5432.
* 10 turns per server, 1000ms sleep per turn.
* All 750 expected unique ports started: 20 writers and 730 readers.
* No errors are shown in this excerpt.
* Timestamp records saved separately in [the Algorithm 2 log](logs/algorithm2-750-20.log).

Observed timing:

| Milestone | UTC timestamp | Value |
| --- | --- | ---: |
| Initial token release | 2026-10-13T23:02:16.002Z | Not logged |
| Server 5002, turn 1 | 2026-10-13T23:02:18.822Z | 1 |
| Server 5020, turn 1 | 2026-10-13T23:02:41.743Z | 19 |

* All 19 logged turns are consecutive first turns of writers 5002 through 5020.
* Every writer reads the preceding value and increments by one, from 0 to 19.
* Token release to the first writer summary: **2820ms**. This includes startup overlap and the first broadcast, not just token-transfer latency.
* Token release to the last supplied summary: **25741ms**.
* No reader turn, complete rotation, ten-turn completion, or manual stop is shown for Algorithm 2.

Matched early writer comparison:

The window runs from server 5002's turn-1 log to server 5020's turn-1 log in each run: 19 logged writer turns, giving 18 intervals.

| Algorithm | Window duration (s) | Mean interval between writer logs (ms) |
| --- | ---: | ---: |
| 1 - Neighbor read | 18.268 | 1014.889 |
| 2 - Broadcast update | 22.921 | 1273.389 |

Both intervals include the one-second sleep. Algorithm 2 sends each increment to 749 other servers sequentially; Algorithm 1 sends it only to the next server. The slower observed writer interval is consistent with that additional work, but this small sample does not isolate its cost from scheduling, startup load, or other system effects.

Graph status:

* Algorithm 1: measured first rotation **759.602 seconds**.
* Algorithm 2: first rotation measurement still pending.
* For a matching rotation measurement, wait for Algorithm 2 server 5002's turn-2 log (expected read 20, value 21), then subtract **2026-10-13T23:02:18.822Z**.
* Do not extrapolate a whole rotation from writer intervals alone: 730 of the 750 turns are read-only and use a different code path.

### Algorithm 2 - 750/20 - First Rotation Progress

Continuation of the same Algorithm 2 run, from `32a480f3-e38e-4894-b4b0-edcf5979e5c1/pasted-text.txt`.

* Added 556 new timestamp records to [the Algorithm 2 log](logs/algorithm2-750-20.log), with no overlap.
* Recorded progress: 575 of the 750 first-turn server records, covering servers 5002 through 5577.
* The remaining first-turn sequence is servers 5578 through 5751, followed by server 5001. That is 175 more token holders, including server 5001.
* Last supplied turn: 2026-10-13T23:12:03.839Z, server 5577, read-only, turn 1, read 19, value 19.
* Time from initial token release to the last supplied turn: 587837ms (9 minutes 47.837 seconds).
* Combined mean interval across all 575 recorded turns: 1019.193ms.
* Mean interval in this added read-only segment: 1010.977ms.
* All 19 writers increment correctly from 0 to 19. All 556 recorded readers preserve the value 19.
* The expected ring order is continuous, including 5431 directly followed by 5433.
* No errors, completed-server messages, or manual stop appear in the supplied output.

The next expected summary is server 5578, read-only, turn 1, read 19, value 19. The first full-rotation milestones remain:

```text
Server 5001 | ReadWrite | Turn 1 | Read 19 | Value 20
Server 5002 | ReadWrite | Turn 2 | Read 20 | Value 21
```

At the observed overall pace, these are roughly three minutes after the last supplied line. This is only an estimate; use the actual timestamps when the lines appear.

### Algorithm 2 - 750/20 - First Rotation Confirmed

Continuation of the same Algorithm 2 run, from faa4b46a-d3e1-4f9c-8de8-b5c4f7beb00c/pasted-text.txt.

* Added 213 timestamp records to [the Algorithm 2 log](logs/algorithm2-750-20.log), excluding exact overlaps.
* All 750 expected servers completed turn 1 exactly once: 20 read-write and 730 read-only.
* The ring order and every observed value are correct, including the 5431 to 5433 port skip.
* Server 5001 completed turn 1 at 2026-10-13T23:15:00.586Z, reading 19 and writing value 20.
* Server 5002 began turn 2 at 2026-10-13T23:15:01.801Z, reading 20 and writing value 21.
* The supplied output continues through server 5039, turn 2, value 39.
* No errors, completion messages, or manual stop appear in this excerpt.

Matched full-rotation result:

| Algorithm | Measurement boundary | Duration (s) | Mean turn interval (ms) |
| --- | --- | ---: | ---: |
| 1 - Neighbor read | Server 5002 turn 1 to turn 2 | 759.602 | 1012.803 |
| 2 - Broadcast update | Server 5002 turn 1 to turn 2 | 762.979 | 1017.305 |

Algorithm 2 took **3.377 seconds longer per first rotation**, or **0.445%** slower in this one-run measurement.

Writer-only comparison:

| Algorithm | Server 5002 to 5020, turn 1 duration (s) | Mean interval (ms) |
| --- | ---: | ---: |
| 1 - Neighbor read | 18.268 | 1014.889 |
| 2 - Broadcast update | 22.921 | 1273.389 |

The broadcast work is visible in the writer phase: Algorithm 2's writer log interval is about 25.470% longer. The whole-ring difference is small because 730 of 750 servers are read-only and each has the same configured one-second sleep.

Calculated application frame requests per full rotation, excluding replies and startup:

| Algorithm | READ | UPDATE | TOKEN | Total |
| --- | ---: | ---: | ---: | ---: |
| 1 - Neighbor read | 750 | 20 | 750 | 1520 |
| 2 - Broadcast update | 0 | 14980 | 750 | 15730 |

Use two visuals in the report:

1. A bar chart of measured first-rotation duration: 759.602 seconds for Algorithm 1 and 762.979 seconds for Algorithm 2.
2. A grouped bar chart of calculated frame requests. It explains why the whole-run time difference is modest while the writer phase is slower.

These are one-run measurements, not averages across repeated experiments. Do not claim statistical significance.

### Algorithm 2 - 750/20 - Manual Stop During Turn 2

Continuation captured before the new 100-server launcher menu in c60638fc-37ab-4600-a379-92b4903af6b3/pasted-text.txt.

* Added 22 non-duplicate turn summaries to [the Algorithm 2 log](logs/algorithm2-750-20.log).
* The final supplied Algorithm 2 line is server 5061, read-only, turn 2, value 39, at 2026-10-13T23:16:06.339Z.
* CTRL+C follows. No error is shown.
* This does not change the completed first-rotation measurement: 762.979 seconds.

### Algorithm 1 - 100/25 - New Run Started

Configuration: 100 servers, 25 read-write, 75 read-only, Algorithm 1 (neighbor read), 10 turns per server, 1000ms sleep.

* All 100 expected unique ports from 5001 through 5100 started: 25 writers and 75 readers.
* Initial token release: 2026-10-13T23:16:33.169Z.
* The first four writer turns, servers 5002 through 5005, are consecutive and correct: values 1 through 4.
* Last supplied line: 2026-10-13T23:16:36.227Z, server 5005, read 3, value 4.
* No errors appear in the supplied excerpt.
* Timestamps are saved in [the Algorithm 1 100/25 log](logs/algorithm1-100-25.log).

Expected first-rotation milestones:

```text
Server 5001 | ReadWrite | Turn 1 | Read 24 | Value 25
Server 5002 | ReadWrite | Turn 2 | Read 25 | Value 26
```

The expected final value after all ten turns is 250. Use server 5002 turn 1 to server 5002 turn 2 as the rotation measurement boundary.

### Algorithm 1 - 100/25 - Five Complete Rotations

Continuation from afcef785-9546-4502-830b-9b26948fbb09/pasted-text.txt.

* Added 575 non-duplicate timestamp records to [the Algorithm 1 100/25 log](logs/algorithm1-100-25.log).
* The run contains 579 consecutive turn summaries: all 100 servers completed turns 1 through 5, then 79 servers completed turn 6 through server 5080.
* No errors, missing turns, value inconsistencies, completion messages, or manual stop appear in this excerpt.
* Counter milestones at the end of complete rotations: 25, 50, 75, 100 and 125.
* Current supplied state: server 5080, read-only, turn 6, read 149, value 149, at 2026-10-13T23:26:15.642Z.
* The remaining work to the configured ten turns is 421 server turns. The expected final value is 250.

Repeated rotation measurements, measured from server 5002's turn to its next turn:

| Rotation | Duration (s) |
| --- | ---: |
| 1 to 2 | 101.208 |
| 2 to 3 | 100.691 |
| 3 to 4 | 100.660 |
| 4 to 5 | 100.642 |
| 5 to 6 | 100.758 |

* Mean rotation duration across these five measurements: **100.792 seconds**.
* Fastest rotation: **100.642 seconds**; slowest: **101.208 seconds**.
* The first rotation took **101.208 seconds**.

This is a useful stability result for Algorithm 1 at 100 servers. It is not directly comparable to the 750-server experiments because the server and writer counts differ.

### Algorithm 1 - 100/25 - Near Completion

Continuation from bb9f3c89-ef07-4287-902d-e08290a7490e/pasted-text.txt.

* Added 358 non-duplicate timestamped records to [the Algorithm 1 100/25 log](logs/algorithm1-100-25.log), including completed-turn messages.
* Nine full rotations have completed: every server has turn summaries for turns 1 through 9.
* The counter reached 225 when server 5001 completed turn 9.
* The tenth rotation has reached writer 5020, which read 243 and wrote 244 at 2026-10-13T23:31:57.600Z.
* Writers 5002 through 5019 have logged Completed 10 turns after their turn-10 sleeps.
* No errors, broken sequence, missing turns, or manual stop appear in the supplied output.
* There are 81 server turns remaining: writers 5021 through 5025 will take the counter to 249; the readers will preserve 249; server 5001 should then write the final value 250.

Next expected lines:

```text
Server 5021 | ReadWrite | Turn 10 | Read 244 | Value 245
Server 5025 | ReadWrite | Turn 10 | Read 248 | Value 249
Server 5001 | ReadWrite | Turn 10 | Read 249 | Value 250
Server 5001 | Completed 10 turns
```

### Algorithm 1 - 100/75 - Complete Ten-Turn Result

Final continuation from 305acabd-47fa-4d79-a3db-1f55a4b7f1fc/pasted-text.txt.

* Added 72 non-duplicate timestamped records to [the Algorithm 1 100/75 log](logs/algorithm1-100-75.log).
* All 1000 expected turn summaries are present and correct.
* All 100 servers logged Completed 10 turns.
* Server 5001 performed the final update at 2026-10-13T23:52:56.489Z: read 749, value 750.
* Server 5001 logged completion at 2026-10-13T23:52:57.491Z.
* Final value: **750**, matching 75 read-write servers multiplied by 10 increments.

Full-run timing:

* Measurement boundary: server 5002 turn 1 at 2026-10-13T23:36:10.500Z to server 5001 Completed 10 turns at 2026-10-13T23:52:57.491Z.
* Duration: **1006.991 seconds = 16 minutes 46.991 seconds**.
* The 1000 configured sleeps account for 1000 seconds. The remaining **6.991 seconds** is an average of **6.991ms per turn**.

Comparison of completed Algorithm 1 runs:

| Configuration | Writers | Final value | Full duration (s) | Sleep overhead (s) |
| --- | ---: | ---: | ---: | ---: |
| 100 servers / 25 writers | 25 | 250 | 1006.813 | 6.813 |
| 100 servers / 75 writers | 75 | 750 | 1006.991 | 6.991 |

The 100/75 run is only 0.178 seconds, or 0.018%, longer. This supports the conclusion that the one-second per-node sleep dominates Algorithm 1's overall duration.

Post-completion error:

```text
2026-10-13T23:53:01.085Z | Server 5099 | Error consuming token: connect EADDRNOTAVAIL 127.0.0.1:5100 - Local (0.0.0.0:0)
```

This is 3.594 seconds after all required turns completed. It does not affect the valid final result, but confirms that the token must stop circulating after the system has finished.

The final full-run duration should be measured from the first turn-1 log of server 5002 at 2026-10-13T23:16:33.183Z to server 5001's Completed 10 turns message. Keep the actual final timestamp rather than estimating it.

### Algorithm 1 - 100/25 - Complete Ten-Turn Result

Final continuation from 7d867d09-d5f6-445d-83b8-6f8296f38403/pasted-text.txt.

* Added 164 non-duplicate timestamped records to [the Algorithm 1 100/25 log](logs/algorithm1-100-25.log).
* All 1000 expected turn summaries are present: 100 servers multiplied by 10 turns.
* Every turn occurs in the expected ring order, reads the value produced by the prior turn, and applies the correct read-write or read-only behavior.
* All 100 servers logged Completed 10 turns.
* Server 5001 completed the final update at 2026-10-13T23:33:18.994Z: read 249, value 250.
* Server 5001 logged completion at 2026-10-13T23:33:19.996Z.
* Final value: **250**, matching 25 read-write servers multiplied by 10 increments each.

Full-run timing:

* Measurement boundary: server 5002 turn 1 log at 2026-10-13T23:16:33.183Z to server 5001 Completed 10 turns at 2026-10-13T23:33:19.996Z.
* Duration: **1006.813 seconds = 16 minutes 46.813 seconds**.
* The 1000 required sleeps account for 1000 seconds. The remaining **6.813 seconds** is an average of **6.813ms per turn** for socket work, scheduling, logging and timer variation.
* The initial one-second wait before the first token release is outside this measurement boundary.

Post-completion error:

```text
2026-10-13T23:33:23.557Z | Server 5099 | Error consuming token: connect EADDRNOTAVAIL 127.0.0.1:5100 - Local (0.0.0.0:0)
```

This error occurs 3.561 seconds after every server has completed its required ten turns. It does not invalidate the completed result. It confirms the known termination problem: completed servers still pass TOKEN immediately, creating rapid new socket connections until the local system runs out of available addresses.

Use the successful 100-server result as functional evidence. Also state in the limitations that a clean end-of-run protocol is still needed.

### Algorithm 1 - 100/75 - New Run, Partial Capture

Source: 1bbd1aa2-628e-4aac-8118-6d712e4353e5/pasted-text.txt.

* Configuration: 100 servers, 75 read-write, 25 read-only, Algorithm 1.
* All 100 expected unique ports started: 75 writers and 25 readers.
* The supplied sequence contains 107 consecutive turn summaries, from server 5002 turn 1 through server 5008 turn 2.
* The first rotation completed correctly: server 5001 read 74 and wrote value 75.
* Server 5002 began turn 2 by reading 75 and writing 76.
* First rotation duration, measured from server 5002 turn 1 to turn 2: **101.290 seconds**.
* This is 0.082 seconds slower than the 100/25 Algorithm 1 first rotation (101.208 seconds). One run is not enough to treat this as a meaningful performance difference.
* No errors or value inconsistencies appear in the supplied excerpt.
* Expected final value after ten turns: 750.

Logging note:

The command used was:

```text
node menu.js 2>&1 | tee run-100/75/1.log
```

It did not create a file because `run-100/75/` does not exist. The terminal explicitly reported `tee: run-100/75/1.log: No such file or directory`.

For a future full capture, create the directory before starting the run:

```bash
mkdir -p run-100/75
node menu.js 2>&1 | tee run-100/75/1.log
```

The current run cannot begin writing to that path retroactively; the failed tee process has to be restarted after the directory exists. The attachment has been saved separately in [the Algorithm 1 100/75 log](logs/algorithm1-100-75.log).

### Algorithm 1 - 100/75 - Five Complete Rotations

Continuation from 5fe7a66e-fd58-49f4-bb22-7c54d4815a56/pasted-text.txt.

* Added 411 non-duplicate timestamp records to [the Algorithm 1 100/75 log](logs/algorithm1-100-75.log).
* The log now contains 518 consecutive turn summaries: all 100 servers completed turns 1 through 5, followed by 18 turn-6 summaries through server 5019.
* No errors, skipped servers or incorrect counter values appear.
* The current value is 393 at server 5019 in turn 6.
* The expected final value remains 750; 482 turns remain in the configured ten-turn run.

| Rotation | Duration (s) |
| --- | ---: |
| 1 | 101.290 |
| 2 | 100.713 |
| 3 | 100.684 |
| 4 | 100.593 |
| 5 | 100.659 |

* Mean duration across five complete rotations: **100.788 seconds**.
* The result is almost identical to the 100/25 run's five-rotation mean of 100.792 seconds. With the mandatory sleep after every token turn, changing the read-write/read-only mix has little effect on full-ring duration for Algorithm 1.

This is still a partial capture because the tee destination did not exist. The pasted output is retained in the project log.

### Algorithm 1 - 100/75 - Near Final Completion

Continuation from 57d7b796-263c-46dc-8cb8-78395eb89022/pasted-text.txt.

* Added 511 non-duplicate timestamped records to [the Algorithm 1 100/75 log](logs/algorithm1-100-75.log), including completed-turn messages.
* Nine rotations are complete; turn 10 has reached writer 5066.
* Current state: server 5066, read 739, value 740, at 2026-10-13T23:52:21.314Z.
* Writers 5002 through 5065 have logged completion after their tenth turns.
* The 965 recorded turn summaries remain consecutive and correct, with no errors.
* 35 turns remain: writers 5067 through 5075 produce 741 through 749, readers 5076 through 5100 retain 749, then server 5001 should produce 750.

The final evidence needed is:

```text
Server 5001 | ReadWrite | Turn 10 | Read 749 | Value 750
Server 5001 | Completed 10 turns
```
