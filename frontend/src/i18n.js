// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// We'll use a simple method for loading translations for now
// In a real app, you might load these from a server
const resources = {
  en: {
    translation: {
      "pageTitle": "Saral Lipi",
      "appDescription": "Welcome! Get a simple summary of any document. Just take a photo or upload a file.",
      "outputLangLabel": "Select Document Language:",
      "cameraButton": "Use Camera",
      "uploadButton": "Upload File",
      "processModeLabel": "Select Action:",
      "simplifyOnly": "Simplify Only",
      "simplifyAndTranslate": "Simplify & Translate",
      "fileUploaded": "File uploaded:",
      "processButton": "Simplify Document",
      "changeFile": "Change File",
      "fileSelectedText": "file selected",
      "filesSelectedText": "files selected",
      "processingMessage": "Processing your document... please wait.",
      "processAgain": "Process again",
      "downloadAll": "Download all",
      "original": "Original",
      "simplified": "Simplified",
      "translated": "Translated",
      "copy": "Copy",
      "download": "Download",
      "chat": "Chat",
      "footerTitle": "Saral Lipi © 2025",
      "footerTagline": "Simplifying Legal Documents for Everyone",
      "footerDisclaimer":"Disclaimer: This application provides simplified explanations and is not a substitute for professional legal advice.",
      uploadHint_part1: "You can upload up to",
      uploadHint_part2: "files. Maximum size:",
      uploadHint_part3: "per file. Supported formats:",
      uploadHint_formats: "Images and PDF",
      errorNoFile: "No file selected.",
      errorTooManyFiles: "More than {{count}} files are not allowed.",
      errorFileTooLarge: "File exceeds {{size}} MB limit.",
      chatTitle: "Chat with this document",
      chatPlaceholder: "Ask anything about this document...",
      send: "Send",
      thinking: "Thinking…"
    }
  },
  hi: {
    translation: {
      "pageTitle": "सरल लिपि",
      "appDescription": "स्वागत! किसी भी दस्तावेज़ का सरल सारांश प्राप्त करें। बस एक फ़ोटो लें या फ़ाइल अपलोड करें।",
      "outputLangLabel": "दस्तावेज़ की भाषा चुनें:",
      "cameraButton": "कैमरा का उपयोग करें",
      "uploadButton": "फाइल अपलोड करें",
      "processModeLabel": "कार्रवाई चुनें:",
      "simplifyOnly": "केवल सरल करें",
      "simplifyAndTranslate": "सरल करें और अनुवाद करें",
      "fileUploaded": "फ़ाइल अपलोड की गई:",
      "processButton": "दस्तावेज़ को सरल बनाएं",
      "changeFile": "फ़ाइल बदलें",
      "fileSelectedText": "फ़ाइल चुनी गई",
      "filesSelectedText": "फ़ाइलें चुनी गईं",
      "processingMessage": "दस्तावेज़ संसाधित किया जा रहा है... कृपया प्रतीक्षा करें।",
      "processAgain": "फिर से संसाधित करें",
      "downloadAll": "सभी डाउनलोड करें",
      "original": "मूल",
      "simplified": "सरलीकृत",
      "translated": "अनुवादित",
      "copy": "कॉपी करें",
      "download": "डाउनलोड करें",
      "chat": "चैट करें",
      "footerTitle": "सरल लिपि © 2025",
      "footerTagline": "सभी के लिए कानूनी दस्तावेज़ों को सरल बनाना",
      "footerDisclaimer":"अस्वीकरण: यह एप्लिकेशन केवल सरल जानकारी प्रदान करता है और पेशेवर कानूनी सलाह का विकल्प नहीं है।",
      uploadHint_part1: "आप अधिकतम",
      uploadHint_part2: "फ़ाइलें अपलोड कर सकते हैं। अधिकतम आकार:",
      uploadHint_part3: "प्रति फ़ाइल। समर्थित प्रारूप:",
      uploadHint_formats: "चित्र और PDF",
      errorNoFile: "कोई फ़ाइल चयनित नहीं की गई है।",
      errorTooManyFiles: "{{count}} से अधिक फ़ाइलें अपलोड करने की अनुमति नहीं है।",
      errorFileTooLarge: "फ़ाइल का आकार {{size}} MB से अधिक है।",
      chatTitle: "इस दस्तावेज़ से चैट करें",
      chatPlaceholder: "इस दस्तावेज़ के बारे में कुछ भी पूछें...",
      send: "भेजें",
      thinking: "सोच रहा है…"
    }
  },
  kn: {

    translation: {
      "pageTitle": "ಸರಳ ಲಿಪಿ",
      "appDescription": "ಸ್ವಾಗತ! ಯಾವುದೇ ದಸ್ತಾವೇಜಿನ ಸರಳ ಸಾರಾಂಶವನ್ನು ಪಡೆಯಿರಿ. ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      "outputLangLabel": "ದಸ್ತಾವೇಜಿನ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
      "cameraButton": "ಕ್ಯಾಮೆರಾ ಬಳಸಿ",
      "uploadButton": "ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      "processModeLabel": "ಕ್ರಿಯೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
      "simplifyOnly": "ಮಾತ್ರ ಸರಳಗೊಳಿಸಿ",
      "simplifyAndTranslate": "ಸರಳಗೊಳಿಸಿ ಮತ್ತು ಅನುವಾದಿಸಿ",
      "fileUploaded": "ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ:",
      "processButton": "ದಸ್ತಾವೇಜನ್ನು ಸರಳಗೊಳಿಸಿ",
      "changeFile": "ಫೈಲ್ ಬದಲಾಯಿಸಿ",
      "fileSelectedText": "ಫೈಲ್ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ",
      "filesSelectedText": "ಫೈಲ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ",
      "processingMessage": "ದಸ್ತಾವೇಜು ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ಕಾಯಿರಿ.",
      "processAgain": "ಮತ್ತೆ ಪ್ರಕ್ರಿಯೆ ಮಾಡಿ",
      "downloadAll": "ಎಲ್ಲವನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      "original": "ಮೂಲ",
      "simplified": "ಸರಳಗೊಳಿಸಲಾಗಿದೆ",
      "translated": "ಅನುವಾದಿಸಲಾಗಿದೆ",
      "copy": "ನಕಲಿಸಿ",
      "download": "ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      "chat": "ಚಾಟ್ ಮಾಡಿ",
      "footerTitle": "ಸರಳ ಲಿಪಿ © 2025",
      "footerTagline": "ಎಲ್ಲರಿಗೂ ಕಾನೂನು ದಸ್ತಾವೇಜುಗಳನ್ನು ಸರಳಗೊಳಿಸುವುದು",
      "footerDisclaimer":"ನಿರಾಕರಣೆ: ಈ ಅಪ್ಲಿಕೇಶನ್ ಸರಳ ವಿವರಣೆಗಳನ್ನು ಮಾತ್ರ ಒದಗಿಸುತ್ತದೆ ಮತ್ತು ವೃತ್ತಿಪರ ಕಾನೂನು ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.",
      uploadHint_part1: "ನೀವು ಗರಿಷ್ಠ",
      uploadHint_part2: "ಫೈಲ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು. ಗರಿಷ್ಠ ಗಾತ್ರ:",
      uploadHint_part3: "ಪ್ರತಿ ಫೈಲ್‌ಗೆ. ಬೆಂಬಲಿತ ಫಾರ್ಮ್ಯಾಟ್‌ಗಳು:",
      uploadHint_formats: "ಚಿತ್ರಗಳು ಮತ್ತು PDF",
      errorNoFile: "ಯಾವುದೇ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ.",
      errorTooManyFiles: "{{count}} ಕ್ಕಿಂತ ಹೆಚ್ಚು ಫೈಲ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಅನುಮತಿ ಇಲ್ಲ.",
      errorFileTooLarge: "ಫೈಲ್ ಗಾತ್ರ {{size}} MB ಗಿಂತ ಹೆಚ್ಚು.",
      chatTitle: "ಈ ದಸ್ತಾವೇಜಿನೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ",
      chatPlaceholder: "ಈ ದಸ್ತಾವೇಜಿನ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...",
      send: "ಕಳುಹಿಸಿ",
      thinking: "ಯೋಚಿಸುತ್ತಿದೆ…"

    }
  },
  te: {
    translation: {
      "pageTitle": "సరళ లిపి",
      "appDescription": "స్వాగతం! ఏదైనా పత్రం యొక్క సరళమైన సారాంశాన్ని పొందండి. ఫోటో తీయండి లేదా ఫైల్‌ను అప్‌లోడ్ చేయండి.",
      "outputLangLabel": "పత్రం భాషను ఎంచుకోండి:",
      "cameraButton": "కెమెరా ఉపయోగించండి",
      "uploadButton": "ఫైల్ అప్‌లోడ్ చేయండి",
      "processModeLabel": "చర్యను ఎంచుకోండి:",
      "simplifyOnly": "కేవలం సరళీకరించండి",
      "simplifyAndTranslate": "సరళీకరించండి మరియు అనువదించండి",
      "fileUploaded": "ఫైల్ అప్‌లోడ్ చేయబడింది:",
      "processButton": "పత్రాన్ని సరళీకరించండి",
      "changeFile": "ఫైల్ మార్చండి",
      "fileSelectedText": "ఫైల్ ఎంపిక చేయబడింది",
      "filesSelectedText": "ఫైళ్లను ఎంపిక చేశారు",
      "processingMessage": "పత్రాన్ని ప్రాసెస్ చేస్తున్నాము... దయచేసి వేచి ఉండండి.",
      "processAgain": "మళ్లీ ప్రాసెస్ చేయండి",
      "downloadAll": "అన్నీ డౌన్‌లోడ్ చేయండి",
      "original": "మూలం",
      "simplified": "సరళీకృతం",
      "translated": "అనువదించబడింది",
      "copy": "నకలు చేయండి",
      "download": "డౌన్‌లోడ్ చేయండి",
      "chat": "చాట్ చేయండి",
      "footerTitle": "సరళ లిపి © 2025",
      "footerTagline": "అందరికీ చట్టపరమైన పత్రాలను సరళీకరించడం",
      "footerDisclaimer":"నిరాకరణ: ఈ అనువర్తనం సరళ వివరణలను మాత్రమే అందిస్తుంది మరియు వృత్తిపరమైన న్యాయ సలహాకు ప్రత్యామ్నాయం కాదు.",
      uploadHint_part1: "మీరు గరిష్టంగా అప్‌లోడ్ చేయవచ్చు",
      uploadHint_part2: "ఫైళ్లు. గరిష్ట పరిమాణం:",
      uploadHint_part3: "ప్రతి ఫైల్‌కు. మద్దతు పొందిన ఫార్మాట్లు:",
      uploadHint_formats: "చిత్రాలు మరియు PDF" ,
      errorNoFile: "ఏ ఫైల్ ఎంపిక చేయలేదు.",
      errorTooManyFiles: "{{count}} కంటే ఎక్కువ ఫైళ్లను అప్‌లోడ్ చేయడానికి అనుమతి లేదు.",
      errorFileTooLarge: "ఫైల్ పరిమాణం {{size}} MB కంటే ఎక్కువ.",
      chatTitle: "ఈ పత్రంతో చాట్ చేయండి",
      chatPlaceholder: "ఈ పత్రం గురించి ఏదైనా అడగండి...",
      send: "పంపండి",
      thinking: "ఆలోచిస్తోంది…",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;