#!/usr/bin/env node
const { spawnSync } = require('child_process')
const os = require('os')
const chalk = require('chalk')
const { getImageName, getVolumes, getEnvironment } = require('./lib/docker')
const {processArguments} = require('./lib/util')
const config = require('./lib/config')

let result = {
    status: 0
}
const processedArguments = processArguments()

if (processedArguments.command && processedArguments.command.length > 0) {
    switch (processedArguments.command) {
        case 'setup':
            const noCache = processedArguments['no-cache'] ? ' --no-cache' : ''
            const pull = processedArguments.pull ? ' --pull' : ''
            if (processedArguments.verbose) {
                result = spawnSync(`docker build ${config.dockerBuildPath}${noCache}${pull} --build-arg USER_ID=${os.userInfo().uid} -t ${getImageName()}`, { stdio: 'inherit', shell: true })
            } else {
                process.stdout.write(chalk.cyan('Building docker image... '))
                const buildProcess = result = spawnSync(`docker build ${config.dockerBuildPath}${noCache}${pull} --build-arg USER_ID=${os.userInfo().uid} -t ${getImageName()}`,
                    { shell: true })
                if (buildProcess.status !== 0) {
                    process.stdout.write(chalk.red('failed') + "\n")
                    console.error(buildProcess.stdout.toString())
                    console.error(buildProcess.stderr.toString())
                } else {
                    process.stdout.write(chalk.green('ok') + "\n")
                }
            }
            break
        case 'sh':
            result = spawnSync(`docker run --rm -${process.stdin.isTTY ? 't' : ''}i -u ${os.userInfo().uid} ${getVolumes(processedArguments.mount, true).join(' ')} ${getEnvironment(true).join(' ')} ${getImageName()} ${config.shell || 'sh'} ${processedArguments.arguments.length > 0 ? `-c "${processedArguments.arguments.join(' ')}"` : ''}`, { stdio: 'inherit', shell: true })
            break
        default:
            // Run composer command
            result = spawnSync(`docker run --rm -${process.stdin.isTTY ? 't' : ''}i -u ${os.userInfo().uid} ${getVolumes(processedArguments.mount, true).join(' ')} ${getEnvironment(true).join(' ')} ${getImageName()} ${config.shell || 'sh'} -c "composer ${processedArguments.command} ${processedArguments.arguments.join(' ')}"`, { stdio: 'inherit', shell: true })
            break
    }
} else {
    /**
     * @TODO: Provide help text
     */
    console.log('TODO: Provide help text')
}

process.exit(result.status)
