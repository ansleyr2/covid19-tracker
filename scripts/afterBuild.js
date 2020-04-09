/**
 * Reference - https://medium.com/@bretcameron/how-to-use-the-google-drive-api-with-javascript-57a6cc9e5262
 * 
 */
const fs = require('fs');
const util = require('util');

const { google } = require('googleapis');
const credentials = require('./credentials.json');


const scopes = [
    'https://www.googleapis.com/auth/drive'
];

module.exports = function (ctx) {
    const path = `${ctx.opts.projectRoot}/scripts/credentials.json`;
    if (!ctx.opts.platforms.includes('android')) return;
    const apkFileLocation = `${ctx.opts.projectRoot}/platforms/android/app/build/outputs/apk/release/app-release.apk`;

    const auth = new google.auth.JWT(
        credentials.client_email, null,
        credentials.private_key, scopes
    );
    const drive = google.drive({ version: "v3", auth });

    drive.files.list({}, (err, res) => {
        if (err) throw err;
        const files = res.data.files;
        if (files.length) {
            files.map((file) => {
                // console.log(file);
                if (file.name === 'covid19-tracker.apk') {
                    // Delete file to avoid duplicacies
                    drive.files.delete({ fileId: file.id }, (err, res) => {
                        if (err) throw err;

                    })
                }
            });

            // Create file
            var folderId = '1HEPLHSY-Mzmu4Yz9ltSNHqRK6cR9WMMD';

            var fileMetadata = {
                'name': 'covid19-tracker.apk',
                parents: [folderId]
            };
            var media = {
                mimeType: 'application/vnd.android.package-archive',
                body: fs.createReadStream(apkFileLocation)
            };

            drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id'
            }, function (err, file) {
                if (err) {
                    // Handle error
                    console.error(err);
                } else {
                    console.log('File Id: ', file.id);
                    console.log("File upload  complete...");
                }
            });

        } else {
            console.log('No files found');
        }
    });
};