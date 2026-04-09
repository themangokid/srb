// Witness type codes:
//   pap = papyrus   cod = major codex   byz = Byzantine/minuscule
//   ver = ancient version   pat = church father   tr = printed TR edition
//
// witnesses.tr = manuscripts supporting the TR/majority reading
// witnesses.un = manuscripts supporting the NA/UBS (omission) reading

const allVariants = [

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 1 — KRITISKA DOKTRINÄRA VARIANTER
// ═══════════════════════════════════════════════════════════════════
  {category:"critical", verse:"1 Joh 4:3",
   tr_text:"Men varje ande som inte bekänner att Jesus Kristus har kommit i köttet, är inte från Gud. Det är antikrists ande...",
   un_text:"utelämnar: Kristus har kommit i köttet.",
   impact:"UN utelämnar: Kristus har kommit i köttet",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"Iren",t:"pat"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"critical", verse:"1 Tim 3:16",
   tr_text:"Och erkänt stor är gudaktighetens hemlig­het: Gud blev uppenbarad i köttet...",
   un_text:"Han.",
   impact:"Han.",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Chry",t:"pat"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"D²",t:"cod"},{s:"33",t:"byz"}]
   }},

  {category:"critical", verse:"Apg 8:37",
   tr_text:"Då sa Filippus: Om du tror av hela ditt hjärta, så kan det ske. Och han svarade och sa: Jag tror att Jesus Kristus är Guds Son.",
   un_text:"utelämnar hela vers 37.",
   impact:"Hela versen utelämnad i UN",
   witnesses:{
     tr:[{s:"min.36",t:"byz"},{s:"Lect",t:"byz"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"Iren",t:"pat"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P45",t:"pap"},{s:"ℵ",t:"cod"},{s:"A",t:"cod"},{s:"B",t:"cod"},{s:"C",t:"cod"}]
   }},

  {category:"critical", verse:"Joh 1:18",
   tr_text:"Ingen har någonsin sett Gud. Den enfödde Sonen, som är vid Faderns bröst, han har förklarat honom.",
   un_text:"den enfödde Guden.",
   impact:"den enfödde Guden.",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"Iren",t:"pat"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P66",t:"pap"},{s:"P75",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"critical", verse:"Kol 1:14",
   tr_text:"I honom har vi för­lossningen genom hans blod, syndernas förlåtelse.",
   un_text:"utelämnar: genom hans blod.",
   impact:"UN utelämnar: genom hans blod",
   witnesses:{
     tr:[{s:"D²",t:"cod"},{s:"Lect",t:"byz"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P46",t:"pap"},{s:"ℵ",t:"cod"},{s:"A",t:"cod"},{s:"B",t:"cod"},{s:"C",t:"cod"}]
   }},

  {category:"critical", verse:"Mark 16:8",
   tr_text:"Och de gick has­tigt ut och flydde från graven.",
   un_text:"Mark 16:9–20 satta inom parentes. Endast ℵ och B saknar verserna.",
   impact:"UN ifrågasätter: Mark 16:9–20",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"arm",t:"ver"},{s:"Iren",t:"pat"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"critical", verse:"Mark 9:29",
   tr_text:"...Detta slag kan inte drivas ut annat än genom bön och fasta.",
   un_text:"utelämnar: och fasta.",
   impact:"UN utelämnar: och fasta",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"critical", verse:"Matt 17:21",
   tr_text:"Men detta slag går inte ut, annat än genom bön och fasta.",
   un_text:"utelämnar hela vers 21.",
   impact:"UN utelämnar: hela vers 21",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"33",t:"byz"}]
   }},

  {category:"critical", verse:"Matt 18:11",
   tr_text:"För Människo­sonen har kommit för att frälsa det som var förlorat.",
   un_text:"utelämnar hela vers 11.",
   impact:"Hela versen utelämnad i UN",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"L",t:"cod"},{s:"33",t:"byz"}]
   }},

  {category:"critical", verse:"Matt 6:13",
   tr_text:"...utan fräls oss från det onda, för riket är ditt och makten och härligheten i evighet. Amen.",
   un_text:"utelämnar: doxologin (för riket är ditt...).",
   impact:"UN utelämnar: doxologin",
   witnesses:{
     tr:[{s:"D",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"it",t:"ver"},{s:"Chry",t:"pat"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"Vg",t:"ver"}]
   }},

  {category:"critical", verse:"Rom 8:1",
   tr_text:"Därför finns nu ingen fördömelse för dem som är i Kristus Jesus, som inte vandrar efter köttet, utan efter Anden.",
   un_text:"utelämnar: som inte vandrar efter köttet, utan efter Anden.",
   impact:"UN utelämnar: som inte vandrar efter köttet, utan efter Anden",
   witnesses:{
     tr:[{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P46",t:"pap"},{s:"ℵ",t:"cod"},{s:"A",t:"cod"},{s:"B",t:"cod"},{s:"C",t:"cod"}]
   }},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 2 — BETYDANDE TEOLOGISKA VARIANTER
// ═══════════════════════════════════════════════════════════════════
  {category:"significant", verse:"1 Kor 7:5",
   tr_text:"Dra er inte ifrån varandra, om det inte sker för en tid med bådas samtycke, för att kunna ägna er åt fastan och bönen...",
   un_text:"utelämnar: fastan och.",
   impact:"UN utelämnar: fastan och",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P46",t:"pap"},{s:"ℵ",t:"cod"},{s:"A",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Joh 5:3",
   tr_text:"I dem låg det en stor mängd sjuka, blinda, halta och lama, som väntade på att vattnet skulle komma i rörelse,",
   un_text:"utelämnar: som väntade på att vattnet skulle komma i rörelse.",
   impact:"UN utelämnar: som väntade på att vattnet skulle komma i rörelse",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P66",t:"pap"},{s:"P75",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Joh 5:4",
   tr_text:"för en ängel steg ner i dammen vid en bestämd tid och rörde upp vattnet. Den som nu först steg ner i vattnet sedan det hade satts i rörelse blev frisk, vilken sjukdom han än hade.",
   un_text:"utelämnar hela vers 4.",
   impact:"Hela versen utelämnad i UN",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P66",t:"pap"},{s:"P75",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Luk 11:2",
   tr_text:"Då sa han till dem: När ni ber, så säg: Fader vår, som är i himlarna, helgat vare ditt namn. Låt ditt rike komma. Ske din vilja, såsom i himlen, så också på jorden.",
   un_text:"utelämnar: vår, som är i himlarna. utelämnar: Ske din vilja, såsom i himlen, så ock på jorden.",
   impact:"UN utelämnar: vår, som är i himlarna + Ske din vilja",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P75",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Luk 11:29",
   tr_text:"... annat tecken än profeten Jonas tecken.",
   un_text:"utelämnar: profeten.",
   impact:"UN utelämnar: profeten",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P45",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"D",t:"cod"}]
   }},

  {category:"significant", verse:"Luk 11:4",
   tr_text:"och förlåt oss våra synder, för också vi förlåter alla som är oss skyldiga. Och för oss inte in i frestelse, utan fräls oss från det onda.",
   un_text:"utelämnar: utan fräls oss från det onda.",
   impact:"UN utelämnar: utan fräls oss från det onda",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P75",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Luk 11:44",
   tr_text:"Ve er, ni skrift­lärda och fariseer, ni hycklare, för ni är som gravar som inte syns...",
   un_text:"utelämnar: skriftlärda och fariseer, ni hycklare.",
   impact:"UN utelämnar: skriftlärda och fariseer, ni hycklare",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P45",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Luk 23:17",
   tr_text:"För vid högtiden måste han frige en fånge åt dem.",
   un_text:"utelämnar hela vers 17.",
   impact:"Hela versen utelämnad i UN",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P75",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Luk 4:4",
   tr_text:"Då svarade Jesus och sa till honom: Det står skrivet: Människan ska inte leva bara av bröd, utan av varje ord som kommer från Gud.",
   un_text:"utelämnar: av varje ord från Gud.",
   impact:"UN utelämnar: av varje ord från Gud",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P45",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Luk 9:55",
   tr_text:"Men han vände sig om och tillrättavisade dem och sa: Ni vet inte av vilken ande ni är.",
   un_text:"utelämnar: och sa: Ni vet inte av vilken ande ni är.",
   impact:"UN utelämnar: och sa: Ni vet inte av vilken ande ni är",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P45",t:"pap"},{s:"ℵ",t:"cod"},{s:"A",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Luk 9:56",
   tr_text:"För Människo­sonen har inte kommit för att förgöra människoliv, utan för att frälsa dem. Och de gick till en annan by.",
   un_text:"utelämnar: För Männis­kosonen har inte kommit för att förgöra människornas liv, utan för att frälsa dem.",
   impact:"UN utelämnar: Människosonens syfte att frälsa",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P45",t:"pap"},{s:"ℵ",t:"cod"},{s:"A",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Mark 2:17",
   tr_text:"...Jag har inte kommit för att kalla rättfärdiga utan syndare till omvändelse.",
   un_text:"utelämnar: till omvändelse.",
   impact:"UN utelämnar: till omvändelse",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"L",t:"cod"}]
   }},

  {category:"significant", verse:"Matt 23:14",
   tr_text:"Ve er, skriftlärda och fariseer, hycklare, för ni plundrar änkors hus och ber långa böner för syns skull. Därför ska ni få desto hårdare dom.",
   un_text:"utelämnar hela vers 14.",
   impact:"Hela versen utelämnad i UN",
   witnesses:{
     tr:[{s:"D",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"L",t:"cod"},{s:"33",t:"byz"}]
   }},

  {category:"significant", verse:"Matt 27:35",
   tr_text:"...delade de hans kläder och kastade lott om dem, för att det skulle upp­fyllas som var sagt genom profeten.",
   un_text:"utelämnar resten av versen (uppfyllelsecitatet).",
   impact:"UN utelämnar: uppfyllelsecitat om Ps 22",
   witnesses:{
     tr:[{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"A",t:"cod"},{s:"B",t:"cod"},{s:"Vg",t:"ver"}]
   }},

  {category:"significant", verse:"Matt 5:22",
   tr_text:"...var och en som blir vred på sin broder utan giltigt skäl, han blir skyldig under domen,",
   un_text:"utelämnar: utan giltigt skäl.",
   impact:"UN utelämnar: utan giltigt skäl",
   witnesses:{
     tr:[{s:"D",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"Aug",t:"pat"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P66",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Matt 5:44",
   tr_text:"...Älska era fien­der, välsigna dem som förban­nar er, gör väl mot dem som hatar er, och be för dem som hånar er och förföljer er,",
   un_text:"utelämnar: välsigna dem som förbannar er, gör väl mot dem som hatar er, hånar er och.",
   impact:"UN utelämnar: välsigna dem som förbannar er, gör väl mot dem",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},

  {category:"significant", verse:"Matt 9:13",
   tr_text:"...För jag har inte kommit för att kalla rättfär­diga, utan syndare till omvän­delse.",
   un_text:"utelämnar: till omvändelse.",
   impact:"UN utelämnar: till omvändelse",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"L",t:"cod"}]
   }},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 3 — JESU NAMN OCH TITLAR
// ═══════════════════════════════════════════════════════════════════
  {category:"jesus", verse:"Joh 13:3",
   tr_text:"Jesus visste, att Fadern hade gett...", un_text:"han.",
   impact:"Jesus ersatt med pronomen \"han\" i UN",
   witnesses:{
     tr:[{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"SCR",t:"tr"}],
     un:[{s:"P66",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},
  {category:"jesus", verse:"Joh 18:5",
   tr_text:"...Jesus sa till dem: Jag Är. Och ...", un_text:"han.",
   impact:"Jesus ersatt med pronomen \"han\" i UN",
   witnesses:{
     tr:[{s:"Lect",t:"byz"},{s:"SCR",t:"tr"}],
     un:[{s:"P66",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},
  {category:"jesus", verse:"Joh 1:29", tr_text:"Nästa dag ser Johan­nes Jesus komma till sig och säger: ...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 4:16", tr_text:"Jesus sa till henne: Gå och kalla...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 4:46", tr_text:"Så kom Jesus till­baka till Kana...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 5:17", tr_text:"Men Jesus svarade dem:...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 6:14", tr_text:"sett det tecken som Jesus hade gjort,", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 8:16", tr_text:"Och även om jag dömer, så är min dom rätt, för jag är inte ensam, utan Fadern som har sänt mig är med mig.", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 8:20", tr_text:"Dessa ord talade Jesus vid offerkistan, när han undervisade i templet...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 8:21", tr_text:"Då sa Jesus på nytt till dem: Jag går bort, och ni ska söka efter mig...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 8:29", tr_text:"Och han som har sänt mig är med mig. Fadern har inte lämnat mig ensam...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 8:34", tr_text:"Jesus svarade dem: Sannerligen, sannerligen säger jag er: Var och en som begår synd är syndens slav.", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 8:39", tr_text:"De svarade och sa till honom: Abraham är vår fader. Jesus sa till dem: Om ni vore Abrahams barn, skulle ni göra Abrahams gärningar.", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 8:42", tr_text:"Jesus sa till dem: Om Gud vore er Fader, då älskade ni mig, för jag har utgått och kommit från Gud...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 8:49", tr_text:"Jesus svarade: Jag har ingen demon. Jag ärar min Fader, men ni vanärar mig.", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 8:54", tr_text:"Jesus svarade: Om jag ärar mig själv, är min ära ingenting...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 9:11", tr_text:"Han svarade: En man som heter Jesus...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Joh 11:30", tr_text:"Jesus hade ännu inte kommit in i byn...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Mark 12:41", tr_text:"Och Jesus satte sig mitt emot offerkistan...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Mark 1:41", tr_text:"Då fylldes Jesus av medlidande...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Mark 5:19", tr_text:"Men Jesus tillät det inte...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Mark 7:27", tr_text:"Men Jesus sa till henne: ...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Mark 8:1", tr_text:"Då kallade Jesus till sig sina lärjungar och sa till dem:", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 13:36", tr_text:"Sedan skickade Jesus iväg folket...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 14:14", tr_text:"När Jesus kom fram såg han en stor folkskara,", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 14:22", tr_text:"Och strax där­efter uppmanade Jesus sina lärjungar att stiga i båten.", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 15:16", tr_text:"Då sa Jesus: Är även ni fortfarande oförstån­diga?", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 17:26", tr_text:"Petrus sa till honom: Från andra...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 18:2", tr_text:"Då kallade Jesus fram ett litet barn till sig...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 22:37", tr_text:"Då sa Jesus till honom:", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 24:2", tr_text:"Då sa Jesus till dem: Ser ni inte allt detta?", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 28:6", tr_text:"Kom och se plat­sen, där Herren låg.", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 4:12", tr_text:"Då nu Jesus hörde, att Johannes var satt i fängelse,", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 4:18", tr_text:"När Jesus gick utmed Galileiska sjön", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 4:23", tr_text:"Och Jesus gick omkring i hela Galileen...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 8:3", tr_text:"...Jesus ut handen och rörde vid honom och sa: Jag vill, bli ren.", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 8:5", tr_text:"När Jesus kom in i Kapernaum, gick en officer fram till honom...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 8:7", tr_text:"Då sa Jesus till honom: Jag ska komma och bota honom.", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"jesus", verse:"Matt 9:12", tr_text:"När Jesus hörde detta...", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 4 — GUDS NAMN OCH ATTRIBUT
// ═══════════════════════════════════════════════════════════════════
  {category:"god", verse:"1 Tim 1:17",
   tr_text:"...den oförgäng­lige, osynlige, den ende vise Guden vare ära och pris i all evighet. Amen.", un_text:"utelämnar: vise.", impact:"UN utelämnar: vise",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"D²",t:"cod"}]
   }},
  {category:"god", verse:"1 Tim 2:7", tr_text:"...jag talar sanning i Kristus och ljuger inte – en lärare för hedningarna i tro och sanning.", un_text:"utelämnar: i Kristus.", impact:"UN utelämnar: i Kristus"},
  {category:"god", verse:"Matt 21:12", tr_text:"Och Jesus gick in i Guds tempel", un_text:"utelämnar: Guds.", impact:"UN utelämnar: Guds"},
  {category:"god", verse:"Matt 22:30", tr_text:"För vid uppstån­delsen gifter man sig inte och blir inte bortgift, utan man är som Guds änglar i himlen.", un_text:"utelämnar Guds.", impact:"UN utelämnar: Guds"},
  {category:"god", verse:"Matt 23:8", tr_text:"Men ni ska inte låta er kallas Rabbi, för en är er Läromästare, Kristus,", un_text:"utelämnar Kristus.", impact:"UN utelämnar: Kristus"},
  {category:"god", verse:"Matt 6:33", tr_text:"Men sök först Guds rike...", un_text:"sätter inom parentes: Guds.", impact:"sätter inom parentes: Guds."},
  {category:"god", verse:"Rom 14:10", tr_text:"...Eller varför föraktar du då din broder? För vi ska alla stå inför Kristi domstol.", un_text:"Guds.", impact:"Guds."},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 5 — DEN HELIGE ANDE
// ═══════════════════════════════════════════════════════════════════
  {category:"spirit", verse:"1 Joh 5:7",
   tr_text:"Ty tre är de som vittnar i himlen: Fadern, Ordet och den Helige Ande, och dessa tre är ett.",
   un_text:"utelämnar: i himlen: Fadern, Ordet och den Helige Ande och dessa tre är ett.",
   impact:"UN utelämnar: i himlen: Fadern, Ordet",
   witnesses:{
     tr:[{s:"61",t:"byz"},{s:"Comp",t:"byz"},{s:"syrh",t:"ver"},{s:"Cypr",t:"pat"},{s:"Ambr",t:"pat"},{s:"Jer",t:"pat"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P74",t:"pap"},{s:"ℵ",t:"cod"},{s:"A",t:"cod"},{s:"B",t:"cod"},{s:"C",t:"cod"},{s:"33",t:"byz"}]
   }},
  {category:"spirit", verse:"1 Kor 2:13", tr_text:"...utan med ord som den Helige Ande lär, och bedömer andliga saker..", un_text:"utelämnar: Helige.", impact:"UN utelämnar: Helige"},
  {category:"spirit", verse:"1 Petr 1:22", tr_text:"När ni har renat era själar i sanningens lydnad genom Anden, till uppriktig broderlig kärlek, ska ni älska varandra innerligt av ett rent hjärta,", un_text:"utelämnar: genom Anden.", impact:"UN utelämnar: genom Anden"},
  {category:"spirit", verse:"2 Kor 13:13", tr_text:"...och den Helige Andes gemenskap vare med er alla. Amen.", un_text:"utelämnar: Amen.", impact:"UN utelämnar: Amen"},
  {category:"spirit", verse:"2 Petr 1:21", tr_text:"För ingen profetia har någonsin kommit till genom mänsklig vilja, utan heliga människor från Gud har talat drivna av den Helige Ande.", un_text:"utelämnar: heliga.", impact:"UN utelämnar: heliga"},
  {category:"spirit", verse:"Apg 4:8", tr_text:"Då sa Petrus, som var uppfylld av den Helige Ande, till dem: Ni folkets rådsherrar och äldste i Israel.", un_text:"utelämnar: Israel.", impact:"UN utelämnar: Israel"},
  {category:"spirit", verse:"Apg 6:3", tr_text:"sju män som har gott rykte och som är uppfyllda av den Helige Ande och visdom...", un_text:"utelämnar: Helige.", impact:"UN utelämnar: Helige"},
  {category:"spirit", verse:"Apg 8:18", tr_text:"Men när Simon såg, att den Helige Ande gavs genom att apostlarna lade hän­derna på dem, erbjöd han dem pengar,", un_text:"utelämnar: den Helige.", impact:"UN utelämnar: den Helige"},
  {category:"spirit", verse:"Ef 5:9", tr_text:"För Andens frukt består i all godhet och rättfär­dighet och sanning.", un_text:"ljusets.", impact:"ljusets."},
  {category:"spirit", verse:"Joh 7:39", tr_text:"Men detta sa han om Anden, som de som tror på honom skulle få. För den Helige Ande var ännu inte given, eftersom Jesus inte ännu hade blivit förhärligad.", un_text:"trodde. utelämnar: Helige.", impact:"UN utelämnar: Helige"},
  {category:"spirit", verse:"Luk 10:21", tr_text:"I samma stund fröjdade sig Jesus i anden och sa: Jag prisar dig, Fader ...", un_text:"han i den helige Ande.", impact:"han i den helige Ande."},
  {category:"spirit", verse:"Mark 13:11", tr_text:"..så bekymra er inte för vad ni ska säga och tänk inte på det innan, utan vad som blir givet åt er i samma stund, det ska ni tala. För det är inte ni som talar, utan den Helige Ande.", un_text:"utelämnar: tänk inte på det innan.", impact:"UN utelämnar: tänk"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 6 — JUNGFRUFÖDELSEN OCH FAMILJ
// ═══════════════════════════════════════════════════════════════════
  {category:"family", verse:"Luk 2:33",
   tr_text:"Och Josef och hans mor förundrade sig över det som sades om honom.",
   un_text:"Hans far.",
   impact:"Hans far.",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P75",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"Vg",t:"ver"}]
   }},
  {category:"family", verse:"Luk 2:43", tr_text:"...stannade Jesus­gossens kvar i Jerusalem.", un_text:"utelämnar: Jesus.", impact:"UN utelämnar: Jesus"},
  {category:"family", verse:"Luk 2:48", tr_text:"...Din far och jag har sökt dig med oro.", un_text:"utelämnar: din.", impact:"UN utelämnar: din"},
  {category:"family", verse:"Matt 1:18", tr_text:"Med Jesu Kristi börd förhöll det sig på detta sätt: När hans mor Maria var trolovad med Josef...", un_text:"utelämnar: Jesu Kristi.", impact:"UN utelämnar: Jesu Kristi"},
  {category:"family", verse:"Matt 1:25", tr_text:"...och han kände henne inte, förrän hon hade fött sin förstfödde son.", un_text:"utelämnar: förstfödde.", impact:"UN utelämnar: förstfödde"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 7 — UNDERGÖRELSER
// ═══════════════════════════════════════════════════════════════════
  {category:"miracles", verse:"Joh 5:16", tr_text:"Och av den anledningen förföljde judarna Jesus, och sökte döda honom, för att han hade gjort detta på sabbaten.", un_text:"utelämnar: och sökte döda honom.", impact:"UN utelämnar: och sökte döda honom"},
  {category:"miracles", verse:"Luk 4:41", tr_text:"Och demoner for också ut ur många med höga rop och sade: Du är Kristus, Guds Son. Men han tillrättavisade dem och tillät dem inte att tala, för de visste att han var Kristus.", un_text:"utelämnar: Guds Son.", impact:"UN utelämnar: Guds Son"},
  {category:"miracles", verse:"Mark 6:11", tr_text:"Och om en plats inte tar emot er och folk inte hör er, gå bort därifrån... det ska bli mer uthärdligt för Sodom och Gomorra på domens dag än för den staden.", un_text:"utelämnar: det ska bli mer uthärdligt för Sodom och Gomorra på domens dag än för den staden.", impact:"UN utelämnar: Sodoms dom"},
  {category:"miracles", verse:"Mark 7:16", tr_text:"Om någon har öron att höra med, låt honom höra.", un_text:"utelämnar hela vers 16.", impact:"Hela versen utelämnad i UN"},
  {category:"miracles", verse:"Matt 12:47", tr_text:"Och någon sade till honom: Se, din mor och dina bröder står utanför och vill tala med dig.", un_text:"utelämnar hela vers 47.", impact:"Hela versen utelämnad i UN"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 8 — ETIK OCH KRISTET LIV
// ═══════════════════════════════════════════════════════════════════
  {category:"ethics", verse:"Luk 17:36", tr_text:"Två män ska vara på fältet, den ene ska tas med och den andre lämnas kvar.", un_text:"utelämnar hela vers 36.", impact:"Hela versen utelämnad i UN"},
  {category:"ethics", verse:"Matt 19:9", tr_text:"...Och jag säger er: Den som skil­jer sig från sin hustru av annan orsak än otukt och gifter sig med en annan, han begår äkten­skapsbrott. Och den som gifter sig med en skild kvinna begår äkten­skapsbrott.", un_text:"utelämnar: Och den som gifter sig med en skild kvinna begår äktenskapsbrott.", impact:"UN utelämnar: den som gifter sig med en skild kvinna"},
  {category:"ethics", verse:"Matt 20:16", tr_text:"Så ska de sista bli de första och de första de sista. För många är kallade, men få är utvalda.", un_text:"utelämnar: För många är kallade, men få är utvalda.", impact:"UN utelämnar: Många kallade, få utvalda"},
  {category:"ethics", verse:"Matt 20:22", tr_text:"...Ni vet inte vad ni ber om. Kan ni dricka den bägare som jag ska dricka och döpas med det dop som jag döps med?", un_text:"utelämnar: och döpas med det dop som jag döps med.", impact:"UN utelämnar: dopet"},
  {category:"ethics", verse:"Matt 25:13", tr_text:"Vaka därför, för ni vet varken dagen eller stunden då Männi­skosonen kommer.", un_text:"utelämnar: då Männi­skosonen kommer.", impact:"UN utelämnar: då Männi­skosonen kommer"},
  {category:"ethics", verse:"Mark 10:21", tr_text:"Då såg Jesus på honom och fick kärlek till honom och sa till honom: Du fattas en sak. Gå och sälj allt vad du äger... och ta upp ditt kors och följ mig.", un_text:"utelämnar: ta upp ditt kors och.", impact:"UN utelämnar: ta upp ditt kors"},
  {category:"ethics", verse:"Mark 13:14", tr_text:"...den som läser det förstå det...", un_text:"utelämnar: det.", impact:"UN utelämnar: det"},
  {category:"ethics", verse:"Mark 9:44", tr_text:"...där deras mask inte dör och elden inte släcks.", un_text:"utelämnar hela vers 44.", impact:"Hela versen utelämnad i UN"},
  {category:"ethics", verse:"Mark 9:46", tr_text:"...där deras mask inte dör och elden inte släcks.", un_text:"utelämnar hela vers 46.", impact:"Hela versen utelämnad i UN"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 9 — GEOGRAFISKA OCH PERSONNAMN
// ═══════════════════════════════════════════════════════════════════
  {category:"names", verse:"Apg 16:7", tr_text:"Men Jesu Andes tillät det inte.", un_text:"Anden.", impact:"Anden."},
  {category:"names", verse:"Luk 23:38", tr_text:"Och det stod skrivet på grekiska och latin och hebreiska: Denne är judarnas kung.", un_text:"utelämnar: på grekiska och latin och hebreiska.", impact:"UN utelämnar: de tre språken"},
  {category:"names", verse:"Joh 4:42", tr_text:"...vi vet att denne verkligen är Kristus, världens Frälsare.", un_text:"utelämnar: Kristus.", impact:"UN utelämnar: Kristus"},
  {category:"names", verse:"Matt 27:34", tr_text:"Och de gav honom vin blandat med galla att dricka...", un_text:"vinäger.", impact:"vinäger."},
  {category:"names", verse:"Mark 15:3", tr_text:"Och överstepräs­terna anklagade honom för många saker. Men han svarade ingenting.", un_text:"utelämnar: men han svarade ingenting.", impact:"UN utelämnar: men han svarade ingenting"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 10 — FÖRSAMLINGSORDNING OCH SAKRAMENT
// ═══════════════════════════════════════════════════════════════════
  {category:"church", verse:"1 Kor 11:29", tr_text:"Den som äter och dricker på ett ovärdigt sätt äter och dricker en dom över sig, för han urskiljer inte Herrens kropp.", un_text:"utelämnar: Herrens.", impact:"UN utelämnar: Herrens"},
  {category:"church", verse:"Apg 20:28", tr_text:"Akta er själva och hela den hjord som den Helige Ande har satt er som tillsyningsmän över, för att ni ska vara herdar för Guds församling...", un_text:"Herrens.", impact:"Herrens."},
  {category:"church", verse:"Matt 18:20", tr_text:"Ty där två eller tre är samlade i mitt namn, där är jag mitt ibland dem.", un_text:"utelämnar: mitt.", impact:"UN utelämnar: mitt"},
  {category:"church", verse:"1 Kor 10:28", tr_text:"...ät inte det, för hans skull som upplyste er om det, och för samvetets skull. Ty Herren är jordens och allt vad därpå är.", un_text:"utelämnar: Ty Herren är jordens...", impact:"UN utelämnar: Herren är jordens"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 11 — UPPSTÅNDELSEN OCH EFTERÅT
// ═══════════════════════════════════════════════════════════════════
  {category:"resurrection", verse:"Luk 24:6",
   tr_text:"Han är inte här utan uppstånden. Kom ihåg vad han sa till er när han fortfarande var i Galileen.",
   un_text:"utelämnar: Han är inte här utan uppstånden.",
   impact:"UN utelämnar: uppståndelseorden",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"arm",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P75",t:"pap"},{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"Vg",t:"ver"}]
   }},
  {category:"resurrection", verse:"Luk 24:12", tr_text:"Men Petrus steg upp och sprang till graven...", un_text:"utelämnar hela vers 12.", impact:"Hela versen utelämnad i UN"},
  {category:"resurrection", verse:"Luk 24:36", tr_text:"...stod Jesus själv ibland dem och sa till dem: Frid vare med er.", un_text:"utelämnar: och sa till dem: Frid vare med er.", impact:"UN utelämnar: Frid vare med er"},
  {category:"resurrection", verse:"Luk 24:40", tr_text:"Och när han hade sagt det, visade han dem sina händer och sina fötter.", un_text:"utelämnar hela vers 40.", impact:"Hela versen utelämnad i UN"},
  {category:"resurrection", verse:"Luk 24:51", tr_text:"...skildes han från dem och bars upp till himlen.", un_text:"utelämnar: och bars upp till himlen.", impact:"UN utelämnar: och bars upp till himlen"},
  {category:"resurrection", verse:"Luk 24:52", tr_text:"Och de tillbad honom och återvände till Jerusalem med stor glädje.", un_text:"utelämnar: och tillbad honom.", impact:"UN utelämnar: och tillbad honom"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 12 — PROFETIOR OCH UPPFYLLELSER
// ═══════════════════════════════════════════════════════════════════
  {category:"prophecy", verse:"Matt 27:9", tr_text:"Då uppfylldes det som var sagt av profeten Jeremia: De tog de trettio silverpenningarna...", un_text:"utelämnar: Jeremia.", impact:"UN utelämnar: Jeremia"},
  {category:"prophecy", verse:"Mark 1:2", tr_text:"Såsom det är skrivet i profeternas böcker...", un_text:"i profeten Jesaja.", impact:"i profeten Jesaja."},
  {category:"prophecy", verse:"Luk 4:18", tr_text:"Herrens Ande är över mig, eftersom han har smort mig till att predika evangelium för de fattiga. Han har sänt mig för att hela de förkrossade till hjärtat...", un_text:"utelämnar: hela de förkrossade till hjärtat.", impact:"UN utelämnar: hela de förkrossade"},
  {category:"prophecy", verse:"Matt 11:23", tr_text:"Och du Kapernaum, som är upphöjt ända till himlen, ska bli nerkastat ända till dödsriket.", un_text:"utelämnar: ända till himlen.", impact:"UN utelämnar: ända till himlen"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 13 — DOKTRIN OM SYND OCH HELGELSE
// ═══════════════════════════════════════════════════════════════════
  {category:"sin", verse:"1 Joh 5:13", tr_text:"...ni som tror på Guds Sons namn. Och detta skriver jag till er för att ni ska tro på Guds Sons namn.", un_text:"utelämnar: Och detta skriver jag till er för att ni ska tro på Guds Sons namn.", impact:"UN utelämnar: sista meningen"},
  {category:"sin", verse:"Gal 3:1", tr_text:"Ni oförnuftiga galater, vem har förgjort er, att ni inte ska lyda sanningen? Ni för vilkas ögon Jesus Kristus har blivit tydligt utmålad bland er såsom korsfäst.", un_text:"utelämnar: att ni inte ska lyda sanningen.", impact:"UN utelämnar: lydnad av sanningen"},
  {category:"sin", verse:"Rom 7:6", tr_text:"Men nu har vi blivit lösta från lagen, sedan vi är döda för det som höll oss fångna...", un_text:"utelämnar: blivit lösta från.", impact:"UN utelämnar: blivit lösta från"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 14 — KRISTEN KALLELSE OCH TJÄNST
// ═══════════════════════════════════════════════════════════════════
  {category:"ministry", verse:"Matt 28:20", tr_text:"...Och se, jag är med er alla dagar ända till tidens ände.", un_text:"utelämnar: alla.", impact:"UN utelämnar: alla"},
  {category:"ministry", verse:"Mark 16:20", tr_text:"Och de gick ut och predikade överallt, och Herren samarbetade med dem och bekräftade ordet med de tecken som följde med. Amen.", un_text:"utelämnar: Amen.", impact:"UN utelämnar: Amen"},
  {category:"ministry", verse:"Luk 22:19", tr_text:"...Gör detta till min åminnelse.", un_text:"utelämnar: vers 19b och 20.", impact:"UN utelämnar: vers 19b–20"},
  {category:"ministry", verse:"Joh 17:12", tr_text:"Medan jag var med dem i världen bevarade jag dem i ditt namn. De som du gav mig har jag bevarat och inte någon av dem gick förlorad, utom fördärvets son.", un_text:"utelämnar: i världen.", impact:"UN utelämnar: i världen"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 15 — HIMMELSKA SCENER OCH ESKATOLOGI
// ═══════════════════════════════════════════════════════════════════
  {category:"eschatology", verse:"Matt 24:36",
   tr_text:"Men den dag och stund vet ingen, inte ens änglarna i himlen, utom min Fader allena.",
   un_text:"tillägger: inte heller Sonen.",
   impact:"UN tillägger: inte heller Sonen",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"W",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"syrh",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"},{s:"D",t:"cod"},{s:"33",t:"byz"}]
   }},
  {category:"eschatology", verse:"Upp 1:11",
   tr_text:"Jag är A och O, den förste och den siste...",
   un_text:"utelämnar: Jag är A och O, den förste och den siste.",
   impact:"UN utelämnar: Alfa och Omega",
   witnesses:{
     tr:[{s:"A",t:"cod"},{s:"C",t:"cod"},{s:"Lect",t:"byz"},{s:"syrh",t:"ver"},{s:"arm",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"ℵ",t:"cod"},{s:"B",t:"cod"}]
   }},
  {category:"eschatology", verse:"Upp 5:14", tr_text:"Och de fyra väsendena sade: Amen! Och de tjugofyra äldste föll ned och tillbad honom som lever i evigheter.", un_text:"utelämnar: honom som lever i evigheter.", impact:"UN utelämnar: tillbad Honom"},
  {category:"eschatology", verse:"Upp 11:17", tr_text:"...du Herre, Gud Allsmäktig, du som är och som var och som ska komma.", un_text:"utelämnar: och som ska komma.", impact:"UN utelämnar: och som ska komma"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 16 — MINDRE VARIANTER
// ═══════════════════════════════════════════════════════════════════
  {category:"minor", verse:"Luk 1:28", tr_text:"...Var hälsad, du högt benådade! Herren är med dig. Välsignad är du bland kvinnor.", un_text:"utelämnar: Välsignad är du bland kvinnor.", impact:"UN utelämnar: Välsignad bland kvinnor"},
  {category:"minor", verse:"Luk 4:8", tr_text:"Och Jesus svarade och sa till honom: Gå bort ifrån mig, Satan!", un_text:"utelämnar: Gå bort ifrån mig, Satan.", impact:"UN utelämnar: Gå bort, Satan"},
  {category:"minor", verse:"Luk 9:43", tr_text:"...och alla förundrades över Guds storhet. Medan alla förundrades över allt vad Jesus gjorde, sa han till sina lärjungar:", un_text:"utelämnar: Jesus.", impact:"UN utelämnar: Jesus"},
  {category:"minor", verse:"Luk 23:34", tr_text:"Då sa Jesus: Fader, förlåt dem, för de vet inte vad de gör.", un_text:"Texten sätts inom parentes.", impact:"UN parentessätter: Fader förlåt dem"},
  {category:"minor", verse:"Joh 6:47", tr_text:"Sannerligen, sannerligen säger jag er: Den som tror på mig har evigt liv.", un_text:"utelämnar: på mig.", impact:"UN utelämnar: på mig"},
  {category:"minor", verse:"Rom 1:16", tr_text:"Ty jag skäms inte för Kristi evangelium...", un_text:"utelämnar: Kristi.", impact:"UN utelämnar: Kristi"},
  {category:"minor", verse:"Rom 15:29", tr_text:"...ska komma med Kristi evangeliums fulla välsignelse.", un_text:"utelämnar: evangeliums.", impact:"UN utelämnar: evangeliums"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 17 — JOHANNESEVANGELIET
// ═══════════════════════════════════════════════════════════════════
  {category:"john", verse:"Joh 1:14", tr_text:"Och Ordet vart kött och bodde bland oss, och vi såg hans härlighet, en härlighet som den Enfödde har av Fadern, full av nåd och sanning.", un_text:"utelämnar: full av nåd och sanning.", impact:"UN utelämnar: full av nåd och sanning"},
  {category:"john", verse:"Joh 3:15", tr_text:"...för att var och en som tror på honom ska inte förgås utan ha evigt liv.", un_text:"utelämnar: inte förgås utan.", impact:"UN utelämnar: inte förgås utan"},
  {category:"john", verse:"Joh 6:69", tr_text:"Vi tror och vet att du är Kristus, den levande Gudens Son.", un_text:"den Helige, Guds.", impact:"den Helige, Guds."},
  {category:"john", verse:"Joh 9:35", tr_text:"Jesus hörde att de hade utdrivit honom. Och då han fann honom, sa han till honom: Tror du på Guds Son?", un_text:"Människosonen.", impact:"Människosonen."},
  {category:"john", verse:"Joh 11:41", tr_text:"Då tog de bort stenen från platsen där den döde låg.", un_text:"utelämnar: från platsen där den döde låg.", impact:"UN utelämnar: kontexten"},
  {category:"john", verse:"Joh 16:16", tr_text:"Om en liten stund ser ni mig inte, och åter om en liten stund ska ni se mig, för jag går till Fadern.", un_text:"utelämnar: för jag går till Fadern.", impact:"UN utelämnar: för jag går till Fadern"},
  {category:"john", verse:"Joh 20:29", tr_text:"Jesus sa till honom: Tomas, du tror för att du har sett mig...", un_text:"utelämnar: Tomas.", impact:"UN utelämnar: Tomas"},

// ═══════════════════════════════════════════════════════════════════
// KATEGORI 18 — APOSTLAGÄRNINGAR
// ═══════════════════════════════════════════════════════════════════
  {category:"acts", verse:"Apg 2:30",
   tr_text:"...Gud hade lovat med en ed att av hans avkomma, efter köttet, uppväcka Kristus och sätta honom på hans tron.",
   un_text:"utelämnar: efter köttet, uppväcka Kristus och.",
   impact:"UN utelämnar: efter köttet, uppväcka Kristus",
   witnesses:{
     tr:[{s:"C",t:"cod"},{s:"D",t:"cod"},{s:"Lect",t:"byz"},{s:"syrp",t:"ver"},{s:"it",t:"ver"},{s:"Vg",t:"ver"},{s:"TR-B",t:"tr"},{s:"SCR",t:"tr"}],
     un:[{s:"P45",t:"pap"},{s:"ℵ",t:"cod"},{s:"A",t:"cod"},{s:"B",t:"cod"}]
   }},
  {category:"acts", verse:"Apg 7:37", tr_text:"..En profet lik mig ska Herren er Gud låta upp­väcka åt er från era bröder, honom ska ni höra på.", un_text:"utelämnar: Herren er. utelämnar: honom ska ni höra på.", impact:"UN utelämnar: Herren er"},
  {category:"acts", verse:"Apg 8:37", tr_text:"Då sa Filippus: Om du tror av hela ditt hjärta, så kan det ske. Och han svarade och sa: Jag tror att Jesus Kristus är Guds Son.", un_text:"utelämnar hela vers 37.", impact:"Hela versen utelämnad i UN"},
  {category:"acts", verse:"Apg 9:5", tr_text:"..Och Herren svarade: Jag är Jesus, den du förföljer, det är svårt för dig att spjärna mot udden.", un_text:"utelämnar: det är svårt för dig att spjärna mot udden.", impact:"UN utelämnar: det är svårt för dig att"},
  {category:"acts", verse:"Apg 9:6", tr_text:"Både skälvande och med förvåning sa han: Herre, vad vill du att jag ska göra? Då sa Herren till honom: Stå upp och gå in i staden, så ska det bli sagt till dig vad du måste göra.", un_text:"utelämnar: Både skäl­vande och med förvåning sa han: Herre, vad vill du att jag ska göra? Då sa Herren till honom:", impact:"UN utelämnar: Paulus reaktion och fråga"},
  {category:"acts", verse:"Apg 15:11", tr_text:"Men vi tror att vi frälses genom Herren Jesu Kristi nåd, på samma sätt som de.", un_text:"Jesu.", impact:"Jesu."},
  {category:"acts", verse:"Apg 15:34", tr_text:"Men det behagade Silas att stanna kvar där.", un_text:"utelämnar hela vers 34.", impact:"Hela versen utelämnad i UN"},
  {category:"acts", verse:"Apg 16:31", tr_text:"Och de sa: Tro på Herren Jesus Kristus, och du ska bli frälst, du och ditt hus.", un_text:"Jesus.", impact:"Jesus."},
  {category:"acts", verse:"Apg 20:25", tr_text:"Och nu vet jag att ni alla, bland vilka jag gick runt och predikade Guds rike, inte mer ska se mitt ansikte.", un_text:"utelämnar: Guds.", impact:"UN utelämnar: Guds"},
  {category:"acts", verse:"Apg 20:28", tr_text:"...för att ni ska vara herdar för Guds församling som han har förvärvat med sitt eget blod.", un_text:"Herrens.", impact:"Herrens."},
  {category:"acts", verse:"Apg 23:9", tr_text:"...Vad ont finner vi i den mannen? Och om en ande eller en ängel har talat till honom, låt oss inte slåss mot Gud.", un_text:"utelämnar: Och om en ande... mot Gud.", impact:"UN utelämnar: låt oss inte slåss mot Gud"},
  {category:"acts", verse:"Apg 28:16", tr_text:"Och när vi kom in i Rom, lät hövitsmannen de övriga fångarna överlämnas åt en fångvakt. Men Paulus fick tillåtelse att bo för sig själv med den soldat som vaktade honom.", un_text:"utelämnar: lät hövitsmannen... fångvakt.", impact:"UN utelämnar: hövitsmannens order"},
  {category:"acts", verse:"Apg 3:26", tr_text:"Efter att Gud låtit sin Son Jesus uppstå, sände han honom först till er...", un_text:"utelämnar: Jesus.", impact:"UN utelämnar: Jesus"},
  {category:"acts", verse:"Apg 4:24", tr_text:"Och efter att de hört det, bad de högt i full enighet­ till Gud och sa: Herre, du är Gud...", un_text:"utelämnar: Gud.", impact:"UN utelämnar: Gud"},
  {category:"acts", verse:"Apg 4:25", tr_text:"Du som har sagt genom din tjänare Davids mun: Varför blev hedningarna..", un_text:"genom den helige Ande, som talade genom vår fader David", impact:"genom den helige Ande, som talade genom vår fader David"},
  {category:"acts", verse:"Apg 4:27", tr_text:"Ja, de har verkligen förenat sig, både Herodes och Pontius Pilatus...", un_text:"tillägger: i denna stad.", impact:"UN tillägger: i denna stad"},
  {category:"acts", verse:"Apg 4:36", tr_text:"Och Joses, som av apostlarna kallades Barnabas", un_text:"Josef.", impact:"Josef."},
  {category:"acts", verse:"Apg 5:23", tr_text:"..Fängelset fann vi verkligen ordentligt låst och vak­terna stod utanför dörrarna..", un_text:"utelämnar: utanför.", impact:"UN utelämnar: utanför"},
  {category:"acts", verse:"Apg 5:24", tr_text:"Och när överste­prästen och tempelvaktens befälhavare och överstepräs­terna hörde dessa ord...", un_text:"utelämnar: översteprästen.", impact:"UN utelämnar: översteprästen"},
  {category:"acts", verse:"Apg 5:33", tr_text:"När de hörde detta, blev de ursinniga och rådslog om att döda dem.", un_text:"ville.", impact:"ville."},
  {category:"acts", verse:"Apg 5:34", tr_text:"...och befallde att man för en kort stund skulle föra ut apostlarna.", un_text:"männen.", impact:"männen."},
  {category:"acts", verse:"Apg 5:39", tr_text:"Men är det av Gud, kan ni inte slå ner det...", un_text:"dem.", impact:"dem."},
  {category:"acts", verse:"Apg 5:41", tr_text:"..glada över att de ansetts värdiga att lida vanära för hans namns skull.", un_text:"utelämnar: hans.", impact:"UN utelämnar: hans"},
  {category:"acts", verse:"Apg 6:13", tr_text:"..Denne man upphör inte att tala hädiska ord mot denna heliga plats och mot lagen.", un_text:"utelämnar: hädiska.", impact:"UN utelämnar: hädiska"},
  {category:"acts", verse:"Apg 6:8", tr_text:"Och Stefanus, som var fylld av tro och kraft,", un_text:"nåd.", impact:"nåd."},
  {category:"acts", verse:"Apg 7:17", tr_text:"...som Gud hade svurit till Abraham med ed, växte folket i antal i Egypten och blev talrikt,", un_text:"lovat.", impact:"lovat."},
  {category:"acts", verse:"Apg 7:30", tr_text:"Och när fyrtio år hade gått, visade sig en Her­rens ängel för honom i öknen..", un_text:"utelämnar: Herrens.", impact:"UN utelämnar: Herrens"},
  {category:"acts", verse:"Apg 7:32", tr_text:"Jag är dina fäders Gud, Abrahams Gud, Isaks Gud och Jakobs Gud...", un_text:"utelämnar: Gud.", impact:"UN utelämnar: Gud"},
  {category:"acts", verse:"Apg 7:43", tr_text:"Ja, ni bar till och med Moloks tält och er gud Remfans stjärna...", un_text:"utelämnar: er.", impact:"UN utelämnar: er"},
  {category:"acts", verse:"Apg 7:48", tr_text:"Den allra Högste bor dock inte i tempel som är byggda med händer,", un_text:"en plats.", impact:"en plats."},
  {category:"acts", verse:"Apg 8:10", tr_text:"...från den minsta till den största, och sa: Denne är Guds stora kraft.", un_text:"tillägger: som kallas.", impact:"UN tillägger: som kallas"},
  {category:"acts", verse:"Apg 8:22", tr_text:"Omvänd dig därför från din ondska och be till Gud att det du tänkt...", un_text:"Herren.", impact:"Herren."},
  {category:"acts", verse:"Apg 9:18", tr_text:"...och han fick sin syn tillbaka omedelbart, och han stod upp och lät döpa sig.", un_text:"utelämnar: omedelbart.", impact:"UN utelämnar: omedelbart"},
  {category:"acts", verse:"Apg 9:19", tr_text:"..Därefter var Saulus några dagar tillsam­mans med lärjungarna i Damas­kus,", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"acts", verse:"Apg 9:20", tr_text:"och han började genast predika Kristus i syna­gogorna, att han är Guds Son.", un_text:"Jesus.", impact:"Jesus."},
  {category:"acts", verse:"Apg 9:26", tr_text:"Och när Saulus kom till Jerusalem, försökte han ansluta sig till lärjungarna,", un_text:"han.", impact:"Jesus ersatt med pronomen \"han\" i UN"},
  {category:"acts", verse:"Apg 9:28", tr_text:"Och han stannade hos dem, och gick in och ut i Jerusalem och predikade frimo­digt i Herren Jesu namn.", un_text:"utelämnar: Jesu.", impact:"UN utelämnar: Jesu"},
  {category:"acts", verse:"Apg 9:31", tr_text:"Så hade nu försam­lingarna frid i hela Judeen och Galileen och Samarien och de blev uppbyggda och levde i Herrens fruktan...", un_text:"församlingen. den blev uppbyggd.", impact:"församlingen. den blev uppbyggd."},
  {category:"acts", verse:"Apg 9:8", tr_text:"...och då han öppnade sina ögon såg han ingen, utan de tog honom vid handen och ledde honom in i Damaskus.", un_text:"inget.", impact:"inget."},
];
