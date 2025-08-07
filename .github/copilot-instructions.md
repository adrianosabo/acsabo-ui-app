# GitHub Copilot Instructions for Angular Client Interface

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is an Angular 18 client interface project designed to interact with back-end services. The project uses:

- **Angular 18** with standalone components
- **TypeScript** for type safety
- **SCSS** for styling
- **Angular Router** for navigation
- **Angular CLI** for development tools

## Development Guidelines
When working on this project, please:

1. **Follow Angular Best Practices:**
   - Use standalone components (Angular 16+ pattern)
   - Implement reactive forms with FormBuilder
   - Use Angular services for API communication
   - Follow Angular style guide naming conventions

2. **TypeScript Standards:**
   - Use strict typing wherever possible
   - Create interfaces for API responses
   - Use enums for constants
   - Implement proper error handling

3. **API Integration:**
   - Create dedicated services for back-end communication
   - Use Angular HttpClient with proper error handling
   - Implement loading states and error messages
   - Use environment configurations for API endpoints

4. **Component Structure:**
   - Keep components focused and single-purpose
   - Use Angular lifecycle hooks appropriately
   - Implement OnPush change detection when possible
   - Create reusable components for common UI elements

5. **Code Organization:**
   - Group related features in modules/feature folders
   - Use barrel exports (index.ts) for clean imports
   - Separate shared utilities into shared folder
   - Follow the Angular folder structure conventions

## Common Patterns for Back-end Integration
- Use services with dependency injection
- Implement interceptors for authentication/logging
- Create models/interfaces for data structures
- Use observables for asynchronous operations
