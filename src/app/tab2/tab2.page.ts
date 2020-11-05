import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

import { Photo, PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(private photoService: PhotoService, private actionSheetController: ActionSheetController) {}

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  async ngOnInit() {
    await this.photoService.loadSaved();
    console.log('tab2: ngOnInit');
  }

  ionViewWillEnter() {
    console.log('tab2: ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('tab2: ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('tab2: ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('tab2: ionViewDidLeave');
  }

  public async showActionSheet(photo: Photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'Close',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
  }

}
