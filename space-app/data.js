// Kurátorovaná databáze slavných vesmírných snímků.
// Pro každý záznam appka za běhu dotáhne skutečný obrázek z NASA Image Library
// (https://images-api.nasa.gov) podle "searchQuery", takže obrázek je vždy
// aktuální a validní. Texty (hook/fact/explanation) jsou napsané ručně,
// aby appka nepůsobila jako suchá učebnice.

const SPACE_IMAGES = [
  {
    id: "pale-blue-dot",
    searchQuery: "Pale Blue Dot Voyager Earth",
    title: "Pale Blue Dot",
    year: "1990",
    hook: "Tohle je fotka, na které je schovaná úplně celá historie lidstva. Najdeš ji?",
    fact: "Earth na snímku zabírá míň než 0,12 pixelu. Je to jen náhodný paprsek slunečního světla, co se odrazil od kamery.",
    explanation:
      "Sonda Voyager 1 pořídila tento snímek ze vzdálenosti přes 6 miliard kilometrů, těsně předtím, než jí NASA natrvalo vypnula kameru. Carl Sagan si tehdy vyžádal, aby se sonda ještě jednou otočila a vyfotila domov. Na výsledném snímku je Země jen nepatrná tečka zachycená v pruhu rozptýleného slunečního světla – odtud slavný citát: 'Zvaž znovu tu tečku. To je tady. To je domov. To jsme my.'",
    decoys: ["Mlhovina Pilíře stvoření", "Prstence Saturnu", "Povrch Marsu"],
  },
  {
    id: "earthrise",
    searchQuery: "Earthrise Apollo 8 Moon",
    title: "Earthrise",
    year: "1968",
    hook: "Astronaut tuhle fotku vlastně neměl v plánu vyfotit – křičel na kolegy, ať mu rychle podají film.",
    fact: "Byl to první moment v historii, kdy lidská bytost na vlastní oči uviděla Zemi vycházet nad jiným světem.",
    explanation:
      "Posádka Apolla 8 obíhala Měsíc a náhodou zahlédla, jak nad obzorem 'vychází' Země. Astronaut William Anders chytil fotoaparát a stihl to zachytit – snímek se později stal jedním z impulsů pro vznik ekologického hnutí, protože lidem poprvé ukázal, jak je naše planeta ve skutečnosti malá a křehká.",
    decoys: ["Mlhovina v Orionu", "Galaxie Andromeda", "Sluneční erupce"],
  },
  {
    id: "pillars-of-creation",
    searchQuery: "Pillars of Creation Hubble Eagle Nebula",
    title: "Pilíře stvoření",
    year: "1995 / 2014",
    hook: "Útvary na snímku jsou tak obrovské, že to, co teď vidíš, se ve skutečnosti odehrálo před tisíci lety.",
    fact: "Pilíře jsou vlastně oblaka plynu a prachu, ve kterých se právě rodí nové hvězdy – proto 'stvoření'.",
    explanation:
      "Hubbleův snímek mlhoviny Orel ukazuje sloupy mezihvězdného plynu dlouhé několik světelných let, uvnitř kterých gravitace postupně slepuje nové hvězdy. Některé z pilířů už dnes možná ani neexistují – rozfoukala je tlaková vlna blízké supernovy – ale světlo, které nám to prozradí, k nám ještě nedorazilo.",
    decoys: ["Velký rudý vír Jupiteru", "Měsíční krátery", "Polární záře"],
  },
  {
    id: "hubble-deep-field",
    searchQuery: "Hubble Ultra Deep Field galaxies",
    title: "Hubble Ultra Deep Field",
    year: "2004",
    hook: "Teleskop mířil na kousek nebe, který vypadal úplně prázdný. Výsledek šokoval i samotné astronomy.",
    fact: "Na jedné fotce je zachyceno přes 10 000 galaxií – a každá z nich obsahuje miliardy hvězd.",
    explanation:
      "Vědci namířili Hubbleův teleskop na jeden z nejtmavších a zdánlivě nejprázdnějších bodů oblohy a nechali ho tam 'svítit' několik dní. Místo prázdnoty se objevily tisíce vzdálených galaxií – některé tak daleko, že jejich světlo je staré přes 13 miliard let, tedy téměř stejně staré jako vesmír samotný.",
    decoys: ["Mlhovina Krab", "Souhvězdí Orion", "Sluneční soustava"],
  },
  {
    id: "m87-black-hole",
    searchQuery: "black hole M87 Event Horizon Telescope",
    title: "První fotka černé díry",
    year: "2019",
    hook: "Aby lidstvo vyfotilo tohle, muselo propojit teleskopy po celé planetě tak přesně, jako bychom fotili minci na Měsíci z Ameriky.",
    fact: "Černá díra na snímku je vzdálená 55 milionů světelných let a váží 6,5 miliardy Sluncí.",
    explanation:
      "Jde o vůbec první přímou fotografii černé díry v historii lidstva. Vznikla propojením osmi radioteleskopů po celém světě do jedné obří sítě (Event Horizon Telescope), která fungovala jako jeden teleskop o velikosti Země. Oranžový prstenec je rozžhavený plyn padající do díry, tmavý střed je stín samotného horizontu událostí.",
    decoys: ["Slunce v rentgenovém záření", "Rudý trpaslík", "Prstence Saturnu"],
  },
  {
    id: "pillars-crab-nebula",
    searchQuery: "Crab Nebula supernova remnant",
    title: "Mlhovina Krab",
    year: "1054 / dnes",
    hook: "Čínští astronomové ji poprvé zaznamenali už ve středověku – a popsali ji jako 'hostující hvězdu', co svítila i přes den.",
    fact: "Uprostřed mlhoviny je neutronová hvězda velikosti města, která se otočí kolem své osy 30krát za sekundu.",
    explanation:
      "V roce 1054 zaznamenali čínští, japonští i arabští astronomové na obloze náhlý jasný záblesk, viditelný i ve dne po několik týdnů. Dnes víme, že šlo o explozi supernovy. To, co po ní zbylo, je dnešní mlhovina Krab – rozpínající se oblak trosek s pulzarem (neutronovou hvězdou) v jádru, který se otáčí neuvěřitelnou rychlostí.",
    decoys: ["Galaxie Sombrero", "Mlhovina Carina", "Měsíc Europa"],
  },
  {
    id: "andromeda",
    searchQuery: "Andromeda Galaxy M31",
    title: "Galaxie Andromeda",
    year: "dnes",
    hook: "Díváš se na objekt, který jednoho dne (za pár miliard let) úplně pohltí naši vlastní galaxii.",
    fact: "Je to nejvzdálenější objekt, který člověk vidí pouhým okem – a přitom je vzdálený 2,5 milionu světelných let.",
    explanation:
      "Andromeda je naše nejbližší velká sousední galaxie a obsahuje přibližně bilion hvězd – víc než dvojnásobek počtu hvězd v Mléčné dráze. Obě galaxie se k sobě řítí rychlostí přes 100 km/s a vědci předpokládají, že za zhruba 4,5 miliardy let se spojí v jednu obří galaxii.",
    decoys: ["Mlhovina Oriona", "Saturn s prstenci", "Sluneční koróna"],
  },
  {
    id: "horsehead-nebula",
    searchQuery: "Horsehead Nebula Orion",
    title: "Mlhovina Koňská hlava",
    year: "dnes",
    hook: "Tmavá silueta, co připomíná koně, je ve skutečnosti obří oblak prachu, který pohlcuje světlo za sebou.",
    fact: "Celý útvar je tak obrovský, že by se do něj vešlo přes 400 sluncí vedle sebe.",
    explanation:
      "Koňská hlava je tzv. temná mlhovina – husté mračno mezihvězdného prachu, které nesvítí samo, ale rýsuje se jako tmavá silueta proti jasnému plynu za ním, podsvícenému okolními hvězdami. Časem ji hvězdné záření a erozí postupně rozptýlí.",
    decoys: ["Prstence Saturnu", "Povrch Marsu", "Galaxie Mléčná dráha"],
  },
  {
    id: "saturn-cassini",
    searchQuery: "Saturn rings Cassini",
    title: "Saturnovy prstence",
    year: "dnes",
    hook: "Prstence vypadají jako pevný pás, ale ve skutečnosti je to miliardy kousků ledu, které do sebe nikdy nenarazí.",
    fact: "Prstence jsou extrémně tenké – v poměru k jejich šířce je to, jako bys na fotbalové hřiště položila list papíru.",
    explanation:
      "Saturnovy prstence tvoří hlavně kousky vodního ledu o velikosti od zrnka prachu po kry velké jako dům. I přes svůj obrovský průměr (přes 280 000 km) jsou v průměru silné jen desítky metrů. Sonda Cassini je zkoumala 13 let, než se v roce 2017 úmyslně zřítila do atmosféry Saturnu.",
    decoys: ["Mlhovina Krab", "Jupiterova Velká rudá skvrna", "Mléčná dráha"],
  },
  {
    id: "apollo-footprint",
    searchQuery: "Apollo 11 footprint lunar surface",
    title: "Stopa na Měsíci",
    year: "1969",
    hook: "Tahle stopa ve skutečnosti může vydržet miliony let – a zřejmě tam bude i tehdy, až tu nebude nikdo z nás.",
    fact: "Na Měsíci není vítr ani voda, takže stopy astronautů z roku 1969 tam leží dodnes, prakticky nezměněné.",
    explanation:
      "Snímek zachycuje otisk boty astronauta Buzze Aldrina z mise Apollo 11, pořízený pro studium mechanických vlastností měsíčního prachu (regolitu). Protože na Měsíci chybí atmosféra i eroze, jediné, co stopy může časem smazat, jsou drobné meteority – proces trvající stovky tisíc až miliony let.",
    decoys: ["Kráter na Marsu", "Povrch komety", "Dno oceánu"],
  },
  {
    id: "carina-webb",
    searchQuery: "Carina Nebula James Webb Space Telescope",
    title: "Mlhovina Carina (Webb)",
    year: "2022",
    hook: "Vypadá to jako pobřeží s útesy a horami – ale žádná z těch 'hor' není z kamene. Je to zahalený plyn, který právě rodí hvězdy.",
    fact: "Byl to vůbec první veřejně zveřejněný snímek z teleskopu Jamese Webba a hned vyrazil dech celému světu.",
    explanation:
      "Takzvané 'Kosmické útesy' jsou okraj obří plynové a prachové bubliny v mlhovině Carina, kde intenzivní záření mladých horkých hvězd doslova 'vyhlodává' okolní materiál. Infračervená kamera Webbova teleskopu dokázala nahlédnout skrz prach a odhalit stovky dříve neviditelných novorozených hvězd.",
    decoys: ["Měsíc Saturnu Titan", "Prstence Uranu", "Polární záře na Zemi"],
  },
  {
    id: "mars-curiosity-selfie",
    searchQuery: "Curiosity rover selfie Mars",
    title: "Selfie roveru na Marsu",
    year: "dnes",
    hook: "Rover si neumí vyfotit celé tělo najednou – tahle 'selfie' je ve skutečnosti poskládaná z desítek samostatných snímků.",
    fact: "Robotická ruka s kamerou musí být na všech dílčích fotkách digitálně vymazána, aby selfie vypadala jako z jednoho záběru.",
    explanation:
      "Protože je kamera umístěná na konci robotické paže, nemůže rover vyfotit sám sebe jedním záběrem – paže by byla vidět v obraze. Místo toho NASA poskládá autoportrét z desítek jednotlivých snímků pořízených z různých úhlů a následně digitálně odstraní stopy po paži, aby výsledek vypadal jako jedna souvislá fotografie.",
    decoys: ["Robotická ruka na ISS", "Sonda na Venuši", "Měsíční modul Apollo"],
  },
  {
    id: "iss-nightside",
    searchQuery: "International Space Station Earth night lights",
    title: "Noční Země z ISS",
    year: "dnes",
    hook: "Z vesmíru nerozeznáš státní hranice – ale přesně podle tohoto obrázku poznáš, kde lidé žijí nejhustěji.",
    fact: "Některé oblasti (např. Severní Korea v noci) jsou na podobných snímcích nápadně tmavé kvůli nedostatku elektřiny.",
    explanation:
      "Astronauti na Mezinárodní vesmírné stanici fotí Zemi v noci dlouhými expozicemi, které zachytí světla měst, dálnic a přístavů. Tyto snímky se běžně používají i k vědeckým účelům – třeba k odhadu hustoty osídlení nebo dopadu umělého osvětlení na životní prostředí.",
    decoys: ["Povrch Jupiteru", "Mlhovina v Labuti", "Sluneční skvrny"],
  },
  {
    id: "supernova-1987a",
    searchQuery: "Supernova 1987A remnant",
    title: "Supernova 1987A",
    year: "1987",
    hook: "Hvězda, kterou vidíš explodovat, ve skutečnosti vybuchla už před 168 000 lety – jen nám to trvalo tak dlouho doletět.",
    fact: "Byla to první supernova viditelná pouhým okem od vynálezu dalekohledu, pozorovaná z celého jižní polokoule.",
    explanation:
      "Supernova 1987A vzplanula ve Velkém Magellanově mračnu, trpasličí galaxii poblíž Mléčné dráhy. Protože je vzdálená asi 168 000 světelných let, k nám jen teď doputovalo světlo z exploze, která se ve skutečnosti odehrála v dávné minulosti. Vzniklý prstenec trosek se dodnes rozpíná a astronomové ho sledují jako přirozenou laboratoř pro studium smrti hvězd.",
    decoys: ["Mlhovina Pilíře stvoření", "Prstence Saturnu", "Galaxie Andromeda"],
  },
  {
    id: "orion-nebula",
    searchQuery: "Orion Nebula star forming region",
    title: "Mlhovina v Orionu",
    year: "dnes",
    hook: "Je to nejbližší 'hvězdná porodnice' k Zemi – a klidně ji najdeš i bez dalekohledu, stačí se podívat na oblohu v zimě.",
    fact: "Celou mlhovinu je možné spatřit pouhým okem jako mlhavou skvrnku v 'meči' souhvězdí Orion.",
    explanation:
      "Mlhovina v Orionu je jednou z nejjasnějších a nejlépe prozkoumaných oblastí tvorby hvězd v celé galaxii. Uvnitř ní se právě teď rodí stovky nových hvězd a planetárních soustav. Je vzdálená 'pouhých' 1 344 světelných let, což z ní dělá oblíbený cíl jak pro profesionální teleskopy, tak pro amatérské astronomy.",
    decoys: ["Mlhovina Koňská hlava", "Jupiterův měsíc Io", "Komety Halleyova"],
  },
];
