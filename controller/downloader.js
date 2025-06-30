const B2 = require('backblaze-b2');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const b2 = new B2({
  applicationKeyId: process.env.KEY_ID,
  applicationKey: process.env.APPLICATION_KEY,
});

/**
 * Fetch and stream a private file by file ID
 * Use this in your Express route to pipe data to the browser
 */
async function downloadPrivateFileById(fileId, res) {
  try { 
    await b2.authorize();

    // Get the proper download URL
    const baseDownloadUrl = b2.downloadUrl; // e.g., https://f123.backblazeb2.com
    const fileDownloadUrl = `${baseDownloadUrl}/b2api/v3/b2_download_file_by_id?fileId=${fileId}`;

    // Stream the file to the client
    const fileResponse = await axios.get(fileDownloadUrl, {
      headers: {
        Authorization: b2.authorizationToken
      },
      responseType: 'stream'
    });

    // Set headers and pipe
    res.setHeader('Content-Disposition', 'attachment');
    fileResponse.data.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to download file' });
  }
}

module.exports={downloadPrivateFileById}