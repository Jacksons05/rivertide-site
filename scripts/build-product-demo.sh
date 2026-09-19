#!/usr/bin/env bash
set -euo pipefail

assets="dist/assets/product-demo"
out="/private/tmp/rivertide-demo-render"
mkdir -p "$out"

render_segment() {
  image="$1"
  nav_x="$2"
  nav_y="$3"
  target_x="$4"
  target_y="$5"
  output="$6"
  cursor_x="if(lt(t,1.2),${nav_x},if(lt(t,3.0),${nav_x}+(${target_x}-${nav_x})*(t-1.2)/1.8,${target_x}))"
  cursor_y="if(lt(t,1.2),${nav_y},if(lt(t,3.0),${nav_y}+(${target_y}-${nav_y})*(t-1.2)/1.8,${target_y}))"
  ffmpeg -y -loglevel error -framerate 30 -loop 1 -t 4 -i "$assets/$image" -framerate 30 -loop 1 -t 4 -i "$assets/cursor.png" -framerate 30 -loop 1 -t 4 -i "$assets/click.png" \
    -filter_complex "[0:v]scale=1600:1000,setsar=1,pad=1920:1080:160:40:color=#071012,format=yuv420p[base];[1:v]colorkey=0xffffff:0.01:0,format=rgba,setsar=1[cursor];[2:v]colorkey=0xffffff:0.01:0,format=rgba,setsar=1[click];[base][cursor]overlay=x='${cursor_x}':y='${cursor_y}'[pointer];[pointer][click]overlay=x='${cursor_x}-28':y='${cursor_y}-28':enable='between(t,.35,.68)+between(t,3.0,3.34)',format=yuv420p" \
    -r 30 -t 4 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p "$out/$output"
}

render_segment "01-home.png" 184 205 480 288 "01.mp4"
render_segment "02-purchase.png" 184 262 565 352 "02.mp4"
render_segment "03-upcoming.png" 184 318 980 390 "03.mp4"
render_segment "04-savings.png" 184 373 1120 650 "04.mp4"
render_segment "05-settings.png" 184 430 1080 300 "05.mp4"

printf "file '%s/01.mp4'\nfile '%s/02.mp4'\nfile '%s/03.mp4'\nfile '%s/04.mp4'\nfile '%s/05.mp4'\n" "$out" "$out" "$out" "$out" "$out" > "$out/concat.txt"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$out/concat.txt" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -an dist/assets/rivertide-product-demo.mp4
ffmpeg -y -loglevel error -i dist/assets/rivertide-product-demo.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -an dist/assets/rivertide-product-demo.webm
ffmpeg -y -loglevel error -ss 00:00:02 -i dist/assets/rivertide-product-demo.mp4 -frames:v 1 -q:v 2 dist/assets/rivertide-product-demo-poster.jpg
