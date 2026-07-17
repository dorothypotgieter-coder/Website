
(() => {
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];

  function toast(message, timeout=6000) {
    const old = $('.pwa-toast'); if (old) old.remove();
    const el = document.createElement('div'); el.className='pwa-toast'; el.setAttribute('role','status'); el.textContent=message;
    document.body.appendChild(el); setTimeout(() => el.remove(), timeout);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const header = $('header.site .bar');
    const nav = $('nav.mainnav');
    const brand = $('.brand');
    if (brand && !$('.brand-text', brand)) {
      const nodes=[...brand.childNodes];
      const text=nodes.filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
      nodes.filter(n=>n.nodeType===3).forEach(n=>n.remove());
      const span=document.createElement('span'); span.className='brand-text'; span.textContent=text || "Evan's Batumi Journey"; brand.appendChild(span);
    }

    if (header && nav) {
      const install=document.createElement('button'); install.className='install-button'; install.type='button'; install.textContent='Install'; install.setAttribute('aria-label','Install this app');
      const toggle=document.createElement('button'); toggle.className='menu-toggle'; toggle.type='button'; toggle.innerHTML='☰'; toggle.setAttribute('aria-label','Open navigation'); toggle.setAttribute('aria-expanded','false');
      header.insertBefore(install, nav); header.insertBefore(toggle, nav);
      toggle.addEventListener('click', () => {
        const open=nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.innerHTML=open?'×':'☰';
      });
      nav.addEventListener('click', e => { if(e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.innerHTML='☰'; }});

      let deferredPrompt=null;
      window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt=e; install.classList.add('visible'); });
      install.addEventListener('click', async () => {
        if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; install.classList.remove('visible'); return; }
        const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
        toast(ios ? 'On iPhone or iPad: tap Share, then “Add to Home Screen”.' : 'Open your browser menu and choose “Install app” or “Add to Home screen”.', 8000);
      });
      if (matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) install.remove();
      else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) install.classList.add('visible');
    }

    const page = location.pathname.split('/').pop() || 'index.html';
    $$('.mainnav a').forEach(a => {
      const href=(a.getAttribute('href')||'').split('#')[0];
      a.classList.toggle('active', href===page || (page==='index.html' && href==='index.html'));
    });

    const bottom=document.createElement('nav'); bottom.className='app-bottom-nav'; bottom.setAttribute('aria-label','App navigation');
    bottom.innerHTML=`
      <a href="index.html"><span>⌂</span>Home</a>
      <a href="index.html#journey"><span>☷</span>Journey</a>
      <a href="results.html"><span>♟</span>Results</a>
      <a href="videos.html"><span>▶</span>Videos</a>`;
    document.body.appendChild(bottom);
    const active = page==='results.html'||page==='game-highlights.html' ? 'results.html' : page==='videos.html' ? 'videos.html' : page.startsWith('day-') ? 'index.html#journey' : 'index.html';
    $$('a',bottom).forEach(a=>a.classList.toggle('active', a.getAttribute('href')===active));

    const dialog=document.createElement('dialog'); dialog.className='photo-lightbox'; dialog.innerHTML='<img alt="Expanded photograph"><button type="button">Close</button>'; document.body.appendChild(dialog);
    $$('figure.photo img, .scoresheet-grid img').forEach(img => {
      img.tabIndex=0;
      const open=()=>{ const full=$('img',dialog); full.src=img.currentSrc||img.src; full.alt=img.alt||'Expanded photograph'; dialog.showModal(); };
      img.addEventListener('click',open); img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
    });
    $('button',dialog).addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog) dialog.close();});
  });

  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
})();
