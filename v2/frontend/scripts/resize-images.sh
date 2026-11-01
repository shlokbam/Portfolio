#!/bin/zsh
# Smaller display copies of the photos shown on Community and Recognition, for srcset (lib/links.js sized()):
#   public/static/opt/<path>.webp -> public/static/opt/w480|w800|w1280/<path>.webp (never upscaled).
# The opt/ originals stay as they are for the enlarged view. Needs cwebp (brew install webp).
# Run after adding or replacing one of these images:  zsh scripts/resize-images.sh
set -e
cd "$(dirname "$0")/../public/static/opt"
for f in community/*.webp Patent/*.webp certificates/images/winning_screenshots/*.webp \
         certificates/images/official_posts/*.webp certificates/clubs/*.webp Arcade/arcade_dashboard.webp; do
  w=$(sips -g pixelWidth "$f" | awk 'NR==2{print $2}')
  for t in 480 800 1280; do
    out="w$t/$f"
    [[ -f "$out" && "$out" -nt "$f" ]] && continue
    mkdir -p "$(dirname "$out")"
    cwebp -quiet -q 78 -m 6 -resize $(( w < t ? w : t )) 0 "$f" -o "$out"
  done
done
echo "resized copies are up to date"
