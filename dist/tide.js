const motion = matchMedia('(prefers-reduced-motion: reduce)');
const backdrop = document.querySelector('.water-backdrop');
const toggle = document.querySelector('#motion-toggle');
let paused = false, pending = false;
function paint(){pending=false;backdrop.style.transform=motion.matches||paused?'none':`translateY(${Math.min(scrollY,600)*.08}px)`;}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(paint);}},{passive:true});
motion.addEventListener('change',paint);
toggle.addEventListener('click',()=>{paused=!paused;document.body.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume water motion':'Pause water motion';paint();});
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('motion-hidden',document.hidden));
new IntersectionObserver(([entry])=>document.body.classList.toggle('motion-hidden',!entry.isIntersecting||document.hidden)).observe(backdrop);
