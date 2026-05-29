const http = require("http");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");

const root = __dirname;
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml; charset=utf-8"
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(data);
  });
});

const io = new Server(server);
const players = {};

io.on("connection", (socket) => {
  socket.on("player:join", (player) => {
    players[socket.id] = {
      id: socket.id,
      name: player.name || "Joueur",
      area: player.area || "outside",
      mapKey: player.mapKey || "outside",
      x: player.x || 0,
      y: player.y || 0,
      skin: player.skin || 0,
      classKey: player.classKey || null
    };

    socket.emit("players:init", players);
    socket.broadcast.emit("player:joined", players[socket.id]);
  });

  socket.on("player:update", (player) => {
    if (!players[socket.id]) return;

    players[socket.id] = {
      ...players[socket.id],
      name: player.name || players[socket.id].name,
      area: player.area || players[socket.id].area,
      mapKey: player.mapKey || players[socket.id].mapKey,
      x: player.x,
      y: player.y,
      skin: player.skin || 0,
      classKey: player.classKey || null
    };

    socket.broadcast.emit("player:updated", players[socket.id]);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    socket.broadcast.emit("player:left", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Royaumes d'Aldoria: http://localhost:${port}`);
});
