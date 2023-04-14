exports.PM2_KILL = 'pm2 kill'

exports.PM2_START = 'pm2 start --env local'

exports.TASKLIST = 'tasklist /FO csv'

exports.TASKKILL = (pid) => `taskkill /PID ' + "${pid}" + ' /f`

exports.PM2_JLIST = 'pm2 jlist'