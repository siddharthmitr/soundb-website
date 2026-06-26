/* soundb-components.js — shared nav + footer injected on every page */

(function () {
  /* ── Determine active nav item from current filename ── */
  const page = location.pathname.split('/').pop() || 'soundb.html';
  const isHome     = page === 'soundb.html'        || page === '';
  const isReviews  = page === 'soundb-reviews.html' || page === 'soundb-review.html';
  const isGear     = page === 'soundb-gear.html';
  const isArticle  = page === 'soundb-article.html' || page === 'soundb-news.html';
  const isSpecs    = page === 'soundb-specs.html';
  const isMusic    = page === 'soundb-music.html';

  /* ── NAV HTML ── */
  const NAV = `
<header class="topbar">
  <div class="topbar-inner">
    <div class="logo" onclick="location.href='soundb.html'">soundb<span class="logo-dot"></span></div>
    <nav class="primary-nav">
      <div class="nav-item">
        <button class="nav-link ${isHome || isArticle ? 'active' : ''}" onclick="location.href='soundb-news.html'">
          News <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="dropdown">
          <div class="dropdown-inner">
            <div class="dropdown-col">
              <div class="dropdown-col-label">By Topic</div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_cat','industry');location.href='soundb-news.html?cat=industry'"><div class="dropdown-icon">◈</div><div class="dropdown-text"><strong>Industry News</strong><span>Labels, streaming, business</span></div></div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_cat','technology');location.href='soundb-news.html?cat=technology'"><div class="dropdown-icon">✦</div><div class="dropdown-text"><strong>Technology</strong><span>AI, codecs, formats</span></div></div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_cat','events');location.href='soundb-news.html?cat=events'"><div class="dropdown-icon">◉</div><div class="dropdown-text"><strong>Events &amp; Shows</strong><span>NAMM, AES, Superbooth</span></div></div>
            </div>
            <div class="dropdown-col">
              <div class="dropdown-col-label">By Type</div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_cat','breaking');location.href='soundb-news.html?cat=breaking'"><div class="dropdown-icon">▶</div><div class="dropdown-text"><strong>Breaking</strong><span>Latest updates</span></div></div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_cat','analysis');location.href='soundb-news.html?cat=analysis'"><div class="dropdown-icon">◎</div><div class="dropdown-text"><strong>Analysis</strong><span>Deep dives</span></div></div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_cat','opinion');location.href='soundb-news.html?cat=opinion'"><div class="dropdown-icon">◇</div><div class="dropdown-text"><strong>Opinion</strong><span>Columns &amp; commentary</span></div></div>
            </div>
          </div>
          <!-- Featured article — injected dynamically by CMS -->
          <div id="nav-featured-slot"></div>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-link ${isReviews ? 'active' : ''}" onclick="location.href='soundb-reviews.html'">
          Reviews <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="dropdown">
          <div class="dropdown-inner">
            <div class="dropdown-col">
              <div class="dropdown-col-label">Gear Type</div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_reviews_cat','headphones');location.href='soundb-reviews.html?cat=headphones'"><div class="dropdown-icon">◎</div><div class="dropdown-text"><strong>Headphones &amp; IEMs</strong><span>Over-ear, in-ear, wireless</span></div></div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_reviews_cat','interfaces');location.href='soundb-reviews.html?cat=interfaces'"><div class="dropdown-icon">▣</div><div class="dropdown-text"><strong>Interfaces &amp; DACs</strong><span>Recording &amp; playback</span></div></div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_reviews_cat','microphones');location.href='soundb-reviews.html?cat=microphones'"><div class="dropdown-icon">◈</div><div class="dropdown-text"><strong>Microphones</strong><span>Dynamic, condenser, ribbon</span></div></div>
            </div>
            <div class="dropdown-col">
              <div class="dropdown-col-label">More</div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_reviews_cat','speakers');location.href='soundb-reviews.html?cat=speakers'"><div class="dropdown-icon">◉</div><div class="dropdown-text"><strong>Speakers &amp; Monitors</strong><span>Studio &amp; hi-fi</span></div></div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_reviews_cat','synths');location.href='soundb-reviews.html?cat=synths'"><div class="dropdown-icon">✦</div><div class="dropdown-text"><strong>Synths &amp; Samplers</strong><span>Hardware instruments</span></div></div>
              <div class="dropdown-link" onclick="localStorage.setItem('soundb_reviews_cat','guides');location.href='soundb-reviews.html?cat=guides'"><div class="dropdown-icon">◇</div><div class="dropdown-text"><strong>Buying Guides</strong><span>Best of every category</span></div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <button class="nav-link ${isGear || isSpecs ? 'active' : ''}" onclick="location.href='soundb-gear.html'">Gear</button>
      </div>
      <div class="nav-item">
        <button class="nav-link ${isMusic ? 'active' : ''}" onclick="location.href='soundb-music.html'">Music</button>
      </div>
      <div class="nav-item">
        <button class="nav-link" onclick="location.href='soundb-music.html'">Artists <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="dropdown" style="min-width:280px">
          <div class="dropdown-inner" style="grid-template-columns:1fr">
            <div class="dropdown-col">
              <div class="dropdown-col-label">Formats</div>
              <div class="dropdown-link" onclick="location.href='soundb-article.html'"><div class="dropdown-icon">▶</div><div class="dropdown-text"><strong>Interviews</strong><span>In-depth conversations</span></div></div>
              <div class="dropdown-link" onclick="location.href='soundb-article.html'"><div class="dropdown-icon">◉</div><div class="dropdown-text"><strong>Studio Tours</strong><span>Inside the setup</span></div></div>
              <div class="dropdown-link" onclick="location.href='soundb-article.html'"><div class="dropdown-icon">◈</div><div class="dropdown-text"><strong>Album Breakdowns</strong><span>Behind the record</span></div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="nav-item"><button class="nav-link" onclick="location.href='soundb-news.html'">Podcast</button></div>
    </nav>
    <div class="nav-controls">
      <button class="icon-btn" id="search-trigger" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M12.5 12.5L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <button class="btn-subscribe" id="subscribe-btn">Subscribe</button>
      <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>

<!-- MOBILE NAV -->
<nav class="mobile-nav" id="mobile-nav">
  <div class="mobile-nav-inner">
    <div class="mobile-section">
      <div class="mobile-section-label">Navigate</div>
      <div class="mobile-link ${isHome || isArticle ? 'active' : ''}" onclick="location.href='soundb-news.html'" style="${isHome || isArticle ? 'color:var(--amber)' : ''}">News</div>
      <div class="mobile-link ${isReviews ? 'active' : ''}" onclick="location.href='soundb-reviews.html'" style="${isReviews ? 'color:var(--amber)' : ''}">Reviews</div>
      <div class="mobile-link ${isGear || isSpecs ? 'active' : ''}" onclick="location.href='soundb-gear.html'" style="${isGear || isSpecs ? 'color:var(--amber)' : ''}">Gear</div>
      <div class="mobile-link ${isMusic ? 'active' : ''}" onclick="location.href='soundb-music.html'" style="${isMusic ? 'color:var(--amber)' : ''}">Music</div>
      <div class="mobile-link" onclick="location.href='soundb-article.html'">Artists</div>
      <div class="mobile-link" onclick="location.href='soundb-news.html'">Podcast</div>
    </div>
    <button class="mobile-subscribe" id="mobile-subscribe-btn">Subscribe to Soundb</button>
  </div>
</nav>`;

  /* ── FOOTER HTML ── */
  const FOOTER = `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-logo">sound<span>b</span></div>
        <p class="footer-desc">The world's best audio technology and music publication. Independent journalism for people who take sound seriously.</p>
      </div>
      <div class="footer-col">
        <h4>Coverage</h4>
        <a onclick="location.href='soundb-news.html'" style="cursor:pointer">News</a>
        <a onclick="location.href='soundb-reviews.html'" style="cursor:pointer">Reviews</a>
        <a onclick="location.href='soundb-gear.html'" style="cursor:pointer">Gear</a>
        <a onclick="location.href='soundb-article.html'" style="cursor:pointer">Artists</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a onclick="location.href='soundb-news.html'" style="cursor:pointer">About</a>
        <a onclick="location.href='soundb-news.html'" style="cursor:pointer">Team</a>
        <a onclick="location.href='soundb-news.html'" style="cursor:pointer">Advertise</a>
        <a id="footer-nl-link" style="cursor:pointer">Newsletter</a>
      </div>
      <div class="footer-col">
        <h4>Follow</h4>
        <a href="https://twitter.com" target="_blank" rel="noopener">Twitter / X</a>
        <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
        <a href="https://youtube.com" target="_blank" rel="noopener">YouTube</a>
        <a href="https://open.spotify.com" target="_blank" rel="noopener">Spotify</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 soundb.org — All rights reserved</span>
      <span>
        <a onclick="location.href='soundb-privacy.html'" style="cursor:pointer;color:var(--muted);transition:color 0.2s" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--muted)'">Privacy</a>
        ·
        <a onclick="location.href='soundb-terms.html'" style="cursor:pointer;color:var(--muted);transition:color 0.2s" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--muted)'">Terms</a>
        ·
        <a onclick="location.href='soundb-cookies.html'" style="cursor:pointer;color:var(--muted);transition:color 0.2s" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--muted)'">Cookies</a>
      </span>
    </div>
  </div>
</footer>`;

  /* ── INJECT ── */
  // Insert nav at very top of <body>
  document.body.insertAdjacentHTML('afterbegin', NAV);

  // Insert footer just before </body> (at end of body)
  document.body.insertAdjacentHTML('beforeend', FOOTER);

  /* ── SEARCH OVERLAY ── */
  const SEARCH_HTML = `
<div class="search-overlay" id="search-overlay">
  <div class="search-header">
    <button class="search-back" id="search-close">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Close
    </button>
    <div class="search-input-wrap">
      <span class="search-icon"><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="9.5" cy="9.5" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M14 14L19 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>
      <input class="search-input" id="search-input" type="text" placeholder="Search Soundb…" autocomplete="off" spellcheck="false">
    </div>
    <button class="search-clear" id="search-clear">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
  </div>
  <div class="search-body">
    <div class="search-default" id="search-default">
      <div>
        <div class="search-section-label">Recent searches</div>
        <ul class="recent-list">
          <li class="recent-item" data-query="Spatial Audio"><span class="recent-icon"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1"/><polyline points="6.5,4 6.5,6.5 8,8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg></span><span class="recent-text">Spatial Audio</span><button class="recent-remove" aria-label="Remove">×</button></li>
          <li class="recent-item" data-query="Sennheiser HD 820"><span class="recent-icon"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1"/><polyline points="6.5,4 6.5,6.5 8,8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg></span><span class="recent-text">Sennheiser HD 820</span><button class="recent-remove" aria-label="Remove">×</button></li>
          <li class="recent-item" data-query="audio interface"><span class="recent-icon"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1"/><polyline points="6.5,4 6.5,6.5 8,8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg></span><span class="recent-text">audio interface</span><button class="recent-remove" aria-label="Remove">×</button></li>
        </ul>
      </div>
      <div>
        <div class="search-section-label">Trending now</div>
        <div class="trending-article" data-query="Spatial Audio Revolution"><div style="font-family:var(--font-mono);font-size:13px;color:var(--amber);min-width:22px">01</div><div><div class="trending-article-title">The Spatial Audio Revolution Is Here</div><div class="trending-article-meta">Cover Story · Arjun Mehta</div></div></div>
        <div class="trending-article" data-query="Shure SM7dB"><div style="font-family:var(--font-mono);font-size:13px;color:var(--amber);min-width:22px">02</div><div><div class="trending-article-title">Shure SM7dB Review</div><div class="trending-article-meta">Gear Review · Arjun Mehta</div></div></div>
        <div class="trending-article" data-query="Universal Audio Volt"><div style="font-family:var(--font-mono);font-size:13px;color:var(--amber);min-width:22px">03</div><div><div class="trending-article-title">Universal Audio Volt 476P</div><div class="trending-article-meta">Gear Review · Neel Kapoor</div></div></div>
        <div class="trending-article" data-query="Roland modular"><div style="font-family:var(--font-mono);font-size:13px;color:var(--amber);min-width:22px">04</div><div><div class="trending-article-title">Roland and Korg Joint Modular</div><div class="trending-article-meta">Breaking · Neel Kapoor</div></div></div>
      </div>
    </div>
    <div class="search-results" id="search-results">
      <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-bottom:24px" id="results-count"></div>
      <div id="results-list"></div>
    </div>
    <div class="search-results" id="no-results" style="display:none;padding-top:60px;text-align:center">
      <div style="font-family:var(--font-display);font-size:32px;font-weight:900;text-transform:uppercase;margin-bottom:8px" id="no-results-text">No results</div>
      <div style="font-family:var(--font-mono);font-size:12px;color:var(--muted)">Try a different search term</div>
    </div>
  </div>
</div>`;
  document.body.insertAdjacentHTML('beforeend', SEARCH_HTML);

  /* ── SUBSCRIBE MODAL ── */
  const MODAL_HTML = `
<div id="subscribe-modal" style="display:none;position:fixed;inset:0;z-index:600;background:rgba(10,10,11,0.92);backdrop-filter:blur(14px);align-items:center;justify-content:center;">
  <div style="background:var(--bg2);border:1px solid var(--border2);max-width:440px;width:90%;padding:40px;position:relative;">
    <button onclick="document.getElementById('subscribe-modal').style.display='none';document.body.style.overflow='';" style="position:absolute;top:16px;right:16px;background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;line-height:1;">✕</button>
    <div style="font-family:var(--font-mono);font-size:10px;color:var(--amber);text-transform:uppercase;letter-spacing:0.14em;margin-bottom:12px;">Daily Brief</div>
    <div style="font-family:var(--font-display);font-size:36px;font-weight:900;text-transform:uppercase;line-height:1;margin-bottom:8px;">Sound<span style="color:var(--amber)">b</span><br>Newsletter</div>
    <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:24px;">The most important stories in audio technology and music, delivered every morning before 9 AM. No spam, ever.</p>
    <input id="modal-email" type="email" placeholder="Your email address" style="width:100%;background:var(--bg3);border:1px solid var(--border2);color:var(--text);font-family:var(--font-body);font-size:14px;padding:13px 14px;outline:none;margin-bottom:10px;box-sizing:border-box;transition:border-color 0.2s;">
    <button id="modal-submit" style="width:100%;background:var(--amber);color:#000;font-family:var(--font-display);font-size:16px;font-weight:900;text-transform:uppercase;padding:13px;border:none;cursor:pointer;letter-spacing:0.04em;transition:background 0.2s;">Subscribe Free →</button>
    <div id="modal-success" style="display:none;text-align:center;padding:16px 0 0;font-family:var(--font-mono);font-size:12px;color:var(--green);">✓ You're subscribed! Check your inbox.</div>
    <p style="font-family:var(--font-mono);font-size:10px;color:var(--muted);margin-top:14px;text-align:center;">Join 40,000+ audio professionals and enthusiasts.</p>
  </div>
</div>`;
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  /* ── SEARCH DATABASE ──────────────────────────────────────────────────────
     CMS note: replace this array with fetch('/api/search?q='+query).
     Items need: {type, cat, title, excerpt, author, color, url}
  ── */
  const SEARCH_DB = [
    { type:'news',   cat:'Cover Story',   title:'The Spatial Audio Revolution Is Here',                    excerpt:'Dolby Atmos, Apple Spatial Audio, and Sony 360 Reality Audio are finally changing how we hear music.',    author:'Arjun Mehta',    color:'#1a0a2e', url:'soundb-article.html' },
    { type:'news',   cat:'Analysis',      title:'Dolby Atmos vs Sony 360: The $10B Format War',            excerpt:'Two competing spatial standards, thousands of conflicting masters, one confused listener.',               author:'Arjun Mehta',    color:'#1a1a0d', url:'soundb-news.html?cat=analysis' },
    { type:'news',   cat:'Industry',      title:'Why Every Major Label Is Hiring Audio AI Engineers',       excerpt:'From detection to generation, AI is reshaping every corner of music production.',                       author:'Riya Sharma',    color:'#1a0a0a', url:'soundb-news.html?cat=industry' },
    { type:'news',   cat:'Industry',      title:'The Headphone Market Is Splitting — Premium vs Everything',excerpt:'Mid-range is disappearing. Here\'s why that\'s both a crisis and an opportunity.',                      author:'Riya Sharma',    color:'#1a1a0a', url:'soundb-news.html?cat=industry' },
    { type:'news',   cat:'Technology',    title:'How AI Is Rewriting the Rules of Music Mastering',        excerpt:'From LANDR to Adobe\'s Project Music GenAI, automated mastering is no longer a toy.',                    author:'Neel Kapoor',    color:'#0a1a0d', url:'soundb-news.html?cat=technology' },
    { type:'news',   cat:'Technology',    title:'The New Codec War: LC3 vs AAC vs LDAC in 2025',           excerpt:'Bluetooth audio has never been better. The battle for the future of wireless sound.',                    author:'Dev Kapoor',     color:'#0d0a1a', url:'soundb-news.html?cat=technology' },
    { type:'news',   cat:'Breaking',      title:'Apple Acquires Spatial Audio Startup Auphonic for $340M', excerpt:'The move signals Apple\'s deepening commitment to making spatial audio the default.',                   author:'Priya Singh',    color:'#1a1a0a', url:'soundb-news.html?cat=breaking' },
    { type:'news',   cat:'Breaking',      title:'Roland and Korg Confirm Joint Modular Ecosystem',         excerpt:'Two of the biggest names in hardware are building a shared CV/Gate standard.',                          author:'Neel Kapoor',    color:'#100a1a', url:'soundb-news.html?cat=breaking' },
    { type:'news',   cat:'Events',        title:'NAMM 2025: Every Announcement That Actually Matters',      excerpt:'200+ products launched. We filtered the noise and picked the 12 that matter.',                          author:'Dev Kapoor',     color:'#0a0a1a', url:'soundb-news.html?cat=events' },
    { type:'news',   cat:'Opinion',       title:'The Death of the 3.5mm Jack Was Slower Than We Thought',  excerpt:'Four years after the last holdout dropped the port, wired audio is making a comeback.',                 author:'Arjun Mehta',    color:'#1a0a1a', url:'soundb-news.html?cat=opinion' },
    { type:'news',   cat:'Artists',       title:'AR Rahman\'s Studio Is Built Around a Philosophy',         excerpt:'Inside the most acoustically ambitious recording space in South Asia.',                                  author:'Dev Kapoor',     color:'#1a0d1a', url:'soundb-article.html' },
    { type:'review', cat:'Gear Review',   title:'Sennheiser HD 820 — The Verdict',                         excerpt:'Nine months, 400+ listening hours. Can closed-back headphones ever be truly reference-grade?',          author:'Priya Singh',    color:'#1a0a00', url:'soundb-review.html?id=1' },
    { type:'review', cat:'Gear Review',   title:'Sony WH-1000XM6: ANC Gets Uncomfortable',                 excerpt:'The best noise-cancelling headphones just got better — and more divisive.',                            author:'Priya Singh',    color:'#0d1a2e', url:'soundb-review.html?id=2' },
    { type:'review', cat:'Gear Review',   title:'Shure SM7dB Review: The Legend Gets a Preamp',            excerpt:'The SM7 capsule with a built-in gain stage changes everything about who can use this mic.',            author:'Arjun Mehta',    color:'#1a0a1a', url:'soundb-review.html?id=5' },
    { type:'review', cat:'Gear Review',   title:'Apogee Duet 3 Review: The Desktop Interface Perfected',   excerpt:'130 dB dynamic range and 32-bit capture in a palm-sized unit.',                                       author:'Dev Kapoor',     color:'#1a1a1a', url:'soundb-review.html?id=7' },
    { type:'review', cat:'Gear Review',   title:'Universal Audio Volt 476P Review',                         excerpt:'Four channels of UA 76-style compression in a bus-powered package.',                                   author:'Neel Kapoor',    color:'#020c18', url:'soundb-review.html?id=25' },
    { type:'review', cat:'Gear Review',   title:'Teenage Engineering EP-133 K.O. II',                       excerpt:'The groovebox that broke the internet is now shipping.',                                               author:'Arjun Mehta',    color:'#0a0a1a', url:'soundb-review.html?id=9' },
    { type:'review', cat:'Gear Review',   title:'Sennheiser MOMENTUM 4 Review',                             excerpt:'60-hour battery, audiophile tuning, and premium build at a mainstream price.',                        author:'Dev Kapoor',     color:'#0a1a0a', url:'soundb-review.html?id=4' },
    { type:'review', cat:'Gear Review',   title:'Shure MV7+ Review: The Podcaster\'s Best Friend',          excerpt:'USB/XLR hybrid with built-in headphone output. The podcaster\'s best friend.',                         author:'Priya Singh',    color:'#0a0a1a', url:'soundb-review.html?id=6' },
    { type:'review', cat:'Buying Guide',  title:'Best Headphones Under ₹30,000 in 2025',                   excerpt:'Nine headphones tested. Three deserve your money.',                                                    author:'Soundb Editors', color:'#1a1a0a', url:'soundb-reviews.html?cat=guides' },
    { type:'gear',   cat:'Gear',          title:'Sennheiser HD 820',                                        excerpt:'Closed-back reference headphone. Ring radiator driver. 300 Ω.',                                      author:'Sennheiser',     color:'#1a0a00', url:'soundb-specs.html?id=1' },
    { type:'gear',   cat:'Gear',          title:'Sony WH-1000XM6',                                          excerpt:'Wireless ANC headphones with QN3 chip, LDAC, 30-hour battery.',                                      author:'Sony',           color:'#0d1a2e', url:'soundb-specs.html?id=2' },
    { type:'gear',   cat:'Gear',          title:'Shure SM7dB',                                              excerpt:'Dynamic cardioid microphone with built-in switchable preamp. Up to +28 dB gain.',                    author:'Shure',          color:'#1a0a1a', url:'soundb-specs.html?id=5' },
    { type:'gear',   cat:'Gear',          title:'Apogee Duet 3',                                            excerpt:'2-channel USB-C audio interface. 130 dB dynamic range. 32-bit / 192 kHz.',                          author:'Apogee',         color:'#1a1a1a', url:'soundb-specs.html?id=7' },
    { type:'gear',   cat:'Gear',          title:'Universal Audio Volt 476P',                                 excerpt:'4-channel USB-C interface with 76-style onboard compression on every preamp.',                       author:'Universal Audio', color:'#020c18', url:'soundb-specs.html?id=25' },
    { type:'gear',   cat:'Gear',          title:'Teenage Engineering EP-133 K.O. II',                       excerpt:'Portable sampler and groovebox with built-in speaker and tactile pads.',                             author:'Teenage Engineering', color:'#1a1a0a', url:'soundb-specs.html?id=9' },
    { type:'gear',   cat:'Gear',          title:'Sennheiser IE 900',                                        excerpt:'Flagship in-ear monitor with single dynamic driver and X3R resonator system.',                       author:'Sennheiser',     color:'#1a0500', url:'soundb-specs.html?id=13' },
    { type:'gear',   cat:'Gear',          title:'Teenage Engineering OP-XY',                                excerpt:'Chord-based portable synthesizer. New paradigm in portable synthesis.',                               author:'Teenage Engineering', color:'#0a0a0a', url:'soundb-specs.html?id=10' },
    { type:'gear',   cat:'Gear',          title:'Sennheiser MOMENTUM 4',                                    excerpt:'Wireless over-ear headphones. 60-hour battery. Audiophile tuning.',                                  author:'Sennheiser',     color:'#0a1a0a', url:'soundb-specs.html?id=4' },
    { type:'gear',   cat:'Gear',          title:'Roland Jupiter-X',                                         excerpt:'Multi-model synthesizer featuring five legendary Roland sound engines.',                              author:'Roland',         color:'#1a0a0a', url:'soundb-specs.html?id=11' },
  ];

  const TYPE_LABEL = { news:'News', review:'Review', gear:'Gear' };
  const TYPE_COLOR = { news:'var(--amber)', review:'#4080FF', gear:'#40C080' };

  /* ── SEARCH LOGIC ── */
  const searchOverlay = document.getElementById('search-overlay');
  const searchInp     = document.getElementById('search-input');
  const searchClear   = document.getElementById('search-clear');
  const searchDefault = document.getElementById('search-default');
  const searchResults = document.getElementById('search-results');
  const noResults     = document.getElementById('no-results');
  let searchTimer;

  function openSearch() {
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { searchInp.focus(); }, 60);
  }
  function closeSearch() {
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
    searchInp.blur(); // must blur first — otherwise '/' shortcut stays blocked
    searchInp.value = '';
    searchClear.classList.remove('visible');
    searchDefault.classList.remove('hidden');
    searchResults.classList.remove('visible');
    noResults.style.display = 'none';
    clearTimeout(searchTimer);
  }

  function hlSearch(text, q) {
    var esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('(' + esc + ')', 'gi'), '<mark>$1</mark>');
  }

  function runSearch(q) {
    var matches = SEARCH_DB.filter(function(a) {
      return [a.title, a.cat, a.excerpt, a.author].some(function(f) {
        return f.toLowerCase().includes(q.toLowerCase());
      });
    });
    searchDefault.classList.add('hidden');
    if (!matches.length) {
      searchResults.classList.remove('visible');
      noResults.style.display = 'block';
      document.getElementById('no-results-text').textContent = 'No results for "' + q + '"';
      return;
    }
    noResults.style.display = 'none';
    searchResults.classList.add('visible');
    document.getElementById('results-count').innerHTML = '<strong>' + matches.length + '</strong> result' + (matches.length !== 1 ? 's' : '') + ' for "' + q + '"';
    document.getElementById('results-list').innerHTML = matches.map(function(a) {
      var tl = TYPE_LABEL[a.type] || a.type;
      var tc = TYPE_COLOR[a.type] || 'var(--amber)';
      return '<div class="result-item" onclick="location.href=\'' + a.url + '\'">' +
        '<div class="result-thumb"><svg width="80" height="56" viewBox="0 0 80 56"><rect width="80" height="56" fill="' + a.color + '"/><circle cx="40" cy="28" r="14" fill="none" stroke="#FF8C00" stroke-width="0.5" opacity="0.5"/><circle cx="40" cy="28" r="5" fill="#FF8C00" opacity="0.3"/></svg></div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">' +
            '<span style="font-family:var(--font-mono);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;padding:2px 7px;background:' + tc + ';color:#000">' + tl + '</span>' +
            '<span class="result-cat">' + a.cat + '</span>' +
          '</div>' +
          '<div class="result-title">' + hlSearch(a.title, q) + '</div>' +
          '<div class="result-excerpt">' + a.excerpt + '</div>' +
          '<div class="result-meta">' + a.author + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  document.getElementById('search-trigger').addEventListener('click', openSearch);
  document.getElementById('search-close').addEventListener('click', closeSearch);

  searchInp.addEventListener('input', function() {
    var q = searchInp.value.trim();
    searchClear.classList.toggle('visible', q.length > 0);
    clearTimeout(searchTimer);
    if (!q) {
      searchDefault.classList.remove('hidden');
      searchResults.classList.remove('visible');
      noResults.style.display = 'none';
      return;
    }
    searchTimer = setTimeout(function() { runSearch(q); }, 180);
  });

  searchClear.addEventListener('click', function() {
    searchInp.value = '';
    searchInp.focus();
    searchClear.classList.remove('visible');
    searchDefault.classList.remove('hidden');
    searchResults.classList.remove('visible');
    noResults.style.display = 'none';
  });

  document.querySelectorAll('.recent-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      if (e.target.classList.contains('recent-remove')) return;
      searchInp.value = item.dataset.query;
      searchClear.classList.add('visible');
      runSearch(item.dataset.query);
    });
  });
  document.querySelectorAll('.recent-remove').forEach(function(btn) {
    btn.addEventListener('click', function(e) { e.stopPropagation(); btn.closest('.recent-item').remove(); });
  });
  document.querySelectorAll('.trending-article').forEach(function(item) {
    item.addEventListener('click', function() {
      searchInp.value = item.dataset.query;
      searchClear.classList.add('visible');
      runSearch(item.dataset.query);
    });
  });
  searchOverlay.addEventListener('click', function(e) {
    if (e.target === searchOverlay) closeSearch();
  });

  /* ── SUBSCRIBE MODAL LOGIC ── */
  function openSubscribeModal() {
    document.getElementById('subscribe-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(function() { document.getElementById('modal-email').focus(); }, 60);
  }
  function closeSubscribeModal() {
    document.getElementById('subscribe-modal').style.display = 'none';
    document.body.style.overflow = '';
  }

  document.getElementById('subscribe-btn').addEventListener('click', openSubscribeModal);
  document.getElementById('mobile-subscribe-btn').addEventListener('click', openSubscribeModal);

  var fnl = document.getElementById('footer-nl-link');
  if (fnl) fnl.addEventListener('click', openSubscribeModal);

  document.getElementById('modal-submit').addEventListener('click', function() {
    var email = document.getElementById('modal-email').value.trim();
    var input = document.getElementById('modal-email');
    if (!email || !email.includes('@')) { input.style.borderColor = 'var(--red)'; input.focus(); return; }
    input.style.borderColor = '';
    document.getElementById('modal-submit').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
    setTimeout(function() {
      closeSubscribeModal();
      document.getElementById('modal-submit').style.display = 'block';
      document.getElementById('modal-success').style.display = 'none';
      document.getElementById('modal-email').value = '';
    }, 2800);
  });
  document.getElementById('subscribe-modal').addEventListener('click', function(e) {
    if (e.target === this) closeSubscribeModal();
  });

  /* ── KEYBOARD SHORTCUTS ── */
  document.addEventListener('keydown', function(e) {
    var tag = document.activeElement.tagName;
    var inInput = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable;
    var searchOpen = searchOverlay.classList.contains('open');
    var modalOpen  = document.getElementById('subscribe-modal').style.display === 'flex';

    if (e.key === '/' && !searchOpen && !modalOpen && !inInput) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      if (searchOpen)  { e.preventDefault(); closeSearch(); }
      else if (modalOpen) { e.preventDefault(); closeSubscribeModal(); }
    }
  });

  /* ── HAMBURGER ── */
  document.getElementById('hamburger').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('mobile-nav').classList.toggle('open');
    document.body.style.overflow = document.getElementById('mobile-nav').classList.contains('open') ? 'hidden' : '';
  });
  /* ── FEATURED ARTICLE IN NAV DROPDOWN ── */
  window.setSoundbFeatured = function(article) {
    var slot = document.getElementById('nav-featured-slot');
    if (!slot || !article) return;
    slot.innerHTML =
      '<div class="dropdown-featured" onclick="window.location.href=\'soundb-article?id=' + article.id + '\'">' +
        '<div class="dropdown-featured-img"><svg width="72" height="50" viewBox="0 0 72 50">' +
          '<rect width="72" height="50" fill="' + (article.color||'#1A1A1F') + '"/>' +
          '<circle cx="36" cy="25" r="14" fill="none" stroke="#FF8C00" stroke-width="0.5" opacity="0.7"/>' +
          '<circle cx="36" cy="25" r="5" fill="#FF8C00" opacity="0.4"/></svg></div>' +
        '<div><div class="dropdown-featured-eyebrow">Featured Story</div>' +
        '<div class="dropdown-featured-title">' + article.title + '</div></div>' +
      '</div>';
  };

  /* ── AUTO-FETCH FEATURED FOR NAV — runs on every page ── */
  setTimeout(function() {
    if (typeof CMS === 'undefined') return;
    CMS.getArticles([]).then(function(articles) {
      if (!articles || !articles.length) return;
      var pick = articles.find(function(a) { return a.featured; }) || articles[0];
      if (pick) window.setSoundbFeatured(pick);
    }).catch(function(){});
  }, 100);

})();
