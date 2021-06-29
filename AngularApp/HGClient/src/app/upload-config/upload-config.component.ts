import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-config',
  templateUrl: './upload-config.component.html',
  styleUrls: ['./upload-config.component.css']
})
export class UploadConfigComponent implements OnInit {

  
  @Output() uploadedConfig = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  uploadConfig(config: any){
    let dataSet: {[index:string]:any} = [];
    dataSet.gestureList = [];
    dataSet.actionList = [];
    dataSet.appList = [];

    let p1 = config.split('\n')[0].trim().split(';');
    p1.forEach((p:string) =>{
      dataSet.gestureList.push(JSON.parse(p));
    })
    let p2 = config.split('\n')[1].trim().split(';');
    p2.forEach((p:string) =>{
      dataSet.actionList.push(JSON.parse(p));
    })
    let p3 = config.split('\n')[2].trim().split(';');
    p3.forEach((p:string) =>{
      dataSet.appList.push(JSON.parse(p));
    })
    this.uploadedConfig.emit(dataSet);
  }

}
