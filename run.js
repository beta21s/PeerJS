const fs = require('fs');
var key = fs.readFileSync(__dirname + '/ssl/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/ssl/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

const express = require("express");
const app = express();
const server = require("https").Server(options, app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

io.on('connection', function (socket) {
  socket.use(async (packet, next) => {
      socket.broadcast.emit(packet[0], packet[1]);
  });
});

server.listen(443);
