import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
const app = express()
require('dotenv').config()


import apis from './config/routes'
import middlewares from './middlewares';
import cache from 'memory-cache';

app.use(bodyParser.json());
app.use(cors())

app.use(apis)
app.use(middlewares.allErrorHandler)

app.listen(3000, () => {
    cache.put('isMeetingRunning', false);
    cache.put('attendeesLangMap', {});
    console.log('Server is running on port 3000')
})