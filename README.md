# 🚀 Robust Favicon API

A high-performance, resilient API designed to extract the best possible favicon for any website. It uses a multi-stage approach to ensure you always get an icon, even for complex or private URLs.

## ✨ Key Features

- **Multi-Stage Extraction Strategy**:
    1. **Direct Match**: Attempts to extract high-quality icons directly from the provided URL's HTML.
    2. **Domain Reduction**: If the specific page fails, it intelligently falls back to the base domain (e.g., `console.firebase.google.com` → `firebase.google.com`).
    3. **Google Fallback**: Guaranteed results using Google's favicon service as a final safety net.
- **Smart Scoring Engine**: Ranks icons based on:
    - Source (Apple Touch Icons and standard Icons preferred).
    - Resolution (Higher resolution = Higher score).
    - Format (SVG and PNG prioritized over ICO).
- **Resilient Extraction**: Uses custom User-Agents to bypass basic bot detection and "breaking checks" on many sites.
- **Performance**: Integrated **LRU Cache** to minimize external requests and ensure lightning-fast responses.
- **Secure**: Protected via API Key middleware.

## 🛠️ Installation & Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file or set the following variable in your environment:
   ```env
   API_KEY=your_secure_api_key_here
   ```
4. **Start the server**:
   ```bash
   npm start
   ```
   The API will be running on `http://localhost:3000`.

## 🚀 API Documentation

### Get Favicon
**Endpoint:** `POST /api/favicon`  
**Authentication:** Requires `x-api-key` in the header.

#### Request Headers
| Header | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Required |
| `x-api-key` | `YOUR_API_KEY` | Your secret API key |

#### Request Body
```json
{
  "url": "https://github.com"
}
```

#### Successful Response
```json
{
  "success": true,
  "favicon": {
    "rel": "icon",
    "href": "https://github.githubassets.com/favicons/favicon.svg",
    "sizes": "any",
    "score": 80
  },
  "source": "original-url"
}
```

## 🌐 Deployment (Live)

This project is optimized for deployment on **Vercel**, but works on any Node.js host.

### Deploying to Vercel
1.  **Install Vercel CLI**: `npm i -g vercel`
2.  **Deploy**: Run `vercel` in the root directory.
3.  **Environment Variables**: During setup or in the Vercel Dashboard, add your `API_KEY`.

### Other Platforms (Render, Heroku, etc.)
-   The API automatically detects the environment and uses the correct `PORT`.
-   Make sure to set `NODE_ENV=production` in your hosting dashboard to optimize performance.

The API handles requests through a robust 3-step pipeline:

1. **Extraction**: Parses the HTML of the target URL using `cheerio` to find `<link rel="icon">` or `<link rel="apple-touch-icon">` tags.
2. **Validation**: Every candidate icon is verified via a `HEAD` request to ensure it exists and is a valid image.
3. **Scoring**: Applies a weight-based algorithm to select the most "premium" icon available.

## 🛡️ "Private Subdomain" Logic
The API is specifically built to handle subdomains that might be private or require authentication. If a specific path or subdomain is unreachable, the API automatically "reduces" the domain to find the main site's branding, ensuring a consistent user experience.
