import {Component, Input} from '@angular/core';
import {Post} from '../../../models/Post.model';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent {

  @Input() post: Post;
}
