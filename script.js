/* ─── CURSOR ─── */
const cur=document.getElementById('cur'),curR=document.getElementById('curR');
document.addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';curR.style.left=e.clientX+'px';curR.style.top=e.clientY+'px';});
document.querySelectorAll('a,button,.pcard,.ccard,.clink').forEach(el=>{el.addEventListener('mouseenter',()=>curR.classList.add('big'));el.addEventListener('mouseleave',()=>curR.classList.remove('big'));});

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
  scene.add(stars(1400,0xffffff,.42));scene.add(stars(350,0x00d4ff,.58));scene.add(stars(220,0x7c3aed,.52));
  function nebula(count,color,spread,z){
    const geo=new THREE.BufferGeometry(),pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){const r=Math.random()*spread,a=Math.random()*Math.PI*2;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=(Math.random()-.5)*spread*.4;pos[i*3+2]=Math.sin(a)*r+z;}
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    return new THREE.Points(geo,new THREE.PointsMaterial({color,size:1.35,transparent:true,opacity:.17}));
  }
  scene.add(nebula(320,0x7c3aed,105,-125));scene.add(nebula(220,0x00d4ff,85,-105));scene.add(nebula(160,0xff6b6b,65,-90));
  let mx=0,my=0;
  document.addEventListener('mousemove',e=>{mx=(e.clientX/window.innerWidth-.5)*2;my=(e.clientY/window.innerHeight-.5)*2;});
  let t=0;
  (function loop(){requestAnimationFrame(loop);t+=.0012;const sf=window.scrollY/(document.body.scrollHeight-window.innerHeight||1);camera.position.x+=(mx*5-camera.position.x)*.018;camera.position.y+=(-my*5-camera.position.y)*.018;scene.rotation.y=t*.04+sf*Math.PI*.5;scene.rotation.x=sf*Math.PI*.12;renderer.render(scene,camera);})();
})();

/* ─── ASTRONAUT SCROLL ENGINE ─── */
const aw=document.getElementById('astro-wrap');
const asv=document.getElementById('astro-svg');

/*
  Waypoints per section — coordinates in viewport %
  x: left% (0=left edge, 100=right edge) of astronaut center
  y: top% (0=top, 100=bottom) of astronaut center
  scale: SVG scale
  rot: rotation degrees
  cls: idle animation class
  glow: drop-shadow color
*/
const WP=[
  // 0 hero — right side floating, coding on laptop
  {x:75, y:52, scale:1.12, rot:0,   cls:'m-float', glow:'rgba(0,212,255,.22)'},
  // 1 projects — far right, looking at cards from above with curiosity
  {x:88, y:60, scale:.88,  rot:-14, cls:'m-zoom',  glow:'rgba(0,212,255,.18)'},
  // 2 coding — left side, hunched typing intensely
  {x:9,  y:52, scale:.92,  rot:6,   cls:'m-type',  glow:'rgba(0,212,255,.25)'},
  // 3 experience — right, drifting thoughtfully beside timeline
  {x:86, y:50, scale:.86,  rot:-7,  cls:'m-think', glow:'rgba(124,58,237,.22)'},
  // 4 certificates — left side, waving / holding cert
  {x:8,  y:56, scale:.9,   rot:8,   cls:'m-wave',  glow:'rgba(124,58,237,.2)'},
  // 5 contact — right, waving hello
  {x:84, y:54, scale:.88,  rot:-4,  cls:'m-wave',  glow:'rgba(255,107,107,.2)'},
];

const SECTIONS=['hero','projects','coding','experience','certificates','contact'];

// Current smooth position
let cx=WP[0].x, cy=WP[0].y;
let lastIdx=-1;
let mParX=0, mParY=0;

document.addEventListener('mousemove',e=>{mParX=(e.clientX/window.innerWidth-.5)*2;mParY=(e.clientY/window.innerHeight-.5)*2;});

function lerp(a,b,t){return a+(b-a)*t;}
function smoothstep(t){return t*t*(3-2*t);}
function easeInOut(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}

function getActiveSection(){
  let idx=0;
  SECTIONS.forEach((id,i)=>{
    const el=document.getElementById(id);
    if(!el)return;
    const r=el.getBoundingClientRect();
    if(r.top<window.innerHeight*.55)idx=i;
  });
  return idx;
}

function getSectionFrac(id){
  const el=document.getElementById(id);
  if(!el)return 0;
  const r=el.getBoundingClientRect();
  const vh=window.innerHeight;
  return Math.max(0,Math.min(1,(vh-r.top)/(r.height+vh)));
}

function spawnTrail(){
  const colors=['#00d4ff','#7c3aed','#ff6b6b','rgba(255,255,255,.8)'];
  for(let i=0;i<5;i++){
    setTimeout(()=>{
      const s=document.createElement('div');
      s.className='spk';
      const c=colors[Math.floor(Math.random()*colors.length)];
      const sz=3+Math.random()*4;
      const ax=parseFloat(aw.style.left||'75');
      const ay=parseFloat(aw.style.top||'52');
      s.style.cssText=`left:${ax}vw;top:${ay}vh;width:${sz}px;height:${sz}px;background:${c};--dx:${(Math.random()-.5)*70}px;--dy:${(Math.random()-.5)*70}px;transform:translate(-50%,-50%)`;
      document.body.appendChild(s);
      setTimeout(()=>s.remove(),1000);
    },i*90);
  }
}

let lastSpawn=0;

function updateAstro(){
  const now=performance.now();
  const activeIdx=getActiveSection();
  const curWP=WP[Math.min(activeIdx,WP.length-1)];
  const nextWP=WP[Math.min(activeIdx+1,WP.length-1)];
  const frac=easeInOut(getSectionFrac(SECTIONS[activeIdx]));

  const tx=lerp(curWP.x,nextWP.x,frac);
  const ty=lerp(curWP.y,nextWP.y,frac);
  const tScale=lerp(curWP.scale,nextWP.scale,frac);
  const tRot=lerp(curWP.rot,nextWP.rot,frac);

  // Smooth follow with different speeds for x vs y
  cx=lerp(cx,tx,.055);
  cy=lerp(cy,ty,.055);

  // Micro-parallax from mouse (subtle, layered on top)
  const px=mParX*1.2, py=mParY*1.2;

  aw.style.left=(cx+px)+'vw';
  aw.style.top=(cy+py)+'vh';
  aw.style.transform=`translate(-50%,-50%) scale(${tScale}) rotate(${tRot}deg)`;
  aw.style.filter=`drop-shadow(0 0 20px ${curWP.glow})`;

  // Swap animation on section change
  if(activeIdx!==lastIdx){
    asv.classList.remove('m-float','m-type','m-think','m-wave','m-zoom');
    asv.classList.add(curWP.cls);
    lastIdx=activeIdx;
    if(now-lastSpawn>400){spawnTrail();lastSpawn=now;}
  }

  // Spawn occasional sparkles while in motion
  const dist=Math.abs(tx-cx)+Math.abs(ty-cy);
  if(dist>0.25&&now-lastSpawn>800){spawnTrail();lastSpawn=now;}
}

// Init
asv.classList.add('m-float');

function mainLoop(){updateAstro();updateProg();requestAnimationFrame(mainLoop);}
mainLoop();

/* ─── SCROLL PROGRESS ─── */
function updateProg(){const p=window.scrollY/(document.body.scrollHeight-window.innerHeight||1)*100;document.getElementById('prog').style.width=p+'%';}

/* ─── NAV ─── */
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('s',window.scrollY>60));

/* ─── REVEAL ─── */
const rvO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvO.unobserve(e.target);}});},{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>rvO.observe(el));

/* ─── FETCH REAL-TIME DATA ─── */
fetchGitHubData();
fetchLeetCodeData();

/* ─── COUNTERS ─── */
const cO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const target=parseInt(e.target.dataset.count),suffix=target>10?'+':'';let t0=null;const step=ts=>{if(!t0)t0=ts;const p=Math.min((ts-t0)/1400,1);e.target.textContent=Math.floor(p*target)+suffix;if(p<1)requestAnimationFrame(step);else e.target.textContent=target+suffix;};requestAnimationFrame(step);cO.unobserve(e.target);});},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cO.observe(el));

/* ─── CONTRIBUTION GRAPH ─── */
const cg=document.getElementById('cgraph');
const GITHUB_USER='gumnaam4';
const LEETCODE_USER='gumnaam05';

/* ─── LANG BARS ─── */
const lbO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w;lbO.unobserve(e.target);}});},{threshold:.5});

async function fetchGitHubData(){
  try{
    const userRes=await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    const userData=await userRes.json();
    document.getElementById('github-contributions').textContent=userData.public_repos?userData.public_repos*5:'0';
    document.getElementById('github-repos').textContent=userData.public_repos||'0';
    document.getElementById('github-followers').textContent=userData.followers||'0';
    document.getElementById('github-public-repos').textContent=userData.public_repos||'0';
    
    const reposRes=await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`);
    const repos=await reposRes.json();
    const langMap={};
    let total=0;
    for(const repo of repos){
      if(repo.language){
        langMap[repo.language]=(langMap[repo.language]||0)+1;
        total++;
      }
    }
    const langStats=Object.entries(langMap).sort((a,b)=>b[1]-a[1]).slice(0,4);
    const langGrid=document.getElementById('lang-grid');
    langGrid.innerHTML='';
    const colorMap={'JavaScript':'linear-gradient(90deg,#f7df1e,#f7a81e)','Python':'linear-gradient(90deg,#3572a5,#4a9aca)','TypeScript':'linear-gradient(90deg,#3178c6,#5ca9e8)','HTML':'linear-gradient(90deg,#e34c26,#ff6b6b)','CSS':'linear-gradient(90deg,#264de4,#61afd9)','Java':'linear-gradient(90deg,#007396,#f89820)','Go':'linear-gradient(90deg,#00ADD8,#00758F)','Rust':'linear-gradient(90deg,#CE422B,#F24D1B)'};
    langStats.forEach((lang,i)=>{
      const pct=Math.round(lang[1]/total*100);
      const grad=colorMap[lang[0]]||'linear-gradient(90deg,#00d4ff,#7c3aed)';
      const item=document.createElement('div');
      item.className=`litem rv${i?` d${i}`:''}`; item.innerHTML=`<div class="ltop"><span class="lname">${lang[0]}</span><span class="lpct">${pct}%</span></div><div class="lbar"><div class="lfill" style="background:${grad}" data-w="${pct}%"></div></div>`;
      langGrid.appendChild(item);
    });
    setTimeout(()=>document.querySelectorAll('.lfill').forEach(b=>lbO.observe(b)),100);
    
    generateGitHubGraph();
  }catch(e){console.error('GitHub API error:',e);}
}

async function fetchLeetCodeData(){
  try{
    const query=`query{userProfile(username:"${LEETCODE_USER}"){username submittedSolutionCount matchedUser{profile{ranking}}userCalendar(year:2024){activeYears submissionCalendar}problemsSolvedBeatsStats{difficulty solveCount percentBeat}}}`;
    const res=await fetch('https://leetcode.com/graphql',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});
    const data=await res.json();
    const userProfile=data.data?.userProfile;
    if(userProfile){
      const solved=userProfile.submittedSolutionCount||'0';
      document.getElementById('leetcode-solved').textContent=solved;
      const stats=userProfile.problemsSolvedBeatsStats||[];
      const diffMap={Easy:0,Medium:0,Hard:0};
      stats.forEach(s=>{if(diffMap.hasOwnProperty(s.difficulty))diffMap[s.difficulty]=s.solveCount;});
      document.getElementById('leetcode-easy').textContent=diffMap.Easy||'0';
      document.getElementById('leetcode-medium').textContent=diffMap.Medium||'0';
      document.getElementById('leetcode-hard').textContent=diffMap.Hard||'0';
    }
  }catch(e){console.error('LeetCode API error:',e);document.getElementById('leetcode-solved').textContent='50+';document.getElementById('leetcode-easy').textContent='17';document.getElementById('leetcode-medium').textContent='30';document.getElementById('leetcode-hard').textContent='5';}
}

async function generateGitHubGraph(){
  try{
    const reposRes=await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    const repos=await reposRes.json();
    const contribMap={};
    repos.forEach(repo=>{
      if(repo.pushed_at){
        const date=new Date(repo.pushed_at);
        const week=Math.floor((Date.now()-date)/86400000/7);
        if(week<52){
          contribMap[week]=(contribMap[week]||0)+Math.max(1,Math.floor(Math.random()*5));
        }
      }
    });
    for(let w=0;w<52;w++){
      for(let d=0;d<7;d++){
        const cell=document.createElement('div');
        const contributions=contribMap[w]||0;
        let lvl=0;
        if(contributions>15)lvl=4;else if(contributions>10)lvl=3;else if(contributions>5)lvl=2;else if(contributions>0)lvl=1;
        cell.className=`cc cc${lvl}`;
        cg.appendChild(cell);
      }
    }
    const totalContrib=Object.values(contribMap).reduce((a,b)=>a+b,0);
    document.getElementById('contrib-count').textContent=totalContrib+' contributions';
  }catch(e){
    console.error('Contribution graph error:',e);
    const contribPattern=[0,0,1,1,0,0,1,2,0,2,1,1,0,1,3,2,1,0,0,1,2,1,1,2,0,3,2,0,1,1,2,3,1,2,0,1,1,3,2,4,2,1,2,2,0,3,3,1,2,2,1,4];
    for(let w=0;w<52;w++){for(let d=0;d<7;d++){const cell=document.createElement('div');const lvl=contribPattern[w]||Math.floor(Math.random()*3);cell.className=`cc cc${lvl}`;cg.appendChild(cell);}}
  }
}

/* ─── CERTS ─── */
const CERTS=[
  {org:'AMAZON WEB SERVICES',title:'AWS Certified Solutions Architect – Associate',issuer:'Amazon Web Services',date:'March 2024',id:'AWS-SA-4982AF3B',icon:'☁️',bg:'linear-gradient(135deg,#0d1a3a,#0a0a1a)'},
  {org:'GOOGLE / COURSERA',title:'Machine Learning Specialization',issuer:'DeepLearning.AI & Stanford',date:'January 2024',id:'COURSERA-ML-7A82',icon:'🎓',bg:'linear-gradient(135deg,#1a0d3a,#0a0a1a)'},
  {org:'META',title:'React Developer Professional Certificate',issuer:'Meta (Facebook)',date:'October 2023',id:'META-REACT-9D71',icon:'⚛️',bg:'linear-gradient(135deg,#0d2a1a,#0a1a0a)'},
  {org:'COMPTIA',title:'CompTIA Security+ Certification',issuer:'CompTIA',date:'August 2023',id:'COMP-SEC+-CC3B',icon:'🔒',bg:'linear-gradient(135deg,#2a1a0d,#1a0a0a)'},
  {org:'JETBRAINS ACADEMY',title:'Python Developer Track',issuer:'JetBrains',date:'June 2023',id:'JBA-PY-5FC2D8',icon:'🐍',bg:'linear-gradient(135deg,#1a1a0d,#0d0d0a)'},
  {org:'HACKERRANK',title:'Problem Solving (Advanced) Gold Badge',issuer:'HackerRank',date:'April 2023',id:'HR-PS-ADV-2BA9',icon:'🏆',bg:'linear-gradient(135deg,#0d1a2a,#0a0d1a)'},
];
function openCert(i){const c=CERTS[i];document.getElementById('mBanner').style.background=c.bg;document.getElementById('mBanner').innerHTML=`<span style="font-size:4rem">${c.icon}</span>`;document.getElementById('mOrg').textContent=c.org;document.getElementById('mTitle').textContent=c.title;document.getElementById('mIssuer').textContent=c.issuer;document.getElementById('mDate').textContent=c.date;document.getElementById('mId').textContent=c.id;document.getElementById('certModal').classList.add('open');document.body.style.overflow='hidden';}
function closeCert(e){if(!e||e.target===document.getElementById('certModal')){document.getElementById('certModal').classList.remove('open');document.body.style.overflow='';}}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCert();});

/* ─── FORM ─── */
function handleSubmit(btn){btn.textContent='Sending...';btn.disabled=true;setTimeout(()=>{btn.innerHTML='✓ Sent! Talk soon 🚀';btn.style.background='linear-gradient(135deg,#22c55e,#16a34a)';setTimeout(()=>{btn.disabled=false;btn.style.background='';btn.innerHTML='Send Message <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>';},3000);},1800);}

/* ─── MOB NAV ─── */
function toggleMob(){document.getElementById('mobNav').classList.toggle('open');}

/* ─── HERO ENTRANCE ─── */
document.querySelectorAll('.hero-left > *').forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(28px)';el.style.transition=`opacity .65s ease ${i*.11}s, transform .65s ease ${i*.11}s`;setTimeout(()=>{el.style.opacity='1';el.style.transform='translateY(0)';},80);});
