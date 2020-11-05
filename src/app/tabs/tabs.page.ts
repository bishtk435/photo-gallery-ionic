import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor() {}

  // ionicViewWillEnter(): void {
  //   console.log('tabs: viewWillEnter');
  // }

  ionViewWillEnter() {
    console.log('tabs: viewWillEnter');
  }

  ionicViewWillEnter(): void {
    console.log('tabs: ionicViewWillEnter');
  }

}
