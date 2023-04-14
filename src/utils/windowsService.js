const { Service } = require('node-windows')
const messages = require('./messages')
const { WINDOWS_SERVICE_COMMAND } = require('./enum')

class WindowsService {
    constructor(name, description, script) {
        this.svc = new Service({
            name: name,
            description: description,
            script: script,
            nodeOptions: [
                '--harmony',
                '--max_old_space_size=4096'
            ]
        })
    }

     start() {
        this.svc.start()
        console.log(messages.WINDOWS_SERVICE_STARTED)
    }

     stop() {
        this.svc.stop()
        console.log(messages.WINDOWS_SERVICE_STOPPED)
    }

     install() {
        const self = this
        this.svc.on('install',  function () {
             self.start()
        })
        this.svc.install()
    }

     uninstall() {
        this.svc.on('uninstall', function () {
            console.log(messages.WINDOWS_SERVICE_UNINSTALL)
        })
        this.svc.uninstall()
    }

    runCommand() {
        const args = process.argv.slice(2)

        try {
            switch (args[0]) {
                case WINDOWS_SERVICE_COMMAND.install:
                    this.install()
                    break
                case WINDOWS_SERVICE_COMMAND.start:
                    this.start()
                    break
                case WINDOWS_SERVICE_COMMAND.stop:
                    this.stop()
                    break
                case WINDOWS_SERVICE_COMMAND.uninstall:
                    this.uninstall()
                    break
                default:
                    console.log(messages.WRONG_METHOD)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

}

module.exports = WindowsService