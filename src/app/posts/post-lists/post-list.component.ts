import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { post } from '../post.model';
import { Subscription } from 'rxjs';
import { PostService } from '../PostService';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';


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
  private authSubs: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1
  pageSizeOptions = [1,2,3,4];
  isAuthenticated = false;
  constructor(public postService: PostService, public authService: AuthService, public router: Router) {}

  ngOnInit() {

      this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.isLoading = true;
    this.subs = this.postService
      .getUpdatedPostsListener()
      .subscribe((postData : {posts: post[], maxPosts:number}) => {
        this.isLoading = false;
        this.posts =postData.posts;
        this.totalPosts = postData.maxPosts;
        this.isAuthenticated = this.authService.getAuthStatus();
      });

    this.isAuthenticated = this.authService.getAuthStatus();
    this.authSubs = this.authService.getAuthStatusListener()
                                    .subscribe(isAuthenticated => {
                                      this.isAuthenticated = isAuthenticated;
                                    })


  }

  onChange(pageEvent : PageEvent ){
    console.log(pageEvent);
    this.isLoading = true;
    this.postsPerPage = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex+1;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onDelete(postID: string) {

    this.postService.deletePost(postID).subscribe(()=>{
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }


}
