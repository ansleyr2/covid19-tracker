import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppService } from '../../service/app-service';

import { ModalController, LoadingController } from 'ionic-angular';

import { ModalPage } from '../modal/modal';

interface todayData{
  todayCases? : number;
  todayDeaths ? : number;
  active?: number;
  critical? : number;
  casesPerOneMillion? : number;
  deathsPerOneMillion? : number;
  updated? : string;
  isError? : boolean
}

interface globalData{
  confirmed?: number;
  recovered?: number;
  deaths?: number;
  updateTime?: any;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  globalData: globalData = {};
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

  todayData: todayData = {isError: true};
  constructor(public navCtrl: NavController, private appSvc: AppService,
    public modalController: ModalController,
    public loadingCtrl: LoadingController) {

  }

  ionViewDidEnter() {
    console.log(this.selectedCountry);
    this.countries = [];
    this.resetSearchResults();
    this.appSvc.getCountriesList().subscribe((data: any) => {
      //console.log(data.countries);
      // const countriesObj = data.countries;

      //const entries = Object.entries(countriesObj);
      // console.log(entries);

      // for (const [countryFullName, countryISOCode] of entries) {
      //   this.countries.push({ isoCode: countryISOCode, name: countryFullName });
      // }

      // changes as per api modifications
      // for (const [id, countryDetails] of data) {
      //   console.log(id);
      //   const details: any = countryDetails;
      //   this.countries.push({ isoCode: details.iso2, name: details.name });
      // }

      /*for (const [country, countryInfo] of data) {
        //console.log(country, countryInfo);
        const details: any = countryDetails;
        this.countries.push({ isoCode: details.iso2, name: details.name });
      }*/
      if(data.length > 0){
        data.forEach((country: any)=>{
          const name = country.country;
          const isoCode = country.countryInfo.iso2;
          this.countries.push({ isoCode: isoCode, name: name });
        })
  
        this.countries.sort(function (a, b) {
          return ('' + a.name).localeCompare(b.name);
        })
      }
     
      console.log(this.countries);


      this.selectedCountry? this.getCasesByCountry(this.selectedCountry)  : this.getGlobalCounts();

    }, err => {
      this.loader.dismiss();
      console.log("Error while fetching countries");
    })

  }

  getGlobalCounts(refresher?: any, isRefresh = false) {
    this.showLoader();
    this.appSvc.getGlobalCounts().subscribe((data: any) => {
    // this.appSvc.getGlobalCounts_1().subscribe((data: any) => {
      if(isRefresh){
        refresher.complete();
      }
      this.loader.dismiss();
      // console.log(data);
      // this.globalData = data;

      /*this.globalData.confirmed = data.cases;
      this.globalData.recovered = data.recovered;
      this.globalData.deaths = data.deaths;*/

      this.globalData.confirmed = data.confirmed.value;
      this.globalData.recovered = data.recovered.value;
      this.globalData.deaths = data.deaths.value;

      const confirmed = data.confirmed.value;
      const deaths = data.deaths.value;
      const recoveries = data.recovered.value;

      /*const confirmed = data.cases;
      const deaths = data.deaths;
      const recoveries = data.recovered;*/

      this.deathPercentage = ((deaths / confirmed) * 100).toFixed(2);
      this.recoveryPercentage = ((recoveries / confirmed) * 100).toFixed(2);

      this.lastUpdateTime = new Date(data.lastUpdate).toLocaleDateString() + " " + new Date(data.lastUpdate).toLocaleTimeString();
    }, err => {
      this.loader.dismiss();
      console.log("Error");
    })
  }

  onBlur(event?) {
    console.log("onBlur");
    this.isSearch = false;
    this.resetSearchResults();
    this.selectedCountry = null;
  }

  onCancel(event?) {
    console.log("onCancel");
    this.isSearch = false;
    this.resetSearchResults();
    this.selectedCountry = null;
    this.todayData = {isError: true};
  }

  searchPlace() {
    this.resetSearchResults();
    console.log("in searchPlace");
    console.log(this.query);

    if (this.query.length === 0) {
      this.isSearch = false;
      this.todayData.isError = true;
      this.selectedCountry = null;

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
    this.getCasesByCountry(country.isoCode);
  }

  getCasesByCountry(country: any, refresher?: any, isRefresh = false){
    this.appSvc.getCountByCountry(country).subscribe((data: any) => {
      if(isRefresh){
        refresher.complete();
      }
      this.loader.dismiss();

      this.globalData.confirmed = data.confirmed.value;
      this.globalData.recovered = data.recovered.value;
      this.globalData.deaths = data.deaths.value;

      const confirmed = data.confirmed.value;
      const deaths = data.deaths.value;
      const recoveries = data.recovered.value;

      this.deathPercentage = ((deaths / confirmed) * 100).toFixed(2);
      this.recoveryPercentage = ((recoveries / confirmed) * 100).toFixed(2);
      this.lastUpdateTime = new Date(data.lastUpdate).toLocaleDateString() + " " + new Date(data.lastUpdate).toLocaleTimeString();

      // console.log(data);
     // this.globalData = data;

      /*const confirmed = data.confirmed.value;
      const deaths = data.deaths.value;
      const recoveries = data.recovered.value;

      this.deathPercentage = ((deaths / confirmed) * 100).toFixed(2);
      this.recoveryPercentage = ((recoveries / confirmed) * 100).toFixed(2);
      this.lastUpdateTime = new Date(data.lastUpdate).toLocaleDateString() + " " + new Date(data.lastUpdate).toLocaleTimeString();*/

    }, err => {
      this.loader.dismiss();
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
      this.loader.dismiss();
    })
  }

  getRecoveredCases() {
    this.showLoader();
    this.appSvc.getRecoveredCasesPerRegionByCountry(this.selectedCountry).subscribe((data: any) => {
      //console.log(data);
      this.presentModal(data, 'R');
    }, err => {
      console.log("error...");
      this.loader.dismiss();
    })
  }

  getDeathCases() {
    this.showLoader();
    this.appSvc.getDeathCasesPerRegionByCountry(this.selectedCountry).subscribe((data: any) => {
      //console.log(data);
      this.presentModal(data, 'D');
    }, err => {
      console.log("error...");
      this.loader.dismiss();
    })
  }

  async presentModal(data: any, type: string, moreInfo: boolean = false) {
    const modal = this.modalController.create(ModalPage, {
      data: data,
      type: type,
      countrySearched: this.selectedCountry ? true : false,
      moreInfo
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

  getTodayData(){
    this.showLoader();
    this.appSvc.getCasesAndTodaysCountsByCountry(this.selectedCountry).subscribe((res: any)=>{
      /*this.globalData.confirmed = res.cases;
      this.globalData.recovered = res.recovered;
      this.globalData.deaths = res.deaths;


      const confirmed = res.cases;
      const deaths = res.deaths;
      const recoveries = res.recovered;

      this.deathPercentage = ((deaths / confirmed) * 100).toFixed(2);
      this.recoveryPercentage = ((recoveries / confirmed) * 100).toFixed(2);*/
     // this.lastUpdateTime = new Date(data.lastUpdate).toLocaleDateString() + " " + new Date(data.lastUpdate).toLocaleTimeString();

      const todayCases = res.todayCases;
      const todayDeaths = res.todayDeaths;
      const casesPerOneMillion = res.casesPerOneMillion;
      const deathsPerOneMillion = res.deathsPerOneMillion;
      const active = res.active;
      const critical = res.critical;
      const updated = res.updated;
      this.todayData ={
        todayCases,
        todayDeaths,
        casesPerOneMillion,
        deathsPerOneMillion,
        active,
        critical,
        updated : new Date(updated).toLocaleDateString() + ' ' + new Date(updated).toLocaleTimeString(),
        isError: false
      }
      console.log(todayCases, todayDeaths, casesPerOneMillion, deathsPerOneMillion);

      this.presentModal(this.todayData, '', true);
    }, err =>{
      console.log(err);
      this.todayData.isError = true;
      this.loader.dismiss();
    });
  }
}
