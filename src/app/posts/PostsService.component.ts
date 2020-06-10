import {post} from './post.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn:"root"})
export class PostsServiceComponent{
    private posts : post[] = [];
    private updatedPosts  = new Subject<post[]>();

    constructor(private http: HttpClient){}

    getPosts(){
      this.http.get<{message:string, posts:post[]}>('http://localhost:3000/api/posts')
               .subscribe((postData) => {
                  this.posts = postData.posts
                  this.updatedPosts.next([...this.posts]);
                });
    }

    getUpdatedPostsListener(){
      return this.updatedPosts.asObservable();
    }
    addPost(title:string, content:string) {
      const post = {id:null, title : title, content: content};
      this.http.post<{message:string}>('http://localhost:3000/api/posts',post)
               .subscribe((responseData)=>{
                 console.log(responseData.message);
                 this.posts.push(post);
                 this.updatedPosts.next([...this.posts]);
               });

    }
}
