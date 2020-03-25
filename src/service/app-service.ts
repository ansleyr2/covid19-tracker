import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()

export class AppService {

  constructor(private http: HttpClient) { 

  }

  getGlobalCounts(){
      return this.http.get("https://covid19.mathdro.id/api");
  }

  calculatePercentage(cofirmedCases: number, categoryCases: number){
    return (cofirmedCases/categoryCases)*100;
  }

  getCountriesList(){
      return this.http.get("https://covid19.mathdro.id/api/countries");
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

}