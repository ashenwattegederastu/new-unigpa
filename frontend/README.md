# UniGPA Frontend

Beautiful, Apple-like minimal frontend for the University GPA Calculator.

## Tech Stack

- **React** with **Next.js** - Modern React framework
- **Nextra** - Theme for documentation and layout
- JWT Authentication - Token-based authentication
- Fetch API - For backend communication

## Features

- 🔐 User authentication (login/register)
- 🎓 Manage multiple degrees
- 📚 Add modules with grades and credits
- 📊 Automatic GPA calculation
- 🎨 Beautiful glassmorphism UI design
- 📱 Fully responsive

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Configuration

The frontend expects the backend API to be available at:
- Development: `http://localhost:8080`
- Can be configured via `NEXT_PUBLIC_API_URL` environment variable

Create a `.env.local` file to override:
```
NEXT_PUBLIC_API_URL=http://your-backend-url
```

## Project Structure

```
frontend/
├─ pages/              # Next.js pages
│   ├─ index.jsx       # Login page
│   ├─ register.jsx    # Registration page
│   ├─ dashboard.jsx   # Degrees dashboard
│   └─ degree/[id].jsx # Degree detail with modules
├─ components/         # Reusable components
├─ context/           # React context (auth)
├─ layout/            # Layout components
├─ styles/            # Global styles
└─ public/            # Static assets
```

## API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Degrees
- `GET /api/degrees` - List all degrees
- `POST /api/degrees` - Create new degree
- `GET /api/degrees/{id}` - Get degree details
- `PUT /api/degrees/{id}` - Update degree
- `DELETE /api/degrees/{id}` - Delete degree
- `GET /api/degrees/{id}/gpa` - Get degree GPA

### Modules
- `GET /api/degrees/{id}/modules` - List modules for a degree
- `POST /api/degrees/{id}/modules` - Add module to degree
- `PUT /api/modules/{id}` - Update module
- `DELETE /api/modules/{id}` - Delete module

## Design System

The UI follows Apple's design principles:

- **Colors**
  - Background: Light gray (#f5f5f7)
  - Primary: Apple blue (#007AFF)
  - Success: Green (#34C759)
  - Danger: Red (#FF3B30)

- **Components**
  - Glassmorphism cards with backdrop blur
  - Soft shadows and rounded corners
  - Smooth hover animations
  - Clean typography with system fonts

## Grade Scale

The system supports the following grades:
- A+, A, A-
- B+, B, B-
- C+, C, C-
- D, F

## License

MIT License - This is a portfolio project and is free to use for educational purposes.
