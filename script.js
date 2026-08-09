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

/* ─── PAGE LOADER TYPEWRITER ─── */
(function(){
  const loader=document.getElementById('page-loader');
  const textEl=loader?.querySelector('.loader-text');
  if (!loader || !textEl) return;
  const name='Loading....';
  let idx=0;
  textEl.textContent='';
  const typeNext=()=>{
    if (idx < name.length) {
      textEl.textContent += name[idx++];
      setTimeout(typeNext, 160);
    } else {
      setTimeout(()=>loader.classList.add('page-loader-hidden'), 1000);
    }
  };
  window.addEventListener('load',()=>setTimeout(typeNext, 250));
})();

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
  CONTACT_ENDPOINT: 'https://form.typeform.com/to/kGhM6Dgf', // set to your third-party form endpoint, e.g. https://formspree.io/f/yourFormId
  /* Public fallbacks used when proxy returns 404 (e.g. GitHub Pages) */
  GITHUB_API:       'https://api.github.com',
  LEETCODE_FALLBACK:'https://leetcode-stats-api.herokuapp.com',
  MARKET_API:       'https://query1.finance.yahoo.com/v7/finance/quote',
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
  educationTitle: 'Coping with Vth Sem',
  educationOrg: '',

  // Short description of what you're working on (project name or short phrase)
  workingOn: 'Portfolio Web & Project of ML',

  // Current focus such as 'Preparing for GATE', 'Learning FastAPI', etc.
  focus: "Maintaining streak, not snapchat; it's leetcode",

  // Availability - free-text. Use 'Available' for green status, otherwise any text (e.g. 'Busy until 2026-09-10')
  availability: 'Available',
};

/* ------------------------------------------------------------------
   PROJECTS DATA — centralized source of truth for project cards.
   Update this array to add/edit projects. Do NOT duplicate content
   elsewhere in the codebase. Keep URLs empty if not available.
  ------------------------------------------------------------------ */
const PROJECTS = [
  {
  id: 'safaro',
  title: 'Safaro',
  short: 'Reverse travel marketplace connecting travellers with agencies for personalized trip planning.',
  problem: 'Helps travellers find suitable agencies and packages based on their specific requirements.',
  tech: ['Python', 'Django', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
  status: 'In Progress',
  github: 'Links will be available soon....',
  live: 'Links will be available soon....'
  },
  {
  id: 'stock-correlation',
  title: 'Stock Correlation Analyzer',
  short: 'Financial analytics tool for analyzing and visualizing correlations between stocks.',
  problem: 'Simplifies stock relationship analysis for better portfolio and investment research.',
  tech: ['Python', 'Flask', 'NumPy', 'Pandas', 'yFinance', 'Matplotlib'],
  status: 'Completed',
  github: 'Links will be available soon....',
  live: 'Links will be available soon....'
},

{
  id: 'compliance-pro',
  title: 'Compliance Pro',
  short: 'AI-powered platform designed to simplify business compliance and regulatory management.',
  problem: 'Helps businesses identify and manage complex compliance requirements efficiently.',
  tech: ['Python', 'Django', 'AI', 'HTML', 'CSS', 'JavaScript'],
  status: 'Completed',
  github: 'Links will be available soon....',
  live: 'Links will be available soon....'
},

{
  id: 'file-redaction',
  title: 'File Word Redaction Project',
  short: 'Document processing tool for detecting and redacting sensitive information from Word files.',
  problem: 'Reduces the risk of exposing sensitive information when sharing documents.',
  tech: ['Python', 'Django', 'NLP', 'HTML', 'CSS', 'JavaScript'],
  status: 'Completed',
  github: 'Links will be available soon....',
  live: 'Links will be available soon....'
},

{
  id: 'student-finance',
  title: 'Student Finance Management',
  short: 'Finance management platform for tracking student expenses, budgets, and spending habits.',
  problem: 'Helps students manage daily expenses and maintain better control over their budgets.',
  tech: ['Python', 'Django', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
  status: 'Completed',
  github: 'Links will be available soon....',
  live: 'Links will be available soon....'
},

{
  id: 'import-export',
  title: 'Import & Export Project',
  short: 'Platform for managing import-export operations, products, and trade-related information.',
  problem: 'Simplifies the organization and management of import-export records and transactions.',
  tech: ['Python', 'Django', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
  status: 'In Progress',
  github: 'Links will be available soon....',
  live: 'Links will be available soon....'
},

{
  id: 'hostel-needs',
  title: 'Hostel Needs Project',
  short: 'Platform helping hostel students find essential products and services conveniently.',
  problem: 'Makes everyday hostel necessities easier to discover and access.',
  tech: ['Python', 'Django', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
  status: 'In Progress',
  github: 'Links will be available soon....',
  live: 'Links will be available soon....'
},
{
  id: 'More',
  title: 'More Projects Coming Soon.......',
  short: ' ',
  problem: 'There is a lot of problems to solve',
  tech: ['Brain'],
  status: 'In Progress',
  github: 'Links will be available soon....',
  live: 'Links will be available soon....'
}
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
    // For static-hosted portfolio, open the simple projects landing page
    const githubLink = document.createElement('a'); githubLink.className='proj-btn'; githubLink.href = 'projects.html'; githubLink.target='_self'; githubLink.rel='noopener'; githubLink.textContent='GitHub'; ctas.appendChild(githubLink);
    const visitLink = document.createElement('a'); visitLink.className='proj-btn'; visitLink.href = 'projects.html'; visitLink.target='_self'; visitLink.rel='noopener'; visitLink.textContent='Visit'; ctas.appendChild(visitLink);

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
    const qEnc = encodeURIComponent(q);
    const yahooUrl = `${CONFIG.MARKET_API}?symbols=${qEnc}`;

    const attempts = [];

    // Helper to parse Yahoo-style payload
    const parsePayload = payload => (payload && payload.quoteResponse && payload.quoteResponse.result) || [];

    // 1) Try direct Yahoo fetch
    try {
      const r = await fetch(yahooUrl);
      if (r.ok) {
        const p = await r.json();
        const res = parsePayload(p);
        if (res && res.length) { console.info('Market: fetched direct from Yahoo'); return { data: normalize(resultsToData(res)) }; }
        // If Yahoo returns an error payload, fall through to proxies
        attempts.push('yahoo-direct-empty');
      } else {
        attempts.push(`yahoo-direct-status-${r.status}`);
      }
    } catch (err) { attempts.push('yahoo-direct-error'); }

    // 2) Try AllOrigins
    const allOrigins = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`;
    try {
      const r = await fetch(allOrigins);
      if (r.ok) {
        const p = await r.json();
        const res = parsePayload(p);
        if (res && res.length) { console.info('Market: fetched via AllOrigins proxy'); return { data: normalize(resultsToData(res)) }; }
        attempts.push('allorigins-empty');
      } else attempts.push(`allorigins-status-${r.status}`);
    } catch (err) { attempts.push('allorigins-error'); }

    // 3) Try ThingProxy free proxy
    const thingProxy = `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(yahooUrl)}`;
    try {
      const r = await fetch(thingProxy);
      if (r.ok) {
        const p = await r.json();
        const res = parsePayload(p);
        if (res && res.length) { console.info('Market: fetched via ThingProxy'); return { data: normalize(resultsToData(res)) }; }
        attempts.push('thingproxy-empty');
      } else attempts.push(`thingproxy-status-${r.status}`);
    } catch (err) { attempts.push('thingproxy-error'); }

    // 4) Try Financial Modeling Prep (requires API key) — use demo key if not provided
    const fmpKey = CONFIG.FMP_API_KEY || 'demo';
    // Map symbols to FMP format if possible (best-effort). Use same symbols for now.
    try {
      const fmpUrl = `https://financialmodelingprep.com/api/v3/quote/${encodeURIComponent(symbols.join(','))}?apikey=${encodeURIComponent(fmpKey)}`;
      const r = await fetch(fmpUrl);
      if (r.ok) {
        const p = await r.json();
        if (Array.isArray(p) && p.length) {
          console.info('Market: fetched via FinancialModelingPrep');
          // Normalize FMP response to our shape
          const data = p.map(x => ({ symbol: x.symbol, name: x.name || x.symbol, price: x.price ?? null, change: x.change ?? null, changePercent: x.changesPercentage ?? null, marketState: null, currency: x.currency || null, lastUpdate: x.timestamp ? new Date(x.timestamp * 1000).toISOString() : null }));
          return { data };
        }
        attempts.push('fmp-empty');
      } else attempts.push(`fmp-status-${r.status}`);
    } catch (err) { attempts.push('fmp-error'); }

    console.warn('Market fetch attempts failed:', attempts);
    return null;
  } catch (err) {
    console.error('fetchMarketData error:', err);
    return null;
  }
}

// Helpers used above
function resultsToData(results) {
  return results.map(q => ({ symbol: q.symbol, name: q.longName || q.shortName || q.displayName || q.symbol, price: q.regularMarketPrice ?? null, change: q.regularMarketChange ?? null, changePercent: q.regularMarketChangePercent ?? null, marketState: q.marketState || null, currency: q.currency ?? null, lastUpdate: q.regularMarketTime ? new Date(q.regularMarketTime * 1000).toISOString() : null }));
}

function normalize(arr) { return arr; }
// Render the redesigned Trading & Markets section (decorative visualizations only)
function renderTradingSection() {
  // Draw correlation visualization and market visualization on intersection
  const corrEl = document.getElementById('corr-vis');
  const mvEl = document.getElementById('market-vis');

  function drawCorrelation(el) {
    if (!el) return;
    el.innerHTML = '';
    const size = Math.min(el.clientWidth, 260);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS,'svg'); svg.setAttribute('width','100%'); svg.setAttribute('height','100%'); svg.setAttribute('viewBox',`0 0 160 96`);
    const groups = 6; const cell = 14; const pad = 6;
    // generate sample symmetric correlation matrix (decorative)
    const mat = Array.from({length:groups},(_,i)=>Array.from({length:groups},(_,j)=>{ if (i===j) return 1; const v = ((i-j)/groups) + (Math.sin((i+j)/2)*0.15); return Math.max(-1,Math.min(1,Number(v.toFixed(2)))); }));
    for (let r=0;r<groups;r++){
      for (let c=0;c<groups;c++){
        const val = mat[r][c];
        const x = pad + c*cell; const y = pad + r*cell;
        const rect = document.createElementNS(svgNS,'rect'); rect.setAttribute('x',x); rect.setAttribute('y',y); rect.setAttribute('width',cell-1); rect.setAttribute('height',cell-1);
        // color scale: negative->blue, positive->orange
        const t = (val+1)/2; const rcol = Math.round(34 + t*200); const gcol = Math.round(50 + (1-t)*80); const bcol = Math.round(60 + (1-t)*140);
        rect.setAttribute('fill',`rgba(${rcol},${gcol},${bcol},${0.9*Math.abs(val)})`);
        rect.setAttribute('stroke','rgba(255,255,255,0.02)'); svg.appendChild(rect);
      }
    }
    el.appendChild(svg);
  }

  function drawMarketVis(el) {
    if (!el) return;
    el.innerHTML = '';
    const svgNS = 'http://www.w3.org/2000/svg';
    const w = el.clientWidth||600; const h = el.clientHeight||220; const viewW=600, viewH=220;
    const svg = document.createElementNS(svgNS,'svg'); svg.setAttribute('viewBox',`0 0 ${viewW} ${viewH}`); svg.setAttribute('preserveAspectRatio','none');
    // grid lines
    for (let i=0;i<6;i++){ const y = 20 + i*(viewH-40)/5; const line=document.createElementNS(svgNS,'line'); line.setAttribute('x1',40); line.setAttribute('x2',viewW-20); line.setAttribute('y1',y); line.setAttribute('y2',y); line.setAttribute('stroke','rgba(255,255,255,0.03)'); line.setAttribute('stroke-width','1'); svg.appendChild(line);} 
    // generate sample data (random walk)
    const points = []; let val=100; for(let i=0;i<60;i++){ val += (Math.random()-0.45)*2.8; points.push(val); }
    const min = Math.min(...points), max = Math.max(...points);
    const pathD = points.map((v,i)=>{ const x = 40 + i*(viewW-60)/(points.length-1); const y = 20 + (1-(v-min)/(max-min))*(viewH-40); return `${i===0?'M':'L'} ${x.toFixed(2)} ${y.toFixed(2)}`; }).join(' ');
    const path = document.createElementNS(svgNS,'path'); path.setAttribute('d',pathD); path.setAttribute('fill','none'); path.setAttribute('stroke','url(#grad)'); path.setAttribute('stroke-width','2.2'); path.setAttribute('stroke-linecap','round'); path.setAttribute('stroke-linejoin','round'); path.setAttribute('class','mv-path');
    const defs = document.createElementNS(svgNS,'defs'); const lin = document.createElementNS(svgNS,'linearGradient'); lin.setAttribute('id','grad'); lin.setAttribute('x1','0'); lin.setAttribute('x2','1'); lin.setAttribute('y1','0'); lin.setAttribute('y2','0'); const s1=document.createElementNS(svgNS,'stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color','rgba(124,58,237,0.9)'); const s2=document.createElementNS(svgNS,'stop'); s2.setAttribute('offset','100%'); s2.setAttribute('stop-color','rgba(0,242,254,0.9)'); lin.appendChild(s1); lin.appendChild(s2); defs.appendChild(lin); svg.appendChild(defs);
    svg.appendChild(path);
    // draw small points
    points.forEach((v,i)=>{ const x = 40 + i*(viewW-60)/(points.length-1); const y = 20 + (1-(v-min)/(max-min))*(viewH-40); const c = document.createElementNS(svgNS,'circle'); c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',2.2); c.setAttribute('fill','rgba(255,255,255,0.06)'); svg.appendChild(c); });

    el.appendChild(svg);

    // animate path draw unless user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset 1.6s ease-out';
      requestAnimationFrame(()=>{ path.style.strokeDashoffset = '0'; });
    }
  }

  // Intersection observers
  try {
    const io = new IntersectionObserver(entries=>{ entries.forEach(e=>{ if (e.isIntersecting){ if (e.target.id==='market-vis') drawMarketVis(e.target); if (e.target.id==='corr-vis') drawCorrelation(e.target); io.unobserve(e.target); }}); },{threshold:0.18});
    if (mvEl) io.observe(mvEl);
    if (corrEl) io.observe(corrEl);
  } catch (e) {
    // fallback: draw immediately
    drawCorrelation(corrEl); drawMarketVis(mvEl);
  }
}

// Initialize the trading section visuals
renderTradingSection();


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
    renderLeetCode({ total:'200+', easy:'50+', medium:'100+', hard:'40', ranking: '790950' });
    setStatsStatus(' ', true);
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
    org:  'COURSERA',
    title:'Artificial Intelligence',
    date: 'April 2026',
    desc: 'Learned AI concepts, techniques, and algorithms, explored their applications across sectors.Learned to apply AI methods to real-world problems.',
    pdf:  'assets/certificates/AI.pdf',
    placeholder: false,
    icon: '🖥️',
  },
  {
    org:  'COURSERA',
    title:'IoT (Internet of Things) Wireless & Cloud Computing Emerging Technologies',
    date: 'April 2026',
    desc: 'Gained practical knowledge of IoT, wireless technologies, cloud computing, AWS, cloud-based integration, and emerging technology architectures.',
    pdf:  'assets/certificates/Iot & Cloud computing.pdf ',
    placeholder: false,
    icon: '☁️',
  },
  {
    org:  'UDEMY',
    title:'Java Programming ',
    date: 'October 2025',
    desc: 'Gained a strong foundation in Java programming, including OOP concepts, data structures, problem-solving, and core Java development.',
    pdf:  'assets/certificates/Java.pdf',
    placeholder: false,
    icon: '☁️',
  }
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
    status: 'Management',
    description: 'Planned and managed college events at the Indian Society for Technical Education, helping deliver professional technical workshops and community-focused activities.',
    link: null,
  },
  {
    category: 'Leadership & Campus',
    organization: 'Magan — Music Club',
    role: 'PR / Photography & Videography',
    date: 'Sept 2024 – present',
    status: 'Photography',
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
  {
  category: 'Hackathons & Competitions',
  organization: 'Flipkart GRiD 8.0',
  role: 'Round 1 — Screening Qualified',
  date: '2026',
  status: 'Hackathon Achievement',
  description: 'Cleared the Round 1 screening of Flipkart GRiD 8.0, advancing to the next stage of the national-level technology competition.',
  link: null,
},

{
  category: 'Hackathons & Competitions',
  organization: 'ET Gen AI Hackathon 2.0',
  role: 'Round 1 — Qualified',
  date: '2026',
  status: 'Hackathon Achievement',
  description: 'Cleared Round 1 and advanced to the Build Sprint, developing an ML-based solution focused on import and export operations.',
  link: null,
},

{
  category: 'Hackathons & Competitions',
  organization: 'CodeWizard 2026',
  role: 'On-Campus Hackathon — Shortlisted',
  date: '2026',
  status: 'Hackathon Achievement',
  description: 'Shortlisted for the 24-hour on-campus hackathon and developed Compliance Pro, a solution focused on simplifying business compliance.',
  link: null,
},

{
  category: 'Hiring & Technical Assessments',
  organization: 'Citadel',
  role: 'Online Assessment',
  date: '2026',
  status: 'Technical Assessment',
  description: 'Participated in Citadel’s technical online assessment as part of the internship selection process.',
  link: null,
},

{
  category: 'Hiring & Technical Assessments',
  organization: 'BNY',
  role: 'Online Assessment',
  date: '2026',
  status: 'Technical Assessment',
  description: 'Completed BNY’s technical online assessment as part of the internship selection process.',
  link: null,
},

{
  category: 'Hiring & Technical Assessments',
  organization: 'Flipkart',
  role: 'Online Assessment',
  date: '2026',
  status: 'Technical Assessment',
  description: 'Participated in Flipkart’s technical online assessment as part of the internship selection process.',
  link: null,
},

{
  category: 'Hiring & Technical Assessments',
  organization: 'Tally Solutions Pvt. Ltd.',
  role: 'Online Assessment',
  date: '2026',
  status: 'Technical Assessment',
  description: 'Completed Tally Solutions’ technical online assessment as part of the selection process.',
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
    // Build a short overview: explicit `overview` if provided, else first sentence of `desc` or title
    const overview = (c.overview && String(c.overview).trim()) || (c.desc ? String(c.desc).split('.')[0] : c.title);

    const card = document.createElement('div');
    card.className = `ccard rv${delay}`;
    card.innerHTML = `
      <div class="cbanner">
        <svg class="cert-banner-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 3h10v14l-5-2-5 2V3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9 7h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
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
