import path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import fs from 'fs';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
// Store in user's home directory or /tmp to avoid permission issues
const homeDir = process.env.HOME || process.env.USERPROFILE || '/tmp';
const tokenDir = path.join(homeDir, '.google-search-console-mcp');
let TOKEN_PATH = path.join(tokenDir, 'token.json');

// Ensure token directory exists
try {
  if (!fs.existsSync(tokenDir)) {
    console.error(`Creating token directory: ${tokenDir}`);
    fs.mkdirSync(tokenDir, { recursive: true });
  }
  console.error(`Using token path: ${TOKEN_PATH}`);
} catch (err) {
  console.error(`Failed to create token directory: ${err}`);
  // Fallback to temp directory
  const tempDir = path.join('/tmp', 'google-search-console-mcp');
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    TOKEN_PATH = path.join(tempDir, 'token.json');
    console.error(`Using fallback token path: ${TOKEN_PATH}`);
  } catch (tempErr) {
    console.error(`Failed to create temp token directory: ${tempErr}`);
  }
}

// Try to find credentials.json in several locations
let CREDENTIALS_PATH = '';
const possiblePaths = [
  path.resolve(process.cwd(), 'credentials.json'),
  path.resolve(__dirname, '..', '..', 'credentials.json'),
  path.resolve(process.env.HOME || '/tmp', '.google-search-console-mcp', 'credentials.json'),
  path.resolve('/tmp/cred-test', 'credentials.json'), // For testing
];

for (const p of possiblePaths) {
  console.error(`Checking for credentials at: ${p}`);
  if (fs.existsSync(p)) {
    CREDENTIALS_PATH = p;
    console.error(`Credentials file found at: ${CREDENTIALS_PATH}`);
    break;
  }
}

// Check if credentials file was found
if (!CREDENTIALS_PATH) {
  console.error('ERROR: Credentials file not found in any of the expected locations!');
  console.error('Please ensure credentials.json exists in the project root or one of the checked paths.');
  // Create a simple dummy credentials file for testing in the current directory
  if (process.env.NODE_ENV === 'development') {
    console.error('Creating dummy credentials file for development/testing...');
    const dummyCredentials = {
      installed: {
        client_id: "dummy",
        project_id: "dummy",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_secret: "dummy",
        redirect_uris: ["http://localhost"]
      }
    };
    const dummyPath = path.join(process.cwd(), 'credentials.json');
    fs.writeFileSync(dummyPath, JSON.stringify(dummyCredentials, null, 2));
    CREDENTIALS_PATH = dummyPath;
    console.error(`Created dummy credentials at: ${CREDENTIALS_PATH}`);
  }
} else {
  console.error(`Using credentials from: ${CREDENTIALS_PATH}`);
}

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = await import(TOKEN_PATH, { with: { type: 'json' } });
    const credentials = content.default;
    return google.auth.fromJSON(credentials) as OAuth2Client;
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 */
async function saveCredentials(client: OAuth2Client): Promise<void> {
  const content = await import(CREDENTIALS_PATH, { with: { type: 'json' } });
  const keys = content.default.installed || content.default.web;
  const key = {
    type: 'authorized_user',
    client_id: keys.client_id,
    client_secret: keys.client_secret,
    refresh_token: client.credentials.refresh_token,
  };
  const fs = await import('fs');
  const jsonContent = JSON.stringify(key);
  fs.writeFileSync(TOKEN_PATH, jsonContent);
}

/**
 * Authenticate with Google APIs using OAuth2
 */
export async function authorize(): Promise<OAuth2Client> {
  try {
    console.error('Starting authorization process...');
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      console.error('Using saved credentials from token.json');
      return client;
    }
    
    console.error(`Authenticating with credentials file: ${CREDENTIALS_PATH}`);
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    
    if (client.credentials) {
      console.error('Authentication successful, saving credentials');
      await saveCredentials(client);
    }
    return client;
  } catch (error) {
    console.error('Authorization error:', error);
    throw error;
  }
}