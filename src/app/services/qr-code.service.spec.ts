import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QrCodeService } from './qr-code.service';

describe('QrCodeService', () => {
  let service: QrCodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QrCodeService]
    });
    service = TestBed.inject(QrCodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate QR code for simple text', () => {
    const testText = 'Hello World';
    const mockBlob = new Blob(['mock qr code'], { type: 'image/png' });

    service.generateQrCode(testText).subscribe(blob => {
      expect(blob).toBeTruthy();
      expect(blob.type).toBe('image/png');
      expect(blob.size).toBeGreaterThan(0);
    });

    const expectedUrl = '/api/qrcode?text=Hello%20World';
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    
    req.flush(mockBlob);
  });

  it('should generate QR code for URL with special characters', () => {
    const testText = 'https://www.google.com';
    const mockBlob = new Blob(['mock qr code'], { type: 'image/png' });

    service.generateQrCode(testText).subscribe(blob => {
      expect(blob).toBeTruthy();
      expect(blob.type).toBe('image/png');
    });

    const expectedUrl = '/api/qrcode?text=https%3A%2F%2Fwww.google.com';
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    
    req.flush(mockBlob);
  });

  it('should handle text with leading/trailing spaces', () => {
    const testText = '  Hello World  ';
    const mockBlob = new Blob(['mock qr code'], { type: 'image/png' });

    service.generateQrCode(testText).subscribe(blob => {
      expect(blob).toBeTruthy();
    });

    const expectedUrl = '/api/qrcode?text=Hello%20World';
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    
    req.flush(mockBlob);
  });

  it('should handle special characters and symbols', () => {
    const testText = 'Test@#$%^&*()_+{}[]|\\:";\'<>?,./';
    const mockBlob = new Blob(['mock qr code'], { type: 'image/png' });

    service.generateQrCode(testText).subscribe(blob => {
      expect(blob).toBeTruthy();
    });

    const expectedUrl = `/api/qrcode?text=${encodeURIComponent(testText)}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    
    req.flush(mockBlob);
  });

  it('should handle HTTP errors', () => {
    const testText = 'Error Test';

    service.generateQrCode(testText).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const expectedUrl = `/api/qrcode?text=${encodeURIComponent(testText)}`;
    const req = httpMock.expectOne(expectedUrl);
    
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle network errors', () => {
    const testText = 'Network Error Test';

    service.generateQrCode(testText).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const expectedUrl = `/api/qrcode?text=${encodeURIComponent(testText)}`;
    const req = httpMock.expectOne(expectedUrl);
    
    req.error(new ErrorEvent('Network error'));
  });

  it('should properly encode complex URLs', () => {
    const testText = 'https://example.com/path?param1=value1&param2=value2#section';
    const mockBlob = new Blob(['mock qr code'], { type: 'image/png' });

    service.generateQrCode(testText).subscribe(blob => {
      expect(blob).toBeTruthy();
    });

    const expectedUrl = `/api/qrcode?text=${encodeURIComponent(testText)}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    
    req.flush(mockBlob);
  });

  it('should handle empty string', () => {
    const testText = '';
    const mockBlob = new Blob(['mock qr code'], { type: 'image/png' });

    service.generateQrCode(testText).subscribe(blob => {
      expect(blob).toBeTruthy();
    });

    const expectedUrl = '/api/qrcode?text=';
    const req = httpMock.expectOne(expectedUrl);
    
    req.flush(mockBlob);
  });
});
