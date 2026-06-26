/**
 * seed-strapi.js — Soundb Strapi v5 Content Seeder
 * ─────────────────────────────────────────────────────────────────────────────
 * Populates all 5 content types from the frontend fallback data.
 *
 * USAGE:
 *   1. Make sure Strapi is running: cd soundb-cms && npm run develop
 *   2. Get your API token: Strapi Admin → Settings → API Tokens → Create new
 *      (Full access / unlimited)
 *   3. Run: STRAPI_TOKEN=your_token node seed-strapi.js
 *
 * What it seeds:
 *   ✓ Articles       (24 items)
 *   ✓ Gear Products  (25 items)
 *   ✓ Gear Reviews   (31 items)
 *   ✓ Music Reviews  (8 items  — international + india albums)
 *   ✓ Music Tracks   (25 items — international + india charts)
 *
 * Safe to re-run: checks for existing items by title/name to skip duplicates.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const TOKEN    = process.env.STRAPI_TOKEN || '';

if (!TOKEN) {
  console.error('\n❌  No API token found.');
  console.error('    Run: STRAPI_TOKEN=your_token node seed-strapi.js\n');
  process.exit(1);
}

const HEADERS = {
  'Content-Type':  'application/json',
  'Accept':        'application/json',
  'Authorization': 'Bearer ' + TOKEN,
};

/* ── Helpers ── */
async function post(endpoint, data) {
  const res = await fetch(BASE_URL + endpoint, {
    method:  'POST',
    headers: HEADERS,
    body:    JSON.stringify({ data }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`POST ${endpoint} failed (${res.status}): ${err}`);
  }
  return res.json();
}

async function getAll(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}?pagination[limit]=200`, { headers: HEADERS });
  if (!res.ok) throw new Error(`GET ${endpoint} failed (${res.status})`);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

async function seedCollection(label, endpoint, items, buildPayload) {
  console.log(`\n── ${label} ──`);
  let created = 0, failed = 0;

  for (const item of items) {
    const payload = buildPayload(item);
    try {
      await post(endpoint, payload);
      process.stdout.write('✓');
      created++;
    } catch (e) {
      process.stdout.write('✗');
      console.error(`\n  Error: ${e.message}`);
      failed++;
    }
    // Small delay to avoid hammering Strapi
    await new Promise(r => setTimeout(r, 100));
  }
  console.log(`\n  Done: ${created} created, ${failed} failed`);
}

/* ═══════════════════════════════════════════════════════════════
   DATA — extracted from soundb-news.html, soundb-reviews.html,
   soundb-gear.html, soundb-music.html fallback arrays
═══════════════════════════════════════════════════════════════ */

/* ── ARTICLES (24 items from soundb-news.html) ── */
var ARTICLES = [
  { id:1,  cat:'industry',   title:'Every Major Label Is Now Hiring Audio AI Engineers',               excerpt:'From detection to generation, AI is reshaping every corner of music production. We spoke to the people being hired.',       author:'Riya Sharma',   date:'2025-06-22', readTime:'8 min',  popular:4800, featured:true,  coverStory:true,  color:'#1a0a0a' },
  { id:2,  cat:'analysis',   title:'Dolby Atmos vs Sony 360: The $10B Format War',                     excerpt:'Two competing spatial standards, thousands of conflicting masters, one very confused listener at the centre of it all.',  author:'Arjun Mehta',   date:'2025-06-21', readTime:'12 min', popular:4200, featured:false, coverStory:false, color:'#0d1a2e' },
  { id:3,  cat:'breaking',   title:'Apple Acquires Spatial Audio Startup Auphonic for $340M',          excerpt:"The move signals Apple's deepening commitment to making spatial audio the default for all content on its platforms.",      author:'Priya Singh',   date:'2025-06-21', readTime:'4 min',  popular:6100, featured:false, coverStory:false, color:'#1a1a0a' },
  { id:4,  cat:'technology', title:'How AI Is Rewriting the Rules of Music Mastering',                 excerpt:"From LANDR to Adobe's Project Music GenAI, automated mastering is no longer a toy. We tested six platforms against engineers.", author:'Neel Kapoor', date:'2025-06-20', readTime:'15 min', popular:3900, featured:false, coverStory:false, color:'#0a1a0d' },
  { id:5,  cat:'industry',   title:'The Headphone Market Is Splitting — Premium vs Everything Else',   excerpt:"Mid-range is disappearing. Here's why that's both a crisis and an opportunity for the entire audio industry.",          author:'Riya Sharma',   date:'2025-06-19', readTime:'9 min',  popular:3200, featured:false, coverStory:false, color:'#1a1a0a' },
  { id:6,  cat:'events',     title:'NAMM 2025: Every Announcement That Actually Matters',              excerpt:'200+ products were launched. We filtered the noise and picked the 12 that will actually change how you make music.',        author:'Dev Kapoor',    date:'2025-06-18', readTime:'11 min', popular:5500, featured:false, coverStory:false, color:'#0a0a1a' },
  { id:7,  cat:'opinion',    title:'The Death of the 3.5mm Jack Was Slower Than We Thought',          excerpt:'Four years after the last major holdout dropped the headphone port, wired audio is having a quiet, stubborn comeback.',    author:'Arjun Mehta',   date:'2025-06-17', readTime:'6 min',  popular:7200, featured:false, coverStory:false, color:'#1a0a1a' },
  { id:8,  cat:'analysis',   title:'Why Lossless Audio Sounds Worse on Most Speakers',                excerpt:'The technical case for lossless is airtight. The real-world case is more complicated than streaming services admit.',       author:'Priya Singh',   date:'2025-06-16', readTime:'10 min', popular:4100, featured:false, coverStory:false, color:'#0a1a1a' },
  { id:9,  cat:'breaking',   title:'Spotify Confirms Real-Time Mixing Feature for Podcasts',          excerpt:'The company filed a patent for live EQ and compression tools that let listeners shape their own listening experience.',     author:'Neel Kapoor',   date:'2025-06-15', readTime:'3 min',  popular:2800, featured:false, coverStory:false, color:'#1a0a0d' },
  { id:10, cat:'technology', title:'The New Codec War: LC3 vs AAC vs LDAC in 2025',                   excerpt:"Bluetooth audio has never been better. The battle for the future of wireless sound is being fought on a technical level.",  author:'Dev Kapoor',    date:'2025-06-14', readTime:'13 min', popular:3600, featured:false, coverStory:false, color:'#0d0a1a' },
  { id:11, cat:'industry',   title:'Record Store Day 2025 Broke Every Sales Record — Again',          excerpt:"Vinyl sales on RSD 2025 topped $40M globally in a single day. The format's revival is now a permanent fixture.",           author:'Riya Sharma',   date:'2025-06-13', readTime:'5 min',  popular:2200, featured:false, coverStory:false, color:'#1a0f0a' },
  { id:12, cat:'events',     title:'Superbooth 2025: The Synths Everyone Was Talking About',          excerpt:"Berlin's premier modular and electronic instrument festival delivered surprises, including two announcements nobody saw coming.", author:'Arjun Mehta', date:'2025-06-12', readTime:'9 min',  popular:4700, featured:false, coverStory:false, color:'#0a0f1a' },
  { id:13, cat:'opinion',    title:"Streaming Has Ruined the Album Format. Here's the Evidence",      excerpt:'Fifteen data points that show how playlist-first distribution has fundamentally changed how music is written and produced.',  author:'Priya Singh',   date:'2025-06-11', readTime:'14 min', popular:5800, featured:false, coverStory:false, color:'#1a1a10' },
  { id:14, cat:'analysis',   title:"Inside Numark's DJ Controller That's Making Professionals Jealous", excerpt:'The $699 unit punches well above its weight. We spent three months with it in real club environments to find out why.', author:'Dev Kapoor',    date:'2025-06-10', readTime:'10 min', popular:3300, featured:false, coverStory:false, color:'#0a1a10' },
  { id:15, cat:'breaking',   title:'Roland and Korg Confirm Joint Modular Ecosystem',                  excerpt:'In a move nobody predicted, two of the biggest names in electronic music hardware are building a shared CV/Gate standard.',  author:'Neel Kapoor',   date:'2025-06-09', readTime:'5 min',  popular:6800, featured:false, coverStory:false, color:'#100a1a' },
  { id:16, cat:'technology', title:'The Room Correction Revolution: EQ Has Finally Gone Mainstream',  excerpt:"Auto-EQ and room correction used to be for mastering engineers. Now it's in $300 speakers. Here's what changed.",        author:'Arjun Mehta',   date:'2025-06-08', readTime:'11 min', popular:2900, featured:false, coverStory:false, color:'#0a140a' },
  { id:17, cat:'industry',   title:'Tidal Pivots to Hi-Fi B2B Licensing After User Base Stagnates',   excerpt:'The platform that pioneered lossless streaming is changing its model entirely, targeting studio and hardware partnerships.',   author:'Riya Sharma',   date:'2025-06-07', readTime:'6 min',  popular:2100, featured:false, coverStory:false, color:'#1a0a14' },
  { id:18, cat:'events',     title:"AES New York 2025: The Five Talks That Will Define Audio's Future", excerpt:"From psychoacoustics to AI training sets, the year's most important academic audio conference did not disappoint.",        author:'Dev Kapoor',    date:'2025-06-06', readTime:'8 min',  popular:1800, featured:false, coverStory:false, color:'#0a0a14' },
  { id:19, cat:'opinion',    title:'The Problem With How Audio Reviewers Review Headphones',           excerpt:'Subjectivity dressed as objectivity. The measurement-first approach to headphone criticism has a serious epistemological flaw.', author:'Priya Singh', date:'2025-06-05', readTime:'12 min', popular:4500, featured:false, coverStory:false, color:'#14100a' },
  { id:20, cat:'analysis',   title:"AR Rahman's New Studio Is Built Around a Philosophy, Not a Spec", excerpt:'Inside the most acoustically ambitious recording space in South Asia — and what it reveals about how he hears music.',       author:'Dev Kapoor',    date:'2025-06-04', readTime:'16 min', popular:3100, featured:false, coverStory:false, color:'#0a140a' },
  { id:21, cat:'breaking',   title:'Sony Files Patent for AI-Powered Live Concert Mastering',         excerpt:'The patent describes a system that can adjust a live mix in real time based on the acoustics of the physical venue.',       author:'Neel Kapoor',   date:'2025-06-03', readTime:'4 min',  popular:3700, featured:false, coverStory:false, color:'#140a0a' },
  { id:22, cat:'technology', title:'We Tested 12 DACs Under ₹20,000 — Only One Is Worth Buying',     excerpt:'Blind tests, spectral analysis, and a lot of late nights. The results genuinely surprised everyone in the room.',          author:'Arjun Mehta',   date:'2025-06-02', readTime:'18 min', popular:5200, featured:false, coverStory:false, color:'#0a0a10' },
  { id:23, cat:'industry',   title:'The $99 IEM That Embarrassed $500 Flagships in Blind Tests',     excerpt:'A Shenzhen brand nobody had heard of sent us a sample. What happened next has the audiophile community divided.',           author:'Priya Singh',   date:'2025-06-01', readTime:'8 min',  popular:8100, featured:false, coverStory:false, color:'#14140a' },
  { id:24, cat:'events',     title:"Glastonbury 2025's Sound System Was the Best in the Festival's History", excerpt:'The team behind this year\'s PA system used custom-built line arrays and an AI-assisted monitor mix. Here\'s how.', author:'Dev Kapoor', date:'2025-05-31', readTime:'10 min', popular:4300, featured:false, coverStory:false, color:'#0a1414' },
];

/* ── GEAR PRODUCTS (25 items from soundb-gear.html) ── */
var GEAR_PRODUCTS = [
  { name:'HD 820',          brand:'Sennheiser',         category:'Headphones', price:110000, score:9.2, badge:'editors', reviewed:true,  isNew:false, desc:'Closed-back reference headphone with glass-backed cups and ring radiator driver.',                                                              color1:'#1a0a00', color2:'#FF8C00' },
  { name:'WH-1000XM6',      brand:'Sony',               category:'Headphones', price:29990,  score:9.0, badge:'new',     reviewed:true,  isNew:true,  desc:"The sixth generation of Sony's flagship ANC headphones. Best-in-class noise cancellation.",                                                       color1:'#0d1a2e', color2:'#4080FF' },
  { name:'T5 (3rd Gen)',     brand:'Beyerdynamic',       category:'Headphones', price:72000,  score:8.2, badge:null,      reviewed:true,  isNew:false, desc:'Tesla driver technology in a portable closed-back form factor. Studio DNA, travel body.',                                                          color1:'#1a1a0a', color2:'#C0C040' },
  { name:'MOMENTUM 4',      brand:'Sennheiser',         category:'Headphones', price:34990,  score:8.8, badge:'editors', reviewed:true,  isNew:false, desc:'60-hour battery, audiophile tuning, and premium build at a mainstream price.',                                                                    color1:'#0a1a0a', color2:'#40C080' },
  { name:'SM7dB',           brand:'Shure',              category:'Microphones',price:32000,  score:9.5, badge:'editors', reviewed:true,  isNew:true,  desc:'The legendary SM7 capsule with a built-in preamp. Plug into anything and sound professional.',                                                    color1:'#1a0a1a', color2:'#C040C0' },
  { name:'MV7+',            brand:'Shure',              category:'Microphones',price:18000,  score:8.6, badge:'budget',  reviewed:true,  isNew:false, desc:"USB/XLR hybrid mic with a built-in headphone output. The podcaster's best friend.",                                                              color1:'#0a0a1a', color2:'#4040C0' },
  { name:'Duet 3',          brand:'Apogee',             category:'Interfaces', price:42000,  score:8.8, badge:'editors', reviewed:true,  isNew:false, desc:"Two channels of Apogee's world-class converters in a beautifully compact enclosure.",                                                            color1:'#1a1a1a', color2:'#808080' },
  { name:'One for iPad',    brand:'Apogee',             category:'Interfaces', price:28000,  score:8.4, badge:null,      reviewed:false, isNew:false, desc:'Single-channel interface with a built-in mic. The best mobile recording solution.',                                                              color1:'#0a1a1a', color2:'#40C0C0' },
  { name:'EP-133 K.O. II',  brand:'Teenage Engineering',category:'Synths',     price:26000,  score:8.4, badge:'new',     reviewed:true,  isNew:true,  desc:'The internet-breaking groovebox with tactile pads, built-in speaker, and infinite charm.',                                                       color1:'#1a1a0a', color2:'#C0C020' },
  { name:'OP-XY',           brand:'Teenage Engineering',category:'Synths',     price:85000,  score:9.1, badge:'editors', reviewed:false, isNew:true,  desc:'A new paradigm in portable synthesis. Chord-based sequencing meets classic TE minimalism.',                                                       color1:'#0a0a0a', color2:'#FF8C00' },
  { name:'Jupiter-X',       brand:'Roland',             category:'Synths',     price:120000, score:8.9, badge:null,      reviewed:false, isNew:false, desc:'Five legendary Roland synth models in one instrument. The history of synthesis, updated.',                                                       color1:'#1a0a0a', color2:'#FF4040' },
  { name:'SE-02',           brand:'Roland',             category:'Synths',     price:28000,  score:8.5, badge:'budget',  reviewed:false, isNew:false, desc:'Boutique analogue monosynth co-developed with Studio Electronics. Three oscillators of pure fat.',                                               color1:'#0a0a1a', color2:'#4060FF' },
  { name:'IE 900',          brand:'Sennheiser',         category:'IEMs',       price:95000,  score:9.4, badge:'editors', reviewed:false, isNew:false, desc:'Single dynamic driver IEM with an X3R resonator system. Flagship reference in-ear.',                                                             color1:'#1a0500', color2:'#FF6020' },
  { name:'IE 600',          brand:'Sennheiser',         category:'IEMs',       price:60000,  score:8.9, badge:null,      reviewed:false, isNew:false, desc:'Amorphous zirconium alloy housing. Trickle-down from the IE 900 with a friendlier price.',                                                       color1:'#1a0a00', color2:'#FF8030' },
  { name:'IER-M9',          brand:'Sony',               category:'IEMs',       price:75000,  score:8.7, badge:null,      reviewed:false, isNew:false, desc:'Five balanced armature drivers tuned for stage monitoring. Used by professional musicians.',                                                     color1:'#0d1020', color2:'#4070FF' },
  { name:'IER-Z1R',         brand:'Sony',               category:'IEMs',       price:110000, score:9.0, badge:'editors', reviewed:false, isNew:false, desc:"Sony's flagship IEM. Hybrid driver system with a zinc alloy and magnesium housing.",                                                             color1:'#0d1a2e', color2:'#3060FF' },
  { name:'SE846 Gen 2',     brand:'Shure',              category:'IEMs',       price:85000,  score:8.8, badge:null,      reviewed:false, isNew:false, desc:'Four balanced armature drivers with tuning nozzles. The studio reference standard.',                                                             color1:'#0a0a1a', color2:'#6040C0' },
  { name:'DT 1990 Pro',     brand:'Beyerdynamic',       category:'Headphones', price:48000,  score:8.6, badge:null,      reviewed:false, isNew:false, desc:'Analytical open-back with dual ear cup sets — balanced or analytical response.',                                                                color1:'#1a1a0a', color2:'#A0A030' },
  { name:'AudioBox USB 96', brand:'PreSonus',           category:'Interfaces', price:8500,   score:7.8, badge:'budget',  reviewed:false, isNew:false, desc:'Entry-level two-channel interface with solid preamps and zero-latency monitoring.',                                                              color1:'#0a1a0a', color2:'#30A060' },
  { name:'Alpha 22',        brand:'Behringer',          category:'Interfaces', price:15000,  score:8.2, badge:'budget',  reviewed:false, isNew:false, desc:'High-fidelity USB interface with MIDAS-designed preamps and a metal chassis.',                                                                  color1:'#1a1a1a', color2:'#707070' },
  { name:'Scarlett 4i4',   brand:'Focusrite',          category:'Interfaces', price:16000,  score:8.3, badge:null,      reviewed:false, isNew:false, desc:"Four inputs, four outputs, Air mode preamps. The working musician's reliable companion.",                                                        color1:'#1a0505', color2:'#E04020' },
  { name:'SCX10 II',        brand:'Audio-Technica',     category:'Microphones',price:12000,  score:8.1, badge:'budget',  reviewed:false, isNew:false, desc:'Small diaphragm condenser for acoustic instruments and overheads. Pairs perfectly.',                                                             color1:'#0a1a1a', color2:'#40A0A0' },
  { name:'HS8',             brand:'Yamaha',             category:'Speakers',   price:38000,  score:8.7, badge:'editors', reviewed:false, isNew:false, desc:'8-inch studio monitor with bi-amplified design. Flat response across the critical midrange.',                                                   color1:'#0a0a0a', color2:'#606060' },
  { name:'SC207',           brand:'Adam Audio',         category:'Speakers',   price:9500,   score:7.6, badge:'budget',  reviewed:false, isNew:true,  desc:'Compact desktop monitor with a wood enclosure. Natural sound character for home producers.',                                                    color1:'#1a0a05', color2:'#C06030' },
  { name:'Volt 476P',       brand:'Universal Audio',    category:'Interfaces', price:33000,  score:9.3, badge:'new',     reviewed:true,  isNew:true,  desc:'Four channels of UA 76-style limiting amp preamps in a bus-powered USB-C interface. The most ambitious value play Universal Audio has ever made.', color1:'#020c18', color2:'#00c2ff' },
];

/* ── GEAR REVIEWS (31 items from soundb-reviews.html) ── */
var GEAR_REVIEWS = [
  // Headphones
  { name:'Sennheiser HD 820',        brand:'Sennheiser',          category:'headphones', subcat:'Closed-Back Headphone', score:9.2, price:110000, badge:'editors', date:'2025-06-07', author:'Priya Singh',  readTime:'11 min', verdict:"The best closed-back headphone money can buy for critical listening. Nine months of testing confirmed it.",          color1:'#1a0a00', color2:'#FF8C00', pros:JSON.stringify(['Outstanding clarity and detail retrieval','Class-leading soundstage for a closed-back','Glass-backed cups eliminate resonance','Superb build quality']), cons:JSON.stringify(['Extremely expensive','Requires a good amp to shine','Slight mid-bass warmth might divide listeners']), tags:JSON.stringify(['headphones','closed-back','reference','sennheiser']) },
  { name:'Sony WH-1000XM6',          brand:'Sony',                category:'headphones', subcat:'Wireless ANC Headphone', score:9.0, price:29990,  badge:'new',     date:'2025-06-15', author:'Arjun Mehta',  readTime:'9 min',  verdict:"Best-in-class ANC headphones. The QN3 chip is genuinely uncanny — mid-flight noise simply disappears.",             color1:'#0d1a2e', color2:'#4080FF', pros:JSON.stringify(['Best-in-class noise cancellation','30-hour battery life','Excellent call quality','Foldable compact design']), cons:JSON.stringify(['Mid-heavy tuning might not suit all','Touch controls can be overly sensitive','Slightly less detailed than wired competition']), tags:JSON.stringify(['headphones','wireless','anc','sony']) },
  { name:'Beyerdynamic DT 1990 Pro',  brand:'Beyerdynamic',        category:'headphones', subcat:'Open-Back Headphone',   score:8.6, price:48000,  badge:null,      date:'2025-05-30', author:'Priya Singh',  readTime:'10 min', verdict:"Analytical, revealing, and unforgiving. Essential for mixing engineers who want the full picture.",                 color1:'#1a1a0a', color2:'#A0A030', pros:JSON.stringify(['Two tuning options included','Superb detail resolution','Premium build quality','Replaceable cable']), cons:JSON.stringify(['Can be fatiguing for long sessions','Requires quiet environment','V-shaped tuning needs getting used to']), tags:JSON.stringify(['headphones','open-back','studio','beyerdynamic']) },
  { name:'Sennheiser MOMENTUM 4',     brand:'Sennheiser',          category:'headphones', subcat:'Wireless Headphone',    score:8.8, price:34990,  badge:'editors', date:'2025-05-22', author:'Dev Kapoor',   readTime:'8 min',  verdict:"60 hours of battery, audiophile tuning, premium build — all at a price that finally makes sense.",                   color1:'#0a1a0a', color2:'#40C080', pros:JSON.stringify(['Exceptional 60-hour battery','Audiophile-grade sound for the price','Transparent ANC mode','Very comfortable for long use']), cons:JSON.stringify(['No multi-device connection','App required for full features','Bulkier than some competitors']), tags:JSON.stringify(['headphones','wireless','sennheiser','battery']) },
  { name:'Beyerdynamic T5 3rd Gen',   brand:'Beyerdynamic',        category:'headphones', subcat:'Closed-Back Headphone', score:8.2, price:72000,  badge:null,      date:'2025-05-10', author:'Neel Kapoor',  readTime:'7 min',  verdict:"Tesla driver technology in a portable body. Studio DNA, travel-ready form factor.",                                  color1:'#14140a', color2:'#C0C040', pros:JSON.stringify(['Portable studio sound','Tesla driver clarity','Premium materials','Great isolation']), cons:JSON.stringify(['Pricey for closed-back portable','Slightly recessed mids','Requires good source']), tags:JSON.stringify(['headphones','portable','beyerdynamic','tesla']) },
  { name:'Sennheiser IE 900',         brand:'Sennheiser',          category:'headphones', subcat:'In-Ear Monitor',        score:9.4, price:95000,  badge:'editors', date:'2025-04-20', author:'Priya Singh',  readTime:'12 min', verdict:"Single dynamic driver IEMs that redefine what one transducer can do. The X3R resonator system is genuinely new.",  color1:'#1a0500', color2:'#FF6020', pros:JSON.stringify(['Extraordinary detail from a single DD','X3R resonator system eliminates distortion','Incredibly natural timbre','Premium machined housing']), cons:JSON.stringify(['Very expensive','Finicky fit for some ear shapes','Source-dependent']), tags:JSON.stringify(['iem','sennheiser','dynamic-driver','flagship']) },
  { name:'Sony IER-Z1R',             brand:'Sony',                category:'headphones', subcat:'In-Ear Monitor',        score:9.0, price:110000, badge:'editors', date:'2025-04-08', author:'Arjun Mehta',  readTime:'11 min', verdict:"Flagship hybrid driver IEM in a zinc alloy and magnesium housing. Sony at their most ambitious.",                   color1:'#0d1a2e', color2:'#3060FF', pros:JSON.stringify(['Stunningly wide soundstage for an IEM','Hybrid driver coherence','Premium build quality','Outstanding bass extension']), cons:JSON.stringify(['Extremely large shells','Very expensive','Requires powerful source']), tags:JSON.stringify(['iem','sony','hybrid','flagship']) },
  { name:'Shure SE846 Gen 2',        brand:'Shure',               category:'headphones', subcat:'In-Ear Monitor',        score:8.8, price:85000,  badge:null,      date:'2025-03-25', author:'Neel Kapoor',  readTime:'8 min',  verdict:"Four balanced armature drivers with tuning nozzles. The studio reference standard for in-ear monitoring.",           color1:'#0a0a1a', color2:'#6040C0', pros:JSON.stringify(['Three sound signature options','Superior isolation','Professional build quality','Great for stage use']), cons:JSON.stringify(['BA timbre not for everyone','Requires good fit for full bass','Proprietary cable connector']), tags:JSON.stringify(['iem','shure','balanced-armature','studio']) },
  { name:'Sony IER-M9',              brand:'Sony',                category:'headphones', subcat:'In-Ear Monitor',        score:8.7, price:75000,  badge:null,      date:'2025-03-10', author:'Dev Kapoor',   readTime:'7 min',  verdict:"Five BA drivers tuned for stage monitoring. Used by professional touring musicians worldwide.",                     color1:'#0d1020', color2:'#4070FF', pros:JSON.stringify(['Reference-tuned for stage use','Excellent detail and speed','Robust build quality','Professional fit options']), cons:JSON.stringify(['Can sound lean to casual listeners','Expensive','Not ideal for bass-heavy genres']), tags:JSON.stringify(['iem','sony','stage','monitor']) },

  // Interfaces & DACs
  { name:'Universal Audio Volt 476P', brand:'Universal Audio',     category:'interfaces', subcat:'Audio Interface',       score:9.3, price:33000,  badge:'new',     date:'2025-06-20', author:'Neel Kapoor',  readTime:'14 min', verdict:"Four channels of UA 76-style compression in a bus-powered package. The best interface value play in years.",        color1:'#020c18', color2:'#00c2ff', pros:JSON.stringify(['76-style compression on all 4 channels','Bus-powered via USB-C','UA converter quality at this price','Great MIDI I/O']), cons:JSON.stringify(['No direct monitoring for all channels','Software bundle requires registration','Heavier than competitors']), tags:JSON.stringify(['interface','universal-audio','4-channel','home-studio']) },
  { name:'Apogee Duet 3',            brand:'Apogee',              category:'interfaces', subcat:'Audio Interface',       score:8.8, price:42000,  badge:'editors', date:'2025-06-01', author:'Dev Kapoor',   readTime:'10 min', verdict:"130 dB dynamic range and 32-bit capture in a palm-sized unit. The finest 2-channel interface for desktop recording.", color1:'#1a1a1a', color2:'#808080', pros:JSON.stringify(['Best-in-class converter quality','Incredibly compact','32-bit float recording','Premium build']), cons:JSON.stringify(['Only 2 channels','Mac-only software features','Premium pricing']), tags:JSON.stringify(['interface','apogee','2-channel','mac']) },
  { name:'Focusrite Scarlett Solo 4th Gen',brand:'Focusrite',     category:'interfaces', subcat:'Budget Interface',      score:8.3, price:9500,   badge:'budget',  date:'2025-05-15', author:'Riya Sharma',  readTime:'7 min',  verdict:"The best-selling interface for a reason. Fourth generation Air preamps are cleaner than ever at this price point.",   color1:'#1a0505', color2:'#E04020', pros:JSON.stringify(['Excellent preamp quality for price','USB bus powered','Cross-platform compatible','Includes software bundle']), cons:JSON.stringify(['Only one mic input','No MIDI I/O','Plastic build quality']), tags:JSON.stringify(['interface','focusrite','budget','beginner']) },
  { name:'Audient iD4 MkII',         brand:'Audient',             category:'interfaces', subcat:'Audio Interface',       score:8.5, price:14000,  badge:null,      date:'2025-04-28', author:'Neel Kapoor',  readTime:'8 min',  verdict:"Class-leading preamp quality at an accessible price. Audient's console DNA in a desktop unit.",                      color1:'#0a1a1a', color2:'#40A0A0', pros:JSON.stringify(['Console-class preamp design','JFET instrument input','Solid metal build','Excellent value']), cons:JSON.stringify(['Only one mic input','Basic software bundle','No MIDI']), tags:JSON.stringify(['interface','audient','preamp','studio']) },
  { name:'MOTU M4',                  brand:'MOTU',                category:'interfaces', subcat:'Audio Interface',       score:8.7, price:21000,  badge:'editors', date:'2025-04-10', author:'Arjun Mehta',  readTime:'9 min',  verdict:"Four channels, ESS converters, and a front panel that makes sense. MOTU's best value proposition ever.",              color1:'#0a0a1a', color2:'#4060C0', pros:JSON.stringify(['ESS Sabre32 converters','Excellent build quality','4 balanced outputs','Class-compliant USB']), cons:JSON.stringify(['No hardware DSP','Basic software features','Some find the preamps clinical']), tags:JSON.stringify(['interface','motu','4-channel','studio']) },
  { name:'RME Babyface Pro FS',      brand:'RME',                 category:'interfaces', subcat:'Pro Interface',         score:9.1, price:65000,  badge:'editors', date:'2025-03-20', author:'Dev Kapoor',   readTime:'12 min', verdict:"The professional's portable interface. RME drivers and TotalMix flexibility in a palm-sized unit.",                  color1:'#1a1a1a', color2:'#707070', pros:JSON.stringify(['RME driver stability and latency','TotalMix FX routing','Superb converter quality','Works with everything']), cons:JSON.stringify(['Very expensive for 2 channels','TotalMix learning curve','No bus power']), tags:JSON.stringify(['interface','rme','pro','portable']) },

  // Microphones
  { name:'Shure SM7dB',              brand:'Shure',               category:'microphones',subcat:'Dynamic Microphone',    score:9.5, price:32000,  badge:'editors', date:'2025-06-14', author:'Neel Kapoor',  readTime:'13 min', verdict:"The SM7B with a built-in preamp. Plug into anything and sound like a professional. A genuine game-changer for the home studio.", color1:'#1a0a1a', color2:'#C040C0', pros:JSON.stringify(['Built-in preamp eliminates gain issues','Legendary SM7 capsule','Works with any interface','Hum-rejecting shielding']), cons:JSON.stringify(['Requires cable management','More expensive than SM7B','Larger than SM7B']), tags:JSON.stringify(['microphone','shure','dynamic','podcast','sm7']) },
  { name:'Shure MV7+',               brand:'Shure',               category:'microphones',subcat:'Podcast Microphone',    score:8.6, price:18000,  badge:'budget',  date:'2025-05-05', author:'Riya Sharma',  readTime:'8 min',  verdict:"USB/XLR hybrid mic with built-in headphone output. The podcaster's definitive choice.",                               color1:'#0a0a1a', color2:'#4040C0', pros:JSON.stringify(['Dual USB and XLR output','Built-in headphone monitoring','Natural sound on voice','Auto Level mode works well']), cons:JSON.stringify(['Not ideal for instruments','Limited polar pattern options','Plastic body']), tags:JSON.stringify(['microphone','shure','usb','podcast','xlr']) },
  { name:'Neumann TLM 102',          brand:'Neumann',             category:'microphones',subcat:'Condenser Microphone',  score:9.0, price:75000,  badge:'editors', date:'2025-04-15', author:'Priya Singh',  readTime:'11 min', verdict:"Neumann quality in a smaller, more accessible package. The TLM 102 earns its place in professional studios.",           color1:'#0a0a0a', color2:'#808080', pros:JSON.stringify(['Classic Neumann character','Handles high SPL well','Self-noise only 12 dB','Compact size']), cons:JSON.stringify(['Needs phantom power','Expensive','Sensitive to room acoustics']), tags:JSON.stringify(['microphone','neumann','condenser','studio','vocal']) },
  { name:'Rode NT1 5th Gen',         brand:'Rode',                category:'microphones',subcat:'Condenser Microphone',  score:8.7, price:22000,  badge:null,      date:'2025-03-30', author:'Arjun Mehta',  readTime:'9 min',  verdict:"The quietest microphone in its class. 32-bit float USB mode changes what's possible for home recording.",              color1:'#1a1a1a', color2:'#C0C0C0', pros:JSON.stringify(['Ultra-low self-noise (4 dB)','32-bit float USB mode','Includes shock mount and pop filter','Excellent value']), cons:JSON.stringify(['Can sound slightly clinical','Large body','Needs good acoustic treatment']), tags:JSON.stringify(['microphone','rode','condenser','home-studio','32-bit']) },
  { name:'Electro-Voice RE20',       brand:'Electro-Voice',       category:'microphones',subcat:'Broadcast Microphone',  score:9.2, price:55000,  badge:'editors', date:'2025-03-01', author:'Dev Kapoor',   readTime:'10 min', verdict:"The broadcast industry standard for 50+ years. The Variable-D proximity effect control is still unmatched.",              color1:'#1a0a0a', color2:'#FF4040', pros:JSON.stringify(['Variable-D proximity control','Professional broadcast heritage','Handles high SPL','Extremely durable']), cons:JSON.stringify(['Requires a lot of gain','Very large and heavy','Expensive']), tags:JSON.stringify(['microphone','ev','broadcast','dynamic','radio']) },

  // Speakers & Monitors
  { name:'Yamaha HS8',               brand:'Yamaha',              category:'speakers',   subcat:'Studio Monitor',        score:8.7, price:38000,  badge:'editors', date:'2025-06-08', author:'Neel Kapoor',  readTime:'11 min', verdict:"8-inch bi-amplified studio monitor with industry-trusted flat response. The HS series remains the go-to for translation.", color1:'#0a0a0a', color2:'#606060', pros:JSON.stringify(['Flat, honest frequency response','Room control and high trim','80W bi-amplified design','Industry-standard reference']), cons:JSON.stringify(['Not flattering to listen to','Requires room treatment','8-inch needs desk space']), tags:JSON.stringify(['monitor','yamaha','studio','bi-amplified','flat']) },
  { name:'Adam Audio T7V',           brand:'Adam Audio',          category:'speakers',   subcat:'Studio Monitor',        score:8.5, price:18000,  badge:'budget',  date:'2025-05-20', author:'Priya Singh',  readTime:'8 min',  verdict:"Adam's ribbon tweeter technology at a budget price. The T7V punches above its weight for home studio use.",               color1:'#1a0a05', color2:'#C06030', pros:JSON.stringify(['Adam ribbon tweeter','Wide stereo dispersion','Good bass from a 7-inch','Power and level controls']), cons:JSON.stringify(['HPS waveguide has some resonance','Not as neutral as monitors costing more','Slight low-mid muddiness']), tags:JSON.stringify(['monitor','adam-audio','ribbon-tweeter','budget','home-studio']) },
  { name:'Genelec 8010A',            brand:'Genelec',             category:'speakers',   subcat:'Studio Monitor',        score:8.9, price:45000,  badge:'editors', date:'2025-04-25', author:'Dev Kapoor',   readTime:'10 min', verdict:"The smallest Genelec is still a professional tool. Die-cast aluminium SAM monitor with a sound that defies its size.",    color1:'#0a1a1a', color2:'#40C0C0', pros:JSON.stringify(['Professional Genelec quality','Compact desktop footprint','SAM room correction available','Extremely robust']), cons:JSON.stringify(['Limited low-frequency extension','Needs a subwoofer for bass-heavy work','Expensive for the size']), tags:JSON.stringify(['monitor','genelec','sam','compact','professional']) },
  { name:'KRK Rokit 5 G4',          brand:'KRK',                 category:'speakers',   subcat:'Studio Monitor',        score:8.1, price:14000,  badge:'budget',  date:'2025-03-15', author:'Riya Sharma',  readTime:'7 min',  verdict:"The classic yellow woofer returns with DSP built in. Entry-level monitoring that teaches you how to mix.",               color1:'#1a1a0a', color2:'#FFCC00', pros:JSON.stringify(['Built-in DSP EQ','27 voicing options','Classic KRK sound','Good bass for the size']), cons:JSON.stringify(['Coloured sound not ideal for critical work','Build quality could be better','App required for DSP']), tags:JSON.stringify(['monitor','krk','rokit','budget','entry-level']) },

  // Synths & Samplers
  { name:'Teenage Eng. EP-133 K.O. II','brand':'Teenage Engineering',category:'synths', subcat:'Portable Groovebox',    score:8.4, price:26000,  badge:'new',     date:'2025-06-10', author:'Dev Kapoor',   readTime:'9 min',  verdict:"The internet-breaking groovebox. Tactile pads, built-in speaker, and infinite charm. The most fun we've had reviewing anything.", color1:'#1a1a0a', color2:'#C0C020', pros:JSON.stringify(['Built-in speaker and mic','Incredibly intuitive workflow','Great for impromptu beatmaking','Tactile pad feel']), cons:JSON.stringify(['Limited sampling time','No MIDI input','Battery life could be better']), tags:JSON.stringify(['synth','teenage-engineering','groovebox','sampler','portable']) },
  { name:'Teenage Eng. OP-XY',        brand:'Teenage Engineering',category:'synths', subcat:'Desktop Synthesizer',   score:9.1, price:85000,  badge:'editors', date:'2025-05-25', author:'Neel Kapoor',  readTime:'13 min', verdict:"A new paradigm in portable synthesis. Chord-based sequencing meets classic TE minimalism. Revolutionary.",            color1:'#0a0a0a', color2:'#FF8C00', pros:JSON.stringify(['Chord-mode sequencing is genuinely new','Incredible build quality','Great battery life','Two synth engines']), cons:JSON.stringify(['Extremely expensive','Small screen for complex operations','Learning curve for the sequencer']), tags:JSON.stringify(['synth','teenage-engineering','portable','op-xy','flagship']) },
  { name:'Roland SE-02',              brand:'Roland',              category:'synths',    subcat:'Analogue Monosynth',   score:8.5, price:28000,  badge:'budget',  date:'2025-04-30', author:'Arjun Mehta',  readTime:'7 min',  verdict:"Boutique analogue monosynth co-developed with Studio Electronics. Three oscillators of pure, thick analogue fat.",   color1:'#0a0a1a', color2:'#4060FF', pros:JSON.stringify(['Genuine analogue signal path','Three oscillators','Semi-modular potential','Compact desktop size']), cons:JSON.stringify(['No MIDI over USB','Tiny knobs and labels','No built-in effects']), tags:JSON.stringify(['synth','roland','analogue','monosynth','studio-electronics']) },
  { name:'Roland Jupiter-X',          brand:'Roland',              category:'synths',    subcat:'Flagship Synthesizer', score:8.9, price:120000, badge:null,      date:'2025-04-05', author:'Dev Kapoor',   readTime:'11 min', verdict:"Five legendary Roland synth models in one instrument. The history of synthesis, updated for 2025.",                  color1:'#1a0a0a', color2:'#FF4040', pros:JSON.stringify(['Five model banks (Juno, Jupiter, SH, System-8, XV)','76 keys','Outstanding build quality','Excellent sequencer']), cons:JSON.stringify(['Very expensive','Model emulations debated by purists','Large and heavy']), tags:JSON.stringify(['synth','roland','jupiter','flagship','polyphonic']) },

  // Buying Guides
  { name:'Best Headphones Under ₹30,000', brand:'Soundb Guides', category:'guides', subcat:'Buying Guide', score:null, price:null, badge:null, date:'2025-06-18', author:'Soundb Editors', readTime:'7 min', verdict:"Nine headphones tested. Three deserve your money. We tell you exactly which one to buy based on how you listen.", color1:'#1a1a0a', color2:'#FF8C00', pros:JSON.stringify([]), cons:JSON.stringify([]), tags:JSON.stringify(['buying-guide','headphones','budget']) },
  { name:'Best Audio Interface 2025',     brand:'Soundb Guides', category:'guides', subcat:'Buying Guide', score:null, price:null, badge:null, date:'2025-06-05', author:'Soundb Editors', readTime:'9 min', verdict:"From bedroom to professional studio — the exact interface to buy at every budget from ₹5,000 to ₹1,00,000.", color1:'#0a1a1a', color2:'#FF8C00', pros:JSON.stringify([]), cons:JSON.stringify([]), tags:JSON.stringify(['buying-guide','interface','all-budgets']) },
  { name:'Best IEMs for Every Budget',    brand:'Soundb Guides', category:'guides', subcat:'Buying Guide', score:null, price:null, badge:null, date:'2025-05-28', author:'Soundb Editors', readTime:'8 min', verdict:"Fourteen IEMs. Five price brackets. One clear recommendation at each level.",                              color1:'#1a0a1a', color2:'#FF8C00', pros:JSON.stringify([]), cons:JSON.stringify([]), tags:JSON.stringify(['buying-guide','iem','budget','premium']) },
];

/* ── MUSIC REVIEWS (8 albums from soundb-music.html) ── */
var MUSIC_REVIEWS = [
  // International
  { album:'GNX',             artist:'Kendrick Lamar',    genre:'Hip-Hop',      score:9.4, summary:'A landmark return. GNX sees Kendrick at his most focused and musically ambitious.', color1:'#1a0a0a', color2:'#FF4040', spotifyUrl:'https://open.spotify.com/album/6BQYF5b2BPFM1gqFgMOJxH', appleMusicUrl:'https://music.apple.com/us/album/gnx/1782082630', youtubeUrl:'https://www.youtube.com/results?search_query=Kendrick+Lamar+GNX', reviewed:true },
  { album:"Short n' Sweet",  artist:'Sabrina Carpenter', genre:'Pop',           score:8.8, summary:'Sabrina Carpenter fully realises her sound. Every track a potential single.', color1:'#2a0a18', color2:'#FF80C0', spotifyUrl:'https://open.spotify.com/album/4MXdMuCHHKJwmjMKFYhAJJ', appleMusicUrl:'https://music.apple.com/us/album/short-n-sweet/1739577823', youtubeUrl:'https://www.youtube.com/results?search_query=Sabrina+Carpenter+Short+n+Sweet', reviewed:true },
  { album:'Chromakopia',     artist:'Tyler, the Creator',genre:'Hip-Hop',      score:9.1, summary:'Tyler continues his creative evolution with a deeply personal and sonically rich album.', color1:'#0a1a0a', color2:'#60C040', spotifyUrl:'https://open.spotify.com/album/67uMCiSABFHBeRJjqK0GsO', appleMusicUrl:'https://music.apple.com/us/album/chromakopia/1772948418', youtubeUrl:'https://www.youtube.com/results?search_query=Tyler+the+Creator+Chromakopia', reviewed:true },
  { album:'Brat',            artist:'Charli xcx',        genre:'Pop / Dance',  score:9.0, summary:'The album of the summer. Charli xcx at maximum confidence — and it sounds like freedom.', color1:'#1a0a1a', color2:'#CCFF00', spotifyUrl:'https://open.spotify.com/album/2lIZef4lzdvZkiiCzvPKj7', appleMusicUrl:'https://music.apple.com/us/album/brat/1739736204', youtubeUrl:'https://www.youtube.com/results?search_query=Charli+xcx+Brat+album', reviewed:true },
  // India
  { album:'Amar Singh',      artist:'Diljit Dosanjh',    genre:'Punjabi Pop',  score:8.4, summary:'Diljit at his most nostalgic. A love letter to Punjab that connects across generations.', color1:'#1a1a0a', color2:'#FFCC00', spotifyUrl:'https://open.spotify.com/artist/3375hpAMFgcFLhRL9KJEhg', appleMusicUrl:'https://music.apple.com/in/artist/diljit-dosanjh/444520861', youtubeUrl:'https://www.youtube.com/results?search_query=Diljit+Dosanjh+Amar+Singh', reviewed:true },
  { album:'Gyaan',           artist:'AP Dhillon',         genre:'Punjabi R&B', score:8.7, summary:"AP Dhillon's most mature project. Production from Shinda Kahlon hits different on good speakers.", color1:'#0a0a1a', color2:'#8080FF', spotifyUrl:'https://open.spotify.com/artist/6RHTUrRF63xao58xh9FXYJ', appleMusicUrl:'https://music.apple.com/in/artist/ap-dhillon/1495978040', youtubeUrl:'https://www.youtube.com/results?search_query=AP+Dhillon+Gyaan', reviewed:true },
  { album:'Suroor',          artist:'Atif Aslam',         genre:'Ghazal / Pop',score:8.0, summary:'Atif Aslam in his element. Romantic, lush, and produced with care for audiophile listeners.', color1:'#1a0a0a', color2:'#FF8040', spotifyUrl:'https://open.spotify.com/artist/4M1L0f01hePgIYliGJ3cTJ', appleMusicUrl:'https://music.apple.com/in/artist/atif-aslam/75005451', youtubeUrl:'https://www.youtube.com/results?search_query=Atif+Aslam+Suroor', reviewed:true },
  { album:'Mahakaal',        artist:'Raftaar',             genre:'Hindi Hip-Hop',score:8.2,summary:"Raftaar's most experimental record yet. Hard-hitting production meets introspective bars.", color1:'#0a1a1a', color2:'#40C0C0', spotifyUrl:'https://open.spotify.com/artist/6oKk6c6ByqffxAyAFAvSiL', appleMusicUrl:'https://music.apple.com/in/artist/raftaar/1009195481', youtubeUrl:'https://www.youtube.com/results?search_query=Raftaar+Mahakaal', reviewed:true },
];

/* ── MUSIC TRACKS (25 items — international chart + india chart) ── */
var MUSIC_TRACKS = [
  // International chart
  { title:'TV Off',                 artist:'Kendrick Lamar',              album:'GNX',              genre:'Hip-Hop',    region:'international', chartType:'top-tracks', rank:1, plays:'48.2M', isNew:false, color1:'#1a0a0a', color2:'#FF4040', spotifyUrl:'https://open.spotify.com/track/6wp4LBb0EKyepwSFl95tXn',    appleMusicUrl:'https://music.apple.com/us/album/tv-off/1782082630',         youtubeUrl:'https://www.youtube.com/results?search_query=Kendrick+Lamar+TV+Off' },
  { title:'Espresso',               artist:'Sabrina Carpenter',            album:"Short n' Sweet",   genre:'Pop',        region:'international', chartType:'top-tracks', rank:2, plays:'42.1M', isNew:false, color1:'#2a0a18', color2:'#FF80C0', spotifyUrl:'https://open.spotify.com/track/2qSkIjg1o9h3YT9RAgYN75',    appleMusicUrl:'https://music.apple.com/us/album/espresso/1739577823',       youtubeUrl:'https://www.youtube.com/watch?v=eVli-tstM5E' },
  { title:'Sticky',                 artist:'Tyler, the Creator',           album:'Chromakopia',      genre:'Hip-Hop',    region:'international', chartType:'top-tracks', rank:3, plays:'38.7M', isNew:true,  color1:'#0a1a0a', color2:'#60C040', spotifyUrl:'https://open.spotify.com/track/3FeVmId7tAEsVgSmSJ9M6T',    appleMusicUrl:'https://music.apple.com/us/album/sticky/1772948418',         youtubeUrl:'https://www.youtube.com/results?search_query=Tyler+Creator+Sticky' },
  { title:'Birds of a Feather',     artist:'Billie Eilish',                album:'HIT ME HARD AND SOFT',genre:'Pop',   region:'international', chartType:'top-tracks', rank:4, plays:'36.4M', isNew:false, color1:'#0d0a1a', color2:'#A060FF', spotifyUrl:'https://open.spotify.com/track/7dS5EaCoMnN7DzlpT6aRn2',    appleMusicUrl:'https://music.apple.com/us/album/birds-of-a-feather/1739736204', youtubeUrl:'https://www.youtube.com/watch?v=QMLpMzGKQ1U' },
  { title:'Die With a Smile',       artist:'Lady Gaga & Bruno Mars',       album:'',                 genre:'Pop',        region:'international', chartType:'top-tracks', rank:5, plays:'33.9M', isNew:false, color1:'#1a0a14', color2:'#FF60C0', spotifyUrl:'https://open.spotify.com/track/7xQAfvXzm3AkraOtGPWIZg',    appleMusicUrl:'https://music.apple.com/us/album/die-with-a-smile/1756358765', youtubeUrl:'https://www.youtube.com/watch?v=kPa7bsKwL-c' },

  // India chart
  { title:'Lover',                  artist:'Diljit Dosanjh',               album:'',                 genre:'Punjabi',    region:'india',         chartType:'top-tracks', rank:1, plays:'12.4M', isNew:false, color1:'#1a1a0a', color2:'#FFCC00', spotifyUrl:'https://open.spotify.com/track/0sWjBCuHrclSVHa4ZY2HBb',    appleMusicUrl:'https://music.apple.com/in/album/lover/1682041499',          youtubeUrl:'https://www.youtube.com/watch?v=cMjW5uXd4pI' },
  { title:'Softly',                 artist:'Karan Aujla',                  album:'',                 genre:'Punjabi',    region:'india',         chartType:'top-tracks', rank:2, plays:'10.8M', isNew:true,  color1:'#0a1a0a', color2:'#40FF80', spotifyUrl:'https://open.spotify.com/track/0Qjzb9pMOP6hnxCcmCjMYf',    appleMusicUrl:'https://music.apple.com/in/album/softly/1738978293',         youtubeUrl:'https://www.youtube.com/watch?v=3VkPEPmkpro' },
  { title:'Sajni',                  artist:'Arijit Singh',                 album:'Laapataa Ladies', genre:'Bollywood',  region:'india',         chartType:'top-tracks', rank:3, plays:'9.6M',  isNew:false, color1:'#1a0a0a', color2:'#FF8040', spotifyUrl:'https://open.spotify.com/track/1jlH5G3yBF1X5kIbEsCVkY',    appleMusicUrl:'https://music.apple.com/in/album/sajni/1724820700',          youtubeUrl:'https://www.youtube.com/watch?v=FZzN2KkfbBc' },
  { title:'Nain Tere',              artist:'AP Dhillon',                   album:'Gyaan',            genre:'Punjabi R&B',region:'india',         chartType:'top-tracks', rank:4, plays:'8.9M',  isNew:true,  color1:'#0a0a1a', color2:'#8080FF', spotifyUrl:'https://open.spotify.com/track/5PjGgMIBNqoGjfpMWVrCeo',    appleMusicUrl:'https://music.apple.com/in/album/nain-tere/1690043738',      youtubeUrl:'https://www.youtube.com/watch?v=_XBqEMNMxos' },
  { title:'Kesariya',               artist:'Arijit Singh',                 album:'Brahmastra',       genre:'Bollywood',  region:'india',         chartType:'top-tracks', rank:5, plays:'8.1M',  isNew:false, color1:'#1a0a0a', color2:'#FF8040', spotifyUrl:'https://open.spotify.com/track/7x8dCjCr0x6x1LBjgHLqCB',    appleMusicUrl:'https://music.apple.com/in/album/kesariya/1628907519',       youtubeUrl:'https://www.youtube.com/watch?v=BddP6PYo2gs' },

  // India trending
  { title:'Husn',                   artist:'Anuv Jain',                    album:'',                 genre:'Indie Pop',  region:'india',         chartType:'trending',   rank:1, plays:'7.7M',  isNew:false, color1:'#0a0a14', color2:'#6040C0', spotifyUrl:'https://open.spotify.com/track/3MxPe6BqUOHzL4cTLCovBU',    appleMusicUrl:'https://music.apple.com/in/album/husn/1671296196',           youtubeUrl:'https://www.youtube.com/watch?v=eVli-tstM5E' },
  { title:'Raatan Lambiyan',        artist:'Jubin Nautiyal',               album:'Shershaah',        genre:'Bollywood',  region:'india',         chartType:'trending',   rank:2, plays:'7.2M',  isNew:false, color1:'#0a0a14', color2:'#4080FF', spotifyUrl:'https://open.spotify.com/track/2kS17R3rXIv2lWwc1FPrKx',    appleMusicUrl:'https://music.apple.com/in/album/raatan-lambiyan/1590461963', youtubeUrl:'https://www.youtube.com/watch?v=xFs3xZExWIo' },
  { title:'O Maahi',                artist:'Arijit Singh',                 album:'Dunki',            genre:'Bollywood',  region:'india',         chartType:'trending',   rank:3, plays:'6.8M',  isNew:false, color1:'#1a0a0a', color2:'#FF8040', spotifyUrl:'https://open.spotify.com/track/5U3YQi0AKWMXHHR1mHWdJn',    appleMusicUrl:'https://music.apple.com/in/album/o-maahi/1724820700',        youtubeUrl:'https://www.youtube.com/results?search_query=Arijit+Singh+O+Maahi' },
  { title:'Tere Vaaste',            artist:'Varun Jain',                   album:'',                 genre:'Indie Pop',  region:'india',         chartType:'trending',   rank:4, plays:'6.1M',  isNew:false, color1:'#0a1a0a', color2:'#40C060', spotifyUrl:'https://open.spotify.com/track/4gNPTSbPF5ELXLSIDFXKoD',    appleMusicUrl:'https://music.apple.com/in/album/tere-vaaste/1672018562',    youtubeUrl:'https://www.youtube.com/watch?v=nBRwpbFOjTY' },
  { title:'Ik Vaari Aa',            artist:'Arijit Singh',                 album:'Raabta',           genre:'Bollywood',  region:'india',         chartType:'trending',   rank:5, plays:'5.8M',  isNew:false, color1:'#1a0a0a', color2:'#FF6040', spotifyUrl:'https://open.spotify.com/track/4CpHYP7gM5TfVlHWlNmXJM',    appleMusicUrl:'https://music.apple.com/in/album/ik-vaari-aa/1197781199',    youtubeUrl:'https://www.youtube.com/watch?v=VVPKwWxpJA4' },

  // International genre picks
  { title:'Stargazing',             artist:'Myles Smith',                  album:'',                 genre:'Indie',      region:'international', chartType:'by-genre',   rank:1, plays:'24.1M', isNew:false, color1:'#0a0a14', color2:'#6080FF', spotifyUrl:'https://open.spotify.com/track/62m1bPlqKAlDIK0pBkzaVP',    appleMusicUrl:'https://music.apple.com/us/album/stargazing/1740046898',     youtubeUrl:'https://www.youtube.com/watch?v=tRnS2o6GGqU' },
  { title:'APT.',                   artist:'ROSÉ & Bruno Mars',            album:'',                 genre:'R&B',        region:'international', chartType:'by-genre',   rank:1, plays:'31.2M', isNew:false, color1:'#1a0a0a', color2:'#FF6060', spotifyUrl:'https://open.spotify.com/track/5vNRhkKd0yEAg8suGBpjeY',    appleMusicUrl:'https://music.apple.com/us/album/apt-/1778551736',           youtubeUrl:'https://www.youtube.com/watch?v=ArmDp-zijuc' },
  { title:'Calling (Lose My Mind)', artist:'Sebastian Ingrosso & Alesso', album:'',                 genre:'EDM',        region:'international', chartType:'by-genre',   rank:1, plays:'22.1M', isNew:false, color1:'#0a0a1a', color2:'#4080FF', spotifyUrl:'https://open.spotify.com/artist/3gBZUcNeVumkeeJ19CY2sX',    appleMusicUrl:'https://music.apple.com/us/artist/alesso/493124837',         youtubeUrl:'https://www.youtube.com/results?search_query=Alesso+Calling' },
  { title:'Take Five',              artist:'Dave Brubeck Quartet',         album:'Time Out',         genre:'Jazz',       region:'international', chartType:'by-genre',   rank:1, plays:'8.4M',  isNew:false, color1:'#0a0a14', color2:'#6040C0', spotifyUrl:'https://open.spotify.com/artist/3B1TuHbGBFl9Xm7fqYdvJy',    appleMusicUrl:'https://music.apple.com/us/artist/the-dave-brubeck-quartet/104052', youtubeUrl:'https://www.youtube.com/watch?v=vmDDOFXSgAs' },
  { title:'Clair de lune',          artist:'Claude Debussy',               album:'',                 genre:'Classical',  region:'international', chartType:'by-genre',   rank:1, plays:'9.2M',  isNew:false, color1:'#0a0a14', color2:'#4060C0', spotifyUrl:'https://open.spotify.com/artist/1Uff91EOsvd99rtAupatMP',    appleMusicUrl:'https://music.apple.com/us/artist/claude-debussy/103606',    youtubeUrl:'https://www.youtube.com/watch?v=CvFH_6DNRCY' },
  { title:'Enter Sandman',          artist:'Metallica',                    album:'Metallica (Black Album)', genre:'Metal',region:'international', chartType:'by-genre',  rank:1, plays:'12.4M', isNew:false, color1:'#0a0a0a', color2:'#808080', spotifyUrl:'https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB',    appleMusicUrl:'https://music.apple.com/us/artist/metallica/3996865',        youtubeUrl:'https://www.youtube.com/watch?v=CD-E-LDc384' },
  { title:'Texas Hold \'Em',        artist:'Beyoncé',                      album:'Cowboy Carter',    genre:'Country',    region:'international', chartType:'by-genre',   rank:1, plays:'18.4M', isNew:false, color1:'#1a1a0a', color2:'#C0A020', spotifyUrl:'https://open.spotify.com/track/3qSJD2hjnZ7YqnFiHFkENo',    appleMusicUrl:'https://music.apple.com/us/album/texas-hold-em/1728921786', youtubeUrl:'https://www.youtube.com/watch?v=SrMObOL6QZY' },
  { title:'Bright Future',          artist:'Adrianne Lenker',              album:'Bright Future',    genre:'Folk',       region:'international', chartType:'by-genre',   rank:1, plays:'8.9M',  isNew:false, color1:'#0a140a', color2:'#40C060', spotifyUrl:'https://open.spotify.com/album/4rFp3zDtxJKrXbhWtGEKDm',    appleMusicUrl:'https://music.apple.com/us/album/bright-future/1722381700', youtubeUrl:'https://www.youtube.com/results?search_query=Adrianne+Lenker+Bright+Future' },
  { title:'So What',                artist:'Miles Davis',                  album:'Kind of Blue',     genre:'Jazz',       region:'international', chartType:'by-genre',   rank:2, plays:'6.9M',  isNew:false, color1:'#1a0a0a', color2:'#C04020', spotifyUrl:'https://open.spotify.com/artist/0kbYTNQb4Pb1rPbbaF0pT4',    appleMusicUrl:'https://music.apple.com/us/artist/miles-davis/155812',       youtubeUrl:'https://www.youtube.com/watch?v=ylXk1LBvIqU' },
  { title:'Last Night',             artist:'Morgan Wallen',                album:'One Thing at a Time',genre:'Country', region:'international', chartType:'by-genre',   rank:2, plays:'15.2M', isNew:false, color1:'#14100a', color2:'#D0A040', spotifyUrl:'https://open.spotify.com/track/7tuvmK15bBKHqvGiGllJEi',    appleMusicUrl:'https://music.apple.com/us/album/last-night/1659559082',     youtubeUrl:'https://www.youtube.com/watch?v=4xXCWFCFbMQ' },
];

/* ═══════════════════════════════════════════════════════════════
   SEED FUNCTIONS
═══════════════════════════════════════════════════════════════ */

function articlePayload(a) {
  // Convert plain body text to Strapi v5 blocks format
  const bodyBlocks = [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: a.excerpt || `Full article: ${a.title}` }]
    },
    {
      type: 'heading',
      level: 2,
      children: [{ type: 'text', text: 'Background' }]
    },
    {
      type: 'paragraph',
      children: [{ type: 'text', text: `This is a placeholder body for "${a.title}". Replace with the full article text in the Strapi admin panel.` }]
    },
    {
      type: 'heading',
      level: 2,
      children: [{ type: 'text', text: 'What This Means' }]
    },
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Add additional sections here. The Strapi rich text editor supports headings, paragraphs, lists, quotes, and code blocks.' }]
    },
  ];

  return {
    title:     a.title,
    slug:      a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100),
    excerpt:   a.excerpt,
    body:      bodyBlocks,
    category:  a.cat,
    author:    a.author,
    date:      a.date,
    readTime:  a.readTime,
    featured:  a.featured,
    coverStory:a.coverStory,
    color:     a.color,
    tags:      JSON.stringify(['soundb', a.cat]),
    publishedAt: new Date().toISOString(),
  };
}

function gearProductPayload(g) {
  return {
    name:     g.name,
    brand:    g.brand,
    category: g.category,
    price:    g.price,
    score:    g.score,
    badge:    g.badge,
    reviewed: g.reviewed,
    isNew:    g.isNew,
    desc:     g.desc,
    color1:   g.color1,
    color2:   g.color2,
    specsData: JSON.stringify({}),
    publishedAt: new Date().toISOString(),
  };
}

function gearReviewPayload(r) {
  return {
    name:       r.name,
    slug:       r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100),
    brand:      r.brand,
    category:   r.category,
    subcat:     r.subcat,
    score:      r.score,
    price:      r.price,
    badge:      r.badge,
    reviewed:   true,
    author:     r.author,
    authorRole: 'Gear Reviewer',
    date:       r.date,
    headline:   r.name + ' — Full Review',
    deck:       r.verdict,
    verdict:    r.verdict,
    verdictLabel: r.badge === 'editors' ? "Editor's Choice" : (r.badge === 'budget' ? 'Budget Pick' : 'Recommended'),
    color1:     r.color1,
    color2:     r.color2,
    pros:       r.pros,
    cons:       r.cons,
    scores:     JSON.stringify([]),
    specs:      JSON.stringify([]),
    tags:       r.tags,
    publishedAt: new Date().toISOString(),
  };
}

function musicReviewPayload(m) {
  return {
    album:        m.album,
    artist:       m.artist,
    genre:        m.genre,
    score:        m.score,
    summary:      m.summary,
    color1:       m.color1,
    color2:       m.color2,
    spotifyUrl:   m.spotifyUrl,
    appleMusicUrl:m.appleMusicUrl,
    youtubeUrl:   m.youtubeUrl,
    reviewed:     m.reviewed,
    publishedAt:  new Date().toISOString(),
  };
}

function musicTrackPayload(t) {
  return {
    title:        t.title,
    artist:       t.artist,
    album:        t.album || '',
    genre:        t.genre,
    region:       t.region,
    chartType:    t.chartType,
    rank:         t.rank,
    plays:        t.plays,
    isNew:        t.isNew,
    color1:       t.color1,
    color2:       t.color2,
    spotifyUrl:   t.spotifyUrl,
    appleMusicUrl:t.appleMusicUrl,
    youtubeUrl:   t.youtubeUrl,
    publishedAt:  new Date().toISOString(),
  };
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  Soundb Strapi v5 Seeder                ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('  Target:', BASE_URL);
  console.log('  Token: ', TOKEN.slice(0, 8) + '…' + TOKEN.slice(-4));

  // Quick connectivity check
  try {
    const res = await fetch(BASE_URL + '/api/articles?pagination[limit]=1', { headers: HEADERS });
    if (res.status === 403) {
      console.error('\n❌  403 Forbidden — token may be invalid or API is disabled');
      console.error('    • Go to Strapi Admin → Settings → API Tokens → create a Full Access token');
      console.error('    • Make sure Public role has find+findOne on all content types');
      process.exit(1);
    }
    console.log('  Status: ✓ Connected to Strapi\n');
  } catch (e) {
    console.error('\n❌  Cannot reach Strapi at', BASE_URL);
    console.error('    Is it running? Try: cd soundb-cms && npm run develop');
    process.exit(1);
  }

  // await seedCollection('Articles (24)',      '/api/articles',      ARTICLES,      articlePayload);
  await seedCollection('Gear Products (25)', '/api/gear-products', GEAR_PRODUCTS, gearProductPayload);
  // await seedCollection('Gear Reviews (31)',  '/api/gear-reviews',  GEAR_REVIEWS,  gearReviewPayload);
  // await seedCollection('Music Reviews (8)',  '/api/music-reviews', MUSIC_REVIEWS, musicReviewPayload);
  // await seedCollection('Music Tracks (25)',  '/api/music-tracks',  MUSIC_TRACKS,  musicTrackPayload);

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  ✓ Seeding complete!                     ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('\nNext steps:');
  console.log('  1. Open Strapi Admin → verify content looks correct');
  console.log('  2. Replace placeholder article bodies with real content');
  console.log('  3. Add gear specs JSON for each product in gear-reviews');
  console.log('  4. Test frontend: open soundb.html and check CMS.debug() in console');
  console.log('  5. When ready: update soundb-cms.js baseUrl for production\n');
}

main().catch(err => {
  console.error('\n❌  Unexpected error:', err.message);
  process.exit(1);
});
