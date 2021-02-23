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
            const dockerArguments = ['build', config.dockerBuildContext]
            if (processedArguments['no-cache']) {
                dockerArguments.push('--no-cache')
            }
            if (processedArguments.pull) {
                dockerArguments.push('--pull')
            }
            dockerArguments.push('--build-arg', `USER_ID=${os.userInfo().uid}`)
            dockerArguments.push('--build-arg', `USER_NAME=${os.userInfo().username}`)
            dockerArguments.push('-t', getImageName())

            if (processedArguments.verbose) {
                result = spawnSync('docker', dockerArguments, { stdio: 'inherit', shell: true })
            } else {
                process.stdout.write(chalk.cyan('Building docker image... '))
                const buildProcess = result = spawnSync('docker', dockerArguments, { shell: true })
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
    console.log(`
${chalk.cyan('ComposerJS: Docker wrapper for Composer PHP Dependency Manager')}

${chalk.bold('Usage: composerjs [command] [arguments] [options]')}

${chalk.bold('Commands:')}
    ${chalk.yellow('setup')}                   Build the docker image for running composer
    ${chalk.yellow('sh')}                      Starting the container with a shell (default: sh)
    ${chalk.yellow('[composer command]')}      Any valid composer command like "install" or "update"
    
${chalk.bold('Arguments:')}
    Arguments to the command executed in the shell or arguments to the composer command.
    
${chalk.bold('Options:')}
    ${chalk.yellow('setup')}
            --no-cache  Use \`--no-cache\` for docker build
            --pull      Use \`--pull\` for docker build
        -v  --verbose   Enable verbose output during docker build
        
    ${chalk.yellow('All other commands')}
            --mount     The directory to mount onto the mount point (default: /app) in the container
            
    ${chalk.yellow('All other options are passed to the shell or composer command.')}
    
${chalk.bold(chalk.underline('Examples:'))}

${chalk.bold('Build composer docker image')}
    ${chalk.green('composerjs setup')}

${chalk.bold('Install dependencies from \`composer.lock\` file')}
    ${chalk.green('composerjs install')}

${chalk.bold('Update dependencies')}
    ${chalk.green('composerjs update')}

${chalk.bold('Update \`composer.lock\` file only')}
    ${chalk.green('composerjs update --lock')}

${chalk.bold('Add new dependency')}
    ${chalk.green('composerjs req my-vendor/my-package ^2.3.0')}
    `.trimLeft())
}

process.exit(result.status)
