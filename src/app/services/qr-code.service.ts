import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  private readonly apiUrl = '/api'; // Use proxy instead of direct localhost:8080

  constructor(private http: HttpClient) { }

  /**
   * Generate QR code image from text
   * @param text The text to encode in the QR code
   * @returns Observable<Blob> containing the PNG image data
   */

  // Simple version for testing
  generateQrCodeSimple(text: string): Observable<Blob> {
    const trimmedText = text.trim();
    const params = { text: trimmedText };
    const url = `${this.apiUrl}/qrcode`;

    console.log('🚀 Simple QR Service - Starting request:', {
      url,
      params,
      originalText: text,
      trimmedText: trimmedText,
      textLength: trimmedText.length
    });

    // Let's see what Angular actually constructs
    const testParams = new URLSearchParams(params);
    console.log('🔍 Simple method URL construction:', {
      baseUrl: url,
      paramsObject: params,
      urlSearchParams: testParams.toString(),
      wouldBe: `${url}?${testParams.toString()}`
    });

    return this.http.get(url, {
      params,
      responseType: 'blob'
    }).pipe(
      tap((blob: Blob) => {
        console.log('✅ Simple QR Service - Received blob:', {
          size: blob.size,
          type: blob.type,
          text: trimmedText
        });

        // If we get HTML instead of image, let's see what it contains
        if (blob.type === 'text/html') {
          console.warn('⚠️ Received HTML instead of image! Reading content...');
          blob.text().then(htmlContent => {
            console.error('🚨 HTML Response Content:', htmlContent);
          });
        }
      }),
      catchError((error) => {
        console.error('🚨 Simple QR Service Error:', error);
        console.error('🚨 Failed for text:', trimmedText);
        return throwError(() => error);
      })
    );
  }

  // Alternative method with manual URL encoding
  generateQrCodeWithEncoding(text: string): Observable<Blob> {
    const trimmedText = text.trim();
    const encodedText = encodeURIComponent(trimmedText);
    const url = `${this.apiUrl}/qrcode?text=${encodedText}`;

    console.log('🚀 Manual Encoding QR Service - Starting request:', {
      url,
      originalText: text,
      trimmedText: trimmedText,
      encodedText: encodedText,
      textLength: trimmedText.length,
      containsHttps: trimmedText.includes('https://'),
      containsColon: trimmedText.includes(':'),
      containsSlash: trimmedText.includes('/'),
      actualRequestUrl: url
    });

    // Let's also try using HttpParams to build the URL properly
    console.log('🔍 URL Analysis:', {
      baseUrl: this.apiUrl,
      endpoint: '/qrcode',
      parameter: `text=${encodedText}`,
      fullUrl: url,
      urlLength: url.length
    });

    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap((blob: Blob) => {
        console.log('✅ Manual Encoding QR Service - Received blob:', {
          size: blob.size,
          type: blob.type,
          text: trimmedText
        });
      }),
      catchError((error) => {
        console.error('🚨 Manual Encoding QR Service Error:', error);
        console.error('🚨 Failed for text:', trimmedText);
        console.error('🚨 Failed for encoded text:', encodedText);
        console.error('🚨 Failed URL:', url);
        console.error('🚨 Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          name: error.name
        });
        return throwError(() => error);
      })
    );
  }

  // Method using HttpParams (Angular recommended way)
  generateQrCodeWithHttpParams(text: string): Observable<Blob> {
    const trimmedText = text.trim();
    const url = `${this.apiUrl}/qrcode`;

    // Use Angular's HttpParams for proper parameter handling
    const params = new HttpParams().set('text', trimmedText);

    console.log('🚀 HttpParams QR Service - Starting request:', {
      url,
      originalText: text,
      trimmedText: trimmedText,
      textLength: trimmedText.length,
      containsHttps: trimmedText.includes('https://'),
      containsColon: trimmedText.includes(':'),
      containsSlash: trimmedText.includes('/'),
      httpParams: params.toString(),
      finalUrl: `${url}?${params.toString()}`
    });

    return this.http.get(url, {
      params: params,
      responseType: 'blob'
    }).pipe(
      tap((blob: Blob) => {
        console.log('✅ HttpParams QR Service - Received blob:', {
          size: blob.size,
          type: blob.type,
          text: trimmedText
        });
      }),
      catchError((error) => {
        console.error('🚨 HttpParams QR Service Error:', error);
        console.error('🚨 Failed for text:', trimmedText);
        console.error('🚨 HttpParams string:', params.toString());
        console.error('🚨 Final URL would be:', `${url}?${params.toString()}`);
        console.error('🚨 Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          name: error.name
        });
        return throwError(() => error);
      })
    );
  }

  generateQrCode(text: string): Observable<Blob> {
    const params = { text: text.trim() };
    const url = `${this.apiUrl}/qrcode`;

    console.log('🚀 QR Service - Starting request:', {
      url,
      params,
      text: text.trim()
    });

    return this.http.get(url, {
      params,
      responseType: 'blob', // Important: tells Angular to expect binary data
      headers: {
        'Accept': 'image/png, image/*, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      observe: 'response', // Get full response with headers
      withCredentials: false // Explicitly handle CORS
    }).pipe(
      retry(2), // Retry failed requests twice
      tap((response: HttpResponse<Blob>) => {
        console.log('✅ QR Service - Response received:', {
          status: response.status,
          statusText: response.statusText,
          headers: this.logHeaders(response.headers),
          bodySize: response.body?.size || 0,
          contentType: response.headers.get('content-type')
        });

        // Print full response object as JSON string
        console.log('📋 Full Response Object (stringified):', JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          headers: this.logHeaders(response.headers),
          url: response.url,
          type: response.type,
          ok: response.ok
        }, null, 2));

        // Log blob details
        if (response.body) {
          console.log('📄 Blob details:', {
            size: response.body.size,
            type: response.body.type
          });

          // Print blob details as JSON string
          console.log('📄 Blob details (stringified):', JSON.stringify({
            size: response.body.size,
            type: response.body.type,
            constructor: response.body.constructor.name
          }, null, 2));
        }
      }),
      map((response: HttpResponse<Blob>) => {
        if (!response.body) {
          throw new Error('No response body received');
        }

        // Validate that we received a proper image
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.startsWith('image/')) {
          console.warn('⚠️ Unexpected content-type:', contentType);
          throw new Error(`Expected image content but received: ${contentType}`);
        }

        // Validate blob size
        if (response.body.size === 0) {
          throw new Error('Received empty image data');
        }

        console.log('✅ Valid image blob received:', {
          size: response.body.size,
          type: response.body.type,
          contentType: contentType
        });

        return response.body;
      }),
      catchError(this.handleError)
    );
  }  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    console.error('🚨 Full error object:', error);
    console.error('🚨 Error object (stringified):', JSON.stringify({
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      name: error.name,
      ok: error.ok,
      headers: error.headers ? this.logHeaders(error.headers) : null,
      error: error.error
    }, null, 2));

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else if (error.status === 0) {
      // Status 0 usually means CORS or network issue
      errorMessage = `CORS/Network Error: Cannot connect to ${this.apiUrl}. Check if backend has CORS enabled for localhost:4200`;
      console.error('🚨 Likely CORS issue - Backend needs to allow origin: http://localhost:4200');
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error('🚨 QR Code Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Helper method to log HTTP headers
   */
  private logHeaders(headers: any): any {
    const headerObj: any = {};
    headers.keys().forEach((key: string) => {
      headerObj[key] = headers.get(key);
    });
    return headerObj;
  }
}
