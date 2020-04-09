#!/bin/bash
echo '######### BUILDING, SIGNING AND UPLOADING THE APP #################'
echo ""
echo "DID YOU UPDATE THE APP VERSION?"
echo "TYPE 1 OR 2"

# Checking if the user has updated the app version before continuing signing the app.
select answer in YES NO
do

case $answer in
# YES SELECTED
"YES")
echo "YOU SELECTED $answer."
rm platforms/android/app/build/outputs/apk/release/*
echo ""
# Prompt for password
read -s -p "Enter Keystore Password: " password
cordova build android --release -- --keystore=./covid19-release-key.keystore --storePassword=$password --alias=covid19-release-key --password=$password
# After build is success, the scripts/afterBuild.js is invoked by ionic after_Build hook mentioned in config.xml
# The genertaed signed build is uploaded to google drive.
break
;;
# NO SELECTED
"NO")
echo "YOU SELECTED $answer."
break
;;
# Matching with invalid data
*)
echo "Invalid entry."
break
;;
esac
done