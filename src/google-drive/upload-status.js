import cloudUploudImage from '../images/cloud-upload.png';
import cloudFinishedImage from '../images/cloud-finished.png';
import { createImg } from '../create-elements-functions/create-img';
import { settings } from '../main';

export class UploadStatus {
  constructor() {
    this.uploadToCloudImg = this.createUploadingCloudImg();
    this.uploadToCloudFinished = this.createCloudFinishedImg();
    this.hideCloudUploadImg();
  }

  createUploadingCloudImg() {
    const appHeaderWrapper = settings.appHeaderWrapperSelector;
    const img = createImg(
      'uploading-cloud-img',
      cloudUploudImage,
      'Icon showing a cloud with an upload arrow',
      'image',
      appHeaderWrapper
    );
    return img;
  }

  createCloudFinishedImg() {
    const appHeaderWrapper = settings.appHeaderWrapperSelector;
    const img = createImg(
      'cloud-upload-finished',
      cloudFinishedImage,
      'Icon showing a cloud with a finished mark',
      'image',
      appHeaderWrapper
    );
    return img;
  }

  showCloudUploadImg() {
    this.uploadToCloudImg.style.display = 'block';
  }

  showCloudUploadFinishedimg() {
    this.uploadToCloudFinished.style.display = 'block';
  }

  hideCloudUploadImg() {
    this.uploadToCloudImg.style.display = 'none';
  }

  hideCloudUploadFinishedImg() {
    this.uploadToCloudFinished.style.display = 'none';
  }
}
