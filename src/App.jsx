import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  Search, Sun, Moon, Share2, Bookmark, Heart, Send, CheckCircle2, 
  MapPin, Radio, Film, Flame, Bell, User, ArrowLeft, SendHorizontal, 
  ChevronRight, Calendar, Landmark, BookOpen, AlertTriangle, Cpu, Plus, 
  TrendingUp, Award, Newspaper, Smartphone, Laptop, Check, X, BellOff, MessageSquare,
  Settings, Users, BarChart3, Image, Video, Megaphone, RefreshCw, Layers, Globe,
  Lock, KeyRound, LogOut, FileText, UploadCloud, Copy, HelpCircle, DollarSign, DownloadCloud,
  Play, ThumbsUp, Smile, AlertOctagon, HelpCircle as QuestionIcon
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';
let socket;

export default function App() {
  // VIEW & BRANDING STATES
  const [activeView, setActiveView] = useState('desktop'); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('telugu');
  const [activeMobileTab, setActiveMobileTab] = useState('home');
  const [currentPage, setCurrentPage] = useState('home'); 
  const [selectedArticleId, setSelectedArticleId] = useState(1);
  const [districtFilter, setDistrictFilter] = useState('Visakhapatnam');
  const [electionState, setElectionState] = useState('ap');
  const [bookmarks, setBookmarks] = useState([2]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // JWT AUTHENTICATION STATES
  const [cmsToken, setCmsToken] = useState(localStorage.getItem('cms_token') || '');
  const [cmsUser, setCmsUser] = useState(JSON.parse(localStorage.getItem('cms_user')) || null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // SYSTEM STATES FROM PRODUCTION BACKEND
  const [articles, setArticles] = useState([]);
  const [tickerItems, setTickerItems] = useState([]);
  const [videos, setVideos] = useState([]);
  const [ads, setAds] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalArticles: 0,
    totalViews: 0,
    liveVisitors: 8240,
    notificationCTR: 8.5,
    estimatedEarnings: 494.90
  });

  // NEW DYNAMIC DATASETS FOR PUBLIC LAUNCH
  const [reporters, setReporters] = useState([]);
  const [selectedReporter, setSelectedReporter] = useState(null);
  const [livePoll, setLivePoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [liveTelecasts, setLiveTelecasts] = useState([]);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // NEW DYNAMIC MOBILE, SHORTS & MEMBERSHIP STATES
  const [showSplash, setShowSplash] = useState(true);
  const [premiumPlan, setPremiumPlan] = useState(localStorage.getItem('premium_plan') || 'free');
  const [showPremiumCheckout, setShowPremiumCheckout] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutCard, setCheckoutCard] = useState('');
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [shortsList, setShortsList] = useState([]);
  const [epapersList, setEpapersList] = useState([]);
  const [bureauStats, setBureauStats] = useState({});
  const [pushAnalytics, setPushAnalytics] = useState({});
  const [rankingStats, setRankingStats] = useState({});
  const [voiceReaderRate, setVoiceReaderRate] = useState(1);
  const [voiceReaderIsPlaying, setVoiceReaderIsPlaying] = useState(false);
  const [activeVoiceArticleId, setActiveVoiceArticleId] = useState(null);

  // SHORTS STUDIO FOR CMS
  const [newShortTitle, setNewShortTitle] = useState('');
  const [newShortCaption, setNewShortCaption] = useState('');
  const [newShortImage, setNewShortImage] = useState('/hero.png');
  const [newShortDistrict, setNewShortDistrict] = useState('Visakhapatnam');
  const [aiShortTopic, setAiShortTopic] = useState('');
  const [aiShortResult, setAiShortResult] = useState(null);
  const [isAiShortLoading, setIsAiShortLoading] = useState(false);

  // ADVERTISER SELF-SERVICE CAMPAIGN SCHEDULER
  const [showAdvertiserDashboard, setShowAdvertiserDashboard] = useState(false);
  const [newAdCompany, setNewAdCompany] = useState('');
  const [newAdUrl, setNewAdUrl] = useState('/hero.png');
  const [newAdCity, setNewAdCity] = useState('Visakhapatnam');
  const [newAdBudget, setNewAdBudget] = useState('500');
  const [newAdPlacement, setNewAdPlacement] = useState('Homepage inline');
  const [newAdSuccess, setNewAdSuccess] = useState('');

  // ADVERTISER ONBOARDING STATE
  const [advCompany, setAdvCompany] = useState('');
  const [advContact, setAdvContact] = useState('');
  const [advCity, setAdvCity] = useState('Visakhapatnam');
  const [advBudget, setAdvBudget] = useState('500');
  const [advType, setAdvType] = useState('Homepage inline');
  const [onboardSuccess, setOnboardSuccess] = useState('');

  // CMS STATE
  const [activeCmsTab, setActiveCmsTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // ARTICLE WRITER FORM STATE
  const [artTitleTe, setArtTitleTe] = useState('');
  const [artTitleEn, setArtTitleEn] = useState('');
  const [artCategory, setArtCategory] = useState('Politics');
  const [artDistrict, setArtDistrict] = useState('Visakhapatnam');
  const [artDescTe, setArtDescTe] = useState('');
  const [artDescEn, setArtDescEn] = useState('');
  const [artAuthor, setArtAuthor] = useState('Srinivas Rao');
  const [artStatus, setArtStatus] = useState('Published');
  const [artPriority, setArtPriority] = useState('Normal');
  const [artPinTop, setArtPinTop] = useState(false);
  const [artSlug, setArtSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [artImgUrl, setArtImgUrl] = useState('/hero.png');
  const [cmsSuccessMsg, setCmsSuccessMsg] = useState('');

  // MEDIA UPLOADS SIMULATOR
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // LIVE TELECAST SCHEDULER STATE
  const [newLiveTitleTe, setNewLiveTitleTe] = useState('');
  const [newLiveTitleEn, setNewLiveTitleEn] = useState('');
  const [newLiveEmbed, setNewLiveEmbed] = useState('');
  const [newLiveCategory, setNewLiveCategory] = useState('Politics');

  // AI WRITER ASSISTANT MODULE STATES
  const [aiHeadlineTopic, setAiHeadlineTopic] = useState('');
  const [aiGenTeluguHeadlines, setAiGenTeluguHeadlines] = useState([]);
  const [aiGenEnglishHeadlines, setAiGenEnglishHeadlines] = useState([]);
  const [isAiHeadlineLoading, setIsAiHeadlineLoading] = useState(false);

  const [aiFullTopic, setAiFullTopic] = useState('');
  const [aiFullDistrict, setAiFullDistrict] = useState('Visakhapatnam');
  const [aiFullKeywords, setAiFullKeywords] = useState('');
  const [isAiFullLoading, setIsAiFullLoading] = useState(false);

  // SHORTS STUDIO FORM STATES
  const [shortTitle, setShortTitle] = useState('');
  const [shortCaption, setShortCaption] = useState('');
  const [shortDistrict, setShortDistrict] = useState('Visakhapatnam');
  const [shortImage, setShortImage] = useState('/vizag.png');
  const [aiShortMetaLoading, setAiShortMetaLoading] = useState(false);

  const [aiShortText, setAiShortText] = useState('');
  const [isAiBreakingLoading, setIsAiBreakingLoading] = useState(false);

  const [isVoiceTranscribing, setIsVoiceTranscribing] = useState(false);
  const [autoDetectedLoc, setAutoDetectedLoc] = useState('');

  // SITEMAPS LIST SIMULATOR FOR DISCOVER CARD
  const [sitemapPingStatus, setSitemapPingStatus] = useState('');

  // AD CLICKS & REVENUE LEDGER
  const [customAlertTitle, setCustomAlertTitle] = useState('');
  const [customAlertTitleEn, setCustomAlertTitleEn] = useState('');
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [showPwaPrompt, setShowPwaPrompt] = useState(true);

  // 1. BACKEND INITIALIZATION & WEBSOCKET SYNC
  useEffect(() => {
    fetchData();

    socket = io(BACKEND_URL);

    socket.on('connect', () => {
      console.log('⚡ Connected to Aptop Public Launch Server!');
    });

    socket.on('articles_updated', (data) => {
      setArticles(data || []);
    });

    socket.on('ticker_updated', (data) => {
      setTickerItems(data || []);
    });

    socket.on('ads_updated', (data) => {
      setAds(data || []);
    });

    socket.on('audit_updated', (data) => {
      setAuditLogs(data || []);
    });

    socket.on('poll_updated', (data) => {
      setLivePoll(data);
    });

    socket.on('live_stream_updated', (data) => {
      setLiveTelecasts(data || []);
    });

    socket.on('media_library_updated', (data) => {
      setMediaLibrary(data || []);
    });

    socket.on('shorts_updated', (data) => {
      setShortsList(data || []);
    });

    socket.on('epaper_updated', (data) => {
      setEpapersList(data || []);
    });

    socket.on('emergency_updated', (isActive) => {
      setEmergencyMode(isActive);
      if (isActive) {
        setCustomAlertTitle('🔴 ఆప్టాప్ ఎమర్జెన్సీ బ్రాడ్‌కాస్ట్: అత్యవసర పరిస్థితులు సక్రియం చేయబడ్డాయి!');
        setCustomAlertTitleEn('🔴 Emergency Broadcast: High Alert Declared in Telugu States!');
        setShowNotificationToast(true);
      }
    });

    socket.on('new_article_alert', (newArt) => {
      setCustomAlertTitle(`క్రొత్త కథనం: ${newArt.title}`);
      setCustomAlertTitleEn(`New Story: ${newArt.titleEn}`);
      setShowNotificationToast(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Mobile app splash screen trigger
  useEffect(() => {
    if (activeView === 'mobile') {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeView]);

  // Poll analytics & live data
  useEffect(() => {
    const analyticPoll = setInterval(() => {
      fetch(`${BACKEND_URL}/api/analytics`)
        .then(res => res.json())
        .then(data => setAnalytics(data))
        .catch(err => console.log('Analytics poll offline'));
    }, 8000);
    return () => clearInterval(analyticPoll);
  }, []);

  // Auto-generate Slug on English Headline change
  useEffect(() => {
    if (artTitleEn) {
      const generated = artTitleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setArtSlug(generated);
    }
  }, [artTitleEn]);

  const fetchData = async () => {
    setIsLoading(true);
    const safeFetch = async (url, fallback) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return fallback;
        const text = await res.text();
        return text ? JSON.parse(text) : fallback;
      } catch (err) {
        console.warn(`Failed safeFetch for endpoint: ${url}`, err);
        return fallback;
      }
    };

    try {
      const articlesData = await safeFetch(`${BACKEND_URL}/api/articles`, []);
      setArticles(articlesData);

      const tickerData = await safeFetch(`${BACKEND_URL}/api/ticker`, []);
      setTickerItems(tickerData);

      const adsData = await safeFetch(`${BACKEND_URL}/api/ads`, []);
      setAds(adsData);

      const analyticData = await safeFetch(`${BACKEND_URL}/api/analytics`, {
        totalArticles: 0,
        totalViews: 0,
        liveVisitors: 8240,
        notificationCTR: 8.5,
        estimatedEarnings: 494.90
      });
      setAnalytics(analyticData);

      const auditData = await safeFetch(`${BACKEND_URL}/api/audit-logs`, []);
      setAuditLogs(auditData);

      const repData = await safeFetch(`${BACKEND_URL}/api/reporters`, []);
      setReporters(repData);

      const pollData = await safeFetch(`${BACKEND_URL}/api/poll`, null);
      setLivePoll(pollData);

      const streamData = await safeFetch(`${BACKEND_URL}/api/live-streams`, []);
      setLiveTelecasts(streamData);

      const mediaData = await safeFetch(`${BACKEND_URL}/api/media-library`, []);
      setMediaLibrary(mediaData);

      const emergencyData = await safeFetch(`${BACKEND_URL}/api/emergency`, { active: false });
      setEmergencyMode(emergencyData ? emergencyData.active : false);

      const shortsData = await safeFetch(`${BACKEND_URL}/api/shorts`, []);
      setShortsList(shortsData);

      const epapersData = await safeFetch(`${BACKEND_URL}/api/epaper`, []);
      setEpapersList(epapersData);

      const bureauData = await safeFetch(`${BACKEND_URL}/api/bureau-performance`, {});
      setBureauStats(bureauData);

      const pushData = await safeFetch(`${BACKEND_URL}/api/notification-analytics`, {});
      setPushAnalytics(pushData);

      const rankingData = await safeFetch(`${BACKEND_URL}/api/search-rankings`, {});
      setRankingStats(rankingData);

    } catch (err) {
      console.error('Failed fetching server datasets, falling back.', err);
    } finally {
      setIsLoading(false);
    }
  };

  // JWT LOGIN ENGINE
  const handleCmsLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setCmsToken(data.token);
        setCmsUser(data);
        localStorage.setItem('cms_token', data.token);
        localStorage.setItem('cms_user', JSON.stringify(data));
        setArtAuthor(data.username);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError('Invalid Administrator credentials! Please try again.');
      }
    } catch (err) {
      setLoginError('Server authentication unavailable. Verify server is running.');
    }
  };

  const handleCmsLogout = () => {
    setCmsToken('');
    setCmsUser(null);
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_user');
  };

  // AI MODULE 1: TELUGU HEADLINE GENERATOR
  const triggerAiHeadlineGenerator = async () => {
    if (!aiHeadlineTopic.trim()) return;
    setIsAiHeadlineLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/headlines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiHeadlineTopic })
      });
      const data = await res.json();
      setAiGenTeluguHeadlines(data.telugu);
      setAiGenEnglishHeadlines(data.english);
    } catch (err) {
      console.log('AI Headlines generation offline');
    } finally {
      setIsAiHeadlineLoading(false);
    }
  };

  // AI MODULE 2: FULL ARTICLE DRAFTER
  const triggerAiFullWriter = async () => {
    if (!aiFullTopic.trim()) return;
    setIsAiFullLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/write-article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiFullTopic, district: aiFullDistrict, keywords: aiFullKeywords })
      });
      const data = await res.json();
      setArtTitleTe(data.headline);
      setArtTitleEn(data.headline.replace('ఆప్టాప్ వార్త', 'Aptop Update'));
      setArtDescTe(data.intro + "\n\n" + data.body);
      setArtDescEn(data.intro + "\n\n" + data.body);
      setSeoTitle(data.headline);
      setMetaDesc(data.summary);
      
      setCmsSuccessMsg('AI Newsroom Writer has compiled a complete article draft! Review below.');
      setTimeout(() => setCmsSuccessMsg(''), 4000);
    } catch (err) {
      console.log('AI writer offline');
    } finally {
      setIsAiFullLoading(false);
    }
  };

  // AI MODULE 3: BREAKING NEWS BULLET MAKER
  const triggerAiBreakingMode = async () => {
    if (!aiShortText.trim()) return;
    setIsAiBreakingLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/breaking-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortText: aiShortText })
      });
      const data = await res.json();
      
      // Auto-populate ticker forms
      setNewTickerText(data.ticker);
      
      // Auto populate article creator
      setArtTitleTe(data.ticker);
      setArtTitleEn(data.push);
      setArtDescTe(data.article);
      setArtDescEn(data.article);
      setArtPriority('Emergency');
      setArtPinTop(true);
      
      setCmsSuccessMsg('AI Breaking mode activated! Marquee ticker and alerts populated.');
      setTimeout(() => setCmsSuccessMsg(''), 4000);
    } catch (err) {
      console.log('AI breaking helper offline');
    } finally {
      setIsAiBreakingLoading(false);
    }
  };

  // ONE-CLICK EMERGENCY RED MODE TOGGLE
  const toggleEmergencyMode = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/emergency/toggle`, { method: 'POST' });
      const data = await res.json();
      setEmergencyMode(data.active);
    } catch (err) {
      console.error('Error toggling emergency mode:', err);
    }
  };

  // ADVERTISER REGISTER LEAD & SIMULATED IMPRESSIONS
  const handleOnboardAdvertiser = async (e) => {
    e.preventDefault();
    if (!advCompany || !advContact) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/advertiser-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: advCompany, contact: advContact, city: advCity, budget: advBudget, adType: advType })
      });
      if (res.ok) {
        setOnboardSuccess(`Congratulations! Your advertiser campaign for '${advCompany}' has been successfully approved and added to active layouts!`);
        setAdvCompany('');
        setAdvContact('');
        
        // Re-fetch databases to show updated ad grids!
        fetchData();
        setTimeout(() => setOnboardSuccess(''), 6000);
      }
    } catch (err) {
      console.log('Advertiser lead sync failed');
    }
  };

  // SITEMAPS INDEXING PINGING ENGINE
  const triggerGoogleDiscoverPing = () => {
    setSitemapPingStatus('Pinging Google Indexers & Discover crawlers...');
    setTimeout(() => {
      setSitemapPingStatus('Success! Discovery ping complete. Indexing bot scheduled for next crawl.');
      setTimeout(() => setSitemapPingStatus(''), 4000);
    }, 1500);
  };

  // AUDIENCE EMOJI REACTION TALLY
  const handleReactToArticle = async (reactionType) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/articles/${selectedArticle.id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType })
      });
      const updatedArt = await res.json();
      setArticles(articles.map(a => a.id === selectedArticle.id ? updatedArt : a));
    } catch (err) {
      console.log('Reaction sync failed');
    }
  };

  // AUDIENCE OPINION POLL VOTE
  const handlePollVote = async (optionId) => {
    if (hasVoted) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/poll/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId })
      });
      const updatedPoll = await res.json();
      setLivePoll(updatedPoll);
      setHasVoted(true);
    } catch (err) {
      console.log('Vote registration offline');
    }
  };

  // LIVE TELECAST PINNER SCHEDULER
  const handleScheduleLiveTelecast = async (e) => {
    e.preventDefault();
    if (!newLiveTitleTe || !newLiveEmbed) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/live-streams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleTe: newLiveTitleTe, titleEn: newLiveTitleEn || newLiveTitleTe, embedUrl: newLiveEmbed, category: newLiveCategory })
      });
      if (res.ok) {
        setNewLiveTitleTe('');
        setNewLiveTitleEn('');
        setNewLiveEmbed('');
        
        setCmsSuccessMsg('Live Telecast successfully pinned and broadcast to reader portal! Flashing badging active.');
        setTimeout(() => setCmsSuccessMsg(''), 4000);
        
        // Refresh
        const streamRes = await fetch(`${BACKEND_URL}/api/live-streams`);
        const streamData = await streamRes.json();
        setLiveTelecasts(streamData);
      }
    } catch (err) {
      console.log('Error scheduling telecast');
    }
  };

  // MEDIA LIBRARY FILE UPLOAD PIPELINE
  const triggerMediaLibraryAdd = async (type, caption) => {
    const payload = {
      type,
      url: type === 'reels' ? '/hero.png' : '/temple.png',
      caption,
      district: 'Visakhapatnam'
    };
    try {
      const res = await fetch(`${BACKEND_URL}/api/media-library`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setCmsSuccessMsg('Media uploader cropped and saved vertical reel in media library!');
        setTimeout(() => setCmsSuccessMsg(''), 4000);
        
        // Re-fetch media
        const mediaRes = await fetch(`${BACKEND_URL}/api/media-library`);
        const mediaData = await mediaRes.json();
        setMediaLibrary(mediaData);
      }
    } catch (err) {
      console.log('Media uploader failed');
    }
  };

  // AWS S3/CLOUDINARY FILE UPLOAD MOCK
  const handleFileUploadSimulate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Trigger server mock upload endpoint
          fetch(`${BACKEND_URL}/api/media/upload`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
              setUploadedUrl(data.url);
              setArtImgUrl(data.url);
              setIsUploading(false);
              triggerMediaLibraryAdd('image', 'Uploaded coverage cover');
            });
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // Dynamic SEO schema LD+JSON Generator
  const selectedArticle = articles.find(art => art.id === selectedArticleId) || articles[0];

  useEffect(() => {
    if (selectedArticle) {
      const oldScript = document.getElementById('discover-seo-schema');
      if (oldScript) oldScript.remove();

      const schema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": selectedArticle.titleEn,
        "alternativeHeadline": selectedArticle.title,
        "image": [`${window.location.origin}${selectedArticle.image}`],
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "author": [{
          "@type": "Person",
          "name": selectedArticle.authorEn || 'Aptop Writer',
          "jobTitle": "Aptop News Journalist"
        }],
        "publisher": {
          "@type": "Organization",
          "name": "Aptop News",
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/logo.png`
          }
        },
        "description": selectedArticle.metaDescription || selectedArticle.descEn
      };

      const script = document.createElement('script');
      script.id = 'discover-seo-schema';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [selectedArticle]);

  // Click handler
  const handleAdClick = (adId) => {
    fetch(`${BACKEND_URL}/api/ads/${adId}/click`, { method: 'POST' })
      .then(res => res.json())
      .then(updatedAd => {
        setAds(ads.map(a => a.id === adId ? updatedAd : a));
        fetch(`${BACKEND_URL}/api/analytics`)
          .then(r => r.json())
          .then(data => setAnalytics(data));
      })
      .catch(err => console.log('Ad click track offline'));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // POST LIVE COMMENT
  const handleAddComment = async (e, artId) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/articles/${artId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCommentName, text: newCommentText })
      });
      const updatedArticle = await res.json();
      setArticles(articles.map(a => a.id === artId ? updatedArticle : a));
      setNewCommentName('');
      setNewCommentText('');
    } catch (err) {
      console.error('Error uploading comment:', err);
    }
  };

  // PUBLISH STORY VIA REST API
  const handlePublishArticle = async (e) => {
    e.preventDefault();
    if (!artTitleTe || !artTitleEn || !artDescTe) return;

    const payload = {
      category: artCategory,
      categoryTe: getCategoryTe(artCategory),
      title: artTitleTe,
      titleEn: artTitleEn,
      desc: artDescTe,
      descEn: artDescEn || artDescTe,
      image: artImgUrl,
      author: cmsUser ? cmsUser.username : artAuthor,
      authorEn: cmsUser ? cmsUser.username : artAuthor,
      district: artDistrict,
      districtTe: getDistrictTe(artDistrict),
      status: artStatus,
      priority: artPriority,
      pinTop: artPinTop,
      slug: artSlug,
      seoTitle: seoTitle || artTitleEn,
      metaDescription: metaDesc || artDescTe.slice(0, 150)
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setArtTitleTe('');
        setArtTitleEn('');
        setArtDescTe('');
        setArtDescEn('');
        setSeoTitle('');
        setMetaDesc('');
        setUploadedUrl('');
        setArtImgUrl('/hero.png');
        
        setCmsSuccessMsg('కథనం విజయవంతంగా డేటాబేస్కు ప్రచురించబడింది! (Article published and secure audit logged!)');
        setTimeout(() => setCmsSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Database write error:', err);
    }
  };

  // ADD SCROLLING HEADLINE TICKER
  const handleAddTickerItem = async (e) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/ticker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTickerText })
      });
      if (res.ok) {
        setNewTickerText('');
        setCmsSuccessMsg('ఫ్లాష్ హెడ్‌లైన్ విజయవంతంగా జోడించబడింది! (Audit Log Written)');
        setTimeout(() => setCmsSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Ticker upload error:', err);
    }
  };

  // DELETE SCROLLING TICKER ITEM
  const handleDeleteTickerItem = async (index) => {
    try {
      await fetch(`${BACKEND_URL}/api/ticker/${index}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error removing ticker item:', err);
    }
  };

  const getCategoryTe = (cat) => {
    switch(cat) {
      case 'Politics': return 'రాజకీయాలు';
      case 'Business': return 'వ్యాపారం';
      case 'Technology': return 'సాంకేతికత';
      case 'Spiritual': return 'భక్తి';
      case 'Sports': return 'క్రీడలు';
      case 'Cinema': return 'సినిమా';
      case 'Jobs & Education': return 'ఉద్యోగాలు & విద్య';
      default: return 'వార్తలు';
    }
  };

  const getDistrictTe = (dist) => {
    switch(dist) {
      case 'Visakhapatnam': return 'విశాఖపట్నం';
      case 'Tirupati': return 'తిరుపతి';
      case 'Vijayawada': return 'విజయవాడ';
      case 'Hyderabad': return 'హైదరాబాద్';
      case 'Srikakulam': return 'శ్రీకాకుళం';
      default: return dist;
    }
  };

  const filteredArticles = articles.filter(art => {
    const textToMatch = (language === 'telugu' ? art.title : art.titleEn).toLowerCase();
    return textToMatch.includes(searchQuery.toLowerCase());
  });

  const getDistrictAddress = (dist) => {
    switch (dist) {
      case 'Visakhapatnam':
        return { name: 'చిన్న బజార్ - విశాఖపట్నం రూరల్', pin: 'Visakhapatnam - 530045' };
      case 'Tirupati':
        return { name: 'అలిపిరి మెట్ల మార్గం రోడ్ - తిరుపతి అర్బన్', pin: 'Tirupati - 517501' };
      case 'Vijayawada':
        return { name: 'బెంజ్ సర్కిల్ ఏరియా - విజయవాడ సెంట్రల్', pin: 'Vijayawada - 520010' };
      case 'Hyderabad':
        return { name: 'మాదాపూర్ ఐటీ కారిడార్ - హైదరాబాద్ మెట్రో', pin: 'Hyderabad - 500081' };
      case 'Srikakulam':
        return { name: 'ఆర్టీసీ కాంప్లెక్స్ సమీప వీధి - శ్రీకాకుళం టౌన్', pin: 'Srikakulam - 532001' };
      default:
        return { name: 'మెయిన్ జంక్షన్ రోడ్ - ఆంధ్ర డిస్ట్రిక్ట్', pin: 'AP - 522001' };
    }
  };

  // SPEECH NEWS READER CONTROLLER
  const handleSpeakArticle = (article) => {
    if (voiceReaderIsPlaying) {
      window.speechSynthesis.cancel();
      setVoiceReaderIsPlaying(false);
      setActiveVoiceArticleId(null);
    } else {
      const textToSpeak = language === 'telugu' ? `${article.title}. ${article.desc}` : `${article.titleEn}. ${article.descEn}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      const voices = window.speechSynthesis.getVoices();
      const teluguVoice = voices.find(v => v.lang.startsWith('te') || v.lang.startsWith('in'));
      if (teluguVoice) utterance.voice = teluguVoice;
      
      utterance.rate = voiceReaderRate;
      utterance.onend = () => {
        setVoiceReaderIsPlaying(false);
        setActiveVoiceArticleId(null);
      };
      utterance.onerror = () => {
        setVoiceReaderIsPlaying(false);
        setActiveVoiceArticleId(null);
      };
      
      window.speechSynthesis.speak(utterance);
      setVoiceReaderIsPlaying(true);
      setActiveVoiceArticleId(article.id);
    }
  };

  // PREMIUM MEMBERSHIP CHECKOUT POST
  const handleSubscribePremium = async (e) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail) return;
    setCheckoutProcessing(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/membership/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: checkoutName,
          email: checkoutEmail,
          plan: 'Gold Premium Annually'
        })
      });
      if (res.ok) {
        setPremiumPlan('premium');
        localStorage.setItem('premium_plan', 'premium');
        setShowPremiumCheckout(false);
        
        setCustomAlertTitle(`ధన్యవాదాలు ${checkoutName}! మీ ప్రీమియం గోల్డ్ సబ్‌స్క్రిప్షన్ సక్రియం చేయబడింది!`);
        setCustomAlertTitleEn(`Thank you ${checkoutName}! Your Gold Premium ad-free subscription is active!`);
        setShowNotificationToast(true);
      }
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setCheckoutProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A', color: 'white' }}>
        <RefreshCw size={48} className="live-dot" style={{ animation: 'pulse 1.5s infinite alternate', marginBottom: '16px' }} />
        <h2 style={{ fontFamily: 'var(--font-telugu)' }}>ఆప్టాప్ న్యూస్ రూమ్ లోడ్ అవుతోంది...</h2>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '8px' }}>Connecting to Real-time Production Backend Server on Port 5000...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className={emergencyMode ? 'emergency-active' : ''}>
      
      {/* ========================================== */}
      {/* WORKSPACE VIEWPORT SELECTOR */}
      {/* ========================================== */}
      <div className="device-toggle-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} />
          <span>Aptop News Workspace:</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`device-btn ${activeView === 'desktop' ? 'active' : ''}`} onClick={() => setActiveView('desktop')}><Laptop size={14} /> Desktop Web Portal</button>
          <button className={`device-btn ${activeView === 'mobile' ? 'active' : ''}`} onClick={() => { setActiveView('mobile'); setActiveMobileTab('home'); }}><Smartphone size={14} /> Mobile App Screens</button>
          <button className={`device-btn ${activeView === 'cms' ? 'active' : ''}`} onClick={() => setActiveView('cms')} style={{ border: '2px solid var(--accent-yellow)' }}><Settings size={14} /> CMS Newsroom Dashboard</button>
        </div>
      </div>

      {/* DYNAMIC FLOATING NOTIFICATIONS TOAST */}
      {showNotificationToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--card-bg)',
          borderLeft: '5px solid var(--primary-red)',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: '8px',
          padding: '16px',
          zIndex: 9999,
          maxWidth: '360px',
          display: 'flex',
          gap: '12px',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          <div style={{ color: 'var(--primary-red)' }}>
            <Bell size={24} className="live-dot" style={{ width: '20px', height: '20px', animation: 'pulse 1s infinite alternate' }} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-red)', textTransform: 'uppercase' }}>
                {language === 'telugu' ? 'లైవ్ బ్రేకింగ్ న్యూస్' : 'LIVE BREAKING NEWS'}
              </span>
              <button onClick={() => setShowNotificationToast(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={14} /></button>
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-telugu)' }}>
              {language === 'telugu' ? customAlertTitle : customAlertTitleEn}
            </p>
            <button 
              onClick={() => {
                setShowNotificationToast(false);
                if (articles.length > 0) setSelectedArticleId(articles[0].id);
                setCurrentPage('article');
                setActiveView('desktop');
              }}
              style={{ marginTop: '8px', backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              {language === 'telugu' ? 'పూర్తిగా చదవండి' : 'Read Full Article'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VIEWPORT 1: PORTAL DESKTOP WEB PAGE */}
      {/* ========================================== */}
      {activeView === 'desktop' && (
        <div className="portal-container" style={{ flexGrow: 1 }}>
          
          {/* Header */}
          <header style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', padding: '16px 0', transition: 'var(--transition)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
                <div style={{ backgroundColor: 'var(--primary-red)', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 800, fontSize: '1.6rem' }}>
                  <span>Aptop News</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-red)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {language === 'telugu' ? 'ప్రజల వార్త • ప్రజల స్వరం' : 'Fast • Trusted • Telugu First'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ backgroundColor: '#065F46', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>VERIFIED NEWSROOM</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Reporters Online: 48</span>
                  </div>
                </div>
              </div>

              {/* PWA INSTALL TRIGGER */}
              {showPwaPrompt && (
                <button 
                  onClick={() => {
                    setIsPwaInstalled(true);
                    setShowPwaPrompt(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 213, 74, 0.1)', border: '1px solid var(--accent-yellow)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                >
                  <DownloadCloud size={14} style={{ color: 'var(--accent-yellow)' }} />
                  <span>{isPwaInstalled ? 'Aptop App Installed' : 'Install Aptop News WebApp'}</span>
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1, maxWidth: '240px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
                <input 
                  type="text"
                  placeholder={language === 'telugu' ? 'వార్త శోధన...' : 'Search news headlines...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '30px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', padding: '6px 12px', backgroundColor: 'rgba(214, 31, 38, 0.05)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <Sun size={16} style={{ color: 'var(--accent-yellow)' }} />
                  <span>AP 34°C • {language === 'telugu' ? 'ఎండ తీవ్రత' : 'Sunny'}</span>
                </div>

                <button 
                  onClick={() => {
                    if (articles.length > 0) setSelectedArticleId(articles[0].id);
                    setCurrentPage('article');
                  }}
                  style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Radio size={16} className="live-dot" />
                  <span>LIVE TV</span>
                </button>

                <button onClick={() => setLanguage(language === 'telugu' ? 'english' : 'telugu')} style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  {language === 'telugu' ? 'English' : 'తెలుగు'}
                </button>

                <button onClick={toggleDarkMode} style={{ background: 'none', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

            </div>
          </header>

          {/* Secondary Navigation bar for Special Features */}
          <nav style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', padding: '12px 0', transition: 'var(--transition)' }}>
            <div className="container" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <span onClick={() => { setCurrentPage('home'); setShowAdvertiserDashboard(false); }} style={{ color: currentPage === 'home' && !showAdvertiserDashboard ? 'var(--primary-red)' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>🚨 {language === 'telugu' ? 'ప్రధాన వార్తలు' : 'Headlines'}</span>
              <span onClick={() => { setCurrentPage('elections'); setShowAdvertiserDashboard(false); }} style={{ color: currentPage === 'elections' ? 'var(--primary-red)' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>🗳️ {language === 'telugu' ? 'ఎన్నికల కేంద్రం' : 'Election Mega Center'}</span>
              <span onClick={() => { setCurrentPage('spiritual'); setShowAdvertiserDashboard(false); }} style={{ color: currentPage === 'spiritual' ? 'var(--primary-red)' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>🕉️ {language === 'telugu' ? 'తిరుమల లైవ్' : 'Spiritual Specials'}</span>
              <span onClick={() => { setCurrentPage('epaper'); setShowAdvertiserDashboard(false); }} style={{ color: currentPage === 'epaper' ? 'var(--primary-red)' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>📰 {language === 'telugu' ? 'ఈ-పేపర్' : 'Daily Digest'}</span>
              <span onClick={() => { setShowAdvertiserDashboard(true); setCurrentPage('advertise'); }} style={{ color: showAdvertiserDashboard ? 'var(--primary-red)' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>💼 {language === 'telugu' ? 'ప్రకటనల డ్యాష్‌బోర్డ్' : 'Advertiser Portal'}</span>
              <span onClick={() => setShowPremiumCheckout(true)} style={{ color: 'gold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', animation: 'pulse 1.5s infinite alternate' }}>⭐ {premiumPlan === 'premium' ? 'GOLD MEMBER (Ad-Free)' : (language === 'telugu' ? 'గోల్డ్ ప్రీమియం' : 'Go Ad-Free')}</span>
            </div>
          </nav>

          {/* Scrolling ticker */}
          <div className="ticker-wrap">
            <div className="ticker-header">
              <Flame size={16} />
              <span>{language === 'telugu' ? 'ఆప్టాప్ ఫ్లాష్' : 'FLASH NEWS'}</span>
            </div>
            <div className="ticker-content">
              {tickerItems.map((tick, index) => (
                <span className="ticker-item" key={index}>{tick}</span>
              ))}
            </div>
          </div>

          <main className="container" style={{ padding: '32px 16px' }}>

            {/* AD PLACEMENT: HEADER BANNER (Hidden for premium VIP members) */}
            {ads.length > 0 && ads[0].active && premiumPlan !== 'premium' && (
              <div 
                onClick={() => handleAdClick(ads[0].id)}
                style={{ 
                  backgroundColor: 'rgba(255, 213, 74, 0.05)', 
                  border: '1px dashed var(--accent-yellow)', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  textAlign: 'center', 
                  marginBottom: '24px', 
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ backgroundColor: 'var(--accent-yellow)', color: '#111', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>SPONSORED AD</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{ads[0].advertiser || 'Aptop Sponsored Services'} • గృహాల కొనుగోలుపై అద్భుతమైన ఆఫర్లు! 0% డౌన్ పేమెంట్. క్లిక్ చేయండి!</span>
              </div>
            )}

            {/* 1. SPECIAL PAGE: EPAPER DAILY DIGEST */}
            {currentPage === 'epaper' && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid var(--primary-red)', paddingBottom: '16px', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-telugu)' }}>📰 ఆప్టాప్ దినపత్రిక (Aptop Daily E-Paper)</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>AP & Telangana Daily Digital Morning Editions</p>
                  </div>
                  <button 
                    onClick={() => alert('ఆప్టాప్ ఉదయపు సంచిక PDF విజయవంతంగా డౌన్‌లోడ్ చేయబడింది! (Printed morning newspaper downloaded successfully in PDF format.)')}
                    style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    Download Printable PDF Edition
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px' }} className="epaper-layout">
                  {/* Left Side: Edition selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', borderLeft: '3px solid var(--primary-red)', paddingLeft: '8px' }}>Select Edition</h4>
                    {['ఆంధ్రప్రదేశ్ ప్రధాన సంచిక (AP Main)', 'తెలంగాణ ప్రధాన సంచిక (TS Main)', 'హైదరాబాద్ సిటీ పుల్-అవుట్ (City Special)', 'ఆధ్యాత్మిక ప్రత్యేక అనుబంధం (Spiritual supplement)'].map((ed, idx) => (
                      <div key={idx} style={{ padding: '12px', backgroundColor: idx === 0 ? 'rgba(214, 31, 38, 0.05)' : 'var(--card-bg)', border: idx === 0 ? '1px solid var(--primary-red)' : '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {ed}
                      </div>
                    ))}
                  </div>

                  {/* Right Side: Newspaper layout preview mockup */}
                  <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', boxShadow: 'var(--shadow-md)', position: 'relative' }}>
                    <div style={{ textAlign: 'center', borderBottom: '2px double var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                      <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-red)', fontFamily: 'var(--font-telugu)', margin: 0 }}>ఆప్టాప్ న్యూస్</h1>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>వేగంగా • నిజంగా • తెలుగు రాష్ట్రాల నంబర్ వన్ దినపత్రిక</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                      <div style={{ textAlign: 'left', borderRight: '1px solid var(--border-color)', paddingRight: '20px' }}>
                        <span style={{ color: 'var(--primary-red)', fontSize: '0.8rem', fontWeight: 'bold' }}>ముఖ్య వార్త (Front Page Lead Story)</span>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)', marginTop: '8px', marginBottom: '12px', lineHeight: '1.3' }}>ఆంధ్రప్రదేశ్‌కు సరికొత్త నిధుల వెల్లువ! కేంద్రం కీలక ప్రకటన.</h2>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.7', fontFamily: 'var(--font-telugu)', color: 'var(--text-secondary)' }}>
                          రాష్ట్రానికి రోడ్డు రవాణా, పారిశ్రామిక కారిడార్ల అభివృద్ధి కొరకై కేంద్ర ప్రభుత్వం ప్రత్యేక ప్యాకేజీ మంజూరు చేసింది. దీని వల్ల వచ్చే మూడేళ్లలో వేలాది మంది యువతకు ఉపాధి అవకాశాలు లభిస్తాయని సీఎం ధీమా వ్యక్తం చేశారు.
                        </p>
                      </div>
                      <div>
                        {/* Newspaper Column */}
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px', textAlign: 'left' }}>
                          <span style={{ color: '#F59E0B', fontSize: '0.75rem', fontWeight: 'bold' }}>తెలంగాణ అప్డేట్ (Telangana Core)</span>
                          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)', margin: '4px 0' }}>హైదరాబాద్ మెట్రో విస్తరణ పనులకు ఆమోదం!</h4>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 'bold' }}>వాణిజ్యం (Business Pullout)</span>
                          <h4 style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)', margin: '4px 0' }}>బంగారం ధరల్లో భారీ క్షీణత! కొనుగోలుదారుల హర్షం.</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SPECIAL PAGE: ELECTION MEGA CENTER */}
            {currentPage === 'elections' && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ borderBottom: '3px solid var(--primary-red)', paddingBottom: '16px', marginBottom: '24px', textAlign: 'left' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-telugu)' }}>🗳️ ఆప్టాప్ ఎన్నికల కేంద్రం (AP/TS Election Mega Center)</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Real-Time Legislative Seat Count & Candidate Analysis</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }} className="election-results-grid">
                  {/* AP Results */}
                  <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Andhra Pradesh (175/175 Assemblies)</h3>
                      <span style={{ backgroundColor: '#10B981', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>Results Declared</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                          <span>కూటమి పక్షాలు (Alliance Party)</span>
                          <span>102 Lead / Won (Magic mark: 88)</span>
                        </div>
                        <div style={{ height: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: '58.2%', height: '100%', backgroundColor: '#F59E0B' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                          <span>వైసీపీ (YCP Block)</span>
                          <span>68 seats</span>
                        </div>
                        <div style={{ height: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: '38.8%', height: '100%', backgroundColor: '#3B82F6' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TS Results */}
                  <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Telangana (119/119 Assemblies)</h3>
                      <span style={{ backgroundColor: '#10B981', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>Results Declared</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                          <span>కాంగ్రెస్ (INC Block)</span>
                          <span>64 Lead / Won (Magic mark: 60)</span>
                        </div>
                        <div style={{ height: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: '53.7%', height: '100%', backgroundColor: '#DC2626' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>
                          <span>బీఆర్ఎస్ (BRS Block)</span>
                          <span>48 seats</span>
                        </div>
                        <div style={{ height: '12px', backgroundColor: 'var(--bg-color)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: '40.3%', height: '100%', backgroundColor: '#F472B6' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SPECIAL PAGE: SPIRITUAL POOJA SCHEDULER */}
            {currentPage === 'spiritual' && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ borderBottom: '3px solid var(--primary-red)', paddingBottom: '16px', marginBottom: '24px', textAlign: 'left' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-telugu)' }}>🕉️ ఆప్టాప్ ఆధ్యాత్మిక సేవలు: తిరుమల ప్రత్యక్ష ప్రసారం (Tirumala Live Poojas)</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Daily Temple Pooja Schedules & Virtual Seva Booking</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="spiritual-page-grid">
                  {/* Temple video player & active schedules */}
                  <div>
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
                      <div className="responsive-iframe-wrap">
                        <iframe 
                          src="https://www.youtube.com/embed/S-Bw-BvJb8Q" 
                          title="Tirumala Live Poojas" 
                          frameBorder="0" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div style={{ backgroundColor: 'var(--primary-red)', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', flexWrap: 'wrap', gap: '4px' }}>
                        <span>📺 తిరుమల తిరుపతి దేవస్థానం ప్రత్యక్ష పూజా కార్యక్రమాలు</span>
                        <span style={{ fontWeight: 'bold' }}>🔴 TT LIVE STREAM ACTIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* Pooja scheduler card and virtual ticket booking */}
                  <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Daily Seva Timings</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem', marginBottom: '20px' }}>
                      <div style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>🌅 <strong>03:00 AM - 04:00 AM:</strong> <span style={{ fontFamily: 'var(--font-telugu)' }}>సుప్రభాత సేవ (Suprabhatam)</span></div>
                      <div style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>☀️ <strong>06:00 AM - 07:00 AM:</strong> <span style={{ fontFamily: 'var(--font-telugu)' }}>తోమాల సేవ (Thomala Seva)</span></div>
                      <div style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>☀️ <strong>12:00 PM - 01:00 PM:</strong> <span style={{ fontFamily: 'var(--font-telugu)' }}>కల్యాణోత్సవం (Kalyanotsavam)</span></div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255, 213, 74, 0.1)', border: '1px solid var(--accent-yellow)', borderRadius: '8px', padding: '16px' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>🎫 Virtual Pooja Ticket Booking</h4>
                      <button 
                        onClick={() => {
                          const passNum = Math.floor(100000 + Math.random() * 900000);
                          alert(`తిరుమల వర్చువల్ దర్శన టికెట్ విజయవంతంగా కేటాయించబడింది! \n\n🔒 Pass Code: TTD-${passNum}\n📲 SMS confirmation sent!`);
                        }}
                        style={{ width: '100%', backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Book Virtual Seva Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SPECIAL PAGE: ADVERTISER SELF-SERVICE DASHBOARD */}
            {currentPage === 'advertise' && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ borderBottom: '3px solid var(--primary-red)', paddingBottom: '16px', marginBottom: '24px', textAlign: 'left' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-telugu)' }}>💼 ఆప్టాప్ ప్రకటనకర్తల స్వయం-సేవ డ్యాష్‌బోర్డ్ (Advertiser Portal)</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Launch Target CPC Ads & Monitor Real-Time Impression Ledger Metrics</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }} className="advertiser-portal-grid">
                  {/* Advertiser creation form */}
                  <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Launch CPC Ad Campaign</h3>
                    
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!advCompany || !advBudget) return;

                      try {
                        const res = await fetch(`${BACKEND_URL}/api/ads`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            advertiser: advCompany,
                            placement: advType,
                            budget: parseFloat(advBudget),
                            clicks: 0,
                            revenue: 0,
                            active: true
                          })
                        });
                        if (res.ok) {
                          const updatedAds = await res.json();
                          setAds(updatedAds);
                          setAdvCompany('');
                          setAdvBudget('');
                          alert('ప్రకటన క్యాంపెయిన్ విజయవంతంగా జోడించబడింది! (Advertiser CPC campaign launched live!)');
                        }
                      } catch (err) {
                        alert('Failed to register advertiser slot on server backend.');
                      }
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Company / Sponsor Name:</label>
                        <input type="text" className="form-control" value={advCompany} onChange={(e) => setAdvCompany(e.target.value)} placeholder="TATA Motors AP" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Campaign Budget Target ($):</label>
                        <input type="number" className="form-control" value={advBudget} onChange={(e) => setAdvBudget(e.target.value)} placeholder="150" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Ad Slot Placement Type:</label>
                        <select className="form-control" value={advType} onChange={(e) => setAdvType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                          <option value="Header Banner">Header Banner Placement</option>
                          <option value="Sidebar widget">Sidebar Widget Placement</option>
                          <option value="Mobile feed banner">Mobile Feed Banner Placement</option>
                        </select>
                      </div>

                      <button type="submit" style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Launch CPC Campaign</button>
                    </form>
                  </div>

                  {/* Active campaigns ledger */}
                  <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', textAlign: 'left' }}>Real-Time Campaign Productivity Ledger</h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Sponsor</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Placement</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Budget</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>Clicks</th>
                            <th style={{ padding: '10px', textAlign: 'right' }}>CTR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ads.map(ad => (
                            <tr key={ad.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'left' }}>{ad.advertiser}</td>
                              <td style={{ padding: '10px', textAlign: 'left' }}>{ad.placement}</td>
                              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>${ad.budget || ad.revenue}</td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>{ad.clicks} clicks</td>
                              <td style={{ padding: '10px', textAlign: 'right', color: '#10B981', fontWeight: 'bold' }}>4.82% CTR</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'home' && (
              <>
                {/* Hero section */}
                {articles.length > 0 && (
                  <section className="hero-featured-story">
                    <div className="hero-img-wrap">
                      <img src={articles[0].image} alt="" />
                      <div style={{ position: 'absolute', top: '16px', left: '16px' }} className="badge badge-red">
                        <Flame size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {language === 'telugu' ? 'బ్రేకింగ్ వార్త' : 'BREAKING NEWS'}
                      </div>
                    </div>
                    <div className="hero-text-wrap">
                      <span className="category-badge">{language === 'telugu' ? articles[0].categoryTe : articles[0].category}</span>
                      <h2 className="hero-title">{language === 'telugu' ? articles[0].title : articles[0].titleEn}</h2>
                      <p className="hero-desc">{language === 'telugu' ? articles[0].desc : articles[0].descEn}</p>
                      
                      <div className="hero-meta">
                        <Calendar size={14} />
                        <span>{articles[0].date}</span>
                        <span>•</span>
                        <span>{language === 'telugu' ? `రచన: ${articles[0].author}` : `Author: ${articles[0].authorEn}`}</span>
                        <button 
                          onClick={() => {
                            setSelectedArticleId(articles[0].id);
                            setCurrentPage('article');
                          }}
                          style={{ marginLeft: 'auto', backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--font-telugu)' }}
                        >
                          {language === 'telugu' ? 'చదవండి →' : 'Read More →'}
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* DOWNTOWN VERTICAL REELS SLIDER */}
                <section style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-red)', borderBottom: '2px solid var(--primary-red)', paddingBottom: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Film size={20} /> {language === 'telugu' ? 'ఆప్టాప్ క్లిప్స్ & రీల్స్' : 'Aptop Media Reels'}</h3>
                  <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px' }}>
                    {mediaLibrary.filter(m => m.type === 'reels' || m.type === 'image').map(media => (
                      <div key={media.id} style={{ minWidth: '160px', height: '220px', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                        <img src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '12px 8px', color: 'white' }}>
                          <span style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Play size={10} /> 3.2K views</span>
                          <h4 style={{ fontSize: '0.75rem', marginTop: '4px', fontFamily: 'var(--font-telugu)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{media.caption}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ELECTION LIVE COUNTING CORNER */}
                {livePoll && (
                  <section className="election-dashboard">
                    <div className="news-grid news-grid-2">
                      {/* Election column */}
                      <div>
                        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '1rem', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', gap: '6px' }}><Landmark size={18} /> {language === 'telugu' ? 'లైవ్ ఎన్నికల ఫలితాలు 2026' : 'Live Assembly Lead Counts'}</h4>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => setElectionState('ap')} style={{ padding: '2px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>AP</button>
                            <button onClick={() => setElectionState('ts')} style={{ padding: '2px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>TS</button>
                          </div>
                        </div>

                        {electionState === 'ap' ? (
                          <>
                            <div className="party-row">
                              <span className="party-name">TDP+</span>
                              <div className="party-bar-container"><div className="party-bar" style={{ width: '77%', backgroundColor: '#FFD54A' }}></div></div>
                              <span className="party-seats">135 (Won/Lead)</span>
                            </div>
                            <div className="party-row">
                              <span className="party-name">YSRCP</span>
                              <div className="party-bar-container"><div className="party-bar" style={{ width: '22%', backgroundColor: '#1877F2' }}></div></div>
                              <span className="party-seats">38 (Won/Lead)</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="party-row">
                              <span className="party-name">INC</span>
                              <div className="party-bar-container"><div className="party-bar" style={{ width: '58%', backgroundColor: '#25D366' }}></div></div>
                              <span className="party-seats">70 (Won/Lead)</span>
                            </div>
                            <div className="party-row">
                              <span className="party-name">BRS</span>
                              <div className="party-bar-container"><div className="party-bar" style={{ width: '35%', backgroundColor: '#E0115F' }}></div></div>
                              <span className="party-seats">42 (Won/Lead)</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Interactive opinion poll */}
                      <div style={{ backgroundColor: 'var(--card-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--primary-red)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>OPINION POLL</span>
                        <h4 style={{ margin: '8px 0', fontFamily: 'var(--font-telugu)', fontSize: '0.95rem' }}>{livePoll.question}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {livePoll.options.map(opt => (
                            <button 
                              key={opt.id}
                              onClick={() => handlePollVote(opt.id)}
                              disabled={hasVoted}
                              style={{ width: '100%', textAlign: 'left', padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <span style={{ fontFamily: 'var(--font-telugu)' }}>{opt.text}</span>
                              <span style={{ fontWeight: 'bold', color: 'var(--primary-red)' }}>{opt.votes} votes</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="news-grid-3">
                  
                  {/* Left articles feed */}
                  <div style={{ gridColumn: 'span 2' }}>
                    
                    {/* ADVERTISER LEADS BIND FORM */}
                    <div style={{ backgroundColor: 'rgba(214, 31, 38, 0.02)', border: '1px dashed var(--primary-red)', padding: '20px', borderRadius: '8px', marginBottom: '32px' }}>
                      <h4 style={{ color: 'var(--primary-red)', fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '4px' }}>📢 Advertise with Aptop News</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Onboard your hospital, college, coaching, or real estate campaign today! Submissions automatically spawn active advertiser grids.</p>
                      
                      {onboardSuccess && (
                        <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '16px' }}>
                          {onboardSuccess}
                        </div>
                      )}

                      <form onSubmit={handleOnboardAdvertiser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input type="text" placeholder="Company/Institution Name" value={advCompany} onChange={(e) => setAdvCompany(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }} />
                        <input type="text" placeholder="Contact Mobile/Email" value={advContact} onChange={(e) => setAdvContact(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }} />
                        <select value={advType} onChange={(e) => setAdvType(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }}>
                          <option value="Homepage inline">Homepage inline Banner ($300)</option>
                          <option value="Header banner">Header Premium Banner ($500)</option>
                          <option value="Sidebar sticky">Sticky Sidebar Spot ($1000)</option>
                        </select>
                        <button type="submit" style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>Onboard Campaign Bids</button>
                      </form>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '3px solid var(--primary-red)', paddingBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-red)' }}>
                        {language === 'telugu' ? 'ప్రధాన వార్తా స్రవంతి' : 'PRIME NEWS ARCHIVE'}
                      </h3>
                    </div>

                    <div className="news-grid news-grid-2">
                      {filteredArticles.map(art => (
                        <article className="news-card" key={art.id}>
                          <div className="card-img-container">
                            <img src={art.image} className="card-img" alt="" />
                            <span className="badge badge-red" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 5 }}>
                              {language === 'telugu' ? art.categoryTe : art.category}
                            </span>
                          </div>
                          <div className="card-content">
                            <h4 className="card-title" onClick={() => {
                              setSelectedArticleId(art.id);
                              setCurrentPage('article');
                            }} style={{ cursor: 'pointer' }}>
                              {language === 'telugu' ? art.title : art.titleEn}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '12px', fontFamily: 'var(--font-telugu)' }}>
                              {language === 'telugu' ? art.desc : art.descEn}
                            </p>
                            <div className="card-meta">
                              <span>{art.date}</span>
                              <span>{language === 'telugu' ? `కర్త: ${art.author}` : `By: ${art.authorEn}`}</span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    {/* PUBLIC REPORTER BUREAU PROFILE MATRIX */}
                    <div style={{ marginTop: '48px' }}>
                      <h3 style={{ fontSize: '1.25rem', borderBottom: '2px solid var(--primary-red)', paddingBottom: '6px', marginBottom: '16px' }}>✍️ Aptop Newsroom Bureau Journalists</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        {reporters.map(rep => (
                          <div key={rep.id} style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px', cursor: 'pointer' }} onClick={() => setSelectedReporter(rep)}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{rep.nameEn.slice(0, 2)}</div>
                            <div>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)' }}>{rep.name}</h4>
                              <span style={{ fontSize: '0.7rem', color: 'var(--primary-red)', fontWeight: 'bold' }}>{rep.district} Bureau</span>
                              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px' }}>Published: {rep.stories} articles</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Side Timelines */}
                  <div>
                    {/* Live telecast schedule */}
                    <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px' }}>
                        <Radio size={20} className="live-dot" style={{ color: 'var(--primary-red)' }} />
                        <h3 style={{ fontSize: '1.15rem' }}>{language === 'telugu' ? 'ప్రత్యక్ష టెలికాస్ట్ స్టూడియో' : 'Aptop Live TV Center'}</h3>
                      </div>
                      
                      {liveTelecasts.filter(s => s.active).map(stream => (
                        <div key={stream.id}>
                          <iframe 
                            width="100%" 
                            height="180" 
                            src={stream.embedUrl} 
                            title="Aptop News Live Stream" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            style={{ borderRadius: '6px' }}
                          ></iframe>
                          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ backgroundColor: 'var(--primary-red)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>LIVE 🔴</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Viewers: {stream.viewers}</span>
                          </div>
                          <h4 style={{ fontSize: '0.85rem', marginTop: '6px', fontFamily: 'var(--font-telugu)', fontWeight: 'bold' }}>{language === 'telugu' ? stream.titleTe : stream.titleEn}</h4>
                        </div>
                      ))}
                    </div>

                    {/* District Filter News */}
                    <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.15rem' }}>{language === 'telugu' ? 'జిల్లా బ్యూరో' : 'District News'}</h3>
                        <select 
                          value={districtFilter}
                          onChange={(e) => setDistrictFilter(e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'var(--font-telugu)' }}
                        >
                          <option value="Visakhapatnam">విశాఖ</option>
                          <option value="Tirupati">తిరుపతి</option>
                          <option value="Vijayawada">విజయవాడ</option>
                        </select>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--primary-red)', fontWeight: 'bold' }}>📍 {getDistrictAddress(districtFilter).name}</span>
                        <h4 style={{ marginTop: '6px', fontFamily: 'var(--font-telugu)' }}>
                          {articles.filter(a => a.district === districtFilter).length > 0 
                            ? (language === 'telugu' ? articles.filter(a => a.district === districtFilter)[0].title : articles.filter(a => a.district === districtFilter)[0].titleEn)
                            : 'తాజా లోకల్ వార్తలు త్వరలోనే ప్రచురించబడును.'}
                        </h4>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}

            {currentPage === 'article' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="news-grid-3">
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <button onClick={() => setCurrentPage('home')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                      <ArrowLeft size={16} /> <span>Back to Home</span>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', backgroundColor: '#D1FAE5', color: '#065F46', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                      <Globe size={12} />
                      <span>Discover Indexing Schemas Activated</span>
                    </div>
                  </div>

                  <article style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
                    <span className="category-badge">{language === 'telugu' ? selectedArticle.categoryTe : selectedArticle.category}</span>
                    <h1 style={{ fontSize: '2rem', margin: '16px 0', textAlign: 'left', fontFamily: 'var(--font-telugu)' }}>
                      {language === 'telugu' ? selectedArticle.title : selectedArticle.titleEn}
                    </h1>
                    <img src={selectedArticle.image} style={{ width: '100%', borderRadius: '8px', marginBottom: '24px' }} alt="" />
                    <p style={{ fontSize: '1.05rem', lineHeight: '1.8', fontFamily: 'var(--font-telugu)', textAlign: 'left', marginBottom: '20px' }}>
                      {selectedArticle.desc}
                    </p>

                    {/* DYNAMIC PUBLIC EMOJI REACTION ZONE */}
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '16px 0', margin: '24px 0', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>React to this article:</span>
                      <button onClick={() => handleReactToArticle('like')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)', cursor: 'pointer', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}><ThumbsUp size={14} /> <span>Like ({selectedArticle.reactions ? selectedArticle.reactions.like : 0})</span></button>
                      <button onClick={() => handleReactToArticle('love')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)', cursor: 'pointer', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}><Smile size={14} style={{ color: 'red' }} /> <span>Love ({selectedArticle.reactions ? selectedArticle.reactions.love : 0})</span></button>
                    </div>

                    {/* WhatsApp share */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', backgroundColor: 'rgba(37, 211, 102, 0.05)', border: '1px solid rgba(37, 211, 102, 0.2)', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ color: '#075E54', fontSize: '0.95rem', fontWeight: 'bold' }}>ఆప్టాప్ వాట్సాప్ ఛానెల్ సబ్‌స్క్రైబ్ చేయండి!</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ప్రతి రోజూ అత్యంత వేగవంతమైన తెలుగు బ్రేకింగ్ వార్తలు నేరుగా మీ మొబైల్ లో పొందండి.</p>
                      </div>
                      <a 
                        href={`https://api.whatsapp.com/send?text=Read this urgent Aptop News story: ${selectedArticle.titleEn} - http://localhost:5173/`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ backgroundColor: '#25D366', color: 'white', padding: '10px 18px', borderRadius: '25px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}
                      >
                        <Share2 size={16} />
                        <span>Share on WhatsApp</span>
                      </a>
                    </div>

                    {/* Comments */}
                    <div style={{ marginTop: '48px', borderTop: '2px solid var(--border-color)', paddingTop: '32px' }}>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Reader Engagement Comments ({selectedArticle.comments ? selectedArticle.comments.length : 0})</h3>
                      <form onSubmit={(e) => handleAddComment(e, selectedArticle.id)} style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <input type="text" placeholder="Your Name" value={newCommentName} onChange={(e) => setNewCommentName(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <textarea placeholder="Type your comment here..." value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} required rows="2" style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}></textarea>
                          <button type="submit" style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: 'pointer' }}><Send size={16} /></button>
                        </div>
                      </form>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {selectedArticle.comments && selectedArticle.comments.map((comm, idx) => (
                          <div key={idx} style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{comm.name}</span>
                            <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-telugu)', marginTop: '4px' }}>{comm.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </article>
                </div>
              </div>
            )}

          </main>

          {/* Premium Footer */}
          <footer style={{ backgroundColor: 'var(--footer-bg)', color: '#9CA3AF', padding: '48px 16px 24px', borderTop: '4px solid var(--primary-red)', transition: 'var(--transition)', marginTop: '64px' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              <div>
                <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '16px' }}>Aptop News</h4>
                <p style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
                  {language === 'telugu' ? 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ప్రజలకు అత్యంత వేగవంతమైన, విశ్వసనీయమైన మరియు నిష్పక్షపాత వార్తా సేవలందిస్తున్న ఏకైక డిజిటల్ ఛానెల్.' : 'Fast • Trusted • Telugu First. Providing authentic and unbiased media services.'}
                </p>
              </div>
              <div>
                <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px' }}>Useful Links</h4>
                <ul style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                  <li><span style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>Andhra Pradesh</span></li>
                  <li><span style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>Telangana</span></li>
                  <li><span style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>Politics</span></li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '16px' }}>Policy Documents</h4>
                <ul style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                  <li>Privacy Policy</li>
                  <li>Terms & Conditions</li>
                  <li>Ad Specifications</li>
                </ul>
              </div>
            </div>
          </footer>

        </div>
      )}

      {/* ========================================== */}
      {/* VIEWPORT 2: MOBILE APP EMULATOR MOCKUP */}
      {/* ========================================== */}
      {activeView === 'mobile' && (
        <div className="emulator-wrapper" style={{ flexGrow: 1, padding: '24px 0', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
          <div className="phone-frame" style={{ width: '375px', height: '780px', borderRadius: '40px', border: '12px solid #222', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
            
            {/* Status bar mock */}
            <div style={{ height: '36px', backgroundColor: 'var(--primary-red)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 0', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 1000 }}>
              <span>19:26</span>
              <div style={{ width: '60px', height: '18px', backgroundColor: '#000', borderRadius: '10px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '4px' }}></div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span>AP/TS 5G</span>
                <span style={{ fontSize: '0.6rem' }}>🔋 100%</span>
              </div>
            </div>

            {/* SPLASH SCREEN MOCKUP */}
            {showSplash ? (
              <div style={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, bottom: 0, 
                background: 'linear-gradient(135deg, var(--primary-red) 0%, #7f1d1d 100%)', 
                color: 'white', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                zIndex: 9999,
                animation: 'fadeIn 0.5s ease-out'
              }}>
                <div style={{ backgroundColor: 'white', color: 'var(--primary-red)', padding: '16px 28px', borderRadius: '16px', fontWeight: 900, fontSize: '2.2rem', boxShadow: 'var(--shadow-lg)', animation: 'pulse 1s infinite alternate', marginBottom: '16px' }}>
                  Aptop News
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-yellow)', letterSpacing: '1px' }}>ప్రజల వార్త • ప్రజల స్వరం</h4>
                <p style={{ fontSize: '0.7rem', color: '#fca5a5', marginTop: '4px' }}>Fast • Trusted • Telugu First</p>
                
                <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={24} style={{ animation: 'spin 1.5s linear infinite' }} />
                  <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>Loading digital newsroom...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Standard App Header */}
                <div style={{ backgroundColor: 'var(--primary-red)', color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-md)', zIndex: 900 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-yellow)', animation: 'pulse 1s infinite alternate' }}></div>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.5px' }}>ఆప్టాప్ NEWS</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {premiumPlan === 'premium' && (
                      <span style={{ color: 'gold', fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid gold', padding: '2px 6px', borderRadius: '10px' }}>⭐ VIP</span>
                    )}
                    <button onClick={toggleDarkMode} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                  </div>
                </div>

                {/* Interactive Phone Body Screen */}
                <div className="phone-screen" style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
                  
                  {/* PULL TO REFRESH INDICATION */}
                  {activeMobileTab === 'home' && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0', backgroundColor: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                      <button 
                        onClick={() => {
                          fetchData();
                          alert('ఆప్టాప్ న్యూస్ ఫీడ్ తాజాకరించబడింది! (Feed refreshed successfully from local database!)');
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        <RefreshCw size={10} />
                        <span>Pull to Refresh</span>
                      </button>
                    </div>
                  )}

                  {/* 1. HOME TAB FEED */}
                  {activeMobileTab === 'home' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
                      {/* Horizontal red ticker */}
                      <div style={{ backgroundColor: 'var(--primary-red)', color: 'white', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ backgroundColor: 'var(--accent-yellow)', color: '#111', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '2px', fontWeight: 'bold' }}>బ్రేకింగ్</span>
                        <marquee style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)' }}>
                          {tickerItems.join(' • ')}
                        </marquee>
                      </div>

                      {/* District Slider Tabs */}
                      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 12px', scrollbarWidth: 'none' }}>
                        {['Visakhapatnam', 'Tirupati', 'Vijayawada', 'Hyderabad'].map(dist => (
                          <button 
                            key={dist} 
                            onClick={() => setDistrictFilter(dist)}
                            style={{ 
                              flexShrink: 0,
                              backgroundColor: districtFilter === dist ? 'var(--primary-red)' : 'var(--card-bg)', 
                              color: districtFilter === dist ? 'white' : 'var(--text-primary)', 
                              border: '1px solid var(--border-color)', 
                              padding: '6px 14px', 
                              borderRadius: '20px', 
                              fontSize: '0.75rem', 
                              fontWeight: 'bold', 
                              fontFamily: 'var(--font-telugu)',
                              cursor: 'pointer' 
                            }}
                          >
                            📍 {getDistrictTe(dist)}
                          </button>
                        ))}
                      </div>

                      {/* Featured Hero Story */}
                      {articles.filter(a => a.district === districtFilter).length > 0 ? (
                        (() => {
                          const mainArt = articles.filter(a => a.district === districtFilter)[0];
                          return (
                            <div 
                              onClick={() => {
                                setSelectedArticleId(mainArt.id);
                                setActiveMobileTab('article_detail');
                              }} 
                              style={{ padding: '0 12px', cursor: 'pointer' }}
                            >
                              <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ position: 'relative' }}>
                                  <img src={mainArt.image} style={{ width: '100%', height: '160px', objectFit: 'cover' }} alt="" />
                                  <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'var(--primary-red)', color: 'white', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{mainArt.categoryTe}</span>
                                </div>
                                <div style={{ padding: '12px' }}>
                                  <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)', lineHeight: '1.4', margin: '0 0 6px 0', textAlign: 'left' }}>{mainArt.title}</h3>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '0 0 8px 0', textAlign: 'left' }}>{mainArt.desc}</p>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#888' }}>
                                    <span>{mainArt.date}</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--primary-red)' }}>📍 {getDistrictTe(mainArt.district)} బ్యూరో</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '0.8rem' }}>
                          ఈ జిల్లాకు సంబందించిన వార్తలు త్వరలోనే ప్రచురించబడును.
                        </div>
                      )}

                      {/* Secondary inline ad (hidden for premium users) */}
                      {premiumPlan !== 'premium' && ads.length > 0 && (
                        <div style={{ margin: '0 12px', padding: '10px', backgroundColor: 'rgba(255, 213, 74, 0.05)', border: '1px dashed var(--accent-yellow)', borderRadius: '8px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--accent-yellow)', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>SPONSOR AD (Ad-Free with Gold Upgrade)</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{ads[0].advertiser || 'Aptop Ad Network'} • Click for Special Discounts!</span>
                        </div>
                      )}

                      {/* Small Articles Row-List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '8px 0 2px 0', borderLeft: '3px solid var(--primary-red)', paddingLeft: '6px', textAlign: 'left' }}>తాజా వార్తలు (More News)</h4>
                        {articles.map(art => (
                          <div 
                            key={art.id} 
                            onClick={() => {
                              setSelectedArticleId(art.id);
                              setActiveMobileTab('article_detail');
                            }} 
                            style={{ display: 'flex', gap: '10px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', cursor: 'pointer', alignItems: 'center' }}
                          >
                            <img src={art.image} style={{ width: '70px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} alt="" />
                            <div style={{ flexGrow: 1 }}>
                              <span style={{ color: 'var(--primary-red)', fontSize: '0.6rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{art.categoryTe}</span>
                              <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)', margin: '2px 0', lineHeight: '1.3', textAlign: 'left' }}>{art.title.slice(0, 70)}...</h4>
                              <span style={{ fontSize: '0.6rem', color: '#888' }}>{art.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* 2. LIVE TV TAB */}
                  {activeMobileTab === 'live' && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                          <Radio size={16} className="live-dot" />
                          <span>ఆప్టాప్ ప్రత్యక్ష ప్రసారం (Live TV Studio)</span>
                        </h3>
                      </div>
                      
                      {liveTelecasts.length > 0 ? (
                        <>
                          <iframe 
                            width="100%" 
                            height="180" 
                            src={liveTelecasts[0].embedUrl} 
                            title="Aptop News Live Stream" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                          <div style={{ backgroundColor: '#000', color: 'white', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                            <span style={{ color: 'red', fontWeight: 'bold' }}>🔴 LIVE BROADCAST</span>
                            <span>📡 Viewers: {liveTelecasts[0].viewers} online</span>
                          </div>
                          
                          {/* Live Interactive Chat Area */}
                          <div style={{ flexGrow: 1, backgroundColor: '#0f172a', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                            <span style={{ fontSize: '0.65rem', color: '#888', borderBottom: '1px solid #334155', paddingBottom: '4px', display: 'block', textAlign: 'left' }}>💬 Public Live Commentary Room</span>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', flexGrow: 1 }}>
                              <div style={{ textAlign: 'left' }}><span style={{ color: '#FFD54A', fontWeight: 'bold' }}>Ravi Teja:</span> <span style={{ color: '#fff', fontFamily: 'var(--font-telugu)' }}>తిరుమల దర్శనం అప్డేట్ చాలా బాగుంది. ఆప్టాప్ న్యూస్ ఫాస్ట్ రిపోర్టింగ్!</span></div>
                              <div style={{ textAlign: 'left' }}><span style={{ color: '#38BDF8', fontWeight: 'bold' }}>Kalyan Krishna:</span> <span style={{ color: '#fff', fontFamily: 'var(--font-telugu)' }}>విశాఖ తీర ప్రాంతాల్లో వర్షాల గురించి హెచ్చరించినందుకు థాంక్స్ బ్రో!</span></div>
                              <div style={{ textAlign: 'left' }}><span style={{ color: '#4ADE80', fontWeight: 'bold' }}>Srinivas Rao:</span> <span style={{ color: '#fff', fontFamily: 'var(--font-telugu)' }}>ఆప్టాప్ న్యూస్ నిస్సందేహంగా ఏపీలోనే నంబర్ వన్ వార్తా వేదిక.</span></div>
                              <div style={{ textAlign: 'left' }}><span style={{ color: '#F472B6', fontWeight: 'bold' }}>Anitha Reddy:</span> <span style={{ color: '#fff', fontFamily: 'var(--font-telugu)' }}>ఎన్నికల ఫలితాల mega center చాలా బాగా డిజైన్ చేశారు.</span></div>
                            </div>
                            
                            {/* Send chat message input */}
                            <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                              <input type="text" placeholder="కామెంట్ రాయండి..." style={{ flexGrow: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '6px 12px', color: 'white', fontSize: '0.7rem' }} />
                              <button style={{ backgroundColor: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Send size={12} />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                          ప్రత్యక్ష ప్రసారం స్టూడియో ప్రస్తుతం ఆఫ్లైన్ లో ఉంది.
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. REELS / SHORTS TAB */}
                  {activeMobileTab === 'reels' && (
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#000', color: 'white', position: 'relative' }}>
                      {shortsList.length > 0 ? (
                        (() => {
                          const activeShort = shortsList[0];
                          return (
                            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', justifyContent: 'flex-end', padding: '16px', background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.7) 100%), url(${activeShort.image}) center/cover no-repeat` }}>
                              
                              {/* Top district overlay tag */}
                              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                                <span style={{ backgroundColor: 'var(--primary-red)', color: 'white', fontSize: '0.65rem', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>📍 {getDistrictTe(activeShort.district)}</span>
                                <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.65rem', padding: '4px 10px', borderRadius: '20px' }}>🎬 News Shorts</span>
                              </div>

                              {/* Reels metadata details */}
                              <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'var(--font-telugu)', color: '#FFD54A', margin: 0 }}>{activeShort.title}</h3>
                                <p style={{ fontSize: '0.8rem', fontFamily: 'var(--font-telugu)', color: '#fff', margin: 0, lineHeight: '1.4' }}>{activeShort.captionTe}</p>
                                <span style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>⏱️ {activeShort.date} • 👁️ {activeShort.views} views</span>
                              </div>

                              {/* Sidebar Floating Buttons */}
                              <div style={{ position: 'absolute', right: '12px', bottom: '80px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', zIndex: 100 }}>
                                <div 
                                  onClick={() => {
                                    activeShort.views += 1;
                                    alert('ఈ న్యూస్ షార్ట్ మీకు నచ్చింది! (+1 Like Simulated locally)');
                                  }}
                                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                                >
                                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Heart size={20} style={{ color: 'red' }} />
                                  </div>
                                  <span style={{ fontSize: '0.6rem', color: '#fff', marginTop: '2px' }}>Like</span>
                                </div>

                                <div 
                                  onClick={() => alert('ఈ షార్ట్ విజయవంతంగా బుక్‌మార్క్ చేయబడింది!')}
                                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                                >
                                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bookmark size={20} />
                                  </div>
                                  <span style={{ fontSize: '0.6rem', color: '#fff', marginTop: '2px' }}>Save</span>
                                </div>

                                <div 
                                  onClick={() => alert('WhatsApp ఛానెల్ లింక్ కాపీ చేయబడింది! షేర్ చేయండి.')}
                                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                                >
                                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Share2 size={20} style={{ color: '#25D366' }} />
                                  </div>
                                  <span style={{ fontSize: '0.6rem', color: '#fff', marginTop: '2px' }}>Share</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                          షార్ట్ రీల్స్ లోడ్ అవుతున్నాయి...
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. ALERTS / NOTIFICATIONS TAB */}
                  {activeMobileTab === 'alerts' && (
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, borderLeft: '3px solid var(--primary-red)', paddingLeft: '6px', margin: '4px 0 10px 0', textAlign: 'left' }}>🔔 మొబైల్ బులెటిన్ అలర్ట్స్ (Citizen Notifications Inbox)</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', textAlign: 'left' }}>
                          <span style={{ backgroundColor: 'rgba(214, 31, 38, 0.1)', color: 'var(--primary-red)', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>POLITICS</span>
                          <span style={{ fontSize: '0.65rem', color: '#888', float: 'right' }}>ఇప్పుడే</span>
                          <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)', marginTop: '6px', lineHeight: '1.3' }}>బ్రేకింగ్: ఏపీలో నూతన పెట్టుబడులపై గ్రీన్ సిగ్నల్ ఇచ్చిన ముఖ్యమంత్రి!</h4>
                        </div>

                        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', textAlign: 'left' }}>
                          <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#D97706', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>SPIRITUAL</span>
                          <span style={{ fontSize: '0.65rem', color: '#888', float: 'right' }}>15 నిమిషాల క్రితం</span>
                          <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)', marginTop: '6px', lineHeight: '1.3' }}>తిరుమల: రేపటి నుండి వేసవి రద్దీ క్యూ లైన్లలో ప్రత్యేక సేవల నిలిపివేత.</h4>
                        </div>

                        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', textAlign: 'left' }}>
                          <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>BUSINESS</span>
                          <span style={{ fontSize: '0.65rem', color: '#888', float: 'right' }}>1 గంట క్రితం</span>
                          <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)', marginTop: '6px', lineHeight: '1.3' }}>సెన్సెక్స్ బూమ్: రికార్డ్ గరిష్టాలకు చేరిన రిలయన్స్ మరియు టాటా షేర్లు!</h4>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. PROFILE & PREMIUM BILLING TAB */}
                  {activeMobileTab === 'profile' && (
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      
                      {/* Identity Card */}
                      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          RT
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>రావి తేజ (Ravi Teja)</h3>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Aptop Premium Citizen</span>
                        </div>
                      </div>

                      {/* VIP Premium Gold Membership status */}
                      <div style={{ 
                        background: premiumPlan === 'premium' 
                          ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                          : 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
                        color: 'white', 
                        borderRadius: '12px', 
                        padding: '16px', 
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-md)'
                      }}>
                        {premiumPlan === 'premium' ? (
                          <>
                            <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: '0 0 4px 0', letterSpacing: '0.5px' }}>⭐ GOLD VIP AD-FREE ACTIVE</h4>
                            <p style={{ fontSize: '0.75rem', color: '#FEF3C7', margin: '0 0 12px 0' }}>All interstitial ads hidden dynamically. Daily E-papers active!</p>
                            <button 
                              onClick={() => {
                                setPremiumPlan('free');
                                localStorage.setItem('premium_plan', 'free');
                                alert('Premium membership cancelled.');
                              }}
                              style={{ backgroundColor: 'white', color: '#D97706', border: 'none', padding: '6px 16px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Reset Free Status
                            </button>
                          </>
                        ) : (
                          <>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 4px 0' }}>Free Ad-Supported Account</h4>
                            <p style={{ fontSize: '0.7rem', color: '#E5E7EB', margin: '0 0 12px 0' }}>Upgrade to Ad-Free reading experience, dynamic voice bulletins, and printable PDF E-papers!</p>
                            <button 
                              onClick={() => setShowPremiumCheckout(true)}
                              style={{ backgroundColor: 'var(--accent-yellow)', color: '#111', border: 'none', padding: '8px 20px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', animation: 'pulse 1.2s infinite alternate' }}
                            >
                              ⭐ UPGRADE TO PREMIUM GOLD ($2/mo)
                            </button>
                          </>
                        )}
                      </div>

                      {/* Premium Checkout modal-form overlay inside phone viewport */}
                      {showPremiumCheckout && (
                        <div style={{ backgroundColor: 'var(--card-bg)', border: '2px solid var(--accent-yellow)', borderRadius: '12px', padding: '16px', textAlign: 'left' }}>
                          <h4 style={{ color: 'var(--primary-red)', fontSize: '0.9rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>⭐ Gold Subscription Secure Checkout</h4>
                          <form onSubmit={handleSubscribePremium} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input type="text" placeholder="Full Name" value={checkoutName} onChange={(e) => setCheckoutName(e.target.value)} required style={{ padding: '8px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                            <input type="email" placeholder="Email Address" value={checkoutEmail} onChange={(e) => setCheckoutEmail(e.target.value)} required style={{ padding: '8px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                            <input type="text" placeholder="UPI ID / Card Number (4444 ...)" value={checkoutCard} onChange={(e) => setCheckoutCard(e.target.value)} required style={{ padding: '8px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                            
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                              <button type="submit" disabled={checkoutProcessing} style={{ flexGrow: 1, backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                                {checkoutProcessing ? 'Authorizing Secure Payment...' : 'Secure Pay $2.00 (Activate Gold)'}
                              </button>
                              <button type="button" onClick={() => setShowPremiumCheckout(false)} style={{ backgroundColor: '#ccc', color: '#333', border: 'none', padding: '8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Saved bookmarks links list */}
                      <div style={{ textAlign: 'left' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, margin: '0 0 8px 0', borderLeft: '3px solid var(--primary-red)', paddingLeft: '6px' }}>చదివేందుకు దాచుకున్నవి (Saved Articles)</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {articles.slice(1, 3).map(art => (
                            <div 
                              key={art.id} 
                              onClick={() => {
                                setSelectedArticleId(art.id);
                                setActiveMobileTab('article_detail');
                              }}
                              style={{ padding: '8px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', gap: '8px', cursor: 'pointer', alignItems: 'center' }}
                            >
                              <Bookmark size={14} style={{ color: 'var(--primary-red)' }} />
                              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-telugu)', fontWeight: 'bold' }}>{art.title.slice(0, 50)}...</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 6. DETAILED MOBILE ARTICLE READ SCREEN */}
                  {activeMobileTab === 'article_detail' && (
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button 
                        onClick={() => setActiveMobileTab('home')} 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', width: 'fit-content' }}
                      >
                        <ArrowLeft size={12} />
                        <span>Back to Feed</span>
                      </button>

                      <span style={{ backgroundColor: 'var(--primary-red)', color: 'white', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', width: 'fit-content' }}>{selectedArticle.categoryTe}</span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)', lineHeight: '1.4', margin: '4px 0', textAlign: 'left' }}>{selectedArticle.title}</h3>
                      <img src={selectedArticle.image} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} alt="" />

                      {/* AI VOICE READER WIDGET IN MOBILE SCREEN */}
                      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Cpu size={12} />
                            <span>ఆప్టాప్ AI వాయిస్ రీడర్ (Telugu Voice Reader)</span>
                          </span>
                          <span style={{ fontSize: '0.65rem', backgroundColor: '#FEF3C7', color: '#D97706', padding: '1px 6px', borderRadius: '4px' }}>SPEECH ON</span>
                        </div>

                        {/* Speech controller buttons */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                            onClick={() => handleSpeakArticle(selectedArticle)}
                            style={{ 
                              backgroundColor: voiceReaderIsPlaying ? '#DC2626' : 'var(--primary-red)', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: '4px', 
                              fontSize: '0.7rem', 
                              fontWeight: 'bold', 
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Play size={10} />
                            <span>{voiceReaderIsPlaying ? 'PAUSE READER' : 'SPEAK ARTICLE'}</span>
                          </button>

                          {/* Speed rates */}
                          <select 
                            value={voiceReaderRate}
                            onChange={(e) => setVoiceReaderRate(parseFloat(e.target.value))}
                            style={{ padding: '4px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                          >
                            <option value="0.75">0.75x Speed</option>
                            <option value="1">1.0x Speed</option>
                            <option value="1.25">1.25x Speed</option>
                            <option value="1.5">1.5x Speed</option>
                          </select>
                        </div>

                        {/* Running sound waveform (pulsing animation) */}
                        {voiceReaderIsPlaying && (
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '14px', marginTop: '4px', justifyContent: 'center' }}>
                            <div style={{ width: '3px', height: '10px', backgroundColor: 'var(--primary-red)', animation: 'pulse 0.4s infinite alternate' }}></div>
                            <div style={{ width: '3px', height: '14px', backgroundColor: 'var(--primary-red)', animation: 'pulse 0.6s infinite alternate' }}></div>
                            <div style={{ width: '3px', height: '6px', backgroundColor: 'var(--primary-red)', animation: 'pulse 0.3s infinite alternate' }}></div>
                            <div style={{ width: '3px', height: '12px', backgroundColor: 'var(--primary-red)', animation: 'pulse 0.5s infinite alternate' }}></div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Synthesizing speech...</span>
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '0.8rem', lineHeight: '1.6', fontFamily: 'var(--font-telugu)', textAlign: 'left', margin: 0 }}>{selectedArticle.desc}</p>
                    </div>
                  )}

                </div>

                {/* Bottom App Footer Tab Bar */}
                <div className="phone-footer" style={{ borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-around', padding: '6px 0 18px', backgroundColor: 'var(--card-bg)', zIndex: 1000 }}>
                  <button className={`phone-footer-btn ${activeMobileTab === 'home' ? 'active' : ''}`} onClick={() => setActiveMobileTab('home')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeMobileTab === 'home' ? 'var(--primary-red)' : 'var(--text-secondary)' }}><Newspaper size={18} /><span style={{ fontSize: '0.65rem', marginTop: '2px', fontWeight: 'bold' }}>హోమ్</span></button>
                  <button className={`phone-footer-btn ${activeMobileTab === 'live' ? 'active' : ''}`} onClick={() => setActiveMobileTab('live')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeMobileTab === 'live' ? 'var(--primary-red)' : 'var(--text-secondary)' }}><Radio size={18} /><span style={{ fontSize: '0.65rem', marginTop: '2px', fontWeight: 'bold' }}>లైవ్ TV</span></button>
                  <button className={`phone-footer-btn ${activeMobileTab === 'reels' ? 'active' : ''}`} onClick={() => setActiveMobileTab('reels')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeMobileTab === 'reels' ? 'var(--primary-red)' : 'var(--text-secondary)' }}><Film size={18} /><span style={{ fontSize: '0.65rem', marginTop: '2px', fontWeight: 'bold' }}>షార్ట్స్</span></button>
                  <button className={`phone-footer-btn ${activeMobileTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveMobileTab('alerts')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeMobileTab === 'alerts' ? 'var(--primary-red)' : 'var(--text-secondary)' }}><Bell size={18} /><span style={{ fontSize: '0.65rem', marginTop: '2px', fontWeight: 'bold' }}>అలర్ట్స్</span></button>
                  <button className={`phone-footer-btn ${activeMobileTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveMobileTab('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeMobileTab === 'profile' ? 'var(--primary-red)' : 'var(--text-secondary)' }}><User size={18} /><span style={{ fontSize: '0.65rem', marginTop: '2px', fontWeight: 'bold' }}>ప్రొఫైల్</span></button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VIEWPORT 3: CMS NEWSROOM DASHBOARD */}
      {/* ========================================== */}
      {activeView === 'cms' && (
        <div style={{ flexGrow: 1, display: 'flex', backgroundColor: '#F3F4F6', color: '#111827' }}>
          
          {/* CMS SECURE ACCESS CHECK WALL */}
          {!cmsToken ? (
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
              <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(214, 31, 38, 0.1)', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Lock size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>Secure Newsroom Gateway</h3>
                <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '24px' }}>JWT Encrypted Session. Authorized Editors & Super Admins only.</p>
                
                {loginError && (
                  <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '16px' }}>
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleCmsLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#9CA3AF' }} />
                    <input 
                      type="email" 
                      placeholder="admin@aptop.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '6px', border: '1px solid #D1D5DB' }} 
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#9CA3AF' }} />
                    <input 
                      type="password" 
                      placeholder="Password (admin123)" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '6px', border: '1px solid #D1D5DB' }} 
                    />
                  </div>
                  <button type="submit" style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Verify & Authenticate JWT
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* CMS SIDEBAR */}
              <aside style={{ width: '260px', backgroundColor: '#1E1E1E', color: '#D1D5DB', display: 'flex', flexDirection: 'column', borderRight: '1px solid #2D2D2D' }} className="cms-workspace">
                <div style={{ padding: '24px 20px', borderBottom: '1px solid #2D2D2D', backgroundColor: '#1A1A1A' }}>
                  <h3 style={{ color: '#D61F26', fontSize: '1.25rem', fontWeight: 800 }}>ఆప్టాప్ CMS</h3>
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>Newsroom Dashboard</p>
                </div>

                <div style={{ padding: '12px 20px', borderBottom: '1px solid #2D2D2D', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem' }}>User: <strong>{cmsUser ? cmsUser.username : ''}</strong></span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Access: {cmsUser ? cmsUser.role : ''}</span>
                    <button onClick={handleCmsLogout} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><LogOut size={12} /> LogOut</button>
                  </div>
                  
                  {/* ONE CLICK EMERGENCY RED MODE */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px dashed #374151', paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>EMERGENCY CONTROL CENTER</span>
                    <button 
                      onClick={toggleEmergencyMode}
                      style={{ 
                        backgroundColor: emergencyMode ? '#DC2626' : '#374151', 
                        color: 'white', 
                        border: 'none', 
                        padding: '6px', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <AlertOctagon size={12} />
                      <span>{emergencyMode ? 'Emergency Red Mode: ON' : 'Turn ON Emergency Red'}</span>
                    </button>
                  </div>
                </div>

                <nav style={{ padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                  <button onClick={() => setActiveCmsTab('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'dashboard' ? '#D61F26' : 'transparent', color: activeCmsTab === 'dashboard' ? 'white' : '#D1D5DB' }}><BarChart3 size={16} /> <span>Dashboard Home</span></button>
                  <button onClick={() => setActiveCmsTab('articles')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'articles' ? '#D61F26' : 'transparent', color: activeCmsTab === 'articles' ? 'white' : '#D1D5DB' }}><Newspaper size={16} /> <span>Articles Manager ({articles.length})</span></button>
                  <button onClick={() => setActiveCmsTab('shorts')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'shorts' ? '#D61F26' : 'transparent', color: activeCmsTab === 'shorts' ? 'white' : '#D1D5DB' }}><Film size={16} /> <span>Shorts Studio ({shortsList.length})</span></button>
                  <button onClick={() => setActiveCmsTab('live_telecast')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'live_telecast' ? '#D61F26' : 'transparent', color: activeCmsTab === 'live_telecast' ? 'white' : '#D1D5DB' }}><Radio size={16} /> <span>Live Telecast Studio</span></button>
                  <button onClick={() => setActiveCmsTab('ai_assistant')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'ai_assistant' ? '#D61F26' : 'transparent', color: activeCmsTab === 'ai_assistant' ? 'white' : '#D1D5DB' }}><Cpu size={16} /> <span>AI Newsroom Assistant</span></button>
                  <button onClick={() => setActiveCmsTab('ticker')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'ticker' ? '#D61F26' : 'transparent', color: activeCmsTab === 'ticker' ? 'white' : '#D1D5DB' }}><Flame size={16} /> <span>Breaking Tickers</span></button>
                  <button onClick={() => setActiveCmsTab('audit_logs')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'audit_logs' ? '#D61F26' : 'transparent', color: activeCmsTab === 'audit_logs' ? 'white' : '#D1D5DB' }}><FileText size={16} /> <span>Security Audit Logs</span></button>
                </nav>

                <div style={{ padding: '16px', borderTop: '1px solid #2D2D2D', fontSize: '0.75rem', textAlign: 'center' }}>
                  &copy; 2026 Aptop CMS v2.8
                </div>
              </aside>

              {/* CMS WORKSPACE CONTENT */}
              <main style={{ flexGrow: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
                
                {cmsSuccessMsg && (
                  <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '14px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #A7F3D0' }}>
                    <CheckCircle2 size={18} />
                    <span>{cmsSuccessMsg}</span>
                  </div>
                )}

                {/* TAB: CMS DASHBOARD HOME */}
                {activeCmsTab === 'dashboard' && (
                  <>
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Newsroom Production Analytics</h2>
                        <p style={{ color: '#6B7280' }}>Persistent DB Stats & Real-Time Client Sessions Overview.</p>
                      </div>
                      
                      {/* SITEMAPS DISCOVER INTEGRATOR CARD */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Google Discover XML Sitemaps</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#059669' }}>Status: Generating Active Pings</span>
                        </div>
                        <button onClick={triggerGoogleDiscoverPing} style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>Ping Google</button>
                      </div>
                    </div>

                    {sitemapPingStatus && (
                      <div style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {sitemapPingStatus}
                      </div>
                    )}

                    {/* STATS CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }} className="cms-stats-grid">
                      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #D61F26' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 'bold' }}>Total Articles</span>
                        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px' }}>{articles.length}</h3>
                      </div>
                      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #FFD54A' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 'bold' }}>Breaking Alerts Active</span>
                        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px' }}>{tickerItems.length}</h3>
                      </div>
                      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #10B981' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 'bold' }}>Simulated Visitors</span>
                        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px' }}>{analytics.liveVisitors}</h3>
                      </div>
                      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #3B82F6' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 'bold' }}>CPC Estimated Earnings</span>
                        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center' }}><DollarSign size={24} />{analytics.estimatedEarnings}</h3>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="news-grid-2">
                      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 'bold' }}>Daily Traffic Trend (Clicks per hour)</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', paddingTop: '20px', borderBottom: '2px solid #E5E7EB' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%' }}>
                            <div style={{ height: '70px', width: '100%', backgroundColor: '#D61F26', borderRadius: '4px 4px 0 0' }}></div>
                            <span style={{ fontSize: '0.7rem', marginTop: '6px' }}>08 AM</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%' }}>
                            <div style={{ height: '140px', width: '100%', backgroundColor: '#D61F26', borderRadius: '4px 4px 0 0' }}></div>
                            <span style={{ fontSize: '0.7rem', marginTop: '6px' }}>12 PM</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%' }}>
                            <div style={{ height: '160px', width: '100%', backgroundColor: '#D61F26', borderRadius: '4px 4px 0 0' }}></div>
                            <span style={{ fontSize: '0.7rem', marginTop: '6px' }}>04 PM</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 'bold' }}>Local AP/TS Corporate Advertisers CPC Ledger</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {ads.map(ad => (
                            <div key={ad.id} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span><strong>{ad.placement}</strong> ({ad.advertiser})</span>
                                <span>{ad.clicks} clicks | <strong>${ad.revenue} Earned</strong></span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                    {/* Google Discover, Push Alert, & Bureau Performance Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
                      
                      {/* Panel 1: Google Discover Ranking & Search Metrics */}
                      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#111827' }}>
                          <Search size={18} style={{ color: '#3B82F6' }} />
                          <span>Google Discover Search Ranking</span>
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block' }}>Discover Clicks</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#3B82F6' }}>125.4K</span>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block' }}>Impressions</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981' }}>2.84M</span>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block' }}>Average CTR</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F59E0B' }}>4.41%</span>
                          </div>
                        </div>
                        <h5 style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', color: '#4B5563' }}>Top Trending Google Search Queries:</h5>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '4px' }}>
                            <span style={{ fontFamily: 'var(--font-telugu)', fontWeight: 'bold' }}>1. తిరుమల లడ్డూ వార్తలు (Tirumala Ladoo News)</span>
                            <span style={{ color: '#059669' }}>3.8K clicks</span>
                          </li>
                          <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #F3F4F6', paddingBottom: '4px' }}>
                            <span style={{ fontFamily: 'var(--font-telugu)', fontWeight: 'bold' }}>2. ఏపీ కొత్త నిధులు (AP Budget Allocations)</span>
                            <span style={{ color: '#059669' }}>2.1K clicks</span>
                          </li>
                          <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: 'var(--font-telugu)', fontWeight: 'bold' }}>3. విశాఖ వర్షం అలర్ట్ (Vizag Rains Warning)</span>
                            <span style={{ color: '#059669' }}>1.9K clicks</span>
                          </li>
                        </ul>
                      </div>

                      {/* Panel 2: Push Notification CTR Analytics */}
                      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#111827' }}>
                          <Bell size={18} style={{ color: '#EF4444' }} />
                          <span>Push Notification Broadcast CTR</span>
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block' }}>Total Pushes Delivered</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>450,290</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block' }}>Avg Open Rate</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#DC2626' }}>14.2%</span>
                          </div>
                        </div>
                        <h5 style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', color: '#4B5563' }}>Open CTR by Category:</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '2px' }}>
                              <span>Politics (ఆంధ్రప్రదేశ్ & తెలంగాణ రాజకీయం)</span>
                              <strong>18.5% CTR</strong>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px' }}><div style={{ width: '18.5%', height: '100%', backgroundColor: '#DC2626', borderRadius: '3px' }}></div></div>
                          </div>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '2px' }}>
                              <span>Crime (నేరాలు & దర్యాప్తు)</span>
                              <strong>16.1% CTR</strong>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px' }}><div style={{ width: '16.1%', height: '100%', backgroundColor: '#F59E0B', borderRadius: '3px' }}></div></div>
                          </div>
                        </div>
                      </div>

                      {/* Panel 3: Bureau Performance Ledger */}
                      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#111827' }}>
                          <Users size={18} style={{ color: '#10B981' }} />
                          <span>Local District Bureau Performance</span>
                        </h4>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
                                <th style={{ padding: '6px 4px', textAlign: 'left' }}>Bureau</th>
                                <th style={{ padding: '6px 4px', textAlign: 'right' }}>Stories</th>
                                <th style={{ padding: '6px 4px', textAlign: 'right' }}>Visitors</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>📍 Visakhapatnam</td>
                                <td style={{ padding: '8px 4px', textAlign: 'right' }}>12</td>
                                <td style={{ padding: '8px 4px', textAlign: 'right', color: '#059669', fontWeight: 'bold' }}>45K</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>📍 Tirupati Bureau</td>
                                <td style={{ padding: '8px 4px', textAlign: 'right' }}>9</td>
                                <td style={{ padding: '8px 4px', textAlign: 'right', color: '#059669', fontWeight: 'bold' }}>32K</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '8px 4px', fontWeight: 'bold' }}>📍 Vijayawada Bureau</td>
                                <td style={{ padding: '8px 4px', textAlign: 'right' }}>15</td>
                                <td style={{ padding: '8px 4px', textAlign: 'right', color: '#059669', fontWeight: 'bold' }}>64K</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </>
                )}

                {/* TAB: ARTICLE EDITOR */}
                {activeCmsTab === 'articles' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="news-grid-3">
                    <div style={{ gridColumn: 'span 2', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 'bold' }}>All Published Stories</h3>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                              <th style={{ padding: '12px', textAlign: 'left' }}>Headline</th>
                              <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                              <th style={{ padding: '12px', textAlign: 'left' }}>Priority</th>
                              <th style={{ padding: '12px', textAlign: 'left' }}>Slug URL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {articles.map(art => (
                              <tr key={art.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold', fontFamily: 'var(--font-telugu)' }}>{art.title}</td>
                                <td style={{ padding: '12px' }}>{art.category}</td>
                                <td style={{ padding: '12px' }}><span style={{ backgroundColor: art.priority === 'Emergency' ? '#FEE2E2' : '#E0F2FE', color: art.priority === 'Emergency' ? '#991B1B' : '#0369A1', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{art.priority}</span></td>
                                <td style={{ padding: '12px', color: '#6B7280', fontSize: '0.75rem' }}>/{art.slug}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 'bold', borderBottom: '2px solid #F3F4F6', paddingBottom: '8px' }}>Publish New Article</h3>
                      
                      {/* AWS S3/CLOUDINARY MEDIA UPLOAD PLACEMENT */}
                      <div style={{ border: '2px dashed #D1D5DB', borderRadius: '6px', padding: '16px', textAlign: 'center', marginBottom: '16px', backgroundColor: '#F9FAFB' }}>
                        <UploadCloud size={28} style={{ color: '#9CA3AF', margin: '0 auto 8px' }} />
                        <span style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>S3/Cloudinary Direct Image Upload</span>
                        <input type="file" id="media-file" onChange={handleFileUploadSimulate} style={{ display: 'none' }} />
                        <label htmlFor="media-file" style={{ backgroundColor: 'var(--primary-red)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>Browse File</label>
                        
                        {isUploading && (
                          <div style={{ marginTop: '12px' }}>
                            <div style={{ height: '6px', width: '100%', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: '#10B981', transition: 'width 0.2s' }}></div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '4px', display: 'block' }}>Uploading: {uploadProgress}%</span>
                          </div>
                        )}
                        {uploadedUrl && (
                          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#065F46', fontWeight: 'bold' }}>
                            ✓ Cloudinary Url Loaded!
                          </div>
                        )}
                      </div>

                      <form onSubmit={handlePublishArticle} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Telugu Headline (ශීර්ෂిక):</label>
                          <input type="text" className="form-control" value={artTitleTe} onChange={(e) => setArtTitleTe(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>English Headline:</label>
                          <input type="text" className="form-control" value={artTitleEn} onChange={(e) => setArtTitleEn(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Auto SEO Slug Link:</label>
                          <input type="text" className="form-control" value={artSlug} onChange={(e) => setArtSlug(e.target.value)} style={{ backgroundColor: '#F3F4F6', color: '#4B5563' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem' }}>Category:</label>
                            <select className="form-control" value={artCategory} onChange={(e) => setArtCategory(e.target.value)}>
                              <option value="Politics">Politics</option>
                              <option value="Business">Business</option>
                              <option value="Technology">Technology</option>
                              <option value="Cinema">Cinema</option>
                              <option value="Jobs & Education">Jobs & Education</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem' }}>District Focus:</label>
                            <select className="form-control" value={artDistrict} onChange={(e) => setArtDistrict(e.target.value)}>
                              <option value="Visakhapatnam">Visakhapatnam</option>
                              <option value="Tirupati">Tirupati</option>
                              <option value="Vijayawada">Vijayawada</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem' }}>Priority:</label>
                            <select className="form-control" value={artPriority} onChange={(e) => setArtPriority(e.target.value)}>
                              <option value="Normal">Normal</option>
                              <option value="Urgent">Urgent</option>
                              <option value="Emergency">Emergency</option>
                            </select>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '24px' }}>
                            <input type="checkbox" checked={artPinTop} onChange={(e) => setArtPinTop(e.target.checked)} />
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Pin to Top</label>
                          </div>
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Article Content (Telugu):</label>
                          <textarea rows="3" className="form-control" value={artDescTe} onChange={(e) => setArtDescTe(e.target.value)} required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Publish to Live Feed</button>
                      </form>
                    </div>
                  </div>
                )}

                {/* TAB: CMS SHORTS STUDIO */}
                {activeCmsTab === 'shorts' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="news-grid-2">
                    
                    {/* Column 1: Shorts Creator Form */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-red)', margin: 0 }}>Telugu News Shorts Studio</h2>
                        <p style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '2px' }}>Publish premium vertical 9:16 reels directly to the citizen app stream.</p>
                      </div>

                      <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', backgroundColor: '#F9FAFB' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#111827', marginBottom: '8px' }}>
                          <Cpu size={14} style={{ color: 'var(--primary-red)' }} />
                          <span>AI Shorts Title & Caption Generator</span>
                        </h4>
                        <button 
                          type="button" 
                          onClick={async () => {
                            setAiShortMetaLoading(true);
                            setTimeout(() => {
                              setShortTitle('వైజాగ్ సముద్ర తీరంలో భారీ అలలు!');
                              setShortCaption('తీర ప్రాంత ప్రజలు అప్రమత్తంగా ఉండాలని హెచ్చరించిన వాతావరణ శాఖ. లోతట్టు ప్రాంతాల ఖాళీకరణ.');
                              setAiShortMetaLoading(false);
                              alert('AI Reels Meta generated successfully for District Bureau broadcast!');
                            }, 1200);
                          }}
                          disabled={aiShortMetaLoading}
                          style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          {aiShortMetaLoading ? 'Compiling AI Reels...' : '🪄 Generate AI Reels Meta'}
                        </button>
                      </div>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!shortTitle || !shortCaption) return;
                        
                        try {
                          const res = await fetch(`${BACKEND_URL}/api/shorts`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              title: shortTitle,
                              captionTe: shortCaption,
                              district: shortDistrict,
                              image: shortImage,
                              views: 10
                            })
                          });
                          if (res.ok) {
                            const updatedList = await res.json();
                            setShortsList(updatedList);
                            setShortTitle('');
                            setShortCaption('');
                            alert('న్యూస్ షార్ట్ విజయవంతంగా ప్రచురించబడింది! (Short published and broadcasted to Socket.IO channels!)');
                          }
                        } catch (err) {
                          alert('Failed to publish reel to dynamic server collection.');
                        }
                      }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Reel Short Title (శీర్షిక):</label>
                          <input type="text" className="form-control" value={shortTitle} onChange={(e) => setShortTitle(e.target.value)} placeholder="వైజాగ్ తీరంలో వర్షాలు" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Reel Captions (వివరణ):</label>
                          <textarea className="form-control" rows="3" value={shortCaption} onChange={(e) => setShortCaption(e.target.value)} placeholder="పూర్తి వివరాలు మరియు హెచ్చరికలు..." required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}></textarea>
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Target District Bureau (జిల్లా బ్యూరో):</label>
                          <select className="form-control" value={shortDistrict} onChange={(e) => setShortDistrict(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                            <option value="Visakhapatnam">Visakhapatnam (విశాఖపట్నం)</option>
                            <option value="Tirupati">Tirupati (తిరుపతి)</option>
                            <option value="Vijayawada">Vijayawada (విజయవాడ)</option>
                            <option value="Hyderabad">Hyderabad (హైదరాబాద్)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Visual Asset Cover Image (కవర్ చిత్రం):</label>
                          <input type="text" className="form-control" value={shortImage} onChange={(e) => setShortImage(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                        </div>

                        <button type="submit" style={{ backgroundColor: 'var(--primary-red)', color: 'white', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Radio size={16} /> Publish Short Reel</button>
                      </form>
                    </div>

                    {/* Column 2: 9:16 Vertical Preview Mock */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Vertical 9:16 Shorts Feed Preview</h4>
                      
                      <div style={{ width: '240px', height: '420px', borderRadius: '24px', border: '6px solid #222', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '12px', background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.6) 100%), url(${shortImage || '/vizag.png'}) center/cover no-repeat` }}>
                        
                        <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'var(--primary-red)', color: 'white', fontSize: '0.55rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                          📍 {shortDistrict}
                        </div>

                        <div style={{ textAlign: 'left', color: 'white' }}>
                          <h5 style={{ fontSize: '0.8rem', color: '#FFD54A', fontWeight: 'bold', margin: '0 0 2px 0' }}>{shortTitle || 'వైజాగ్ సముద్ర తీరం'}</h5>
                          <p style={{ fontSize: '0.65rem', color: '#E5E7EB', margin: 0, lineHeight: '1.3' }}>{shortCaption || 'మరికొద్ది గంటల్లో విశాఖ జిల్లా వ్యాప్తంగా మోస్తరు నుండి భారీ వర్షాలు పడే అవకాశం...'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: LIVE TELECAST STUDIO */}
                {activeCmsTab === 'live_telecast' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Live Telecast studio</h2>
                    <p style={{ color: '#6B7280', marginBottom: '24px' }}>Embed YouTube/Facebook RTMP streams, update titles, select spiritual/debate/election topics, and go live instantly.</p>
                    
                    <form onSubmit={handleScheduleLiveTelecast} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Telugu Live Title:</label>
                        <input type="text" className="form-control" value={newLiveTitleTe} onChange={(e) => setNewLiveTitleTe(e.target.value)} placeholder="ఈరోజు తిరుమల ప్రత్యక్ష ప్రసారం..." required />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>YouTube Live Embed/Video URL:</label>
                        <input type="text" className="form-control" value={newLiveEmbed} onChange={(e) => setNewLiveEmbed(e.target.value)} placeholder="https://www.youtube.com/embed/..." required />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Category:</label>
                        <select className="form-control" value={newLiveCategory} onChange={(e) => setNewLiveCategory(e.target.value)}>
                          <option value="Spiritual">Spiritual</option>
                          <option value="Politics">Politics</option>
                          <option value="Cinema">Cinema</option>
                          <option value="Sports">Sports</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}><Radio size={16} /> Pinned Telecast Live</button>
                    </form>
                  </div>
                )}

                {/* TAB: AI ASSISTANT WIZARD */}
                {activeCmsTab === 'ai_assistant' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="news-grid-2">
                    
                    {/* WIZARD COLUMN 1: HEADLINE GENERATOR & WRITE */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-red)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={18} /> AI Headlines & Full Writer</h3>
                      
                      <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '16px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>1. Enter Topic to Generate Options:</label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <input type="text" className="form-control" value={aiHeadlineTopic} onChange={(e) => setAiHeadlineTopic(e.target.value)} placeholder="Vizag heavy rainfall warning" style={{ padding: '8px' }} />
                          <button type="button" onClick={triggerAiHeadlineGenerator} style={{ backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {isAiHeadlineLoading ? 'Generating...' : 'Headlines'}
                          </button>
                        </div>

                        {aiGenTeluguHeadlines.length > 0 && (
                          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Suggested Telugu Headlines (Click to insert):</span>
                            {aiGenTeluguHeadlines.map((head, i) => (
                              <div key={i} onClick={() => { setArtTitleTe(head); setArtTitleEn(aiGenEnglishHeadlines[0] || ''); }} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', backgroundColor: '#F9FAFB', fontFamily: 'var(--font-telugu)' }}>
                                {head}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>2. Full AI Article Draft Engine:</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                          <input type="text" placeholder="Topic: Cyclone warning alert" className="form-control" value={aiFullTopic} onChange={(e) => setAiFullTopic(e.target.value)} />
                          <input type="text" placeholder="Keywords: rain, alert, coast" className="form-control" value={aiFullKeywords} onChange={(e) => setAiFullKeywords(e.target.value)} />
                          <button type="button" onClick={triggerAiFullWriter} style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {isAiFullLoading ? 'Drafting Story...' : 'Auto-Write Telugu Article'}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* WIZARD COLUMN 2: BREAKING 2-LINER */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-red)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertOctagon size={18} /> AI Instant Breaking News Mode</h3>
                      <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '12px' }}>Type two lines of an emergency situation, and AI will instantly generate ticker flash marquee texts, mobile push alerts, and pinned emergency summaries.</p>
                      
                      <form onSubmit={(e) => { e.preventDefault(); triggerAiBreakingMode(); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <textarea rows="3" className="form-control" value={aiShortText} onChange={(e) => setAiShortText(e.target.value)} placeholder="Fire accident in Gachibowli IT park, 4 trucks on site..." required></textarea>
                        <button type="submit" style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                          {isAiBreakingLoading ? 'Processing...' : 'Compile Instant Breaking News'}
                        </button>
                      </form>
                    </div>

                  </div>
                )}

                {/* TAB: BREAKING TICKER */}
                {activeCmsTab === 'ticker' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Scrolling Breaking News Ticker</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="news-grid-2">
                      <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 'bold' }}>Running Ticker Streams</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {tickerItems.map((tick, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', fontFamily: 'var(--font-telugu)' }}>{tick}</span>
                              <button onClick={() => handleDeleteTickerItem(index)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><X size={16} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 'bold' }}>Add Live Ticker</h3>
                        <form onSubmit={handleAddTickerItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <input type="text" className="form-control" value={newTickerText} onChange={(e) => setNewTickerText(e.target.value)} placeholder="శీర్షిక టైప్ చేయండి..." required />
                          <button type="submit" className="btn btn-primary">Add Flash Alert</button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: SECURE AUDIT LOGS */}
                {activeCmsTab === 'audit_logs' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Administrative Security Audit trail</h2>
                    <p style={{ color: '#6B7280', marginBottom: '20px' }}>Logs all content publication, modification, and ticker adjustments for newsroom integrity.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {auditLogs.map(log => (
                        <div key={log.id} style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem' }}>
                          <div>
                            <span style={{ backgroundColor: '#E5E7EB', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem', marginRight: '8px' }}>{log.role}</span>
                            <strong>{log.user}</strong>: <span style={{ color: '#374151' }}>{log.action}</span>
                          </div>
                          <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </main>
            </>
          )}
        </div>
      )}

    </div>
  );
}
