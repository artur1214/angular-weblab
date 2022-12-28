import {IMedicine} from "../models/medicine";
import {Injectable} from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {IUserForm} from "../login/login.component";
import * as http from "http";
import {Router} from "@angular/router";

export interface JWTResponse {
  access: string,
  refresh: string
}

const BASE_URL = 'http://127.0.0.1:8000/api/'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {

  }

  login(values: IUserForm): Observable<JWTResponse> {
    return this.http.post<JWTResponse>(BASE_URL + 'token/', values)
  }
  vkLogin(values: string): Observable<JWTResponse> {
    return this.http.get<JWTResponse>(BASE_URL + 'vk_token?' + values)
  }

}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient, private router: Router) {

  }
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([uri]));
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const JWT = localStorage.getItem('JWT')
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + JWT),
    })

    return next.handle(authReq).pipe(
      tap(
        (event) => {
        },
        (err) => {
          console.log(err)
          if (err instanceof HttpErrorResponse) {
            console.log(1, err)
            if (err.status == 401) {
              if (err.url?.includes('refresh') || !localStorage.getItem('JWT')) {
                this.router.navigateByUrl('login')
              } else {
                this.http.post<{ access: string }>(BASE_URL + 'token/refresh/',
                  {'refresh': localStorage.getItem('JWTRefresh') || 'IDK'}
                ).subscribe((value) => {
                  localStorage.setItem('JWT', value.access)
                  window.location.reload()
                })
              }
            }


          }
        }
      )
    )
  }
}
