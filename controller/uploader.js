const fs = require('fs');
const path = require('path');
const B2 = require('backblaze-b2');
const dotenv=require('dotenv')
dotenv.config()


const b2 = new B2({
  applicationKeyId: process.env.KEY_ID,      // from B2
  applicationKey: process.env.APPLICATION_KEY // from B2
});

async function upload(fileData,fileName) {
  try {
    // Authorize
    await b2.authorize();

    // Get the upload URL
    const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({ bucketId: process.env.BUCKET_ID });

    // Read PDF file
    // const fileName = path.basename(filePath);
    // const fileData = fs.readFileSync(filePath);
    // const fileStat = fs.statSync(filePath);

    //file info:

    
    const fileStat = fileData.length

    // Upload the file
    const response = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName,
      data: fileData,
      contentLength: fileStat, //size
      mime: 'application/pdf'
    });

    console.log('✅ PDF uploaded successfully:', response.data.fileName);
    console.log('✅ PDF uploaded successfully:', response.data.fileId);
  } catch (error) {
    console.error('❌ Error uploading PDF:', error.message || error);
  }
}


// // Example usage
// uploadPDF('../output2.pdf', 'oneclickresume96671');


module.exports={upload}