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
    const apkFileLocation = `${ctx.opts.projectRoot}/platforms/android/app/build/outputs/apk/debug/app-debug.apk`;

    const auth = new google.auth.JWT(
        credentials.client_email, null,
        credentials.private_key, scopes
    );
    const drive = google.drive({ version: "v3", auth });

    var folderId = '1UT2ojQxLieujUK5cBrUdEMv7qLHdgXva';

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
        }
    });

    // return stat(apkFileLocation).then(stats => {
    //     console.log(`Size of ${apkFileLocation} is ${stats.size} bytes`);
    // });
};



/*drive.files.list({}, (err, res) => {
  if (err) throw err;
  const files = res.data.files;
  if (files.length) {
  files.map((file) => {
    console.log(file);
  });
  } else {
    console.log('No files found');
  }
});*/