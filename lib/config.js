const fs = require('fs')
const path = require('path')

const base = process.cwd()

/**
 * @return {{dockerBuildContext: string, shell: string, mountPoint: string}}
 */
module.exports = (() => {
    let config = {}
    if (fs.existsSync(path.join(base, 'composer.config.js'))) {
        config = require(path.join(base, 'composer.config.js'))
    }

    if (typeof config.dockerBuildContext === 'undefined' || config.dockerBuildContext === '') {
        config.dockerBuildContext = 'docker/composer'
    }

    if (typeof config.shell === 'undefined' || config.shell === '') {
        config.shell = 'sh'
    }

    if (typeof config.mountPoint === 'undefined' || config.mountPoint === '') {
        config.mountPoint = '/app'
    } else if (!config.mountPoint.startsWith('/')) {
        throw new Error(`Invalid mount point "${config.mountPoint}". Mount must start with "/".`)
    }

    return config
})()
