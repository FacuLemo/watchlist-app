# Media Watchlist 🎬🎮📚

A responsive web application for tracking your media consumption. Built with React and Vite, ready to deploy on GitHub Pages. Supports real-time data synchronization across clients using JSONBin.io.

## Features

- Multiple Categories: Track movies, games, books, TV shows, anime, and podcasts
- Status Tracking: Set status as "Want to Watch", "Watching", "Completed", or "Dropped"
- Search & Filter: Filter by category and status, search by title
- Statistics: View total items, currently watching, and completed counts
- Responsive Design: Works seamlessly on desktop and mobile devices
- Real-time Sync: Share watchlist data across multiple clients using JSONBin.io
- Local Storage: Data persists in browser localStorage for seamless experience

## Tech Stack

- React 19
- Vite
- React Router DOM
- Axios (for API requests)
- JSONBin.io (for cloud data storage and sync)
- gh-pages for deployment

## JSONBin.io Setup (Optional but Recommended)

To enable real-time data synchronization across multiple clients, follow these steps:

1. **Create a JSONBin.io Account**
   - Go to [jsonbin.io](https://jsonbin.io)
   - Sign up for a free account

2. **Create a New Bin**
   - Click "Create New Bin"
   - Name your bin (e.g., "watchlist")
   - Set the initial JSON structure:
   ```json
   {
     "items": []
   }
   ```
   - Click "Create"

3. **Get Your API Key and Bin ID**
   - Your API Key is available in your account settings
   - The Bin ID is the long string in the URL after `/b/` when viewing your bin
   - Example URL: `https://jsonbin.io/b/65a1b2c3d4e5f6` → Bin ID is `65a1b2c3d4e5f6`

4. **Configure Environment Variables**
   - Create a `.env` file in the project root:
   ```env
   VITE_JSONBIN_API_KEY=your_api_key_here
   VITE_JSONBIN_BIN_ID=your_bin_id_here
   ```
   - Replace `your_api_key_here` and `your_bin_id_here` with your actual values

5. **Restart the Development Server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

**Without JSONBin.io:**
- The app will work fine using only localStorage
- Data will persist only on the same browser
- Changes won't sync across different clients

**With JSONBin.io:**
- Data syncs across all clients connected to the same bin
- Perfect for sharing a watchlist with friends/family
- Changes are saved to the cloud and loaded by all clients

## Getting Started

### Local Development

1. Navigate to the project directory:
```bash
cd watchlist-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Deploy to GitHub Pages

### 1. Create a GitHub Repository

1. Create a new repository on GitHub named `watchlist-app`
2. Initialize a git repository in your project:
```bash
cd watchlist-app
git init
```

### 2. Update Package.json

Replace `[YOUR-USERNAME]` in package.json with your GitHub username:
```json
"homepage": "https://[YOUR-USERNAME].github.io/watchlist-app"
```

For example:
```json
"homepage": "https://johnsmith.github.io/watchlist-app"
```

### 3. Commit Your Code

```bash
git add .
git commit -m "Initial commit"
git branch -M main
```

### 4. Add Remote and Push

```bash
git remote add origin https://github.com/[YOUR-USERNAME]/watchlist-app.git
git push -u origin main
```

### 5. Deploy to GitHub Pages

Run the deploy command:
```bash
npm run deploy
```

This will:
- Build your project
- Create a `gh-pages` branch
- Push the built files to GitHub Pages
- Your site will be live at: `https://[YOUR-USERNAME].github.io/watchlist-app`

### 6. Enable GitHub Pages (if needed)

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under **Source**, select the `gh-pages` branch
4. Click **Save**

Your site should now be live!

### 7. Configure Environment Variables on GitHub Pages (Optional)

If you want to use JSONBin.io in the deployed version:

1. Go to your repository on GitHub
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add secrets:
   - Name: `VITE_JSONBIN_API_KEY`, Value: your JSONBin API key
   - Name: `VITE_JSONBIN_BIN_ID`, Value: your JSONBin Bin ID
5. **Important**: GitHub Pages doesn't automatically expose environment variables from Actions. To use env vars on GitHub Pages, you'll need to either:
   - Hardcode them in the app (not recommended for security)
   - Or use a different deployment method that supports environment variables (like Vercel, Netlify, or using a backend service)

**Alternative for GitHub Pages:**
Since GitHub Pages is static hosting, environment variables from GitHub Actions aren't automatically available. Options:
1. Use Vercel/Netlify instead (free tier, supports env vars)
2. Embed the API key directly in the code (only if you're comfortable with it being public)
3. Use a backend proxy service

## Data Management

The app uses **localStorage** to persist your watchlist data between sessions. When configured with **JSONBin.io**, it also syncs data to the cloud, enabling real-time sharing across multiple clients.

### How Data Persistence Works

1. **Initial Load**: Data loads from localStorage first, then from JSONBin.io (if configured)
2. **Local Storage**: All changes are saved to localStorage for fast access
3. **Cloud Sync** (if configured): Changes are debounced and synced to JSONBin.io after 1 second
4. **Multiple Clients**: All clients with same JSONBin.io configuration share the same data
5. **Sync Status**: Watch for "Syncing..." and "Synced!" indicators in the header
6. **Reset**: Click the "Reset" button to clear all data for everyone

### Adding Items

1. Click the "+ Add Item" button
2. Enter the title
3. Select a category (movies, games, books, TV shows, anime, podcasts)
4. Choose a status
5. Click "Add"

### Updating Status

Each item has a dropdown to change its status:
- Want to Watch: Blue
- Watching: Orange
- Completed: Green
- Dropped: Red

### Deleting Items

Click the "Delete" button on any item to remove it from your watchlist.

### Modifying the JSON Data

The `public/data.json` file contains the initial/default data for your watchlist. To customize the initial data:

1. Edit `public/data.json`
2. Deploy the updated version
3. Users will see the new initial data on their first visit
4. Existing users' data in localStorage will not be affected

To reset your own data to the default, click the "Reset" button in the header.

```json
{
  "items": [
    {
      "id": 1,
      "title": "Your Movie Title",
      "category": "movies",
      "status": "completed",
      "addedDate": "2026-01-22"
    }
  ]
}
```

## Customization

### Adding Categories

Edit the `CATEGORIES` array in `src/App.jsx`:

```javascript
const CATEGORIES = ['movies', 'games', 'books', 'tv_shows', 'anime', 'podcasts', 'your_new_category']
```

### Adding Status Options

Edit the `STATUS_OPTIONS` array in `src/App.jsx`:

```javascript
const STATUS_OPTIONS = [
  { value: 'want_to_watch', label: 'Want to Watch', color: '#3b82f6' },
  { value: 'watching', label: 'Watching', color: '#f59e0b' },
  { value: 'completed', label: 'Completed', color: '#10b981' },
  { value: 'dropped', label: 'Dropped', color: '#ef4444' }
]
```

## Project Structure

```
watchlist-app/
├── public/
│   ├── data.json          # Initial/default watchlist data
│   └── vite.svg
├── src/
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── index.css          # Global styles
│   └── main.jsx           # React entry point
├── package.json
└── vite.config.js         # Vite configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## License

MIT

## Future Enhancements

- User authentication
- Export/import watchlist data
- Ratings and reviews
- Tags and notes
- Dark mode toggle
- Sorting options (by date, status, title)