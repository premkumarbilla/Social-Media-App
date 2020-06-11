import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { post } from '../post.model';
import { Subscription } from 'rxjs';
import { PostService } from '../PostService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class postListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: "First" , content : "first"},
  //   {title: "Second" , content : "Second"},
  //   {title: "THird" , content : "THird"}
  // ]
  //@Input()
  posts: post[] = [];
  private subs: Subscription;
  isLoading = false;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts();
    this.isLoading = true;
    this.subs = this.postService
      .getUpdatedPostsListener()
      .subscribe((posts: post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onDelete(postID: string) {
    console.log('Delete clicked ' + postID);
    this.postService.deletePost(postID);
  }
}
