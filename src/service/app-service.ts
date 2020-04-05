import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFireDatabase } from '@angular/fire/database';


@Injectable()

export class AppService {

  constructor(private http: HttpClient, public db: AngularFireDatabase,) { 

  }

  getGlobalCounts(){
      return this.http.get("https://covid19.mathdro.id/api");
  }

  calculatePercentage(cofirmedCases: number, categoryCases: number){
    return (cofirmedCases/categoryCases)*100;
  }

  getCountriesList(){
      // return this.http.get("https://covid19.mathdro.id/api/countries");

      return this.http.get('https://corona.lmao.ninja/countries');
  }

  getCountByCountry(countryISOCode: string){
      return this.http.get(`https://covid19.mathdro.id/api/countries/${countryISOCode}`);
  }

  getConfirmedCasesPerRegionByCountry(countryISOCode: string){
    if(!countryISOCode){
      return this.http.get('https://covid19.mathdro.id/api/confirmed');
    }
    return this.http.get(`https://covid19.mathdro.id/api/countries/${countryISOCode}/confirmed`);
  }

  getRecoveredCasesPerRegionByCountry(countryISOCode: string){
    if(!countryISOCode){
      return this.http.get('https://covid19.mathdro.id/api/recovered');
    }
    return this.http.get(`https://covid19.mathdro.id/api/countries/${countryISOCode}/recovered`);
  }

  getDeathCasesPerRegionByCountry(countryISOCode: string){
    if(!countryISOCode){
      return this.http.get('https://covid19.mathdro.id/api/deaths');
    }
    return this.http.get(`https://covid19.mathdro.id/api/countries/${countryISOCode}/deaths`);
  }

  getUSStatesData(){
    return this.http.get(`https://corona.lmao.ninja/states`);
  }

  getCasesAndTodaysCountsByCountry(countryISOCode){
    return this.http.get(`https://corona.lmao.ninja/countries/${countryISOCode}`);
  }

  getGlobalCounts_1(){
    return this.http.get(`https://corona.lmao.ninja/all`);
  }

  addDeviceDetails(deviceId: string){

    return new Promise<any>((resolve, reject) => {
        this.db.database.ref('Device/' + deviceId).set({
        }).then((res) => {
          resolve(res);
        })
          .catch((err) => {
              reject(err);
          });
    })
}
}