import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    const trimmedText = text.trim();

    // Try manual URL encoding for better control
    const encodedText = encodeURIComponent(trimmedText);
    const fullUrl = `${url}?text=${encodedText}`;

    console.log('🚀 QR Service - Making request to:', url);
    console.log('🚀 QR Service - With params:', { text: trimmedText });
    console.log('🔍 URL encoding analysis:', {
      originalText: text,
      trimmedText: trimmedText,
      hasProtocol: trimmedText.includes('://'),
      hasSlashes: trimmedText.includes('/'),
      hasColons: trimmedText.includes(':'),
      manualEncoded: encodedText,
      fullUrl: fullUrl
    });

    return this.http.get(fullUrl, {
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
        console.error('🚨 Request URL was:', fullUrl);
        console.error('🚨 Original text was:', trimmedText);
        throw error;
      })
    );
  }
}
