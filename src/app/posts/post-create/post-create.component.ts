import {Component} from '@angular/core';
import { post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsServiceComponent } from 'src/app/posts/PostsService.component';

@Component({
  selector : 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls:['./post-create.component.css']
})
export class PostCreateComponent{

  constructor(public postsService: PostsServiceComponent){}

  // enteredTitle = "";
  // enteredContent = "";
  //@Output() postCreated = new EventEmitter();
  onAddPost( form: NgForm){
      if(form.invalid) return;
      // const post:post = {
      //   title : form.value.title, content : form.value.content
      // };
      this.postsService.addPost(form.value.title, form.value.content);

      form.resetForm();
  }
}
