/**
 * soundb-cms.js — Headless CMS Adapter Layer v2
 * ─────────────────────────────────────────────────────────────────────────────
 * Connects Soundb frontend to Strapi v5.
 * Falls back to local data silently if Strapi is unreachable.
 *
 * CHANGE LOG v2:
 *   - Better error reporting (tells you exactly what went wrong)
 *   - CORS-safe fetch with explicit headers
 *   - Strapi v5 field shape confirmed (flat, no .attributes wrapper)
 *   - AbortSignal.timeout() replaced with manual controller for broader support
 *   - Added CMS.debug() helper — call it in console to diagnose issues
 * ─────────────────────────────────────────────────────────────────────────────
 */

const CMS = (function () {

  /* ── CONFIG ── */
  const config = {
    baseUrl: 'http://localhost:1337',
    timeout: 5000,
    debug:   true,
  };

  let MODE = 'local';

  function log(type, msg) {
    if (!config.debug) return;
    const style = type === 'ok'   ? 'color:#1DB954;font-weight:bold'
                : type === 'err'  ? 'color:#FF4040;font-weight:bold'
                : type === 'warn' ? 'color:#FF8C00;font-weight:bold'
                :                   'color:#888';
    console.log('%c[Soundb CMS] ' + msg, style);
  }

  /* ── CORE FETCH ── */
  async function fetchData(endpoint, fallback, options) {
    options = options || {};

    let url = config.baseUrl + endpoint;
    const params = Object.assign(
      { 'pagination[limit]': 100 },
      options.params || {}
    );
    const qs = Object.entries(params)
      .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
      .join('&');
    if (qs) url += '?' + qs;

    log('info', 'Fetching → ' + url);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeout);

      const res = await fetch(url, {
        signal:  controller.signal,
        method:  'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new Error('HTTP ' + res.status + ' ' + res.statusText +
          (res.status === 403 ? ' — check Public role permissions in Strapi Settings → Roles → Public' :
           res.status === 404 ? ' — endpoint not found, check content type name in Strapi' : ''));
      }

      const json = await res.json();

      // Strapi v5: data is array for lists, object for single
      const items = Array.isArray(json.data) ? json.data : [json.data];
      MODE = 'live';
      log('ok', '✓ ' + endpoint + ' — ' + items.length + ' item(s) from Strapi');
      return { source: 'cms', data: items, meta: json.meta || {} };

    } catch (err) {
      MODE = 'local';

      if (err.name === 'AbortError') {
        log('err', '✗ ' + endpoint + ' — timed out after ' + config.timeout + 'ms (is Strapi running at ' + config.baseUrl + '?)');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        log('err', '✗ ' + endpoint + ' — cannot reach Strapi. Check: 1) Strapi is running  2) CORS allows ' + location.origin + '  3) baseUrl is correct');
      } else {
        log('err', '✗ ' + endpoint + ' — ' + err.message);
      }

      const fbCount = Array.isArray(fallback) ? fallback.length
                    : fallback && typeof fallback === 'object' ? Object.keys(fallback).length
                    : 0;
      log('warn', '↩ Using local fallback (' + fbCount + ' items)');
      return { source: 'local', data: fallback, meta: {} };
    }
  }

  /* ── FIELD MAPPERS ── */

  function mapGearProduct(item, source) {
    if (source === 'local') return item;

    // Parse specsData JSON if stored as string
    var specsData = item.specsData || null;
    if (typeof specsData === 'string') {
      try { specsData = JSON.parse(specsData); } catch(e) { specsData = null; }
    }

    // Parse JSON review fields
    function parseJ(val) {
      if (!val) return null;
      if (typeof val !== 'string') return val;
      try { return JSON.parse(val); } catch(e) { return null; }
    }

    // Compute score from specsData.scoreBars average
    var score = item.score || null;
    if (specsData && specsData.scoreBars && specsData.scoreBars.length) {
      var sum = specsData.scoreBars.reduce(function(acc, b) { return acc + Number(b.v); }, 0);
      score = Math.round((sum / specsData.scoreBars.length) * 10) / 10;
    }

    // Map scoreBars to review scores format
    var scores = [];
    if (specsData && specsData.scoreBars) {
      scores = specsData.scoreBars.map(function(b) {
        var v = Number(b.v);
        return { label: b.l, val: v, tier: v >= 8.5 ? 'high' : v >= 7 ? 'mid' : 'low' };
      });
    }

    // Author initials
    var author = item.author || 'Soundb Editors';
    var authorInitials = author.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();

    return {
      // ── Core product fields ──
      id:        item.id,
      name:      item.name,
      brand:     item.brand,
      cat:       item.category,
      subcat:    item.subcat || item.category || '',
      price:     item.price,
      score:     score,
      badge:     item.badge || null,
      reviewed:  item.reviewed || false,
      new:       item.isNew || false,
      justLaunched: item.justLaunched || false,
      desc:      item.desc || '',
      color1:    item.color1 || '#1a1a1a',
      color2:    item.color2 || '#FF8C00',
      specsData: specsData,

      // ── From specsData ──
      scores:    scores,
      // Flatten specsData.specs sections into flat [key,val] pairs for review page
      specs: (function() {
        if (!specsData || !specsData.specs) return [];
        var flat = [];
        specsData.specs.forEach(function(sec) {
          if (sec.rows) sec.rows.forEach(function(row) { flat.push(row); });
        });
        return flat;
      })(),
      specssections: (specsData && specsData.specs) || [],
      pros:      (specsData && specsData.pros)      || [],
      cons:      (specsData && specsData.cons)      || [],

      // ── Review written content ──
      headline:          item.headline || item.name,
      deck:              item.deck     || item.desc || '',
      intro:             parseJ(item.intro)             || [],
      sound:             parseJ(item.sound)             || [],
      pullquote: (function() {
        var pq = parseJ(item.pullquote) || {};
        return {
          text: pq.text || '',
          // Auto-build cite from author if not explicitly set in Strapi
          cite: pq.cite || ('— ' + (item.author || 'Soundb Editors') + (item.authorRole ? ', ' + item.authorRole : '')),
        };
      })(),
      build:             item.build    || '',
      verdict:           item.verdict  || '',
      verdictLabel:      item.verdictLabel || '',
      comparesIntro:     item.comparesIntro || '',
      comparisonHeaders: parseJ(item.comparisonHeaders) || [],
      comparisonRows:    parseJ(item.comparisonRows)    || [],
      tags:              parseJ(item.tags)              || [],

      // ── Review author fields ──
      author:         author,
      authorRole:     item.authorRole     || 'Reviewer',
      authorInitials: authorInitials,
      date:           item.date
                        ? new Date(item.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
                        : '',
      readTime:       item.readTime  || '',
      tested:         item.tested    || '',
      hours:          item.hours     || '',
    };
  }

  function mapGearReview(item, source) {
    if (source === 'local') return item;
    return {
      id:             item.id,
      name:           item.name,
      brand:          item.brand,
      cat:            item.category,
      subcat:         item.subcat || '',
      badge:          item.badge || null,
      score:          item.score,
      price:          item.price,
      color1:         item.color1 || '#1a1a1a',
      color2:         item.color2 || '#FF8C00',
      author:         item.author || 'Soundb Editors',
      authorRole:     item.authorRole || 'Reviewer',
      authorInitials: (item.author || 'SE').split(' ').map(function(w){return w[0];}).join('').slice(0,2),
      date:           item.date || '',
      readTime:       item.readTime || '',
      tested:         item.tested || '',
      hours:          item.hours || '',
      headline:       item.headline || item.name,
      deck:           item.deck || '',
      scores:         item.scores || [],
      intro:          item.intro || [],
      sound:          item.sound || [],
      pullquote:      item.pullquote || { text: '', cite: '' },
      build:          item.build || '',
      pros:           item.pros || [],
      cons:           item.cons || [],
      comparesIntro:     item.comparesIntro || '',
      comparisonLabel:   item.comparisonLabel || '',
      comparisonHeaders: item.comparisonHeaders || [],
      comparisonRows:    item.comparisonRows || [],
      specs:          item.specs || [],
      verdict:        item.verdict || '',
      verdictLabel:   item.verdictLabel || '',
      tags:           item.tags || [],
      gearProductId:  item.gearProductId || null,
    };
  }

  /* ── Strapi v5 Rich Text (Blocks) → HTML string ─────────────────────────
     Strapi v5 stores rich text as a block array, not a plain string.
     This converter handles the common block types used in editorial content.
     CMS note: if you switch to a Markdown or plain-text field, remove this.
  ── */
  function blocksToHTML(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';
    return blocks.map(function(block) {
      var text = (block.children || []).map(function(child) {
        var t = child.text || '';
        if (child.bold)          t = '<strong>' + t + '</strong>';
        if (child.italic)        t = '<em>' + t + '</em>';
        if (child.underline)     t = '<u>' + t + '</u>';
        if (child.code)          t = '<code>' + t + '</code>';
        if (child.type === 'link') t = '<a href="' + (child.url||'#') + '">' + t + '</a>';
        return t;
      }).join('');

      switch (block.type) {
        case 'paragraph':  return text ? '<p>' + text + '</p>' : '';
        case 'heading':    var lvl = block.level || 2; return '<h' + lvl + '>' + text + '</h' + lvl + '>';
        case 'list':
          var tag = block.format === 'ordered' ? 'ol' : 'ul';
          var items = (block.children || []).map(function(li) {
            return '<li>' + (li.children||[]).map(function(c){return c.text||'';}).join('') + '</li>';
          }).join('');
          return '<' + tag + '>' + items + '</' + tag + '>';
        case 'quote':      return '<blockquote>' + text + '</blockquote>';
        case 'code':       return '<pre><code>' + text + '</code></pre>';
        case 'image':      return block.image ? '<img src="' + block.image.url + '" alt="' + (block.image.alternativeText||'') + '">' : '';
        default:           return text ? '<p>' + text + '</p>' : '';
      }
    }).filter(Boolean).join('\n');
  }

  // Category slug → display label map (mirrors CAT_META in soundb-news.html)
  // CMS note: if you add new categories in Strapi, add them here too.
  var CAT_LABELS_NEWS = {
    industry:   'Industry News',
    technology: 'Technology',
    events:     'Events & Shows',
    breaking:   'Breaking',
    analysis:   'Analysis',
    opinion:    'Opinion',
    artists:    'Artists',
  };

  function mapArticle(item, source) {
    if (source === 'local') return item;
    var cat = item.category || '';
    return {
      id:       item.id,
      cat:      cat,
      label:    CAT_LABELS_NEWS[cat] || cat,   // ← what the badge displays
      coverStory: item.coverStory || false,     // ← boolean, separate from category
      title:    item.title || '',
      excerpt:  (item.excerpt || '').split('\n')[0].trim(),  // take first line only, trim whitespace
      body:     Array.isArray(item.body) ? blocksToHTML(item.body) : (item.body || ''),
      author:   item.author || 'Soundb Editors',
      date:     item.date
                  ? new Date(item.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
                  : '',
      read:     item.readTime || '',           // ← news page uses 'read' not 'readTime'
      readTime: item.readTime || '',
      featured: item.featured || false,
      popular:  item.popular || 0,
      color:    item.color || '#0a0d1a',
      slug:     item.slug || String(item.id),
      tags:     Array.isArray(item.tags) ? item.tags : [],
    };
  }

  function mapReview(item, source) {
    if (source === 'local') return item;
    return {
      id:      item.id,
      cat:     item.category,
      label:   item.subcat || item.category,
      name:    item.name,
      brand:   item.brand,
      score:   item.score,
      price:   item.price,
      badge:   item.badge || null,
      date:    item.date
                 ? new Date(item.date).toLocaleDateString('en-IN', { month:'long', year:'numeric' })
                 : '',
      author:  item.author || '',
      read:    item.readTime || '',
      verdict: item.verdict || '',
      color:   item.color1 || '#1a1a1a',
      specsId: item.gearProductId || item.id,
    };
  }

  function mapMusicReview(item, source) {
    if (source === 'local') return item;
    return {
      album:   item.album,
      artist:  item.artist,
      genre:   item.genre || '',
      score:   item.score,
      summary: item.summary || '',
      c1:      item.color1 || '#1a1a1a',
      c2:      item.color2 || '#FF8C00',
      sp:      item.spotifyUrl || 'https://open.spotify.com',
      am:      item.appleMusicUrl || 'https://music.apple.com',
      yt:      item.youtubeUrl || 'https://youtube.com',
    };
  }

  function mapMusicTrack(item, source) {
    if (source === 'local') return item;
    return {
      rank:   item.rank,
      title:  item.title,
      artist: item.artist,
      album:  item.album || '',
      genre:  item.genre || '',
      plays:  item.plays || '',
      isNew:  item.isNew || false,
      c1:     item.color1 || '#1a1a1a',
      c2:     item.color2 || '#FF8C00',
      sp:     item.spotifyUrl || 'https://open.spotify.com',
      am:     item.appleMusicUrl || 'https://music.apple.com',
      yt:     item.youtubeUrl || 'https://youtube.com',
    };
  }

  /* ── PUBLIC API ── */
  return {

    config,
    get mode() { return MODE; },

    /* Gear Products */
    getGear: async function(fallback) {
      const res = await fetchData('/api/gear-products', fallback, {
        params: { 'sort': 'name:asc' }
      });
      if (res.source === 'local') return fallback;
      return res.data.map(function(item) { return mapGearProduct(item, 'cms'); });
    },

    /* Gear Reviews — returns keyed object {id: review} for review page */
    getGearReviews: async function(fallback) {
      const res = await fetchData('/api/gear-reviews', fallback, {
        params: { 'sort': 'date:desc' }
      });
      if (res.source === 'local') return fallback;
      const mapped = {};
      res.data.forEach(function(item) {
        mapped[item.id] = mapGearReview(item, 'cms');
      });
      return mapped;
    },

    /* Articles */
    getArticles: async function(fallback, options) {
      options = options || {};
      const params = { 'pagination[limit]': 100, 'sort': 'date:desc' };
      if (options.cat) params['filters[category][$eq]'] = options.cat;
      const res = await fetchData('/api/articles', fallback, { params });
      if (res.source === 'local') return fallback;
      const mapped = res.data.map(function(item) { return mapArticle(item, 'cms'); });
      // Sort: coverStory:true first → featured:true next → date:desc (from Strapi)
      // coverStory is the homepage hero, featured is the news page hero
      mapped.sort(function(a, b) {
        if (a.coverStory && !b.coverStory) return -1;
        if (!a.coverStory && b.coverStory) return 1;
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      return mapped;
    },

    /* Reviews listing */
    getReviews: async function(fallback, options) {
      options = options || {};
      const params = { 'sort': 'date:desc' };
      if (options.cat) params['filters[category][$eq]'] = options.cat;
      const res = await fetchData('/api/gear-reviews', fallback, { params });
      if (res.source === 'local') return fallback;
      return res.data.map(function(item) { return mapReview(item, 'cms'); });
    },

    /* Music Reviews */
    getMusicReviews: async function(fallback) {
      const res = await fetchData('/api/music-reviews', fallback, {
        params: { 'pagination[limit]': 100 }
      });
      if (res.source === 'local') return fallback;
      return res.data.map(function(item) { return mapMusicReview(item, 'cms'); });
    },

    /* Music Tracks */
    getMusicTracks: async function(fallback, options) {
      options = options || {};
      const params = { 'sort': 'rank:asc' };
      if (options.region)    params['filters[region][$eq]']    = options.region;
      if (options.chartType) params['filters[chartType][$eq]'] = options.chartType;
      if (options.genre)     params['filters[genre][$eq]']     = options.genre;
      const res = await fetchData('/api/music-tracks', fallback, { params });
      if (res.source === 'local') return fallback;
      return res.data.map(function(item) { return mapMusicTrack(item, 'cms'); });
    },

    /* Search — local only until Strapi search plugin installed */
    search: async function(fallback) {
      log('info', 'Search using local index (add Strapi search plugin for CMS-driven search)');
      return fallback;
    },

    /* ── DEBUG HELPER ────────────────────────────────────────────────────
       Call CMS.debug() in browser console to diagnose connection issues.
    ── */
    debug: async function() {
      console.group('[Soundb CMS] Debug Report');
      console.log('Base URL:  ', config.baseUrl);
      console.log('Mode:      ', MODE);
      console.log('Page:      ', location.href);

      // Test basic connectivity
      try {
        const res = await fetch(config.baseUrl + '/', { method: 'GET' });
        console.log('Strapi reachable:', res.ok, '(status ' + res.status + ')');
      } catch (e) {
        console.error('Strapi NOT reachable:', e.message);
        console.log('Fix: make sure Strapi is running (npm run develop in soundb-cms folder)');
      }

      // Test each endpoint
      const endpoints = [
        '/api/articles',
        '/api/gear-products',
        '/api/gear-reviews',
        '/api/music-reviews',
        '/api/music-tracks',
      ];
      for (const ep of endpoints) {
        try {
          const res = await fetch(config.baseUrl + ep + '?pagination[limit]=1');
          const json = await res.json();
          const count = json.meta && json.meta.pagination ? json.meta.pagination.total : '?';
          console.log(res.ok ? '✓' : '✗', ep, '→', res.status, '| total:', count);
          if (res.status === 403) {
            console.warn('  → 403: Go to Strapi Settings → Roles → Public → enable find for this type');
          }
        } catch (e) {
          console.error('✗', ep, '→', e.message);
        }
      }

      console.log('CORS origin allowed:', location.origin);
      console.log('If you see CORS errors above, add ' + location.origin + ' to middlewares.js in your Strapi config');
      console.groupEnd();
    },

  };

})();
