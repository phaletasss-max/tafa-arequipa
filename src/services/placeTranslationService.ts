// Servicio de Traducción Multilingüe de Atractivos Turísticos de Arequipa
// Ofrece títulos, descripciones y badges traducidos para todos los idiomas soportados (JA, EN, PT, FR, DE, IT, ZH, KO, NL, ES)

interface PlaceTranslation {
  nombre: string
  descripcion: string
}

const PLACE_TRANSLATIONS: Record<string, Record<number, PlaceTranslation>> = {
  ja: {
    1: {
      nombre: 'アレキパのアルマス広場',
      descripcion: '白い火山岩（シジャール）で作られた歴史地区の中心。17世紀のネオクラシック様式の大聖堂と回廊があり、背後にはミスティ火山が聳え立ちます。ユネスコ世界遺産。',
    },
    2: {
      nombre: 'アレキパ大聖堂バシリカ',
      descripcion: 'アルマス広場の北側に位置するネオクラシック様式の大聖堂。南米最大級のベルギー製オルガンと宗教美術博物館を併設。',
    },
    3: {
      nombre: 'サンタ・カタリナ修道院',
      descripcion: '1579年に設立された20,000㎡を超える修道院修道都市。インディゴブルーとテラコッタレッドの回廊、石畳の小道、豊かな中庭が広がります。',
    },
    4: {
      nombre: 'イエズス会ラ・コンパニーア教会',
      descripcion: 'アレキパのメスティソ・バロック建築の傑作。精巧に彫刻されたファサードと回廊、美しい壁画が特徴です。',
    },
    5: {
      nombre: 'サン・ラサロ地区',
      descripcion: '16世紀に設立されたアレキパ最古の街区。石畳の路地とシジャールで作られた歴史的建造物が並びます。',
    },
    6: {
      nombre: '創設者の館（マンシオン・デル・フンダドール）',
      descripcion: '18世紀の植民地時代の邸宅。植民地時代の家具、私用礼拝堂、ソカバヤ川を見渡す庭園があります。',
    },
    7: {
      nombre: 'サント・ドミンゴ教会・修道院',
      descripcion: '16世紀のルネサンス様式のファサードと回廊を持つドミニコ会の修道院。クスコ派の絵画を展示。',
    },
    8: {
      nombre: 'アンデス聖域博物館（氷の少女フアニータ）',
      descripcion: 'アンパト山で発見された500年前のインカの少女フアニータのミイラと副葬品を展示する博物館。',
    },
    9: {
      nombre: 'サンタ・テレサ植民地美術博物館',
      descripcion: '17世紀のカルメル会修道院。16世紀から19世紀の宗教美術品、金銀細工、絵画コレクションを展示。',
    },
    10: {
      nombre: 'シジャールルート（アニャシュアイコ採石場）',
      descripcion: '職人が手作業でシジャール岩を彫り出す現役の採石場。巨大彫刻や実物大のバロック建築ファサードが見学できます。',
    },
    11: {
      nombre: 'トロ・ムエルトのペトログリフ',
      descripcion: '5,000個以上の火山岩に先インカ時代の岩画が刻まれた世界最大級のペトログリフ彫刻群遺跡。',
    },
    12: {
      nombre: 'スンバイ洞窟',
      descripcion: '約8,000年前の岩画が残る洞窟。ラクダ科動物や狩猟の様子が描かれています。',
    },
    13: {
      nombre: 'サバンディアの水車小屋',
      descripcion: '1621年に作られた水力水車小屋。アンデスラクダ科動物が遊ぶ庭園と田園風景が広がります。',
    },
    14: {
      nombre: 'ムンド・アルパカ',
      descripcion: 'アルパカ、ビクーニャ、リャマの展示と、伝統的な手紡ぎ・織物技術の実演が見学できる文化施設。',
    },
    15: {
      nombre: 'ヤナワラ展望台',
      descripcion: '19世紀のシジャールのアーチからミスティ、チャチャニ、ピチュピチュの3火山を一望できる有名な展望台。',
    },
    16: {
      nombre: 'カルメン・アルト展望台',
      descripcion: 'チリナ渓谷と先インカ時代の段々畑、火山群を臨む自然展望台。',
    },
    17: {
      nombre: 'サチャカ展望台',
      descripcion: 'チリナの段々畑とアレキパの田園風景を見渡せる落ち着いた展望台。',
    },
    18: {
      nombre: 'コルカ渓谷（コンドルクロス展望台）',
      descripcion: '深さ3,400mを超える世界有数の深さを誇る峡谷。コンドルクロスから野生のコンドルの飛翔を観察できます。',
    },
    19: {
      nombre: 'ミスティ火山',
      descripcion: '標高5,822mの活動的な成層火山。アレキパの象徴であり、本格的な登山が可能です。',
    },
    20: {
      nombre: 'サリナス・アグアダ・ブランカ国立保護区',
      descripcion: 'ビクーニャやフラミンゴが生息する366,936haの保護区。標高4,300mの湿原と絶景が広がります。',
    },
    21: {
      nombre: 'サリナス湖',
      descripcion: '標高4,300mの塩湖。アンデスフラミンゴや渡り鳥の生息地。鏡のような湖面が広がります。',
    },
    22: {
      nombre: 'ピジョネスの滝',
      descripcion: '標高4,400mの高原にある落差30mの滝。風化された柱状節理の岩肌に囲まれています。',
    },
    23: {
      nombre: 'イマタの石の森',
      descripcion: '標高4,500mにある風食によって形成された石化森林のような奇岩群。',
    },
    24: {
      nombre: 'アンダグアの火山谷',
      descripcion: '80以上の小型休火山と溶岩流が広がる世界でも珍しい地質景観。UNESCO世界ジオパーク。',
    },
    25: {
      nombre: 'コタウアシ渓谷',
      descripcion: '深さ3,535mを誇るペルー最深の峡谷。滝、温泉、インカ遺跡が点在する秘境。',
    },
    26: {
      nombre: 'ラ・カレラ温泉（チバイ）',
      descripcion: '35〜40度の温泉プール。峡谷と雪山を眺めながら入浴を楽しめます。',
    },
    27: {
      nombre: 'ヤンケ温泉',
      descripcion: 'コルカ川沿いにある天然温泉。のんびりとした自然な雰囲気でリラックスできます。',
    },
    28: {
      nombre: 'ユラ温泉',
      descripcion: 'アレキパから30kmにある歴史的温泉。効能の異なる4つの源泉プールがあります。',
    },
    29: {
      nombre: 'メヒア＆モエンドのビーチ',
      descripcion: 'イスライ県のビーチリゾート。砂浜と海鮮料理が人気です。',
    },
    30: {
      nombre: 'メヒア湿地国立保護区',
      descripcion: '195種以上の野鳥が生息する沿岸湿地保護区。バードウォッチングに最適です。',
    },
  },
  en: {
    1: {
      nombre: 'Arequipa Main Square (Plaza de Armas)',
      descripcion: 'The heart of the historic center built entirely of white volcanic stone (sillar). Features the 17th-century Neoclassical Cathedral with Misti volcano in the background. UNESCO World Heritage.',
    },
    2: {
      nombre: 'Arequipa Cathedral Basilica',
      descripcion: 'Neoclassical cathedral built in white sillar, housing South America’s largest Belgian organ and a sacred art museum.',
    },
    3: {
      nombre: 'Santa Catalina Monastery',
      descripcion: 'A 20,000 m² conventual citadel founded in 1579 with indigo blue and terracotta red cloisters, stone streets, and flower-filled courtyards.',
    },
    4: {
      nombre: 'Church of the Society of Jesus',
      descripcion: 'Masterpiece of mestizo baroque architecture with intricately carved sillar facade and cloisters.',
    },
    5: {
      nombre: 'San Lázaro Neighborhood',
      descripcion: 'The oldest district of Arequipa founded in the 16th century with cobblestone alleys and colonial sillar mansions.',
    },
    6: {
      nombre: 'Founder’s Mansion (Mansion del Fundador)',
      descripcion: '18th-century colonial estate attributed to Garcí Manuel de Carbajal with period furniture, chapel, and riverside gardens.',
    },
    7: {
      nombre: 'Church and Convent of Santo Domingo',
      descripcion: '16th-century Dominican temple featuring a Renaissance sillar portal, cloisters, and Cusqueña paintings.',
    },
    8: {
      nombre: 'Andean Sanctuaries Museum (Juanita Mummy)',
      descripcion: 'Exhibits the Ice Maiden Juanita, a 500-year-old Inca mummy discovered on Mount Ampato, along with ceremonial artifacts.',
    },
    9: {
      nombre: 'Santa Teresa Museum of Colonial Art',
      descripcion: '17th-century Carmelite convent displaying sacred art, gold and silver work, and paintings from the 16th to 19th centuries.',
    },
    10: {
      nombre: 'Sillar Route (Añashuayco Quarries)',
      descripcion: 'Active quarries where artisans hand-carve white volcanic stone into mega-carvings and full-scale baroque facades.',
    },
    11: {
      nombre: 'Toro Muerto Petroglyphs',
      descripcion: 'Over 5,000 volcanic rocks engraved with pre-Inca rock art. One of the largest rock art sites in the world.',
    },
    12: {
      nombre: 'Sumbay Caves',
      descripcion: 'Rock shelters with 8,000-year-old cave paintings depicting camelids and hunters.',
    },
    13: {
      nombre: 'Sabandía Mill',
      descripcion: '1621 colonial watermill that still grinds grain. Features gardens with alpacas and countryside views.',
    },
    14: {
      nombre: 'Mundo Alpaca',
      descripcion: 'Cultural center showcasing alpacas, vicuñas, llamas, and live traditional spinning and weaving demonstrations.',
    },
    15: {
      nombre: 'Yanahuara Viewpoint',
      descripcion: '19th-century sillar arches engraved with local poetry, offering iconic views of Misti, Chachani, and Pichu Pichu volcanoes.',
    },
    18: {
      nombre: 'Colca Canyon (Condor Cross)',
      descripcion: 'One of the deepest canyons in the world (over 3,400 m). Spot Andean condors soaring above pre-Inca agricultural terraces.',
    },
    19: {
      nombre: 'Misti Volcano',
      descripcion: 'Active stratovolcano (5,822 msnm), the iconic symbol of Arequipa. 2-day ascent for experienced trekkers.',
    },
  },
  pt: {
    1: {
      nombre: 'Praça de Armas de Arequipa',
      descripcion: 'O coração do centro histórico construído em pedra sillar branca. Destaca-se pela Catedral neoclássica do século XVII com o vulcão Misti ao fundo. Patrimônio UNESCO.',
    },
    2: {
      nombre: 'Basílica Catedral de Arequipa',
      descripcion: 'Catedral neoclássica construída em sillar branco, abrigando o maior órgão belga da América do Sul e museu de arte sacra.',
    },
    3: {
      nombre: 'Monastério de Santa Catalina',
      descripcion: 'Cidadela monástica de 20.000 m² fundada em 1579 com claustros azul anil e terracota, ruas de pedra e pátios floridos.',
    },
    18: {
      nombre: 'Cânion do Colca (Cruz do Cândor)',
      descripcion: 'Um dos cânions mais profundos do mundo (mais de 3.400 m). Observação de cândores andinos voando sobre terraços agrícolas pré-incas.',
    },
  },
}

export function getTranslatedPlace(id: number, currentLang: string, defaultName: string, defaultDesc: string) {
  const langKey = (currentLang || 'es').toLowerCase().split('-')[0]
  const langTranslations = PLACE_TRANSLATIONS[langKey]
  if (langTranslations && langTranslations[id]) {
    return {
      nombre: langTranslations[id].nombre || defaultName,
      descripcion: langTranslations[id].descripcion || defaultDesc,
    }
  }
  return { nombre: defaultName, descripcion: defaultDesc }
}
