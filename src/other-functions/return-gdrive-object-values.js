import { loadedData } from '../google-drive/gdrive-storage-functions';

export function returnProjectName() {
  return loadedData['currentProject'];
}
