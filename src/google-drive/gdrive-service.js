import { uploadStatus } from '../main';

const CLIENT_ID = '489039392520-lb206rsmn1vtmc4ilio87gsa6ei32m9o.apps.googleusercontent.com';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const FOLDER_NAME = 'Timetracker-App';
const FILE_NAME = 'timetracker-data.json';

let tokenClient;
let folderID = null;
let fileID = null;

async function initGoogleDrive() {
  try {
    console.log('Starting Google Drive initialization');

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      callback: '', // Will be defined later
    });

    // Load and init the Google API client
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = async () => {
        try {
          await new Promise((res) => gapi.load('client', res));
          await gapi.client.init({});
          await gapi.client.load('drive', 'v3');
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    console.log('Google Drive initialized successfully');
  } catch (error) {
    console.error('Detailed initialization error:', error);
    throw error;
  }
}

let accessToken = null;
let tokenExpiry = null;

async function authenticate() {
  // If we have a valid token, use it
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      tokenClient.callback = async (response) => {
        if (response.error !== undefined) {
          reject(response);
          return;
        }
        // Store the token and expiry
        accessToken = response.access_token;
        tokenExpiry = Date.now() + response.expires_in * 1000;
        await gapi.client.setToken(response);
        resolve(response);
      };

      // Use prompt: 'none' for silent token refresh
      tokenClient.requestAccessToken({ prompt: 'none' });
    } catch (err) {
      // If silent refresh fails, then request with consent prompt
      tokenClient.requestAccessToken({ prompt: 'consent' });
      reject(err);
    }
  });
}

async function ensureValidToken() {
  if (!accessToken || !tokenExpiry || Date.now() >= tokenExpiry - 60000) {
    await authenticate();
  }
}

function waitForGapi() {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve();
    } else {
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout waiting for gapi'));
      }, 10000); // 10 second timeout

      window.addEventListener('load', () => {
        clearTimeout(timeoutId);
        if (window.gapi) {
          resolve();
        } else {
          reject(new Error('gapi not loaded'));
        }
      });
    }
  });
}

async function findOrCreateFolder() {
  if (folderID) return folderID;

  // Search for existing folder
  const response = await gapi.client.drive.files.list({
    q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'`,
    fields: 'files(id, name)',
  });

  if (response.result.files.length > 0) {
    folderID = response.result.files[0].id;
    return folderID;
  }

  // Create new folder if none exists
  const fileMetadata = {
    name: FOLDER_NAME,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const folder = await gapi.client.drive.files.create({
    resource: fileMetadata,
    fields: 'id',
  });

  folderID = folder.result.id;
  return folderID;
}

async function findOrCreateFile(folderId) {
  if (fileID) return fileID;

  // Search for existing file
  const response = await gapi.client.drive.files.list({
    q: `name='${FILE_NAME}' and '${folderId}' in parents`,
    fields: 'files(id, name)',
  });

  if (response.result.files.length > 0) {
    fileID = response.result.files[0].id;
    return fileID;
  }

  // Create new file if none exists
  const fileMetadata = {
    name: FILE_NAME,
    parents: [folderId],
    mimeType: 'application/json',
  };

  const file = await gapi.client.drive.files.create({
    resource: fileMetadata,
    fields: 'id',
  });

  fileID = file.result.id;
  return fileID;
}

async function saveToGDrive(data) {
  try {
    await ensureValidToken();
    uploadStatus.showCloudUploadImg();
    await authenticate();
    const folderId = await findOrCreateFolder();
    const fileId = await findOrCreateFile(folderId);

    // Update file content
    await gapi.client.request({
      path: `/upload/drive/v3/files/${fileId}`,
      method: 'PATCH',
      params: {
        uploadType: 'media',
      },
      body: JSON.stringify(data),
    });
    uploadStatus.showCloudUploadFinishedimg();
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
}

async function loadFromGDrive() {
  try {
    await ensureValidToken();
    await authenticate();
    const folderId = await findOrCreateFolder();
    const fileId = await findOrCreateFile(folderId);

    // Get file content
    const response = await gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media',
    });

    return response.result;
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

// Initialize when the app starts

async function initializeDriveStorage() {
  try {
    await initGoogleDrive();
    console.log('Google Drive initialized');
  } catch (error) {
    console.error('Error initializing Google Drive:', error);
  }
}

export { initializeDriveStorage, saveToGDrive, loadFromGDrive };
