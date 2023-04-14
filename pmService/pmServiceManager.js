const ProcessManager  = require('./processManager')
const { SERVICE_NAME, SERVICE_DESCRIPTION, SCRIPT_PATH } = require('./utils/constants')
const pmService = new ProcessManager(SERVICE_NAME, SERVICE_DESCRIPTION, SCRIPT_PATH)

pmService.runCommand()