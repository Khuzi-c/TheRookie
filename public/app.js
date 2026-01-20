const API = '/api';

// --- DATA FETCHING & STATE ---
let globalEpisodeData = null;
let globalSiteMeta = null;

// --- CHARACTERS ---
async function fetchCharacters() {
    const res = await fetch(`${API}/characters`);
    return await res.json();
}

function renderCharacters(characters, containerId, sortType = 'popular') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let sorted = [...characters];
    // No voting, so just A-Z or Shuffle
    if (sortType === 'az') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        // Randomize order for a dynamic feel
        sorted = sorted.sort(() => Math.random() - 0.5);
    }

    container.innerHTML = sorted.map((c, index) => {
        const primaryImg = c.images[0].startsWith('http') ? c.images[0] : `/${c.images[0]}`;
        return `
        <div class="char-card fade-in" style="animation-delay: ${index * 0.1}s;">
            <a href="/characters/${c.id}" style="display: block; height: 100%; text-decoration: none; color: inherit;">
                <img src="${primaryImg}" alt="${c.name}" class="char-img" referrerpolicy="no-referrer">
                <div class="char-overlay">
                    <span style="font-weight: 800; font-size: 0.7rem; color: var(--primary-color); letter-spacing: 2px;">${c.rank}</span>
                    <h3 style="font-size: 1.8rem; margin: 0.2rem 0;">${c.name}</h3>
                    <div style="background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 4px; display: inline-block; font-size: 0.75rem; margin-bottom: 1rem;">${c.role}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.9rem; color: var(--text-secondary);">${c.callsign}</span>
                        <span class="btn-tactical">OPEN FILE →</span>
                    </div>
                </div>
            </a>
        </div>
        `;
    }).join('');
}

async function loadCharacterDetail() {
    let id = window.location.pathname.split('/').filter(Boolean).pop().toLowerCase();

    // Alias handling
    if (id === 'nolan') id = 'john-nolan';
    if (id === 'chen') id = 'lucy-chen';
    if (id === 'tim') id = 'tim-bradford';

    const res = await fetch(`${API}/characters/${id}`);
    if (!res.ok) {
        document.getElementById('profileContent').innerHTML = `<div class="glass" style="padding: 4rem; text-align: center;"><h1>ACCESS DENIED</h1><p>Personnel file not found or classified (ID: ${id}).</p><a href="/characters" class="btn btn-outline" style="margin-top: 2rem;">Return to Roster</a></div>`;
        return;
    }
    const c = await res.json();

    const container = document.getElementById('profileContent');

    // Dramatic Loading Sequence
    container.innerHTML = `
        <div class="loading-terminal">
            <div class="terminal-text">> ACCESSING WILSHIRE DATABASE_</div>
            <div class="terminal-text" style="font-size: 0.7rem; margin-top: 10px; opacity: 0.7;">ENCRYPTED SESSION ACTIVE...</div>
            <div class="terminal-bar"></div>
        </div>
    `;

    setTimeout(() => {
        container.innerHTML = `
        <div class="siren-glow"></div>
        <div class="profile-grid poster-board">
            <div class="pursuit-widget-tilted">
                <img src="/copcarwithlightsgif.gif" style="height: 30px; border-radius: 4px;">
                <div style="font-size: 0.75rem; font-weight: 800; color: #fff; letter-spacing: 1px;">
                    <span class="pulse-red">●</span> STATUS: ${c.rank.includes('Deceased') || c.rank.includes('EOW') || c.name.includes('Jackson') || c.name.includes('Andersen') ? 'END OF WATCH' : 'ACTIVE DUTY'}
                </div>
            </div>

            <div class="profile-gallery">
                <div class="poster-photo" style="margin-bottom: 2rem;">
                    <div class="tactical-stamp" style="top: 10px; left: 10px;">${c.rank.includes('Deceased') || c.name.includes('Jackson') || c.name.includes('Andersen') ? 'MEMORIAL' : 'CONFIDENTIAL'}</div>
                    <img src="${c.images[0].startsWith('http') ? c.images[0] : `/${c.images[0]}`}" alt="${c.name}" class="profile-img-main" id="mainImg" referrerpolicy="no-referrer">
                </div>
                
                <div class="profile-images-grid">
                    ${c.images.map((img, i) => {
            const imgSrc = img.startsWith('http') ? img : `/${img}`;
            return `
                        <div class="poster-photo" style="padding: 5px 5px 20px 5px; transform: rotate(${i % 2 === 0 ? '-2' : '2'}deg);">
                            <img src="${imgSrc}" class="profile-thumb" onclick="document.getElementById('mainImg').src='${imgSrc}'" style="cursor: pointer;" referrerpolicy="no-referrer">
                        </div>
                    `}).join('')}
                </div>

                <div class="glass" style="margin-top: 2rem; padding: 1.5rem; border-color: var(--accent-color); text-align: center; background: rgba(239, 68, 68, 0.05); transform: rotate(-1deg);">
                    <div style="font-size: 0.65rem; color: var(--accent-color); letter-spacing: 2px; margin-bottom: 5px; font-weight: 900;">CLEARANCE LEVEL</div>
                    <div style="font-size: 1.8rem; font-weight: 900; color: #fff; text-transform: uppercase;">RESTRICTED</div>
                </div>
            </div>

            <div class="profile-info">
                <div class="detail-section">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;">
                        <span class="tactical-badge">CLASSIFIED FILE</span>
                        <span style="color: var(--primary-color); font-weight: 800; letter-spacing: 2px; font-size: 0.8rem;">REF: ${c.callsign || 'N/A'}</span>
                    </div>
                    <h1 style="font-size: 4.5rem; text-transform: uppercase; margin: 0; line-height: 1; letter-spacing: -2px; font-family: var(--font-mono);">${c.name}</h1>
                    <h2 style="font-size: 1.5rem; color: var(--text-secondary); margin-bottom: 2rem; font-family: var(--font-mono);">${c.rank}</h2>
                    
                    <div class="lore-box">
                        <h3 style="color: var(--primary-color); font-size: 0.9rem; margin-bottom: 0.5rem; text-transform: uppercase;">>> Officer Biography</h3>
                        ${typeof c.bio === 'object' ? c.bio.long || c.bio.short : c.bio}
                    </div>

                    <div class="lore-box" style="border-left-color: var(--accent-color);">
                         <h3 style="color: var(--accent-color); font-size: 0.9rem; margin-bottom: 0.5rem; text-transform: uppercase;">>> Service History</h3>
                        ${c.history}
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Tactical Role</span>
                        <span class="stat-value">${c.role}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Standard Loadout</span>
                        <span class="stat-value" style="font-size: 0.9rem;">${c.gear ? c.gear.join(' • ') : 'Standard Issue'}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Current Status</span>
                         <span class="stat-value" style="color: ${c.rank.includes('Deceased') || c.rank.includes('EOW') ? '#ef4444' : '#4ade80'};">
                            <span class="pulse-red" style="background: ${c.rank.includes('Deceased') ? '#ef4444' : '#4ade80'};"></span> 
                            ${c.rank.includes('Deceased') || c.rank.includes('EOW') ? 'KILLED IN ACTION' : 'ACTIVE 10-8'}
                        </span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Assigned Precinct</span>
                        <span class="stat-value">WILSHIRE DIVISION</span>
                    </div>
                </div>

                <div style="margin-top: 4rem;">
                    <a href="/characters" class="btn btn-outline" style="border-radius: 4px; padding: 1rem 3rem;">RETURN TO ROSTER DATABASE</a>
                </div>
            </div>
        </div>
    `;
    }, 1500);
}


// --- EPISODES ---

async function fetchEpisodesData() {
    const res = await fetch(`${API}/episodes`);
    const data = await res.json();
    globalEpisodeData = data.seasons;
    globalSiteMeta = data.siteMeta;
    injectPageMeta();
    return data;
}

function injectPageMeta() {
    if (!globalSiteMeta) return;

    // Standard Tags
    document.title = globalSiteMeta.project;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = globalSiteMeta.description;

    // Favicon injection
    if (globalSiteMeta.favicons) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = globalSiteMeta.favicons.ico;
    }
}


function renderFilteredEpisodes(seasonNum) {
    if (!globalEpisodeData) return;

    const season = globalEpisodeData.find(s => s.season == seasonNum);
    const container = document.getElementById('episodeList');
    if (!container) return;

    // Update Header Text to match Season when viewing list
    const headerTitle = document.querySelector('.page-header h1');
    if (headerTitle) headerTitle.textContent = `CASE FILES // SEASON ${seasonNum}`;

    if (!season || !season.episodes || season.episodes.length === 0) {
        container.innerHTML = `
            <div class="glass" style="padding: 2rem; text-align: center; border-color: var(--text-secondary);">
                <h3>NO INTEL FOUND</h3>
                <p>Status: PENDING // Season ${seasonNum} data is currently classified or pending upload.</p>
                <a href="/episodes" class="btn btn-outline" style="margin-top: 2rem;">RETURN TO ARCHIVE</a>
            </div>
        `;
        return;
    }

    // Add "Back to Seasons" button at top of list
    const backBtn = `
        <div style="margin-bottom: 2rem;">
            <a href="/episodes" class="btn btn-outline" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                <span>←</span> RETURN TO ARCHIVE
            </a>
        </div>
    `;

    const listHtml = season.episodes.map(e => `
        <div class="glass fade-in" style="padding: 2.5rem; margin-bottom: 2rem; border-left: 5px solid var(--primary-color);">
            <div style="font-weight: 800; color: var(--primary-color); letter-spacing: 1px; margin-bottom: 0.5rem;">CASE S0${season.season} E0${e.number}</div>
            <h3 style="font-size: 1.8rem; margin-bottom: 1rem;">${e.title}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">${e.summary}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--surface-border); padding-top: 1.5rem;">
                <span style="font-weight: bold; color: var(--primary-color);">OFFICIAL CASE FILE</span>
                <a href="/season-${season.season}/episode-${e.number}" class="btn-tactical">OPEN CASE FILE →</a>
            </div>
        </div>
    `).join('');

    container.innerHTML = backBtn + listHtml;
}


async function loadEpisodeDetail() {
    const path = window.location.pathname;
    let seasonNum, episodeNum, id;

    // Check for /season-1/episode-1 format
    const cleanMatch = path.match(/\/season-(\d+)\/episode-(\d+)/);
    // Check for /s1/e01 legacy format
    const legacyMatch = path.match(/\/episodes\/s(\d+)\/e(\d+)/);

    if (cleanMatch) {
        seasonNum = parseInt(cleanMatch[1]);
        episodeNum = parseInt(cleanMatch[2]);
    } else if (legacyMatch) {
        seasonNum = parseInt(legacyMatch[1]);
        episodeNum = parseInt(legacyMatch[2]);
    } else {
        // Fallback to ID
        id = path.split('/').pop();
    }

    if (!globalEpisodeData) await fetchEpisodesData();

    let episode = null;
    let season = null;

    if (seasonNum && episodeNum) {
        season = globalEpisodeData.find(s => s.season === seasonNum);
        if (season) {
            episode = season.episodes.find(e => e.number === episodeNum);
        }
    } else if (id) {
        for (const s of globalEpisodeData) {
            const found = s.episodes.find(ep => ep.id === id);
            if (found) {
                episode = found;
                season = s;
                break;
            }
        }
    }

    const container = document.getElementById('epiTitle')?.parentElement.parentElement;
    if (!container) return; // Error safety

    if (!episode) {
        container.innerHTML = `<div class="glass" style="padding: 4rem; text-align: center;"><h1>CASE FILE SEALED</h1><p>Intel not found.</p><a href="/episodes" class="btn btn-outline" style="margin-top: 2rem;">Return to Archive</a></div>`;
        return;
    }

    // Specific Meta Injection for Detail Page
    if (episode.meta) {
        document.title = episode.meta.pageTitle || document.title;
    }

    // Update Header
    const titleEl = document.getElementById('epiTitle');
    const metaEl = document.getElementById('epiMeta');

    if (titleEl) titleEl.textContent = episode.title;
    if (metaEl) metaEl.textContent = `CASE S0${season ? season.season : '?'} E0${episode.number}`;

    // Hide verdict box (Legacy cleanup)
    const verdictBox = document.querySelector('.verdict-box');
    if (verdictBox) verdictBox.style.display = 'none';

    // Update Background Image if available
    const heroSection = document.querySelector('.detail-hero');
    if (episode.images && episode.images.length > 0) {
        // Handle external or local images
        let imgUrl = episode.images[0];
        if (!imgUrl.startsWith('http')) imgUrl = '/' + imgUrl.replace(/^\//, '');

        if (heroSection) {
            heroSection.style.background = `linear-gradient(rgba(3, 5, 8, 0.7), rgba(3, 5, 8, 1)), url('${imgUrl}') center/cover`;
        }
    }

    const contentContainer = document.getElementById('caseFileSource');
    const cf = episode.caseFile;

    if (cf) {
        contentContainer.innerHTML = `
            <div class="glass" style="padding: 3rem; position: relative;">
                <div class="tactical-stamp" style="top: 20px; right: 20px;">CASE OPEN</div>
                <h2 style="font-family: var(--font-mono); color: var(--primary-color); margin-bottom: 2rem;">[ CASE SUMMARY ]</h2>
                <div class="detail-lore-paper" style="margin-bottom: 2rem;">${cf.opening || episode.summary}</div>
                
                ${cf.fullScenes && cf.fullScenes.length > 0 ? `
                    <h3 style="font-family: var(--font-mono); font-size: 1rem; color: var(--primary-color); margin-bottom: 1rem;">>> SCENE BREAKDOWN</h3>
                    <div style="display: grid; gap: 1.5rem;">
                        ${cf.fullScenes.map(scene => `
                            <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-left: 2px solid var(--accent-color);">
                                <h4 style="margin-bottom: 0.5rem; color: #fff;">${scene.scene}</h4>
                                <p style="font-size: 0.9rem; color: var(--text-secondary);">${scene.details}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${cf.impact ? `
                     <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--surface-border);">
                        <h3 style="font-family: var(--font-mono); font-size: 1rem; color: var(--primary-color); margin-bottom: 1rem;">>> TACTICAL IMPACT</h3>
                        <div style="color: var(--text-secondary); white-space: pre-line;">${cf.impact}</div>
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        contentContainer.innerHTML = `<div class="glass" style="padding: 2rem;">No detailed case file available.</div>`;
    }
}

// --- GALLERY ---
async function loadGallery() {
    try {
        const res = await fetch(`${API}/characters`);
        const characters = await res.json();

        const grid = document.getElementById('galleryGrid');
        if (!grid) return;

        const allImages = [];

        characters.forEach(c => {
            if (c.images && c.images.length > 0) {
                c.images.forEach(img => {
                    let src = img;
                    if (!src.startsWith('http') && !src.startsWith('/')) {
                        src = `/${src}`;
                    }
                    allImages.push({
                        src: src,
                        title: c.name,
                        type: 'Character'
                    });
                });
            }
        });

        // Add some static assets
        allImages.push({ src: '/copcarwithlightsgif.gif', title: 'Patrol Unit', type: 'Asset' });
        allImages.push({ src: '/therookielogo.gif', title: 'Station Logo', type: 'Asset' });

        grid.innerHTML = allImages.map(item => `
            <div class="glass fade-in" style="overflow: hidden; break-inside: avoid; margin-bottom: 2rem;">
                <div style="position: relative; padding-top: 75%;">
                    <img src="${item.src}" alt="${item.title}" 
                    style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; transition: transform 0.5s;" 
                    onmouseover="this.style.transform='scale(1.1)'" 
                    onmouseout="this.style.transform='scale(1)'" 
                    referrerpolicy="no-referrer"
                    onerror="this.src='/therookielogo.gif'">
                </div>
                <div style="padding: 1rem;">
                    <h3 style="font-size: 1rem; color: #fff;">${item.title}</h3>
                    <span class="tactical-badge" style="font-size: 0.6rem;">${item.type}</span>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Gallery Load Error:', error);
    }
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    // Add Tactical Overlays
    const overlay = document.createElement('div');
    overlay.className = 'terminal-overlay';
    const scanline = document.createElement('div');
    scanline.className = 'scanline';
    document.body.appendChild(overlay);
    document.body.appendChild(scanline);

    const path = window.location.pathname;

    // Homepage
    if (path === '/' || path === '/index') {
        const charData = await fetchCharacters();
        renderCharacters(charData.slice(0, 3), 'topCharacters', 'popular');
    }

    // Characters
    if (path.includes('/characters')) {
        if (path.split('/').length > 2) {
            loadCharacterDetail();
        } else {
            const charData = await fetchCharacters();
            renderCharacters(charData, 'characterGrid', 'popular');
            document.getElementById('sortSelect')?.addEventListener('change', (e) => {
                renderCharacters(charData, 'characterGrid', e.target.value);
            });
        }
    }

    // Episodes & Season Hub
    if (path.includes('/episodes') || path.includes('/season-')) {
        await fetchEpisodesData();

        const seasonMatch = path.match(/\/season-(\d+)$/);
        // Check for Detail Page (ID or sX/eX)
        const detailMatch = path.match(/\/season-(\d+)\/episode-(\d+)/) || path.match(/\/episodes\/(?:s(\d+)\/e(\d+)|([a-zA-Z0-9-]+))$/);

        if (detailMatch) {
            loadEpisodeDetail();
            // Add BETA tag to header if on detail page
            const betaBadge = document.createElement('span');
            betaBadge.className = 'tactical-badge';
            betaBadge.style.marginLeft = '10px';
            betaBadge.style.background = 'var(--accent-color)';
            betaBadge.innerText = 'BETA';
            document.querySelector('h1')?.appendChild(betaBadge);
        } else if (seasonMatch) {
            const num = parseInt(seasonMatch[1]);
            const grid = document.getElementById('seasonGrid');
            const list = document.getElementById('episodeList');
            if (grid) grid.style.display = 'none'; // Hide grid
            if (list) list.style.display = 'grid'; // Show list
            renderFilteredEpisodes(num);
        } else {
            // Default View (Episodes Hub)
            // renderFilteredEpisodes(1); // Don't auto-render season 1, show grid instead
            const grid = document.getElementById('seasonGrid');
            const list = document.getElementById('episodeList');
            if (grid) grid.style.display = 'grid';
            if (list) list.style.display = 'none';
        }
    }

    // Gallery
    if (path.includes('/gallery')) {
        loadGallery();
    }
});
