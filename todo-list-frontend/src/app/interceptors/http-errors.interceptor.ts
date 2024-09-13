import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

import { HttpStatusCodeMessage, loadCodes, serverErrorDefaultMessage } from './codes';


export const httpErrorsInterceptor: HttpInterceptorFn = (req, next) => {

  const errors: HttpStatusCodeMessage[] = loadCodes();

  const matSnackBar = inject(MatSnackBar);

  return next(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {

        let errorMessage = serverErrorDefaultMessage;
        let actionType = 'Error';
        if(error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = error.error.message;
        } else {
          // server-side error
          if(errors[error.status]) {
            errorMessage = errors[error.status].message;
            if(error.message) {
              console.log(error.message);
            }
            actionType = errors[error.status].http!;
          }
        }
        matSnackBar.open(errorMessage, actionType, {
          duration: 8000,
          panelClass: ['error-message']
        });

        return throwError(() => error);
    })
  );
};
