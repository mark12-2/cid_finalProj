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
  originalPosts: Post[] = [];

  constructor(private backEndService: BackEndService, private postService: PostService, private ngZone: NgZone ) {}

  ngOnInit() {
    this.originalPosts = this.postService.getPost();
    this.listofPosts = [...this.originalPosts];

    this.backEndService.fetchData().subscribe((posts) => {  
      
        this.originalPosts = posts;
        this.listofPosts = [...this.originalPosts];

      });
    
  }

  filterPosts(searchTerm: string): void {
    if (searchTerm) {
      this.listofPosts = this.originalPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.listofPosts = [...this.originalPosts];
    }
  }
  
}


