import type { Article, ThreatCategory } from '../types';

export const CATEGORY_KEYWORDS: Record<ThreatCategory, string[]> = {
  'General News':        ['news', 'report', 'update'],
  'Cyber News':          ['cyber', 'security', 'hacker', 'breach'],
  'Threat Intelligence': ['apt', 'threat actor', 'campaign', 'espionage', 'ioc', 'threat intel'],
  'Vulnerabilities':     ['cve-', 'vulnerability', 'zero-day', 'exploit', 'patch tuesday'],
  'Ransomware':          ['ransomware', 'ransom', 'lockbit', 'blackcat', 'extortion'],
  'Malware':             ['malware', 'trojan', 'virus', 'spyware', 'keylogger', 'botnet', 'infostealer'],
  'Data Breaches':       ['data breach', 'data leak', 'leaked', 'exposed database', 'stolen records'],
  'Technology':          ['technology', 'software', 'tech', 'cloud', 'apple', 'microsoft'],
  'AI & Security':       ['ai', 'chatgpt', 'artificial intelligence', 'llm', 'deepfake'],
  'Fraud & Scams':       ['fraud', 'scam', 'momo', 'mobile money', 'sim swap', 'cybercrime', 'identity theft'],
  'Government Advisory': ['advisory', 'csa', 'ncsc', 'bank of ghana', 'cyber security authority', 'government cyber'],
  'Phishing':            ['phishing', 'spoof', 'fake sms', 'fake email', 'credential', 'impersonat', 'smishing'],
  'Non-Threat News':     []
};

/**
 * Classifies an article title & summary into one of our predefined ThreatCategories.
 */
export function classifyText(title: string, summary: string): ThreatCategory {
  const text = `${title} ${summary}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Non-Threat News' || category === 'General News') continue;
    if (keywords.some(keyword => text.includes(keyword))) {
      return category as ThreatCategory;
    }
  }
  return 'General News';
}

/**
 * Groups a list of articles by their categories.
 */
export function groupArticlesByCategory(articles: Article[]): Record<ThreatCategory, Article[]> {
  const grouped: Record<ThreatCategory, Article[]> = {
    'General News':        [],
    'Cyber News':          [],
    'Threat Intelligence': [],
    'Vulnerabilities':     [],
    'Ransomware':          [],
    'Malware':             [],
    'Data Breaches':       [],
    'Technology':          [],
    'AI & Security':       [],
    'Fraud & Scams':       [],
    'Government Advisory': [],
    'Phishing':            [],
    'Non-Threat News':     [],
  };
  
  articles.forEach(article => {
    if (grouped[article.category]) {
      grouped[article.category].push(article);
    } else {
      grouped['General News'].push(article);
    }
  });
  
  return grouped;
}
