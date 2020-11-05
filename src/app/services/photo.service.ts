import { Injectable } from "@angular/core";
import { Platform } from '@ionic/angular';
import {
  Plugins,
  CameraResultType,
  Capacitor,
  FilesystemDirectory,
  CameraPhoto,
  CameraSource,
} from "@capacitor/core";

const { Camera, Filesystem, Storage } = Plugins;
@Injectable({
  providedIn: "root",
})
export class PhotoService {
  public photos = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;
  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    // this.photos.unshift({
    //   filepath: '...soon',
    //   webviewPath: capturedPhoto.webPath
    // });

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  private async savePicture(cameraPhoto: CameraPhoto){
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getDate() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    if (this.platform.is('hybrid')){
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri)
      };
    }else {
      return {
        filePath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }

  }

  private async readAsBase64(cameraPhoto: CameraPhoto){

    if (this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });

      return file.data;
    }else{
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    if (this.platform.is('hybrid')){
      for (const photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filePath,
          directory: FilesystemDirectory.Data
        });
        console.log('this is read file: ', readFile);
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async deletePicture(photo: Photo, position: number){
    this.photos.slice(position, 1);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    const fileName = photo.filePath
                        .substr(photo.filePath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: fileName,
      directory: FilesystemDirectory.Data
    });
  }
}

export interface Photo {
  filePath: string;
  webviewPath: string;
}
