#!/bin/sh

root_dir=$(realpath "$(dirname "$0")")
new_uid=$(stat -c %u "$root_dir")
new_gid=$(stat -c %g "$root_dir")

exec docker run --rm -it \
     -u "${new_uid}:${new_gid}" \
     -v "${root_dir}":/src \
     -e HUGO_CACHEDIR=/src/.hugo_cache \
     -p 1313:1313 klakegg/hugo:ext-alpine \
     "$@"
