import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppService } from '../../service/app-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  globalData : any = null;
  deathPercentage: any = null;
  recoveryPercentage: any = null;

  countries: any[] = [];
  matchedCountries: any[] = [];
  query: string = "";

  isSearch: boolean = false;
  searchPlaceholder: string = "Search Country";
  selectedCountry:string = "";

  lastUpdateTime;
  constructor(public navCtrl: NavController, private appSvc : AppService) {
    
  }

  ionViewDidEnter(){
    this.appSvc.getCountriesList().subscribe((data: any) =>{
      // console.log(data.countries);
      const countriesObj = data.countries;

      const entries = Object.entries(countriesObj);
     // console.log(entries);

      for (const [countryFullName, countryISOCode] of entries) {
        this.countries.push({isoCode: countryISOCode , name: countryFullName });
      }

      console.log(this.countries);

      this.getGlobalCounts();
      
    }, err=>{
      console.log("Error while fetching countries");
    })
    
  }

  getGlobalCounts(){
    this.appSvc.getGlobalCounts().subscribe((data: any) =>{
      console.log(data);
      this.globalData = data;

      const confirmed = data.confirmed.value;
      const deaths = data.deaths.value;
      const recoveries = data.recovered.value;

      this.deathPercentage = ((deaths/ confirmed) * 100 ).toFixed(2);
      this.recoveryPercentage = ((recoveries/ confirmed) * 100 ).toFixed(2);

      this.lastUpdateTime = new Date(data.lastUpdate).toLocaleDateString() + " " + new Date(data.lastUpdate).toLocaleTimeString();

    }, err=>{
      console.log("Error");
    })
  }

  onBlur(event?){
    console.log("onBlur");
    this.isSearch = false;
    this.resetSearchResults();
  }

  clear(event?){
    console.log("clear");
    this.isSearch = false;
    this.resetSearchResults();
    // this.query = "";
    //this.getGlobalCounts();
  }

  onCancel(event?){
    console.log("onCancel");
    this.isSearch = false;
    this.resetSearchResults();
  }

  searchPlace(){
    this.resetSearchResults();
    console.log("in searchPlace");
    console.log(this.query);

    if(this.query.length === 0){
      this.getGlobalCounts();
      return;
    }
    // set search flag
    this.countries.forEach(item => {
      const shouldShow = item.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      if(shouldShow){
        this.matchedCountries.push(item);
      }
    });
    this.isSearch = true;
  }

  selectCountry(country:any){
    console.log(country);
    this.query = country.name;

    this.isSearch = false;
    this.resetSearchResults();
    this.appSvc.getCountByCountry(country.isoCode).subscribe((data: any) =>{
      console.log(data);
      this.globalData = data;

      const confirmed = data.confirmed.value;
      const deaths = data.deaths.value;
      const recoveries = data.recovered.value;

      this.deathPercentage = ((deaths/ confirmed) * 100 ).toFixed(2);
      this.recoveryPercentage = ((recoveries/ confirmed) * 100 ).toFixed(2);
      this.lastUpdateTime = new Date(data.lastUpdate).toLocaleDateString() + " " + new Date(data.lastUpdate).toLocaleTimeString();

    },err =>{
      console.log("Error while fetching country data");
    })
  }

  resetSearchResults(){
    this.matchedCountries = [];
  }
}
