import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AppService } from '../service/app-service' ;


import { FCM } from '@ionic-native/fcm';



declare var window;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private appService: AppService,
     private fcm: FCM) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if(platform.is('android')){
        this.initPushNotification();
        this.configureNotificationOpen();
        this.configureNotificationTokenRefresh();
      }
      

      setTimeout(() => {
        if (window.plugins && window.plugins.uniqueDeviceID) {
 
          // request UUID
          window.plugins.uniqueDeviceID.get((uuid) => {
              // got it!
              console.log(uuid);
              this.appService.addDeviceDetails(uuid).then( () => {
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
      }, 500);
    });
  }

  initPushNotification(){
    this.fcm.getToken()
    .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
    .catch(error => console.error('Error getting token', error));
  }

  configureNotificationOpen(){
    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
    });
  }

  configureNotificationTokenRefresh(){
    this.fcm.onTokenRefresh()
    .subscribe((token: string) => console.log(`Got a new token ${token}`));

  }
}
