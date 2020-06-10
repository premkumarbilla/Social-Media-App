import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { post } from '../post.model';
import {Subscription} from 'rxjs';
import {PostsServiceComponent} from '../PostsService.component'
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class postListComponent implements OnInit, OnDestroy{
  // posts = [
  //   {title: "First" , content : "first"},
  //   {title: "Second" , content : "Second"},
  //   {title: "THird" , content : "THird"}
  // ]
  //@Input()
  posts:post[] = [];
  private subs : Subscription;


  constructor(public postService : PostsServiceComponent){}

  ngOnInit(){
    this.postService.getPosts();
    this.subs = this.postService.getUpdatedPostsListener()
    .subscribe((posts: post[]) =>{
            this.posts = posts;
        });
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
