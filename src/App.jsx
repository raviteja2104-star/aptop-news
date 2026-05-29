import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  Search, Sun, Moon, Share2, Bookmark, Heart, Send, CheckCircle2, 
  MapPin, Radio, Film, Flame, Bell, User, ArrowLeft, SendHorizontal, 
  ChevronRight, Calendar, Landmark, BookOpen, AlertTriangle, Cpu, Plus, 
  TrendingUp, Award, Newspaper, Smartphone, Laptop, Check, X, BellOff, MessageSquare,
  Settings, Users, BarChart3, Image, Video, Megaphone, RefreshCw, Layers, Globe,
  Lock, KeyRound, LogOut, FileText, UploadCloud, Copy, HelpCircle, DollarSign, DownloadCloud,
  Play, ThumbsUp, Smile, AlertOctagon, HelpCircle as QuestionIcon, Menu, Eye
} from 'lucide-react';

const IS_PROD = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const BACKEND_URL = IS_PROD ? '' : 'http://localhost:5000';
let socket = { on: () => {}, emit: () => {}, disconnect: () => {} };

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
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  
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

  // ── FEATURE 1: AI NEWSROOM AUTOMATION ──────────────────────────────
  const [trendingTopics] = useState([
    { topic: 'AP రాజకీయాలు (AP Politics)', district: 'Vijayawada', urgency: 92, category: 'Politics', icon: '🗳️' },
    { topic: 'సైక్లోన్ హెచ్చరిక (Cyclone Alert)', district: 'Visakhapatnam', urgency: 98, category: 'Weather', icon: '🌀' },
    { topic: 'తోల్లీవుడ్ విడుదల (Tollywood Release)', district: 'Hyderabad', urgency: 75, category: 'Cinema', icon: '🎬' },
    { topic: 'తిరుమల అప్డేట్ (Tirumala Update)', district: 'Tirupati', urgency: 84, category: 'Spiritual', icon: '🕉️' },
    { topic: 'బంగారం ధరలు (Gold Rates)', district: 'All AP/TS', urgency: 60, category: 'Business', icon: '💰' },
  ]);
  const [aiDraftTopic, setAiDraftTopic] = useState('');
  const [aiDraftResult, setAiDraftResult] = useState(null);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [factCheckFlags, setFactCheckFlags] = useState([]);

  // ── FEATURE 2: BREAKING NEWS WAR ROOM ──────────────────────────────
  const [warRoomActive, setWarRoomActive] = useState(false);
  const [warRoomIncident, setWarRoomIncident] = useState('');
  const [warRoomSeverity, setWarRoomSeverity] = useState('High');
  const [warRoomDistrict, setWarRoomDistrict] = useState('Visakhapatnam');
  const [warRoomAlerts, setWarRoomAlerts] = useState([
    { id: 1, title: 'వైజాగ్ తీరంలో సైక్లోన్ హెచ్చరిక (Cyclone Alert Visakhapatnam Coast)', severity: 'Critical', district: 'Visakhapatnam', time: '08:42 AM', pinned: true },
    { id: 2, title: 'AP అసెంబ్లీ సమావేశం ప్రారంభం (AP Assembly Session Opens)', severity: 'High', district: 'Amaravati', time: '10:15 AM', pinned: false },
  ]);

  // ── FEATURE 3: TRUST & VERIFICATION ────────────────────────────────
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionArticleId, setCorrectionArticleId] = useState(null);
  const [correctionText, setCorrectionText] = useState('');

  // ── FEATURE 4: REVENUE INTELLIGENCE ────────────────────────────────
  const [revenueMetrics] = useState({
    totalCPM: 1.84, totalCPC: 0.42, totalConversions: 248,
    districtRevenue: [
      { district: 'Visakhapatnam', revenue: 4820, ctr: 5.2 },
      { district: 'Hyderabad', revenue: 6450, ctr: 4.8 },
      { district: 'Vijayawada', revenue: 3200, ctr: 6.1 },
      { district: 'Tirupati', revenue: 2100, ctr: 4.2 },
    ],
    topAds: [
      { name: 'Vizag Realty Ads', impressions: 84200, clicks: 4380, ctr: 5.2 },
      { name: 'APSRTC Campaign', impressions: 62100, clicks: 2984, ctr: 4.8 },
      { name: 'Tirumala Pvt Tours', impressions: 45800, clicks: 2800, ctr: 6.1 },
    ]
  });

  // ── FEATURE 5: BUSINESS DIRECTORY ──────────────────────────────────
  const [bizCategory, setBizCategory] = useState('All');
  const [bizDistrict, setBizDistrict] = useState('All');
  const [bizSearchQuery, setBizSearchQuery] = useState('');
  const [businesses] = useState([
    { id: 1, name: 'King George Hospital', category: 'hospitals', district: 'Visakhapatnam', phone: '0891-2564891', sponsored: true, rating: 4.5, desc: 'Govt multi-speciality hospital, AP' },
    { id: 2, name: 'Andhra University', category: 'colleges', district: 'Visakhapatnam', phone: '0891-2844000', sponsored: false, rating: 4.2, desc: 'Premier public university, Est. 1926' },
    { id: 3, name: 'Sri Chaitanya College', category: 'coaching', district: 'Hyderabad', phone: '040-44554455', sponsored: true, rating: 4.6, desc: 'IIT/NEET coaching, 30+ centres AP/TS' },
    { id: 4, name: 'Tirumala Tirupati Devasthanams', category: 'temples', district: 'Tirupati', phone: '0877-2233333', sponsored: false, rating: 5.0, desc: 'Richest Hindu temple, Tirumala Hills' },
    { id: 5, name: 'Vijayawada Properties', category: 'real_estate', district: 'Vijayawada', phone: '0866-2472222', sponsored: true, rating: 4.0, desc: 'Residential & commercial plots, AP' },
    { id: 6, name: 'KIMS Hospitals', category: 'hospitals', district: 'Hyderabad', phone: '040-44885000', sponsored: true, rating: 4.7, desc: 'NABL accredited multi-speciality chain' },
    { id: 7, name: 'NIT Warangal', category: 'colleges', district: 'Hyderabad', phone: '0870-2459191', sponsored: false, rating: 4.4, desc: 'National Institute of Technology' },
    { id: 8, name: 'Kanaka Durga Temple', category: 'temples', district: 'Vijayawada', phone: '0866-2439751', sponsored: false, rating: 4.9, desc: 'Famous Shakti Peetha, Indrakeeladri' },
  ]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCmsSidebarOpen, setIsCmsSidebarOpen] = useState(false);

  // ── ROUTER SYNC LOGIC ──────────────────────────────────────────────
  const location = useLocation();
  const navigate = useNavigate();

  // Sync State -> URL
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      const target = `/admin${activeCmsTab === 'dashboard' ? '' : `/${activeCmsTab}`}`;
      if (location.pathname !== target) navigate(target, { replace: true });
    } else if (location.pathname.startsWith('/app')) {
      const target = `/app${activeMobileTab === 'home' ? '' : `/${activeMobileTab}`}`;
      if (location.pathname !== target) navigate(target, { replace: true });
    } else {
      let target = '/';
      if (currentPage === 'article') target = `/article/${selectedArticleId}`;
      else if (currentPage !== 'home') target = `/${currentPage}`;
      
      if (location.pathname !== target) navigate(target, { replace: true });
    }
  }, [currentPage, activeMobileTab, activeCmsTab, selectedArticleId]);

  // Sync URL -> State (Initial load & Back/Forward buttons)
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin')) {
      const tab = path.replace('/admin', '').replace('/', '') || 'dashboard';
      if (activeCmsTab !== tab) setActiveCmsTab(tab);
    } else if (path.startsWith('/app')) {
      const tab = path.replace('/app', '').replace('/', '') || 'home';
      if (activeMobileTab !== tab) setActiveMobileTab(tab);
    } else {
      let page = 'home';
      if (path.startsWith('/article/')) {
        page = 'article';
        const id = parseInt(path.split('/').pop());
        if (!isNaN(id) && selectedArticleId !== id) setSelectedArticleId(id);
      } else if (path !== '/') {
        page = path.replace('/', '');
      }
      if (currentPage !== page) setCurrentPage(page);
    }
  }, [location.pathname]);

  // ── FEATURE 6: CITIZEN REPORTER ────────────────────────────────────
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenDistrict, setCitizenDistrict] = useState('Visakhapatnam');
  const [citizenTitle, setCitizenTitle] = useState('');
  const [citizenDesc, setCitizenDesc] = useState('');
  const [citizenSubmitted, setCitizenSubmitted] = useState(false);
  const [citizenReports, setCitizenReports] = useState([
    { id: 1, name: 'Ramaiah G', district: 'Visakhapatnam', title: 'రోడ్డు కుంటలు ప్రమాదకరంగా (Dangerous potholes on NH-16)', status: 'Pending Review', time: '2h ago' },
    { id: 2, name: 'Lakshmi D', district: 'Tirupati', title: 'బస్సు ఆలస్యం సమస్య (APSRTC bus delay issue)', status: 'Published', time: '5h ago' },
  ]);

  // ── FEATURE 7: VOICE BULLETIN STUDIO ──────────────────────────────
  const [bulletinType, setBulletinType] = useState('morning');
  const [bulletinPlaying, setBulletinPlaying] = useState(false);
  const [bulletinText, setBulletinText] = useState('');
  const morningBulletins = [
    'నమస్కారం! ఇది ఆప్టాప్ న్యూస్ ఉదయ వార్తా బులెటిన్.',
    'ఆంధ్రప్రదేశ్‌లో ఈరోజు ముఖ్యమైన వార్తలు:',
    'వైజాగ్ తీరంలో సైక్లోన్ హెచ్చరిక జారీ అయింది.',
    'తిరుమల దేవస్థానంలో నేటి పూజాకార్యక్రమాలు నేర్పుగా జరుగుతున్నాయి.',
    'ఆప్టాప్ న్యూస్ చదువుతూ ఉండండి. ధన్యవాదాలు!'
  ];

  // ── FEATURE 8: WHATSAPP GROWTH ENGINE ─────────────────────────────
  const whatsappChannels = [
    { district: 'Visakhapatnam', link: 'https://wa.me/+910000000001', members: '12.4K', color: '#25D366' },
    { district: 'Tirupati', link: 'https://wa.me/+910000000002', members: '8.2K', color: '#128C7E' },
    { district: 'Vijayawada', link: 'https://wa.me/+910000000003', members: '15.1K', color: '#25D366' },
    { district: 'Hyderabad', link: 'https://wa.me/+910000000004', members: '22.8K', color: '#075E54' },
  ];

  // ── FEATURE 9: SEARCH ARCHIVE ──────────────────────────────────────
  const [archiveQuery, setArchiveQuery] = useState('');
  const [archiveDistrict, setArchiveDistrict] = useState('All');
  const [archiveCategory, setArchiveCategory] = useState('All');
  const [archiveDate, setArchiveDate] = useState('');
  const [archiveResults, setArchiveResults] = useState([]);
  const [archiveSearched, setArchiveSearched] = useState(false);

  // ── PHASE 11: NEWSROOM WORKFLOW & PRODUCTION OPS ──────────────────
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'YS Jagan Rally Coverage', district: 'Vijayawada', deadline: 'Today 5:00 PM', reporter: 'Ravi Kumar', urgency: 'High', status: 'active' },
    { id: 2, title: 'Rain Damage Report', district: 'Tirupati', deadline: 'Tomorrow 10:00 AM', reporter: 'Lakshmi N', urgency: 'Medium', status: 'pending' }
  ]);
  const [scheduledPosts, setScheduledPosts] = useState([
    { id: 1, title: 'CM Morning Speech Review', date: '2026-05-26', time: '08:00 AM', category: 'Politics', district: 'Amaravati' }
  ]);
  const [cmsChatMessages, setCmsChatMessages] = useState([
    { id: 1, user: 'Chief Editor', channel: 'Breaking News', msg: 'Need immediate coverage on Vizag cyclone warning!', time: '10:05 AM' },
    { id: 2, user: 'Ravi Kumar', channel: 'Breaking News', msg: 'On it. Reaching the coast in 10 mins.', time: '10:08 AM' }
  ]);
  const [mediaQueue, setMediaQueue] = useState([
    { id: 1, reporter: 'Srinu V', type: 'image', preview: '/placeholder.jpg', status: 'pending' },
    { id: 2, reporter: 'Akhil K', type: 'video', preview: '/placeholder-vid.jpg', status: 'approved' }
  ]);
  const [reporterAnalytics, setReporterAnalytics] = useState([
    { name: 'Ravi Kumar', district: 'Vijayawada', published: 45, views: 125000 },
    { name: 'Lakshmi N', district: 'Tirupati', published: 38, views: 98000 }
  ]);
  const [audienceCRM, setAudienceCRM] = useState({
    subscribers: 145000, premiumUsers: 2450, pushUsers: 85000,
    topDistricts: ['Visakhapatnam', 'Hyderabad', 'Vijayawada']
  });
  const [commentQueue, setCommentQueue] = useState([
    { id: 1, user: 'TeluguBidda', comment: 'Great coverage on the elections!', status: 'pending', article: 'AP Elections 2026' },
    { id: 2, user: 'SpamBot99', comment: 'Win free money click here', status: 'flagged', article: 'Gold Prices Drop' }
  ]);
  const [cmsChatInput, setCmsChatInput] = useState('');
  const [cmsChatChannel, setCmsChatChannel] = useState('Breaking News');

  const [activeCategoryTab, setActiveCategoryTab] = useState('Breaking');

  // CATEGORY NAVIGATION LOGIC
  const handleCategoryClick = (tab) => {
    const sectionIdMap = {
      'Breaking': 'breaking-news',
      'Andhra Pradesh': 'andhra-pradesh',
      'Telangana': 'telangana',
      'Politics': 'politics',
      'Sports': 'sports',
      'Business': 'business',
      'Cinema': 'cinema',
      'Technology': 'technology',
      'Jobs': 'jobs',
      'Spiritual': 'spiritual',
      'Live': 'live-tv',
      'Reels': 'reels'
    };
    const sectionId = sectionIdMap[tab];
    
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => scrollToSection(sectionId, tab), 100);
    } else {
      scrollToSection(sectionId, tab);
    }
  };

  const scrollToSection = (sectionId, tab) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 60; // offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveCategoryTab(tab);
    } else {
      // Fallback
      if (tab === 'Live') setCurrentPage('live');
      else navigate(`/category/${sectionId}`);
    }
  };

  useEffect(() => {
    if (currentPage !== 'home') return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        const mostVisible = visible.reduce((prev, current) => 
          (prev.intersectionRatio > current.intersectionRatio) ? prev : current
        );
        const idToTab = {
          'breaking-news': 'Breaking',
          'andhra-pradesh': 'Andhra Pradesh',
          'telangana': 'Telangana',
          'politics': 'Politics',
          'sports': 'Sports',
          'business': 'Business',
          'cinema': 'Cinema',
          'technology': 'Technology',
          'jobs': 'Jobs',
          'spiritual': 'Spiritual',
          'live-tv': 'Live',
          'reels': 'Reels'
        };
        const activeTab = idToTab[mostVisible.target.id];
        if (activeTab && activeCategoryTab !== activeTab) {
          setActiveCategoryTab(activeTab);
          const tabEl = document.getElementById(`tab-${mostVisible.target.id}`);
          if (tabEl) tabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }, { threshold: 0.1, rootMargin: '-80px 0px -40% 0px' });
    
    const ids = ['breaking-news', 'andhra-pradesh', 'telangana', 'politics', 'sports', 'business', 'cinema', 'technology', 'jobs', 'spiritual', 'live-tv', 'reels'];
    setTimeout(() => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 500);
    
    return () => observer.disconnect();
  }, [currentPage, articles, activeCategoryTab]);


  // 1. BACKEND INITIALIZATION & WEBSOCKET SYNC
  useEffect(() => {
    fetchData();

    if (!IS_PROD) {
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

    }

    return () => {
      if (!IS_PROD && socket.disconnect) socket.disconnect();
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
    if (IS_PROD) return;
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
      if (IS_PROD) return fallback;
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
      
      const dummyArticles = [
        { id: 901, title: 'వైజాగ్ తీరంలో తుఫాను హెచ్చరిక: అప్రమత్తమైన యంత్రాంగం', titleEn: 'Cyclone Alert on Vizag Coast: Administration on High Alert', category: 'Breaking', categoryTe: 'బ్రేకింగ్', image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'Visakhapatnam is bracing for a severe cyclonic storm. The local administration has initiated evacuation procedures in low-lying coastal areas. Fishermen have been advised not to venture into the sea.', district: 'Visakhapatnam' },
        { id: 902, title: 'అమరావతికి కొత్త పారిశ్రామిక ప్రాజెక్టులు', titleEn: 'New Industrial Projects Approved for Amaravati', category: 'Andhra Pradesh', categoryTe: 'ఆంధ్ర ప్రదేశ్', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'The central government has approved several new industrial corridors connecting Amaravati, aimed at boosting local employment and infrastructure.', district: 'Vijayawada' },
        { id: 903, title: 'హైదరాబాద్‌లో ఐటీ రంగం పరుగులు: కొత్త పెట్టుబడులు', titleEn: 'IT Sector Booms in Hyderabad with New Investments', category: 'Telangana', categoryTe: 'తెలంగాణ', image: 'https://images.unsplash.com/photo-1596422846543-74c6fc0e3681?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'Hyderabad sees a massive surge in IT exports as multinational companies announce new tech hubs across the HITEC city area.', district: 'Hyderabad' },
        { id: 904, title: 'ఎన్నికల ప్రచారంలో జోరు పెంచిన ప్రధాన పార్టీలు', titleEn: 'Major Parties Ramp Up Election Campaigns', category: 'Politics', categoryTe: 'రాజకీయాలు', image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'Political leaders are accelerating their campaigns across the state, organizing massive rallies and town halls ahead of the upcoming legislative elections.', district: 'All' },
        { id: 905, title: 'క్రీడా ప్రపంచం: అదరగొట్టిన భారత క్రీడాకారులు', titleEn: 'Sports World: Indian Athletes Dominate', category: 'Sports', categoryTe: 'క్రీడలు', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'Team India put up a stellar performance in today\'s championship match, securing multiple gold medals and setting new regional records.', district: 'All' },
        { id: 906, title: 'భారీగా పెరిగిన సెన్సెక్స్: మదుపరులకు లాభాలు', titleEn: 'Sensex Hits Record High: Investors Rejoice', category: 'Business', categoryTe: 'వ్యాపారం', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'Stock markets rallied today as Sensex hit an all-time high, driven by strong quarterly earnings from tech and banking sectors.', district: 'All' },
        { id: 907, title: 'టాలీవుడ్ పాన్-ఇండియా మూవీ టీజర్ రిలీజ్', titleEn: 'Tollywood Pan-India Movie Teaser Released', category: 'Cinema', categoryTe: 'సినిమా', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3a5?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'The much-awaited teaser of the upcoming blockbuster pan-India movie is out, breaking internet view records within hours of release.', district: 'Hyderabad' },
        { id: 908, title: 'కొత్త ఏఐ మోడల్ ఆవిష్కరణ: టెక్ ప్రపంచంలో సంచలనం', titleEn: 'New AI Model Unveiled: A Tech Sensation', category: 'Technology', categoryTe: 'సాంకేతికం', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'Tech giants announced a breakthrough AI model today, promising to revolutionize content creation and natural language processing applications globally.', district: 'Global' },
        { id: 909, title: 'టాప్ కంపెనీలలో మెగా రిక్రూట్‌మెంట్ డ్రైవ్', titleEn: 'Mega Recruitment Drive in Top Tech Companies', category: 'Jobs', categoryTe: 'ఉద్యోగాలు', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'Top IT companies have announced thousands of open positions for freshers and experienced professionals across software engineering and data science roles.', district: 'All' },
        { id: 910, title: 'తిరుమలలో భక్తుల రద్దీ: ప్రత్యేక దర్శనాలు', titleEn: 'Heavy Rush of Devotees at Tirumala for Special Darshan', category: 'Spiritual', categoryTe: 'ఆధ్యాత్మికం', image: 'https://images.unsplash.com/photo-1623910271505-8798e228ce78?auto=format&fit=crop&q=80&w=800', date: 'Oct 24, 2026', desc: 'Tirumala sees an unprecedented rush of devotees this weekend. The TTD board has made extensive arrangements for quick and hassle-free darshan.', district: 'Tirupati' }
      ];
      setArticles([...articlesData, ...dummyArticles]);

      const tickerData = await safeFetch(`${BACKEND_URL}/api/ticker`, []);
      const dummyTicker = [
        "వచ్చే వారం అమరావతిలో భారీ పెట్టుబడుల సదస్సు",
        "Gold Prices: వరుసగా మూడో రోజు తగ్గిన బంగారం ధరలు",
        "Team India: వచ్చే సిరీస్ కు జట్టు ప్రకటన",
        "AP Weather: కోస్తా ఆంధ్రాలో నేడు, రేపు భారీ వర్షాలు"
      ];
      setTickerItems([...tickerData, ...dummyTicker]);

      const adsData = await safeFetch(`${BACKEND_URL}/api/ads`, []);
      const dummyAds = [
        { id: 901, active: true, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800', url: '#', title: 'Top Coaching Center' },
        { id: 902, active: true, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800', url: '#', title: 'Healthcare Package' }
      ];
      setAds([...adsData, ...dummyAds]);

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
      const dummyReporters = [
        { id: 901, name: 'కె. శ్రీనివాస్ (K. Srinivas)', nameEn: 'Srinivas', district: 'Visakhapatnam', stories: 120 },
        { id: 902, name: 'లక్ష్మి (Lakshmi)', nameEn: 'Lakshmi', district: 'Vijayawada', stories: 85 },
        { id: 903, name: 'మహేష్ (Mahesh)', nameEn: 'Mahesh', district: 'Hyderabad', stories: 150 },
      ];
      setReporters([...repData, ...dummyReporters]);

      const pollData = await safeFetch(`${BACKEND_URL}/api/poll`, null);
      const dummyPoll = {
        id: 901,
        question: "ఎవరు గెలుస్తారని మీరు భావిస్తున్నారు? (Who will win?)",
        options: [
          { id: 1, text: "కూటమి (Alliance)", votes: 5430 },
          { id: 2, text: "ప్రతిపక్షం (Opposition)", votes: 3210 },
          { id: 3, text: "ఇతరులు (Others)", votes: 850 }
        ]
      };
      setLivePoll(pollData || dummyPoll);

      const streamData = await safeFetch(`${BACKEND_URL}/api/live-streams`, []);
      const dummyStreams = [
        { id: 901, active: true, embedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', viewers: '14.2K', titleTe: 'ఏపీఎక్స్ న్యూస్ లైవ్ కవరేజ్', titleEn: 'Aptop News Live 24/7' },
        { id: 902, active: true, embedUrl: 'https://www.youtube.com/embed/5qap5aO4i9A', viewers: '8.4K', titleTe: 'అసెంబ్లీ సమావేశాలు లైవ్', titleEn: 'Assembly Sessions Live' },
        { id: 903, active: true, embedUrl: 'https://www.youtube.com/embed/r1v_sS067qI', viewers: '5.6K', titleTe: 'స్పెషల్ ఎడిషన్ లైవ్', titleEn: 'Special Edition Live' }
      ];
      setLiveTelecasts([...streamData, ...dummyStreams]);

      const mediaData = await safeFetch(`${BACKEND_URL}/api/media-library`, []);
      const dummyMedia = [
        { id: 901, type: 'reels', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=400', caption: 'Viral: New Telugu Song' },
        { id: 902, type: 'reels', url: 'https://images.unsplash.com/photo-1516280440502-613ec1e65449?auto=format&fit=crop&q=80&w=400', caption: 'Political Rally Highlights' },
        { id: 903, type: 'reels', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400', caption: 'Tirupati Vaikunta Ekadasi' },
        { id: 904, type: 'reels', url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=400', caption: 'Tech Gadget Review' },
      ];
      setMediaLibrary([...mediaData, ...dummyMedia]);

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

  // MongoDB Search Engine Integration
  useEffect(() => {
    if (!searchQuery || IS_PROD) {
      setSearchResults(null);
      return;
    }
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Search Engine Failed:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filteredArticles = searchResults || articles.filter(art => {
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
      
      {/* WORKSPACE VIEWPORT SELECTOR REMOVED */}
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
      <Routes>
        <Route path="/*" element={
          <>
        <div className="portal-container" style={{ flexGrow: 1 }}>
{/* TOP BAR */}
<div className="top-bar">
  <div className="top-bar-inner">
    <div className="top-bar-date" id="topDate"></div>
    <div className="top-ticker">
      <div className="top-ticker-inner">
        🔴 TDP wins major victory in local body elections &nbsp;|&nbsp; 🎬 Allu Arjun's next film title revealed &nbsp;|&nbsp; 💰 Hyderabad property rates surge 18% this year &nbsp;|&nbsp; 🏏 India beat Australia by 6 wickets in 2nd ODI &nbsp;|&nbsp; 🌧️ IMD predicts heavy rains in Andhra, Telangana this week &nbsp;|&nbsp; 📱 Jio launches new plan at Rs 99 for 30 days
      </div>
    </div>
    <div className="top-socials">
      <a href="#">FB</a><a href="#">TW</a><a href="#">YT</a>
    </div>
  </div>
</div>

{/* HEADER */}
<header>
  <div className="header-inner">
        <div className="logo-area" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
      <img src="/logo.png" alt="TeluguFirst Logo" style={{ maxHeight: '80px', width: 'auto' }} />
    </div>
    <div className="header-ad">Advertisement 728×90</div>
    <div className="header-right">
      <div className="header-search">
        <input type="text" placeholder="Search news..." />
        <button>🔍</button>
      </div>
      <a href="#" className="epaper-btn">📰 ePaper</a>
    </div>
  </div>
</header>

{/* NAV */}
<nav>
  <div className="nav-inner">
    <div className="nav-item"><a href="#" className="nav-link active" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Home</a></div>
    <div className="nav-item">
      <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>Latest ▾</a>
      <div className="dropdown">
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Breaking News</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Top Stories</a>
      </div>
    </div>
    <div className="nav-item">
      <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>Politics ▾</a>
      <div className="dropdown">
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Andhra Pradesh</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Telangana</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('elections'); }}>🗳️ Elections 2026</a>
      </div>
    </div>
    <div className="nav-item">
      <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>Movies ▾</a>
      <div className="dropdown">
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Tollywood</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Box Office</a>
      </div>
    </div>
    <div className="nav-item">
      <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('business'); }}>Business ▾</a>
      <div className="dropdown">
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('business'); }}>Directory</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('business'); }}>Markets</a>
      </div>
    </div>
    <div className="nav-item">
      <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>Specials ▾</a>
      <div className="dropdown">
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('spiritual'); }}>🕉️ Spiritual Live</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('citizen_report'); }}>📸 Citizen Report</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('voice_bulletin'); }}>🎙️ AI Voice News</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('whatsapp'); }}>📲 WhatsApp Groups</a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('search_archive'); }}>🔎 Search Archive</a>
      </div>
    </div>
    <div className="nav-item"><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Sports</a></div>
    <div className="nav-item"><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Tech</a></div>
    <div className="nav-item" ><a href="#" className="nav-link nav-telugu" onClick={(e) => { e.preventDefault(); setLanguage(language === 'telugu' ? 'english' : 'telugu'); }}>{language === 'telugu' ? 'ENGLISH' : 'తెలుగు'}</a></div>
  </div>
</nav>

{/* BREAKING NEWS */}
<div className="breaking">
  <div className="breaking-inner">
    <span className="breaking-label">Breaking</span>
    <div className="breaking-scroll">
      <div className="breaking-text">{tickerItems.join(' | ')}</div>
    </div>
  </div>
</div>

{/* MAIN CONTENT */}
<div className="container">
  <div className="main-layout">

    {/* LEFT CONTENT */}
    <div className="content-area">

      {/* BIG STORY / HERO */}
      <div >
        <div className="section-header">
          <div className="section-title">Big Story</div>
          <a href="#" className="view-all">View All</a>
        </div>
      </div>

      <div className="hero-grid">
        {articles.length > 0 && (
          <div className="hero-main" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => { setSelectedArticleId(articles[0].id); setCurrentPage('article'); }}>
            <img src={articles[0].image} alt={articles[0].title} style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', top:0, left:0}} />
            <div className="hero-overlay" style={{ zIndex: 10 }}>
              <span className="hero-cat">{language === 'telugu' ? articles[0].categoryTe : articles[0].category}</span>
              <div className="hero-title">{language === 'telugu' ? articles[0].title : articles[0].titleEn}</div>
              <div className="hero-meta">{articles[0].date}</div>
            </div>
          </div>
        )}
        {articles.length > 1 && (
          <div className="hero-side" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => { setSelectedArticleId(articles[1].id); setCurrentPage('article'); }}>
            <img src={articles[1].image} alt={articles[1].title} style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', top:0, left:0}} />
            <div className="hero-overlay" style={{ zIndex: 10 }}>
              <span className="hero-cat">{language === 'telugu' ? articles[1].categoryTe : articles[1].category}</span>
              <div className="hero-title">{language === 'telugu' ? articles[1].title : articles[1].titleEn}</div>
              <div className="hero-meta">{articles[1].date}</div>
            </div>
          </div>
        )}
        {articles.length > 2 && (
          <div className="hero-side" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => { setSelectedArticleId(articles[2].id); setCurrentPage('article'); }}>
            <img src={articles[2].image} alt={articles[2].title} style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', top:0, left:0}} />
            <div className="hero-overlay" style={{ zIndex: 10 }}>
              <span className="hero-cat">{language === 'telugu' ? articles[2].categoryTe : articles[2].category}</span>
              <div className="hero-title">{language === 'telugu' ? articles[2].title : articles[2].titleEn}</div>
              <div className="hero-meta">{articles[2].date}</div>
            </div>
          </div>
        )}
      </div>

      {/* AD */}
      <div className="ad-banner">Advertisement · 728×90</div>

      {/* LATEST NEWS GRID */}
      <div className="section-header">
        <div className="section-title">Latest News</div>
        <a href="#" className="view-all">View All</a>
      </div>
            <div className="news-grid">
        {articles.slice(3, 6).map((art) => (
          <div className="news-card" key={art.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedArticleId(art.id); setCurrentPage('article'); }}>
            <div className="news-card-img" style={{ position: 'relative', height: '180px' }}>
              <img src={art.image} alt={art.title} style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', top:0, left:0}} />
            </div>
            <div className="news-card-body">
              <div className="news-cat">{language === 'telugu' ? art.categoryTe : art.category}</div>
              <div className="news-title">{language === 'telugu' ? art.title : art.titleEn}</div>
              <div className="news-excerpt">{language === 'telugu' ? art.desc?.substring(0, 100) + '...' : art.descEn?.substring(0, 100) + '...'}</div>
              <div className="news-meta"><span>{art.date}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* POLITICS SECTION */}
      <div className="section-header">
        <div className="section-title">Politics</div>
        <a href="#" className="view-all">View All</a>
      </div>
            <div className="politics-grid">
        {articles.filter(a => a.category === 'Politics').slice(0, 4).map((art) => (
          <div className="politics-card" key={art.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedArticleId(art.id); setCurrentPage('article'); }}>
            <div className="politics-thumb" style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <img src={art.image} alt={art.title} style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', top:0, left:0, borderRadius: '4px'}} />
            </div>
            <div className="politics-body">
              <div className="news-cat">{language === 'telugu' ? art.categoryTe : art.category}</div>
              <div className="politics-title">{language === 'telugu' ? art.title : art.titleEn}</div>
              <div className="politics-meta">{art.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MOVIES SECTION */}
      <div className="section-header">
        <div className="section-title">Movies</div>
        <a href="#" className="view-all">View All</a>
      </div>
            <div className="movies-scroll">
        {articles.filter(a => a.category === 'Cinema').slice(0, 4).map((art) => (
          <div className="movie-card" key={art.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedArticleId(art.id); setCurrentPage('article'); }}>
            <div className="movie-poster" style={{ position: 'relative', height: '240px' }}>
              <img src={art.image} alt={art.title} style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', top:0, left:0}} />
              <div className="movie-rating" style={{ zIndex: 10 }}>★ {(Math.random() * 2 + 3).toFixed(1)}</div>
            </div>
            <div className="movie-body">
              <div className="movie-title">{language === 'telugu' ? art.title : art.titleEn}</div>
              <div className="movie-info">{language === 'telugu' ? art.categoryTe : art.category} · {art.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MORE NEWS LIST */}
      <div className="section-header">
        <div className="section-title">More Stories</div>
        <a href="#" className="view-all">View All</a>
      </div>
            <div className="news-list">
        {articles.slice(6, 10).map((art) => (
          <div className="list-item" key={art.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedArticleId(art.id); setCurrentPage('article'); }}>
            <div className="list-thumb" style={{ position: 'relative', width: '120px', height: '80px', flexShrink: 0 }}>
              <img src={art.image} alt={art.title} style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', top:0, left:0, borderRadius: '4px'}} />
            </div>
            <div className="list-body">
              <div className="news-cat">{language === 'telugu' ? art.categoryTe : art.category}</div>
              <div className="list-title">{language === 'telugu' ? art.title : art.titleEn}</div>
              <div className="list-meta">{art.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TAGS */}
      <div className="tags-section">
        <div className="section-header">
          <div className="section-title">Trending Tags</div>
        </div>
        <div className="tags-wrap">
          <span className="tag-pill">#TDP</span>
          <span className="tag-pill">#Amaravati</span>
          <span className="tag-pill">#Tollywood</span>
          <span className="tag-pill">#AlluArjun</span>
          <span className="tag-pill">#Prabhas</span>
          <span className="tag-pill">#Hyderabad</span>
          <span className="tag-pill">#AndhraPradesh</span>
          <span className="tag-pill">#Telangana</span>
          <span className="tag-pill">#RRR2</span>
          <span className="tag-pill">#ChandrababuNaidu</span>
          <span className="tag-pill">#IPL</span>
          <span className="tag-pill">#Cricket</span>
          <span className="tag-pill">#India</span>
          <span className="tag-pill">#Movies</span>
        </div>
      </div>

    </div>{/* /content-area */}

    {/* SIDEBAR */}
    <div className="sidebar">

      {/* AD */}
      <div >
        Advertisement<br />300×250
      </div>

      {/* TRENDING */}
            <div className="sidebar-widget">
        <div className="widget-header">🔥 Trending Now</div>
        <div className="widget-body">
          {articles.slice(0, 6).sort((a,b) => b.id - a.id).map((art, idx) => (
            <div className="trending-item" key={art.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedArticleId(art.id); setCurrentPage('article'); }}>
              <div className="trend-num">0{idx + 1}</div>
              <div className="trend-title">{language === 'telugu' ? art.title : art.titleEn}</div>
            </div>
          ))}
        </div>
      </div>

      {/* POLL */}
      <div className="sidebar-widget">
        <div className="widget-header">📊 Today's Poll</div>
        <div className="widget-body">
          <div className="poll-widget">
            <div className="poll-question">Who is performing better as Chief Minister?</div>
            <div className="poll-option">
              <div className="poll-option-label"><span>Chandrababu Naidu (AP)</span><span>62%</span></div>
              <div className="poll-bar-bg"><div className="poll-bar" ></div></div>
            </div>
            <div className="poll-option">
              <div className="poll-option-label"><span>Revanth Reddy (TS)</span><span>38%</span></div>
              <div className="poll-bar-bg"><div className="poll-bar" ></div></div>
            </div>
            <button className="poll-vote-btn" onClick="alert('Vote recorded! Thank you.')">Vote Now</button>
          </div>
        </div>
      </div>

      {/* AD */}
      <div >
        Advertisement<br />300×250
      </div>

      {/* GOSSIP */}
      <div className="sidebar-widget">
        <div className="widget-header">🌟 Gossip</div>
        <div className="widget-body">
          <div className="trending-item">
            <div className="trend-num">—</div>
            <a href="#"><div className="trend-title">Which top heroine is dating a famous cricketer? Industry's worst-kept secret</div></a>
          </div>
          <div className="trending-item">
            <div className="trend-num">—</div>
            <a href="#"><div className="trend-title">Big hero to quit Tollywood after next film? Sources say talks underway</div></a>
          </div>
          <div className="trending-item">
            <div className="trend-num">—</div>
            <a href="#"><div className="trend-title">Two top production houses feud over OTT rights; legal notices exchanged</div></a>
          </div>
        </div>
      </div>

      {/* WEATHER */}
      <div className="sidebar-widget">
        <div className="widget-header">🌦️ Weather</div>
        <div className="widget-body" >
          <div >⛈️</div>
          <div >32°C</div>
          <div >Hyderabad, Telangana</div>
          <div >Heavy Rain Warning</div>
          <div >
            <span>H: 35°</span><span>L: 27°</span><span>Rain: 80%</span>
          </div>
        </div>
      </div>

    </div>{/* /sidebar */}
  </div>
</div>

{/* FOOTER */}
<footer>
  <div className="container">
    <div className="footer-grid">
      <div>
        <div className="footer-logo">Aptop<span>News</span></div>
        <div className="footer-desc">Aptop News is Andhra Pradesh and Telangana's most trusted news source, delivering round-the-clock coverage of politics, movies, business, sports and more.</div>
        <div className="footer-social">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">YouTube</a>
          <a href="#">Instagram</a>
        </div>
      </div>
      <div>
        <div className="footer-col-title">Categories</div>
        <ul className="footer-links">
          <li><a href="#">Politics</a></li>
          <li><a href="#">Movies</a></li>
          <li><a href="#">Business</a></li>
          <li><a href="#">Sports</a></li>
          <li><a href="#">Technology</a></li>
          <li><a href="#">Health</a></li>
        </ul>
      </div>
      <div>
        <div className="footer-col-title">Regions</div>
        <ul className="footer-links">
          <li><a href="#">Andhra Pradesh</a></li>
          <li><a href="#">Telangana</a></li>
          <li><a href="#">Hyderabad</a></li>
          <li><a href="#">Vijayawada</a></li>
          <li><a href="#">Visakhapatnam</a></li>
          <li><a href="#">Warangal</a></li>
        </ul>
      </div>
      <div>
        <div className="footer-col-title">About</div>
        <ul className="footer-links">
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Advertise</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Sitemap</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2026 Aptop News. All Rights Reserved.</span>
      <span>ఆప్టాప్ న్యూస్ వెబ్సైట్</span>
    </div>
  </div>
</footer>
</div>
          </>
        } />

      {/* ========================================== */}
      {/* VIEWPORT 2: MOBILE APP */}
      {/* ========================================== */}
      <Route path="/app/*" element={
        <>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>

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
          </>
        } />

      {/* ========================================== */}
      {/* VIEWPORT 3: CMS NEWSROOM DASHBOARD */}
      {/* ========================================== */}
      <Route path="/admin/*" element={
        <>
        <div className="cms-layout" style={{ flexGrow: 1, display: 'flex', backgroundColor: '#F3F4F6', color: '#111827' }}>
          
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
              {/* MOBILE CMS HAMBURGER BTN */}
              <button 
                className="mobile-only"
                onClick={() => setIsCmsSidebarOpen(true)}
                style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 1000, background: '#1E1E1E', color: 'white', border: '1px solid #374151', padding: '8px', borderRadius: '6px' }}
              >
                <Menu size={20} />
              </button>

              {/* CMS SIDEBAR */}
              <aside style={{ width: '260px', backgroundColor: '#1E1E1E', color: '#D1D5DB', display: 'flex', flexDirection: 'column', borderRight: '1px solid #2D2D2D', ...(window.innerWidth <= 768 ? { position: 'fixed', left: isCmsSidebarOpen ? '0' : '-100%', top: 0, bottom: 0, zIndex: 1001, transition: '0.3s' } : {}) }} className="cms-sidebar">
                <div style={{ padding: '24px 20px', borderBottom: '1px solid #2D2D2D', backgroundColor: '#1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: '#D61F26', fontSize: '1.25rem', fontWeight: 800 }}>ఆప్టాప్ CMS</h3>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>Newsroom Dashboard</p>
                  </div>
                  <button className="mobile-only" onClick={() => setIsCmsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#D1D5DB' }}><X size={20} /></button>
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

                <nav style={{ flexGrow: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                  <button onClick={() => setActiveCmsTab('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'dashboard' ? '#D61F26' : 'transparent', color: activeCmsTab === 'dashboard' ? 'white' : '#D1D5DB' }}><BarChart3 size={16} /> <span>Dashboard Home</span></button>
                  <button onClick={() => setActiveCmsTab('war_room')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'war_room' ? '#DC2626' : 'rgba(220,38,38,0.1)', color: activeCmsTab === 'war_room' ? 'white' : '#FCA5A5' }}><AlertOctagon size={16} /> <span>🔴 Breaking War Room</span></button>
                  <button onClick={() => setActiveCmsTab('ai_automation')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'ai_automation' ? '#D61F26' : 'transparent', color: activeCmsTab === 'ai_automation' ? 'white' : '#D1D5DB' }}><Cpu size={16} /> <span>AI Newsroom Automation</span></button>
                  <button onClick={() => setActiveCmsTab('articles')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'articles' ? '#D61F26' : 'transparent', color: activeCmsTab === 'articles' ? 'white' : '#D1D5DB' }}><Newspaper size={16} /> <span>Articles Manager ({articles.length})</span></button>
                  <button onClick={() => setActiveCmsTab('shorts')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'shorts' ? '#D61F26' : 'transparent', color: activeCmsTab === 'shorts' ? 'white' : '#D1D5DB' }}><Film size={16} /> <span>Shorts Studio ({shortsList.length})</span></button>
                  <button onClick={() => setActiveCmsTab('live_telecast')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'live_telecast' ? '#D61F26' : 'transparent', color: activeCmsTab === 'live_telecast' ? 'white' : '#D1D5DB' }}><Radio size={16} /> <span>Live Telecast Studio</span></button>
                  <button onClick={() => setActiveCmsTab('revenue')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'revenue' ? '#D61F26' : 'transparent', color: activeCmsTab === 'revenue' ? 'white' : '#D1D5DB' }}><DollarSign size={16} /> <span>Revenue Intelligence</span></button>
                  <button onClick={() => setActiveCmsTab('citizen')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'citizen' ? '#D61F26' : 'transparent', color: activeCmsTab === 'citizen' ? 'white' : '#D1D5DB' }}><Users size={16} /> <span>Citizen Reporter ({citizenReports.length})</span></button>
                  <button onClick={() => setActiveCmsTab('ai_assistant')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'ai_assistant' ? '#D61F26' : 'transparent', color: activeCmsTab === 'ai_assistant' ? 'white' : '#D1D5DB' }}><Megaphone size={16} /> <span>AI Writer Assistant</span></button>
                  <button onClick={() => setActiveCmsTab('ticker')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'ticker' ? '#D61F26' : 'transparent', color: activeCmsTab === 'ticker' ? 'white' : '#D1D5DB' }}><Flame size={16} /> <span>Breaking Tickers</span></button>
                  <button onClick={() => setActiveCmsTab('audit_logs')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'audit_logs' ? '#D61F26' : 'transparent', color: activeCmsTab === 'audit_logs' ? 'white' : '#D1D5DB' }}><FileText size={16} /> <span>Security Audit Logs</span></button>
                  <button onClick={() => setActiveCmsTab('editorial')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'editorial' ? '#D61F26' : 'transparent', color: activeCmsTab === 'editorial' ? 'white' : '#D1D5DB' }}><Check size={16} /> <span>Editorial Workflow</span></button>
                  <button onClick={() => setActiveCmsTab('assignments')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'assignments' ? '#D61F26' : 'transparent', color: activeCmsTab === 'assignments' ? 'white' : '#D1D5DB' }}><MapPin size={16} /> <span>Assignment Desk</span></button>
                  <button onClick={() => setActiveCmsTab('media_queue')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'media_queue' ? '#D61F26' : 'transparent', color: activeCmsTab === 'media_queue' ? 'white' : '#D1D5DB' }}><Image size={16} /> <span>Media Approval Queue</span></button>
                  <button onClick={() => setActiveCmsTab('chat')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'chat' ? '#D61F26' : 'transparent', color: activeCmsTab === 'chat' ? 'white' : '#D1D5DB' }}><MessageSquare size={16} /> <span>Newsroom Chat</span></button>
                  <button onClick={() => setActiveCmsTab('crm')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'crm' ? '#D61F26' : 'transparent', color: activeCmsTab === 'crm' ? 'white' : '#D1D5DB' }}><Users size={16} /> <span>Audience CRM</span></button>
                  <button onClick={() => setActiveCmsTab('comments')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'comments' ? '#D61F26' : 'transparent', color: activeCmsTab === 'comments' ? 'white' : '#D1D5DB' }}><Smile size={16} /> <span>Comment Moderation</span></button>
                  <button onClick={() => setActiveCmsTab('backups')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'backups' ? '#D61F26' : 'transparent', color: activeCmsTab === 'backups' ? 'white' : '#D1D5DB' }}><UploadCloud size={16} /> <span>Backup & Recovery</span></button>
                  <button onClick={() => setActiveCmsTab('integrations')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: activeCmsTab === 'integrations' ? '#D61F26' : 'transparent', color: activeCmsTab === 'integrations' ? 'white' : '#D1D5DB' }}><Globe size={16} /> <span>API Integrations</span></button>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }} className="cms-dash-cards cms-stats-grid">
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

                {/* ─── TAB: BREAKING NEWS WAR ROOM ─── */}
                {activeCmsTab === 'war_room' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s' }}>
                    {/* Command Header */}
                    <div style={{ background: 'linear-gradient(135deg, #7F1D1D 0%, #DC2626 100%)', color: 'white', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>🔴 BREAKING NEWS WAR ROOM</h2>
                        <p style={{ fontSize: '0.85rem', color: '#FCA5A5', margin: '4px 0 0' }}>Emergency Command Center — Cyclone, Elections, Disasters</p>
                      </div>
                      <button onClick={() => setWarRoomActive(!warRoomActive)} style={{ backgroundColor: warRoomActive ? '#FCA5A5' : '#FFD54A', color: '#7F1D1D', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', fontSize: '0.9rem' }}>
                        {warRoomActive ? '🔴 WAR ROOM ACTIVE' : '⚫ ACTIVATE WAR ROOM'}
                      </button>
                    </div>

                    {/* Add Incident Form */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: warRoomActive ? '2px solid #DC2626' : '1px solid #E5E7EB' }}>
                      <h3 style={{ fontWeight: 'bold', marginBottom: '16px', color: '#DC2626' }}>⚡ Dispatch Emergency Alert</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }} className="news-grid-2">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Incident Headline (Telugu/English):</label>
                          <input type="text" value={warRoomIncident} onChange={e => setWarRoomIncident(e.target.value)} placeholder="సైక్లోన్ హెచ్చరిక — Cyclone Alert issued..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #DC2626', fontSize: '0.9rem' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Severity:</label>
                            <select value={warRoomSeverity} onChange={e => setWarRoomSeverity(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                              <option value="Critical">🔴 CRITICAL</option>
                              <option value="High">🟠 HIGH</option>
                              <option value="Medium">🟡 MEDIUM</option>
                            </select>
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>District:</label>
                            <select value={warRoomDistrict} onChange={e => setWarRoomDistrict(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                              {['Visakhapatnam','Vijayawada','Tirupati','Hyderabad','Guntur','Kurnool'].map(d => <option key={d}>{d}</option>)}
                            </select>
                          </div>
                        </div>
                        <button onClick={() => {
                          if (!warRoomIncident) return;
                          setWarRoomAlerts(prev => [{ id: Date.now(), title: warRoomIncident, severity: warRoomSeverity, district: warRoomDistrict, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), pinned: false }, ...prev]);
                          setWarRoomIncident('');
                        }} style={{ backgroundColor: '#DC2626', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', height: '42px' }}>
                          🚨 DISPATCH
                        </button>
                      </div>
                    </div>

                    {/* Live Alert Board */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>📡 Active Alert Board</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {warRoomAlerts.map(alert => (
                          <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '8px', border: `2px solid ${alert.severity === 'Critical' ? '#DC2626' : alert.severity === 'High' ? '#F59E0B' : '#6B7280'}`, backgroundColor: alert.pinned ? '#FEF2F2' : 'white', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                              <span style={{ fontSize: '1.2rem' }}>{alert.severity === 'Critical' ? '🔴' : alert.severity === 'High' ? '🟠' : '🟡'}</span>
                              <div>
                                <p style={{ fontWeight: 'bold', fontFamily: 'var(--font-telugu)', margin: 0, fontSize: '0.9rem' }}>{alert.title}</p>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>📍 {alert.district} • {alert.time} {alert.pinned ? '📌 PINNED' : ''}</p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => setWarRoomAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, pinned: !a.pinned } : a))} style={{ backgroundColor: alert.pinned ? '#F59E0B' : '#E5E7EB', color: '#111', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>{alert.pinned ? '📌 Unpin' : '📌 Pin'}</button>
                              <button onClick={() => alert('✅ Bulk push alert sent to all 4 district WhatsApp channels!')} style={{ backgroundColor: '#25D366', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>📲 Push</button>
                              <button onClick={() => setWarRoomAlerts(prev => prev.filter(a => a.id !== alert.id))} style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB: AI NEWSROOM AUTOMATION ─── */}
                {activeCmsTab === 'ai_automation' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', animation: 'fadeIn 0.3s' }} className="news-grid-2">
                    {/* Panel 1: Trending Topic Detector */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h3 style={{ fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18} style={{ color: '#DC2626' }} /> Trending Topic Detector</h3>
                      <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '16px' }}>Live AP/TS trending topics with urgency scores</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {trendingTopics.map((t, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: t.urgency >= 90 ? '#FFF5F5' : '#FAFAFA' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                              <div>
                                <p style={{ fontWeight: 'bold', margin: 0, fontSize: '0.85rem' }}>{t.topic}</p>
                                <p style={{ color: '#6B7280', fontSize: '0.72rem', margin: 0 }}>📍 {t.district} • {t.category}</p>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: t.urgency >= 90 ? '#DC2626' : t.urgency >= 75 ? '#F59E0B' : '#10B981' }}>{t.urgency}</div>
                              <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>URGENCY</div>
                              <button onClick={() => { setAiDraftTopic(t.topic); setActiveCmsTab('ai_automation'); }} style={{ marginTop: '4px', backgroundColor: '#D61F26', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold' }}>Draft Story</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Panel 2: Auto Story Draft + Duplicate Check + Fact Check */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Story Draft Generator */}
                      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={18} style={{ color: '#7C3AED' }} /> Auto Story Draft</h3>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          <input type="text" value={aiDraftTopic} onChange={e => { setAiDraftTopic(e.target.value); setDuplicateWarning(''); setFactCheckFlags([]); }} placeholder="Topic: Cyclone in Vizag..." style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '0.85rem' }} />
                          <button onClick={() => {
                            if (!aiDraftTopic) return;
                            setAiDraftLoading(true);
                            setTimeout(() => {
                              // Duplicate detection
                              const similar = articles.find(a => a.title && a.title.toLowerCase().includes(aiDraftTopic.toLowerCase().slice(0, 5)));
                              setDuplicateWarning(similar ? `⚠️ Similar story found: "${similar.title}" — check before publishing.` : '');
                              // Fact-check flags
                              setFactCheckFlags(['✅ District included', '⚠️ Missing expert quote', '⚠️ Headline may be too vague — add specifics']);
                              setAiDraftResult({
                                headline: `${aiDraftTopic}: తాజా సమాచారం — వివరాలు, ముఖ్య అంశాలు`,
                                headlineEn: `${aiDraftTopic}: Latest Update — Key Details & Analysis`,
                                intro: `${aiDraftTopic} సంబంధించి తాజా సమాచారం అందుతోంది. సంబంధిత అధికారులు స్పందించారు. ప్రజలు అప్రమత్తంగా ఉండాలని హెచ్చరించారు.`,
                                tags: [aiDraftTopic.split(' ')[0], 'AP News', 'Breaking', 'ఆప్టాప్ ఎక్స్‌క్లూసివ్']
                              });
                              setAiDraftLoading(false);
                            }, 1400);
                          }} disabled={aiDraftLoading} style={{ backgroundColor: '#7C3AED', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>
                            {aiDraftLoading ? '⏳ Drafting...' : '🪄 Generate Draft'}
                          </button>
                        </div>

                        {duplicateWarning && <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>{duplicateWarning}</div>}

                        {aiDraftResult && (
                          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '14px' }}>
                            <p style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 'bold', marginBottom: '6px' }}>✅ AI DRAFT READY:</p>
                            <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>{aiDraftResult.headline}</p>
                            <p style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '8px' }}>{aiDraftResult.intro}</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                              {aiDraftResult.tags.map((tag, i) => <span key={i} style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>#{tag}</span>)}
                            </div>
                            <button onClick={() => { setArtTitleTe(aiDraftResult.headline); setArtTitleEn(aiDraftResult.headlineEn); setArtDescTe(aiDraftResult.intro); setActiveCmsTab('articles'); }} style={{ backgroundColor: '#D61F26', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>📝 Create Article Draft</button>
                          </div>
                        )}
                      </div>

                      {/* Fact-check Panel */}
                      {factCheckFlags.length > 0 && (
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                          <h4 style={{ fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} style={{ color: '#10B981' }} /> AI Fact-Check Flags</h4>
                          {factCheckFlags.map((f, i) => <p key={i} style={{ fontSize: '0.82rem', margin: '4px 0', fontWeight: f.startsWith('✅') ? 'normal' : 'bold', color: f.startsWith('✅') ? '#065F46' : '#92400E' }}>{f}</p>)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── TAB: REVENUE INTELLIGENCE ─── */}
                {activeCmsTab === 'revenue' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s' }}>
                    {/* KPI Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                      {[
                        { label: 'Total CPM', value: `$${revenueMetrics.totalCPM}`, color: '#3B82F6', icon: '📈' },
                        { label: 'Avg CPC', value: `$${revenueMetrics.totalCPC}`, color: '#10B981', icon: '💰' },
                        { label: 'Conversions', value: revenueMetrics.totalConversions, color: '#7C3AED', icon: '🎯' },
                        { label: 'Top District', value: 'Hyderabad', color: '#F59E0B', icon: '🏆' },
                      ].map((kpi, i) => (
                        <div key={i} style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${kpi.color}` }}>
                          <p style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px' }}>{kpi.icon} {kpi.label}</p>
                          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: kpi.color }}>{kpi.value}</h3>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="news-grid-2">
                      {/* District Revenue Heatmap */}
                      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>🗺️ District Revenue Heatmap</h3>
                        {revenueMetrics.districtRevenue.map((d, i) => {
                          const max = Math.max(...revenueMetrics.districtRevenue.map(x => x.revenue));
                          const pct = (d.revenue / max * 100).toFixed(0);
                          return (
                            <div key={i} style={{ marginBottom: '14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 'bold' }}>
                                <span>📍 {d.district}</span>
                                <span>₹{d.revenue.toLocaleString()} • CTR {d.ctr}%</span>
                              </div>
                              <div style={{ height: '10px', backgroundColor: '#F3F4F6', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, #D61F26 0%, #F59E0B ${pct}%)`, borderRadius: '5px', transition: 'width 1s' }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Ad Performance Ranking */}
                      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>🏆 Top Ad Performance Ranking</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#6B7280' }}>
                              <th style={{ padding: '8px 4px', textAlign: 'left' }}>Ad Campaign</th>
                              <th style={{ padding: '8px 4px', textAlign: 'right' }}>Impressions</th>
                              <th style={{ padding: '8px 4px', textAlign: 'right' }}>Clicks</th>
                              <th style={{ padding: '8px 4px', textAlign: 'right' }}>CTR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {revenueMetrics.topAds.map((ad, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '10px 4px', fontWeight: 'bold' }}>{['🥇','🥈','🥉'][i]} {ad.name}</td>
                                <td style={{ padding: '10px 4px', textAlign: 'right', color: '#6B7280' }}>{(ad.impressions/1000).toFixed(1)}K</td>
                                <td style={{ padding: '10px 4px', textAlign: 'right' }}>{ad.clicks.toLocaleString()}</td>
                                <td style={{ padding: '10px 4px', textAlign: 'right', color: '#10B981', fontWeight: 'bold' }}>{ad.ctr}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB: CITIZEN REPORTER ADMIN ─── */}
                {activeCmsTab === 'citizen' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h2 style={{ fontWeight: 'bold', marginBottom: '4px' }}>👥 Citizen Reporter Submissions</h2>
                      <p style={{ color: '#6B7280', fontSize: '0.82rem', marginBottom: '20px' }}>Review and publish user-submitted local incident reports</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {citizenReports.map(rep => (
                          <div key={rep.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FAFAFA', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <p style={{ fontWeight: 'bold', fontFamily: 'var(--font-telugu)', margin: 0, fontSize: '0.9rem' }}>{rep.title}</p>
                              <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '2px 0 0' }}>👤 {rep.name} • 📍 {rep.district} • 🕒 {rep.time}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 'bold', backgroundColor: rep.status === 'Published' ? '#D1FAE5' : '#FEF3C7', color: rep.status === 'Published' ? '#065F46' : '#92400E' }}>{rep.status}</span>
                              {rep.status !== 'Published' && (
                                <button onClick={() => setCitizenReports(prev => prev.map(r => r.id === rep.id ? { ...r, status: 'Published' } : r))} style={{ backgroundColor: '#D61F26', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>✅ Approve</button>
                              )}
                              <button onClick={() => setCitizenReports(prev => prev.filter(r => r.id !== rep.id))} style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✕ Reject</button>
                            </div>
                          </div>
                        ))}
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

                {/* TAB: EDITORIAL WORKFLOW & SCHEDULER */}
                {activeCmsTab === 'editorial' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Editorial Workflow System</h2>
                      <p style={{ color: '#6B7280', marginBottom: '20px' }}>Review and approve articles submitted by reporters.</p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 'bold' }}>AP Assembly Special Coverage</span>
                            <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>In Review</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 12px' }}>Reporter: Ravi Kumar • Submitted: 10 mins ago</p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ flex: 1, backgroundColor: '#D1FAE5', color: '#065F46', border: 'none', padding: '6px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Approve</button>
                            <button style={{ flex: 1, backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Needs Edit</button>
                          </div>
                        </div>
                        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 'bold' }}>Tirumala Crowd Updates</span>
                            <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>Draft</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 12px' }}>Reporter: Lakshmi N • Last Edited: 1 hr ago</p>
                          <button style={{ width: '100%', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', padding: '6px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Open Editor</button>
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Article Scheduler</h2>
                      <p style={{ color: '#6B7280', marginBottom: '20px' }}>Auto-publish stories at exact times.</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {scheduledPosts.map(post => (
                          <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E5E7EB', padding: '12px 16px', borderRadius: '6px' }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 'bold' }}>{post.title}</p>
                              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#6B7280' }}>{post.category} • {post.district}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontWeight: 'bold', color: '#D61F26' }}>{post.date}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>{post.time}</p>
                              </div>
                              <button style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: ASSIGNMENT DESK */}
                {activeCmsTab === 'assignments' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Story Assignment Board</h2>
                        <p style={{ color: '#6B7280', margin: 0 }}>Dispatch breaking news and daily coverage tasks to reporters.</p>
                      </div>
                      <button style={{ backgroundColor: '#10B981', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>+ New Assignment</button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {assignments.map(ass => (
                        <div key={ass.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${ass.urgency === 'High' ? '#EF4444' : '#F59E0B'}`, padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '0 8px 8px 0' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>{ass.title}</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280' }}>📍 {ass.district} • ⏰ Deadline: {ass.deadline}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'inline-block', backgroundColor: '#E5E7EB', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px' }}>👤 {ass.reporter}</span>
                            <br/>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: ass.status === 'active' ? '#059669' : '#D97706' }}>{ass.status.toUpperCase()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: MEDIA APPROVAL QUEUE */}
                {activeCmsTab === 'media_queue' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Media Approval Queue</h2>
                    <p style={{ color: '#6B7280', marginBottom: '20px' }}>Review reporter uploads before public library inclusion.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                      {mediaQueue.map(media => (
                        <div key={media.id} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                          <div style={{ height: '120px', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '2rem', color: '#9CA3AF' }}>{media.type === 'video' ? '🎥' : '📷'}</span>
                          </div>
                          <div style={{ padding: '12px' }}>
                            <p style={{ margin: '0 0 4px', fontSize: '0.8rem', fontWeight: 'bold' }}>By: {media.reporter}</p>
                            <span style={{ backgroundColor: media.status === 'approved' ? '#D1FAE5' : '#FEF3C7', color: media.status === 'approved' ? '#065F46' : '#92400E', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>{media.status}</span>
                            {media.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <button style={{ flex: 1, backgroundColor: '#10B981', color: 'white', border: 'none', padding: '4px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Approve</button>
                                <button style={{ flex: 1, backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '4px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Reject</button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: NEWSROOM CHAT */}
                {activeCmsTab === 'chat' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', height: '600px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Internal CMS Chat</h2>
                    <p style={{ color: '#6B7280', marginBottom: '20px' }}>Secure communication for editorial and reporting teams.</p>
                    
                    <div style={{ display: 'flex', gap: '16px', flexGrow: 1, overflow: 'hidden' }}>
                      <div style={{ width: '200px', borderRight: '1px solid #E5E7EB', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['General', 'Breaking News', 'Politics', 'District Bureau', 'Live TV'].map(ch => (
                          <button key={ch} onClick={() => setCmsChatChannel(ch)} style={{ padding: '8px 12px', textAlign: 'left', backgroundColor: cmsChatChannel === ch ? '#FEF2F2' : 'transparent', color: cmsChatChannel === ch ? '#D61F26' : '#4B5563', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}># {ch}</button>
                        ))}
                      </div>
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', paddingLeft: '8px' }}>
                        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px' }}>
                          {cmsChatMessages.filter(m => m.channel === cmsChatChannel).map(msg => (
                            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{msg.user}</span>
                                <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{msg.time}</span>
                              </div>
                              <div style={{ backgroundColor: '#F3F4F6', padding: '10px 14px', borderRadius: '0 12px 12px 12px', display: 'inline-block', maxWidth: '80%' }}>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1F2937' }}>{msg.msg}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={e => { e.preventDefault(); if(!cmsChatInput) return; setCmsChatMessages([...cmsChatMessages, { id: Date.now(), user: 'Super Admin', channel: cmsChatChannel, msg: cmsChatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]); setCmsChatInput(''); }} style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                          <input type="text" value={cmsChatInput} onChange={e => setCmsChatInput(e.target.value)} placeholder={`Message #${cmsChatChannel}...`} style={{ flexGrow: 1, padding: '10px 16px', borderRadius: '20px', border: '1px solid #D1D5DB' }} />
                          <button type="submit" style={{ backgroundColor: '#D61F26', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: AUDIENCE CRM */}
                {activeCmsTab === 'crm' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Audience CRM & Analytics</h2>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                          <p style={{ color: '#6B7280', margin: '0 0 8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Total Subscribers</p>
                          <h3 style={{ margin: 0, fontSize: '2rem', color: '#111827' }}>{audienceCRM.subscribers.toLocaleString()}</h3>
                        </div>
                        <div style={{ backgroundColor: '#FFFBEB', padding: '20px', borderRadius: '8px', border: '1px solid #FEF3C7' }}>
                          <p style={{ color: '#92400E', margin: '0 0 8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Premium Gold Users</p>
                          <h3 style={{ margin: 0, fontSize: '2rem', color: '#B45309' }}>{audienceCRM.premiumUsers.toLocaleString()}</h3>
                        </div>
                        <div style={{ backgroundColor: '#EFF6FF', padding: '20px', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
                          <p style={{ color: '#1E40AF', margin: '0 0 8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Push Notification Opt-ins</p>
                          <h3 style={{ margin: 0, fontSize: '2rem', color: '#1D4ED8' }}>{audienceCRM.pushUsers.toLocaleString()}</h3>
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Reporter Leaderboard (This Week)</h3>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#6B7280', fontSize: '0.85rem' }}>
                            <th style={{ padding: '12px' }}>Reporter</th>
                            <th style={{ padding: '12px' }}>Bureau</th>
                            <th style={{ padding: '12px' }}>Articles Published</th>
                            <th style={{ padding: '12px' }}>Total Views</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reporterAnalytics.map((rep, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                              <td style={{ padding: '12px', fontWeight: 'bold' }}>{rep.name}</td>
                              <td style={{ padding: '12px', color: '#4B5563' }}>{rep.district}</td>
                              <td style={{ padding: '12px', color: '#059669', fontWeight: 'bold' }}>{rep.published}</td>
                              <td style={{ padding: '12px' }}>{rep.views.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB: COMMENT MODERATION */}
                {activeCmsTab === 'comments' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Comment Moderation</h2>
                    <p style={{ color: '#6B7280', marginBottom: '20px' }}>Review and filter reader comments before public display.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {commentQueue.map(c => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: c.status === 'flagged' ? '#FEF2F2' : '#F9FAFB' }}>
                          <div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{ fontWeight: 'bold' }}>{c.user}</span>
                              <span style={{ fontSize: '0.7rem', backgroundColor: '#E5E7EB', padding: '2px 6px', borderRadius: '4px' }}>On: {c.article}</span>
                              {c.status === 'flagged' && <span style={{ fontSize: '0.7rem', backgroundColor: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>SPAM FLAGGED</span>}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>"{c.comment}"</p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Approve</button>
                            <button style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: BACKUPS & INTEGRATIONS */}
                {activeCmsTab === 'backups' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Backup & Disaster Recovery</h2>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '250px', padding: '24px', border: '1px solid #E5E7EB', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '12px' }}>Database Backup</h3>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '16px' }}>Last backup: Today at 03:00 AM</p>
                        <button style={{ backgroundColor: '#1E3A8A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Trigger Manual Backup</button>
                      </div>
                      <div style={{ flex: 1, minWidth: '250px', padding: '24px', border: '1px solid #E5E7EB', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '12px' }}>System Restore</h3>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '16px' }}>Restore from AWS S3 Snapshot</p>
                        <button style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Open Restore Panel</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeCmsTab === 'integrations' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>API Integrations</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {['Google Analytics', 'Firebase Push Notifications', 'YouTube Live API', 'Cloudinary Media'].map((api, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{api}</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#059669', fontWeight: 'bold' }}>● Connected & Active</p>
                          </div>
                          <button style={{ backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Configure</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </main>
            </>
          )}
        </div>
        </>
      } />
      </Routes>

    </div>
  );
}
