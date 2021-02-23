## Configuration
For configuring the behavior of `ComposerJS` you can place a `composer.config.js` file
in your project root. That must export a configuration object.

```js
module.exports = {
    // Defaults to `docker/composer`
    dockerBuildContext: 'docker/images/composer',
    // Defaults to `sh`, e.g. when using Debian based images
    shell: 'bash',
    // Defaults to `/app`, must begin with a `/`, remeber to set the correct `WORKDIR` in the `Dockerfile`
    mountPoint: '/build'
}
```
