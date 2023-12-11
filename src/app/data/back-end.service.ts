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
    this.http.post<{name: string}>(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json`, post)
    .subscribe((res)=>{
      console.log(res);
      post.postId = res.name;
      this.postService.addPost(post);
    })
  }

  //fetching data from firebase for viewing in home
  fetchData(){
    return this.http.get<Record<string, Post>>('https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
    .pipe(map(responseData => {
      const postsArray: Post[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          let newPost = new Post(responseData[key].title, responseData[key].imgPath, responseData[key].description, responseData[key].dateCreated, responseData[key].numberOfLikes, responseData[key].comments, responseData[key].ownerId, responseData[key].userEmail);
          newPost.postId = key;
          postsArray.push(newPost);
        }
      }
      return postsArray;
    }),
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
          this.postService.updatePost(Number(postId), updatedPost);
          this.fetchData().subscribe((posts) => { 
              this.postService.setPosts(posts);
          });
      });
  }


  //deleting data from firebase
  deleteData(postId: string) {
    if (window.confirm('Are you sure you want to delete this post?')) {
      this.postService.deleteButton(postId);
      this.http.delete(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`)
          .subscribe(response => {
              console.log(response);
              this.fetchData().subscribe((posts) => { 
                  this.postService.setPosts(posts);
              });
          });
    }
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
