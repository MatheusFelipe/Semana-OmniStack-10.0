import socketio from 'socket.io-client';

const socket = socketio('http://192.168.15.18:3333', {
  autoConnect: false,
});

const connect = ({ latitude, longitude, techs }) => {
  socket.io.opts.query = { latitude, longitude, techs };
  socket.connect();
};

const disconnect = () => {
  if (socket.connected) socket.disconnect();
};

const subscribeToNewDevs = subscribeFunction => {
  socket.on('new-dev', subscribeFunction);
};

const removeDev = removeFn => {
  socket.on('remove-dev', removeFn);
};

export default { connect, disconnect, subscribeToNewDevs, removeDev };
