import { loadedData } from '../src/google-drive/gdrive-storage-functions';

export function returnProjectName() {
  return loadedData['currentProject'];
}
