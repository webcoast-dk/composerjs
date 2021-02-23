## Purpose
The idea behind running `composer` inside docker instead of on the local machine was to run the commands
in the same environment as your application would run in. This includes the correct PHP version with
the nececessary extensions.

Why? I experienced package updates from one minor version to another, where the newer version needed a higher
PHP version or extension. When running `composer update --ignore-platform-reqs`, `composer` would ignore
the used PHP version and extensions and update solely based on the requirements defined in the `composer.json`
file.
