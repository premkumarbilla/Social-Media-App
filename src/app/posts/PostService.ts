import { post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Form } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: post[] = [];
  private updatedPosts = new Subject<{posts:post[], maxPosts:number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage : number, currentPage : number) {
    const queryParams =  `?pageSize=${postsPerPage}&&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts:number}>('http://localhost:3000/api/posts'+queryParams)
      .pipe(
        map(postData => {
          return{
            posts: postData.posts.map( post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath : post.imagePath
            };
          }),
          maxPosts : postData.maxPosts}
        })
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        //console.log(this.posts);
        this.updatedPosts.next({posts: [...this.posts], maxPosts:postData.maxPosts});
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath:string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  getUpdatedPostsListener() {
    return this.updatedPosts.asObservable();
  }
  addPost(title: string, content: string, image: File) {
    const post = new FormData();
    post.append('title', title);
    post.append('content', content);
    post.append('image', image, title);
    this.http
      .post<{ message: string; post : post }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: String) {
    return this.http
      .delete('http://localhost:3000/api/posts/' + postId);
  }

  updatePost(postId: string, title: string, content: string,image:File | string) {
    let post : post | FormData;
    if(typeof(image) === 'object'){
      post = new FormData();
      post.append("id",postId),
      post.append("title", title),
      post.append("content", content),
      post.append("image", image, title)
    }
    else {
      post : post =  {
        id:postId,
        title:title,
        content: content,
        imagePath : image
      }
    }

    this.http
      .put<{ message: string; post : post }>('http://localhost:3000/api/posts/' + postId, post)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }
}
