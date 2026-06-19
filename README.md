# Marketplace Monitor Platform (Frontend – Admin Panel)

Administrative dashboard client for the Marketplace Monitor Platform ecosystem. Built as a high-performance, responsive Vue 3 and Vite 5 Single Page Application (SPA) with TypeScript, PrimeVue, and Tailwind CSS following the Feature-Sliced Design (FSD) architectural methodology. Consumes a decoupled downstream REST API to monitor orders, stock levels, and product cards across Ozon, Wildberries, and MoySklad.

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: npm v9.0.0 or higher
- **Containerization**: Docker v24.0+ (optional for production deployment)

## Tech Stack

- **Framework** — Vue 3 (Composition API runtime execution)
- **Language** — TypeScript (Strict-mode compiler boundary configurations)
- **State Management** — Pinia (Modular store architecture pattern)
- **UI Architecture** — PrimeVue 3 (Data tables, stateful filters, overlays)
- **Styling Layout** — Tailwind CSS (Utility-first framework configuration)
- **Data Visualization** — Chart.js (Time-series multi-line data arrays plots)
- **Network Transport** — Axios (Intercepted HTTP client transport layer)
- **Routing Engine** — Vue Router 4 (Client-side decoupled view transitions)
- **Build Tooling** — Vite (Next-generation static asset optimization engine)
- **Architecture Methodology** — Feature-Sliced Design (FSD specification compliant)

## Features

- **Ozon Orders Board** — FBO/FBS sales ledger management equipped with multiple-selection filtering, serverside sorting, and cursor pagination.
- **Wildberries Metrics Ledger** — Financial volume monitoring logs embedded with discrete time-series filtering and item limit parameters.
- **Unified Telemetry Monitor** — Single consolidated real-time stock matrix layout aggregating structural metrics from Ozon, Wildberries, and MoySklad.
- **Dynamic Catalog Grid** — High-density Wildberries product catalog viewer utilizing fully responsive media renderers.
- **System Health Auditing** — Real-time execution logs tracking synchronization cron tasks state, item counts, and duration metadata.
- **Analytical Intelligence** — Interactive daily graphs utilizing clickable multi-series chart legends to toggle isolated data rendering streams.
- **Enterprise Dark Interface** — Native dark theme ecosystem mapping with custom brand accents (Blue for Wildberries, Pink for Ozon).

## Local Development Lifecycle

1. Install explicit, predictable dependency trees using a locked footprint clean install:
   ```bash
   npm ci
   ```

2. Spin up the localized Vite hot-reload development server runtime:
   ```bash
   npm run dev
   ```

3. Compile, optimize, and minify production-grade static bundle asset pipelines:
   ```bash
   npm run build
   ```

## Downstream API Gateway Configurations

The client runtime environment maps schema payloads toward a decoupled backend REST API interface. By default, the application resolves operations via the `http://localhost:3000/api` endpoint.

To customize the network target gateway parameters at compilation time, define the `VITE_API_URL` variable inside a local root `.env` configuration file:

```env
VITE_API_URL=http://your-production-api-host:3000/api
```

## Production Containerization & Deployment

### Multi-Stage Compilation Strategy

Vite hardcodes structural infrastructure environment tokens strictly during the deployment asset compilation phase. You must pass the destination API URL parameter via Docker build arguments:

```bash
docker build -t marketplace-monitor --build-arg VITE_API_URL=http://your-production-api-host:3000/api .
```

### Container Lifecycle Provisioning

Instantiate the immutable stateless compiled web server node, exposing the user dashboard client view over edge port 8080:

```bash
docker run -d \
  -p 8080:80 \
  --name marketplace-frontend \
  --restart unless-stopped \
  marketplace-monitor
```
