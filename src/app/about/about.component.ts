import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'external.js';

declare var myExtObject: any

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor( private route: ActivatedRoute ) { }

  mode = '';
  
  ngOnInit() {
  
    this.mode = this.route.snapshot.paramMap.get('online');
    console.log(this.mode);
  }

  getAssignment(){
   
    myExtObject.getAssignmentData(this.mode);
  }

  getDiscussion(){
  
    myExtObject.getDiscussionData(this.mode);
  }

}
