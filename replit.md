# EduCentral - AI-Powered Educational Assessment Platform

## Overview

EduCentral is a comprehensive educational assessment platform that provides AI-powered mock tests with support for multiple question types including video responses, photo submissions, multiple-choice questions, and text-based answers. The platform features real-time assessment using OpenAI's API for intelligent feedback and scoring.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with custom configuration for monorepo structure

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with Express routes
- **File Uploads**: Multer middleware for handling media files
- **Development**: Hot module replacement via Vite middleware

### Database and ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Validation**: Zod schemas integrated with Drizzle for type safety

## Key Components

### Authentication & User Management
- Role-based access (student/educator)
- User session management
- PostgreSQL-based user storage

### Test Management System
- **Test Creation**: Educators can create tests with multiple question types
- **Question Types**: MCQ, short answer, video response, photo upload
- **Test Configuration**: Duration limits, difficulty levels, subject categorization
- **Publishing**: Draft/published states for test management

### AI Assessment Engine
- **OpenAI Integration**: GPT-4o model for intelligent assessment
- **Video Assessment**: Transcription and evaluation of video responses
- **Photo Assessment**: Image analysis for diagram accuracy and completeness
- **Text Assessment**: Natural language processing for written responses
- **Scoring Criteria**: Configurable AI criteria for different assessment types

### Media Handling
- **Video Recording**: Browser-based video capture with MediaRecorder API
- **Photo Capture**: Camera integration for photo submissions
- **File Upload**: Multer-based file handling with size limits (10MB)
- **Storage**: In-memory storage for development (extensible to cloud storage)

### Real-time Features
- **Test Timer**: Countdown timers for test duration management
- **Progress Tracking**: Question navigation and completion status
- **Live Assessment**: Real-time AI evaluation during test completion

## Data Flow

### Test Taking Flow
1. User selects available test from dashboard
2. System creates test attempt record
3. Questions are presented sequentially with media capture capabilities
4. Answers are submitted and processed through AI assessment
5. Final scores and feedback are generated and stored

### Assessment Pipeline
1. Media files (video/photo) are uploaded via Multer
2. OpenAI API processes content for evaluation
3. AI-generated scores and feedback are stored with answers
4. Overall test performance is calculated and recorded

### Data Storage
- **Users**: Authentication and profile information
- **Tests**: Test metadata, questions, and configuration
- **Attempts**: Test session tracking and completion status
- **Answers**: Individual responses with AI assessment results
- **Analytics**: Performance metrics and user statistics

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for content assessment
- **Speech-to-Text**: Audio transcription for video responses
- **Image Analysis**: Photo evaluation capabilities

### Development Tools
- **Replit Integration**: Development environment optimization
- **ESBuild**: Production build optimization
- **PostCSS**: CSS processing with Tailwind

### UI Libraries
- **Radix UI**: Headless component primitives
- **Lucide Icons**: Consistent iconography
- **Embla Carousel**: Interactive content presentation
- **React Hook Form**: Form state management

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite middleware integration with Express
- **Type Safety**: Shared TypeScript types between client and server
- **Path Aliases**: Simplified imports with @ and @shared aliases

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built client files
- **Environment Variables**: Database URL and OpenAI API key configuration

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Connection**: Neon serverless PostgreSQL integration
- **Development**: Push-based schema updates for rapid iteration

The architecture is designed for scalability with clear separation between frontend and backend concerns, while maintaining type safety through shared schemas and strong TypeScript integration throughout the stack.