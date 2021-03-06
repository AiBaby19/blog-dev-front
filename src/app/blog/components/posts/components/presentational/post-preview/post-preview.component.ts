import {Component, Input, OnInit, Output} from '@angular/core';
import {Post} from '../../../../../../admin/manage-posts/models/Post.model';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.css']
})
export class PostPreviewComponent implements OnInit {

  constructor() { }

  @Input() post: Post;

  ngOnInit() {
  }
}
