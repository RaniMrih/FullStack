import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api2Service {

  public globalURL = 'http://localhost:5000';
  public continentId = <any>("")
  public contries_in_continent = <any>(["aaaa", "bbb"]);

  constructor(public http: HttpClient) {



  }


  getInfo(Info: { continent: any; country: any; year: any; }, url: string) {

    let ob = {
      continent: Info.continent,
      country: Info.country,
      year: Info.year
    }

    this.getinfo1(ob)             //=================go to info1===========================s


    console.log("ob : ", ob)
    console.log("url : ", url)
    return this.http.post(this.globalURL + '/' + url, ob).toPromise().then(result => {
      console.log("result : ", result)
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  getinfo1(ob1) {
    if (ob1.continent == "Asia") {
      this.continentId = "1";
    }
    if (ob1.continent == "Europe") {
      this.continentId = "2";
    }
    if (ob1.continent == "America") {
      this.continentId = "3";
    }
    if (ob1.continent == "Africa") {
      this.continentId = "4";
    }
    if (ob1.continent == "Australia") {
      this.continentId = "5";
    }
    console.log("continentId: ", this.continentId)
    return this.http.get('http://localhost:5000/getCountryValue1?continentId=' + this.continentId).toPromise().then(result => {
      console.log("result from getCountryValue1 : ", result)
      this.contries_in_continent = result;
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });


  }


}

