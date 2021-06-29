import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { bindCallback } from 'rxjs';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  
  constructor(){ }
  
  ngOnInit(): void {
  }
  
}
