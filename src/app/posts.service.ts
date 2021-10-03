import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) { }

    createAndStorePost(title: string, content: string) {
        const postData: Post = { title: title, content: content }
        // Send Http request
        this.http
            .post<{ name: string }>( //to add an item to the db
                'https://ng-db-f74bb-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
                // the firebase url https://ng-db-f74bb-default-rtdb.europe-west1.firebasedatabase.app/
                // posts is a new folder added (firebase Docs)
                //.json is to convert it to JSON
                postData //requested data
            ) //need to subscribe or the request will not be sent by Angular and RxJs
            .subscribe(responseData => { //extracted data
                console.log(responseData);
            }, error => {
                this.error.next(error.message);
            });
    }

    fetchPosts() {
        // Send Http request
    return this.http //with the return, you can subscribe on the component when you call this method
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

      }),
      catchError(errorResp => {
          // send to analystics Error
        return throwError(errorResp);
      } )
      )
    }

    deletePosts(){
        return this.http
        .delete('https://ng-db-f74bb-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
    }
}