import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QrCodeService } from '../../services/qr-code.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss'
})
export class QrGeneratorComponent implements OnInit {
  qrForm: FormGroup;
  qrImageUrl: SafeUrl | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private qrCodeService: QrCodeService,
    private sanitizer: DomSanitizer
  ) {
    this.qrForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // Set a default example
    this.qrForm.patchValue({ text: 'https://www.google.com' });
  }

  /**
   * Generate QR code from the form input
   */
  generateQrCode(): void {
    if (this.qrForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const text = this.qrForm.get('text')?.value?.trim();
    if (!text) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.qrImageUrl = null;

    console.log('🎯 Component - Testing simple version first...');

    // Try simple version first
    this.qrCodeService.generateQrCodeSimple(text)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (blob: Blob) => {
          console.log('🎉 Component - Received blob from SIMPLE method:', {
            size: blob.size,
            type: blob.type,
            text: text
          });

          // Validate blob
          if (!blob || blob.size === 0) {
            throw new Error('Received empty blob from server');
          }

          // Create a safe URL for the image blob
          const imageUrl = URL.createObjectURL(blob);
          console.log('🖼️ Component - Created object URL:', imageUrl);

          this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
          this.successMessage = 'QR code generated successfully!';

          console.log('✅ Component - Success! QR image ready to display');
        },
        error: (error: Error) => {
          console.error('🚨 Component - Simple method failed, trying manual encoding method...', error);

          // If simple fails, try the manual encoding version
          this.tryManualEncodingMethod(text);
        }
      });
  }

  /**
   * Try manual encoding method
   */
  private tryManualEncodingMethod(text: string): void {
    this.qrCodeService.generateQrCodeWithEncoding(text)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (blob: Blob) => {
          console.log('🎉 Component - Received blob from MANUAL ENCODING method:', {
            size: blob.size,
            type: blob.type,
            text: text
          });

          // Validate blob
          if (!blob || blob.size === 0) {
            throw new Error('Received empty blob from server');
          }

          // Create a safe URL for the image blob
          const imageUrl = URL.createObjectURL(blob);
          console.log('🖼️ Component - Created object URL:', imageUrl);

          this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
          this.successMessage = 'QR code generated successfully!';

          console.log('✅ Component - Success! QR image ready to display');
        },
        error: (error: Error) => {
          console.error('🚨 Component - Manual encoding method failed, trying HttpParams method...', error);

          // If manual encoding fails, try HttpParams method
          this.tryHttpParamsMethod(text);
        }
      });
  }

  /**
   * Try HttpParams method
   */
  private tryHttpParamsMethod(text: string): void {
    this.qrCodeService.generateQrCodeWithHttpParams(text)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (blob: Blob) => {
          console.log('🎉 Component - Received blob from HTTPPARAMS method:', {
            size: blob.size,
            type: blob.type,
            text: text
          });

          // Validate blob
          if (!blob || blob.size === 0) {
            throw new Error('Received empty blob from server');
          }

          // Create a safe URL for the image blob
          const imageUrl = URL.createObjectURL(blob);
          console.log('🖼️ Component - Created object URL:', imageUrl);

          this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
          this.successMessage = 'QR code generated successfully!';

          console.log('✅ Component - Success! QR image ready to display');
        },
        error: (error: Error) => {
          console.error('🚨 Component - HttpParams method failed, trying complex method...', error);

          // If HttpParams fails, try the complex version
          this.tryComplexMethod(text);
        }
      });
  }

  /**
   * Fallback to complex method if simple fails
   */
  private tryComplexMethod(text: string): void {
    this.qrCodeService.generateQrCode(text)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (blob: Blob) => {
          console.log('🎉 Component - Received blob from COMPLEX method:', {
            size: blob.size,
            type: blob.type,
            text: text
          });

          // Validate blob
          if (!blob || blob.size === 0) {
            throw new Error('Received empty blob from server');
          }

          // Create a safe URL for the image blob
          const imageUrl = URL.createObjectURL(blob);
          console.log('🖼️ Component - Created object URL:', imageUrl);

          this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
          this.successMessage = 'QR code generated successfully!';

          console.log('✅ Component - Success! QR image ready to display');
        },
        error: (error: Error) => {
          console.error('🚨 Component - Error occurred:', error);
          this.errorMessage = error.message || 'Failed to generate QR code. Please try again.';
        }
      });
  }

  /**
   * Download the generated QR code as PNG
   */
  downloadQrCode(): void {
    if (!this.qrImageUrl) return;

    const text = this.qrForm.get('text')?.value?.trim() || 'qrcode';
    const fileName = `qr-${text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.png`;

    // Create download link
    const link = document.createElement('a');
    link.href = this.qrImageUrl as string;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Clear the form and reset state
   */
  clearForm(): void {
    this.qrForm.reset();
    this.qrImageUrl = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Check if form field has error
   */
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.qrForm.get(fieldName);
    if (!field) return false;

    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched);
    }
    return field.invalid && (field.dirty || field.touched);
  }

  /**
   * Get error message for form field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.qrForm.get(fieldName);
    if (!field?.errors) return '';

    if (field.hasError('required')) {
      return 'This field is required';
    }
    if (field.hasError('minlength')) {
      return 'Text is too short';
    }
    if (field.hasError('maxlength')) {
      return 'Text is too long (max 500 characters)';
    }
    return 'Invalid input';
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.qrForm.controls).forEach(key => {
      const control = this.qrForm.get(key);
      control?.markAsTouched();
    });
  }
}
