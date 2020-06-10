import {post} from './post.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({providedIn:"root"})
export class PostsServiceComponent{
    private posts : post[] = [];
    private updatedPosts  = new Subject<post[]>();

    getPosts(){
      return [...this.posts];
    }

    getUpdatedPostsListener(){
      return this.updatedPosts.asObservable();
    }
    addPost(title:string, content:string) {
      const post = {title : title, content: content};
      this.posts.push(post);
      this.updatedPosts.next([...this.posts]);
    }
}
