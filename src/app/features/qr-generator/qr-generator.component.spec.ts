import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { QrGeneratorComponent } from './qr-generator.component';
import { QrCodeService } from '../../services/qr-code.service';

describe('QrGeneratorComponent', () => {
  let component: QrGeneratorComponent;
  let fixture: ComponentFixture<QrGeneratorComponent>;
  let qrCodeService: jasmine.SpyObj<QrCodeService>;

  beforeEach(async () => {
    const qrCodeServiceSpy = jasmine.createSpyObj('QrCodeService', ['generateQrCode']);

    await TestBed.configureTestingModule({
      imports: [
        QrGeneratorComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: QrCodeService, useValue: qrCodeServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrGeneratorComponent);
    component = fixture.componentInstance;
    qrCodeService = TestBed.inject(QrCodeService) as jasmine.SpyObj<QrCodeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.qrForm).toBeTruthy();
    expect(component.qrImageUrl).toBeNull();
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
  });

  it('should have default text in form', () => {
    expect(component.qrForm.get('text')?.value).toBe('https://www.google.com');
  });

  it('should validate required field', () => {
    const textControl = component.qrForm.get('text');
    textControl?.setValue('');
    textControl?.markAsTouched();
    
    expect(textControl?.hasError('required')).toBeTruthy();
    expect(component.getErrorMessage('text')).toBe('This field is required');
  });

  it('should validate minimum length', () => {
    const textControl = component.qrForm.get('text');
    // For minLength to trigger, we need a non-empty string that's too short
    // But since minLength(1) means at least 1 char, empty string triggers required first
    // So let's test with a scenario where required passes but minlength could fail
    textControl?.setValue('a');  // This should pass both required and minlength(1)
    textControl?.markAsTouched();
    
    expect(textControl?.hasError('minlength')).toBeFalsy();
    expect(textControl?.hasError('required')).toBeFalsy();
  });

  it('should validate maximum length', () => {
    const textControl = component.qrForm.get('text');
    const longText = 'a'.repeat(501);
    textControl?.setValue(longText);
    textControl?.markAsTouched();
    
    expect(textControl?.hasError('maxlength')).toBeTruthy();
    expect(component.getErrorMessage('text')).toBe('Text is too long (max 500 characters)');
  });

  it('should not generate QR code when form is invalid', () => {
    component.qrForm.get('text')?.setValue('');
    
    component.generateQrCode();
    
    expect(qrCodeService.generateQrCode).not.toHaveBeenCalled();
  });

  it('should generate QR code successfully', () => {
    const mockBlob = new Blob(['mock qr code'], { type: 'image/png' });
    qrCodeService.generateQrCode.and.returnValue(of(mockBlob));
    
    component.qrForm.get('text')?.setValue('Test QR Code');
    
    component.generateQrCode();
    
    expect(qrCodeService.generateQrCode).toHaveBeenCalledWith('Test QR Code');
    expect(component.isLoading).toBeFalse();
    expect(component.successMessage).toBe('QR code generated successfully!');
    expect(component.qrImageUrl).toBeTruthy();
  });

  it('should handle QR code generation error', () => {
    const error = new Error('Generation failed');
    qrCodeService.generateQrCode.and.returnValue(throwError(() => error));
    
    component.qrForm.get('text')?.setValue('Test QR Code');
    
    component.generateQrCode();
    
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toContain('Failed to generate QR code');
    expect(component.qrImageUrl).toBeNull();
  });

  it('should reset form and clear state', () => {
    component.qrImageUrl = 'some-url' as any;
    component.errorMessage = 'some error';
    component.successMessage = 'some success';
    
    component.clearForm();
    
    expect(component.qrForm.get('text')?.value).toBeNull();
    expect(component.qrImageUrl).toBeNull();
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
  });

  it('should download QR code when available', () => {
    // Mock document.createElement and related DOM methods
    const mockLink = {
      href: '',
      download: '',
      click: jasmine.createSpy('click')
    };
    spyOn(document, 'createElement').and.returnValue(mockLink as any);
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    
    component.qrImageUrl = 'blob:test-url' as any;
    component.qrForm.get('text')?.setValue('Test QR');
    
    component.downloadQrCode();
    
    expect(mockLink.href).toBe('blob:test-url');
    expect(mockLink.download).toBe('qr-Test_QR.png');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should not download when no QR code available', () => {
    spyOn(document, 'createElement');
    
    component.qrImageUrl = null;
    component.downloadQrCode();
    
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it('should mark form as touched when validation fails', () => {
    const textControl = component.qrForm.get('text');
    textControl?.setValue('');
    
    component.generateQrCode();
    
    expect(textControl?.touched).toBeTruthy();
  });

  it('should handle different error types in getErrorMessage', () => {
    const textControl = component.qrForm.get('text');
    
    // Test required error
    textControl?.setErrors({ required: true });
    textControl?.markAsTouched();
    expect(component.getErrorMessage('text')).toBe('This field is required');
    
    // Test minlength error
    textControl?.setErrors({ minlength: { requiredLength: 1, actualLength: 0 } });
    expect(component.getErrorMessage('text')).toBe('Text is too short');
    
    // Test maxlength error
    textControl?.setErrors({ maxlength: { requiredLength: 500, actualLength: 501 } });
    expect(component.getErrorMessage('text')).toBe('Text is too long (max 500 characters)');
    
    // Test no errors
    textControl?.setErrors(null);
    expect(component.getErrorMessage('text')).toBe('');
  });

  it('should check if form field has errors with hasError method', () => {
    const textControl = component.qrForm.get('text');
    
    // Test no errors
    textControl?.setErrors(null);
    expect(component.hasError('text')).toBeFalse();
    
    // Test with errors but not touched
    textControl?.setErrors({ required: true });
    expect(component.hasError('text')).toBeFalse();
    
    // Test with errors and touched
    textControl?.markAsTouched();
    expect(component.hasError('text')).toBeTrue();
    
    // Test specific error type
    expect(component.hasError('text', 'required')).toBeTrue();
    expect(component.hasError('text', 'minlength')).toBeFalse();
    
    // Test non-existent field
    expect(component.hasError('nonexistent')).toBeFalse();
  });

  it('should return empty string for non-existent field in getErrorMessage', () => {
    expect(component.getErrorMessage('nonexistent')).toBe('');
  });
});
