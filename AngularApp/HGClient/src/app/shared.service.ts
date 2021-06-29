import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

readonly APIUrl = "http://127.0.0.1:8000";
readonly PhotoUrl = "http://127.0.0.1:8000/media/";
  
  codeGenEvent = new BehaviorSubject<string>('');
  codeGenListner = this.codeGenEvent.asObservable();
  configEvent = new BehaviorSubject<any>('');
  configListner = this.configEvent.asObservable();
  currentConfig:{[index:string]:any} = {};
  
  constructor(private http:HttpClient) {
  }

  
  addMapping(data: any,appName: string | number){
    this.currentConfig[appName].push(data)
  }

  getGestureData():Observable<any[]>{
    return this.http.get<any[]>(this.APIUrl + '/HandGestures/');
  }

  addGestureData(gestureData:any, actionData:any, appData:any):Observable<any>{
    return this.http.post<any>(this.APIUrl + '/HandGestures/',
    { gestureData: gestureData, actionData: actionData, appData: appData})
  }

}
