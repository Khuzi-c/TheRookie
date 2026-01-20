# The Rookie Community Hub (Fan-Made)

A premium, interactive community portal for fans of *The Rookie*.

## Features
- **Police Roster**: View and vote on your favorite characters.
- **Episode Case Files**: Detailed breakdowns of every episode (no scripts/piracy).
- **Community Interaction**: Likes, Dislikes, and Star ratings for episodes.
- **Discord Integration**: Quick access to the global community.
- **Cinematic UI**: Dark theme with "Case File" styling for immersive browsing.

## Tech Stack
- **Frontend**: Vanilla HTML/CSS/JS (no frameworks)
- **Backend**: Node.js + Express
- **Storage**: Persistent JSON files

## Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Server**:
   ```bash
   npm start
   ```

3. **Development Mode** (requires nodemon):
   ```bash
   npm run dev
   ```

4. **Access**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment Notes
- This site is static-ready but requires the Node.js server for interactive voting.
- To upgrade to real Discord stats, use the Discord API inside `server/routes/api.js`.
- Always maintain the legal footer to stay compliant with fan-site guidelines.

## Assets
Current images use high-quality placeholders. For production, replace links in `server/data/characters.json` and CSS background-images with local files.

---
*This is an unofficial fan-made website. The Rookie is owned by ABC and its respective creators.*
