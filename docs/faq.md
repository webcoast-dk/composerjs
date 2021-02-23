## F.A.Q.
### What about the local composer cache?
ComposerJS automatically mounts the local composer configuration and cache folders into the users home directory
inside the container. That gives you access your local auth settings - e.g. GitHub Personal Access Token -
repository and package caches on your local machine. Working with `composer` is as fast as on the local machine.

### I need to use SSH for authentication
No need to worry. On Linux systems (including WSL) `ComposerJS` automatically mounts the SSH authentication
agent socket (SSH_AUTH_SOCK) - if available - into the container. Furthermore, the user's `.ssh` folder is mounted
read-only into the container user's `.ssh` folder, to give you access to the `known_hosts` file and the SSH client
configuration from your local machine.

Using Mac? Please read the in depth information on using [SSH with Docker for Mac](docs/ssh-on-docker-for-mac.md). 
