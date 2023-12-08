import { Injectable, NgZone } from '@angular/core';
import { PostService } from './post.service';
import { Post } from '../post.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor(private postService: PostService, private http: HttpClient, private afAuth: AngularFireAuth,
              private authService: AuthService, private ngZone: NgZone) { }

  //saving data from creating post
  saveData(post: Post){
    this.http.post(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${post.postId}.json`, post)
    .subscribe((res)=>{
      console.log(res);
      this.fetchData().subscribe();
    })
  }

  //fetching data from firebase for viewing in home
  fetchData(){
    return this.http.get('https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
    .pipe(map(responseData => Object.values(responseData)),
          tap((listsOfPosts: Post[]) => {
            this.postService.setPosts(listsOfPosts);
        })
    )
  }
 
  //updating the data 
  updateData(postId: string, updatedPost: Post) {
  this.http.put(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`, updatedPost)
    .subscribe(response => {
        console.log(response);
    });
}


  //deleting data from firebase
  deleteData(postId: string) {
    this.postService.deleteButton(postId);
    this.http.delete(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`)
        .subscribe(response => {
            console.log(response);
            this.fetchData().subscribe((posts) => { 
                this.postService.setPosts(posts);
            });
        });
}


  //comment push to firebase 
  addComment(index: number, comment: string) {
    const post = this.postService.getSpecPost(index);
    if (!post.comments) {
        post.comments = [];
    }
    post.comments.push(comment);
    this.http.put(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${index}.json`, post)
      .subscribe(response => {
        console.log(response);
      });
}



}
