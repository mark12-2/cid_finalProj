import { Injectable } from '@angular/core';
import { PostService } from './post.service';
import { Post } from '../post.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor(private postService: PostService, private http: HttpClient, private afAuth: AngularFireAuth) { }

  //saving data from creating post
  saveData(post: Post){
    this.http.post(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json`, post)
    .subscribe((res)=>{
      console.log(res);
    })
}

  //fetching data from firebase for viewing in home
  fetchData(){
    return this.http.get<{[key: string]: Post}>('https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
    .pipe(
        map(responseData => {
            const postArray: Post[] = [];
            for (const key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                    postArray.push(responseData[key]);
                }
            }
            return postArray;
        }),
        tap((listsOfPosts: Post[]) => {
            console.log(listsOfPosts);
            this.postService.setPosts(listsOfPosts);
        })
    )
}
 
  //updating the data 
  updateData(index: number, updatedPost: Post) {
        this.postService.updatePost(index, updatedPost);
    this.http.put(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${index}.json`, updatedPost)
        .subscribe(response => {
            console.log(response);
        });
  }

  //deleting data from firebase
  deleteData(index: number){
    this.postService.deleteButton(index);
    this.http.delete(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${index}.json`)
        .subscribe(response => {
            console.log(response);
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
