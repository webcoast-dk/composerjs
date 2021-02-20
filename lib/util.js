const path = require('path')
const args = require('command-line-args')

module.exports = {
    getProjectName: () => {
        const re = new RegExp(/[^a-zA-z0-9\-]/, 'g')
        const reCleanup = new RegExp(/_+/, 'g')

        return path.basename(process.cwd()).replace(re, '_').replace(reCleanup, '_')
    },
    /**
     * @return {{verbose: ?Boolean, 'no-cache': ?Boolean, pull: ?Boolean, mount: ?String, command: String, arguments: String[]}}
     */
    processArguments: () => {
        const argv = args([
            {
                name: 'verbose',
                alias: 'v',
                type: Boolean,
            },
            {
                name: 'no-cache',
                type: Boolean
            },
            {
                name: 'pull',
                type: Boolean
            },
            {
                name: 'mount',
                type: String
            }
        ], {partial: true})

        if (argv._unknown instanceof Array && argv._unknown.length > 0){
            /** @type {Array} */
            const arguments = argv._unknown
            argv.command = arguments.pop()
            argv.arguments = arguments
            delete argv._unknown
        }

        return argv
    }
}
