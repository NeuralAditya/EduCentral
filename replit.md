# EduCentral - AI-Powered Educational Assessment Platform

## Overview

EduCentral is a comprehensive educational platform featuring advanced AI-powered assessment and gamified learning. The platform offers: (1) Learn & Practice - a gamified learning system for DSA, algorithms, and programming concepts with XP, badges, and progress tracking, and (2) Enhanced AI Assessment - revolutionary testing with real-time webcam/microphone access, facial expression analysis using MediaPipe, speech-to-text conversion with HuggingFace APIs, emotion/confidence evaluation, and comprehensive performance reports combining content analysis with visual/audio feedback.

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
- **Database**: PostgreSQL (configured for Neon serverless) - ACTIVE
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Validation**: Zod schemas integrated with Drizzle for type safety
- **Storage**: Database-backed storage layer replacing in-memory storage
- **Sample Data**: Automatically initializes with demo user, tests, learning modules, and progress tracking

## Key Components

### Home Page & Navigation
- **Mode Selection**: Users choose between "Learn & Practice" and "Test & Assess" modes
- **Feature Overview**: Highlighting gamified learning and AI assessment capabilities
- **Responsive Design**: Modern gradient-based UI with clear navigation paths

### Gamified Learning System
- **Learning Modules**: Categorized content for DSA, algorithms, and data structures
- **XP & Leveling**: Experience points system with level progression (1000 XP per level)
- **Badge System**: Achievements and badges for milestones and consistent learning
- **Streak Tracking**: Daily learning streak maintenance with visual feedback
- **Progress Analytics**: Module completion tracking and personal statistics
- **Lesson Types**: Theory, practice, and challenge-based learning content
- **Unlock System**: Sequential lesson unlocking based on prerequisite completion

### Test Management System
- **Test Creation**: Educators can create tests with multiple question types
- **Question Types**: MCQ, short answer, video response, photo upload
- **Test Configuration**: Duration limits, difficulty levels, subject categorization
- **Publishing**: Draft/published states for test management

### Enhanced AI Assessment Engine
- **OpenAI Integration**: GPT-4o model for intelligent content assessment
- **HuggingFace Integration**: Free emotion analysis, sentiment analysis, and speech quality assessment
- **MediaPipe Integration**: Real-time facial expression analysis and emotion detection
- **Real-time Video Analysis**: Live webcam feed with facial expression tracking
- **Speech-to-Text Conversion**: Browser-based speech recognition with tone analysis
- **Multi-modal Assessment**: Combines content accuracy, delivery confidence, and emotional presentation
- **Comprehensive Scoring**: Content (50%) + Emotion confidence (15%) + Speech clarity (20%) + Facial confidence (15%)

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
- **Learning Modules**: Categorized learning content with difficulty levels
- **Lessons**: Sequential learning content with XP rewards and unlock conditions
- **User Progress**: Lesson completion tracking and time spent analytics
- **User Stats**: XP totals, levels, streaks, badges, and achievements
- **Analytics**: Performance metrics and learning statistics

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
- **Status**: PostgreSQL database active and operational
- **Storage Architecture**: Fully migrated from in-memory to persistent database storage

The architecture is designed for scalability with clear separation between frontend and backend concerns, while maintaining type safety through shared schemas and strong TypeScript integration throughout the stack.