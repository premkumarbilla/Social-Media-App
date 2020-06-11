import { post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: post[] = [];
  private updatedPosts = new Subject<post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath : post.imagePath
            };
          });
        })
      )
      .subscribe((postData) => {
        this.posts = postData;
        //console.log(this.posts);
        this.updatedPosts.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
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
        console.log(responseData.message);
        const post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.updatedPosts.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: String) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts2 = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts2;
        this.updatedPosts.next([...this.posts]);
      });
  }

  updatePost(postId: string, title: string, content: string,image:null) {
    const post = {
      id: postId,
      title: title,
      content: content,
      imagePath: image
    };
    this.http
      .put('http://localhost:3000/api/posts/' + postId, post)
      .subscribe((responseData) => {
        const oldPostIndex = this.posts.findIndex((post) => {
          post.id = postId;
        });
        this.posts[oldPostIndex] = post;
        this.updatedPosts.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
