import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

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
  generateQrCode(text: string): Observable<Blob> {
    const url = `${this.apiUrl}/qrcode`;
    const params = { text: text.trim() };

    console.log('🚀 QR Service - Making request to:', url);
    console.log('� QR Service - With params:', params);

    return this.http.get(url, {
      params,
      responseType: 'blob'
    }).pipe(
      tap((blob: Blob) => {
        console.log('✅ QR Service - Success! Received blob:', {
          size: blob.size,
          type: blob.type
        });
      }),
      catchError((error) => {
        console.error('🚨 QR Service - Error:', error);
        console.error('🚨 Request URL was:', url);
        console.error('🚨 Request params were:', params);
        throw error;
      })
    );
  }
}
