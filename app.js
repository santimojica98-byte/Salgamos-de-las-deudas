// ═══════════════════════════════════════════════════════════
//  LIBERTAD FINANCIERA — app.js
//  Features: Dashboard, Calendar, Simulator, AI Advisor,
//            Evolution Chart, Notifications, Cloud Sync
// ═══════════════════════════════════════════════════════════

// ── 3D INTERACTIVE BACKGROUND ──────────────────────────────
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let mouseX = (window.innerWidth||1000)/2, mouseY = (window.innerHeight||1000)/2;
let tX = mouseX, tY = mouseY, animT = 0;

function resizeBg(){ bgCanvas.width = window.innerWidth||1000; bgCanvas.height = window.innerHeight||1000; }
resizeBg();
window.addEventListener('resize', resizeBg);
document.addEventListener('mousemove', e => { tX=e.clientX; tY=e.clientY; });
document.addEventListener('touchmove', e => { tX=e.touches[0].clientX; tY=e.touches[0].clientY; }, {passive:true});

const ORBS = [
  {x:0.15,y:0.2,r:0.46,col:'#2dba7c',op:0.32,sp:0.0003,ph:0},
  {x:0.8, y:0.7,r:0.4, col:'#58a6ff',op:0.22,sp:0.0002,ph:1},
  {x:0.5, y:0.9,r:0.36,col:'#f85149',op:0.18,sp:0.0004,ph:2},
  {x:0.9, y:0.1,r:0.3, col:'#e3b341',op:0.14,sp:0.00025,ph:3},
];
function hexRgb(h){ return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }

function drawBg(){
  animT++;
  mouseX += (tX-mouseX)*0.055;
  mouseY += (tY-mouseY)*0.055;
  const W=Math.max(1,bgCanvas.width), H=Math.max(1,bgCanvas.height);
  const mx=isFinite(mouseX)?mouseX:W/2, my=isFinite(mouseY)?mouseY:H/2;
  bgCtx.clearRect(0,0,W,H);
  const base=bgCtx.createLinearGradient(0,0,W,H);
  base.addColorStop(0,'#04060e'); base.addColorStop(1,'#060912');
  bgCtx.fillStyle=base; bgCtx.fillRect(0,0,W,H);
  const cg=bgCtx.createRadialGradient(mx,my,0,mx,my,Math.max(0.1,W*0.52));
  cg.addColorStop(0,'rgba(45,186,124,0.1)'); cg.addColorStop(0.45,'rgba(88,166,255,0.05)'); cg.addColorStop(1,'transparent');
  bgCtx.fillStyle=cg; bgCtx.fillRect(0,0,W,H);
  ORBS.forEach(o=>{
    const fx=Math.sin(animT*o.sp*1000+o.ph*2.1)*0.06, fy=Math.cos(animT*o.sp*800+o.ph*1.7)*0.05;
    const ps=0.04+o.op*0.18;
    const cx=(o.x+fx+(mx/W-0.5)*ps)*W, cy=(o.y+fy+(my/H-0.5)*ps)*H;
    const rad=Math.max(0.1,o.r*Math.min(W,H));
    const [r,g,b]=hexRgb(o.col);
    const g2=bgCtx.createRadialGradient(cx,cy,0,cx,cy,rad);
    g2.addColorStop(0,`rgba(${r},${g},${b},${o.op})`);
    g2.addColorStop(0.5,`rgba(${r},${g},${b},${o.op*0.3})`);
    g2.addColorStop(1,`rgba(${r},${g},${b},0)`);
    bgCtx.fillStyle=g2; bgCtx.fillRect(0,0,W,H);
  });
  const vig=bgCtx.createRadialGradient(W/2,H/2,Math.max(0.1,H*0.3),W/2,H/2,Math.max(0.2,H*0.9));
  vig.addColorStop(0,'transparent'); vig.addColorStop(1,'rgba(0,0,0,0.3)');
  bgCtx.fillStyle=vig; bgCtx.fillRect(0,0,W,H);
  requestAnimationFrame(drawBg);
}
drawBg();

// ── DATA MODEL ──────────────────────────────────────────────
const CATEGORIES = [
  { name:'Tarjetas ANG', color:'#2dba7c', icon:'💳', debts:[
    {name:'Rappi',      cuota:2900000, saldo:11000000, dueDay:5},
    {name:'Davivienda', cuota:2000000, saldo:42000000, dueDay:10},
    {name:'Nu',         cuota: 180000, saldo: 3550000, dueDay:15},
    {name:'Olímpica',   cuota: 300000, saldo: 1000000, dueDay:20},
  ]},
  { name:'Créditos ANG', color:'#58a6ff', icon:'🏦', debts:[
    {name:'Addi',         cuota: 500000, saldo: 3000000, dueDay:1},
    {name:'Davivienda',   cuota:  50000, saldo:  900000, dueDay:8},
    {name:'Lulo',         cuota: 130000, saldo: 3700000, dueDay:12},
    {name:'Sistecredito', cuota: 500000, saldo: 1400000, dueDay:18},
    {name:'Mundo Mujer',  cuota: 265000, saldo: 1700000, dueDay:22},
    {name:'Sumas',        cuota: 100000, saldo:  900000, dueDay:25},
    {name:'Claro',        cuota: 345000, saldo:       0, dueDay:5},
    {name:'ETB',          cuota: 100000, saldo:       0, dueDay:10},
  ]},
  { name:'Créditos EXT', color:'#e3b341', icon:'📄', debts:[
    {name:'Addi',    cuota: 303000, saldo: 2100000, dueDay:3},
    {name:'BCS',     cuota: 180000, saldo: 3500000, dueDay:7},
    {name:'Mami',    cuota:      0, saldo: 6500000, dueDay:null},
    {name:'Codensa', cuota:1000000, saldo: 5000000, dueDay:15},
    {name:'Gas',     cuota: 285000, saldo: 3800000, dueDay:20},
  ]},
  { name:'Tarjetas EXT', color:'#f85149', icon:'💳', debts:[
    {name:'Bancolombia (1)', cuota: 180000, saldo: 2000000, dueDay:5},
    {name:'Bogotá',          cuota:  75000, saldo:  300000, dueDay:12},
    {name:'Bancolombia (2)', cuota: 400000, saldo: 2600000, dueDay:18},
  ]},
];

// Interest rates for simulator (approximate)
const RATES = {
  'Rappi': 0.36, 'Davivienda': 0.28, 'Nu': 0.30, 'Olímpica': 0.26,
  'Addi': 0.24, 'Lulo': 0.22, 'Sistecredito': 0.32, 'Mundo Mujer': 0.30,
  'Sumas': 0.28, 'Claro': 0.20, 'ETB': 0.18, 'BCS': 0.26,
  'Mami': 0, 'Codensa': 0.24, 'Gas': 0.22,
  'Bancolombia (1)': 0.28, 'Bogotá': 0.26, 'Bancolombia (2)': 0.28,
};

// ── STORAGE ─────────────────────────────────────────────────
const KEY = 'libertad_v4';
const HISTORY_KEY = 'libertad_history_v4';
let payments = JSON.parse(localStorage.getItem(KEY)||'[]');
let debtHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');

function savePayments(){ localStorage.setItem(KEY, JSON.stringify(payments)); }
function saveHistory(){ localStorage.setItem(HISTORY_KEY, JSON.stringify(debtHistory)); }

// Record current debt snapshot if new month
function recordMonthlySnapshot(){
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  if(!debtHistory.find(h=>h.month===monthKey)){
    const {curr} = getGrand();
    debtHistory.push({ month: monthKey, total: curr, ts: Date.now() });
    // keep last 24 months
    if(debtHistory.length > 24) debtHistory = debtHistory.slice(-24);
    saveHistory();
  }
}

// ── HELPERS ─────────────────────────────────────────────────
function getPaid(ci,name){ return payments.filter(p=>p.catIdx===ci&&p.debtName===name).reduce((s,p)=>s+p.amount,0); }
function getCat(i){
  const cat=CATEGORIES[i];
  const orig=cat.debts.reduce((s,d)=>s+d.saldo,0);
  const paid=cat.debts.reduce((s,d)=>s+getPaid(i,d.name),0);
  const cuota=cat.debts.reduce((s,d)=>s+d.cuota,0);
  return {orig, paid, curr:Math.max(0,orig-paid), cuota};
}
function getGrand(){
  let o=0,p=0,c=0;
  CATEGORIES.forEach((_,i)=>{const t=getCat(i);o+=t.orig;p+=t.paid;c+=t.cuota;});
  return {orig:o, paid:p, curr:Math.max(0,o-p), cuota:c};
}
function fmt(n){
  if(n>=1000000) return '$'+(n/1000000).toFixed(2).replace(/\.?0+$/,'')+'M';
  if(n>=1000) return '$'+(n/1000).toFixed(0)+'K';
  return '$'+Math.round(n).toLocaleString('es-CO');
}
function fmtF(n){ return '$'+Math.round(n).toLocaleString('es-CO'); }

// ── TABS ────────────────────────────────────────────────────
function switchTab(name){
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  document.querySelector(`[data-tab="${name}"]`).classList.add('active');
  if(name==='calendar') renderCalendar();
  if(name==='simulator') runSimulator();
  if(name==='ai') renderAISuggestions();
}

// ── DASHBOARD RENDERS ────────────────────────────────────────
let heroChart = null, catCharts = [], evoChart = null;

function renderHero(){
  const {orig,paid,curr,cuota}=getGrand();
  const pct=orig>0?Math.round((paid/orig)*100):0;
  document.getElementById('hero-total').textContent=fmt(curr);
  document.getElementById('hero-original').textContent=fmt(orig);
  document.getElementById('hero-pct').textContent=pct+'%';
  document.getElementById('hero-pct2').textContent=pct+'%';
  document.getElementById('stat-cuota').textContent=fmt(cuota);
  document.getElementById('stat-months').textContent='~'+(cuota>0?Math.ceil(curr/cuota):0);
  setTimeout(()=>{ document.getElementById('hero-bar').style.width=pct+'%'; },300);
  const ctx=document.getElementById('heroRing').getContext('2d');
  if(heroChart) heroChart.destroy();
  heroChart=new Chart(ctx,{
    type:'doughnut',
    data:{datasets:[{data:[paid||0.001,Math.max(0.001,curr)],backgroundColor:['#2dba7c','rgba(255,255,255,0.06)'],borderWidth:0}]},
    options:{cutout:'74%',responsive:false,plugins:{legend:{display:false},tooltip:{enabled:false}},animation:{duration:1100,easing:'easeOutCubic'}}
  });
}

function renderCategories(){
  const grid=document.getElementById('cat-grid');
  grid.innerHTML=''; catCharts.forEach(c=>c.destroy()); catCharts=[];
  CATEGORIES.forEach((cat,i)=>{
    const {orig,paid,curr,cuota}=getCat(i);
    const pct=orig>0?Math.min(100,Math.round((paid/orig)*100)):0;
    const card=document.createElement('div');
    card.className='cat-card glass'; card.dataset.cat=i;
    card.innerHTML=`<div class="cat-ring-wrap"><canvas id="cR${i}" width="80" height="80"></canvas><div class="cat-ring-center"><span class="pct" style="color:${cat.color}">${pct}%</span></div></div><div class="cname" style="color:${cat.color}">${cat.icon} ${cat.name}</div><div class="cdebt" style="color:${cat.color}">${fmt(curr)}</div><div class="ccuota">Cuota: ${fmt(cuota)}</div>`;
    card.onclick=()=>openCatModal(i);
    grid.appendChild(card);
    catCharts.push(new Chart(document.getElementById('cR'+i).getContext('2d'),{
      type:'doughnut',
      data:{datasets:[{data:[paid||0.001,Math.max(0.001,curr)],backgroundColor:[cat.color,'rgba(255,255,255,0.06)'],borderWidth:0}]},
      options:{cutout:'68%',responsive:false,plugins:{legend:{display:false},tooltip:{enabled:false}},animation:{duration:900}}
    }));
  });
}

function renderDebtList(){
  let html='';
  CATEGORIES.forEach((cat,ci)=>{
    if(currentFilter!=='all'&&currentFilter!==ci) return;
    cat.debts.forEach(d=>{
      if(d.saldo===0&&d.cuota===0) return;
      const paid=getPaid(ci,d.name), rem=Math.max(0,d.saldo-paid);
      const pct=d.saldo>0?Math.min(100,Math.round((paid/d.saldo)*100)):0;
      html+=`<div class="debt-item"><div class="debt-icon" style="background:${cat.color}18;color:${cat.color}">${cat.icon}</div><div class="debt-item-info"><div class="dname">${d.name}</div><div class="dcat">${cat.name}</div></div><div class="debt-progress-wrap"><div class="debt-progress-bar"><div class="debt-progress-fill" style="width:${pct}%;background:${cat.color}"></div></div><div class="debt-progress-pct">${pct}% pagado</div></div><div class="debt-item-amounts"><div class="dsaldo" style="color:${cat.color}">${fmt(rem)}</div><div class="dcuota">${fmt(d.cuota)}/mes</div></div></div>`;
    });
  });
  document.getElementById('debt-list').innerHTML=html||'<div class="empty-msg">Sin deudas en esta categoría</div>';
}

// ── EVOLUTION CHART ──────────────────────────────────────────
function renderEvolutionChart(){
  const ctx = document.getElementById('evolutionChart');
  if(!ctx) return;
  const c = ctx.getContext('2d');

  // Build data: combine history + current
  let points = [...debtHistory];
  const now = new Date();
  const nowKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  if(!points.find(p=>p.month===nowKey)){
    points.push({ month: nowKey, total: getGrand().curr });
  }
  points.sort((a,b)=>a.month.localeCompare(b.month));

  // If only 1 data point, create initial point
  if(points.length === 1){
    const initial = getGrand().orig;
    const prevMonth = new Date(now.getFullYear(), now.getMonth()-1, 1);
    const prevKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth()+1).padStart(2,'0')}`;
    points.unshift({ month: prevKey, total: initial });
  }

  const labels = points.map(p => {
    const [y,m] = p.month.split('-');
    return new Date(y,m-1,1).toLocaleDateString('es-CO',{month:'short',year:'2-digit'});
  });
  const data = points.map(p=>p.total);

  if(evoChart) evoChart.destroy();

  const gradient = c.createLinearGradient(0,0,0,250);
  gradient.addColorStop(0,'rgba(45,186,124,0.25)');
  gradient.addColorStop(1,'rgba(45,186,124,0)');

  evoChart = new Chart(c, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#2dba7c',
        borderWidth: 3,
        pointBackgroundColor: '#2dba7c',
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: true,
        backgroundColor: gradient,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13,17,23,0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleFont: { family: 'Outfit', size: 11 },
          bodyFont: { family: 'Cormorant Garamond', size: 15, style: 'italic' },
          callbacks: { label: ctx => ' ' + fmt(ctx.parsed.y) }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#7d8590', font: { family:'Outfit', size:10 }, callback: v=>`$${(v/1000000).toFixed(1)}M` }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#7d8590', font: { family:'Outfit', size:10 } }
        }
      }
    }
  });
}

// ── FILTER ──────────────────────────────────────────────────
let currentFilter = 'all';
function filterList(f){
  currentFilter=f;
  document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
  document.querySelector(`.pill[data-f="${f}"]`).classList.add('active');
  renderDebtList();
}

// ── PAYMENT SELECT ───────────────────────────────────────────
function populateSelect(){
  const sel=document.getElementById('pay-select'); sel.innerHTML='';
  CATEGORIES.forEach((cat,ci)=>{
    const grp=document.createElement('optgroup'); grp.label=cat.name;
    cat.debts.forEach(d=>{
      if(d.saldo>0||d.cuota>0){
        const opt=document.createElement('option');
        opt.value=`${ci}||${d.name}`;
        const rem=Math.max(0,d.saldo-getPaid(ci,d.name));
        opt.textContent=`${d.name} — ${fmtF(d.cuota)}/mes | Total: ${fmt(rem)}`;
        grp.appendChild(opt);
      }
    });
    sel.appendChild(grp);
  });
}

// ── REGISTER PAYMENT ────────────────────────────────────────
async function registerPayment(){
  const sv=document.getElementById('pay-select').value;
  const rawValue = document.getElementById('pay-amount').value.replace(/\./g, '');
  const amount=parseFloat(rawValue);
  const date=document.getElementById('pay-date').value;
  const note=document.getElementById('pay-note').value.trim();
  const btn=document.getElementById('btn-pay');
  
  if(!sv||!amount||amount<=0||!date){ showToast('⚠️ Completa cuenta, monto y fecha.','var(--amber)'); return; }
  
  const [ci,debtName]=sv.split('||');
  const paymentId = 'PAY_' + Date.now();
  
  const payment={id: paymentId, catIdx:parseInt(ci),debtName,amount,date,note,ts:Date.now()};
  payments.push(payment);
  savePayments();
  recordMonthlySnapshot();

  const url=document.getElementById('apps-script-url').value.trim();
  if(url&&url.startsWith('https://script.google.com')){
    btn.disabled=true; btn.textContent='Guardando...';
    try{
      await fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id: paymentId, action: 'add', debtName,catName:CATEGORIES[parseInt(ci)].name,amount,date,note})});
      document.getElementById('script-status').textContent='✓ Conectado';
      document.getElementById('script-status').className='status-dot ok';
      showToast('✅ Guardado en Sheets y localmente.','var(--green)');
    }catch{ showToast('💾 Guardado local. Verifica la URL.','var(--amber)'); }
    btn.disabled=false; btn.textContent='✓ Registrar Pago';
  } else {
    showToast('💾 Pago guardado en este dispositivo.','var(--green)');
  }
  document.getElementById('pay-amount').value='';
  document.getElementById('pay-note').value='';
  renderAll();
}

function showToast(msg,color){
  const t=document.getElementById('toast');
  t.style.display='block'; t.style.color=color; t.style.borderColor=color;
  t.style.background='var(--surface2)'; t.textContent=msg;
  setTimeout(()=>t.style.display='none',4500);
}

// ── HISTORY ─────────────────────────────────────────────────
function renderHistory(){
  const list=document.getElementById('history-list');
  if(!payments.length){ list.innerHTML='<div class="empty-msg">Aún no hay pagos registrados</div>'; return; }
  
  payments.forEach(p => { if(!p.id) p.id = 'PAY_' + p.ts; });
  
  list.innerHTML=[...payments].sort((a,b)=>b.ts-a.ts).slice(0,20).map(p=>{
    const cat=CATEGORIES[p.catIdx];
    return `
      <div class="history-item">
        <div class="hdot" style="background:${cat?.color||'var(--green)'}"></div>
        <div class="hinfo">
          <div class="hname">${p.debtName} <span style="color:var(--muted);font-size:0.6rem">${cat?.name||''}</span></div>
          <div class="hdate">${p.date}${p.note?' · '+p.note:''}</div>
        </div>
        <div class="hamount">+${fmt(p.amount)}</div>
        <button class="btn-delete" onclick="deletePayment('${p.id}')" title="Borrar pago" style="background:none;border:none;cursor:pointer;opacity:0.6;font-size:1.2rem;">🗑️</button>
      </div>`;
  }).join('');
}

function deletePayment(id) {
  const reason = prompt('🔒 SEGURIDAD: Ingresa el motivo para eliminar este pago:');
  if (!reason) { showToast('Eliminación cancelada.', 'var(--muted)'); return; }

  payments = payments.filter(p => p.id !== id);
  savePayments();
  recordMonthlySnapshot();
  renderAll();

  const url=document.getElementById('apps-script-url').value.trim();
  if(url&&url.startsWith('https://script.google.com')){
    showToast('Sincronizando eliminación...', 'var(--amber)');
    fetch(url, {
      method: 'POST', mode: 'no-cors', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ action: 'delete', id: id, reason: reason })
    }).then(() => showToast('✅ Eliminado y registrado en la nube.', 'var(--rose)'));
  } else {
    showToast('🗑️ Eliminado solo localmente.', 'var(--rose)');
  }
}
// ── CALENDAR ────────────────────────────────────────────────
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

function changeMonth(dir){ calMonth+=dir; if(calMonth>11){calMonth=0;calYear++;} if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); }

function renderCalendar(){
  const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  document.getElementById('cal-month-label').textContent = `${months[calMonth]} ${calYear}`;

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear()===calYear && today.getMonth()===calMonth;

  // Build payment days map
  const payDays = {};
  payments.forEach(p=>{
    const d = new Date(p.date+'T12:00:00');
    if(d.getFullYear()===calYear && d.getMonth()===calMonth){
      const day = d.getDate();
      if(!payDays[day]) payDays[day]=[];
      payDays[day].push(p);
    }
  });

  // Upcoming due days for this month
  const dueDays = {};
  CATEGORIES.forEach((cat,ci)=>{
    cat.debts.forEach(d=>{
      if(d.dueDay && (d.saldo>0||d.cuota>0)){
        if(!dueDays[d.dueDay]) dueDays[d.dueDay]=[];
        dueDays[d.dueDay].push({...d, catName:cat.name, catColor:cat.color});
      }
    });
  });

  let html = '<div class="cal-weekdays">';
  ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].forEach(d=>html+=`<div class="cal-weekday">${d}</div>`);
  html += '</div><div class="cal-days">';

  const startDay = firstDay;
  // Blank cells before
  const prevMonthDays = new Date(calYear, calMonth, 0).getDate();
  for(let i=0;i<startDay;i++){
    const d = prevMonthDays-startDay+i+1;
    html+=`<div class="cal-day other-month">${d}</div>`;
  }

  for(let d=1;d<=daysInMonth;d++){
    const isToday = isCurrentMonth && today.getDate()===d;
    const hasPay = payDays[d];
    const hasDue = dueDays[d];
    let cls='cal-day';
    if(isToday) cls+=' today';
    else if(hasPay) cls+=' has-payment';
    else if(hasDue) cls+=' upcoming-pay';
    const dot = hasPay ? '<div class="cal-day-dot"></div>' : '';
    html+=`<div class="${cls}" onclick="showDayDetail(${d})">${d}${dot}</div>`;
  }

  // Trailing blanks
  const totalCells = startDay + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7-(totalCells%7);
  for(let i=1;i<=remaining;i++) html+=`<div class="cal-day other-month">${i}</div>`;

  html+='</div>';
  document.getElementById('calendar-grid').innerHTML=html;

  // Upcoming payments list
  const upcomingDebts = [];
  CATEGORIES.forEach((cat,ci)=>{
    cat.debts.forEach(d=>{
      if(d.dueDay && (d.saldo>0||d.cuota>0)){
        upcomingDebts.push({
          day:d.dueDay, name:d.name, catName:cat.name, color:cat.color,
          cuota:d.cuota, icon:cat.icon
        });
      }
    });
  });
  upcomingDebts.sort((a,b)=>a.day-b.day);

  document.getElementById('upcoming-list').innerHTML = upcomingDebts.slice(0,10).map(d=>`
    <div class="upcoming-item glass">
      <div class="up-date">${d.day}</div>
      <div class="up-info">
        <div class="up-name">${d.icon} ${d.name}</div>
        <div class="up-cat">${d.catName}</div>
      </div>
      <div class="up-amount">${fmt(d.cuota)}</div>
    </div>`).join('');
}

function showDayDetail(day){
  const payOnDay = payments.filter(p=>{
    const d=new Date(p.date+'T12:00:00');
    return d.getFullYear()===calYear && d.getMonth()===calMonth && d.getDate()===day;
  });
  if(!payOnDay.length) return;
  document.getElementById('modal-title').textContent=`Pagos del día ${day}`;
  document.getElementById('modal-list').innerHTML=payOnDay.map(p=>{
    const cat=CATEGORIES[p.catIdx];
    return `<div class="modal-debt-item"><div><div class="mdname">${p.debtName}</div><div class="mdmeta">${cat?.name||''} · ${p.note||'Sin nota'}</div></div><div class="mdsaldo" style="color:var(--green)">${fmt(p.amount)}</div></div>`;
  }).join('');
  document.getElementById('modal-overlay').classList.add('open');
}

// ── SIMULATOR ────────────────────────────────────────────────
let simChart = null;

function runSimulator(){
  const extra = parseFloat(document.getElementById('sim-extra').value)||0;
  const strategy = document.getElementById('sim-strategy').value;

  // Build debt objects for simulation
  let debts = [];
  CATEGORIES.forEach((cat,ci)=>{
    cat.debts.forEach(d=>{
      const rem = Math.max(0, d.saldo - getPaid(ci,d.name));
      if(rem > 0){
        debts.push({
          name: d.name, catName: cat.name, color: cat.color,
          balance: rem, cuota: d.cuota,
          rate: (RATES[d.name]||0.28)/12,
          origBalance: rem,
        });
      }
    });
  });

  // Sort by strategy
  if(strategy==='avalanche') debts.sort((a,b)=>b.rate-a.rate);
  else debts.sort((a,b)=>a.balance-b.balance); // snowball

  // Simulate without extra
  const baseMonths = simulatePayoff([...debts.map(d=>({...d}))], 0);
  // Simulate with extra
  const accelMonths = simulatePayoff([...debts.map(d=>({...d}))], extra);

  const monthsSaved = baseMonths.months - accelMonths.months;
  const interestSaved = baseMonths.totalInterest - accelMonths.totalInterest;

  // Results
  document.getElementById('sim-results').innerHTML=`
    <div class="sim-result-item">
      <div class="sri-label">Sin abono extra</div>
      <div class="sri-value" style="color:var(--rose)">${baseMonths.months} meses</div>
      <div class="sri-sub">Terminas en ${getEndDate(baseMonths.months)}</div>
    </div>
    <div class="sim-result-item">
      <div class="sri-label">Con abono extra de ${fmt(extra)}</div>
      <div class="sri-value" style="color:var(--green)">${accelMonths.months} meses</div>
      <div class="sri-sub">Terminas en ${getEndDate(accelMonths.months)}</div>
    </div>
    <div class="sim-result-item">
      <div class="sri-label">Te ahorras</div>
      <div class="sri-value" style="color:var(--amber)">${monthsSaved} meses · ${fmt(interestSaved)}</div>
      <div class="sri-sub">En tiempo e intereses evitados</div>
    </div>`;

  // Chart
  renderSimChart(baseMonths.history, accelMonths.history);

  // Priority list
  renderPriorityList(debts, strategy);
}

function simulatePayoff(debts, extra){
  let months=0, totalInterest=0;
  let history=[debts.reduce((s,d)=>s+d.balance,0)];

  while(debts.some(d=>d.balance>100) && months<120){
    let pool=extra;
    debts.forEach(d=>{
      if(d.balance>0){
        const interest=d.balance*d.rate;
        totalInterest+=interest;
        d.balance+=interest;
        const pay=Math.min(d.balance, d.cuota);
        d.balance=Math.max(0,d.balance-pay);
      }
    });
    // Apply extra to first in priority
    for(let d of debts){
      if(d.balance>0&&pool>0){
        const pay=Math.min(d.balance,pool);
        d.balance=Math.max(0,d.balance-pay);
        pool-=pay;
      }
    }
    months++;
    history.push(Math.max(0,debts.reduce((s,d)=>s+d.balance,0)));
  }
  return {months, totalInterest, history};
}

function getEndDate(months){
  const d=new Date(); d.setMonth(d.getMonth()+months);
  return d.toLocaleDateString('es-CO',{month:'long',year:'numeric'});
}

function renderSimChart(baseH, accelH){
  const ctx=document.getElementById('simChart');
  if(!ctx) return;
  const c=ctx.getContext('2d');
  const maxLen=Math.max(baseH.length,accelH.length);
  const labels=Array.from({length:maxLen},(_,i)=>i===0?'Hoy':`M${i}`);

  if(simChart) simChart.destroy();

  const gradBase=c.createLinearGradient(0,0,0,300);
  gradBase.addColorStop(0,'rgba(248,81,73,0.15)'); gradBase.addColorStop(1,'rgba(248,81,73,0)');
  const gradAccel=c.createLinearGradient(0,0,0,300);
  gradAccel.addColorStop(0,'rgba(45,186,124,0.15)'); gradAccel.addColorStop(1,'rgba(45,186,124,0)');

  simChart=new Chart(c,{
    type:'line',
    data:{
      labels,
      datasets:[
        {label:'Sin extra',data:baseH,borderColor:'#f85149',borderWidth:2,pointRadius:0,fill:true,backgroundColor:gradBase,tension:0.4},
        {label:'Con extra',data:accelH,borderColor:'#2dba7c',borderWidth:2.5,pointRadius:0,fill:true,backgroundColor:gradAccel,tension:0.4},
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{display:true,labels:{color:'#7d8590',font:{family:'Outfit',size:11},boxWidth:12,padding:16}},
        tooltip:{
          backgroundColor:'rgba(13,17,23,0.95)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,
          callbacks:{label:ctx=>`${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`}
        }
      },
      scales:{
        y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#7d8590',callback:v=>`$${(v/1000000).toFixed(0)}M`}},
        x:{grid:{display:false},ticks:{color:'#7d8590',maxTicksLimit:8}}
      }
    }
  });
}

function renderPriorityList(debts, strategy){
  const colors=['#2dba7c','#58a6ff','#e3b341','#f85149','#bc8cff','#ff9f43'];
  document.getElementById('priority-list').innerHTML=debts.slice(0,8).map((d,i)=>{
    const reason = strategy==='avalanche'
      ? `Tasa ~${Math.round((RATES[d.name]||0.28)*100)}% anual — eliminar primero ahorra más intereses`
      : `Saldo más pequeño (${fmt(d.origBalance)}) — págarla primero da motivación`;
    return `<div class="priority-item glass">
      <div class="priority-rank" style="background:${colors[i]||'#666'}20;color:${colors[i]||'#666'};border:1px solid ${colors[i]||'#666'}30">${i+1}</div>
      <div class="priority-info">
        <div class="pi-name">${d.name} <span style="color:var(--muted);font-size:0.65rem;font-weight:400">· ${d.catName}</span></div>
        <div class="pi-reason">${reason}</div>
      </div>
      <div class="priority-amount">
        <div class="pa-saldo" style="color:${d.color||'var(--text)'}">${fmt(d.balance)}</div>
        <div class="pa-cuota">${fmt(d.cuota)}/mes</div>
      </div>
    </div>`;
  }).join('');
}

// ── AI ADVISOR ───────────────────────────────────────────────
const APPS_SCRIPT_AI_URL = null; // Will use built-in AI logic + Anthropic API if available

function renderAISuggestions(){
  // Auto-send initial analysis on first load
  const msgs = document.getElementById('ai-messages');
  if(msgs.children.length <= 1){
    setTimeout(()=>aiAsk('Dame un análisis rápido de mis deudas más urgentes'), 500);
  }
}

async function aiSend(){
  const input = document.getElementById('ai-input');
  const msg = input.value.trim();
  if(!msg) return;
  input.value='';
  aiAsk(msg);
}

function aiAsk(question){
  const msgs = document.getElementById('ai-messages');

  // Add user message
  msgs.innerHTML += `<div class="ai-msg ai-msg-user"><div class="ai-bubble">${question}</div></div>`;

  // Add typing indicator
  const typingId = 'typing-'+Date.now();
  msgs.innerHTML += `<div class="ai-msg ai-msg-bot" id="${typingId}"><div class="ai-avatar">🤖</div><div class="ai-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div></div>`;
  msgs.scrollTop = msgs.scrollHeight;

  // Build financial context
  const context = buildFinancialContext();

  // Try Anthropic API first, fallback to local logic
  fetchAIResponse(question, context).then(response => {
    const typingEl = document.getElementById(typingId);
    if(typingEl){
      typingEl.querySelector('.ai-bubble').innerHTML = formatAIResponse(response);
    }
    msgs.scrollTop = msgs.scrollHeight;
  });
}

function buildFinancialContext(){
  const {orig,paid,curr,cuota} = getGrand();
  const pct = orig>0?Math.round((paid/orig)*100):0;

  let debtDetails = [];
  CATEGORIES.forEach((cat,ci)=>{
    cat.debts.forEach(d=>{
      const rem = Math.max(0, d.saldo - getPaid(ci,d.name));
      if(rem>0||d.cuota>0){
        debtDetails.push(`${d.name} (${cat.name}): saldo $${Math.round(rem).toLocaleString()}, cuota $${Math.round(d.cuota).toLocaleString()}/mes, tasa ~${Math.round((RATES[d.name]||0.28)*100)}% anual`);
      }
    });
  });

  const baseMonths = curr>0&&cuota>0?Math.ceil(curr/cuota):0;

  return `SITUACIÓN FINANCIERA ACTUAL:
- Deuda total inicial: ${fmt(orig)}
- Deuda actual restante: ${fmt(curr)}
- Progreso pagado: ${pct}%
- Cuota mensual total: ${fmt(cuota)}
- Meses estimados para terminar: ~${baseMonths}
- Pagos registrados: ${payments.length}

DETALLE DE DEUDAS:
${debtDetails.join('\n')}`;
}

async function fetchAIResponse(question, context){
  // Try Anthropic API
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: `Eres una consejera financiera experta, empática y directa. Hablas en español colombiano informal pero profesional. Analizas deudas y das consejos prácticos y accionables. Siempre terminas con 1 acción concreta que la persona puede hacer HOY. Usa emojis con moderación. Contexto financiero del usuario:\n\n${context}`,
        messages: [{ role: 'user', content: question }]
      })
    });
    if(response.ok){
      const data = await response.json();
      return data.content?.[0]?.text || localAIResponse(question, context);
    }
  } catch(e) { /* fallback */ }

  // Fallback: intelligent local responses
  return localAIResponse(question, context);
}

function localAIResponse(question, context){
  const q = question.toLowerCase();
  const {orig,paid,curr,cuota} = getGrand();

  // Find highest rate debt
  let allDebts=[];
  CATEGORIES.forEach((cat,ci)=>{
    cat.debts.forEach(d=>{
      const rem=Math.max(0,d.saldo-getPaid(ci,d.name));
      if(rem>0) allDebts.push({...d,rem,rate:RATES[d.name]||0.28,catName:cat.name});
    });
  });
  allDebts.sort((a,b)=>b.rate-a.rate);
  const highestRate = allDebts[0];
  const smallestDebt = [...allDebts].sort((a,b)=>a.rem-b.rem)[0];

  if(q.includes('primero')||q.includes('pagar')||q.includes('urgente')){
    return `🎯 **Mi recomendación: Empieza con ${highestRate?.name}**\n\nEsta deuda tiene la tasa más alta (~${Math.round((highestRate?.rate||0.28)*100)}% anual). Cada mes que pasa, los intereses te están costando ~${fmt((highestRate?.rem||0)*(highestRate?.rate||0.28)/12)} solo en intereses.\n\n**Estrategia sugerida:** Paga la cuota mínima de todas las demás y manda todo el dinero extra a ${highestRate?.name}. Se llama estrategia Avalancha 🏔 y es la que más dinero te ahorra.\n\n✅ **Acción para hoy:** Programa un pago adicional a ${highestRate?.name} aunque sea de $100.000.`;
  }

  if(q.includes('análisis')||q.includes('completo')||q.includes('resumen')){
    const months = cuota>0?Math.ceil(curr/cuota):0;
    const pct = orig>0?Math.round((paid/orig)*100):0;
    return `📊 **Análisis de tu situación:**\n\n• Deuda total: ${fmt(curr)} (llevas ${pct}% pagado 💪)\n• Cuota mensual: ${fmt(cuota)}\n• A este ritmo terminas en ~${months} meses\n• Deuda más cara: **${highestRate?.name}** (~${Math.round((highestRate?.rate||0.28)*100)}% anual)\n• Deuda más pequeña para liquidar rápido: **${smallestDebt?.name}** (${fmt(smallestDebt?.rem||0)})\n\n${pct>20?'🟢 ¡Vas muy bien! Cada peso que pagas de más acelera mucho el proceso.':'🟡 Al comienzo del camino, pero cada pago cuenta. ¡No te rindas!'}\n\n✅ **Acción para hoy:** Revisa si puedes agregar aunque sea $200.000 extra al mes. En el tab Simulador puedes ver exactamente cuánto tiempo te ahorras.`;
  }

  if(q.includes('cuándo')||q.includes('cuando')||q.includes('termino')){
    const months = cuota>0?Math.ceil(curr/cuota):0;
    const endDate = getEndDate(months);
    const accel = simulatePayoff(allDebts.map(d=>({balance:d.rem,cuota:d.cuota,rate:d.rate/(12),origBalance:d.rem})), 500000);
    return `📅 **Proyección de libertad financiera:**\n\n• **Sin cambios:** terminas en ~${months} meses (${endDate})\n• **Con $500K extra/mes:** terminas en ~${accel.months} meses 🚀\n\nLa diferencia es ${months-accel.months} meses menos y ${fmt(accel.totalInterest)} en intereses ahorrados.\n\n✅ **Acción para hoy:** Ve al tab Simulador y juega con diferentes montos de abono extra para ver cuándo quieres ser libre 🎉`;
  }

  if(q.includes('interés')||q.includes('tasa')||q.includes('cara')){
    return `💸 **Deudas ordenadas por costo (mayor a menor):**\n\n${allDebts.slice(0,5).map((d,i)=>`${i+1}. **${d.name}** — ~${Math.round(d.rate*100)}% anual | Saldo: ${fmt(d.rem)}`).join('\n')}\n\nCada mes la deuda de **${highestRate?.name}** te cobra ~${fmt((highestRate?.rem||0)*(highestRate?.rate||0.28)/12)} solo en intereses. 😤\n\n✅ **Acción para hoy:** Intenta hacer un pago extra de lo que sea a ${highestRate?.name} antes del día ${allDebts[0] && CATEGORIES.flat ? 'de tu fecha límite' : 'de corte'}.`;
  }

  if(q.includes('consejo')||q.includes('rápido')||q.includes('acelerar')){
    return `🚀 **Top 5 consejos para salir más rápido:**\n\n1. **Estrategia Avalancha:** paga mínimos en todo y enfoca el extra en ${highestRate?.name} (mayor tasa)\n2. **Redondea pagos:** en vez de $2.900.000 paga $3.100.000 cuando puedas\n3. **Ingresos extra → deudas:** bonos, comisiones, ventas → directo a la deuda más cara\n4. **No adquieras más deuda** mientras no liquides las existentes\n5. **Celebra pequeñas victorias:** cuando liquides una deuda, toma el dinero de esa cuota y súmalo a la siguiente\n\n✅ **Acción para hoy:** Escoge UNA de estas 5 acciones e impleméntala esta semana.`;
  }

  // Default
  return `💡 Basándome en tu situación actual:\n\n• Deuda restante: ${fmt(curr)}\n• Cuota mensual: ${fmt(cuota)}\n• Deuda más urgente: **${highestRate?.name}** (${Math.round((highestRate?.rate||0.28)*100)}% anual)\n\nTe sugiero enfocarte en pagar ${highestRate?.name} primero mientras pagas los mínimos de las demás.\n\n✅ ¿Quieres que analice algo específico? Puedes preguntarme sobre cuándo terminas, qué deuda pagar primero, o cómo acelerar el proceso.`;
}

function formatAIResponse(text){
  return text
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,'<em>$1</em>')
    .replace(/\n/g,'<br>');
}

// ── NOTIFICATIONS ────────────────────────────────────────────
function toggleNotifications(){
  renderNotifications();
  document.getElementById('notif-overlay').classList.add('open');
}

function renderNotifications(){
  const now = new Date();
  const upcomingDays = 5; // alert if due within 5 days

  let notifs = [];
  CATEGORIES.forEach((cat,ci)=>{
    cat.debts.forEach(d=>{
      if(!d.dueDay||(!d.saldo&&!d.cuota)) return;
      const dueDate = new Date(now.getFullYear(), now.getMonth(), d.dueDay);
      if(dueDate < now) dueDate.setMonth(dueDate.getMonth()+1);
      const daysLeft = Math.ceil((dueDate-now)/(1000*60*60*24));
      if(daysLeft<=upcomingDays){
        notifs.push({name:d.name,catName:cat.name,cuota:d.cuota,dueDay:d.dueDay,daysLeft,color:cat.color,icon:cat.icon});
      }
    });
  });

  // Update badge
  const badge = document.getElementById('notif-badge');
  badge.style.display = notifs.length ? 'flex' : 'none';
  badge.textContent = notifs.length;

  const content = document.getElementById('notif-content');
  if(!notifs.length){
    content.innerHTML='<div class="empty-msg">No hay pagos próximos en los siguientes 5 días 🎉</div>';
    return;
  }
  content.innerHTML = notifs.map(n=>`
    <div class="notif-item">
      <div class="ni-title">${n.icon} ${n.name} — ${n.catName}</div>
      <div class="ni-msg">Vence el día <strong>${n.dueDay}</strong> · Cuota: <strong>${fmt(n.cuota)}</strong></div>
      <div class="ni-date">${n.daysLeft===0?'¡Hoy!':n.daysLeft===1?'Mañana':`En ${n.daysLeft} días`}</div>
    </div>`).join('');
}

async function requestNotifPermission(){
  if(!('Notification' in window)){ alert('Tu navegador no soporta notificaciones'); return; }
  const perm = await Notification.requestPermission();
  if(perm==='granted'){
    document.getElementById('btn-notif').textContent='✓ Notificaciones activadas';
    document.getElementById('btn-notif').style.background='rgba(45,186,124,0.2)';
    scheduleNotifications();
  }
}

function scheduleNotifications(){
  // Check every hour for upcoming payments
  checkUpcomingPayments();
  setInterval(checkUpcomingPayments, 3600000);
}

function checkUpcomingPayments(){
  if(Notification.permission!=='granted') return;
  const now=new Date();
  CATEGORIES.forEach((cat,ci)=>{
    cat.debts.forEach(d=>{
      if(!d.dueDay||(!d.saldo&&!d.cuota)) return;
      const dueDate=new Date(now.getFullYear(),now.getMonth(),d.dueDay);
      if(dueDate<now) dueDate.setMonth(dueDate.getMonth()+1);
      const daysLeft=Math.ceil((dueDate-now)/(1000*60*60*24));
      if(daysLeft<=2){
        new Notification(`💳 Pago próximo: ${d.name}`,{
          body:`Vence en ${daysLeft===0?'hoy':daysLeft===1?'1 día':'2 días'} — Cuota: ${fmt(d.cuota)}`,
          icon:'/icon-192.png'
        });
      }
    });
  });
}

function closeNotif(e){ if(!e||e.target===document.getElementById('notif-overlay')) document.getElementById('notif-overlay').classList.remove('open'); }

// ── MODALS ───────────────────────────────────────────────────
function openCatModal(i){
  const cat=CATEGORIES[i];
  document.getElementById('modal-title').textContent=cat.icon+' '+cat.name;
  document.getElementById('modal-list').innerHTML=cat.debts.map(d=>{
    const paid=getPaid(i,d.name), rem=Math.max(0,d.saldo-paid);
    return `<div class="modal-debt-item"><div><div class="mdname">${d.name}</div><div class="mdmeta">Cuota: ${fmtF(d.cuota)} · Pagado: ${fmt(paid)}</div></div><div class="mdsaldo" style="color:${cat.color}">${fmt(rem)}</div></div>`;
  }).join('');
  document.getElementById('modal-overlay').classList.add('open');
}
function closeMod(e){ if(!e||e.target===document.getElementById('modal-overlay')) document.getElementById('modal-overlay').classList.remove('open'); }
function openHelp(){ document.getElementById('help-overlay').classList.add('open'); }
function closeHelp(e){ if(!e||e.target===document.getElementById('help-overlay')) document.getElementById('help-overlay').classList.remove('open'); }

// ── SYNC ─────────────────────────────────────────────────────
function syncData(){
  const lbl=document.getElementById('sync-label'); lbl.textContent='Sincronizando...';
  recordMonthlySnapshot();
  setTimeout(()=>{ renderAll(); lbl.textContent='✓ Actualizado'; setTimeout(()=>lbl.textContent='Actualizar',2200); },700);
}

// ── RENDER ALL ───────────────────────────────────────────────
function renderAll(){
  renderHero();
  renderCategories();
  renderDebtList();
  populateSelect();
  renderHistory();
  renderEvolutionChart();
  renderNotifications();
}

// ── INIT ─────────────────────────────────────────────────────
document.getElementById('pay-date').value = new Date().toISOString().split('T')[0];
recordMonthlySnapshot();
renderAll();
// ── FORMATEO DE MONEDA EN TIEMPO REAL ──
document.getElementById('pay-amount').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value !== '') {
    e.target.value = new Intl.NumberFormat('es-CO').format(parseInt(value));
  } else {
    e.target.value = '';
  }
});
