import React, { useState, useEffect } from 'react';
import {
  Shield, Bot, Rss, MapPin, Activity,
  User, HelpCircle, PhoneCall, ExternalLink, ChevronDown, RefreshCw, Send
} from 'lucide-react';

interface AboutGuidePageProps {
  onOpenAI: () => void;
}

const DEMO_SCENARIOS = [
  {
    userPrompt: "Analyze the latest ransomware threats affecting organizations.",
    aiResponse: "🔍 **Ransomware Threat Intelligence Analysis:**\n\nRecent telemetry shows an influx of double-extortion ransomware campaigns targeting cloud enterprise infrastructure.\n\n**Key Indicators of Compromise (IOCs):**\n• Exploitation of unpatched VPN gateways\n• Malicious PowerShell & Cobalt Strike beacons\n\n**Recommended Countermeasures:**\n1. Enforce Multi-Factor Authentication (MFA) across all endpoints.\n2. Implement strict network segmentation for critical backups.\n3. Apply zero-day security patches immediately.",
  },
  {
    userPrompt: "Hi! I got an SMS claiming to be from my bank asking to approve a SIM swap request. Is this a scam?",
    aiResponse: "⚠️ **CRITICAL SCAM WARNING!** Do NOT approve the request or share your OTP/PIN.\n\n**Immediate Response Steps:**\n1. Ignore & cancel the SIM swap alert.\n2. Change your banking & mobile wallet PIN immediately.\n3. Contact your telco provider to freeze unauthorized SIM updates.\n4. Report to Cyber Security Authority (CSA Ghana) by dialing 292.",
  },
  {
    userPrompt: "Explain CVE-2024-38077 and how to mitigate it.",
    aiResponse: "🛡️ **CVE-2024-38077 Vulnerability Overview:**\n\nCritical Remote Code Execution (RCE) vulnerability in Windows Remote Desktop Licensing Service.\n\n**Risk Rating:** Critical (CVSS 9.8)\n**Mitigation:** Apply Microsoft's July 2024 Security Update immediately. If patching cannot be completed, disable the Remote Desktop Licensing Service if unneeded.",
  },
];

export function AboutGuidePage({ onOpenAI }: AboutGuidePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Realistic AI Assistant Interactive Demo State Machine
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [typedInputText, setTypedInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [aiState, setAiState] = useState<'idle' | 'thinking' | 'generating' | 'done'>('idle');
  const [aiTypedLength, setAiTypedLength] = useState(0);

  const currentScenario = DEMO_SCENARIOS[scenarioIdx];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // STEP 1: User typing in input box character by character
    if (typedInputText.length < currentScenario.userPrompt.length && chatMessages.length === 0 && !isSending && aiState === 'idle') {
      timer = setTimeout(() => {
        setTypedInputText(currentScenario.userPrompt.slice(0, typedInputText.length + 1));
      }, 35);
    }
    // STEP 2: Finish typing -> simulate pressing Send
    else if (typedInputText.length === currentScenario.userPrompt.length && chatMessages.length === 0 && !isSending && aiState === 'idle') {
      timer = setTimeout(() => {
        setIsSending(true);
      }, 500);
    }
    // STEP 3: Message sent -> move to chat, clear input, start AI thinking
    else if (isSending) {
      timer = setTimeout(() => {
        setChatMessages([{ sender: 'user', text: currentScenario.userPrompt }]);
        setTypedInputText('');
        setIsSending(false);
        setAiState('thinking');
      }, 400);
    }
    // STEP 4: AI Thinking -> wait 1.8s then start generating
    else if (aiState === 'thinking') {
      timer = setTimeout(() => {
        setAiState('generating');
        setAiTypedLength(1);
      }, 1800);
    }
    // STEP 5: AI Generating -> stream text character by character
    else if (aiState === 'generating') {
      if (aiTypedLength < currentScenario.aiResponse.length) {
        timer = setTimeout(() => {
          setAiTypedLength(prev => Math.min(prev + 2, currentScenario.aiResponse.length));
        }, 18);
      } else {
        setAiState('done');
      }
    }
    // STEP 6: Finished scenario -> pause 5s then advance to next scenario
    else if (aiState === 'done') {
      timer = setTimeout(() => {
        setScenarioIdx(prev => (prev + 1) % DEMO_SCENARIOS.length);
        setTypedInputText('');
        setChatMessages([]);
        setAiState('idle');
        setAiTypedLength(0);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [typedInputText, isSending, chatMessages, aiState, aiTypedLength, currentScenario, scenarioIdx]);

  const handleRestartDemo = () => {
    setScenarioIdx(0);
    setTypedInputText('');
    setChatMessages([]);
    setAiState('idle');
    setAiTypedLength(0);
    setIsSending(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm transition-colors">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Platform Guide &amp; Assistance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
            About Cyber Monitor 🇬🇭
          </h1>
          <p className="text-base sm:text-lg font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Ghana’s premier threat intelligence aggregator and global cyber security platform — empowering security analysts, IT teams, and organizations with real-time threat news, vulnerability alerts, regional analytics, and an interactive AI assistant.
          </p>
        </div>
      </div>

      {/* Realistic Live AI Conversation Demo */}
      <div className="bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
        
        {/* Header & Description */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <Bot className="w-3.5 h-3.5" /> Interactive Demonstration
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Live AI Assistant Conversation
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Experience how CyberGuard AI analyzes security queries and delivers real-time threat intelligence guidance.
          </p>
        </div>

        {/* Real Chat Interface Window */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[460px]">
          
          {/* Header */}
          <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-black text-zinc-700 dark:text-zinc-300 ml-2">CyberGuard_AI_Session.log</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-[10px] font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Online</span>
            </div>
          </div>

          {/* Conversation Body */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 bg-white dark:bg-zinc-950 font-sans text-xs sm:text-sm">
            
            {chatMessages.length === 0 && aiState === 'idle' && (
              <div className="h-full flex items-center justify-center text-center p-6">
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                  User is preparing a query below...
                </p>
              </div>
            )}

            {/* User Bubble */}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="flex items-start justify-end gap-2.5">
                <div className="bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-sm max-w-[85%] font-medium shadow-sm leading-relaxed">
                  {msg.text}
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
              </div>
            ))}

            {/* Thinking Animation State */}
            {aiState === 'thinking' && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-2 font-semibold">
                  <span>Analyzing threat intelligence...</span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 180}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI Streaming Response Bubble */}
            {(aiState === 'generating' || aiState === 'done') && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 rounded-2xl rounded-tl-sm max-w-[90%] whitespace-pre-wrap font-sans leading-relaxed shadow-sm">
                  {currentScenario.aiResponse.slice(0, aiTypedLength)}
                  {aiState === 'generating' && (
                    <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Interactive Simulated Input Box */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={typedInputText}
                placeholder="Ask CyberGuard AI a security question..."
                className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 outline-none"
              />
              {typedInputText.length > 0 && chatMessages.length === 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-blue-600 animate-pulse" />
              )}
            </div>
            <button
              disabled
              className={`p-2.5 rounded-xl font-bold transition-all ${
                isSending || (typedInputText.length === currentScenario.userPrompt.length && chatMessages.length === 0)
                  ? 'bg-blue-600 text-white scale-105 shadow-md'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Caption & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Simulating live AI response generation and threat intelligence processing.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRestartDemo}
              className="flex items-center gap-1.5 text-xs font-black text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Replay Demo
            </button>
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Bot className="w-4 h-4" /> Open AI Assistant
            </button>
          </div>
        </div>

      </div>

      {/* Feature Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Rss className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white">1. Verified RSS Feed Aggregation</h3>
          <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
            We pull RSS security updates every 5 minutes from top international cybersecurity portals (The Hacker News, BleepingComputer, SecurityWeek, CISA) and Ghanaian media/government sources.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white">2. Automatic Threat Classification</h3>
          <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Articles are categorized into Cyber News, Threat Intel, Ransomware, Vulnerabilities, Data Breaches, Malware, Technology, AI &amp; Security with clear threat level indicators.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white">3. Global &amp; Regional Intelligence</h3>
          <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Monitor incident distribution across global continents (Africa, North America, Europe, Asia, Middle East, South America, Oceania) and Ghanaian regions.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white">4. Feed Health &amp; Uptime Monitoring</h3>
          <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
            The Feed Health tab runs automated connectivity checks against all source endpoints to ensure uninterrupted feed ingestion.
          </p>
        </div>

      </div>

      {/* Emergency Contacts & Official Resources */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <PhoneCall className="w-6 h-6 text-red-500" />
          <div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">Cyber Incident Emergency Contacts</h3>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">If you are currently experiencing an active cybercrime or financial fraud</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <p className="text-xs font-black uppercase text-zinc-400">Cyber Security Authority (CSA)</p>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">Call / SMS 292</p>
            <p className="text-[11px] font-semibold text-zinc-500">Official incident reporting center (csa.gov.gh)</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <p className="text-xs font-black uppercase text-zinc-400">Ghana Police Service</p>
            <p className="text-xl font-black text-red-600 dark:text-red-400">Call 191 / 18555</p>
            <p className="text-[11px] font-semibold text-zinc-500">Emergency response &amp; cybercrime unit</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <p className="text-xs font-black uppercase text-zinc-400">CISA / Official Resources</p>
            <a href="https://cisa.gov" target="_blank" rel="noopener noreferrer" className="text-xs font-black text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 mt-1">
              csa.gov.gh · cisa.gov <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-[11px] font-semibold text-zinc-500">Global cybersecurity advisories &amp; verification</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 transition-colors">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white">Frequently Asked Questions (FAQ)</h3>

        <div className="space-y-3">
          {[
            {
              q: "How often are the news feeds updated?",
              a: "Feeds are pulled in real-time on demand and auto-refreshed every 5 minutes from verified global and Ghanaian news endpoints."
            },
            {
              q: "How does CyberGuard AI Assistant work?",
              a: "CyberGuard AI is powered by Cloudflare AI models trained on public safety and cybersecurity frameworks to assist with security advisories, scam identification, and incident response."
            },
            {
              q: "Are international news feeds included?",
              a: "Yes. Cyber Monitor aggregates top international cybersecurity sources (The Hacker News, BleepingComputer, SecurityWeek, CISA) as well as verified Ghanaian media outlets."
            },
            {
              q: "What should I do if my Mobile Money or bank account is compromised?",
              a: "Immediately dial your network provider code to freeze PINs, notify your bank customer service, and contact CSA Ghana at 292."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <span className="text-sm font-black text-zinc-900 dark:text-white">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 py-4 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 border-t border-zinc-200 dark:border-zinc-800 leading-relaxed bg-white dark:bg-zinc-900">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
