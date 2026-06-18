# Marketplace Monitor Dashboard

A professional monitoring dashboard for tracking orders, stock levels, and product cards across Ozon, Wildberries, and MoySklad. Built following the Feature-Sliced Design (FSD) architectural methodology.

## Tech Stack

- Framework: Vue 3 (Composition API)
- Language: TypeScript (Strict mode)
- State Management: Pinia
- UI Framework: PrimeVue 3
- Styling: Tailwind CSS
- Data Visualization: Chart.js
- HTTP Client: Axios
- Routing: Vue Router 4
- Build Tool: Vite 7
- Architecture: Feature-Sliced Design (FSD)

## Features

- Ozon orders (FBO/FBS) management with advanced filtering and pagination.
- Wildberries orders tracking with filtering and pagination.
- Unified view of stock levels across Ozon, Wildberries, and MoySklad.
- Wildberries product cards display utilizing a grid layouts with photos.
- Synchronization job logs for system health monitoring and debugging.
- Dashboard analytics featuring a daily orders chart.
- Interactive clickable chart legend to toggle specific data lines.
- Native dark theme support with custom marketplace color lines (Blue for WB, Pink for Ozon).

## Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

To ensure predictable dependency trees, install packages using clean install:

npm ci

## Development

Start the local development server:

npm run dev

## Production Build

Compile and minify the application for production:

npm run build

## API Configuration

The frontend application communicates with the backend API. By default, it expects the backend to be available at `http://localhost:3000/api`.

To override the default endpoint, define the `VITE_API_URL` variable in your environment or a `.env` file at the root of the project:

VITE_API_URL=http://your-api-host:3000/api

## Docker

### Build Image

Vite injects environment variables during the build phase. You must pass the backend API URL as a build argument:

docker build -t marketplace-monitor --build-arg VITE_API_URL=http://your-api:3000/api .

### Run Container

Expose the application on port 8080:

docker run -d -p 8080:80 --name marketplace-frontend marketplace-monitor
