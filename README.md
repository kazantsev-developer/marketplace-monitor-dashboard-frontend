# Marketplace Monitor Dashboard

Monitoring dashboard for orders, stock, and product cards from Ozon, Wildberries, and MoySklad.

## Stack

- Vue 3 (Composition API)
- TypeScript
- PrimeVue 3
- Tailwind CSS
- Chart.js
- Axios
- Vue Router 4
- Vite 7

## Features

- Ozon orders (FBO/FBS) with filtering and pagination
- Wildberries orders with filtering and pagination
- Stock levels for Ozon, Wildberries, and MoySklad
- Wildberries product cards (grid with photos)
- Sync job logs
- Dashboard with daily orders chart
- Clickable legend to toggle chart lines
- Dark theme with colored lines (blue – WB, pink – Ozon)

## Setup

npm install

## Development

npm run dev

## Build

npm run build

## API

The frontend expects the backend at http://localhost:3000/api (override with VITE_API_URL).
