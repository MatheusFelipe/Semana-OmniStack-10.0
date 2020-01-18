const socketio = require('socket.io');

const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebSocket = server => {
  io = socketio(server);

  io.on('connection', socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: { latitude: Number(latitude), longitude: Number(longitude) },
      techs: parseStringAsArray(techs),
    });
  });
};

exports.findNearConnections = coordinates =>
  connections.filter(conn => calculateDistance(coordinates, conn.coordinates) < 10);

exports.findNearConnectionsByTechs = (coordinates, techs) =>
  connections.filter(
    connection =>
      calculateDistance(coordinates, connection.coordinates) < 10 &&
      techs.some(tech => connection.techs.map(item => item.toLowerCase()).includes(tech.toLowerCase()))
  );

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};
