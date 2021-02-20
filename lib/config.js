const fs = require('fs')
const path = require('path')

const base = process.cwd()

/**
 * @return {{dockerBuildPath: string, shell: string}}
 */
module.exports = (() => {
    let config = {}
    if (fs.existsSync(path.join(base, 'composer.config.js'))) {
        config = require(path.join(base, 'composer.config.js'))
    }

    if (typeof config.dockerBuildPath === 'undefined' || config.dockerBuildPath === '') {
        config.dockerBuildPath = 'docker/composer'
    }
    if (typeof config.shell === 'undefined' || config.shell === '') {
        config.shell = 'sh'
    }

    return config
})()
