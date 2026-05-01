import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * Global Error Interceptor
 * Catches all HTTP errors and displays a descriptive message to the user using ToastService.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Backend error
        let errorData = error.error;
        
        // If the error body is a string, try to parse it as JSON
        if (typeof errorData === 'string') {
          try {
            errorData = JSON.parse(errorData);
          } catch (e) {
            // Not JSON, keep as string
          }
        }

        if (errorData && typeof errorData === 'object' && errorData.message) {
          // Use the descriptive message from our backend ErrorResponse
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string' && errorData.length > 0) {
          // Fallback if it's just a plain string message
          errorMessage = errorData;
        } else {
          // Fallback based on status code
          switch (error.status) {
            case 400:
              errorMessage = 'Bad Request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Unauthorized. Please login again.';
              break;
            case 403:
              errorMessage = 'Forbidden. You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'Resource not found.';
              break;
            case 500:
              errorMessage = 'Internal Server Error. Please try again later.';
              break;
            default:
              errorMessage = error.message || `Error Code: ${error.status}`;
          }
        }
      }

      // Display the descriptive toast to the user
      toastService.error(errorMessage);

      // Re-throw the error so that the calling service can still handle it if needed
      return throwError(() => error);
    })
  );
};
