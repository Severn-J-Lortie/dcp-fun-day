const express = require('express');
const path = require('node:path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
/**
 * 
 * workers = [
 *    id: {
 *        jobs: {id: { name, numSlices }, ...}, 
 *        state: 'working', 'fetching', 'submitting',
 *    },
 * ]
 * 
 */
const workers = {};

const workerTemplate = {
  jobs: {},
  state: 'working'
};

const port = 8080;

app.use(express.static('../frontend'));
io.on('connection', (socket) => {

  /**
   * data = {
   *    id
   * }
   * 
   */
  socket.on('newWorker', (data) => {
    console.log('got new worker')
    const newWorker = { ...workerTemplate };
    workers[data.id] = newWorker;
    socket.broadcast.emit('sync', workers);
  });

  /**
   * data = {
   *    id
   * }
   */
  socket.on('beforeFetch', (data) => {
    workers[data.id].state = 'fetching';
    socket.broadcast.emit('sync', workers);
  });

  /**
   * data = {
   *    id,
   *    jobs: {
   *      id: {
   *         name,
   *         numSlices
   *      }
   *    }
   * }
   */
  socket.on('fetch', (data) => {
    for (const jobId in data.jobs)
    {
      console.log(jobId)
      workers[data.id].jobs[jobId] = data.jobs[jobId];
    }
    workers[data.id].state = 'working';
    console.log(workers);
    socket.broadcast.emit('sync', workers);
  });

  /**
   * data = {
   *    id
   */
  socket.on('beforeResult', (data) => {
    workers[data.id].state = 'submitting';
    socket.broadcast.emit('sync', workers);
  });

  /**
   * data = {
   *    id
   */
  socket.on('result', (data) => {
    workers[data.id].state = 'working';
    socket.broadcast.emit('sync', workers);
  });
});

server.listen(port);
