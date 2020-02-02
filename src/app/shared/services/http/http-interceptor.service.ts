import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationsService } from '../../../blog/features/notifications/notifications.service';
import { LoaderService } from '../loader.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor(
    private notificationsService: NotificationsService,
    private loaderService: LoaderService
  ) {}

  static getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Authorization, Origin',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE'
    });
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clone = req.clone({
      headers:
        req.body instanceof FormData
          ? HttpInterceptorService.getHttpHeaders().delete('Content-Type')
          : HttpInterceptorService.getHttpHeaders()
    });

    this.requests.push(req);
    this.loaderService.isLoading.next(true);

    return next.handle(clone).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.removeRequest(req);
          this.handleFailed(event);
          this.loaderService.isLoading.next(false);
        }
      }),
      catchError(this.handleError)
    );
  }

  handleFailed(event) {
    if (event.body && event.body.status >= 400) {
      this.loaderService.isLoading.next(false);
      this.notificationsService.notify(event.body);
    }
  }

  handleError(error: HttpErrorResponse) {
    this.loaderService.isLoading.next(false);

    try {
      this.notificationsService.failed('Please try again later');

      return throwError(error);
    } catch (e) {
      this.loaderService.isLoading.next(false);
      console.log('Please try again later');
    }
  }
}
