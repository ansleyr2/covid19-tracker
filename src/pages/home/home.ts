import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppService } from '../../service/app-service';

import { ModalController, LoadingController } from 'ionic-angular';

import { ModalPage } from '../modal/modal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  globalData: any = null;
  deathPercentage: any = null;
  recoveryPercentage: any = null;

  countries: any[] = [];
  matchedCountries: any[] = [];
  query: string = "";

  isSearch: boolean = false;
  searchPlaceholder: string = "Search Country";
  selectedCountry: string = "";

  loader;

  lastUpdateTime;
  constructor(public navCtrl: NavController, private appSvc: AppService,
    public modalController: ModalController,
    public loadingCtrl: LoadingController) {

  }

  ionViewDidEnter() {
    this.appSvc.getCountriesList().subscribe((data: any) => {
      // console.log(data.countries);
      const countriesObj = data.countries;

      const entries = Object.entries(countriesObj);
      //console.log(entries);

      // for (const [countryFullName, countryISOCode] of entries) {
      //   this.countries.push({ isoCode: countryISOCode, name: countryFullName });
      // }

      // changes as per api modifications
      for (const [id, countryDetails] of entries) {
        const details: any = countryDetails;
        this.countries.push({ isoCode: details.iso2, name: details.name });
      }

      console.log(this.countries);

      this.getGlobalCounts();

    }, err => {
      console.log("Error while fetching countries");
    })

  }

  getGlobalCounts(refresher?: any, isRefresh = false) {
    this.showLoader();
    this.appSvc.getGlobalCounts().subscribe((data: any) => {
      if(isRefresh){
        refresher.complete();
      }
      this.loader.dismiss();
      // console.log(data);
      this.globalData = data;

      const confirmed = data.confirmed.value;
      const deaths = data.deaths.value;
      const recoveries = data.recovered.value;

      this.deathPercentage = ((deaths / confirmed) * 100).toFixed(2);
      this.recoveryPercentage = ((recoveries / confirmed) * 100).toFixed(2);

      this.lastUpdateTime = new Date(data.lastUpdate).toLocaleDateString() + " " + new Date(data.lastUpdate).toLocaleTimeString();
    }, err => {
      console.log("Error");
    })
  }

  onBlur(event?) {
    console.log("onBlur");
    this.isSearch = false;
    this.resetSearchResults();
    this.selectedCountry = null;
  }

  clear(event?) {
    console.log("clear");
    this.isSearch = false;
    this.resetSearchResults();
    // this.query = "";
    //this.getGlobalCounts();
    this.selectedCountry = null;
  }

  onCancel(event?) {
    console.log("onCancel");
    this.isSearch = false;
    this.resetSearchResults();
    this.selectedCountry = null;
  }

  searchPlace() {
    this.resetSearchResults();
    console.log("in searchPlace");
    console.log(this.query);

    if (this.query.length === 0) {
      this.getGlobalCounts();
      return;
    }
    // set search flag
    this.countries.forEach(item => {
      const shouldShow = item.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      if (shouldShow) {
        this.matchedCountries.push(item);
      }
    });
    this.isSearch = true;
  }

  selectCountry(country: any) {
    console.log(country);
    this.query = country.name;
    this.selectedCountry = country.isoCode;
    this.isSearch = false;
    this.resetSearchResults();
    this.showLoader();
    this.getCasesByCountry(country);
  }

  getCasesByCountry(country: any, refresher?: any, isRefresh = false){
    this.appSvc.getCountByCountry(isRefresh? country : country.isoCode).subscribe((data: any) => {
      if(isRefresh){
        refresher.complete();
      }
      this.loader.dismiss();
      // console.log(data);
      this.globalData = data;

      const confirmed = data.confirmed.value;
      const deaths = data.deaths.value;
      const recoveries = data.recovered.value;

      this.deathPercentage = ((deaths / confirmed) * 100).toFixed(2);
      this.recoveryPercentage = ((recoveries / confirmed) * 100).toFixed(2);
      this.lastUpdateTime = new Date(data.lastUpdate).toLocaleDateString() + " " + new Date(data.lastUpdate).toLocaleTimeString();

    }, err => {
      console.log("Error while fetching country data");
    })
  }

  resetSearchResults() {
    this.matchedCountries = [];
  }

  getConfirmedCases() {
    console.log(this.selectedCountry);
    this.showLoader();
    this.appSvc.getConfirmedCasesPerRegionByCountry(this.selectedCountry).subscribe((data: any) => {
      //console.log(data);
      this.presentModal(data, 'C');
    }, err => {
      console.log("error...");
    })
  }

  getRecoveredCases() {
    this.showLoader();
    this.appSvc.getRecoveredCasesPerRegionByCountry(this.selectedCountry).subscribe((data: any) => {
      //console.log(data);
      this.presentModal(data, 'R');
    }, err => {
      console.log("error...");
    })
  }

  getDeathCases() {
    this.showLoader();
    this.appSvc.getDeathCasesPerRegionByCountry(this.selectedCountry).subscribe((data: any) => {
      //console.log(data);
      this.presentModal(data, 'D');
    }, err => {
      console.log("error...");
    })
  }

  async presentModal(data: any, type: string) {
    const modal = this.modalController.create(ModalPage, {
      data: data,
      type: type,
      countrySearched: this.selectedCountry ? true : false
    });
    modal.onDidDismiss(data => {
      console.log("modal.onDidDismiss");
      console.log(data);
    });
    modal.present().then(()=>{
      this.loader.dismiss();
    });
  }

  showLoader() {
    this.loader = this.loadingCtrl.create({
        content: `loading...`,
    });
    this.loader.present();    
  }

  doRefresh(refresher){
    // console.log(refresher);
    if(this.selectedCountry){
      this.getCasesByCountry(this.selectedCountry, refresher, true);
    }else{
      this.getGlobalCounts(refresher, true);
    }
  }
}
