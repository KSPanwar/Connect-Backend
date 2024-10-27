import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';

// Initialize OAuth client with credentials
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI
);

// Set access token for authenticated user
oauth2Client.setCredentials({
  access_token: 
});

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export async function uploadVideo(filePath: string, title: string, description: string) {
  console.log('i am here to uploads')
  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: title,
        description: description,
        tags: ['sample', 'video', 'upload'],
        categoryId: '22', // Category ID for 'People & Blogs' (change as needed)
      },
      status: {
        privacyStatus: 'public', // Options: 'public', 'unlisted', 'private'
      },
    },
    media: {
      body: fs.createReadStream(filePath),
    },
  });

  console.log(`Video uploaded with ID: ${res.data.id}`);
}

