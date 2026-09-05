const express = require('express');  //framework for creating a web server and API's
const axios   = require('axios');    // used to fetch data from websites & API's
const cors    = require('cors');       // allow  front-end and back-end to talk to each other
const xml2js  = require('xml2js');     // used to convert XML to JSON
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GHANA_FEEDS = [
  {
    name: 'MyJoyOnline',
    urls: [
      'https://www.myjoyonline.com/feed/',
      'https://myjoyonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Citi Newsroom',
    urls: [
      'https://citinewsroom.com/feed/',
      'https://citifmonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Graphic Online',
    urls: [
      'https://www.graphic.com.gh/feed/',
      'https://graphic.com.gh/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Ghana News Agency',
    urls: [
      'https://www.ghananewsagency.org/rss.xml',
      'https://ghananewsagency.org/rss.xml',
    ],
    type: 'Government',
  },
  {
    name: 'Adom Online',
    urls: [
      'https://www.adomonline.com/feed/',
      'https://adomonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: '3News (TV3)',
    urls: [
      'https://3news.com/feed/',
      'https://www.3news.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'GBC Ghana Online',
    urls: [
      'https://gbcghanaonline.com/feed/',
      'https://www.gbcghanaonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Pulse Ghana',
    urls: [
      'https://www.pulse.com.gh/rss',
      'https://pulse.com.gh/rss',
    ],
    type: 'News',
  },
  {
    name: 'Modern Ghana',
    urls: [
      'https://www.modernghana.com/rss/news.aspx',
      'https://modernghana.com/rss/news.aspx',
    ],
    type: 'News',
  },
  {
    name: 'Business & Financial Times',
    urls: [
      'https://thebftonline.com/feed/',
      'https://www.thebftonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Daily Guide Network',
    urls: [
      'https://www.dailyguideafrica.com/feed/',
      'https://dailyguideafrica.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'GhanaWeb',
    urls: [
      'https://www.ghanaweb.com/GhanaHomePage/rss/Ghana.xml',
      'https://ghanaweb.com/GhanaHomePage/rss/Ghana.xml',
    ],
    type: 'News',
  },
];

const INTERNATIONAL_FEEDS = [
  {
    name: 'The Hacker News',
    urls: ['https://feeds.feedburner.com/TheHackersNews'],
    type: 'Threat Intel',
  },
  {
    name: 'BleepingComputer',
    urls: ['https://www.bleepingcomputer.com/feed/'],
    type: 'News',
  },
  {
    name: 'SecurityWeek',
    urls: ['https://www.securityweek.com/feed/'],
    type: 'Threat Intel',
  },
  {
    name: 'Dark Reading',
    urls: ['https://www.darkreading.com/rss.xml'],
    type: 'Threat Intel',
  },
  {
    name: 'CISA Advisories',
    urls: ['https://www.cisa.gov/cybersecurity-advisories/all.xml'],
    type: 'Government',
  },
  {
    name: 'Krebs on Security',
    urls: ['https://krebsonsecurity.com/feed/'],
    type: 'Threat Intel',
  },
  {
    name: 'BBC Tech News',
    urls: ['http://feeds.bbci.co.uk/news/technology/rss.xml'],
    type: 'News',
  },
];

const ALL_FEEDS = [...GHANA_FEEDS, ...INTERNATIONAL_FEEDS];



function guessThreatLevel(text = '') {
  const t = text.toLowerCase();
  if (t.includes('ransomware') || t.includes('zero-day') || t.includes('critical') || t.includes('rce') || t.includes('lockbit')) return 'Critical';
  if (t.includes('phishing') || t.includes('malware') || t.includes('exploit') || t.includes('cve-') || t.includes('breach')) return 'High';
  if (t.includes('warning') || t.includes('alert') || t.includes('advisory') || t.includes('vulnerability') || t.includes('patch')) return 'Medium';
  return 'Low';
}

function guessCategory(text = '') {
  const t = text.toLowerCase();

  if (t.includes('ransomware') || t.includes('lockbit') || t.includes('blackcat') || t.includes('extortion')) return 'Ransomware';
  if (t.includes('cve-') || t.includes('vulnerability') || t.includes('patch tuesday') || t.includes('zero-day') || t.includes('exploit')) return 'Vulnerabilities';
  if (t.includes('data breach') || t.includes('data leak') || t.includes('exposed database') || t.includes('stolen records')) return 'Data Breaches';
  if (t.includes('malware') || t.includes('trojan') || t.includes('spyware') || t.includes('keylogger') || t.includes('botnet') || t.includes('infostealer')) return 'Malware';
  if (t.includes('ai ') || t.includes('chatgpt') || t.includes('artificial intelligence') || t.includes('llm') || t.includes('deepfake')) return 'AI & Security';
  if (t.includes('apt') || t.includes('threat actor') || t.includes('campaign') || t.includes('espionage') || t.includes('cyberattack') || t.includes('ioc') || t.includes('threat intel')) return 'Threat Intelligence';
  if (t.includes('phishing') || t.includes('spoof') || t.includes('smishing') || t.includes('credential')) return 'Phishing';
  if (t.includes('fraud') || t.includes('scam') || t.includes('momo') || t.includes('sim swap')) return 'Fraud & Scams';
  if (t.includes('advisory') || t.includes('cisa') || t.includes('government') || t.includes('bank of ghana')) return 'Government Advisory';
  if (t.includes('cyber') || t.includes('security') || t.includes('hacker') || t.includes('breach')) return 'Cyber News';
  if (t.includes('technology') || t.includes('software') || t.includes('tech ') || t.includes('apple') || t.includes('google') || t.includes('microsoft')) return 'Technology';

  return 'General News';
}

const GHANA_FEED_KEYWORDS = [
  'myjoy', 'citi', 'graphic', 'ghana', 'adom', '3news', 'gbc',
  'pulse', 'modernghana', 'bft', 'dailyguide', 'ghanaweb', 'csa'
];

function guessRegion(text = '', feedName = '') {
  const t = text.toLowerCase();
  const fn = feedName.toLowerCase();

  // 1. Is it from a Ghanaian feed or mentioning Ghana / Ghanaian locations / Ghanaian entities?
  const isGhanaianFeed = GHANA_FEED_KEYWORDS.some(k => fn.includes(k));
  const hasGhanaianKeywords =
    /\b(ghana|ghanaian|ghanaians|accra|kumasi|tamale|tema|takoradi|sekondi|sunyani|koforidua|cape coast|bolgatanga|wa|ho|cedi|cedis|momo|mobile money|csa ghana|gra|bank of ghana)\b/i.test(t);

  if (isGhanaianFeed || hasGhanaianKeywords) {
    return 'Ghana';
  }

  // 2. Strict International Regional Classification (whole-word matching)
  if (/\b(nigeria|kenya|south africa|egypt|morocco|ethiopia|uganda|africa)\b/i.test(t)) {
    return 'Africa';
  }
  if (/\b(united states|usa|u\.s\.|canada|mexico|washington|pentagon|fbi|cisa|north america)\b/i.test(t)) {
    return 'North America';
  }
  if (/\b(europe|european|uk|britain|germany|france|russia|ukraine|poland|netherlands|sweden|spain|italy)\b/i.test(t)) {
    return 'Europe';
  }
  if (/\b(china|chinese|japan|japanese|india|indian|south korea|korea|taiwan|asia|asian)\b/i.test(t)) {
    return 'Asia';
  }
  if (/\b(middle east|israel|israeli|iran|iranian|saudi|uae|dubai|qatar)\b/i.test(t)) {
    return 'Middle East';
  }
  if (/\b(brazil|argentina|colombia|chile|peru|south america|latin america)\b/i.test(t)) {
    return 'South America';
  }
  if (/\b(australia|australian|new zealand|oceania)\b/i.test(t)) {
    return 'Oceania';
  }

  return 'Global';
}

const TAG_KEYWORDS = [
  'ransomware','phishing','malware','fraud','scam','data breach',
  'momo','sim swap','hack','cybercrime','deepfake','csa ghana',
  'mobile money','bank of ghana','mtn','telecel','airtel',
  'social engineering','crypto','bitcoin','gra','ncsc','digital',
];

function extractTags(text = '') {
  const lower = text.toLowerCase();
  return TAG_KEYWORDS.filter(tag => lower.includes(tag)).slice(0, 5);
}

// Safely extract a string from any xml2js value shape
const str = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.length > 0 ? str(val[0]) : '';
  if (typeof val === 'object' && val._) return val._;
  return String(val);
};


async function tryFetchUrl(url) {
  // We make the request with a real browser User-Agent string.
  // Some news servers block requests that look like bots.
  return axios.get(url, {
    timeout: 10000,
    maxRedirects: 5,
    headers: {
      'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept':          'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control':   'no-cache',
    },
  });
}

async function fetchRSSFeed(feed) {
  let lastError = null;

  // Try each URL for this feed until one succeeds
  for (const url of feed.urls) {
    try {
      const response = await tryFetchUrl(url);

      // Parse XML → JavaScript object
      const parsed = await xml2js.parseStringPromise(response.data, {
        explicitArray: false,
        ignoreAttrs:   false,
        explicitRoot:  true,
      });

      // Handle RSS 2.0 (<item>) and Atom (<entry>) formats
      const root     = parsed?.rss?.channel || parsed?.feed || parsed?.['rdf:RDF'] || parsed;
      let   rawItems = root?.item || root?.entry || [];
      if (!rawItems || rawItems === '') rawItems = [];
      const allItems = Array.isArray(rawItems) ? rawItems : [rawItems];

      const mapped = allItems.map((item, index) => {
        if (!item) return null;

        const title = str(item.title);
        const summaryRaw = item.description || item.summary || item['content:encoded'] || '';
        const summary    = str(summaryRaw).replace(/<[^>]+>/g, '').trim().slice(0, 400);

        let link = '';
        if (item.link) {
          if (typeof item.link === 'string')         link = item.link;
          else if (item.link.$ && item.link.$.href)  link = item.link.$.href;
          else if (Array.isArray(item.link))         link = item.link[0]?.$?.href || str(item.link[0]);
          else                                       link = str(item.link);
        }
        if (!link) link = url;

        const pubDate = str(item.pubDate || item.published || item.updated || '');
        const combined = `${title} ${summary}`;

        // Robust image extraction
        let imageUrl = '';
        if (item.enclosure && item.enclosure.$ && item.enclosure.$.url) {
          imageUrl = item.enclosure.$.url;
        } else if (item['media:content']) {
          const mc = item['media:content'];
          imageUrl = mc.$?.url || mc.url || (Array.isArray(mc) ? mc[0]?.$?.url || mc[0]?.url : '');
        } else if (item['media:thumbnail']) {
          const mt = item['media:thumbnail'];
          imageUrl = mt.$?.url || mt.url || (Array.isArray(mt) ? mt[0]?.$?.url || mt[0]?.url : '');
        } else {
          const match = String(summaryRaw).match(/<img[^>]+src=["']([^"']+)["']/i);
          if (match) imageUrl = match[1];
        }

        return {
          id:        `${feed.name.replace(/\s/g,'-')}-${index}-${Date.now()}`,
          title:     title || 'Untitled Article',
          summary:   summary || 'No description available.',
          source:    feed.name,
          sourceUrl: link,
          category:  guessCategory(combined),
          level:     guessThreatLevel(combined),
          region:    guessRegion(combined, feed.name),
          // Parse the date — fall back to today if parsing fails
          date:      pubDate
            ? (() => { try { return new Date(pubDate).toISOString().slice(0, 10); } catch { return new Date().toISOString().slice(0, 10); } })()
            : new Date().toISOString().slice(0, 10),
          tags:      extractTags(combined),
          feedType:  feed.type,
          isDemo:    false,
          imageUrl:  imageUrl || undefined,
        };
      }).filter(Boolean);

      console.log(`  ✓ ${feed.name}: ${mapped.length} articles (${url})`);
      return { articles: mapped, activeUrl: url, success: true };

    } catch (err) {
      console.warn(`  ✗ ${feed.name} [${url}]: ${err.message}`);
      lastError = err.message;
      // Try the next URL in the list
    }
  }

  // All URLs for this feed failed
  return { articles: [], activeUrl: null, success: false, error: lastError };
}

// GET /api/threats
// Returns all articles from all feeds + always includes demo incidents.
app.get('/api/threats', async (req, res) => {
  console.log('\n📡 /api/threats — fetching RSS feeds…');
  const startTime = Date.now();

  // Optional date filter
  const daysParam = parseInt(req.query.days);
  const cutoff    = isNaN(daysParam) ? null : new Date(Date.now() - daysParam * 86400000);
  if (cutoff) console.log(`   Date filter: last ${daysParam} day(s) (since ${cutoff.toISOString().slice(0,10)})`);

  try {
    // Fetch ALL feeds simultaneously using Promise.allSettled.
    // allSettled means: even if some feeds fail, the ones that succeed still return.
    const results = await Promise.allSettled(
      ALL_FEEDS.map(feed => fetchRSSFeed(feed))
    );

    // Collect articles from every feed that returned something
    const allArticles = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value.articles);

    console.log(`   Total raw articles before dedup: ${allArticles.length}`);

    // Remove exact duplicate headlines (same title from different feed formats)
    const seen   = new Set();
    const unique = allArticles.filter(article => {
      const key = article.title.toLowerCase().trim().slice(0, 70);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Apply optional date range filter
    const dateFiltered = cutoff
      ? unique.filter(a => {
          try { return new Date(a.date) >= cutoff; } catch { return true; }
        })
      : unique;

    // Sort newest first
    dateFiltered.sort((a, b) => {
      try { return new Date(b.date).getTime() - new Date(a.date).getTime(); }
      catch { return 0; }
    });

    const finalArticles = dateFiltered;

    const elapsed = Date.now() - startTime;
    console.log(`✓ Returning ${finalArticles.length} live articles in ${elapsed}ms\n`);

    res.json({
      results:     finalArticles,
      count:       finalArticles.length,
      liveCount:   dateFiltered.length,
      demoCount:   0,
      fetchTimeMs: elapsed,
      fetchedAt:   new Date().toISOString(),
      source:      'Global & Ghana RSS feeds',
    });

  } catch (error) {
    console.error('FATAL /api/threats error:', error.message);
    res.json({
      results:     [],
      count:       0,
      liveCount:   0,
      demoCount:   0,
      fetchTimeMs: Date.now() - startTime,
      fetchedAt:   new Date().toISOString(),
      source:      'Server Error',
      error:       error.message,
    });
  }
});

// Checks which feeds are reachable right now.
app.get('/api/feed-status', async (req, res) => {
  console.log(' /api/feed-status — pinging all feeds…');

  const checks = await Promise.allSettled(
    ALL_FEEDS.map(async feed => {
      // Try each URL for this feed
      for (const url of feed.urls) {
        try {
          await axios.get(url, {
            timeout: 6000,
            maxRedirects: 5,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; GhanaCyberMonitor/1.0)',
              'Accept':     'application/rss+xml, application/xml, text/xml, */*',
            },
          });
          // First URL that responds = Active
          return { name: feed.name, url, type: feed.type, status: 'Active',  checkedAt: new Date().toISOString() };
        } catch (_) {
          // Try next URL
        }
      }
      // All URLs failed = Offline
      return { name: feed.name, url: feed.urls[0], type: feed.type, status: 'Offline', checkedAt: new Date().toISOString() };
    })
  );

  const statuses = checks.map(r =>
    r.status === 'fulfilled' ? r.value : {
      name: 'Unknown', url: '', type: 'News', status: 'Error', checkedAt: new Date().toISOString(),
    }
  );

  const activeCount = statuses.filter(s => s.status === 'Active').length;
  console.log(`✓ Feed health: ${activeCount}/${statuses.length} active`);

  res.json({
    feeds:        statuses,
    activeCount,
    offlineCount: statuses.length - activeCount,
    totalCount:   statuses.length,
    checkedAt:    new Date().toISOString(),
  });
});

// GET /health  — quick server liveness check
app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    service:   'Ghana Cyber Monitor API',
    feeds:     ALL_FEEDS.length,
    timestamp: new Date().toISOString(),
  });
});


// ─── Cloudflare Workers AI Configuration ────────────────────────────────────
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '';
const CF_API_TOKEN  = process.env.CF_API_TOKEN  || '';
const CF_AI_MODEL   = '@cf/meta/llama-3.1-8b-instruct';
const CF_AI_URL     = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_AI_MODEL}`;

// Simple in-memory rate limiter: max 10 requests per IP per minute
const rateLimitMap = new Map();
const RATE_LIMIT_MAX      = 10;
const RATE_LIMIT_WINDOW   = 60 * 1000; // 1 minute

function checkRateLimit(ip) {
  const now    = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
  if (now > record.resetAt) {
    // Window expired — reset
    record.count   = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW;
  }
  record.count += 1;
  rateLimitMap.set(ip, record);
  const remaining = Math.max(0, RATE_LIMIT_WINDOW - (now - (record.resetAt - RATE_LIMIT_WINDOW)));
  return { allowed: record.count <= RATE_LIMIT_MAX, count: record.count, resetIn: Math.ceil(remaining / 1000) };
}

// Cybersecurity & Public Safety system prompt
const AI_SYSTEM_PROMPT = `You are CyberGuard AI, an expert Cybersecurity and Public Safety Assistant for the Ghana Cyber Monitor platform.

Your role is to:
- Educate users about cybersecurity threats: phishing, malware, ransomware, fraud, scams, data breaches, SIM swap attacks, mobile money (MoMo) fraud, social engineering, and more.
- Provide clear, actionable security recommendations and best practices.
- Guide users through incident response steps when they suspect a cyberattack or security breach.
- Explain digital safety, online privacy, and how to protect personal data.
- Provide disaster preparedness and public safety information, including emergency management guidance.
- Explain cyber threats in simple, non-technical language accessible to everyday Ghanaians and Africans.
- Offer guidance specific to the Ghanaian and African digital landscape (MoMo fraud, GRA phishing, CSA Ghana advisories, etc.).

Guidelines:
- Be friendly, professional, and reassuring — users may be distressed if they've experienced a cyberattack.
- Keep responses concise yet thorough. Use bullet points or numbered lists when helpful.
- Never provide information that could be used to conduct cyberattacks.
- If a user reports an active emergency or crime in progress, advise them to contact Ghana Police Service (191) or CSA Ghana.
- Always encourage users to verify information from official sources like csa.gov.gh, gra.gov.gh, and bankofghana.org.gh.
- Use markdown formatting (bold, bullet points, numbered lists) to make responses readable.`;

// POST /api/ai-chat
// Body: { message: string, history: Array<{role: 'user'|'assistant', content: string}> }
app.post('/api/ai-chat', async (req, res) => {
  // Rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another message.',
      resetIn: rateCheck.resetIn,
    });
  }

  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'A message is required.' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long. Please keep it under 2000 characters.' });
  }
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    return res.status(503).json({ error: 'AI service is not configured. Please check server environment variables.' });
  }

  // Build messages array for the Cloudflare AI API
  const messages = [
    { role: 'system', content: AI_SYSTEM_PROMPT },
    // Include recent conversation history (last 10 exchanges max)
    ...history.slice(-20).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message.trim() },
  ];

  try {
    console.log(`\n🤖 /api/ai-chat — IP: ${clientIp}, message length: ${message.length}`);
    const cfResponse = await axios.post(CF_AI_URL, { messages }, {
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type':  'application/json',
      },
      timeout: 30000,
    });

    const aiResult = cfResponse.data?.result?.response;
    if (!aiResult) {
      console.error('Cloudflare AI returned empty result:', JSON.stringify(cfResponse.data));
      return res.status(502).json({ error: 'The AI service returned an empty response. Please try again.' });
    }

    console.log(`  ✓ AI response: ${aiResult.length} chars`);
    return res.json({ response: aiResult });

  } catch (err) {
    console.error('AI chat error:', err?.response?.data || err.message);
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      return res.status(502).json({ error: 'AI service authentication failed. Please contact the administrator.' });
    }
    if (status === 429) {
      return res.status(429).json({ error: 'AI service is temporarily busy. Please try again in a moment.' });
    }
    return res.status(502).json({ error: 'Failed to reach the AI service. Please try again.' });
  }
});

// Support --port or -p CLI flags, process.env.PORT, process.env.SERVER_PORT, or default 3001
const args = process.argv.slice(2);
const portArg = args.find(a => a.startsWith('--port='))?.split('=')[1]
  || (args.indexOf('-p') !== -1 ? args[args.indexOf('-p') + 1] : null);

const INITIAL_PORT = parseInt(portArg || process.env.SERVER_PORT || process.env.PORT || '3001', 10);

function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`\n🇬🇭  Ghana Cyber Monitor API — http://localhost:${portToUse}`);
    console.log(`  Watching ${ALL_FEEDS.length} RSS feeds\n`);
    console.log('Endpoints:');
    console.log(`  GET /api/threats          → All live articles`);
    console.log(`  GET /api/threats?days=1   → Today only`);
    console.log(`  GET /api/threats?days=7   → Last 7 days`);
    console.log(`  GET /api/feed-status      → Live feed health check`);
    console.log(`  GET /health               → Server status\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToUse} is in use. Retrying on port ${portToUse + 1}...`);
      startServer(portToUse + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

if (require.main === module) {
  startServer(INITIAL_PORT);
}

module.exports = app;