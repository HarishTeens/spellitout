import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
const app = express()
require('dotenv').config()


app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}))
import socketServer from './service/socketServer'
import { Server } from 'socket.io'
import http from 'http'
import https from 'https'
import fs from 'fs'

export let io;
if (process.env.NODE_ENV === 'production') {
    var options = {
        key: fs.readFileSync('/etc/letsencrypt/live/spellitout.thedevelopers.agency/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/spellitout.thedevelopers.agency/fullchain.pem')
    };
    const server = https.createServer(options, app)
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
} else {
    const server = http.createServer(app)
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
}

io.on("connection", socketServer);

import apis from './config/routes'
import middlewares from './middlewares';
import cache from 'memory-cache';

app.use(bodyParser.json());

app.use(apis)
app.use(middlewares.allErrorHandler)

server.listen(4000, () => {
    cache.put('isMeetingRunning', false);
    cache.put('attendeesLangMap', {});
    console.log('Server is running on port 4000')
})