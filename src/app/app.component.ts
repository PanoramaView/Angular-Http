import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.http
      .post<{name: string}>( //to add an item to the db
        'https://ng-db-f74bb-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        // the firebase url https://ng-db-f74bb-default-rtdb.europe-west1.firebasedatabase.app/
        // posts is a new folder added (firebase Docs)
        //.json is to convert it to JSON
        postData //requested data
      ) //need to subscribe or the request will not be sent by Angular and RxJs
      .subscribe(responseData => { //extracted data
        console.log(responseData);
      });
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
  }
  private fetchPosts(){
    this.isFetching = true;
    // Send Http request
    this.http
    // resp is an Object with Post nested inside, so now TS knows what type of date is 'resp'
    .get<{[key: string]: Post}>('https://ng-db-f74bb-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
    .pipe(// filter your observable data through operations (but not subscribable anymore)

    // then return it into an Observable, so that we can subscribe again
      map((resp) => { 
        //we want to create an array with the posts from the API call, so that we can print the data on the UI
        const postsArray: Post[] = [];
        for(const key in resp) {
            if (resp.hasOwnProperty(key)){
            postsArray.push({...resp[key], id: key});
          }
        }
        return postsArray;

      })) 
    
    .subscribe(resp => {
      this.isFetching = false;
      this.loadedPosts = resp; //we get the fetched data in an Array
      console.log(resp);
    })
  }
}
