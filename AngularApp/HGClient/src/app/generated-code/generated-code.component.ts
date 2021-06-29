import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-generated-code',
  templateUrl: './generated-code.component.html',
  styleUrls: ['./generated-code.component.css']
})
export class GeneratedCodeComponent implements OnInit {

  generatedCode :string = '';
  @Input() timestamp!:string;
  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.service.codeGenListner.subscribe((data)=>{
      this.generatedCode = data;
    })
    if(this.generatedCode==''){
      this.generatedCode = "You have not generated any code, Please generate the code and vist this page again";
    }
    else{
      this.timestamp = "Code is generated at ".concat(this.timestamp);
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
