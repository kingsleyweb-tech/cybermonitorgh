import type { Article, ThreatCategory, DateRange } from '../types';

// fmtDate — formats an ISO date string into a readable Ghanaian date label.
export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GH', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  
// Returns true if the article should be shown, false if it should be hidden.
export function isInDateRange(articleDate: string, range: DateRange): boolean {
  if (range === 'all') return true;
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // midnight today
  const date  = new Date(articleDate);

  if (range === 'yesterday') {
    return date >= new Date(today.getTime() - 86400000) && date < today;
  }

  const offsets: Record<string, number> = { today: 0, '3days': 2, '7days': 6 };
  return date >= new Date(today.getTime() - (offsets[range] ?? 0) * 86400000);
}

// countArticlesBy — creates a function that counts articles based on a selected field.
export function countArticlesBy<K extends keyof Article>(
  articles: Article[],
  key: K,
): [string, number][] {
  const counts: Record<string, number> = {};
  articles.forEach(a => {
    const v = String(a[key] ?? 'Unspecified');
    counts[v] = (counts[v] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

// reclassifyArticle — updates article category based on keyword scanning.
export function reclassifyArticle(article: Article): Article {
  if (article.isDemo) return article;

  const t = (article.title + ' ' + article.summary).toLowerCase();

  let correctedCategory: ThreatCategory;

  if (t.includes('ransomware') || t.includes('lockbit') || t.includes('extortion')) {
    correctedCategory = 'Ransomware';
  } else if (t.includes('cve-') || t.includes('vulnerability') || t.includes('zero-day') || t.includes('exploit')) {
    correctedCategory = 'Vulnerabilities';
  } else if (
    t.includes('data breach') || t.includes('data leak') || t.includes('leaked') ||
    t.includes('exposed database') || t.includes('stolen records')
  ) {
    correctedCategory = 'Data Breaches';
  } else if (
    t.includes('malware') || t.includes('trojan') || t.includes('virus') ||
    t.includes('spyware') || t.includes('keylogger') || t.includes('botnet')
  ) {
    correctedCategory = 'Malware';
  } else if (t.includes('ai ') || t.includes('chatgpt') || t.includes('artificial intelligence') || t.includes('deepfake')) {
    correctedCategory = 'AI & Security';
  } else if (t.includes('apt') || t.includes('threat actor') || t.includes('espionage') || t.includes('ioc')) {
    correctedCategory = 'Threat Intelligence';
  } else if (
    t.includes('phishing') || t.includes('spoofed') || t.includes('impersonat') ||
    t.includes('fake sms') || t.includes('fake email') || t.includes('credential')
  ) {
    correctedCategory = 'Phishing';
  } else if (
    t.includes('fraud') || t.includes('scam') || t.includes('momo') ||
    t.includes('mobile money') || t.includes('sim swap') || t.includes('cybercrime')
  ) {
    correctedCategory = 'Fraud & Scams';
  } else if (
    t.includes('advisory') || t.includes('csa') || t.includes('ncsc') ||
    t.includes('bank of ghana') || t.includes('cyber security authority') ||
    t.includes('government cyber')
  ) {
    correctedCategory = 'Government Advisory';
  } else if (t.includes('cyber') || t.includes('security') || t.includes('hacker')) {
    correctedCategory = 'Cyber News';
  } else if (t.includes('technology') || t.includes('software') || t.includes('tech ')) {
    correctedCategory = 'Technology';
  } else {
    correctedCategory = 'General News';
  }

  if (correctedCategory === article.category) return article;
  return { ...article, category: correctedCategory };
}