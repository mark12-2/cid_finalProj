import { Component, OnInit, NgZone } from '@angular/core';
import { BackEndService } from 'src/app/data/back-end.service';
import { PostService } from 'src/app/data/post.service';
import { Post } from 'src/app/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit{
  listofPosts: Post[] = [];

  constructor(private backEndService: BackEndService, private postService: PostService, private ngZone: NgZone ) {}

  ngOnInit() {
    this.listofPosts = this.postService.getPost();

    this.backEndService.fetchData().subscribe((posts) => { 
     
        this.listofPosts = posts;

      });
    
  }

  filterPosts(searchTerm: string): void {
    if (searchTerm) {
      this.listofPosts = this.listofPosts.filter(post => post.title.includes(searchTerm));
    } else {
      this.listofPosts = this.postService.getPost();
    }
  }
}


