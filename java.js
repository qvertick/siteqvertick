// DPI + canvas setup
const cvs = document.getElementById('particles');
const ctx = cvs.getContext('2d');
let dpr = Math.max(1, window.devicePixelRatio || 1);
function rs(){
  cvs.width = innerWidth * dpr;
  cvs.height = innerHeight * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
rs(); addEventListener('resize', rs, {passive:true});

// Particles: dots + rotating triangles
const P = [];
const COLORS = ['#8A2BE2','#FF00FF','#B266FF','#7A00FF','#6A00FF','#00FFFF'];
for(let i=0;i<70;i++){
  P.push({
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    vx: (Math.random()-.5)*.2,
    vy: (Math.random()-.5)*.2,
    r: Math.random()*1.8+0.6,
    c: COLORS[Math.floor(Math.random()*COLORS.length)],
    t: Math.random()<.25 // triangle
  });
}
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of P){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<-50)p.x=innerWidth+50; if(p.x>innerWidth+50)p.x=-50;
    if(p.y<-50)p.y=innerHeight+50; if(p.y>innerHeight+50)p.y=-50;
    ctx.globalAlpha = 0.6; ctx.fillStyle=p.c;
    if(p.t){
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate((performance.now()/4000)%(Math.PI*2));
      const s=p.r*5;
      ctx.beginPath();
      ctx.moveTo(0,-s); ctx.lineTo(s, s); ctx.lineTo(-s, s); ctx.closePath();
      ctx.fill(); ctx.restore();
    }else{
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Parallax mouse for symbols
const syms = [...document.querySelectorAll('.symbol')];
let cx=innerWidth/2, cy=innerHeight/2;
addEventListener('pointermove', e=>{
  const mx = e.clientX, my = e.clientY;
  syms.forEach(el=>{
    const depth = parseFloat(el.dataset.depth||0.05);
    const tx = (mx - cx) * depth;
    const ty = (my - cy) * depth;
    el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  });
});

// Hover glow position for cards
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('pointermove', e=>{
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width * 100).toFixed(2) + '%';
    const my = ((e.clientY - rect.top) / rect.height * 100).toFixed(2) + '%';
    card.style.setProperty('--mx', mx);
    card.style.setProperty('--my', my);
  });
});

// Reveal on scroll + animate progress bars
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('show');
      en.target.querySelectorAll('.bar .fill').forEach(b=>{
        const val = b.dataset.val || '90%';
        requestAnimationFrame(()=> b.style.width = val);
      });
      io.unobserve(en.target);
    }
  });
},{threshold:.18});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

// Reduced motion respect
const mq = matchMedia('(prefers-reduced-motion: reduce)');
function toggleMotion(){
  document.documentElement.style.setProperty('scroll-behavior', mq.matches ? 'auto':'smooth');
  document.getElementById('particles').style.display = mq.matches ? 'none':'block';
}
mq.addEventListener?.('change', toggleMotion); toggleMotion();

// Year
document.getElementById('y').textContent = new Date().getFullYear();
