import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AppService } from '../service/app-service' 

declare var window;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private appService: AppService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (window.plugins && window.plugins.uniqueDeviceID) {
 
        // request UUID
        window.plugins.uniqueDeviceID((uuid) => {
            // got it!
            console.log(uuid);
            appService.addDeviceDetails(uuid).then( () => {
              console.log('device details saved successfully');
            }).catch(()=>{
              console.log('error while saving device details');
            });
        },
        (err) => {
            // something went wrong
            console.warn(err);
        });
      }
    });
  }
}
