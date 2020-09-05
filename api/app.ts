#!/usr/bin/env node

import * as express from 'express';
import * as dotenv from 'dotenv';
import * as http from 'http';
import * as path from 'path';
import * as passport from 'passport';
import * as morgan from 'morgan';
import * as debug from 'debug';

// Configurations
import setDb from './db';
import './configuration/passport';
import setRoutes, * as routes from './routes/routes';

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Morgan
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Passport.js
app.use(passport.initialize());

// Static files
app.use(express.static(path.join(__dirname, '../dist/client/')));

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const onError = error => {
  const address = server.address();

  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  debug('Listening on ' + bind);
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);

async function init(): Promise<any> {
  try {
    await setDb();
    setRoutes(app);

    app.get('/*', (req, res) => {
      res.send(path.join(__dirname, '../dist/client/index.html'));
    });

    server.listen(port);
  } catch (err) {
    console.error(err);
  }
}

init();

export { app };
