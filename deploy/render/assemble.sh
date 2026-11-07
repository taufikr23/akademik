#!/bin/sh
set -eu
# Build from the existing service sources into an empty staging directory.
dest=${1:?Supply an empty build directory}
mkdir -p "$dest"
[ -z "$(ls -A "$dest")" ] || { echo "Build directory must be empty"; exit 1; }
cp backend/auth-service/pom.xml "$dest/"
mkdir -p "$dest/src/main"
cp -R backend/auth-service/src/main/java backend/auth-service/src/main/resources "$dest/src/main/"
for service in academic student schedule attendance assignment grade; do
  for domain in backend/"$service"-service/src/main/java/com/taufik/*; do
    target="$dest/src/main/java/com/taufik/$(basename "$domain")"
    mkdir -p "$target"
    for sub in controller dto exception model repository service; do
      cp -R "$domain/$sub" "$target/"
    done
  done
done
cp deploy/render/application-render.properties deploy/render/schema-files.sql "$dest/src/main/resources/"
