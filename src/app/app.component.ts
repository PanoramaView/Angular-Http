import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postsService.error.subscribe(errorMsg => {
      this.error = errorMsg;
    });

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;//we get the fetched data in an Array
    }, 
    error => {
      this.isFetching = false;
      this.error = error.message
    });
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;//we get the fetched data in an Array
    }, error => { //error handling
      this.isFetching = false;
      this.error = error.message;
    }
    );
  }

  onClearPosts() {
    this.postsService.deletePosts().subscribe(()=>{
      this.loadedPosts = [];
    })
  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(){
    this.errorSub.unsubscribe();
  }


}
