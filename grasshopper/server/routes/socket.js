/*
 * Serve content over a socket
 */

module.exports = function (socket) {
  socket.emit('user', { id: 'actus@actus.kr' });

  socket.on('success login', function (data) {
    console.log(data);
  });

  socket.emit('send:name', {
    name: 'Bob'
  });

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);
};