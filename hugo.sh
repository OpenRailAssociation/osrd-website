#!/bin/sh

case "$(uname -s)" in
    Darwin*) stat_flag=-f;;
    *) stat_flag=-c;;
esac

root_dir=$(realpath "$(dirname "$0")")
new_uid=$(stat $stat_flag %u "$root_dir")
new_gid=$(stat $stat_flag %g "$root_dir")

exec docker run --rm -it \
     -u "${new_uid}:${new_gid}" \
     -v "${root_dir}":/src \
     -e HUGO_CACHEDIR=/src/.hugo_cache \
     --entrypoint hugo \
     -p 1313:1313 hugomods/hugo:exts \
     "$@"
