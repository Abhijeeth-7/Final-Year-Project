import { Component } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HGClient';
  activePage = 1;
  timestamp!: string;

  setActivePage(pageNum: number){
    this.activePage = pageNum;
  }
  
  getTimestamp(): void{
    let d = new Date();
    this.timestamp = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
  }
}
