/* ─── THREE.JS GLOBAL SPACE BG ─── */
(function(){
  const canvas=document.getElementById('space-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(65,1,.1,1200);
  camera.position.z=90;
  function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h);renderer.setPixelRatio(Math.min(devicePixelRatio,2));camera.aspect=w/h;camera.updateProjectionMatrix();}
  resize();window.addEventListener('resize',resize);
  function stars(count,color,size){
    const geo=new THREE.BufferGeometry(),pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*420;pos[i*3+1]=(Math.random()-.5)*420;pos[i*3+2]=(Math.random()-.5)*300-60;}
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    return new THREE.Points(geo,new THREE.PointsMaterial({color,size,transparent:true,opacity:.78}));
  }
  scene.add(stars(1400,0xffffff,.42));scene.add(stars(350,0x00f2fe,.45));scene.add(stars(220,0x7c3aed,.38));
  function nebula(count,color,spread,z){
    const geo=new THREE.BufferGeometry(),pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){const r=Math.random()*spread,a=Math.random()*Math.PI*2;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=(Math.random()-.5)*spread*.4;pos[i*3+2]=Math.sin(a)*r+z;}
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    return new THREE.Points(geo,new THREE.PointsMaterial({color,size:1.1,transparent:true,opacity:.12}));
  }
  scene.add(nebula(280,0x7c3aed,105,-125));scene.add(nebula(200,0x00f2fe,85,-105));scene.add(nebula(140,0xff6b6b,65,-90));
  let mx=0,my=0;
  document.addEventListener('mousemove',e=>{mx=(e.clientX/window.innerWidth-.5)*2;my=(e.clientY/window.innerHeight-.5)*2;});
  let t=0;
  (function loop(){requestAnimationFrame(loop);t+=.0012;const sf=window.scrollY/(document.body.scrollHeight-window.innerHeight||1);camera.position.x+=(mx*5-camera.position.x)*.018;camera.position.y+=(-my*5-camera.position.y)*.018;scene.rotation.y=t*.04+sf*Math.PI*.5;scene.rotation.x=sf*Math.PI*.12;renderer.render(scene,camera);})();
})();

/* ─── SCROLL PROGRESS BAR ─── */
window.addEventListener('scroll',()=>{
  const p=(window.scrollY/(document.body.scrollHeight-window.innerHeight||1))*100;
  document.getElementById('prog').style.width=p+'%';
});

/* ─── NAV SCROLL STATE ─── */
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('s',window.scrollY>60));

/* ─── REVEAL OBSERVER ─── */
const rvO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvO.unobserve(e.target);}});},{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>rvO.observe(el));

/* ─── HERO COUNTERS ─── */
const cO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const raw=e.target.dataset.count||'0';const num=parseInt(raw);const suffix=raw.includes('+')?'+':'';let t0=null;const step=ts=>{if(!t0)t0=ts;const p=Math.min((ts-t0)/1200,1);e.target.textContent=Math.floor(p*num)+suffix;if(p<1)requestAnimationFrame(step);else e.target.textContent=num+suffix;};requestAnimationFrame(step);cO.unobserve(e.target);});},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cO.observe(el));

/* ─── LANG BAR OBSERVER ─── */
const lbO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w;lbO.unobserve(e.target);}});},{threshold:.4});

/* ═══════════════════════════════════════════════════════════
   CONFIG — change usernames here; nothing else needs editing
   ═══════════════════════════════════════════════════════════ */
const CONFIG = {
  GITHUB_USER:      'gumnaam4',
  LEETCODE_USER:    'gumnaam05',
  /* Serverless proxies (work on Vercel / Netlify).
     Set to null to skip and go straight to public fallbacks. */
  GITHUB_PROXY:     '/api/github',
  LEETCODE_PROXY:   '/api/leetcode',
  CONTACT_ENDPOINT: null, // set to your third-party form endpoint, e.g. https://formspree.io/f/yourFormId
  /* Public fallbacks used when proxy returns 404 (e.g. GitHub Pages) */
  GITHUB_API:       'https://api.github.com',
  LEETCODE_FALLBACK:'https://leetcode-stats-api.herokuapp.com',
  CACHE_KEY_GH:     'portfolio_gh_stats',
  CACHE_KEY_LC:     'portfolio_lc_stats',
  CACHE_TTL_MS:     5 * 60 * 1000, // 5 minutes
};

/* ------------------------------------------------------------------
   CURRENT STATUS CONFIG
   Update values below to change the live "Currently" section. Keep
   all current-status values in this single object for easy editing.
   Do NOT duplicate these strings elsewhere in the codebase.
  ------------------------------------------------------------------ */
CONFIG.CURRENT = {
  // Education lines (e.g. '5th Semester', 'SRM Institute of Science & Technology')
  educationTitle: '',
  educationOrg: '',

  // Short description of what you're working on (project name or short phrase)
  workingOn: '',

  // Current focus such as 'Preparing for GATE', 'Learning FastAPI', etc.
  focus: '',

  // Availability - free-text. Use 'Available' for green status, otherwise any text (e.g. 'Busy until 2026-09-10')
  availability: '',
};

/* ------------------------------------------------------------------
   PROJECTS DATA — centralized source of truth for project cards.
   Update this array to add/edit projects. Do NOT duplicate content
   elsewhere in the codebase. Keep URLs empty if not available.
  ------------------------------------------------------------------ */
const PROJECTS = [
  { id: 'safaro', title: 'Safaro', short: '', problem: '', tech: [], status: 'Completed', github: '', live: '' },
  { id: 'stock-correlation', title: 'Stock Correlation Analyzer', short: '', problem: '', tech: [], status: 'Completed', github: '', live: '' },
  { id: 'compliance-pro', title: 'Compliance Pro', short: '', problem: '', tech: [], status: 'Completed', github: '', live: '' },
  { id: 'file-redaction', title: 'File Word Redaction Project', short: '', problem: '', tech: [], status: 'Completed', github: '', live: '' },
  { id: 'student-finance', title: 'Student Finance Management', short: '', problem: '', tech: [], status: 'Completed', github: '', live: '' },
  { id: 'import-export', title: 'Import & Export Project', short: '', problem: '', tech: [], status: 'In Progress', github: '', live: '' },
  { id: 'hostel-needs', title: 'Hostel Needs Project', short: '', problem: '', tech: [], status: 'In Progress', github: '', live: '' },
];

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';

  PROJECTS.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'project-card rv';

    const title = document.createElement('div'); title.className = 'proj-title'; title.textContent = p.title;
    const status = document.createElement('div'); status.className = 'proj-status';
    const dot = document.createElement('span'); dot.className = 'proj-dot ' + (p.status && /in progress/i.test(p.status) ? 'inprog' : 'done'); dot.title = p.status;
    status.appendChild(dot);
    const statusLabel = document.createElement('span'); statusLabel.className = 'proj-status-label'; statusLabel.textContent = p.status ? p.status.toUpperCase() : '';
    status.appendChild(statusLabel);

    const desc = document.createElement('div'); desc.className = 'proj-desc'; desc.textContent = p.short || 'Add a concise project description in the central PROJECTS array in script.js.';

    const prob = document.createElement('div'); prob.className = 'proj-problem'; if (p.problem) prob.textContent = 'Problem: ' + p.problem;

    const tech = document.createElement('div'); tech.className = 'proj-tech'; tech.textContent = p.tech && p.tech.length ? p.tech.join(' · ') : '';

    const ctas = document.createElement('div'); ctas.className = 'proj-ctas';
    if (p.github) {
      const a = document.createElement('a'); a.className='proj-btn'; a.href = p.github; a.target='_blank'; a.rel='noopener'; a.textContent='GitHub'; ctas.appendChild(a);
    } else {
      const d = document.createElement('button'); d.className='proj-btn disabled'; d.textContent='GitHub'; d.disabled=true; ctas.appendChild(d);
    }
    if (p.live) {
      const b = document.createElement('a'); b.className='proj-btn'; b.href = p.live; b.target='_blank'; b.rel='noopener'; b.textContent='Visit'; ctas.appendChild(b);
    } else {
      const d2 = document.createElement('button'); d2.className='proj-btn disabled'; d2.textContent='Visit'; d2.disabled=true; ctas.appendChild(d2);
    }

    card.appendChild(status);
    card.appendChild(title);
    card.appendChild(desc);
    if (p.problem) card.appendChild(prob);
    if (p.tech && p.tech.length) card.appendChild(tech);
    card.appendChild(ctas);

    grid.appendChild(card);
    try{ rvO.observe(card); }catch(e){}
  });
}

/* MARKET DASHBOARD */
// Default tickers: Yahoo symbols for NIFTY 50 and SENSEX
const MARKET_TICKERS = [
  { symbol: '^NSEI', label: 'NIFTY 50' },
  { symbol: '^BSESN', label: 'SENSEX' }
];

async function fetchMarketData(symbols) {
  try {
    const q = symbols.join(',');
    const res = await fetch(`/api/market?symbols=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Market API error');
    const j = await res.json();
    return j;
  } catch (err) {
    console.error('fetchMarketData error:', err);
    return null;
  }
}

async function renderMarket() {
  const grid = document.getElementById('market-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const symbols = MARKET_TICKERS.map(t => t.symbol);
  const resp = await fetchMarketData(symbols);
  if (!resp || !resp.data) {
    grid.innerHTML = '<div style="color:var(--text2)">Market data unavailable.</div>';
    return;
  }

  const map = {};
  resp.data.forEach(d => map[d.symbol] = d);

  MARKET_TICKERS.forEach(t => {
    const d = map[t.symbol];
    const tile = document.createElement('div'); tile.className = 'market-tile rv';
    const header = document.createElement('div'); header.className = 'mt-header';
    const sym = document.createElement('div'); sym.className = 'mt-symbol'; sym.textContent = t.label;
    const name = document.createElement('div'); name.className = 'mt-name'; name.textContent = d ? (d.name || d.symbol) : t.symbol;
    header.appendChild(sym); header.appendChild(name);

    const price = document.createElement('div'); price.className = 'mt-price'; price.textContent = d && d.price !== null ? (d.price + (d.currency ? ' ' + d.currency : '')) : '—';

    const change = document.createElement('div'); change.className = 'mt-change';
    if (d && d.change !== null) {
      const cls = d.change > 0 ? 'up' : (d.change < 0 ? 'down' : '');
      change.innerHTML = `<span class="${cls}">${d.change.toFixed(2)}</span> <span class="${cls}">(${d.changePercent ? d.changePercent.toFixed(2) + '%' : ''})</span>`;
    } else {
      change.textContent = '';
    }

    const foot = document.createElement('div'); foot.className = 'mt-foot';
    const state = document.createElement('div'); state.textContent = d && d.marketState ? d.marketState : 'Data unavailable';
    const updated = document.createElement('div'); updated.textContent = d && d.lastUpdate ? new Date(d.lastUpdate).toLocaleTimeString() : '';
    foot.appendChild(state); foot.appendChild(updated);

    tile.appendChild(header);
    tile.appendChild(price);
    tile.appendChild(change);
    tile.appendChild(foot);
    grid.appendChild(tile);
    try{ rvO.observe(tile); }catch(e){}
  });
}

// bootstrap market rendering and periodic refresh
renderMarket();
setInterval(renderMarket, 60 * 1000);


function renderCurrently() {
  const wrap = document.getElementById('current-wrap');
  if (!wrap) return;
  const c = CONFIG.CURRENT || {};
  wrap.innerHTML = '';

  // Helper to create a card if value exists
  function addCard(title, lines, opts={}){
    if (!lines || (Array.isArray(lines) && lines.every(l=>!l))) return;
    const card = document.createElement('div');
    card.className = 'status-card rv';
    const h = document.createElement('div'); h.className='status-title'; h.textContent = title;
    card.appendChild(h);
    const body = document.createElement('div'); body.className='status-body';
    if (Array.isArray(lines)) {
      lines.forEach(line => {
        if (!line) return;
        const p = document.createElement('div'); p.className='status-line'; p.textContent = line;
        body.appendChild(p);
      });
    } else if (lines) {
      const p = document.createElement('div'); p.className='status-line'; p.textContent = lines; body.appendChild(p);
    }
    // optional status indicator for availability
    if (opts.indicator) {
      const ind = document.createElement('div'); ind.className='status-indicator ' + opts.indicator;
      card.appendChild(ind);
    }
    card.appendChild(body);
    wrap.appendChild(card);
    // reveal observer
    try{ rvO.observe(card); }catch(e){}
  }

  addCard('Education', [c.educationTitle, c.educationOrg]);
  addCard('Working On', c.workingOn);
  addCard('Current Focus', c.focus);

  // Availability with subtle status color
  if (c.availability) {
    const mode = /available/i.test(c.availability) ? 'available' : 'busy';
    addCard('Availability', c.availability, { indicator: mode });
  }

  // If nothing present, show a muted fallback
  if (!wrap.children.length) {
    const f = document.createElement('div'); f.className='status-empty rv'; f.textContent = 'No current updates — edit CONFIG.CURRENT in script.js to add status.';
    wrap.appendChild(f);
    try{ rvO.observe(f); }catch(e){}
  }
}

/* ─────────────────────────────────────────────
   STATS STATUS HELPER
   ───────────────────────────────────────────── */
function setStatsStatus(msg, isError=false) {
  const el = document.getElementById('stats-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? 'rgba(239,68,68,.7)' : 'var(--text-dim,#5a6270)';
}

/* ─────────────────────────────────────────────
   CACHE HELPERS
   ───────────────────────────────────────────── */
function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    return { data, ts, stale: Date.now() - ts > CONFIG.CACHE_TTL_MS };
  } catch { return null; }
}
function cacheSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch {}
}
function fmtTime(ts) {
  return ts ? new Date(ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '';
}

/* ─────────────────────────────────────────────
   GITHUB — fetch with proxy → public fallback → cache
   ───────────────────────────────────────────── */
async function loadGitHub() {
  /* 1. Show cache instantly if available */
  const cached = cacheGet(CONFIG.CACHE_KEY_GH);
  if (cached) {
    renderGitHub(cached.data);
    if (cached.stale) {
      setStatsStatus(`Refreshing data… (cached ${fmtTime(cached.ts)})`);
    } else {
      setStatsStatus(`Last updated ${fmtTime(cached.ts)}`);
      buildGitHubGraph(cached.data.reposForGraph || []);
      return; // fresh cache — skip refetch
    }
  } else {
    setStatsStatus('Loading stats…');
  }

  /* 2. Try proxy, then direct API */
  let ghData = null;
  try { ghData = await fetchGitHubProxy(); } catch (_) {}
  if (!ghData) {
    try { ghData = await fetchGitHubDirect(); } catch (err) {
      console.error('GitHub fetch failed:', err);
    }
  }

  if (ghData) {
    cacheSet(CONFIG.CACHE_KEY_GH, ghData);
    renderGitHub(ghData);
    buildGitHubGraph(ghData.reposForGraph || []);
    setStatsStatus(`Last updated ${fmtTime(Date.now())}`);
  } else if (cached) {
    setStatsStatus(`⚠ Offline — showing cached data (${fmtTime(cached.ts)})`, true);
    buildGitHubGraph(cached.data.reposForGraph || []);
  } else {
    setStatsStatus('⚠ GitHub data unavailable', true);
    buildGitHubGraph([]);
  }
}

async function fetchGitHubProxy() {
  const res = await fetch(`${CONFIG.GITHUB_PROXY}?user=${CONFIG.GITHUB_USER}`);
  if (!res.ok) throw new Error(`proxy ${res.status}`);
  const d = await res.json();
  return normalizeGitHub(d, 'proxy');
}

async function fetchGitHubDirect() {
  const userRes = await fetch(`${CONFIG.GITHUB_API}/users/${CONFIG.GITHUB_USER}`);
  if (!userRes.ok) throw new Error(`gh api ${userRes.status}`);
  const user = await userRes.json();

  const reposRes = await fetch(`${CONFIG.GITHUB_API}/users/${CONFIG.GITHUB_USER}/repos?per_page=100&sort=updated`);
  const repos = await reposRes.json();

  /* Language aggregation */
  const langMap = {};
  let totalWithLang = 0, totalStars = 0;
  for (const r of repos) {
    if (r.language) { langMap[r.language] = (langMap[r.language]||0)+1; totalWithLang++; }
    totalStars += r.stargazers_count || 0;
  }
  const languages = Object.entries(langMap)
    .sort((a,b)=>b[1]-a[1]).slice(0,5)
    .map(([name,count])=>({ name, count, percent: Math.round(count/totalWithLang*100) }));

  return {
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    totalStars,
    languages,
    reposForGraph: repos.map(r=>({ pushed_at: r.pushed_at })),
    source: 'direct'
  };
}

function normalizeGitHub(d, src) {
  /* Normalize proxy response to same shape as direct */
  return {
    publicRepos: d.publicRepos,
    followers:   d.followers,
    following:   d.following,
    totalStars:  d.totalStars,
    languages:   d.languages || [],
    reposForGraph: (d.recentRepos||[]).map(r=>({ pushed_at: r.updatedAt })),
    source: src
  };
}

function renderGitHub(d) {
  setText('github-repos',      d.publicRepos);
  setText('github-followers',  d.followers);
  setText('github-following',  d.following);
  setText('github-stars',      d.totalStars);
  renderLangGrid(d.languages || []);
}

function renderLangGrid(langs) {
  const colorMap = {
    'JavaScript':'linear-gradient(90deg,#f7df1e,#f7a81e)',
    'Python':    'linear-gradient(90deg,#3572a5,#4a9aca)',
    'TypeScript':'linear-gradient(90deg,#3178c6,#5ca9e8)',
    'HTML':      'linear-gradient(90deg,#e34c26,#ff6b6b)',
    'CSS':       'linear-gradient(90deg,#264de4,#61afd9)',
    'Java':      'linear-gradient(90deg,#007396,#f89820)',
    'Go':        'linear-gradient(90deg,#00ADD8,#00758F)',
    'Rust':      'linear-gradient(90deg,#CE422B,#F24D1B)',
    'C++':       'linear-gradient(90deg,#00599C,#0083d8)',
    'C':         'linear-gradient(90deg,#555,#aaa)',
  };
  const grid = document.getElementById('lang-grid');
  if (!grid || !langs.length) return;
  grid.innerHTML = '';
  langs.forEach((lang, i) => {
    const grad = colorMap[lang.name] || 'linear-gradient(90deg,#00f2fe,#7c3aed)';
    const item = document.createElement('div');
    item.className = `litem rv${i ? ` d${i}` : ''}`;
    item.innerHTML = `<div class="ltop"><span class="lname">${lang.name}</span><span class="lpct">${lang.percent}%</span></div><div class="lbar"><div class="lfill" style="background:${grad}" data-w="${lang.percent}%"></div></div>`;
    grid.appendChild(item);
  });
  // Re-observe newly injected bars
  setTimeout(()=>document.querySelectorAll('.lfill').forEach(b=>lbO.observe(b)), 80);
  // Re-observe new rv elements
  setTimeout(()=>grid.querySelectorAll('.rv').forEach(el=>rvO.observe(el)), 80);
}

function buildGitHubGraph(repos) {
  const cg = document.getElementById('cgraph');
  if (!cg) return;
  cg.innerHTML = '';

  const contribMap = {};
  repos.forEach(r => {
    if (!r.pushed_at) return;
    const week = Math.floor((Date.now() - new Date(r.pushed_at)) / (86400000 * 7));
    if (week < 52) contribMap[week] = (contribMap[week]||0) + 1;
  });

  // Fill 52 weeks × 7 days
  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('div');
      const c = contribMap[51 - w] || 0; // newest weeks on the right
      const lvl = c > 4 ? 4 : c > 2 ? 3 : c > 1 ? 2 : c > 0 ? 1 : 0;
      cell.className = `cc cc${lvl}`;
      cell.title = c ? `${c} push${c>1?'es':''} this week` : 'No activity';
      cg.appendChild(cell);
    }
  }
  const total = Object.values(contribMap).reduce((a,b)=>a+b,0);
  setText('contrib-count', total ? `${total} pushes` : '—');
}

/* ─────────────────────────────────────────────
   LEETCODE — proxy → public fallback → cache
   ───────────────────────────────────────────── */
async function loadLeetCode() {
  const cached = cacheGet(CONFIG.CACHE_KEY_LC);
  if (cached && !cached.stale) {
    renderLeetCode(cached.data);
    return;
  }
  if (cached) renderLeetCode(cached.data); // show stale while fetching

  let lcData = null;
  try { lcData = await fetchLeetCodeProxy(); } catch (_) {}
  if (!lcData) {
    try { lcData = await fetchLeetCodePublic(); } catch (err) {
      console.error('LeetCode fetch failed:', err);
    }
  }

  if (lcData) {
    cacheSet(CONFIG.CACHE_KEY_LC, lcData);
    renderLeetCode(lcData);
  } else if (cached) {
    renderLeetCode(cached.data);
  } else {
    /* Hard fallback so it never shows dashes */
    renderLeetCode({ total:'50+', easy:'17', medium:'30', hard:'5', ranking:null });
    setStatsStatus('⚠ LeetCode data unavailable', true);
  }
}

async function fetchLeetCodeProxy() {
  const res = await fetch(`${CONFIG.LEETCODE_PROXY}?user=${CONFIG.LEETCODE_USER}`);
  if (!res.ok) throw new Error(`lc proxy ${res.status}`);
  const d = await res.json();
  return {
    total:   d.totalSolved,
    easy:    d.easySolved,
    medium:  d.mediumSolved,
    hard:    d.hardSolved,
    ranking: d.ranking,
  };
}

async function fetchLeetCodePublic() {
  /* Uses the community-maintained CORS-enabled API */
  const res = await fetch(`${CONFIG.LEETCODE_FALLBACK}/${CONFIG.LEETCODE_USER}`);
  if (!res.ok) throw new Error(`lc public ${res.status}`);
  const d = await res.json();
  if (d.status === 'error') throw new Error(d.message || 'user not found');
  return {
    total:   d.totalSolved,
    easy:    d.easySolved,
    medium:  d.mediumSolved,
    hard:    d.hardSolved,
    ranking: d.ranking || null,
  };
}

function renderLeetCode(d) {
  setText('leetcode-solved', d.total);
  setText('leetcode-easy',   d.easy);
  setText('leetcode-medium', d.medium);
  setText('leetcode-hard',   d.hard);
  const rankEl = document.getElementById('leetcode-rank');
  if (rankEl && d.ranking) {
    rankEl.textContent = `Global Rank #${Number(d.ranking).toLocaleString()}`;
  }
}

/* ─────────────────────────────────────────────
   UTIL — safe textContent setter
   ───────────────────────────────────────────── */
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = (val !== null && val !== undefined) ? val : '—';
}

/* ─────────────────────────────────────────────
   CERTIFICATES — dynamic grid with PDF links
   ───────────────────────────────────────────── */

/*
  HOW TO ADD REAL CERTIFICATES:
  1. Drop the PDF into  assets/certificates/
  2. Add an entry below with the exact filename in `pdf`.
  3. Set `placeholder: false` once the real file is in place.

  The `placeholder` flag adds a "(Placeholder)" badge so it's always
  obvious that a real file has not yet been supplied.
*/
const CERTS = [
  {
    org:  'AMAZON WEB SERVICES',
    title:'AWS Certified Solutions Architect – Associate',
    date: 'March 2024',
    desc: 'Validates ability to design distributed systems on AWS with high availability and cost efficiency.',
    pdf:  'assets/certificates/aws_solutions_architect.pdf',
    placeholder: true,
    icon: '☁️',
  },
  {
    org:  'GOOGLE / COURSERA',
    title:'Machine Learning Specialization',
    date: 'January 2024',
    desc: 'Covers supervised & unsupervised learning, neural networks, and ML best practices by Andrew Ng.',
    pdf:  'assets/certificates/machine_learning.pdf',
    placeholder: true,
    icon: '🤖',
  },
  {
    org:  'META',
    title:'React Developer Professional Certificate',
    date: 'October 2023',
    desc: 'Professional-level React development — components, hooks, state management, and testing.',
    pdf:  'assets/certificates/react_developer.pdf',
    placeholder: true,
    icon: '⚛️',
  },
  {
    org:  'COMPTIA',
    title:'CompTIA Security+ Certification',
    date: 'August 2023',
    desc: 'Foundational cybersecurity certification covering threats, vulnerabilities, and mitigation.',
    pdf:  'assets/certificates/comptia_security.pdf',
    placeholder: true,
    icon: '🔒',
  },
  {
    org:  'JETBRAINS ACADEMY',
    title:'Python Developer Track',
    date: 'June 2023',
    desc: 'Hands-on Python programming track — data structures, OOP, algorithms, and project building.',
    pdf:  'assets/certificates/python_developer.pdf',
    placeholder: true,
    icon: '🐍',
  },
  {
    org:  'HACKERRANK',
    title:'Problem Solving (Advanced) Gold Badge',
    date: 'April 2023',
    desc: 'Gold badge for advanced algorithmic problem solving on the HackerRank platform.',
    pdf:  'assets/certificates/problem_solving.pdf',
    placeholder: true,
    icon: '🏆',
  },
];

const EXPERIENCE = [
  {
    category: 'Leadership & Campus',
    organization: 'GeekRoom Technical Club',
    role: 'Event Management Lead',
    date: 'Feb 2026 – present',
    status: 'Leadership',
    description: 'Lead a 13-member event management team, coordinating and executing technical events that encourage innovation, collaboration and learning within the college community.',
    link: null,
  },
  {
    category: 'Leadership & Campus',
    organization: 'ISTE Club',
    role: 'Event Management',
    date: 'Nov 2025 – present',
    status: 'Leadership',
    description: 'Planned and managed college events at the Indian Society for Technical Education, helping deliver professional technical workshops and community-focused activities.',
    link: null,
  },
  {
    category: 'Leadership & Campus',
    organization: 'Magan — Music Club',
    role: 'PR / Photography & Videography',
    date: 'Sept 2024 – present',
    status: 'Leadership',
    description: 'Contribute to PR activities and handle photography and videography for campus music events, highlighting club initiatives and capturing creative experiences.',
    link: null,
  },
  {
    category: 'Professional / Project',
    organization: 'Saanjh, NGO',
    role: 'Video Editor',
    date: 'Nov 2025 – Mar 2026',
    status: 'Professional Experience',
    description: 'Worked for approximately 5 months editing videos for an NGO supporting underprivileged children, creating content to amplify social outreach and program impact.',
    link: null,
  },
];

/* ------------------------------------------------------------------
   EXPERIENCE / MILESTONES DATA
   Central source of truth for experience cards. Add new entries
   here using the fields below, then the UI will render them automatically.
------------------------------------------------------------------ */
const EXPERIENCE_CATEGORIES = [
  'Professional / Project',
  'Leadership & Campus',
  'Hackathons & Competitions',
  'Hiring & Technical Assessments'
  
];

function renderExperience(category = 'Professional / Project') {
  const nav = document.getElementById('experience-nav');
  const grid = document.getElementById('experience-grid');
  if (!nav || !grid) return;

  nav.innerHTML = '';
  grid.innerHTML = '';

  EXPERIENCE_CATEGORIES.forEach(cat => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'exp-tab';
    tab.textContent = cat;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', cat === category ? 'true' : 'false');
    tab.addEventListener('click', () => renderExperience(cat));
    nav.appendChild(tab);
  });

  const items = EXPERIENCE.filter(item => item.category === category);
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'exp-empty rv';
    empty.textContent = 'No experiences are available for this category yet.';
    grid.appendChild(empty);
    rvO.observe(empty);
    return;
  }

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'exp-card rv';

    const badge = document.createElement('div');
    badge.className = 'exp-badge';
    badge.textContent = item.status;

    const title = document.createElement('div');
    title.className = 'exp-title';
    title.textContent = item.role;

    const org = document.createElement('div');
    org.className = 'exp-org';
    org.textContent = item.organization;

    const date = document.createElement('div');
    date.className = 'exp-date';
    date.textContent = item.date || 'Date unavailable';

    const desc = document.createElement('div');
    desc.className = 'exp-desc';
    desc.textContent = item.description;

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(org);
    card.appendChild(date);
    card.appendChild(desc);

    if (item.link) {
      const link = document.createElement('a');
      link.className = 'exp-link';
      link.href = item.link;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Learn more';
      card.appendChild(link);
    }

    grid.appendChild(card);
    rvO.observe(card);
  });
}

function renderCerts() {
  const grid = document.getElementById('cert-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CERTS.forEach((c, i) => {
    const delay = i < 4 ? ` d${i}` : '';
    const placeholderBadge = c.placeholder
      ? `<span class="cert-placeholder-badge">Placeholder PDF</span>`
      : '';

    const card = document.createElement('div');
    card.className = `ccard rv${delay}`;
    card.innerHTML = `
      <div class="cbanner">
        <span class="cert-icon">${c.icon}</span>
        ${placeholderBadge}
      </div>
      <div class="cbody">
        <div class="cissuer">${c.org}</div>
        <div class="ctitle">${c.title}</div>
        <div class="cdate">${c.date}</div>
        <div class="cdesc">${c.desc}</div>
        <div class="cert-actions">
          <a href="${c.pdf}" target="_self" class="cert-btn cert-btn-view" title="View in browser">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View
          </a>
          <a href="${c.pdf}" download class="cert-btn cert-btn-dl" title="Download PDF">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </a>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  // Observe newly injected reveal elements
  setTimeout(()=>grid.querySelectorAll('.rv').forEach(el=>rvO.observe(el)), 80);
}

/* ─────────────────────────────────────────────
   CONTACT FORM
   ───────────────────────────────────────────── */
function handleSubmit(btn) {
  const statusEl = document.getElementById('contact-status');
  const nameEl = document.getElementById('contact-name');
  const emailEl = document.getElementById('contact-email');
  const subjectEl = document.getElementById('contact-subject');
  const messageEl = document.getElementById('contact-message');
  if (!nameEl || !emailEl || !subjectEl || !messageEl) return;

  // Simple client-side validation
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const subject = subjectEl.value.trim();
  const message = messageEl.value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name) { statusEl.textContent = 'Please enter your name.'; nameEl.focus(); return; }
  if (!email || !emailRe.test(email)) { statusEl.textContent = 'Please enter a valid email.'; emailEl.focus(); return; }
  if (!subject) { statusEl.textContent = 'Please add a subject.'; subjectEl.focus(); return; }
  if (message.length < 10) { statusEl.textContent = 'Message is too short (min 10 chars).'; messageEl.focus(); return; }
  if (message.length > 5000) { statusEl.textContent = 'Message is too long (max 5000 chars).'; messageEl.focus(); return; }

  // Disable button and show loading
  const orig = btn.innerHTML;
  btn.disabled = true; btn.style.opacity = '.6'; btn.innerHTML = 'Sending…';
  statusEl.textContent = '';

  // Prevent duplicate submissions via dataset flag
  if (btn.dataset.sending === '1') return;
  btn.dataset.sending = '1';

  const endpoint = CONFIG.CONTACT_ENDPOINT || '/api/contact';
  const payload = { name, email, subject, message };
  let options;

  if (endpoint === '/api/contact') {
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };
  } else {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('_replyto', email);
    formData.append('_subject', `New message from ${name}`);
    options = { method: 'POST', body: formData };
  }

  fetch(endpoint, options).then(async res => {
    if (endpoint === '/api/contact') {
      const d = await res.json().catch(()=>({}));
      if (res.ok) {
        btn.innerHTML = '✓ Sent!';
        btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        btn.style.color = '#0a0b10';
        statusEl.style.color = 'var(--text)';
        statusEl.textContent = d.message || 'Message sent — thank you!';
        nameEl.value = ''; emailEl.value = ''; subjectEl.value = ''; messageEl.value = '';
      } else {
        const err = d.error || d.message || 'Failed to send message.';
        statusEl.style.color = 'rgba(239,68,68,.9)';
        statusEl.textContent = err;
        btn.innerHTML = orig;
        btn.disabled = false; btn.style.opacity = '1';
      }
    } else {
      if (res.ok) {
        btn.innerHTML = '✓ Sent!';
        btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        btn.style.color = '#0a0b10';
        statusEl.style.color = 'var(--text)';
        statusEl.textContent = 'Message sent — thank you!';
        nameEl.value = ''; emailEl.value = ''; subjectEl.value = ''; messageEl.value = '';
      } else {
        statusEl.style.color = 'rgba(239,68,68,.9)';
        statusEl.textContent = 'Failed to send message. Please try again.';
        btn.innerHTML = orig;
        btn.disabled = false; btn.style.opacity = '1';
      }
    }
  }).catch(e => {
    statusEl.style.color = 'rgba(239,68,68,.9)';
    statusEl.textContent = 'Network error — please try again later.';
    btn.innerHTML = orig; btn.disabled = false; btn.style.opacity = '1';
  }).finally(()=>{ btn.dataset.sending = '0'; setTimeout(()=>{ btn.disabled=false; btn.style.opacity='1'; btn.style.background=''; btn.style.color=''; btn.innerHTML=orig; }, 3500); });
}

/* ─────────────────────────────────────────────
   MOBILE NAV
   ───────────────────────────────────────────── */
function toggleMob() {
  document.getElementById('mobNav').classList.toggle('open');
}

/* ─────────────────────────────────────────────
   HERO ENTRANCE ANIMATION
   ───────────────────────────────────────────── */
document.querySelectorAll('.hero-left > *').forEach((el,i)=>{
  el.style.opacity='0';
  el.style.transform='translateY(24px)';
  el.style.transition=`opacity .55s ease ${i*.1}s, transform .55s cubic-bezier(0.16,1,0.3,1) ${i*.1}s`;
  setTimeout(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; }, 60);
});

/* ─────────────────────────────────────────────
   BOOTSTRAP — run everything
   ───────────────────────────────────────────── */
renderCerts();
loadGitHub();
loadLeetCode();
renderCurrently();
renderProjects();
renderExperience();
