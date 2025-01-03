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
    await waitForGoogleAPI();

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      callback: '', // Will be defined in authenticate()
    });

    // Load and init the Google API client
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = async () => {
        try {
          await new Promise((res) => gapi.load('client', { callback: res }));
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

    // Try initial authentication
    await authenticate();

    console.log('Google Drive initialized successfully');
  } catch (error) {
    console.error('Detailed initialization error:', error);
    throw error;
  }
}

async function retryOperation(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (error.error === 'interaction_required' || error.error_subtype === 'access_denied') {
        await authenticate();
        continue;
      }
      if (i === maxRetries - 1) throw error;
    }
  }
}

let accessToken = null;
let tokenExpiry = null;

/* async function authenticate() {
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
} */

async function authenticate() {
  // If we have a valid token, use it
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return;
  }

  return new Promise((resolve, reject) => {
    const handleTokenResponse = async (response) => {
      if (response.error !== undefined) {
        reject(response);
        return;
      }
      accessToken = response.access_token;
      tokenExpiry = Date.now() + response.expires_in * 1000;
      await gapi.client.setToken(response);
      resolve(response);
    };

    tokenClient.callback = handleTokenResponse;

    if (accessToken) {
      // Try silent refresh first
      try {
        tokenClient.requestAccessToken({ prompt: 'none' });
      } catch (err) {
        // If silent refresh fails, trigger interactive login
        console.log('Silent refresh failed, requesting user interaction');
        tokenClient.requestAccessToken({ prompt: 'consent' });
      }
    } else {
      // No existing token, request interactive login directly
      console.log('No existing token, requesting user interaction');
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  });
}

async function ensureValidToken() {
  try {
    if (!accessToken || !tokenExpiry || Date.now() >= tokenExpiry - 60000) {
      await authenticate();
    }
  } catch (error) {
    console.error('Token validation failed:', error);
    // Force a new interactive login
    await authenticate();
  }
}

async function waitForGoogleAPI() {
  return new Promise((resolve, reject) => {
    // If Google API is already loaded
    if (window.google && window.gapi) {
      resolve();
      return;
    }

    // Set a timeout to avoid infinite waiting
    const timeout = setTimeout(() => {
      reject(new Error('Timeout waiting for Google API to load'));
    }, 10000);

    // Check periodically if APIs are loaded
    const checkGoogleAPI = setInterval(() => {
      if (window.google && window.gapi) {
        clearInterval(checkGoogleAPI);
        clearTimeout(timeout);
        resolve();
      }
    }, 100);
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
  if (!data) {
    console.log('No data has been passed to the function saveToGdrive... Exiting function');
    return;
  }

  await retryOperation(async () => {
    uploadStatus.showCloudUploadImg();
    const folderId = await findOrCreateFolder();
    const fileId = await findOrCreateFile(folderId);

    await gapi.client.request({
      path: `/upload/drive/v3/files/${fileId}`,
      method: 'PATCH',
      params: { uploadType: 'media' },
      body: JSON.stringify(data),
    });

    uploadStatus.showCloudUploadFinishedimg();
    console.log('Data saved successfully');
  });
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
