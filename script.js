
(function(){


// ── CURSOR ──
var cursor=document.getElementById('cursor');
var ring=document.getElementById('cursorRing');
var mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px';});
function animRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);}
animRing();
document.querySelectorAll('a,button,.serv-card,.diff-item,.dep-tab,.faq-question,.gallery-img-wrap,.ba-handle').forEach(function(el){
  el.addEventListener('mouseenter',function(){cursor.classList.add('expand');ring.classList.add('expand');});
  el.addEventListener('mouseleave',function(){cursor.classList.remove('expand');ring.classList.remove('expand');});
});

// ── NAV TRANSITION ──
var sectionLabels={'#sobre':'Sobre Nós','#servicos':'Serviços','#resultados':'Resultados','#diferenciais':'Diferenciais','#depoimentos':'Pacientes','#contato':'Agendamento'};
var overlay=document.getElementById('navOverlay');
var strips=overlay.querySelectorAll('.nov-strip');
var overlayLabel=document.getElementById('navOverlayLabel');

function navTransition(targetId,label){
  overlayLabel.style.opacity='0';
  overlayLabel.style.transform='translateY(16px)';
  overlayLabel.textContent=label||'';
  strips.forEach(function(s,i){s.style.transition='none';s.style.height='0';s.style.top=(i*33.33)+'%';});
  overlay.getBoundingClientRect();
  strips.forEach(function(s,i){s.style.transition='height .28s cubic-bezier(.77,0,.18,1) '+(i*.07)+'s';s.style.height='34%';});
  setTimeout(function(){overlayLabel.style.opacity='1';overlayLabel.style.transform='translateY(0)';},220);
  setTimeout(function(){
    var el=document.querySelector(targetId);
    if(el){window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-70});}
    setTimeout(function(){
      overlayLabel.style.opacity='0';
      strips.forEach(function(s,i){
        s.style.transition='height .26s cubic-bezier(.77,0,.18,1) '+((2-i)*.07)+'s, top .26s cubic-bezier(.77,0,.18,1) '+((2-i)*.07)+'s';
        s.style.top='100%';
      });
      setTimeout(function(){
        strips.forEach(function(s,i){s.style.transition='none';s.style.height='0';s.style.top=(i*33.33)+'%';});
      },420);
    },320);
  },500);
}

document.querySelectorAll('.nav-links a, .hero-btns a, .btn-outline').forEach(function(link){
  var href=link.getAttribute('href');
  if(href&&href.charAt(0)==='#'&&href.length>1){
    link.addEventListener('click',function(e){
      e.preventDefault();
      closeMenu();
      navTransition(href, sectionLabels[href]||'');
    });
  }
});

// ── MOBILE MENU ──
function toggleMenu(){document.getElementById('navLinks').classList.toggle('open');}
function closeMenu(){document.getElementById('navLinks').classList.remove('open');}
window.toggleMenu=toggleMenu;
window.closeMenu=closeMenu;

// ── NAV SCROLL ──
window.addEventListener('scroll',function(){
  var n=document.getElementById('mainNav');
  n.style.padding=window.scrollY>50?'12px 60px':'18px 60px';
});

// ── PARTICLES ──
var pCont=document.getElementById('heroParticles');
for(var pi=0;pi<25;pi++){
  var p=document.createElement('div');
  p.className='particle';
  p.style.left=Math.random()*100+'%';
  p.style.animationDuration=(8+Math.random()*12)+'s';
  p.style.animationDelay=(Math.random()*10)+'s';
  pCont.appendChild(p);
}

// ── REVEAL ──
var revObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e,i){if(e.isIntersecting){setTimeout(function(){e.target.classList.add('visible');},i*80);}});
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(function(el){revObs.observe(el);});

// ── COUNTERS ──
var countObs=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(!entry.isIntersecting)return;
    var el=entry.target.querySelector('.stat-num');
    if(!el||el.dataset.done)return;
    el.dataset.done='1';
    var target=parseInt(el.dataset.target,10);
    var dur=1800,start=performance.now();
    function tick(now){
      var p=Math.min((now-start)/dur,1);
      var val=Math.round(p*target);
      if(target===100)el.textContent=val+'%';
      else if(target===1000)el.textContent='+'+val.toLocaleString('pt-BR');
      else el.textContent=val+'+';
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
},{threshold:.5});
document.querySelectorAll('.stat-item').forEach(function(el){countObs.observe(el);});

// ── GALLERY ──
var smileImgs=[
"Imagens/sorriso1.jpg",
"Imagens/sorriso2.jpg",
"Imagens/sorriso3.jpg",
"Imagens/sorriso4.jpg",
"Imagens/sorriso5.jpg",
"Imagens/sorriso6.jpg"
];
function buildTrack(id,imgs){
  var t=document.getElementById(id);
  if(!t)return;
  imgs.concat(imgs).forEach(function(src){
    var d=document.createElement('div');
    d.className='gallery-img-wrap';
    var img=document.createElement('img');
    img.src=src;img.alt='Sorriso';img.loading='lazy';
    d.appendChild(img);
    d.addEventListener('click',function(){openLightbox(src);});
    t.appendChild(d);
  });
}
buildTrack('track1',smileImgs);
buildTrack('track2',smileImgs.slice().reverse());

// ── LIGHTBOX ──
function openLightbox(src){document.getElementById('lbImg').src=src;document.getElementById('lightbox').classList.add('active');}
function closeLightbox(){document.getElementById('lightbox').classList.remove('active');}
document.getElementById('lbClose').addEventListener('click',closeLightbox);
document.getElementById('lightbox').addEventListener('click',function(e){if(e.target===this)closeLightbox();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLightbox();});

// ── BEFORE/AFTER ──
var baImages=document.getElementById('baImages');
var baBefore=document.getElementById('baBefore');
var baDivider=document.getElementById('baDivider');
var dragging=false;
function setPos(x){
  var r=baImages.getBoundingClientRect();
  var p=Math.max(5,Math.min(95,(x-r.left)/r.width*100));
  baBefore.style.width=p+'%';
  baDivider.style.left=p+'%';
}
if(baDivider){
  baDivider.addEventListener('mousedown',function(e){dragging=true;e.preventDefault();});
  document.addEventListener('mousemove',function(e){if(dragging)setPos(e.clientX);});
  document.addEventListener('mouseup',function(){dragging=false;});
  baDivider.addEventListener('touchstart',function(){dragging=true;},{passive:true});
  document.addEventListener('touchmove',function(e){if(dragging)setPos(e.touches[0].clientX);},{passive:true});
  document.addEventListener('touchend',function(){dragging=false;});
}

// ── DEPOIMENTOS ──
function showDep(idx){
  document.querySelectorAll('.dep-content').forEach(function(el,i){el.classList.toggle('active',i===idx);});
  document.querySelectorAll('.dep-tab').forEach(function(el,i){el.classList.toggle('active',i===idx);});
}
window.showDep=showDep;
var depIdx=0;
setInterval(function(){depIdx=(depIdx+1)%4;showDep(depIdx);},5000);

// ── FAQ ──
function toggleFaq(q){
  var item=q.parentElement;
  var wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
  if(!wasOpen)item.classList.add('open');
}
window.toggleFaq=toggleFaq;

}
)();

gsap.registerPlugin(ScrollTrigger);

// HERO CINEMATIC
gsap.to(".hero-content", {
  y: -150,
  opacity: 0,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".hero-img", {
  scale: 1.2,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".hero-overlay", {
  opacity: 0.8,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".sobre", {
  scrollTrigger: {
    trigger: ".sobre",
    start: "top top",
    end: "+=1000",
    scrub: true,
  }
});

gsap.fromTo(".sobre-text", 
  { opacity: 0, x: 80 }, 
  { 
    opacity: 1, 
    x: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".sobre",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  }
);


gsap.fromTo(".sobre-img", 
  { opacity: 0, x: -100 }, 
  { 
    opacity: 1, 
    x: 0,
    scrollTrigger: {
      trigger: ".sobre",
      start: "top 80%",
      end: "top 30%",
      scrub: true
    }
  }
);

gsap.fromTo(".serv-card",
  { opacity: 0, y: 80 },
  {
    opacity: 1,
    y: 0,
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".servicos",
      start: "top 80%",
      end: "top 30%",
      scrub: true
    }
  }
);

gsap.defaults({
  ease: "power3.out",
  duration: 1
});

gsap.utils.toArray("section").forEach(section => {
  gsap.fromTo(section,
    { opacity: 0.6 },
    {
      opacity: 1,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: 1
      }
    }
  );
});

gsap.from(".whatsapp-button", {
  opacity: 0,
  y: 100,
  delay: 2,
  duration: 1
});

  const lenis = new Lenis({
  duration: 1.2,
  smooth: true
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
