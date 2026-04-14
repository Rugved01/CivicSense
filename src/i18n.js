import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // App Name & Tagline
      "app.name": "CivicSense",
      "app.tagline": "Report. Track. Resolve.",
      "app.footer": "Empowering citizens, enabling better governance. Made with ❤️ for a better India.",
      
      // Navbar
      "nav.home": "Home",
      "nav.report": "Report Issue",
      "nav.dashboard": "Dashboard",
      "nav.login": "Login",
      "nav.getStarted": "Get Started",
      "nav.logout": "Logout",
      "nav.admin": "ADMIN",
      
      // Search & Filters
      "search.placeholder": "Search issues...",
      "search.placeholderAdmin": "Search by title, location or reporter...",
      "showing": "Showing",
      "of": "of",
      "issues": "issues",
      "noIssues": "No issues found",
      "noIssuesDesc": "No issues match your search criteria.",
      "sort.newest": "Newest First",
      "sort.oldest": "Oldest First",
      
      // Stats Cards
      "stats.totalReports": "Total Reports",
      "stats.uniqueLocations": "Unique Locations",
      "stats.totalUpvotes": "Total Upvotes",
      "stats.recentWeek": "Recent (7 days)",
      "stats.liveMonitoring": "Live Monitoring",
      "stats.freeForAll": "For All Citizens",
      
      // Login Page
      "login.welcome": "Welcome Back",
      "login.subtitle": "Sign in to report and track civic issues",
      "login.email": "Email Address",
      "login.password": "Password",
      "login.button": "Sign In",
      "login.noAccount": "Don't have an account?",
      "login.signup": "Sign up free",
      "login.leftTitle": "Your voice shapes",
      "login.leftTitle2": "your city.",
      "login.leftDesc": "Join thousands of citizens making Indian cities better — one honest report at a time.",
      "login.feature1": "Report civic issues with exact GPS pin",
      "login.feature2": "Upvote issues that matter most",
      "login.feature3": "Live notifications on status updates",
      "login.adminNote": "To become Admin:",
      "login.adminNoteDesc": "Sign up → Go to Firebase Console → Firestore → users collection → change role from 'user' to 'admin'",
      
      // Signup Page
      "signup.title": "Create Account",
      "signup.subtitle": "Join CivicSense — it only takes a minute",
      "signup.name": "Full Name",
      "signup.button": "Create Account",
      "signup.haveAccount": "Already have an account?",
      "signup.login": "Sign in",
      
      // Report Issue Page
      "report.title": "Report an Issue",
      "report.subtitle": "Help make your city better",
      "report.step1": "Issue Details",
      "report.step2": "Location",
      "report.step3": "Submit",
      "report.titleLabel": "Issue Title",
      "report.titlePlaceholder": "e.g., Large pothole near main market",
      "report.categoryLabel": "Category",
      "report.descriptionLabel": "Description",
      "report.descriptionPlaceholder": "Describe the issue in detail...",
      "report.photoLabel": "Add Photo",
      "report.photoOptional": "(optional, max 5 MB)",
      "report.photoClick": "Click to add a photo",
      "report.photoHint": "Helps authorities understand the issue better",
      "report.locationLabel": "Address / Area",
      "report.locationPlaceholder": "e.g., MG Road, near HDFC Bank, Pune",
      "report.locationHint": "Type your address, then open the map",
      "report.pickMap": "Pick Exact Spot on Map",
      "report.mapHint": "Drag the map to pin the exact issue location",
      "report.locationPinned": "Location pinned",
      "report.back": "Back",
      "report.review": "Review & Submit",
      "report.next": "Next",
      "report.submit": "Submit Report",
      "report.submitting": "Submitting...",
      "report.reviewTitle": "Review Your Report",
      "report.photo": "Photo",
      "report.none": "None",
      "report.reportingAs": "Reporting as",
      
      // Categories
      "category.Road": "Road",
      "category.Electricity": "Electricity",
      "category.Water": "Water",
      "category.Sanitation": "Sanitation",
      "category.Parks": "Parks",
      "category.Other": "Other",
      
      // Success Page
      "success.title": "Issue Submitted Successfully!",
      "success.message": "Your report has been received. Authorities have been notified.",
      "success.track": "Track your issue on the Dashboard",
      "success.reportAnother": "Report Another",
      "success.goDashboard": "Go to Dashboard",
      
      // Dashboard - User
      "dashboard.user.title": "My Reports",
      "dashboard.user.subtitle": "Viewing issues reported by you",
      "dashboard.user.total": "Total Reports",
      
      // Dashboard - Admin
      "dashboard.admin.title": "Admin Dashboard",
      "dashboard.admin.subtitle": "All citizen reports",
      "dashboard.admin.total": "Total Reports",
      "dashboard.admin.reporter": "Reporter",
      "dashboard.admin.email": "Email",
      "dashboard.admin.viewDetails": "View Details",
      "dashboard.admin.reporterInfo": "Reporter Information",
      "dashboard.admin.reportedOn": "Reported on",
      "dashboard.admin.gpsCoords": "GPS Coordinates",
      "dashboard.admin.issueId": "Issue ID",
      "dashboard.admin.fullLocation": "Full Location",
      
      // Issue Card
      "issue.upvotes": "Upvotes",
      "issue.reported": "Reported",
      "issue.viewDetails": "View Details",
      
      // Notifications
      "notifications.title": "Notifications",
      "notifications.empty": "No notifications yet",
      "notifications.markAllRead": "Mark all as read",
      "notifications.new": "new",
      "notifications.newIssue": "New issue reported",
      "notifications.newIssueMessage": "📍 New {{category}} issue reported in {{location}} by {{name}}",
      "notifications.justNow": "just now",
      "notifications.minAgo": "m ago",
      "notifications.hourAgo": "h ago",
      "notifications.dayAgo": "d ago",
      
      // Theme & Language
      "theme.dark": "Dark",
      "theme.light": "Light",
      "language.english": "English",
      "language.hindi": "हिन्दी",
      "language.marathi": "मराठी",
      
      // Home Page
      "home.empowering": "Empowering Citizens Across India",
      "home.heroTitle": "Report. Track.",
      "home.heroTitleGradient": "Resolve.",
      "home.heroDesc": "CivicSense bridges citizens and municipal authorities. Spot a problem, pin it on the map, and watch your city transform.",
      "home.featuresTitle": "Platform Features",
      "home.featuresDesc": "Everything you need to fix your city",
      "home.feature1Title": "Precise Reporting",
      "home.feature1Desc": "Pinpoint exact location of civic issues on an interactive map",
      "home.feature2Title": "Community Upvotes",
      "home.feature2Desc": "Amplify urgent problems through community support",
      "home.feature3Title": "Smart Notifications",
      "home.feature3Desc": "Instant alerts when your issue status changes",
      "home.feature4Title": "Secure Accounts",
      "home.feature4Desc": "Your data is protected with Firebase Authentication",
    }
  },
  hi: {
    translation: {
      // App Name & Tagline
      "app.name": "सिविकसेंस",
      "app.tagline": "रिपोर्ट करें. ट्रैक करें. समाधान करें.",
      "app.footer": "नागरिकों को सशक्त बनाना, बेहतर शासन सक्षम करना। बेहतर भारत के लिए ❤️ के साथ निर्मित।",
      
      // Navbar
      "nav.home": "होम",
      "nav.report": "रिपोर्ट करें",
      "nav.dashboard": "डैशबोर्ड",
      "nav.login": "लॉगिन",
      "nav.getStarted": "शुरू करें",
      "nav.logout": "लॉगआउट",
      "nav.admin": "एडमिन",
      
      // Search & Filters
      "search.placeholder": "समस्याएं खोजें...",
      "search.placeholderAdmin": "शीर्षक, स्थान या रिपोर्टर से खोजें...",
      "showing": "दिखा रहे हैं",
      "of": "में से",
      "issues": "समस्याएं",
      "noIssues": "कोई समस्या नहीं मिली",
      "noIssuesDesc": "आपकी खोज मानदंड से मेल खाने वाली कोई समस्या नहीं।",
      "sort.newest": "नई पहले",
      "sort.oldest": "पुरानी पहले",
      
      // Stats Cards
      "stats.totalReports": "कुल रिपोर्ट",
      "stats.uniqueLocations": "अद्वितीय स्थान",
      "stats.totalUpvotes": "कुल अपवोट",
      "stats.recentWeek": "हालिया (7 दिन)",
      "stats.liveMonitoring": "लाइव निगरानी",
      "stats.freeForAll": "सभी नागरिकों के लिए मुफ्त",
      
      // Login Page
      "login.welcome": "वापसी पर स्वागत है",
      "login.subtitle": "सिविक समस्याओं की रिपोर्ट और ट्रैक करने के लिए साइन इन करें",
      "login.email": "ईमेल पता",
      "login.password": "पासवर्ड",
      "login.button": "साइन इन",
      "login.noAccount": "खाता नहीं है?",
      "login.signup": "मुफ्त साइन अप करें",
      "login.leftTitle": "आपकी आवाज़ बनाती है",
      "login.leftTitle2": "आपका शहर।",
      "login.leftDesc": "हजारों नागरिकों से जुड़ें जो भारतीय शहरों को बेहतर बना रहे हैं — एक ईमानदार रिपोर्ट एक बार में।",
      "login.feature1": "सटीक जीपीएस पिन के साथ सिविक समस्याओं की रिपोर्ट करें",
      "login.feature2": "सबसे महत्वपूर्ण समस्याओं को अपवोट करें",
      "login.feature3": "स्थिति अपडेट पर लाइव सूचनाएं",
      "login.adminNote": "एडमिन बनने के लिए:",
      "login.adminNoteDesc": "साइन अप करें → फायरबेस कंसोल पर जाएं → फायरस्टोर → यूजर्स कलेक्शन → रोल को 'user' से 'admin' बदलें",
      
      // Signup Page
      "signup.title": "खाता बनाएं",
      "signup.subtitle": "सिविकसेंस से जुड़ें — बस एक मिनट",
      "signup.name": "पूरा नाम",
      "signup.button": "खाता बनाएं",
      "signup.haveAccount": "पहले से खाता है?",
      "signup.login": "साइन इन करें",
      
      // Report Issue Page
      "report.title": "समस्या रिपोर्ट करें",
      "report.subtitle": "अपने शहर को बेहतर बनाने में मदद करें",
      "report.step1": "समस्या विवरण",
      "report.step2": "स्थान",
      "report.step3": "सबमिट",
      "report.titleLabel": "समस्या शीर्षक",
      "report.titlePlaceholder": "जैसे, मुख्य बाजार के पास बड़ा गड्ढा",
      "report.categoryLabel": "श्रेणी",
      "report.descriptionLabel": "विवरण",
      "report.descriptionPlaceholder": "समस्या का विस्तार से वर्णन करें...",
      "report.photoLabel": "फोटो जोड़ें",
      "report.photoOptional": "(वैकल्पिक, अधिकतम 5 MB)",
      "report.photoClick": "फोटो जोड़ने के लिए क्लिक करें",
      "report.photoHint": "अधिकारियों को समस्या बेहतर समझने में मदद करता है",
      "report.locationLabel": "पता / क्षेत्र",
      "report.locationPlaceholder": "जैसे, एमजी रोड, एचडीएफसी बैंक के पास, पुणे",
      "report.locationHint": "अपना पता टाइप करें, फिर मैप खोलें",
      "report.pickMap": "मैप पर सटीक स्थान चुनें",
      "report.mapHint": "सटीक स्थान पिन करने के लिए मैप को खींचें",
      "report.locationPinned": "स्थान पिन किया गया",
      "report.back": "पीछे",
      "report.review": "समीक्षा और सबमिट",
      "report.next": "आगे",
      "report.submit": "रिपोर्ट सबमिट करें",
      "report.submitting": "सबमिट हो रहा है...",
      "report.reviewTitle": "अपनी रिपोर्ट की समीक्षा करें",
      "report.photo": "फोटो",
      "report.none": "कोई नहीं",
      "report.reportingAs": "रिपोर्ट कर रहे हैं",
      
      // Categories
      "category.Road": "सड़क",
      "category.Electricity": "बिजली",
      "category.Water": "पानी",
      "category.Sanitation": "स्वच्छता",
      "category.Parks": "पार्क",
      "category.Other": "अन्य",
      
      // Success Page
      "success.title": "समस्या सफलतापूर्वक सबमिट हुई!",
      "success.message": "आपकी रिपोर्ट प्राप्त हो गई है। अधिकारियों को सूचित कर दिया गया है।",
      "success.track": "अपनी समस्या डैशबोर्ड पर ट्रैक करें",
      "success.reportAnother": "दूसरी रिपोर्ट करें",
      "success.goDashboard": "डैशबोर्ड पर जाएं",
      
      // Dashboard - User
      "dashboard.user.title": "मेरी रिपोर्ट",
      "dashboard.user.subtitle": "आपके द्वारा रिपोर्ट की गई समस्याएं",
      "dashboard.user.total": "कुल रिपोर्ट",
      
      // Dashboard - Admin
      "dashboard.admin.title": "एडमिन डैशबोर्ड",
      "dashboard.admin.subtitle": "सभी नागरिक रिपोर्ट",
      "dashboard.admin.total": "कुल रिपोर्ट",
      "dashboard.admin.reporter": "रिपोर्टर",
      "dashboard.admin.email": "ईमेल",
      "dashboard.admin.viewDetails": "विवरण देखें",
      "dashboard.admin.reporterInfo": "रिपोर्टर की जानकारी",
      "dashboard.admin.reportedOn": "रिपोर्ट की गई",
      "dashboard.admin.gpsCoords": "जीपीएस निर्देशांक",
      "dashboard.admin.issueId": "मुद्दा आईडी",
      "dashboard.admin.fullLocation": "पूरा पता",
      
      // Issue Card
      "issue.upvotes": "अपवोट",
      "issue.reported": "रिपोर्ट की गई",
      "issue.viewDetails": "विवरण देखें",
      
      // Notifications
      "notifications.title": "सूचनाएं",
      "notifications.empty": "अभी कोई सूचना नहीं",
      "notifications.markAllRead": "सभी पढ़े हुए चिह्नित करें",
      "notifications.new": "नई",
      "notifications.newIssue": "नई समस्या रिपोर्ट की गई",
      "notifications.newIssueMessage": "📍 {{location}} में {{name}} द्वारा नई {{category}} समस्या रिपोर्ट की गई",
      "notifications.justNow": "अभी",
      "notifications.minAgo": "मिनट पहले",
      "notifications.hourAgo": "घंटे पहले",
      "notifications.dayAgo": "दिन पहले",
      
      // Theme & Language
      "theme.dark": "डार्क",
      "theme.light": "लाइट",
      "language.english": "English",
      "language.hindi": "हिन्दी",
      "language.marathi": "मराठी",
      
      // Home Page
      "home.empowering": "पूरे भारत में नागरिकों को सशक्त बनाना",
      "home.heroTitle": "रिपोर्ट करें. ट्रैक करें.",
      "home.heroTitleGradient": "समाधान करें.",
      "home.heroDesc": "सिविकसेंस नागरिकों और नगर निगम अधिकारियों के बीच सेतु का काम करता है। समस्या देखें, मैप पर पिन करें, और अपने शहर को बदलते हुए देखें।",
      "home.featuresTitle": "प्लेटफॉर्म विशेषताएं",
      "home.featuresDesc": "अपने शहर को ठीक करने के लिए सब कुछ",
      "home.feature1Title": "सटीक रिपोर्टिंग",
      "home.feature1Desc": "इंटरैक्टिव मैप पर सिविक समस्याओं का सटीक स्थान बताएं",
      "home.feature2Title": "सामुदायिक अपवोट",
      "home.feature2Desc": "सामुदायिक समर्थन के माध्यम से तत्काल समस्याओं को बढ़ाएं",
      "home.feature3Title": "स्मार्ट सूचनाएं",
      "home.feature3Desc": "आपकी समस्या की स्थिति बदलने पर त्वरित अलर्ट",
      "home.feature4Title": "सुरक्षित खाते",
      "home.feature4Desc": "आपका डेटा फायरबेस प्रमाणीकरण के साथ सुरक्षित है",
    }
  },
  mr: {
    translation: {
      // App Name & Tagline
      "app.name": "सिविकसेन्स",
      "app.tagline": "अहवाल द्या. ट्रॅक करा. सोडवा.",
      "app.footer": "नागरिकांना सक्षम बनवणे, चांगले प्रशासन सक्षम करणे. चांगल्या भारतासाठी ❤️ सह निर्मित।",
      
      // Navbar
      "nav.home": "होम",
      "nav.report": "अहवाल द्या",
      "nav.dashboard": "डॅशबोर्ड",
      "nav.login": "लॉगिन",
      "nav.getStarted": "सुरू करा",
      "nav.logout": "लॉगआउट",
      "nav.admin": "प्रशासक",
      
      // Search & Filters
      "search.placeholder": "समस्या शोधा...",
      "search.placeholderAdmin": "शीर्षक, स्थान किंवा अहवाल देणाऱ्यानुसार शोधा...",
      "showing": "दाखवत आहे",
      "of": "पैकी",
      "issues": "समस्या",
      "noIssues": "कोणतीही समस्या सापडली नाही",
      "noIssuesDesc": "तुमच्या शोध निकषांशी जुळणारी कोणतीही समस्या नाही.",
      "sort.newest": "नवीन प्रथम",
      "sort.oldest": "जुने प्रथम",
      
      // Stats Cards
      "stats.totalReports": "एकूण अहवाल",
      "stats.uniqueLocations": "अद्वितीय स्थाने",
      "stats.totalUpvotes": "एकूण अपवोट",
      "stats.recentWeek": "अलीकडील (7 दिवस)",
      "stats.liveMonitoring": "थेट देखरेख",
      "stats.freeForAll": "सर्व नागरिकांसाठी विनामूल्य",
      
      // Login Page
      "login.welcome": "परत स्वागत आहे",
      "login.subtitle": "नागरी समस्यांची अहवाल देण्यासाठी आणि ट्रॅक करण्यासाठी साइन इन करा",
      "login.email": "ईमेल पत्ता",
      "login.password": "पासवर्ड",
      "login.button": "साइन इन",
      "login.noAccount": "खाते नाही?",
      "login.signup": "विनामूल्य साइन अप करा",
      "login.leftTitle": "तुमचा आवाज घडवतो",
      "login.leftTitle2": "तुमचे शहर.",
      "login.leftDesc": "हजारो नागरिकांमध्ये सामील व्हा जे भारतीय शहरे चांगली बनवत आहेत — एक प्रामाणिक अहवाल एका वेळी।",
      "login.feature1": "अचूक जीपीएस पिनसह नागरी समस्यांचा अहवाल द्या",
      "login.feature2": "सर्वात महत्त्वाच्या समस्यांना अपवोट करा",
      "login.feature3": "स्थिती अद्यतनांवर थेट सूचना",
      "login.adminNote": "प्रशासक बनण्यासाठी:",
      "login.adminNoteDesc": "साइन अप करा → फायरबेस कन्सोलवर जा → फायरस्टोर → यूजर्स कलेक्शन → रोल 'user' वरून 'admin' वर बदला",
      
      // Signup Page
      "signup.title": "खाते तयार करा",
      "signup.subtitle": "सिविकसेन्समध्ये सामील व्हा — फक्त एक मिनिट",
      "signup.name": "पूर्ण नाव",
      "signup.button": "खाते तयार करा",
      "signup.haveAccount": "आधीच खाते आहे?",
      "signup.login": "साइन इन करा",
      
      // Report Issue Page
      "report.title": "समस्या अहवाल द्या",
      "report.subtitle": "आपले शहर चांगले बनविण्यात मदत करा",
      "report.step1": "समस्या तपशील",
      "report.step2": "स्थान",
      "report.step3": "सबमिट",
      "report.titleLabel": "समस्या शीर्षक",
      "report.titlePlaceholder": "उदा., मुख्य बाजार जवळ मोठा खड्डा",
      "report.categoryLabel": "वर्ग",
      "report.descriptionLabel": "वर्णन",
      "report.descriptionPlaceholder": "समस्येचे तपशीलवार वर्णन करा...",
      "report.photoLabel": "फोटो जोडा",
      "report.photoOptional": "(पर्यायी, कमाल 5 MB)",
      "report.photoClick": "फोटो जोडण्यासाठी क्लिक करा",
      "report.photoHint": "अधिकाऱ्यांना समस्या चांगल्या प्रकारे समजण्यास मदत करते",
      "report.locationLabel": "पत्ता / क्षेत्र",
      "report.locationPlaceholder": "उदा., एमजी रोड, एचडीएफसी बँक जवळ, पुणे",
      "report.locationHint": "आपला पत्ता टाइप करा, नंतर नकाशा उघडा",
      "report.pickMap": "नकाशावर अचूक स्थान निवडा",
      "report.mapHint": "अचूक स्थान पिन करण्यासाठी नकाशा ड्रॅग करा",
      "report.locationPinned": "स्थान पिन केले",
      "report.back": "मागे",
      "report.review": "पुनरावलोकन आणि सबमिट",
      "report.next": "पुढे",
      "report.submit": "अहवाल सबमिट करा",
      "report.submitting": "सबमिट होत आहे...",
      "report.reviewTitle": "आपल्या अहवालाचे पुनरावलोकन करा",
      "report.photo": "फोटो",
      "report.none": "कोणतीही",
      "report.reportingAs": "अहवाल देत आहे",
      
      // Categories
      "category.Road": "रस्ता",
      "category.Electricity": "वीज",
      "category.Water": "पाणी",
      "category.Sanitation": "स्वच्छता",
      "category.Parks": "उद्याने",
      "category.Other": "इतर",
      
      // Success Page
      "success.title": "समस्या यशस्वीरित्या सबमिट झाली!",
      "success.message": "आपला अहवाल प्राप्त झाला आहे. अधिकाऱ्यांना सूचित केले गेले आहे.",
      "success.track": "आपली समस्या डॅशबोर्डवर ट्रॅक करा",
      "success.reportAnother": "दुसरा अहवाल द्या",
      "success.goDashboard": "डॅशबोर्डवर जा",
      
      // Dashboard - User
      "dashboard.user.title": "माझे अहवाल",
      "dashboard.user.subtitle": "आपण अहवाल दिलेल्या समस्या",
      "dashboard.user.total": "एकूण अहवाल",
      
      // Dashboard - Admin
      "dashboard.admin.title": "प्रशासक डॅशबोर्ड",
      "dashboard.admin.subtitle": "सर्व नागरिक अहवाल",
      "dashboard.admin.total": "एकूण अहवाल",
      "dashboard.admin.reporter": "अहवाल देणारा",
      "dashboard.admin.email": "ईमेल",
      "dashboard.admin.viewDetails": "तपशील पहा",
      "dashboard.admin.reporterInfo": "अहवाल देणाऱ्याची माहिती",
      "dashboard.admin.reportedOn": "अहवाल दिला",
      "dashboard.admin.gpsCoords": "जीपीएस निर्देशांक",
      "dashboard.admin.issueId": "समस्या आयडी",
      "dashboard.admin.fullLocation": "संपूर्ण पत्ता",
      
      // Issue Card
      "issue.upvotes": "अपवोट",
      "issue.reported": "अहवाल दिला",
      "issue.viewDetails": "तपशील पहा",
      
      // Notifications
      "notifications.title": "सूचना",
      "notifications.empty": "अद्याप कोणतीही सूचना नाही",
      "notifications.markAllRead": "सर्व वाचलेले म्हणून चिन्हांकित करा",
      "notifications.new": "नवीन",
      "notifications.newIssue": "नवीन समस्या अहवाल दिली",
      "notifications.newIssueMessage": "📍 {{location}} मध्ये {{name}} द्वारे नवीन {{category}} समस्येचा अहवाल दिला",
      "notifications.justNow": "आत्ताच",
      "notifications.minAgo": "मिनिटांपूर्वी",
      "notifications.hourAgo": "तासांपूर्वी",
      "notifications.dayAgo": "दिवसांपूर्वी",
      
      // Theme & Language
      "theme.dark": "डार्क",
      "theme.light": "लाइट",
      "language.english": "English",
      "language.hindi": "हिन्दी",
      "language.marathi": "मराठी",
      
      // Home Page
      "home.empowering": "संपूर्ण भारतात नागरिकांना सक्षम बनवणे",
      "home.heroTitle": "अहवाल द्या. ट्रॅक करा.",
      "home.heroTitleGradient": "सोडवा.",
      "home.heroDesc": "सिविकसेन्स नागरिक आणि नगरपालिका प्राधिकरण यांच्यातील पूल म्हणून काम करते. समस्या पहा, नकाशावर पिन करा आणि आपले शहर बदलताना पहा.",
      "home.featuresTitle": "प्लॅटफॉर्म वैशिष्ट्ये",
      "home.featuresDesc": "आपले शहर व्यवस्थित करण्यासाठी सर्व काही",
      "home.feature1Title": "अचूक अहवाल",
      "home.feature1Desc": "संवादात्मक नकाशावर नागरी समस्यांचे अचूक स्थान दर्शवा",
      "home.feature2Title": "सामुदायिक अपवोट",
      "home.feature2Desc": "सामुदायिक समर्थनाद्वारे त्वरित समस्या वाढवा",
      "home.feature3Title": "स्मार्ट सूचना",
      "home.feature3Desc": "आपल्या समस्येची स्थिती बदलल्यास त्वरित सूचना",
      "home.feature4Title": "सुरक्षित खाती",
      "home.feature4Desc": "आपला डेटा फायरबेस प्रमाणीकरणाद्वारे संरक्षित आहे",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;