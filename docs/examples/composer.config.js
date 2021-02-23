module.exports = {
    // Defaults to `docker/composer`
    dockerBuildContext: 'docker/images/composer',
    // Defaults to `sh`, e.g. when using Debian based images
    shell: 'bash',
    // Defaults to `/app`, must begin with a `/`, remeber to set the correct `WORKDIR` in the `Dockerfile`
    mountPoint: '/build'
}
