import { demoProfile, forecast, purchaseScenario } from './demo-engine.js';
const profile = demoProfile(), base = forecast(profile, profile.demoAsOf);
const amount = 15000, october = purchaseScenario(profile, profile.demoAsOf, amount, '2026-10-15');
const may = purchaseScenario(profile, profile.demoAsOf, amount, '2027-05-15');
const money = n => (n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('en-US', {maximumFractionDigits:0});
const set = (id, value) => document.getElementById(id).textContent = value;
const low = base.projectedLow.amount, buffer = base.breakdown.buffer;
const march = result => result.points.find(p => p.month === '2027-03').projectedCash;
set('cash', money(base.breakdown.cash)); set('spend', money(base.availableToSpend));
set('base-copy', 'March reaches ' + money(low) + ', just above your ' + money(buffer) + ' cushion.');
set('oct-copy', 'A ' + money(amount) + ' engine in October: ' + money(base.points.find(p => p.month === '2026-10').projectedCash) + ' projected cash, yet March falls from ' + money(low) + ' to ' + money(march(october.after)) + '.');
set('may-copy', 'The same purchase in May keeps March at ' + money(march(may.after)) + ', protecting your ' + money(buffer) + ' cushion.');
const labels = {cash:'Cash today', obligations:'Bills due within 90 days',buffer:'Minimum cushion',seasonalReserve:'Held for months when costs exceed income',snapshot:'Left after these amounts',forecastHeadroom:'Room above your cushion at the lowest month'};
document.getElementById('math').innerHTML = Object.entries(labels).map(([key,label]) => '<div><dt>'+label+'</dt><dd>'+money(base.breakdown[key])+'</dd></div>').join('');
const min = Math.min(0, ...october.after.points.map(p => p.projectedCash)), max = Math.max(...base.points.map(p => p.projectedCash));
const width = () => Math.min(700, document.getElementById('year-chart').clientWidth);
const x = i => 55 + i * (width() - 90) / 11, y = n => 25 + (max - n) / (max - min) * 220;
const points = values => values.map((n,i) => x(i)+','+y(n)).join(' ');
const baseline = base.points.map(p => p.projectedCash);
let animation;
function draw(id, after) {
 const svg = document.getElementById(id);
 svg.setAttribute('viewBox', '0 0 '+width()+' 300');
 svg.innerHTML = '<title>September 2026 to August 2027 cash forecast</title><line x1="55" x2="649" y1="'+y(buffer)+'" y2="'+y(buffer)+'" stroke="#a7adae" stroke-dasharray="2 6"/><text x="55" y="'+(y(buffer)-10)+'">Cushion '+money(buffer)+'</text><polyline fill="none" stroke="#f2f3f1" stroke-width="3" points="'+points(baseline)+'"/>' + (after ? '<polyline class="after" fill="none" stroke="#91bec8" stroke-width="3" stroke-dasharray="8 5" points="'+points(after)+'"/>' : '') + [0,3,6,11].map(i => '<text x="'+x(i)+'" y="285" text-anchor="middle">'+base.points[i].label.split(' ')[0]+'</text>').join('') + '<circle cx="'+x(6)+'" cy="'+y(after ? after[6] : baseline[6])+'" r="5" fill="#f2f3f1"/>';
 svg.setAttribute('aria-label', 'Monthly cash, September 2026 to August 2027. March: '+money(after ? after[6] : baseline[6])+'. Minimum cushion: '+money(buffer)+'.');
 svg.querySelector('line').setAttribute('x2',width()-35);
}
draw('year-chart');
function update(animate = true) {
 cancelAnimationFrame(animation);
 const date = document.getElementById('purchase-month').value;
 const result = purchaseScenario(profile, profile.demoAsOf, amount, date);
 const target = result.after.points.map(p => p.projectedCash);
 set('scenario-status', 'March: '+money(march(base))+' → '+money(march(result.after))+'. '+(result.shortfall ? money(result.shortfall)+' below your cushion at the lowest month.' : 'Your cushion stays intact.'));
 draw('purchase-chart', target);
 if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const start = performance.now();
  const frame = now => {const t = Math.min(1,(now-start)/650); const path = document.querySelector('#purchase-chart .after'); path.setAttribute('points',points(baseline.map((n,i)=>n+(target[i]-n)*t))); if(t<1) animation=requestAnimationFrame(frame);};
  animation=requestAnimationFrame(frame);
 }
}
document.getElementById('purchase-month').addEventListener('change',()=>update());
document.getElementById('try-may').addEventListener('click',()=>{const select=document.getElementById('purchase-month');select.value='2027-05-15';update();select.focus();});
update(false);
const observer = new IntersectionObserver(entries => {if(entries.some(e=>e.isIntersecting)){update();observer.disconnect();}}, {threshold:.3});
observer.observe(document.getElementById('purchase-chart'));
window.addEventListener('resize',()=>{draw('year-chart');update(false);});
