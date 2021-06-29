import { Byte } from '@angular/compiler/src/util';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { config } from 'rxjs';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-gesture-config',
  templateUrl: './gesture-config.component.html',
  styleUrls: ['./gesture-config.component.css']
})
export class GestureConfigComponent implements OnInit {
  constructor(private service:SharedService) { }

  dataSet:{[index:string]:any} = [];
  filteredGestureList:Array<{
    [index:string]:any,
    gestureString:string,
    swipe:string,
    direction:string,
    action:string,
    mode:number,
    appName:string,
    gestureName:string}> = [];

  gestureList:Array<{
    [index:string]:any,
    gestureString:string,
    swipe:string,
    direction:string,
    action:string,
    mode:number,
    appName:string,
    gestureName:string}> = [];
  
  appNamesList:Array<{
    [index:string]:any,
    appName:string,
    originalName:string
    }> = [];

  actionsList:Array<{
    [index:string]:any,
    actionName:string,
    action:string
    }> = [];
  
  searchQuery: string = '';
  gestureType:Byte = 0;
  displayForm:string = 'add';
  selectedGesture: any;
  id!:number;
  formOpen:boolean = false;
  @Output() codeGenerated = new EventEmitter();

  ModalTitle!:string;

  ngOnInit(): void {
    this.service.getGestureData().subscribe((data:{[index:string]:any}) =>{
      this.gestureList = data.gestureData;
      this.filteredGestureList = this.gestureList;
      this.actionsList = data.actionData;
      this.appNamesList = data.appNameData;
    })
  }

  uploadConfig(uploadedConfig:{[index:string]:any}){
    this.gestureList = uploadedConfig.gestureList;
      this.filteredGestureList = this.gestureList;
    this.actionsList = uploadedConfig.actionList;
    this.appNamesList = uploadedConfig.appList;
  }

  getOpenedFingers(gestureString: string){
    let result = '';
    let fingers = ['Thumb','Index','Middle','Ring','Little'];
    if(gestureString.length==5){
      for(let index=0; index<5; index++){
        if(+gestureString[index]){
          result += fingers[index]+',';
        } 
      }
    }else{
      result = 'Initial : '
      let fingers = ['Thumb','Index','Middle','Ring','Little'];
        for(let index=0; index<5; index++){
          if(+gestureString[index]){
            result += fingers[index]+',';
          } 
        }
      result += '\nFinal : '
      for(let index=5; index<11; index++){
        if(+gestureString[index]){
          result += fingers[index-5]+',';
        } 
      }
    }
    return result;
  }

  submit(){
      this.service.addGestureData(this.gestureList, this.actionsList, this.appNamesList).subscribe(response=>{
      this.service.codeGenEvent.next(response)
      this.service.configEvent.next(this.getBackUpString())
      this.codeGenerated.emit()    
    })
  }
  
  getTimestamp(): string{
    let d = new Date();
    return d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
  }

  getBackUpString(): string{
    let configString = '';
    this.gestureList.forEach((gesture,index)=>{
      if(index!=0){
        configString += ';'
      }
      configString = configString.concat(JSON.stringify(gesture))
    })
    configString += '\n';
    this.actionsList.forEach((gesture,index)=>{
      if(index!=0){
        configString += ';'
      }
      configString = configString.concat(JSON.stringify(gesture))
    })
    configString += '\n';
    this.appNamesList.forEach((gesture,index)=>{
      if(index!=0){
        configString += ';'
      }
      configString = configString.concat(JSON.stringify(gesture))
    })
    return configString;
  }

  addGestureMapping(dataSet: any){
    let newMapping = dataSet.gesture;
    this.gestureList.unshift(newMapping);
    if(dataSet.newAction!=null){
      this.actionsList.push(dataSet.newAction);
    }
    if(dataSet.newApp!=null){
      this.appNamesList.push(dataSet.newApp);
    }
  }

  editGestureMapping(gesture: any, index:number){
    this.formOpen = true;
    this.selectedGesture = gesture
    this.id = index
    this.displayForm='edit'
    this.ModalTitle = "Edit your gesture"
    if(gesture.gestureString.length == 5){
      this.gestureType = 0
    }else{
      this.gestureType = 1
    }
  }

  updateGestureMapping(gesture:any){
    this.gestureList[this.id] = gesture
  }

  displayAddForm(){
    this.displayForm = 'add';
    this.ModalTitle = "Configure your gesture";
    this.formOpen = true;
  }

  deleteClick(index: number){
   if(confirm('Are you sure??')){
      this.gestureList.splice(index,1);
      this.filteredGestureList = this.gestureList;
    }
  }

  getMatchingGestures(): void{
    this.filteredGestureList = [];
    let reg = new RegExp(this.searchQuery, 'i');
    this.gestureList.forEach(gesture=>{
      if(
        gesture.gestureName.match(reg)!=null||
        gesture.appName.match(reg)!=null
      )
      {
        this.filteredGestureList.push(gesture);
      }
    })
  }

}

