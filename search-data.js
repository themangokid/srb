// Enhanced search data with comprehensive keywords
const searchData = [
    // Main sections
    {
        title: "Svenska Reformationsbibeln - Hem",
        description: "En Bibel i Tiden. Reformationsbibeln är en modern svensk översättning av Karl XII:s Bibel från 1703 baserad på Textus Receptus.",
        url: "#hem",
        icon: "fas fa-home",
        keywords: [
            "hem", "home", "start", "huvudsida", "reformationsbibeln", "svenska reformationsbibeln", 
            "karl xii", "karl 12", "textus receptus", "bibel", "översättning", "translation", 
            "1703", "modern", "svensk", "swedish", "reformation", "bibelsällskap", "society",
            "en bibel i tiden", "bible in time", "grundtext", "source text", "receptus"
        ]
    },
    {
        title: "Frågor & Svar",
        description: "Vanliga frågor och svar om Reformationsbibeln, grundtexter och översättningar.",
        url: "QnA.html",
        icon: "fas fa-question-circle",
        keywords: [
            "frågor", "svar", "q&a", "qna", "questions", "answers", "vanliga frågor", "faq",
            "grundtext", "textus receptus", "bibelsyn", "bible view", "textfrågor", "text questions",
            "översättning", "translation", "majoritetstexten", "majority text", "bizantinsk",
            "alexandrinsk", "westcott hort", "nestle aland", "critical text", "textkritik",
            "manuscripts", "handskrifter", "kodex", "codex", "papyrus", "urtexten"
        ]
    },
    {
        title: "Resurser",
        description: "Utforska våra resurser: Bibeltexten, videor, studieverktyg och mer.",
        url: "#resurser",
        icon: "fas fa-book",
        keywords: [
            "resurser", "resources", "material", "verktyg", "tools", "bibel", "bible",
            "studium", "study", "lärande", "learning", "undervisning", "teaching",
            "hjälpmedel", "aids", "referens", "reference", "samling", "collection"
        ]
    },
    {
        title: "Om Oss",
        description: "Information om Svenska Reformationsbibelsällskapet och vårt arbete.",
        url: "#om-oss",
        icon: "fas fa-info-circle",
        keywords: [
            "om oss", "about us", "historia", "history", "sällskap", "society", "reformation",
            "bibelsällskap", "bible society", "organisation", "organization", "arbete", "work",
            "mission", "uppdrag", "syfte", "purpose", "mål", "goals", "vision",
            "bakgrund", "background", "grundare", "founders", "team", "ledning"
        ]
    },
    {
        title: "Kontakt",
        description: "Kontakta Svenska Reformationsbibelsällskapet.",
        url: "#kontakt",
        icon: "fas fa-envelope",
        keywords: [
            "kontakt", "contact", "meddelande", "message", "email", "e-post", "mail",
            "kommunikation", "communication", "skriv", "write", "hör av dig", "reach out",
            "support", "hjälp", "help", "frågor", "questions", "feedback", "återkoppling"
        ]
    },

    // Bible reading resources
    {
        title: "Digital Bibelläsare",
        description: "Läs Svenska Reformationsbibeln online med sökfunktion och versfunktioner.",
        url: "https://bibelonline.se/biblereader.php",
        icon: "fas fa-book-open",
        keywords: [
            "läs", "read", "online", "digital", "bibelläsare", "bible reader", "bibel", "sök",
            "search", "vers", "verse", "kapitel", "chapter", "bok", "book", "text",
            "interaktiv", "interactive", "webb", "web", "browser", "navigation",
            "bibelonline", "bible online", "konkordans", "concordance", "lexikon"
        ]
    },
    {
        title: "Nya Testamentet",
        description: "Läs Nya Testamentet i Svenska Reformationsbibeln online.",
        url: "https://bibelonline.se/biblereader.php?book=40",
        icon: "fas fa-cross",
        keywords: [
            "nya testamentet", "new testament", "nt", "jesus", "kristus", "christ",
            "evangelium", "gospel", "matteus", "matthew", "markus", "mark", "lukas", "luke",
            "johannes", "john", "apostlagärningar", "acts", "paulus", "paul", "brev",
            "letters", "epistles", "uppenbarelse", "revelation", "apocalypse"
        ]
    },
    {
        title: "Gamla Testamentet",
        description: "Läs Gamla Testamentet i Svenska Reformationsbibeln online.",
        url: "https://bibelonline.se/biblereader.php?book=1",
        icon: "fas fa-scroll",
        keywords: [
            "gamla testamentet", "old testament", "gt", "moses", "moseböcker", "pentateuch",
            "första mosebok", "genesis", "andra mosebok", "exodus", "psalmer", "psalms",
            "ordspråk", "proverbs", "jesaja", "isaiah", "jeremia", "jeremiah", "hesekiel",
            "ezekiel", "daniel", "profeterna", "prophets", "torah", "tanak", "hebreiska"
        ]
    },

    // YouVersion
    {
        title: "YouVersion (SRB16)",
        description: "Svenska Reformationsbibeln på YouVersion Bible App med läsplaner och delningsfunktioner.",
        url: "https://www.bible.com/bible/3413/MAT.1.SRB16",
        icon: "fas fa-mobile-alt",
        keywords: [
            "youversion", "you version", "app", "mobil", "mobile", "srb16", "läsplan",
            "reading plan", "delning", "sharing", "social", "community", "grupper", "groups",
            "notifications", "påminnelser", "reminders", "offline", "sync", "synkronisering",
            "bible app", "bibelapp", "smartphone", "tablet", "android", "ios", "iphone"
        ]
    },

    // PDF downloads
    {
        title: "PDF-nedladdningar",
        description: "Ladda ner Svenska Reformationsbibeln som PDF-filer för offline-läsning.",
        url: "https://bibel.se/wordpress/index.php/2022/01/18/oversatta-bibelbocker/",
        icon: "fas fa-file-pdf",
        keywords: [
            "pdf", "nedladdning", "download", "offline", "dokument", "document", "fil", "file",
            "print", "utskrift", "skriva ut", "gratis", "free", "fulltext", "komplett",
            "complete", "böcker", "books", "kapitel", "chapters", "portable", "format"
        ]
    },
    {
        title: "NT med fotnoter",
        description: "Nya Testamentet med utförliga fotnoter och kommentarer.",
        url: "http://www.bibel.se/objfiles/1/SRBNTmedUNfotno_1604169176.pdf",
        icon: "fas fa-sticky-note",
        keywords: [
            "fotnoter", "footnotes", "kommentarer", "comments", "noter", "notes", 
            "förklaring", "explanation", "annotation", "marginal", "referenser", "references",
            "utförlig", "detailed", "djupgående", "comprehensive", "studium", "study",
            "teologi", "theology", "exeges", "exegesis", "tolkning", "interpretation"
        ]
    },

    // Videos and media
    {
        title: "Videoserie: En felaktig grundtext",
        description: "Femdelad videoserie som förklarar problemen med moderna bibelöversättningars grundtexter.",
        url: "https://bibel.se/wordpress/index.php/media/",
        icon: "fas fa-video",
        keywords: [
            "video", "videoserie", "video series", "grundtext", "source text", "felaktig", 
            "incorrect", "moderna", "modern", "översättningar", "translations", "serie", "series",
            "femdelar", "five parts", "5 delar", "problem", "kritik", "criticism",
            "westcott hort", "nestle aland", "critical text", "textkritik", "text criticism",
            "handskrifter", "manuscripts", "alexandria", "bizantinsk", "majority text"
        ]
    },
    {
        title: "Reformationsbibeln-serien",
        description: "Videoserie som förklarar bakgrunden till Svenska Reformationsbibeln.",
        url: "https://bibel.se/wordpress/index.php/media/",
        icon: "fas fa-play-circle",
        keywords: [
            "reformationsbibeln", "reformation bible", "video", "bakgrund", "background",
            "förklaring", "explanation", "serie", "series", "historia", "history",
            "utveckling", "development", "process", "översättning", "translation",
            "karl xii", "textus receptus", "revision", "revidering", "modernisering"
        ]
    },
    {
        title: "YouTube-kanal Ljudbibel",
        description: "Lyssna på Svenska Reformationsbibeln som ljudbok på YouTube.",
        url: "https://www.youtube.com/@reformationsbibeln9676/videos",
        icon: "fas fa-headphones",
        keywords: [
            "youtube", "ljudbibel", "audio bible", "lyssna", "listen", "audio", "sound",
            "uppläsning", "reading", "narration", "ljudbok", "audiobook", "streaming",
            "gratis", "free", "kanal", "channel", "playlist", "uppspelning", "playback",
            "mobil", "mobile", "bil", "car", "pendling", "commute", "meditation"
        ]
    },

    // Bible translations
    {
        title: "Karl XII:s Bibel 1703",
        description: "Den ursprungliga Karl XII:s Bibel från 1703 som ligger till grund för Reformationsbibeln.",
        url: "https://www.bibel.se/objfiles/1/KXIIBibel1703he_-1499304058.pdf",
        icon: "fas fa-crown",
        keywords: [
            "karl xii", "karl 12", "1703", "ursprunglig", "original", "historisk", "historical",
            "grundlag", "foundation", "basis", "grund", "source", "svensk", "swedish",
            "kungens", "king's", "royal", "kunglig", "auktoriserad", "authorized",
            "officiell", "official", "reformation", "protestant", "luthersk", "lutheran"
        ]
    },
    {
        title: "Åkesons Översättning",
        description: "Information om Åkesons bibelöversättning och dess historia.",
        url: "http://www.bibel.se/bibeln/andra-bibeloversattningar/fragor-om-bibeloversattningar/akesons-oversattning/bk-1861-nt_1059",
        icon: "fas fa-user",
        keywords: [
            "åkeson", "akeson", "översättning", "translation", "1861", "historia", "history",
            "bibelkommission", "bible commission", "svensk", "swedish", "klassisk", "classical",
            "traditionell", "traditional", "gammaltestamentlig", "old testament", "hebreiska",
            "hebrew", "grekiska", "greek", "språkvetenskaplig", "linguistic"
        ]
    },

    // Study tools
    {
        title: "Illustrerat Bibellexikon",
        description: "Omfattande bibellexikon med uppslagsord, bilder och förklaringar.",
        url: "https://www.bibel.se/bibellexikon",
        icon: "fas fa-book-open",
        keywords: [
            "lexikon", "lexicon", "bibellexikon", "bible dictionary", "uppslagsord", "entries",
            "förklaring", "explanation", "definition", "bilder", "images", "illustrerat",
            "illustrated", "studium", "study", "referens", "reference", "uppslagsverk",
            "encyclopedia", "teologi", "theology", "arkeologi", "archaeology", "historia",
            "geografi", "geography", "kultur", "culture", "hebreiska", "greek", "språk"
        ]
    },
    {
        title: "Bibelsökning",
        description: "Sök i Svenska Reformationsbibeln efter ord, fraser och bibelställen.",
        url: "https://bibelonline.se/biblereader.php",
        icon: "fas fa-search",
        keywords: [
            "sök", "search", "sökning", "searching", "ord", "words", "fraser", "phrases",
            "bibelställen", "bible verses", "verser", "verses", "konkordans", "concordance",
            "hitta", "find", "leta", "look for", "text", "innehåll", "content",
            "avancerad sökning", "advanced search", "filter", "resultat", "results"
        ]
    },

    // Articles and teaching
    {
        title: "Artiklar",
        description: "Läs artiklar om bibelöversättning, grundtexter och biblisk tro.",
        url: "https://bibel.se/wordpress/index.php/artiklar/",
        icon: "fas fa-newspaper",
        keywords: [
            "artiklar", "articles", "undervisning", "teaching", "tro", "faith", "lära", "doctrine",
            "biblisk", "biblical", "teologi", "theology", "studium", "study", "forskning",
            "research", "essäer", "essays", "inlägg", "posts", "blog", "reflektion",
            "reflection", "analys", "analysis", "diskussion", "discussion", "debatt"
        ]
    },
    {
        title: "Debattartiklar",
        description: "Debattartiklar om bibelöversättningar och textkritiska frågor.",
        url: "https://bibel.se/wordpress/index.php/2021/12/04/debatt/",
        icon: "fas fa-comments",
        keywords: [
            "debatt", "debate", "diskussion", "discussion", "textkritik", "textual criticism",
            "översättning", "translation", "kritik", "criticism", "argument", "resonemang",
            "reasoning", "kontrovers", "controversy", "meningsskiljaktighet", "disagreement",
            "ståndpunkt", "position", "åsikt", "opinion", "polemik", "apologetik", "apologetics"
        ]
    },
    {
        title: "Vad har hänt med Bibeln?",
        description: "Artikel som förklarar utvecklingen av moderna bibelöversättningar.",
        url: "http://www.bibel.se/artiklar/vad-har-hant-med-bibeln_1193",
        icon: "fas fa-exclamation-triangle",
        keywords: [
            "vad hänt", "what happened", "moderna", "modern", "utveckling", "development",
            "problem", "problems", "kritik", "criticism", "förändring", "change", "evolution",
            "textkritik", "textual criticism", "westcott hort", "nestle aland", "alexandria",
            "corruption", "förvrängning", "ändring", "alteration", "manipulation", "varning", "warning"
        ]
    },

    // Additional comprehensive entries for better search coverage
    {
        title: "Textus Receptus",
        description: "Information om Textus Receptus som grundtext för Reformationsbibeln.",
        url: "#grundtext",
        icon: "fas fa-scroll",
        keywords: [
            "textus receptus", "received text", "grundtext", "source text", "erasmus",
            "stephanus", "elzevir", "scrivener", "beza", "byzantinsk", "byzantine",
            "majoritetstexten", "majority text", "traditionell", "traditional", "handskrifter",
            "manuscripts", "grekisk", "greek", "ursprunglig", "original", "auktoriserad"
        ]
    },
    {
        title: "Bibelöversättning",
        description: "Information om principer för bibelöversättning och olika metoder.",
        url: "#oversattning",
        icon: "fas fa-language",
        keywords: [
            "översättning", "translation", "metod", "method", "principer", "principles",
            "formell", "formal", "dynamisk", "dynamic", "ekvivalens", "equivalence",
            "litterär", "literal", "fri", "free", "parafras", "paraphrase", "tolkning",
            "interpretation", "språkvetenskap", "linguistics", "semantik", "syntax",
            "hebreiska", "hebrew", "grekiska", "greek", "svenska", "swedish"
        ]
    },
    {
        title: "Reformationen",
        description: "Bakgrund om reformationen och dess betydelse för bibelöversättning.",
        url: "#reformation",
        icon: "fas fa-church",
        keywords: [
            "reformation", "luther", "calvin", "protestantisk", "protestant", "sola scriptura",
            "bibeln ensam", "scripture alone", "kyrkoreform", "church reform", "1500-tal",
            "16th century", "wittenberg", "genève", "geneva", "tysk", "german", "latin",
            "vulgate", "munkbibel", "folkspråk", "vernacular", "tillgänglighet", "accessibility"
        ]
    }
];

// Export for use in website-search.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = searchData;
}