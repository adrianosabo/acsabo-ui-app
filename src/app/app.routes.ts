import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/qr-generator',
    pathMatch: 'full'
  },
  {
    path: 'qr-generator',
    loadComponent: () => import('./features/qr-generator/qr-generator.component').then(m => m.QrGeneratorComponent),
    title: 'QR Code Generator'
  },
  {
    path: '**',
    redirectTo: '/qr-generator'
  }
];
