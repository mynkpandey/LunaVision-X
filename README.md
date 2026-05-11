
# LunaVision-X AI Lunar Analysis

AI-Assisted Ice Detection &amp; Mapping in Permanently Shadowed Lunar Regions using Chandrayaan-2 OHRC Imagery.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
  - [Ice Detection Algorithm](#ice-detection-algorithm)
  - [Image Analysis Pipeline](#image-analysis-pipeline)
- [Application Pages](#application-pages)
- [Scientific Background](#scientific-background)
- [Student Information](#student-information)

---

## About the Project

LunaVision-X is an advanced web-based application designed for AI-assisted detection and mapping of ice deposits in Permanently Shadowed Regions (PSRs) on the Moon. Built using modern web technologies, this application analyzes high-resolution imagery from Chandrayaan-2's Orbiter High Resolution Camera (OHRC) to identify potential water ice deposits through brightness-based detection algorithms.

**Key Highlights:**
- Real image analysis - telemetry values are computed from actual pixel data
- Interactive 3D terrain visualization
- Multi-layer image analysis views
- Real-time telemetry and analytics dashboard
- Client-side processing - no external server dependencies

---

## Features

### 🚀 Core Functionality
- **Image Upload:** Support for TIFF, PNG, JPG formats up to 500MB via drag &amp; drop
- **AI Ice Detection:** Brightness-based detection using statistical analysis
- **Telemetry Calculation:** Ice probability, reflective intensity, SNR, PSNR, SSIM, and more
- **Multi-Layer Views:** Raw, CLAHE Enhanced, GLCM Texture, Watershed Segmentation, Heatmap
- **3D Terrain:** Interactive 3D visualization using Three.js
- **Analytics:** Charts, graphs, and scientific telemetry display

### 🎨 User Interface
- Modern sci-fi themed interface with neon cyan accents
- Responsive design with collapsible sidebar
- Real-time terminal logs with processing history
- Interactive HUD elements with telemetry
- Smooth animations using Framer Motion

### 🔧 Technical Features
- Client-side only processing - privacy focused
- No external API dependencies
- Type-safe development with TypeScript
- Fast development with Vite
- State management with Zustand

---

## Technology Stack

### Frontend Framework
- **React 18.3.1** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite 6.3.5** - Build tool and dev server

### UI &amp; Styling
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library

### 3D &amp; Visualization
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helper library for R3F

### Data Visualization
- **Recharts** - Composable charting library
- **Canvas Confetti** - Celebration effects

### State Management &amp; Routing
- **Zustand** - Lightweight state management
- **React Router 7.13.0** - Client-side routing

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn or pnpm
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone or download the project**
   ```bash
   cd "LunaVision-X AI Lunar Analysis"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application

**Development Mode:**
```bash
npm run dev
```

The application will start at `http://localhost:5173/`

**Build for Production:**
```bash
npm run build
```

Builds the application for production to the `dist` folder.

---

## Project Structure

```
LunaVision-X AI Lunar Analysis/
├── dist/                          # Production build output
│   ├── assets/
│   └── index.html
├── src/
│   ├── app/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── figma/
│   │   │   └── ui/               # Radix UI components
│   │   ├── pages/                # Application pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── UploadView.tsx
│   │   │   ├── AnalysisView.tsx
│   │   │   ├── TerrainView.tsx
│   │   │   └── AnalyticsView.tsx
│   │   ├── App.tsx               # Main app component
│   │   ├── Layout.tsx            # Main layout with sidebar
│   │   ├── imageAnalysis.ts      # Core image analysis logic
│   │   ├── routes.tsx            # Route definitions
│   │   └── store.ts              # Zustand state management
│   ├── styles/                    # CSS stylesheets
│   └── main.tsx                   # Application entry point
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite configuration
└── README.md
```

---

## How It Works

### Ice Detection Algorithm

The ice detection system uses brightness-based analysis leveraging the fact that water ice is much more reflective than lunar regolith.

**Step 1: Pixel Brightness Calculation**
```typescript
// Convert RGB to luminance using human eye perception weights
brightness = R * 0.299 + G * 0.587 + B * 0.114
```

**Step 2: Statistical Analysis**
- Calculate **mean brightness** (average of all pixels)
- Calculate **standard deviation** (texture variation)
- Count **bright pixels** (pixels &gt; mean + 24)

**Step 3: Ice Probability Calculation**
```typescript
iceProbability = brightRatio * 180 + stdDev * 0.18
```
- Combines bright pixel ratio and texture variation
- Result clamped between 5-96%

**Step 4: Region Detection**
- Divides image into 6x6 grid (36 regions)
- Scores each region: `score = ((average - mean) / stdDev) * 0.6 + cellMax / 255`
- Selects top 3 highest-scoring regions

### Image Analysis Pipeline

```
1. Image Upload
   ↓
2. Load &amp; Resize to 256px
   ↓
3. Extract Pixel Data
   ↓
4. Calculate Brightness Array
   ↓
5. Compute Statistics (Mean, StdDev)
   ↓
6. Calculate Telemetry Metrics
   ↓
7. Detect &amp; Score Regions
   ↓
8. Visualize Results
```

---

## Application Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Dashboard** | Welcome screen with quick access buttons |
| `/upload` | **Upload OHRC** | Image upload interface with drag &amp; drop |
| `/enhancement` | **Enhancement** | CLAHE enhanced image view |
| `/ice-detection` | **Ice Detection** | Ice probability heatmap view |
| `/analysis` | **Texture &amp; Seg** | Texture analysis and segmentation |
| `/terrain` | **3D Terrain** | Interactive 3D terrain visualization |
| `/analytics` | **Analytics** | Scientific telemetry and charts |
| `/reports` | **AI Reports** | Mock reports page |
| `/settings` | **Settings** | Mock settings page |

---

## Scientific Background

### Permanently Shadowed Regions (PSRs)
PSRs are craters near the lunar poles that never receive direct sunlight. Temperatures in these regions can drop below 40K (-233°C), allowing water ice to remain stable for billions of years.

### Chandrayaan-2 OHRC
The Orbiter High Resolution Camera (OHRC) onboard Chandrayaan-2 provides:
- 0.25 meter per pixel resolution
- Coverage of lunar south pole region
- High-quality imagery for scientific analysis

### Ice Detection Principle
Water ice has a much higher albedo (~0.8) compared to lunar regolith (~0.1-0.2). This significant difference in reflectance allows us to detect potential ice deposits by analyzing pixel brightness.


