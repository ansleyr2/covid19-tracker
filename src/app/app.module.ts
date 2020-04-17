import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule/*, IonicErrorHandler*/ } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ModalPage } from '../pages/modal/modal';
import { NewsModalPage } from '../pages/modal/news-modal';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {  AngularFireDatabaseModule} from '@angular/fire/database';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpClientModule } from '@angular/common/http';

import { AppService } from '../service/app-service';
// Add firebase config from your firebase console for DB to get user device id
import { firebaseConfig } from '../app.constant';

import { GlobalErrorHandler } from '../service/error-handling-service';
import { ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FCM } from '@ionic-native/fcm';



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ModalPage,
    NewsModalPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true,
      progressBar: true,
      onActivateTick: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ModalPage,
    NewsModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    FCM
  ]
})
export class AppModule {}
