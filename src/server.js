import express from 'express';
import morgan from 'morgan';
import routes from './express-routes';
import log from './logger';
import { PORT, NODE_ENV } from './config';

const app = express();

// configure logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev', {
    stream: log.stream
  }));
} else {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: log.stream
  }));
}

app.use(routes);

// error handler
app.use((err, req, res) => {
  res.status(err.status || 500);
  if (err.status < 500) {
    log.warn('%s %d %s', req.method, res.statusCode, err.message);
  } else {
    log.error('%s %d %s', req.method, res.statusCode, err.message);
  }
  res.json({
    message: err.message
  });
});

app.listen(PORT, err => err ?
  log.error(err) :
  log.info(`Navigate to http://localhost:${PORT}`)
);
