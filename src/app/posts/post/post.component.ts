import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BackEndService } from 'src/app/data/back-end.service';
import { PostService } from 'src/app/data/post.service';
import { Post } from 'src/app/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit{
  @Input() index: number = 0;
  @Input() post?: Post;
    commentText: any;
    currentUser: string | null = null;
    
    constructor(private postService: PostService, private router: Router, 
      private backEndService: BackEndService, private authService: AuthService){
  
    }
   
    async ngOnInit(): Promise<void>{
      console.log('PostComponent post:', this.post);
      this.currentUser = await this.authService.getUserEmail();
    }

    delete() {
      if (this.post) {
        this.backEndService.deleteData(this.post.postId);
      }
    }

    onEdit(){
      this.router.navigate(['/post-edit', this.index]);
    }
    

    // user restrictions in other functions if not logged in
      addAComment(commentText: string){
        if(commentText.trim() !== ''){
          this.backEndService.addComment(this.index, commentText);
          this.commentText = '';
        }
      }
  
  
      onClick() {
          if (!this.authService.userLoggedIn) {
              alert('You must be logged in to like a post.');
              return;
          }
          this.postService.likePost(this.index)
      }





    // onClick() {
    //   this.postService.likePost(this.index)
    //   }
    
    //   //comment part func
    //   addAComment(commentText: string){
    //     if(commentText.trim() !== ''){
    //       this.backEndService.addComment(this.index, commentText);
    //       this.commentText = '';
    //     }
    //   }
  
  }
  