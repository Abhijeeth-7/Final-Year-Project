import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-config-backup',
  templateUrl: './config-backup.component.html',
  styleUrls: ['./config-backup.component.css']
})
export class ConfigBackupComponent implements OnInit {

  configurationData:any = '';
  @Input() timestamp!: string;

  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.service.configListner.subscribe((data)=>{
      if(data != ''){
        this.timestamp = "Generated at ".concat(this.timestamp);
      }
      this.configurationData+=data
    })
    if(this.configurationData == ''){
      this.configurationData = "No Configuatrion data is available, Please generate the code first and try again";
    }
  }

  copyToClipBoard(codeBlock: HTMLPreElement){
    let selBox = document.createElement('textarea');
    selBox.value = codeBlock.innerText;
    document.body.appendChild(selBox);
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
