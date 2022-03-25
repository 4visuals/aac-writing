#!/usr/bin/env bash
DST_ROOT="/Users/chminseo/workspace/ws-boot/aac-dictation/src/main/resources"
PREFIX=$(date +"%Y%m%d_%I%M%S")
mv $DST_ROOT/templates $DST_ROOT/templates_$PREFIX
mv $DST_ROOT/static $DST_ROOT/static_$PREFIX

mkdir $DST_ROOT/templates
mkdir $DST_ROOT/static

# HTML
# js, css, images
find dist/ -type f -name "*.html" -exec cp {} $DST_ROOT/templates \; \
  && cp dist/favicon.ico $DST_ROOT/static/ \
  && cp -R dist/js $DST_ROOT/static \
  && cp -R dist/css $DST_ROOT/static \
  && cp -R dist/img $DST_ROOT/static \
  && cp -R dist/media $DST_ROOT/static \
  && cp dist/*.js $DST_ROOT/static/ \
  && cp dist/manifest.json $DST_ROOT/static/ \
  && cp dist/robots.txt $DST_ROOT/static/

if [ $? -eq 0 ]; then
  rm -rf $DST_ROOT/templates_$PREFIX
  rm -rf $DST_ROOT/static_$PREFIX
  echo "DONE!"
else
  rm -rf $DST_ROOT/templates
  rm -rf $DST_ROOT/static
  mv $DST_ROOT/templates_$PREFIX $DST_ROOT/templates
  mv $DST_ROOT/static_$PREFIX $DST_ROOT/static
  echo "fail to copy resources. rollbacked"
fi
