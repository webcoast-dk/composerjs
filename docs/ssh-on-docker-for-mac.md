## Using SSH on Docker for Mac
Unfortunately mounting sockets into containers does not work with Docker for Mac, but you can still use SSH.
You need to start the SSH authentication agent in the container and add your identities to the agent. Because
container is removed after the command exists, this has to be done for each an every run.

You can automate it, with a an entry point script. You can e.g. use the following shell script to start the agent
and add the default identities like `id_rsa`, `id_ed25519`, et al.

```sh
#!/bin/sh

if [ -z $SSH_AUTH_SOCK ]; then
    eval $(ssh-agent) > /dev/null
    ssh-add > /dev/null
fi

exec "$@"
```
When running on Linux with an SSH_AUTH_SOCk mounted, this would not be executed.

Use the entry point script in your `Dockerfile` with the following snippet.
```Dockerfile
COPY docker-composer-entrypoint.sh /usr/local/bin/docker-composer-entrypoint
RUN chmod +x /usr/local/bin/docker-composer-entrypoint

ENTRYPOINT ["docker-composer-entrypoint"]
```
When you're using password-protected private keys (as you should), you have to type your passphrase every time
you run a command.
