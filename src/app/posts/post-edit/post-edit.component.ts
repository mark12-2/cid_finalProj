import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BackEndService } from 'src/app/data/back-end.service';
import { PostService } from 'src/app/data/post.service';
import { Post } from 'src/app/post.model';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})

export class PostEditComponent {
  //identifiers
  form!: FormGroup;
  index: number = 0;
  editMode = false;
  
  constructor(private postService:PostService, private route: Router, 
    private actRoute: ActivatedRoute, private backEndService: BackEndService,
    private authService: AuthService){}

  ngOnInit(): void{

    // identifier for parameters
let editTitle = "";
let editDescription = "";
let editImgPath = "";

      this.actRoute.params.subscribe((params: Params) => {
         if(params['index']){
          console.log(params['index']);
          this.index = params['index'];
         
          const post = this.postService.getSpecPost(this.index);

          editTitle = post.title;
          editDescription = post.description;
          editImgPath = post.imgPath;
          
          this.editMode = true;

        }
      }
      );

    this.form = new FormGroup({
      title: new FormControl(editTitle, [Validators.required]),
      imgPath: new FormControl(editImgPath, [Validators.required]),
      description: new FormControl(editDescription, [Validators.required])
     })
    }

  //submit function  
    async onsubmit(){
      const title = this.form.value.title;
      const imgPath = this.form.value.imgPath;
      const description = this.form.value.description;
      const user = await this.authService.getUserId(); // get userId from AuthService
      // const userName = await this.authService.getUserName(); // get userName from AuthService
      if (!user ) {
          console.error('User is not authenticated or user name is not set');
          return;
      }
  
      const post: Post = new Post(
          title, imgPath, description, new Date(), 0, [], user, user
      );
      
      if(this.editMode == true) {
        if (post.ownerId !== user) {
            console.error('You are not the owner of this post');
            return;
        }
        this.backEndService.updateData(this.index, post);
    } else {
        this.backEndService.saveData(post);
        // this.postService.addPost(post);
    }
    
      this.route.navigate(['post-list']);
  }

}
