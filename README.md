# AcsaboUI - Angular Client Interface

A modern Angular 18 client interface designed to interact with back-end services. Built with TypeScript, SCSS, and Angular Router for a robust development experience.

## 🚀 Project Features

- ✅ **Angular 18** with standalone components
- ✅ **TypeScript** for type safety and better development experience
- ✅ **SCSS** for advanced styling capabilities
- ✅ **Angular Router** for navigation between views
- ✅ **Angular CLI** for development tools and scaffolding
- ✅ **VS Code** optimized with Angular extensions

## 🛠️ Getting Started

### Prerequisites
- Node.js (v22.11.0 or higher)
- npm (v8.19.2 or higher)
- Angular CLI (v18.2.11)

### Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

### Quick Start Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Build and watch for changes
npm run watch
```

## 📁 Project Structure
```
src/
├── app/
│   ├── app.component.ts     # Root component
│   ├── app.routes.ts        # Application routes
│   └── app.config.ts        # Application configuration
├── assets/                  # Static assets
├── index.html              # Main HTML file
└── main.ts                 # Application bootstrap
```

## 🔧 Development Commands

### Generate Components
```bash
# Generate a new component
ng generate component features/user-dashboard

# Generate a service
ng generate service services/api

# Generate an interface
ng generate interface models/user
```

### Build Commands
```bash
# Development build
ng build

# Production build
ng build --configuration production

# Build with file watching
ng build --watch --configuration development
```

## 🧪 Testing
```bash
# Run unit tests
ng test

# Run tests without watch mode
ng test --watch=false

# Run tests with code coverage
ng test --code-coverage
```

## 🔗 Back-end Integration

This project is designed to work with back-end services. Key patterns for API integration:

1. **Services**: Create dedicated services for API communication
2. **Models**: Define TypeScript interfaces for data structures
3. **Interceptors**: Implement authentication and error handling
4. **Environment**: Configure API endpoints in environment files

### Example Service Structure
```typescript
// services/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}
```

## 📦 Dependencies

### Core Dependencies
- **@angular/core**: Angular framework core
- **@angular/router**: Routing functionality
- **@angular/forms**: Reactive forms
- **rxjs**: Reactive programming with observables

### Development Dependencies
- **@angular/cli**: Angular command line tools
- **typescript**: TypeScript compiler
- **jasmine**: Testing framework

## 🆘 Help & Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)

## 🎯 Next Steps

1. **Set up your first component** for your application
2. **Create services** to connect to your back-end APIs
3. **Add routing** for navigation between different views
4. **Implement forms** for user input and data collection
5. **Add styling** with SCSS for a polished UI
