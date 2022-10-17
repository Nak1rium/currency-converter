import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = MainInterceptor.addApiKey(request, environment.apiKey);
    return next.handle(request);
  }

  private static addApiKey(request: HttpRequest<any>, apiKey: string): HttpRequest<any> {
    return request.clone({
        params: request.params.set('api_key', apiKey)
      }
    )
  }

}
