const { spawnSync } = require('child_process')
const path = require('path')
const os = require('os')
const fs = require('fs')

module.exports = {
    getConfigDir: () => {
        const result = spawnSync('composer config -g data-dir', { shell: true })
        let configDir
        if (result.status === 0) {
            configDir = result.stdout.toString().trim()
        } else {
            configDir = path.join(os.userInfo().homedir, '.composer')
        }

        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true, mode: 0o755 })
        }

        return configDir
    },

    getCacheDir: () => {
        const result = spawnSync('composer config -g cache-dir', { shell: true })
        let cacheDir = null
        if (result.status === 0) {
            cacheDir = result.stdout.toString().trim()
        } else {
            cacheDir = path.join(os.userInfo().homedir, '.composer', 'cache')
        }

        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true, mode: 0o755 })
        }

        return cacheDir
    }
}
