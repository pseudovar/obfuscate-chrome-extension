#! /bin/sh

OUTPUT_DIR=build

# update overrides
# cd option
# yarn rewire-config
# cd ../popup
# yarn rewire-config
# cd content_scripts/app
# yarn rewire-config
# cd ../..

# cleanup
echo "(1/5) Preparing..."
rm -rf $OUTPUT_DIR
mkdir $OUTPUT_DIR

# add meta files
cp manifest.json $OUTPUT_DIR/manifest.json
cp -R icons $OUTPUT_DIR/icons

# build popup
echo "(3/5) Building popup page..."
cd popup || exit
yarn build
cp build/index.html ../$OUTPUT_DIR/popup.html
cp build/popup-main.js ../$OUTPUT_DIR/popup-main.js
cd ..

# build worker
echo "(4/5) Building worker scripts..."
tsc worker/background.ts --outDir $OUTPUT_DIR

# build content
echo "(5/5) Building content scripts..."
sass --no-source-map content_scripts/obfuscate.scss content_scripts/obfuscate.css
cd content_scripts || exit
cp obfuscate.css ../$OUTPUT_DIR/obfuscate.css
cd ../

echo "Done."