import { Injectable } from '@angular/core';
import { PostService } from './post.service';
import { Post } from '../post.model';
import { HttpClient } from '@angular/common/http';
import { map, take, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor(private postService: PostService, private http: HttpClient, private afAuth: AngularFireAuth, private authService: AuthService) { }

  //saving data from creating post
  saveData(post: Post){
    this.authService.getUserId().then(userId => {
        if (userId) {
            // Fetch existing posts
            this.http.get<Post[]>(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${userId}.json`)
            .pipe(take(1)) // Take only the first value from the Observable
            .subscribe(existingPosts => {
                let posts = existingPosts;
                if (!posts) {
                    posts = [];
                }
                // Add new post to the array
                posts.push(post);
                // Save updated array back to Firebase
                this.http.put(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${userId}.json`, posts)
                .subscribe((res)=>{
                    console.log(res);
                });
            });
        } else {
            console.error('User is not authenticated');
        }
    });
}

  //fetching data from firebase for viewing in home
  fetchData(){
    return this.http.get<{[key: string]: {[key: string]: Post}}>('https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
    .pipe(
        map(responseData => {
            const postArray: Post[] = [];
            for (const userKey in responseData) {
                if (responseData.hasOwnProperty(userKey)) {
                    const userPosts = responseData[userKey];
                    for (const postKey in userPosts) {
                        if (userPosts.hasOwnProperty(postKey)) {
                            const post = userPosts[postKey];
                            postArray.push(post);
                        }
                    }
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
  updateData(userId: string, postId: string, updatedPost: Post) {
    this.http.put(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${userId}/${postId}.json`, updatedPost)
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
  addComment(userId: string, postId: string, comment: string) {
    this.postService.getSpecPost(userId, postId).subscribe(post => {
        if (!post.comments) {
            post.comments = [];
        }
        post.comments.push(comment);
        this.http.put(`https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${userId}/${postId}.json`, post)
          .subscribe(response => {
            console.log(response);
          });
    });
}

}


