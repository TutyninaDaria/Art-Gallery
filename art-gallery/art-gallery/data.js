// Kurátorovaná databáze slavných obrazů.
// Appka za běhu dotáhne skutečný obrázek z Wikimedia Commons podle "searchQuery"
// (všechny obrazy níže jsou staré a volně dostupné veřejné dílo / public domain).
// Texty (hook/fact/explanation) jsou napsané ručně, aby appka nepůsobila jako učebnice.

const SPACE_IMAGES = [
  {
    id: "starry-night",
    searchQuery: "Vincent van Gogh Starry Night 1889 painting",
    title: "Hvězdná noc",
    year: "1889",
    hook: "Van Gogh tenhle obraz namaloval z paměti, přes mříže okna – díval se totiž z psychiatrické léčebny.",
    fact: "Vířivé obloze se říká 'turbulentní proudění' a fyzici dodnes zkoumají, proč tak přesně kopíruje matematické vzorce skutečné turbulence vzduchu.",
    explanation:
      "Van Gogh namaloval Hvězdnou noc během pobytu v léčebně Saint-Paul-de-Mausole poté, co si uřízl ucho. Výhled z okna cely ho inspiroval k nočnímu pohledu na vesnici pod vířící oblohou plnou hvězd a měsíce. Za svého života obraz prakticky nikdo neocenil – dnes visí v newyorském MoMA a je jedním z nejznámějších obrazů světa.",
    decoys: ["Křik", "Polibek", "Velká vlna u Kanagawy"],
  },
  {
    id: "sunflowers",
    searchQuery: "Vincent van Gogh Sunflowers 1888 painting",
    title: "Slunečnice",
    year: "1888",
    hook: "Namaloval je jako dárek na uvítanou pro kamaráda – ten se ale nakonec s Van Goghem pohádal tak silně, že to skončilo useknutým uchem.",
    fact: "Van Gogh namaloval celkem 7 verzí Slunečnic, dvě z nich jsou dnes nezvěstné – jedna shořela při bombardování za druhé světové války.",
    explanation:
      "Obraz vznikl jako výzdoba pokoje pro malíře Paula Gauguina, kterého Van Gogh pozval do Arles ve Francii, aby spolu založili umělecké společenství. Jejich soužití ale skončilo katastrofálně – po prudké hádce si Van Gogh v návalu krize uřízl část ucha. Slunečnice se přesto staly jedním z jeho nejoblíbenějších a nejdražších motivů.",
    decoys: ["Snídaně na trávě", "Dívka s perlou", "Americká gotika"],
  },
  {
    id: "the-scream",
    searchQuery: "Edvard Munch The Scream 1893 painting",
    title: "Křik",
    year: "1893",
    hook: "Autor tvrdil, že postava na obraze vlastně nekřičí – křik slyší odjinud a zoufale si zakrývá uši.",
    fact: "Existují 4 verze tohoto obrazu a jedna z nich byla dvakrát ukradena ze dvou různých muzeí.",
    explanation:
      "Edvard Munch popsal, že obraz vznikl po procházce, při které náhle pocítil 'nekonečný křik pronikající přírodou' a oblohu kolem viděl zbarvenou do krvavě červena. Dílo je považováno za jeden z nejranějších a nejvlivnějších výrazů existenciální úzkosti v umění a stalo se ikonou moderního pocitu odcizení.",
    decoys: ["Hvězdná noc", "Zrození Venuše", "Noční hlídka"],
  },
  {
    id: "the-kiss",
    searchQuery: "Gustav Klimt The Kiss 1908 painting",
    title: "Polibek",
    year: "1908",
    hook: "Zlato na obraze není jen barva – Klimtův otec byl rytec zlata a syn tuhle techniku použil doslova.",
    fact: "Na vytvoření zlatého efektu použil Klimt skutečné plátky zlata a stříbra, podobně jako u byzantských mozaik, které ho inspirovaly.",
    explanation:
      "Polibek pochází z tzv. Klimtova 'zlatého období', kdy umělec experimentoval s plátkovým zlatem inspirovaným benátskými a byzantskými mozaikami, které viděl při cestách po Itálii. Obraz zachycuje pár splývající v objetí na okraji květinové louky a dodnes patří mezi nejreprodukovanější umělecká díla na světě.",
    decoys: ["Křik", "Dívka s perlou", "Velká vlna u Kanagawy"],
  },
  {
    id: "mona-lisa",
    searchQuery: "Leonardo da Vinci Mona Lisa painting Louvre",
    title: "Mona Lisa",
    year: "1503-1519",
    hook: "Nejslavnější obraz světa se proslavil hlavně díky tomu, že ho v roce 1911 někdo ukradl.",
    fact: "Po krádeži a dvouletém pátrání byl obraz nalezen u italského zloděje, který ho měl schovaný pod postelí – chtěl ho 'vrátit Itálii'.",
    explanation:
      "Leonardo da Vinci maloval portrét pravděpodobně florentské obchodnické manželky Lisy Gherardini a pracoval na něm léta, obraz nikdy oficiálně nedokončil a vzal si ho s sebou až do Francie. Světovou slávu ale obraz získal paradoxně až po krádeži z pařížského Louvru v roce 1911, o které psaly noviny po celém světě.",
    decoys: ["Dívka s perlou", "Americká gotika", "Zrození Venuše"],
  },
  {
    id: "girl-with-pearl-earring",
    searchQuery: "Johannes Vermeer Girl with a Pearl Earring painting",
    title: "Dívka s perlou",
    year: "1665",
    hook: "Nikdo neví, kdo na obraze skutečně je – říká se jí proto 'severní Mona Lisa'.",
    fact: "To, co vypadá jako drahá perla, bylo pravděpodobně jen vyleštěné sklo nebo cín – takové šperky si Vermeerova rodina mohla dovolit.",
    explanation:
      "Na rozdíl od klasického portrétu nejde o zakázkový obraz konkrétní objednané osoby, ale o tzv. 'tronie' – studii tváře a výrazu, populární žánr v nizozemském malířství 17. století. Totožnost dívky zůstává záhadou dodnes, což jen přiživuje kouzlo obrazu.",
    decoys: ["Mona Lisa", "Polibek", "Slunečnice"],
  },
  {
    id: "great-wave",
    searchQuery: "Katsushika Hokusai The Great Wave off Kanagawa painting",
    title: "Velká vlna u Kanagawy",
    year: "1831",
    hook: "V pozadí vlny je malá hora – a právě ta, ne vlna, byla původně hlavním tématem celé série.",
    fact: "Obraz je vlastně jeden z 36 dřevořezů s názvem '36 pohledů na horu Fudži' – vlna měla jen rámovat posvátnou horu v pozadí.",
    explanation:
      "Hokusai vytvořil tento dřevořez jako součást série zobrazující horu Fudži z různých úhlů. Obří vlna ohrožující rybářské lodě symbolizovala sílu přírody v kontrastu s věčnou, nehybnou horou. Dílo později výrazně ovlivnilo evropské umělce, včetně Van Gogha a Moneta, a stalo se jedním z nejznámějších japonských uměleckých děl vůbec.",
    decoys: ["Hvězdná noc", "Noční hlídka", "Zrození Venuše"],
  },
  {
    id: "water-lilies",
    searchQuery: "Claude Monet Water Lilies painting",
    title: "Lekníny",
    year: "1896-1926",
    hook: "Monet namaloval přes 250 verzí stejného rybníčku – a byl to rybníček na jeho vlastní zahradě.",
    fact: "Některé z posledních obrazů maloval, když byl kvůli šedému zákalu téměř slepý – a přesto jsou dnes jedny z nejceněnějších.",
    explanation:
      "Monet si ve svém domě v Giverny nechal vybudovat vodní zahradu s japonským mostkem a lekníny, kterou pak desítky let maloval ve stovkách variací podle světla, počasí a ročního období. Série Leknínů dnes patří k vrcholům impresionismu a předznamenala směřování k abstraktnímu umění.",
    decoys: ["Velká vlna u Kanagawy", "Slunečnice", "Dívka s perlou"],
  },
  {
    id: "impression-sunrise",
    searchQuery: "Claude Monet Impression Sunrise 1872 painting",
    title: "Imprese, východ slunce",
    year: "1872",
    hook: "Jeden posměšný kritik si z názvu tohoto obrazu vystřelil – a nechtěně tím pojmenoval celé umělecké hnutí.",
    fact: "Slovo 'impresionismus' vzniklo jako urážka – kritik napsal, že obraz je jen 'dojem', ne skutečné dílo.",
    explanation:
      "Monet namaloval ranní mlhu nad přístavem v Le Havre rychlými, nedokončeně působícími tahy štětce, které měly zachytit prchavý dojem světla spíš než přesné detaily. Kritik Louis Leroy obraz zesměšnil slovem 'impression' (dojem) – umělci kolem Moneta si ale termín osvojili a vznikl tak impresionismus, jeden z nejvlivnějších uměleckých směrů v historii.",
    decoys: ["Lekníny", "Křik", "Noční hlídka"],
  },
  {
    id: "persistence-of-memory",
    searchQuery: "Salvador Dali The Persistence of Memory painting melting clocks",
    title: "Trvalost paměti",
    year: "1931",
    hook: "Rozteklé hodiny jsou prý inspirované táním kousku sýra Camembert, co Dalí pozoroval na stole po večeři.",
    fact: "Celý obraz je menší, než si lidé myslí – na výstavách bývá návštěvníky překvapení, protože měří jen asi 24 × 33 cm.",
    explanation:
      "Salvador Dalí tvrdil, že obraz namaloval na základě 'paranoidně-kritické metody' – technice, při které se snažil zachytit obrazy ze svého podvědomí podobné snům. Rozpité hodiny symbolizují relativitu a plynutí času, mravenci na jedněch z nich odkazují na rozklad a smrt. Dílo se stalo jednou z nejznámějších ikon surrealismu.",
    decoys: ["Guernica", "Americká gotika", "Polibek"],
  },
  {
    id: "guernica",
    searchQuery: "Pablo Picasso Guernica 1937 painting",
    title: "Guernica",
    year: "1937",
    hook: "Obraz namaloval jako reakci na bombardování, o kterém se dozvěděl z novin – trvalo mu to necelý měsíc.",
    fact: "Obraz je obrovský – přes 3,4 metru na výšku a 7,8 metru na délku, takže v realitě zabere skoro celou stěnu místnosti.",
    explanation:
      "Picasso namaloval Guernicu jako reakci na bombardování stejnojmenného baskického města německou a italskou armádou během španělské občanské války. Černobílá kompozice plná zkřivených těl lidí a zvířat se stala jedním z nejsilnějších protiválečných symbolů v historii umění a dodnes visí v madridském muzeu Reina Sofía.",
    decoys: ["Trvalost paměti", "Křik", "Zrození Venuše"],
  },
  {
    id: "birth-of-venus",
    searchQuery: "Sandro Botticelli The Birth of Venus painting Uffizi",
    title: "Zrození Venuše",
    year: "1485",
    hook: "Bohyně na lastuře nestojí tak, jak by to umožnovalo lidské tělo – anatomie je schválně 'špatně', aby póza vypadala elegantněji.",
    fact: "Jde o jeden z prvních velkých renesančních obrazů, na kterém je zobrazena nahá postava v životní velikosti mimo náboženský kontext.",
    explanation:
      "Botticelli zobrazil bohyni lásky Venuši, jak se rodí z mořské pěny a připlouvá na lastuře ke břehu. Obraz čerpá z antické mytologie a stal se symbolem italské renesance a návratu k ideálům klasického umění po staletích převážně náboženské tvorby. Dodnes visí ve florentské galerii Uffizi.",
    decoys: ["Mona Lisa", "Velká vlna u Kanagawy", "Noční hlídka"],
  },
  {
    id: "night-watch",
    searchQuery: "Rembrandt The Night Watch painting Rijksmuseum",
    title: "Noční hlídka",
    year: "1642",
    hook: "Obraz se vlastně vůbec neodehrává v noci – jen během staletí tak ztmavl od vrstev špinavého laku, že si lidé mysleli, že jde o noční scénu.",
    fact: "Při restaurování v 19. století zjistili odborníci, že obraz byl kdysi větší – při přestěhování ho v 18. století prostě ořízli, aby se vešel na zeď.",
    explanation:
      "Rembrandt namaloval skupinový portrét amsterdamské občanské gardy v nezvykle dynamické kompozici plné pohybu a světelných kontrastů, místo tehdy obvyklého strnulého řazení postav do řady. Název 'Noční hlídka' vznikl omylem až později, kvůli ztmavlému laku. Dnes je obraz centrálním exponátem amsterdamského Rijksmusea a prošel i několika útoky vandalů.",
    decoys: ["Velká vlna u Kanagawy", "Zrození Venuše", "Hvězdná noc"],
  },
  {
    id: "creation-of-adam",
    searchQuery: "Michelangelo Creation of Adam Sistine Chapel ceiling fresco",
    title: "Stvoření Adama",
    year: "1512",
    hook: "Michelangelo prý tuhle fresku maloval vleže na zádech na lešení, celé roky, s barvou kapající do obličeje.",
    fact: "Prostor mezi prsty Boha a Adama má svůj vlastní název – říká se mu 'Boží jiskra' a je jedním z nejparodovanějších detailů v dějinách umění.",
    explanation:
      "Freska je součástí stropní výzdoby Sixtinské kaple ve Vatikánu a zobrazuje biblický okamžik, kdy Bůh vdechuje život prvnímu člověku. Michelangelo na stropě pracoval několik let v nesmírně náročných podmínkách a dílo dodnes patří k vrcholům renesančního umění a je jedním z nejnavštěvovanějších uměleckých děl na světě.",
    decoys: ["Zrození Venuše", "Guernica", "Polibek"],
  },
  {
    id: "american-gothic",
    searchQuery: "Grant Wood American Gothic 1930 painting",
    title: "Americká gotika",
    year: "1930",
    hook: "Pár na obraze nejsou manželé, jak si lidé běžně myslí – malíř použil jako modely svou sestru a svého zubaře.",
    fact: "Vidlemi na obraze se inspirovala i dekorace domu v pozadí – malíř chtěl, aby se tvar vidlí opakoval v detailech okna.",
    explanation:
      "Grant Wood namaloval obraz podle skutečného domu ve stylu 'karpentýrská gotika' v Iowě a k postavám použil svou sestru Nan a svého zubaře jako modely pro fiktivního farmáře a jeho dceru. Dílo se stalo jednou z nejparodovanějších ikon americké kultury a je často mylně vykládáno jako kritika maloměstského života, ačkoliv sám autor tvrdil, že ho maloval s náklonností.",
    decoys: ["Dívka s perlou", "Mona Lisa", "Trvalost paměti"],
  },
];
