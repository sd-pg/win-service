const express = require('express')
const cors = require('cors')
const Result = require('../utils/result')
const pmService = require('./pmService')
const configureShutdown = require('../config/shutdownConfig')

const config = {
    port: 6000,
    host: 'localhost'
}

const pm2WindowsService = express()

pm2WindowsService.set('port', config.port)
pm2WindowsService.set('host', config.host)

pm2WindowsService.use(cors())

pm2WindowsService.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', '*')

    next()
})

pm2WindowsService.get('/restart', async (req, res, next) => {
    try {
        await pmService.restartPM2()
        res.status(200).send(new Result())
    } catch (error) {
        res.status(500).send(new Result().setServerError())
    }
})

const pmServiceApp = pm2WindowsService.listen(pm2WindowsService.get('port'), pm2WindowsService.get('host'), () => {
    console.log('PM2 service has started')
})


configureShutdown(pmServiceApp)
