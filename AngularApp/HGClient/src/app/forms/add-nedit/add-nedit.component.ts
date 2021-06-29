import { Byte } from '@angular/compiler/src/util';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-n-edit',
  templateUrl: './add-nedit.component.html',
  styleUrls: ['./add-nedit.component.css']
})
export class AddNEditComponent implements OnInit {
  
  hotKeysList:Array<string> = ['!', '"', '#', '$', '%', '&', "'", '(',
  ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7',
  '8', '9', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`',
  'a', 'b', 'c', 'd', 'e','f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~',
  'accept', 'add', 'alt', 'altleft', 'altright', 'apps', 'backspace',
  'browserback', 'browserfavorites', 'browserforward', 'browserhome',
  'browserrefresh', 'browsersearch', 'browserstop', 'capslock', 'clear',
  'convert', 'ctrl', 'ctrlleft', 'ctrlright', 'decimal', 'del', 'delete',
  'divide', 'down', 'end', 'enter', 'esc', 'escape', 'execute', 'f1', 'f10',
  'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f2', 'f20',
  'f21', 'f22', 'f23', 'f24', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9',
  'final', 'fn', 'help', 'home', 'insert', 'launchapp1', 'launchapp2', 'launchmail',
  'launchmediaselect', 'left', 'modechange', 'multiply', 'nexttrack',
  'nonconvert', 'num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6',
  'num7', 'num8', 'num9', 'numlock', 'pagedown', 'pageup', 'pause', 'pgdn',
  'pgup', 'playpause', 'prevtrack', 'print', 'printscreen', 'prntscrn',
  'prtsc', 'prtscr', 'return', 'right', 'scrolllock', 'select', 'separator',
  'shift', 'shiftleft', 'shiftright', 'sleep', 'space', 'stop', 'subtract', 'tab',
  'up', 'volumedown', 'volumemute', 'volumeup', 'win', 'winleft', 'winright', 'yen',
  'command', 'option', 'optionleft', 'optionright'];
  dropdownSettings:IDropdownSettings = {};
  handStateError: string ='';
  actionSelectionError: string ='';
  appSelectionError: string ='';

  constructor() { }
  
  @Input() formType!:string;
  @Input() gestureType!:Byte;
  @Input() record:any = {};
  @Input() actionsList:Array<{
    [index:string]:any,
    actionName:string,
    action:string
    }> = [];
  @Input() appNamesList:Array<{
    [index:string]:any,
    appName:string,
    originalName:string
    }> = [];
  
  @Output() newMapping = new EventEmitter<any>();
  @Output() updateMapping = new EventEmitter<any>();

  actions!:any[];
  apps!:any[];
  fingerStates: any[] = [false,false,false,false,false];     
  showSwipeGesture = false;


  GestureForm = new FormGroup({
    thumb: new FormControl(false),
    index: new FormControl(false),
    middle: new FormControl(false),
    ring: new FormControl(false),
    little: new FormControl(false),

    ithumb: new FormControl(false),
    iindex: new FormControl(false),
    imiddle: new FormControl(false),
    iring: new FormControl(false),
    ilittle: new FormControl(false),
    
    fthumb: new FormControl(false),
    findex: new FormControl(false),
    fmiddle: new FormControl(false),
    fring: new FormControl(false),
    flittle: new FormControl(false),

    swipe: new FormControl('',[
      Validators.required,
    ]),
    selectedAction: new FormControl('',[
      Validators.required,
    ]),
    newActionName: new FormControl('',[
      Validators.required,
    ]),
    newAction: new FormControl('',[
      Validators.required,
    ]),
    mode: new FormControl('',[
      Validators.required,
    ]),
    selectedApp: new FormControl('',[
      Validators.required,
    ]),
    newAppName: new FormControl('',[
      Validators.required,
    ]),
    newOriginalName: new FormControl('',[
      Validators.required,
    ]),
    name: new FormControl('',[
      Validators.required,
    ])
  });


  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.gestureType==0){
      this.showSwipeGesture = true;
    }else{
      this.showSwipeGesture = false;
    }
    if(this.formType==='edit'){
      this.setUpEditForm(this.GestureForm,this.record)
    }
    else{
      this.GestureForm.reset()
    }
    this.dropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 4,
      enableCheckAll: false,
      allowSearchFilter: true
    };
  }

  ngDoCheck(){
    try{
      if(this.showSwipeGesture){
        this.fingerStates =  this.decodeGestureString(this.getGestureString())
      }
      else{
        this.fingerStates =  this.decodeGestureString(this.getGestureString('i'))
        this.decodeGestureString(this.getGestureString('f')).forEach(value=>{
          this.fingerStates.push(value);
        })
      }
    }
    catch(exception){
    }
  }


  getHotKeyString(selectedHotKeysList: Array<string>){
    let hotKeyString = '';
    selectedHotKeysList?.forEach(hotkey=>{
      hotKeyString += "'"+hotkey+"'+";
    })
    return hotKeyString.slice(0,hotKeyString.length-1);
  }

  getFingerState(finger:string){
    return this.GestureForm.controls[finger].value?"Opened":"Closed"
  }

  submitForm() {
    if(this.validate(this.GestureForm)){
      this.submitGestureMapping(this.GestureForm);
    }
    else{
    }
  }

  validate(form: FormGroup): boolean{
    if(this.showSwipeGesture && this.getGestureString()=='00000'){
      return false;
    }
    if(!this.showSwipeGesture && this.getGestureString('i') == this.getGestureString('f')){
      return false;
    }
    if(form.controls.selectedAction.value==null && form.controls.selectedAction.touched){
      return false;
    }
    if(form.controls.selectedApp.value==null && form.controls.selectedAction.touched){
      return false;
    }
    return true;
  }

  getGestureString(prefix:string=''): string{
    let fingers = ['thumb','index','middle','ring','little']
    let result:string = '';
    fingers.forEach(finger=>{
      result += (this.GestureForm.controls[prefix+finger].value)?'1':'0'
    })
    return result
  }

  decodeGestureString(gestureString: string): boolean[]{
    let result: boolean[] = [];
    for(let fingerState of gestureString){
      if(fingerState==','){
        continue;
      }
      result.push((fingerState=='1')?true:false)
    }
    return result
  }

  getAction(actionName:string):string{
    let result='';
    this.actionsList.forEach(action=>{
      if(action.actionName == actionName){
        console.log(action, actionName);
        result = action.action;
        return;
      }
    })
    return result;
  }
  
  getOriginalName(appName:string):string{
    let result = '';
    this.appNamesList.forEach(app=>{
      if(app.appName == appName)
        result = app.originalName;
    })
    return result;
  }

  submitGestureMapping(form: FormGroup): any{
    let record:{[index:string]:any} = {}
    
    record.swipe = (form.controls.swipe.value!==null)?1:0;
    record.direction = record.swipe?form.controls.swipe.value:'None';

    if(this.showSwipeGesture){
      record.gestureString= this.getGestureString();
    }
    else{
      record.gestureString= this.getGestureString('i')+','+this.getGestureString('f');
    }

    if(form.controls.selectedAction.value!=1){
      record.actionName = form.controls.selectedAction.value;
    }
    else{
      record.actionName = form.controls.newAction.value;
    }

    if(form.controls.selectedApp.value!=1){
      record['appName']= form.controls.selectedApp.value;
    }
    else{
      record['appName']= form.controls.newAppName.value;
    }

    if(record.appName.toLowerCase()=="all applications"){
      record.mode = 5;
    }
    else if(record.appName.toLowerCase()=="mouse"){
      record.mode = 1;
    }
    else{
      if(this.showSwipeGesture){
        if(record.swipe){
          record.mode = 3;
        }
        else{
          record.mode = 2;
        }
      }else{
        record.mode = 4;
      }
    }

    record['gestureName']= form.controls.name.value;

    /*passing this data to the gesture-config component*/
    if(this.formType==='add'){

      let dataSet:{[index:string]:any} = {};
      dataSet.gesture = record;
      
      if(form.controls.selectedAction.value==1){
        dataSet.newAction = 
        {
          actionName:form.controls.newActionName.value,
          action:"hotkey("+this.getHotKeyString(form.controls.newAction.value)+")",
        }
      }
      
      if(form.controls.selectedApp.value==1){
        dataSet.newApp = 
        {
          appName:form.controls.newAppName.value,
          originalName:form.controls.newOriginalName.value,
        }
      }
      console.log(dataSet)
      //send data to the gesture-config file
      this.newMapping.emit(dataSet)
      //reset the form on submmision
      this.GestureForm.reset()
    }else{
      //send data to the gesture-config file after updating
      this.updateMapping.emit(record)
    }
  }
  
  setUpEditForm(form: FormGroup, record: any){
    if(this.showSwipeGesture){
      let fingers = ['thumb','index','middle','ring','little']
      let fingerState = this.decodeGestureString(record.gestureString)
      fingers.forEach((finger, index)=>{
        form.controls[finger].setValue(fingerState[index])
      })
      if(record.direction==null){
        form.controls.swipe.setValue(null);
      }else{
        form.controls.swipe.setValue(record.direction.toLowerCase());
      }
    }
    else{
      let fingers = ['ithumb','iindex','imiddle','iring','ilittle','fthumb','findex','fmiddle','fring','flittle']
      let fingerState = this.decodeGestureString(record.gestureString)
      fingers.forEach((finger, index)=>{
        form.controls[finger].setValue(fingerState[index])
      })
    }
    form.controls.selectedAction.setValue(record.actionName);
    form.controls.selectedApp.setValue(record.appName);
    form.controls.name.setValue(record.gestureName);
  }
}
