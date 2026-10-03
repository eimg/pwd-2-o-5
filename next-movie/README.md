# Next Movie

A responsive movie discovery app built with Next.js 16, React 19, and TMDB. The interface pairs a cinematic spotlight with browsable poster shelves, genre collections, search, film details, and cast profiles.

## Run locally

Install dependencies with `npm install`. Add a `.env` file containing a TMDB API Read Access Token:

```dotenv
TMDB_TOKEN=your_tmdb_read_access_token
```

Run `npm run dev` and open [localhost:3000](http://localhost:3000).

## Features

- Featured film carousel and popular, top rated, and upcoming collections.
- Search and genre browsing with pagination.
- Film details, YouTube trailer links, cast profiles, and recommendations.
- A watchlist saved in this browser's local storage, with immediate updates across cards and tabs. It does not require an account or sync between devices.
- Responsive navigation, keyboard shortcuts (Cmd/Ctrl + K to search), keyboard collection tabs, and reduced motion support.
- Loading skeletons, empty states, and recoverable movie service errors.

TMDB requests run on the server; the token stays out of the browser. Movie data refreshes hourly. Posters use Next.js image optimization.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The build requires network access to TMDB and Google Fonts. For production, run `npm run build` followed by `npm start`.
