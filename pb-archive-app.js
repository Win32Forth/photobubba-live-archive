/* PhotoBubba live archive app */
(function(){
  if (window.__pbArchiveLoaded) return;
  window.__pbArchiveLoaded = true;
  var css = ".pb-app{--pb-bg:#f7f3ec;--pb-card:#fff;--pb-ink:#1f1a14;--pb-muted:#5c5348;--pb-accent:#b85a12;--pb-line:rgba(31,26,20,.14);color:var(--pb-ink);font-family:\"Avenir Next\",\"Segoe UI\",\"Helvetica Neue\",sans-serif;background:radial-gradient(1200px 500px at 10% -10%,rgba(184,90,18,.10),transparent 60%),radial-gradient(900px 400px at 90% 0%,rgba(90,130,170,.08),transparent 55%),var(--pb-bg);padding:1.25rem 1rem 2.5rem;border-radius:18px;margin:0 auto;max-width:1200px;box-sizing:border-box}\n.pb-app *{box-sizing:border-box}\n.pb-eyebrow{margin:0;color:var(--pb-accent);text-transform:uppercase;letter-spacing:.12em;font-size:.75rem;font-weight:700}\n.pb-title{margin:.35rem 0 .4rem;font-size:clamp(1.6rem,3vw,2.2rem);line-height:1.15;color:var(--pb-ink)}\n.pb-sub{margin:0 0 1rem;color:var(--pb-muted)}\n.pb-form{display:grid;gap:.65rem;margin:0 0 1rem;position:sticky;top:0;z-index:5;padding:.75rem 0;background:linear-gradient(to bottom,rgba(247,243,236,.97),rgba(247,243,236,.9))}\n@media(min-width:800px){.pb-form{grid-template-columns:1fr auto auto auto auto}}\n.pb-form input[type=search],.pb-form select{border:1px solid var(--pb-line);border-radius:12px;background:#fff;color:var(--pb-ink);padding:.7rem .85rem;font:inherit}\n.pb-form button{border:0;border-radius:12px;background:var(--pb-accent);color:#fffaf4;font-weight:700;padding:.7rem 1rem;cursor:pointer}\n.pb-photos{display:flex;align-items:center;gap:.4rem;color:var(--pb-ink);white-space:nowrap}\n.pb-status{color:var(--pb-muted);min-height:1.4em}\n.pb-results{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.1rem}\n.pb-card{background:var(--pb-card);border:1px solid var(--pb-line);border-radius:18px;overflow:hidden;box-shadow:0 12px 28px rgba(31,26,20,.08);display:flex;flex-direction:column;min-height:100%}\n.pb-card img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:#e8e0d4}\n.pb-card-body{padding:.85rem .9rem 1rem;display:grid;gap:.45rem}\n.pb-date{display:inline-flex;width:fit-content;background:rgba(184,90,18,.12);color:#8a4208;border-radius:999px;padding:.2rem .65rem;font-size:.8rem;font-weight:700}\n.pb-card h2{margin:0;font-size:1.05rem;line-height:1.3}\n.pb-card h2 a{color:var(--pb-ink);text-decoration:none}\n.pb-card h2 a:hover{color:var(--pb-accent)}\n.pb-excerpt{margin:0;color:var(--pb-muted);font-size:.92rem;line-height:1.45}\n.pb-foot{display:flex;justify-content:space-between;gap:.5rem;align-items:center;color:var(--pb-muted);font-size:.8rem;margin-top:.25rem}\n.pb-foot a{color:var(--pb-accent);font-weight:600;text-decoration:none}\n.pb-empty{grid-column:1/-1;padding:1rem;border:1px dashed var(--pb-line);border-radius:14px;background:#efe8dc;color:var(--pb-muted)}\n.pb-pager{display:flex;justify-content:center;align-items:center;gap:1rem;margin-top:1.25rem}\n.pb-pager button{border:0;border-radius:12px;background:var(--pb-accent);color:#fffaf4;font-weight:700;padding:.65rem 1rem;cursor:pointer}\n.pb-pager button:disabled{opacity:.45;cursor:default}\n.pb-ph{aspect-ratio:4/3;display:grid;place-items:center;background:#efe8dc;color:var(--pb-muted);font-size:.9rem}";
  var style = document.createElement('style');
  style.setAttribute('data-pb-archive','1');
  style.textContent = css + "\nbody{background:#f7f3ec!important;color:#1f1a14!important;}";
  document.head.appendChild(style);
  var mount = document.getElementById('pb-archive-app');
  if (!mount) {
    mount = document.createElement('div');
    mount.id = 'pb-archive-root';
    var target = document.querySelector('main') || document.querySelector('.wp-site-blocks') || document.body;
    target.insertBefore(mount, target.firstChild);
  }
  // If mount is empty shell from template, fill inner structure
  if (!document.getElementById('pb-form')) {
    mount.outerHTML = "<div id=\"pb-archive-app\" class=\"pb-app\">\n  <div class=\"pb-hero\">\n    <p class=\"pb-eyebrow\">PhotoBubba Event Archive</p>\n    <h1 class=\"pb-title\">Browse motorcycle events &amp; chaplain notes</h1>\n    <p class=\"pb-sub\">Search by keyword, year, named event, or photos. Full dates on every card.</p>\n  </div>\n  <form id=\"pb-form\" class=\"pb-form\">\n    <input id=\"pb-q\" type=\"search\" placeholder=\"Search events, clubs, places\u2026\" />\n    <select id=\"pb-year\"><option value=\"\">All years</option></select>\n    <select id=\"pb-event\"><option value=\"\">All events</option></select>\n    <label class=\"pb-photos\"><input id=\"pb-photos\" type=\"checkbox\" checked /> Photos only</label>\n    <button type=\"submit\">Search</button>\n  </form>\n  <p id=\"pb-status\" class=\"pb-status\">Loading archive\u2026</p>\n  <div id=\"pb-results\" class=\"pb-results\"></div>\n  <div id=\"pb-pager\" class=\"pb-pager\" hidden>\n    <button type=\"button\" id=\"pb-prev\">Previous</button>\n    <span id=\"pb-page-label\"></span>\n    <button type=\"button\" id=\"pb-next\">Next</button>\n  </div>\n</div>";
  }
  (function(){
  const SITE = '3661809';
  const API = 'https://public-api.wordpress.com/rest/v1.1/sites/' + SITE + '/posts';
  const EVENTS = [{"id": "texas-mist", "label": "Texas Mist", "patterns": ["texas mist"]}, {"id": "bentwood", "label": "Bentwood", "patterns": ["bentwood"]}, {"id": "rot-rally", "label": "ROT Rally", "patterns": ["rot rally", "republic of texas rally"]}, {"id": "summer-sizzle", "label": "Summer Sizzle", "patterns": ["summer sizzle"]}, {"id": "christian-unity", "label": "Christian Unity", "patterns": ["christian unity"]}, {"id": "bike-night", "label": "Bike Night", "patterns": ["bike night"]}, {"id": "veterans-collective", "label": "Veterans Collective", "patterns": ["veterans collective", "veteran's collective", "veterans’ collective"]}, {"id": "chaplains-moment", "label": "Chaplain’s Moment", "patterns": ["chaplain's moment", "chaplains moment", "chaplain’s moment", "moments with a biker chaplain"]}, {"id": "toy-run", "label": "Toy Run", "patterns": ["toy run"]}, {"id": "freedom-run", "label": "Freedom Run", "patterns": ["freedom run"]}, {"id": "bug-run", "label": "BUG Run", "patterns": ["bug run", "burger university"]}, {"id": "roadhouse", "label": "Roadhouse", "patterns": ["roadhouse"]}, {"id": "family-campout", "label": "UCOA Family Campout", "patterns": ["family campout", "ucoa family campout"]}, {"id": "egg-stravaganza", "label": "Egg-Stravaganza", "patterns": ["egg-stravaganza", "egg stravaganza", "eggstravaganza"]}, {"id": "maxs-ride", "label": "Max’s Ride", "patterns": ["max's ride", "maxs ride", "max’s ride"]}, {"id": "new-life-riders", "label": "New Life Riders", "patterns": ["new life riders", "nlr chapter"]}, {"id": "biker-experience", "label": "The Biker Experience", "patterns": ["biker experience"]}, {"id": "willies-joint", "label": "Willie’s Joint", "patterns": ["willie's joint", "willies joint", "willie’s joint"]}, {"id": "ernies-on-the-lake", "label": "Ernie’s on the Lake", "patterns": ["ernie's on the lake", "ernies on the lake", "ernie’s on the lake"]}, {"id": "bill-millers", "label": "Bill Miller’s BBQ", "patterns": ["bill miller"]}, {"id": "ucoa-meeting", "label": "UCOA Meeting", "patterns": ["ucoa meeting", "monthly ucoa", "ucoa (united clubs"]}];
  const PAGE_SIZE = 24;
  const CACHE_KEY = 'pbArchivePostsV1';
  const state = { page:1, q:'', year:'', event:'', photosOnly:true, posts:[], filtered:[], years:[], eventCounts:{} };
  const $ = (id) => document.getElementById(id);
  const els = { form:$('pb-form'), q:$('pb-q'), year:$('pb-year'), event:$('pb-event'), photos:$('pb-photos'), status:$('pb-status'), results:$('pb-results'), pager:$('pb-pager'), prev:$('pb-prev'), next:$('pb-next'), pageLabel:$('pb-page-label') };

  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function strip(html){const d=document.createElement('div');d.innerHTML=html||'';return (d.textContent||'').replace(/\s+/g,' ').trim();}
  function fullDate(iso){
    if(!iso) return '';
    const d=new Date(iso);
    if(isNaN(d)) return iso.slice(0,10);
    return d.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  }
  function hay(p){
    return [p.title,p.excerpt,p.content,p.slug,(p.tags||[]).join(' '), (p.categories||[]).join(' ')].join(' ').toLowerCase();
  }
  function matchEvent(p, ev){
    const h=hay(p);
    return (ev.patterns||[]).some(pat => h.indexOf(String(pat).toLowerCase()) !== -1);
  }
  function normalize(raw){
    const title=strip(raw.title);
    const excerpt=strip(raw.excerpt).slice(0,280);
    const content=strip(raw.content||'');
    const date=raw.date||'';
    const year=date ? Number(date.slice(0,4)) : null;
    const tags=[], cats=[];
    if(raw.tags&&typeof raw.tags==='object'){Object.values(raw.tags).forEach(t=>t&&t.name&&tags.push(t.name));}
    if(raw.categories&&typeof raw.categories==='object'){Object.values(raw.categories).forEach(c=>c&&c.name&&cats.push(c.name));}
    const featured=raw.featured_image||'';
    let imgCount=Number(raw.attachment_count||0);
    if(!imgCount && (raw.content||'').match(/<img /gi)) imgCount=(raw.content.match(/<img /gi)||[]).length;
    const hasPhoto=!!(featured || imgCount>0);
    return {
      id:raw.ID, title, excerpt, content, url: (raw.URL||'').replace('http://','https://'),
      date, year, slug:raw.slug||'', tags, categories:cats,
      image: featured || '', hasPhoto, imageCount:imgCount
    };
  }

  async function fetchAllPosts(onProgress){
    try{
      const cached=sessionStorage.getItem(CACHE_KEY);
      if(cached){
        const parsed=JSON.parse(cached);
        if(parsed && Array.isArray(parsed.posts) && parsed.posts.length>50 && (Date.now()-parsed.at<86400000)){
          return parsed.posts;
        }
      }
    }catch(e){}
    const posts=[];
    let page=1, found=null;
    while(true){
      const url=API + '?number=100&page=' + page + '&status=publish&order_by=date&order=DESC&fields=ID,date,title,URL,excerpt,content,slug,featured_image,categories,tags,attachment_count';
      const res=await fetch(url);
      if(!res.ok) throw new Error('API HTTP ' + res.status);
      const data=await res.json();
      if(found===null) found=data.found||0;
      const batch=data.posts||[];
      if(!batch.length) break;
      batch.forEach(raw => posts.push(normalize(raw)));
      if(onProgress) onProgress(posts.length, found);
      if(posts.length >= found || page>40) break;
      page += 1;
    }
    try{ sessionStorage.setItem(CACHE_KEY, JSON.stringify({at:Date.now(), posts})); }catch(e){}
    return posts;
  }

  function computeMeta(posts){
    const years=Array.from(new Set(posts.map(p=>p.year).filter(Boolean))).sort((a,b)=>a-b);
    const eventCounts={};
    EVENTS.forEach(ev => { eventCounts[ev.id]=posts.filter(p=>matchEvent(p,ev)).length; });
    state.years=years; state.eventCounts=eventCounts;
    els.year.innerHTML='<option value="">All years</option>' + years.slice().reverse().map(y=>'<option value="'+y+'">'+y+'</option>').join('');
    els.event.innerHTML='<option value="">All events</option>' + EVENTS.filter(ev=>eventCounts[ev.id]>0).sort((a,b)=>eventCounts[b.id]-eventCounts[a.id]||a.label.localeCompare(b.label)).map(ev=>'<option value="'+ev.id+'">'+esc(ev.label)+' ('+eventCounts[ev.id]+')</option>').join('');
  }

  function applyFilters(){
    const tokens=(state.q||'').toLowerCase().split(/\s+/).filter(Boolean);
    const ev=EVENTS.find(e=>e.id===state.event);
    state.filtered=state.posts.filter(p=>{
      if(state.year && p.year !== Number(state.year)) return false;
      if(state.photosOnly && !p.hasPhoto) return false;
      if(ev && !matchEvent(p, ev)) return false;
      if(tokens.length && !tokens.every(t => hay(p).includes(t))) return false;
      return true;
    });
    const pages=Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE)||1);
    if(state.page>pages) state.page=pages;
    render();
  }

  function render(){
    const total=state.filtered.length;
    const pages=Math.max(1, Math.ceil(total / PAGE_SIZE)||1);
    const start=(state.page-1)*PAGE_SIZE;
    const slice=state.filtered.slice(start, start+PAGE_SIZE);
    els.status.textContent = total + ' post' + (total===1?'':'s') + ' · page ' + state.page + ' of ' + pages;
    if(!slice.length){
      els.results.innerHTML='<div class="pb-empty">No posts match these filters. Try clearing Event or Photos only.</div>';
    } else {
      els.results.innerHTML=slice.map(p=>{
        const img=p.image ? '<img src="'+esc(p.image)+(p.image.includes('?')?'':'?w=600')+'" alt="" loading="lazy" />' : '<div class="pb-ph">No photo</div>';
        const note=p.hasPhoto ? ((p.imageCount||1)+' photo'+(p.imageCount===1?'':'s')) : 'text post';
        return '<article class="pb-card">'+img+'<div class="pb-card-body"><div class="pb-date">'+esc(fullDate(p.date))+'</div><h2><a href="'+esc(p.url)+'">'+esc(p.title)+'</a></h2><p class="pb-excerpt">'+esc(p.excerpt)+'</p><div class="pb-foot"><span>'+esc(note)+'</span><a href="'+esc(p.url)+'">Open post →</a></div></div></article>';
      }).join('');
    }
    els.pager.hidden = pages<=1;
    els.pageLabel.textContent='Page '+state.page+' / '+pages;
    els.prev.disabled = state.page<=1;
    els.next.disabled = state.page>=pages;
    // sync controls
    els.q.value=state.q; els.year.value=state.year; els.event.value=state.event; els.photos.checked=state.photosOnly;
  }

  function readUrlSeed(){
    const params=new URLSearchParams(location.search);
    if(params.get('s')) state.q=params.get('s');
    if(params.get('year')) state.year=params.get('year');
    if(params.get('event')) state.event=params.get('event');
    if(params.get('photos')==='0') state.photosOnly=false;
  }

  els.form.addEventListener('submit', (e)=>{ e.preventDefault(); state.q=els.q.value.trim(); state.year=els.year.value; state.event=els.event.value; state.photosOnly=els.photos.checked; state.page=1; applyFilters(); });
  els.year.addEventListener('change', ()=>{ state.year=els.year.value; state.page=1; applyFilters(); });
  els.event.addEventListener('change', ()=>{ state.event=els.event.value; state.page=1; applyFilters(); });
  els.photos.addEventListener('change', ()=>{ state.photosOnly=els.photos.checked; state.page=1; applyFilters(); });
  els.prev.addEventListener('click', ()=>{ if(state.page>1){ state.page--; render(); window.scrollTo({top:0,behavior:'smooth'}); } });
  els.next.addEventListener('click', ()=>{ state.page++; render(); window.scrollTo({top:0,behavior:'smooth'}); });

  readUrlSeed();
  fetchAllPosts((n,total)=>{ els.status.textContent='Loading archive… '+n+(total?(' / '+total):''); }).then(posts=>{
    state.posts=posts;
    computeMeta(posts);
    applyFilters();
  }).catch(err=>{ els.status.textContent='Could not load archive: '+err.message; });
})();
})();
