import {Application, Express, NextFunction, Request, Response } from "express";
const express = require('express');
const fs = require('fs');
const app: Application = express();

const PORT = 5500;
const ROOT = 'C:\\Users\\Håkon\\Documents\\Programmering\\weather-app\\build';

enum logType {
  positive = "[\x1b[33m+\x1b[0m] ",
  negative = "[\x1b[31m-\x1b[0m] ",
  info = "[\x1b[36mi\x1b[0m] ",
}

const logger = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.socket.remoteAddress;
  console.log(logType.info + "Connection from " + ip);
  next();
}

app.use(logger);

app.get('/', (req: Request, res: Response) => {
  fs.readFile(ROOT + '/index.html', (err, data) => {
    if (err) throw err;
    res.end(data);
  })
});

app.get('/*.*', async(req: Request, res: Response) => {
  res.sendFile(ROOT + req.url);
})

app.get('/*', (req: Request, res: Response) => {
  res.redirect(301, '/');
})

app.listen(PORT, () => console.log(logType.positive + "Server listening on " + PORT));