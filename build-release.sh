#!/bin/bash
echo '######### BUILDING, SIGNING AND UPLOADING THE APP #################'
echo ""
echo "DID YOU UPDATE THE APP VERSION?"
echo "TYPE 1 OR 2"

# Operating system names are used here as a data source
select answer in YES NO
do

case $answer in
# YES SELECTED
"YES")
rm platforms/android/app/build/outputs/apk/release/*
echo ""
# Prompt for password
read -s -p "Enter Keystore Password: " password
cordova build android --release -- --keystore=./covid19-release-key.keystore --storePassword=$password --alias=covid19-release-key --password=$password
echo "YOU SELECTED $answer."
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