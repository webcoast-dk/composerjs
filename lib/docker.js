const fs = require('fs')
const os = require('os')
const path = require('path')
const { getProjectName } = require('./util')
const { getConfigDir, getCacheDir } = require('./composer')

module.exports = {
    getImageName: () => {
        return getProjectName() + '/composer'
    },

    getVolumes: (mount = null, mountSshAgent = false) => {
        const base = process.cwd()
        const volumes = [
            `-v "${mount ? path.join(base, mount) : base}:/project"`,
            `-v "${getConfigDir()}:/home/composer/.composer"`,
            `-v "${getCacheDir()}:/home/composer/.composer/cache"`
        ]

        const sshDir = path.join(os.userInfo().homedir, '.ssh')
        if (fs.existsSync(sshDir) && fs.statSync(sshDir).isDirectory()) {
            volumes.push(`-v "${sshDir}:/home/composer/.ssh"`)
        }

        if (mountSshAgent && os.platform() === 'linux' && process.env.SSH_AUTH_SOCK) {
            volumes.push(`-v "${process.env.SSH_AUTH_SOCK}:${process.env.SSH_AUTH_SOCK}"`)
        }

        return volumes
    },

    getEnvironment: (mountSshAgent = false) => {
        const env = []
        if (mountSshAgent && os.platform() === 'linux' && process.env.SSH_AUTH_SOCK) {
            env.push(`-e SSH_AUTH_SOCK=${process.env.SSH_AUTH_SOCK}`)
        }

        return env
    }
}
