const util = require('util')
const execSync = require('child_process').exec
const exec = util.promisify(execSync)
const path = require('path')
const messages = require('./utils/messages.js')
const commands = require('./utils/commands')

exports.pm2Run = async (COMMAND) => {
    return await exec(`${COMMAND}`, {
        cwd: path.join(__dirname, '../../')
    })
}

async function getProcessList() {
    const { stdout } = await exec(commands.TASKLIST)
    const processes = stdout.split('\r\n').map((line) => {
        const cols = line.replace(/"([^"]+)"/g, (_, g1) => g1).split(',')
        return {
            imageName: cols[0],
            pid: parseInt(cols[1], 10),
            sessionName: cols[2],
            sessionNumber: parseInt(cols[3], 10),
            memUsage: cols[4],
        }
    })
    processes.pop()
    return processes
}

exports.restartPM2 = async () => {

    try {
        const { stdout } = await this.pm2Run(commands.PM2_JLIST)
        const pm2list = JSON.parse(JSON.stringify(stdout))
        console.log(messages.KILL_PM2)
        await this.pm2Run(commands.PM2_KILL)

        console.log(messages.CHECK_PROCESS_LIST)
        const processlist  = await getProcessList()

        for (const pm of pm2list) {
            const hangingProcess = processlist.find(service => service.pid === pm.pid)
            if (hangingProcess) {
                await exec(commands.TASKKILL(hangingProcess.pid))
            }
        }

        await this.pm2Run(commands.PM2_START)
        console.log(messages.PM2_PROCESS_START)


    } catch (error) {
        console.error(messages.PM2_RESTART_ERROR, error)
    }
}