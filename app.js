const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const sheet = document.querySelector("#skinSheet");
const classSheet = document.querySelector("#classSheet");
const menuSheet = document.querySelector("#menuSheet");
const menuIconBag = document.querySelector("#menuIconBag");
const menuIconBook = document.querySelector("#menuIconBook");
const menuIconGrimoire = document.querySelector("#menuIconGrimoire");
const skillSheet = document.querySelector("#skillSheet");
const npcSheet = document.querySelector("#npcSheet");
const mapArt = document.querySelector("#mapArt");
const oklaomaCentralMap = document.querySelector("#oklaomaCentralMap");
const oklaomaAtlas = document.querySelector("#oklaomaAtlas");
const equipmentSheet = document.querySelector("#equipmentSheet");
const oklaomaInteriorSheet = document.querySelector("#oklaomaInteriorSheet");
const oklaomaMonsterSheet = document.querySelector("#oklaomaMonsterSheet");
const menuReferenceSheet = new Image();
menuReferenceSheet.src = "assets/menu.png";
menuReferenceSheet.addEventListener("load", () => renderMenuIcons());
[
  menuIconBag,
  menuIconBook,
  menuIconGrimoire
].forEach((image) => image?.addEventListener("load", () => renderMenuIcons()));
const oklaomaImageMap = {
  "0,0": oklaomaCentralMap,
  "0,-1": document.querySelector("#oklaomaNorthMap"),
  "1,0": document.querySelector("#oklaomaEastMap"),
  "0,1": document.querySelector("#oklaomaSouthMap"),
  "-1,0": document.querySelector("#oklaomaWestMap"),
  "1,-1": document.querySelector("#oklaomaNorthEastMap"),
  "1,1": document.querySelector("#oklaomaSouthEastMap"),
  "-1,1": document.querySelector("#oklaomaSouthWestMap"),
  "-1,-1": document.querySelector("#oklaomaNorthWestMap")
};
const accountAvatar = document.querySelector("#accountAvatar");
const accountCtx = accountAvatar.getContext("2d");
const encounterPanel = document.querySelector("#encounterPanel");
const encounterAvatar = document.querySelector("#encounterAvatar");
const encounterCtx = encounterAvatar.getContext("2d");
const dialogPanel = document.querySelector("#dialogPanel");
const dialogAvatar = document.querySelector("#dialogAvatar");
const dialogAvatarCtx = dialogAvatar.getContext("2d");
const dialogActions = document.querySelector("#dialogActions");
const skillList = document.querySelector("#skillList");
const skillUpgradeList = document.querySelector("#skillUpgradeList");
const statList = document.querySelector("#statList");
const logList = document.querySelector("#log");
const floatingCombatLog = document.querySelector("#floatingCombatLog");

const heroes = [
  { name: "Aventurier de Valombre", role: "Skin universel jusqu'au niveau 5." }
];

const map = { cols: 20, rows: 14, tile: 42, offsetX: 0, offsetY: 0 };
const interior = { cols: 12, rows: 16 };
const oklaomaInterior = { cols: 12, rows: 16 };

const skills = [
  { id: "classAttack", level: 1, icon: "A", name: "Attaque novice", desc: "Attaque de classe", damage: 10, cooldown: 0 },
  { id: "heal", level: 2, icon: "H", name: "Soin doux", desc: "Restaure 28 PV", heal: 28, cooldown: 3 },
  { id: "boost", level: 3, icon: "B", name: "Courage", desc: "+8 degats, 3 tours", boost: 8, cooldown: 5 },
  { id: "weapon", level: 5, icon: "A", name: "Frappe armee", desc: "Attaque forte", damage: 28, cooldown: 2 },
  { id: "ulti", level: 10, icon: "U", name: "Eclat royal", desc: "Gros degats", damage: 70, cooldown: 8 }
];

const classSkillSets = {
  guerrier: {
    classAttack: { name: "Entaille courte", desc: "Force: coup d'epee stable", damage: 12 },
    heal: { name: "Second souffle", desc: "Recupere 24 PV par endurance", heal: 24, cooldown: 3 },
    boost: { name: "Cri de guerre", desc: "+10 degats, 3 tours", boost: 10, cooldown: 5 },
    weapon: { name: "Brise-garde", desc: "Grande frappe a l'epee", damage: 34, cooldown: 2 },
    ulti: { name: "Jugement du Muikana", desc: "Enorme frappe de force", damage: 82, cooldown: 8 }
  },
  archer: {
    classAttack: { name: "Tir rapide", desc: "Dexterite: fleche precise", damage: 11 },
    heal: { name: "Baume sylvain", desc: "Restaure 22 PV", heal: 22, cooldown: 3 },
    boost: { name: "Oeil de faucon", desc: "+8 degats et precision", boost: 8, cooldown: 4 },
    weapon: { name: "Fleche perce-armure", desc: "Tir puissant a l'arc", damage: 32, cooldown: 2 },
    ulti: { name: "Pluie de Kalyptus", desc: "Salve de fleches", damage: 76, cooldown: 7 }
  },
  moine: {
    classAttack: { name: "Onde du baton", desc: "Sagesse: frappe canalisee", damage: 10 },
    heal: { name: "Priere de jouvence", desc: "Restaure 34 PV", heal: 34, cooldown: 3 },
    boost: { name: "Meditation ferme", desc: "+7 degats, 4 tours", boost: 7, cooldown: 5 },
    weapon: { name: "Paume sereine", desc: "Frappe spirituelle", damage: 30, cooldown: 2 },
    ulti: { name: "Sanctuaire interieur", desc: "Onde sacrale", damage: 68, cooldown: 7 }
  },
  magicien: {
    classAttack: { name: "Etincelle arcanique", desc: "Puissance: projectile magique", damage: 13 },
    heal: { name: "Rune de soin", desc: "Restaure 26 PV", heal: 26, cooldown: 3 },
    boost: { name: "Surcharge mana", desc: "+12 degats, 3 tours", boost: 12, cooldown: 6 },
    weapon: { name: "Lance de givre", desc: "Sort elementaire fort", damage: 36, cooldown: 2 },
    ulti: { name: "Comete astrale", desc: "Explosion arcanique", damage: 90, cooldown: 9 }
  },
  assassin: {
    classAttack: { name: "Coup sournois", desc: "Dexterite: dague rapide", damage: 12 },
    heal: { name: "Fiole obscure", desc: "Restaure 20 PV", heal: 20, cooldown: 3 },
    boost: { name: "Voile nocturne", desc: "+11 degats, 3 tours", boost: 11, cooldown: 5 },
    weapon: { name: "Estoc d'Atlantid", desc: "Attaque critique", damage: 35, cooldown: 2 },
    ulti: { name: "Danse des ombres", desc: "Rafale de dagues", damage: 84, cooldown: 8 }
  }
};

const outside = {
  cemetery: [
    { x: 2, y: 2, type: "skull" },
    { x: 3, y: 2, type: "cross" },
    { x: 2, y: 3, type: "skull" },
    { x: 4, y: 3, type: "cross" }
  ],
  rocks: [
    { x: 17, y: 2 }, { x: 18, y: 3 }, { x: 16, y: 10 }, { x: 5, y: 12 }
  ],
  grass: [
    { x: 6, y: 3 }, { x: 9, y: 2 }, { x: 10, y: 10 }, { x: 13, y: 11 }, { x: 18, y: 8 }
  ],
  lake: { x: 14, y: 10, w: 6, h: 4 },
  building: { x: 10, y: 2, w: 7, h: 5, doorX: 12, doorY: 5, wrapX: 12, wrapY: 6 },
  npcs: [
    { x: 14, y: 8, name: "Vieux sage", role: "quest" },
    { x: 0, y: 12, name: "Garde d'Oklaoma", role: "gateGuard" }
  ],
  monsters: [
    { id: 1, x: 8, y: 11, name: "Sanglier sombre", maxHp: 82, hp: 82, xp: 18, drop: "Defense sombre", respawnAt: 0 },
    { id: 2, x: 8, y: 11, name: "Sanglier sombre", maxHp: 82, hp: 82, xp: 18, drop: "Defense sombre", respawnAt: 0 },
    { id: 3, x: 8, y: 11, name: "Sanglier sombre", maxHp: 82, hp: 82, xp: 18, drop: "Defense sombre", respawnAt: 0 },
    { id: 4, x: 8, y: 11, name: "Sanglier sombre", maxHp: 82, hp: 82, xp: 18, drop: "Defense sombre", respawnAt: 0 },
    { id: 5, x: 10, y: 11, name: "Sanglier sombre", maxHp: 82, hp: 82, xp: 18, drop: "Defense sombre", respawnAt: 0 },
    { id: 6, x: 10, y: 11, name: "Sanglier sombre", maxHp: 82, hp: 82, xp: 18, drop: "Defense sombre", respawnAt: 0 },
    { id: 7, x: 11, y: 12, name: "Sanglier sombre", maxHp: 82, hp: 82, xp: 18, drop: "Defense sombre", respawnAt: 0 },
    { id: 8, x: 9, y: 10, name: "Sanglier sombre", maxHp: 82, hp: 82, xp: 18, drop: "Defense sombre", respawnAt: 0 }
  ]
};

const neighborDeltas = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1]
];

const indoorNpcs = [
  { x: 4, y: 10, name: "Borin le Vendeur", role: "vendor" },
  { x: 7, y: 10, name: "Mira l'Alchimiste", role: "mira" }
];

const oklaomaInnNpcs = [
  { x: 5, y: 7, name: "Aubergiste", role: "innkeeper" },
  { x: 8, y: 11, name: "Banquier", role: "banker" }
];

const oklaomaShopNpcs = [
  { x: 5, y: 5, name: "Herboriste", role: "okPotionVendor" },
  { x: 8, y: 11, name: "Armurier", role: "equipmentVendor" }
];

const shopItems = [
  { key: "potionIvresse", label: "Potion d'ivresse", price: 18 },
  { key: "menthe", label: "Menthe", price: 10 }
];

const classes = [
  { key: "guerrier", label: "Guerrier", stat: "force", sprite: 0, spell: "Frappe du Muikana", desc: "Solide au corps a corps, il encaisse et frappe avec constance." },
  { key: "archer", label: "Archer", stat: "dexterite", sprite: 1, spell: "Tir de Kalyptus", desc: "Mobile et precis, il garde ses distances et harcele ses cibles." },
  { key: "moine", label: "Moine", stat: "sagesse", sprite: 2, spell: "Onde de Jouvence", desc: "Equilibre entre discipline, baton et energie vitale." },
  { key: "magicien", label: "Magicien", stat: "puissance", sprite: 3, spell: "Eclat arcanique", desc: "Fragile mais puissant, il canalise des sorts elementaires." },
  { key: "assassin", label: "Assassin", stat: "dexterite", sprite: 4, spell: "Entaille d'Atlantid", desc: "Rapide, discret, specialise dans les coups critiques." }
];

const classWeapons = {
  moine: { name: "Baton de Jouvence", icon: 7, stats: { vitalite: 20, sagesse: 10, puissance: 10 } },
  archer: { name: "Arc de Kalyptus", icon: 6, stats: { vitalite: 10, agilite: 10, dexterite: 10 } },
  magicien: { name: "Baton de Jouvence", icon: 8, stats: { vitalite: 20, sagesse: 10, puissance: 10 } },
  guerrier: { name: "Epee du Muikana", icon: 5, stats: { vitalite: 30, force: 15 } },
  assassin: { name: "Dague d'Atlantid", icon: 9, stats: { vitalite: 20, force: 15, dexterite: 15 } }
};

const equipmentShopItems = [
  { id: "leather-helmet", slot: "helmet", name: "Casque en cuir", price: 35, icon: 0, stats: { vitalite: 8 } },
  { id: "leather-boots", slot: "boots", name: "Bottes en cuir", price: 32, icon: 1, stats: { agilite: 6 } },
  { id: "leather-gloves", slot: "gloves", name: "Gants en cuir", price: 30, icon: 2, stats: { dexterite: 6 } },
  { id: "leather-armor", slot: "armor", name: "Armure en cuir", price: 55, icon: 3, stats: { vitalite: 16 } },
  { id: "leather-pants", slot: "pants", name: "Pantalon en cuir", price: 38, icon: 4, stats: { vitalite: 6, agilite: 4 } },
  { id: "warrior-sword-2", classKey: "guerrier", slot: "weapon", name: "Lame d'Oklaoma", price: 90, icon: 5, stats: { vitalite: 20, force: 24 } },
  { id: "archer-bow-2", classKey: "archer", slot: "weapon", name: "Arc des Pins", price: 90, icon: 6, stats: { agilite: 18, dexterite: 22 } },
  { id: "monk-staff-2", classKey: "moine", slot: "weapon", name: "Baton calme", price: 90, icon: 7, stats: { vitalite: 12, sagesse: 22, puissance: 12 } },
  { id: "mage-staff-2", classKey: "magicien", slot: "weapon", name: "Sceptre bleu", price: 90, icon: 8, stats: { sagesse: 14, puissance: 26 } },
  { id: "assassin-dagger-2", classKey: "assassin", slot: "weapon", name: "Dague noire", price: 90, icon: 9, stats: { force: 14, dexterite: 26 } }
];

const alignments = [
  { key: "royale", label: "Garde Royale", color: "#2e75d4" },
  { key: "exiles", label: "Exiles", color: "#4ea84f" },
  { key: "cartel", label: "Cartel", color: "#c94d43" }
];

const oklaomaMaps = {
  "0,0": { name: "Place d'Oklaoma", level: "Hub", theme: "central", quest: "Marche, fontaines, guildes et routes commerciales." },
  "0,-1": { name: "Bois des Murmures", level: "Zone 3-5", theme: "forest", quest: "Cueillir des herbes et combattre des loups jeunes." },
  "1,-1": { name: "Collines aux Vents", level: "Zone 5-7", theme: "hills", quest: "Chasser les rapaces des hauteurs." },
  "1,0": { name: "Route des Marchands", level: "Zone 4-6", theme: "road", quest: "Escorter une caravane." },
  "1,1": { name: "Marais de Brume", level: "Zone 8-10", theme: "swamp", quest: "Trouver les lanternes perdues." },
  "0,1": { name: "Prairie des Griffes", level: "Zone 6-8", theme: "plain", quest: "Affronter les sangliers d'Oklaoma." },
  "-1,1": { name: "Ruines d'Aster", level: "Zone 10-12", theme: "ruins", quest: "Explorer les pierres anciennes." },
  "-1,0": { name: "Faubourg Ouest", level: "Zone 4-6", theme: "suburb", quest: "Aider les artisans hors des remparts." },
  "-1,-1": { name: "Cimetiere des Pins", level: "Zone 7-9", theme: "graveyard", quest: "Calmer les ames errantes." }
};

const oklaomaMonsters = {
    "0,-1": [
    { x: 7, y: 5, name: "Loup jeune", level: 4, hp: 58, maxHp: 58 },
    { x: 12, y: 8, name: "Loup jeune", level: 4, hp: 58, maxHp: 58 },
    { x: 6, y: 9, name: "Loup jeune", level: 4, hp: 58, maxHp: 58 },
    { x: 14, y: 7, name: "Loup jeune", level: 5, hp: 64, maxHp: 64 }
  ],
  "1,-1": [
    { x: 10, y: 4, name: "Rapace des vents", level: 6, hp: 74, maxHp: 74 },
    { x: 14, y: 6, name: "Rapace des vents", level: 6, hp: 74, maxHp: 74 },
    { x: 8, y: 9, name: "Rapace des vents", level: 7, hp: 82, maxHp: 82 }
  ],
  "1,0": [
    { x: 14, y: 8, name: "Bandit de route", level: 50, hp: 840, maxHp: 840 },
    { x: 12, y: 5, name: "Bandit de route", level: 50, hp: 840, maxHp: 840 },
    { x: 16, y: 7, name: "Bandit de route", level: 50, hp: 840, maxHp: 840 }
  ],
  "1,1": [
    { x: 9, y: 9, name: "Vaseux brumeux", level: 40, hp: 690, maxHp: 690 },
    { x: 9, y: 9, name: "Vaseux brumeux", level: 40, hp: 690, maxHp: 690 },
    { x: 15, y: 6, name: "Vaseux brumeux", level: 40, hp: 690, maxHp: 690 },
    { x: 15, y: 6, name: "Vaseux brumeux", level: 40, hp: 690, maxHp: 690 },
    { x: 8, y: 10, name: "Vaseux brumeux", level: 40, hp: 690, maxHp: 690 },
     { x: 8, y: 10, name: "Vaseux brumeux", level: 40, hp: 690, maxHp: 690 },
      { x: 8, y: 10, name: "Vaseux brumeux", level: 40, hp: 690, maxHp: 690 }
  ],
  "0,1": [
    { x: 8, y: 7, name: "Sanglier d'Oklaoma", level: 30, hp: 580, maxHp: 580 },
    { x: 11, y: 7, name: "Sanglier d'Oklaoma", level: 30, hp: 580, maxHp: 580 },
    { x: 13, y: 9, name: "Sanglier d'Oklaoma", level: 30, hp: 580, maxHp: 580 },
    { x: 7, y: 10, name: "Sanglier d'Oklaoma", level: 30, hp: 570, maxHp: 580 }
  ],
  "-1,1": [
    { x: 6, y: 8, name: "Gardien des ruines", level: 20, hp: 450, maxHp: 450 },
    { x: 12, y: 6, name: "Gardien des ruines", level: 20, hp: 450, maxHp: 450 },
     { x: 12, y: 6, name: "Gardien des ruines", level: 20, hp: 450, maxHp: 450 },
      { x: 12, y: 6, name: "Gardien des ruines", level: 20, hp: 450, maxHp: 450 },
    { x: 9, y: 10, name: "Gardien des ruines", level: 20, hp: 450, maxHp: 450 },
    { x: 9, y: 10, name: "Gardien des ruines", level: 20, hp: 450, maxHp: 450 },
    { x: 9, y: 10, name: "Gardien des ruines", level: 20, hp: 450, maxHp: 450 }
  ],
  "-1,0": [
    { x: 5, y: 6, name: "Rat des faubourgs", level: 10, hp: 200, maxHp: 200 },
    { x: 5, y: 6, name: "Rat des faubourgs", level: 10, hp: 200, maxHp: 200 },
    { x: 9, y: 8, name: "Rat des faubourgs", level: 10, hp: 200, maxHp: 200 },
     { x: 9, y: 8, name: "Rat des faubourgs", level: 10, hp: 200, maxHp: 200 },
    { x: 13, y: 6, name: "Rat des faubourgs", level: 10, hp: 200, maxHp: 200 },
    { x: 13, y: 6, name: "Rat des faubourgs", level: 10, hp: 200, maxHp: 200 },
    { x: 13, y: 6, name: "Rat des faubourgs", level: 10, hp: 200, maxHp: 200 }, 
    { x: 13, y: 6, name: "Rat des faubourgs", level: 10, hp: 200, maxHp: 200 }
  ],
  "-1,-1": [
    { x: 9, y: 6, name: "Ame errante", level: 18, hp: 350, maxHp: 350 },
    { x: 9, y: 6, name: "Ame errante", level: 18, hp: 350, maxHp: 350 },
    { x: 9, y: 6, name: "Ame errante", level: 18, hp: 350, maxHp: 350 },
    { x: 13, y: 8, name: "Ame errante", level: 18, hp: 350, maxHp: 350 },
    { x: 13, y: 8, name: "Ame errante", level: 18, hp: 350, maxHp: 350 },
    { x: 7, y: 10, name: "Ame errante", level: 18, hp: 350, maxHp: 350 },
    { x: 7, y: 10, name: "Ame errante", level: 18, hp: 350, maxHp: 350 }
  ]
};

const oklaomaNpcs = {
  "0,-1": [{ x: 5, y: 8, name: "Sylve", role: "okQuest", questKey: "forest" }],
  "1,-1": [{ x: 13, y: 8, name: "Rolan", role: "okQuest", questKey: "hills" }],
  "1,0": [{ x: 5, y: 6, name: "Maelle", role: "okQuest", questKey: "road" }],
  "1,1": [{ x: 12, y: 5, name: "Nerio", role: "okQuest", questKey: "swamp" }],
  "0,1": [{ x: 6, y: 5, name: "Pavel", role: "okQuest", questKey: "plain" }],
  "-1,1": [{ x: 13, y: 9, name: "Isha", role: "okQuest", questKey: "ruins" }],
  "-1,0": [{ x: 8, y: 4, name: "Toma", role: "okQuest", questKey: "suburb" }],
  "-1,-1": [{ x: 11, y: 8, name: "Noe", role: "okQuest", questKey: "graveyard" }],
  "0,0": [{ x: 10, y: 5, name: "Intendante", role: "okFinal" }]
};

const oklaomaQuestDefs = {
  forest: { title: "Peaux de loups", target: "Loup jeune", needed: 2, rewardXp: 60 },
  hills: { title: "Plumes des hauteurs", target: "Rapace des vents", needed: 1, rewardXp: 70 },
  road: { title: "Route sure", target: "Bandit de route", needed: 1, rewardXp: 65 },
  swamp: { title: "Brume vivante", target: "Vaseux brumeux", needed: 1, rewardXp: 100 },
  plain: { title: "Sangliers sauvages", target: "Sanglier d'Oklaoma", needed: 2, rewardXp: 90 },
  ruins: { title: "Pierre gardienne", target: "Gardien des ruines", needed: 1, rewardXp: 140 },
  suburb: { title: "Rats des ateliers", target: "Rat des faubourgs", needed: 2, rewardXp: 55 },
  graveyard: { title: "Ames errantes", target: "Ame errante", needed: 1, rewardXp: 110 }
};

const oklaomaBuildingEntrances = [
  { x: 3, y: 6, type: "inn", label: "Auberge" },
  { x: 16, y: 6, type: "shop", label: "Boutique" }
];

const makeBlockSet = (items) => new Set(items.map(([x, y]) => `${x},${y}`));
const rectBlocks = (x, y, w, h, gaps = []) => {
  const gapSet = makeBlockSet(gaps);
  const blocks = [];
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (!gapSet.has(`${xx},${yy}`)) blocks.push([xx, yy]);
    }
  }
  return blocks;
};

const oklaomaInteriorBlocks = {
  oklaomaInn: makeBlockSet([
    [1, 1], [2, 1], [3, 1], [8, 1], [9, 1], [10, 1],
    [2, 2], [3, 2], [5, 2], [6, 2], [8, 2], [9, 2],
    [2, 3], [3, 3], [5, 3], [6, 3], [8, 3], [9, 3],
    [4, 6], [5, 6], [6, 6], [1, 9], [2, 9],
    [1, 10], [2, 10], [6, 10], [7, 10], [8, 10], [9, 10],
    [6, 12], [7, 12], [8, 12], [9, 12], [10, 12], [1, 14], [10, 14]
  ]),
  oklaomaShop: makeBlockSet([
    [1, 1], [2, 1], [3, 1], [5, 1], [8, 1], [9, 1], [10, 1],
    [1, 2], [2, 2], [3, 2], [8, 2], [9, 2], [10, 2],
    [1, 4], [2, 4], [6, 5], [7, 5], [8, 5],
    [1, 9], [2, 9], [3, 9], [7, 9], [8, 9], [9, 9], [10, 9],
    [2, 10], [3, 10], [7, 10], [10, 10], [2, 12], [3, 12], [8, 12], [9, 12],
    [1, 13], [2, 13], [10, 13]
  ])
};

const oklaomaMapBlocks = {
  "0,0": makeBlockSet([
    ...rectBlocks(1, 1, 5, 5),
    ...rectBlocks(14, 1, 5, 5),
    [2, 11], [3, 11], [4, 11], [15, 11], [16, 11], [17, 11],
    [7, 4], [12, 4], [7, 9], [12, 9]
  ]),
  "0,-1": makeBlockSet([
    ...rectBlocks(0, 1, 3, 4), ...rectBlocks(16, 2, 3, 4),
    [4, 3], [7, 5], [13, 4], [16, 9], [3, 10], [6, 10], [14, 10]
  ]),
  "1,-1": makeBlockSet([
    ...rectBlocks(4, 3, 3, 3), ...rectBlocks(12, 7, 4, 3),
    [9, 3], [16, 5], [4, 10], [15, 10]
  ]),
  "1,0": makeBlockSet([
    [6, 5], [7, 5], [15, 4], [10, 5], [10, 8],
    ...rectBlocks(16, 9, 3, 3)
  ]),
  "1,1": makeBlockSet([
    ...rectBlocks(4, 4, 4, 3), ...rectBlocks(11, 7, 4, 3),
    [16, 4], [5, 8], [6, 8], [13, 5]
  ]),
  "0,1": makeBlockSet([
    [4, 10], [16, 9], [13, 7], [5, 5],
    ...rectBlocks(14, 10, 4, 3)
  ]),
  "-1,1": makeBlockSet([
    ...rectBlocks(5, 4, 2, 3), ...rectBlocks(10, 7, 3, 2),
    ...rectBlocks(14, 5, 2, 3), [7, 10], [4, 9]
  ]),
  "-1,0": makeBlockSet([
    ...rectBlocks(4, 4, 3, 3), [11, 7], [12, 7], [8, 6],
    ...rectBlocks(15, 2, 3, 4)
  ]),
  "-1,-1": makeBlockSet([
    [5, 4], [8, 5], [12, 7], [15, 4],
    ...rectBlocks(2, 2, 3, 3), ...rectBlocks(13, 8, 4, 3)
  ])
};

const state = {
  playerName: "Testeur d'Aldoria",
  area: "outside",
  oklaomaMap: { x: 0, y: 0 },
  player: { x: 4, y: 5 },
  pa: 999,
  pm: 999,
  hp: 100,
  maxHp: 100,
  gold: 34,
  xp: 0,
  level: 1,
  drops: 0,
  quest: "available",
  quest2: "locked",
  classQuest: "locked",
  gateQuest: "locked",
  chosenClass: null,
  chosenClassKey: null,
  alignment: null,
  statPoints: 0,
  skillPoints: 0,
  skillLevels: {
    classAttack: 1,
    heal: 1,
    boost: 1,
    weapon: 1,
    ulti: 1
  },
  oklaomaQuests: {},
  finalOklaomaQuest: "locked",
  stats: {
    vitalite: 10,
    force: 5,
    agilite: 5,
    dexterite: 5,
    sagesse: 5,
    puissance: 5
  },
  equipment: {
    weapon: null,
    helmet: null,
    boots: null,
    gloves: null,
    armor: null,
    pants: null
  },
  gear: [],
  inventory: {
    defenseSombre: 0,
    potionIvresse: 0,
    menthe: 0
  },
  skin: 0,
  sprites: [],
  classSprites: [],
  menuIcons: [],
  skillIcons: [],
  npcSprites: [],
  equipmentIcons: [],
  targetId: null,
  lastDamage: "Aucune cible",
  boostTurns: 0,
  boostDamage: 0,
  cooldowns: {}
};

const accountStorageKey = "aldoriaAccountsV1";
const saveFields = [
  "playerName", "area", "oklaomaMap", "player", "pa", "pm", "hp", "maxHp", "gold",
  "xp", "level", "drops", "quest", "quest2", "classQuest", "gateQuest",
  "chosenClass", "chosenClassKey", "alignment", "statPoints", "skillPoints",
  "skillLevels", "oklaomaQuests", "finalOklaomaQuest", "stats", "equipment",
  "gear", "inventory", "skin", "targetId", "lastDamage", "boostTurns",
  "boostDamage", "cooldowns"
];
const defaultSaveState = saveStateSnapshot();
let currentAccountKey = null;

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function saveStateSnapshot() {
  const snapshot = {};
  saveFields.forEach((field) => {
    snapshot[field] = cloneData(state[field]);
  });
  return snapshot;
}

function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(accountStorageKey)) || {};
  } catch {
    return {};
  }
}

function writeAccounts(accounts) {
  localStorage.setItem(accountStorageKey, JSON.stringify(accounts));
}

function accountKey(name) {
  return name.trim().toLowerCase();
}

function setLoginStatus(message) {
  document.querySelector("#loginStatus").textContent = message;
}

function applySaveData(saveData) {
  const merged = { ...cloneData(defaultSaveState), ...(saveData || {}) };
  saveFields.forEach((field) => {
    state[field] = cloneData(merged[field]);
  });
  state.sprites = state.sprites || [];
  state.classSprites = state.classSprites || [];
  state.menuIcons = state.menuIcons || [];
  state.skillIcons = state.skillIcons || [];
  state.npcSprites = state.npcSprites || [];
  state.equipmentIcons = state.equipmentIcons || [];
}

function saveCurrentAccount() {
  if (!currentAccountKey) return;
  const accounts = loadAccounts();
  if (!accounts[currentAccountKey]) return;
  accounts[currentAccountKey].save = saveStateSnapshot();
  accounts[currentAccountKey].name = state.playerName;
  accounts[currentAccountKey].savedAt = new Date().toISOString();
  writeAccounts(accounts);
}

function finishAuth(key, account, message) {
  currentAccountKey = key;
  applySaveData(account.save);
  state.playerName = account.name;
  document.querySelector("#loginForm").classList.add("is-hidden");
  document.querySelector("#accountCard").classList.remove("is-hidden");
  document.body.classList.add("is-authenticated");
  addLog(message);
  updateUi();
  drawPortrait();
  draw();
}

function xpNeed(level = state.level) {
  return 60 + (level - 1) * 40;
}

function addLog(message) {
  const li = document.createElement("li");
  li.textContent = message;
  logList.prepend(li);
  while (logList.children.length > 6) logList.lastElementChild.remove();
}

function addFloatingLog(message) {
  const toast = document.createElement("div");
  toast.className = "combat-toast";
  toast.textContent = message;
  floatingCombatLog.prepend(toast);
  setTimeout(() => toast.remove(), 3000);
}

function addCombatToast(message) {
  addFloatingLog(message);
}

function notify(message) {
  addLog(message);
  addFloatingLog(message);
}

function updateUi() {
  document.querySelector("#paValue").textContent = state.pa;
  document.querySelector("#pmValue").textContent = state.pm;
  document.querySelector("#hpValue").textContent = state.hp;
  document.querySelector("#goldValue").textContent = state.gold;
  document.querySelector("#coords").textContent = `${state.area === "inside" ? "batiment" : "carte"} x ${state.player.x}, y ${state.player.y}`;
  document.querySelector("#heroName").textContent = heroes[state.skin].name;
  document.querySelector("#heroClass").textContent = heroes[state.skin].role;
  document.querySelector("#heroLevel").textContent = `Niveau ${state.level}`;
  document.querySelector("#heroXp").textContent = `${state.xp} / ${xpNeed()} XP`;
  document.querySelector("#xpBar").style.width = `${Math.min(100, (state.xp / xpNeed()) * 100)}%`;
  document.querySelector("#playerHpBar").style.width = `${Math.min(100, (state.hp / state.maxHp) * 100)}%`;
  document.querySelector("#accountName").textContent = state.playerName;
  document.querySelector("#accountLevel").textContent = `Niveau ${state.level}`;
  document.querySelectorAll("[data-move]").forEach((button) => {
    button.disabled = state.pm <= 0;
  });
  updateInventoryUi();
  updateStatsUi();
  updateGameMenuUi();
  updateQuestUi();
  updateEncounterHud();
  renderMenuIcons();
  renderSkills();
  saveCurrentAccount();
}

function updateQuestUi() {
  const stateLabel = document.querySelector("#questState");
  const text = document.querySelector("#questText");
  if (state.quest === "available") {
    stateLabel.textContent = "A prendre";
    text.textContent = "Le vieux sage a besoin de ton aide, va le voir";
  } else if (state.quest === "active") {
    stateLabel.textContent = `${state.drops}/5 drops`;
    text.textContent = "Les sangliers ont l'habitude de passés entre les 2 barriere au sud, pas loin du plan d'eau";
  } else if (state.quest2 === "available") {
    stateLabel.textContent = "Mira";
    text.textContent = "Ramenes les 5 défenses à Mira dans l'Auberge, elle devrait savoir quoi en faire !";
  } else if (state.quest2 === "active") {
    stateLabel.textContent = `${state.inventory.potionIvresse}/3 + ${state.inventory.menthe}/2`;
    text.textContent = "Achete les ingredients chez Borin, puis retourne parler a Mira.";
  } else if (state.quest2 === "deliver") {
    stateLabel.textContent = "Retour Sage";
    text.textContent = "Rapportes l'antidote de Mira au Vieux Sage";
  } else if (state.classQuest === "choose") {
    stateLabel.textContent = "Classe";
    text.textContent = "Parles au Vieux sage et choisis ta classe.";
  } else if (state.gateQuest === "available") {
    stateLabel.textContent = "Garde";
    text.textContent = "Va voir le Garde d'Oklaoma en bas du chemin, face au cimetiere.";
  } else if (state.gateQuest === "alignment") {
    stateLabel.textContent = "Allegeance";
    text.textContent = "Choisis ton alignement: Garde Royale, Exiles ou Cartel.";
  } else if (state.area === "oklaoma") {
    const info = currentOklaomaMap();
    const completed = Object.values(state.oklaomaQuests).filter((quest) => quest === "done").length;
    stateLabel.textContent = `${info.level}`;
    text.textContent = `${info.name}: ${info.quest} (${completed}/8 quetes locales)`;
  } else {
    stateLabel.textContent = "Oklaoma";
    text.textContent = "Tu as rejoint les terres d'Oklaoma.";
  }
}

function updateInventoryUi() {
  document.querySelector("#inventoryGold").textContent = `${state.gold} or`;
  const items = [
    ["Defenses sombres", state.inventory.defenseSombre],
    ["Potions d'ivresse", state.inventory.potionIvresse],
    ["Menthes", state.inventory.menthe],
    ["Potions de vie", state.inventory.potionVie || 0],
    ["Potions de mana", state.inventory.potionMana || 0]
  ].filter(([, count]) => count > 0);
  document.querySelector("#inventoryText").textContent = items.length
    ? items.map(([label, count]) => `${label}: ${count}`).join(" | ")
    : "Aucun objet de quete.";
}

function drawMenuSprite(canvasElement, width = canvasElement.width, height = canvasElement.height) {
  const menuCtx = canvasElement.getContext("2d");
  menuCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const classInfo = currentClass();
  const sprite = classInfo ? state.classSprites[classInfo.sprite] : state.sprites[0];
  if (!sprite) return;
  menuCtx.imageSmoothingEnabled = true;
  menuCtx.imageSmoothingQuality = "high";
  menuCtx.drawImage(sprite, canvasElement.width * 0.18, canvasElement.height * 0.04, width * 0.66, height * 0.90);
}

function updateGameMenuUi() {
  const profileName = document.querySelector("#profileName");
  if (!profileName) return;
  const classLabel = state.chosenClass || "Aventurier";
  profileName.textContent = state.playerName;
  document.querySelector("#profileMeta").textContent = `Niveau ${state.level} - ${classLabel} - ${state.statPoints} points`;
  document.querySelector("#profileXpText").textContent = `${state.xp} / ${xpNeed()} XP`;
  document.querySelector("#profileXpBar").style.width = `${Math.min(100, (state.xp / xpNeed()) * 100)}%`;
  document.querySelector("#profileHpText").textContent = `${state.hp} / ${state.maxHp} PV`;
  document.querySelector("#profileHpBar").style.width = `${Math.min(100, (state.hp / state.maxHp) * 100)}%`;
  drawMenuSprite(document.querySelector("#menuAvatar"));
  drawMenuSprite(document.querySelector("#inventoryAvatar"));
  renderGearSlots();
  renderInventoryGrid();
  renderQuestJournal();
}

function totalStat(key) {
  const base = state.stats[key] || 0;
  const gear = Object.values(state.equipment)
    .reduce((sum, item) => sum + (item?.stats?.[key] || 0), 0);
  return base + gear;
}

function updateStatsUi() {
  document.querySelector("#statPoints").textContent = `${state.statPoints} pts`;
  document.querySelector("#skillPoints").textContent = `${state.skillPoints} pts`;
  statList.innerHTML = "";
  Object.keys(state.stats).forEach((key) => {
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<strong>${labelStat(key)}</strong><span>${totalStat(key)} (${state.stats[key]})</span>`;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "+";
    button.disabled = state.statPoints <= 0;
    button.addEventListener("click", () => {
      if (state.statPoints <= 0) return;
      state.stats[key] += 1;
      state.statPoints -= 1;
      updateUi();
    });
    row.append(button);
    statList.append(row);
  });

  updateSkillUpgradeUi();
}

function renderGearSlots() {
  const gearSlots = document.querySelector("#gearSlots");
  gearSlots.innerHTML = "";
  const slots = [
    ["helmet", "Casque"],
    ["armor", "Armure"],
    ["gloves", "Gants"],
    ["pants", "Pantalon"],
    ["boots", "Bottes"],
    ["weapon", "Arme"]
  ];
  slots.forEach(([slot, label]) => {
    const item = state.equipment[slot];
    const row = document.createElement("div");
    row.className = "gear-slot";
    const icon = document.createElement("canvas");
    icon.width = 38;
    icon.height = 38;
    const iconCtx = icon.getContext("2d");
    if (item) {
      const iconSprite = getEquipmentIcon(item.icon);
      if (iconSprite) iconCtx.drawImage(iconSprite, 0, 0, 38, 38);
    }
    const text = document.createElement("span");
    text.innerHTML = `<strong>${label}</strong><span>${item ? item.name : "Vide"}</span>`;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item ? "Retirer" : "";
    button.disabled = !item;
    button.addEventListener("click", () => {
      if (!state.equipment[slot]) return;
      state.gear.push(state.equipment[slot]);
      state.equipment[slot] = null;
      updateUi();
    });
    row.append(icon, text, button);
    gearSlots.append(row);
  });
}

function renderInventoryGrid() {
  const grid = document.querySelector("#inventoryGrid");
  grid.innerHTML = "";
  const resources = [
    { key: "defenseSombre", label: "Defense sombre", type: "Ressource" },
    { key: "potionIvresse", label: "Potion d'ivresse", type: "Potion" },
    { key: "menthe", label: "Menthe", type: "Ressource" },
    { key: "potionVie", label: "Potion de vie", type: "Potion" },
    { key: "potionMana", label: "Potion de mana", type: "Potion" }
  ].filter((item) => (state.inventory[item.key] || 0) > 0);
  resources.forEach((item) => grid.append(createInventoryResourceCard(item)));
  state.gear.forEach((item) => grid.append(createInventoryEquipmentCard(item)));
  if (resources.length === 0 && state.gear.length === 0) {
    const empty = document.createElement("div");
    empty.className = "inventory-card";
    empty.innerHTML = "<strong>Sac vide</strong><span>Aucun objet non equipe.</span>";
    grid.append(empty);
  }
}

function createInventoryResourceCard(item) {
  const row = document.createElement("div");
  row.className = "inventory-card";
  const icon = document.createElement("canvas");
  icon.width = 38;
  icon.height = 38;
  drawConsumableIcon(icon.getContext("2d"), item.key, 38);
  const text = document.createElement("span");
  text.innerHTML = `<strong>${item.label}</strong><span>${item.type} x${state.inventory[item.key]}</span>`;
  const spacer = document.createElement("span");
  row.append(icon, text, spacer);
  return row;
}

function createInventoryEquipmentCard(item) {
  return createEquipmentRow(item, false);
}

function renderQuestJournal() {
  const journal = document.querySelector("#questJournal");
  journal.innerHTML = "";
  const entries = questEntries();
  const active = entries.filter((entry) => entry.status !== "Terminee").length;
  document.querySelector("#questJournalCount").textContent = `${active} active${active > 1 ? "s" : ""}`;
  entries.forEach((entry) => {
    const item = document.createElement("div");
    item.className = `quest-entry${entry.status === "Terminee" ? " is-done" : ""}`;
    item.innerHTML = `<strong>${entry.title}</strong><small>${entry.status}</small><p>${entry.text}</p>`;
    journal.append(item);
  });
}

function questEntries() {
  const entries = [];
  if (state.quest !== "done") {
    entries.push({
      title: "Les defenses sombres",
      status: state.quest === "available" ? "A prendre" : "En cours",
      text: state.quest === "available" ? "Parler au Vieux sage." : `Rapporter 5 defenses de sanglier sombre (${state.drops}/5).`
    });
  } else {
    entries.push({ title: "Les defenses sombres", status: "Terminee", text: "Le Vieux sage a recu les defenses." });
  }
  if (state.quest2 !== "locked") {
    const done = state.quest2 === "done";
    entries.push({
      title: "Le melange de Mira",
      status: done ? "Terminee" : "En cours",
      text: done ? "Les ingredients ont ete remis." : "Acheter 3 potions d'ivresse et 2 menthes, puis retourner voir Mira."
    });
  }
  if (state.classQuest === "choose") entries.push({ title: "Choisir sa voie", status: "En cours", text: "Choisir une classe aupres du Vieux sage." });
  if (state.gateQuest !== "locked") entries.push({ title: "Les terres d'Oklaoma", status: state.area === "oklaoma" ? "Terminee" : "En cours", text: "Convaincre le Garde d'Oklaoma puis choisir son alignement." });
  Object.entries(oklaomaQuestDefs).forEach(([key, def]) => {
    const status = state.oklaomaQuests[key];
    if (!status) return;
    entries.push({
      title: def.title,
      status: status === "done" ? "Terminee" : "En cours",
      text: status === "done" ? `${def.target} repousses.` : `Eliminer ${def.needed} ${def.target}: ${state.inventory[`ok_${key}`] || 0}/${def.needed}.`
    });
  });
  return entries;
}

function updateSkillUpgradeUi() {
  skillUpgradeList.innerHTML = "";
  skills.forEach((skill, index) => {
    const displaySkill = effectiveSkill(skill);
    const row = document.createElement("div");
    row.className = "skill-upgrade-row";
    const iconCanvas = document.createElement("canvas");
    iconCanvas.width = 42;
    iconCanvas.height = 42;
    const iconCtx = iconCanvas.getContext("2d");
    const icon = getSkillIcon(displaySkill, index);
    if (icon) iconCtx.drawImage(icon, 0, 0, 42, 42);
    const label = document.createElement("span");
    label.innerHTML = `<strong>${displaySkill.name}</strong><small>Niveau ${state.skillLevels[skill.id] || 1} - ${displaySkill.desc}</small>`;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "+";
    button.disabled = state.skillPoints <= 0;
    button.addEventListener("click", () => {
      if (state.skillPoints <= 0) return;
      state.skillPoints -= 1;
      state.skillLevels[skill.id] = (state.skillLevels[skill.id] || 1) + 1;
      updateUi();
    });
    row.append(iconCanvas, label, button);
    skillUpgradeList.append(row);
  });
}

function createEquipmentRow(item, equipped) {
  const row = document.createElement("div");
  row.className = "inventory-card";
  const icon = document.createElement("canvas");
  icon.width = 34;
  icon.height = 34;
  const iconCtx = icon.getContext("2d");
  const iconSprite = getEquipmentIcon(item.icon);
  if (iconSprite) iconCtx.drawImage(iconSprite, 0, 0, 34, 34);
  const text = document.createElement("span");
  text.innerHTML = `<strong>${item.name}</strong><span>${formatItemStats(item.stats)}</span>`;
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = equipped ? "Retirer" : "Equiper";
  button.addEventListener("click", () => {
    if (equipped) {
      state.gear.push(item);
      state.equipment[item.slot || "weapon"] = null;
    } else {
      const slot = item.slot || "weapon";
      if (state.equipment[slot]) state.gear.push(state.equipment[slot]);
      state.equipment[slot] = item;
      state.gear = state.gear.filter((entry) => entry !== item);
    }
    updateUi();
  });
  row.append(icon, text, button);
  return row;
}

function getEquipmentIcon(index) {
  ensureEquipmentIcons();
  return state.equipmentIcons[index] || null;
}

function labelStat(key) {
  return {
    vitalite: "Vitalite",
    force: "Force",
    agilite: "Agilite",
    dexterite: "Dexterite",
    sagesse: "Sagesse",
    puissance: "Puissance"
  }[key] || key;
}

function formatItemStats(stats) {
  return Object.entries(stats)
    .map(([key, value]) => `+${value} ${labelStat(key)}`)
    .join(", ");
}

function normalizeSpawns() {
  const now = Date.now();
  outside.monsters.forEach((monster) => {
    if (monster.hp <= 0 && monster.respawnAt <= now) {
      monster.hp = monster.maxHp;
      monster.respawnAt = 0;
      addLog(`${monster.name} est revenu sur sa case.`);
    }
  });
  Object.values(oklaomaMonsters).flat().forEach((monster) => {
    if (monster.hp <= 0 && monster.respawnAt && monster.respawnAt <= now) {
      monster.hp = monster.maxHp;
      monster.respawnAt = 0;
    }
  });
}

function selectedMonster() {
  normalizeSpawns();
  if (state.area === "oklaoma") return getOklaomaMonsterOnPlayer();
  const targeted = outside.monsters.find((monster) => monster.id === state.targetId && monster.hp > 0);
  if (targeted) return targeted;
  return monstersOnPlayerTile()[0] || null;
}

function monstersOnPlayerTile() {
  if (state.area === "oklaoma") {
    const monster = getOklaomaMonsterOnPlayer();
    return monster ? [monster] : [];
  }
  if (state.area !== "outside") return [];
  return outside.monsters.filter((monster) => (
    monster.hp > 0 &&
    monster.x === state.player.x &&
    monster.y === state.player.y
  ));
}

function updateEncounterHud() {
  const monsters = monstersOnPlayerTile();
  const monster = selectedMonster();
  encounterCtx.clearRect(0, 0, encounterAvatar.width, encounterAvatar.height);

  if (!monster || monsters.length === 0) {
    encounterPanel.classList.add("is-hidden");
    floatingCombatLog.style.bottom = "8px";
    return;
  }

  encounterPanel.classList.remove("is-hidden");
  floatingCombatLog.style.bottom = "82px";
  document.querySelector("#encounterName").textContent = monster.name;
  document.querySelector("#encounterCount").textContent = `${monsters.length} monstre${monsters.length > 1 ? "s" : ""} sur cette case`;
  document.querySelector("#encounterHpBar").style.width = `${Math.max(0, (monster.hp / monster.maxHp) * 100)}%`;
  document.querySelector("#encounterHpText").textContent = `PV: ${monster.hp} / ${monster.maxHp}`;

  if (state.area === "oklaoma") {
    drawOklaomaMonsterAvatar(monster, encounterCtx, encounterAvatar.width, encounterAvatar.height);
    return;
  }

  const sprite = state.sprites[3];
  if (sprite) {
    encounterCtx.imageSmoothingEnabled = true;
    encounterCtx.imageSmoothingQuality = "high";
    encounterCtx.drawImage(sprite, 4, 6, 48, 44);
  }
}

function drawOklaomaMonsterAvatar(monster, targetCtx, width, height) {
  if (drawOklaomaMonsterSprite(monster, targetCtx, 3, 3, width - 6, height - 6)) return;
  targetCtx.save();
  targetCtx.clearRect(0, 0, width, height);
  targetCtx.fillStyle = monsterPalette(monster).bg;
  roundedRectOn(targetCtx, 4, 4, width - 8, height - 8, 14);
  targetCtx.fill();
  targetCtx.translate(width / 2, height / 2 + 2);
  drawOklaomaMonsterShape(monster, targetCtx, Math.min(width, height) * 0.74);
  targetCtx.restore();
}

function monsterSpriteIndex(monster) {
  const name = monster.name.toLowerCase();
  if (name.includes("loup")) return 0;
  if (name.includes("rapace")) return 1;
  if (name.includes("bandit")) return 2;
  if (name.includes("vaseux")) return 3;
  if (name.includes("sanglier")) return 4;
  if (name.includes("gardien")) return 5;
  if (name.includes("rat")) return 6;
  if (name.includes("ame")) return 7;
  return 4;
}

function drawOklaomaMonsterSprite(monster, targetCtx, x, y, width, height) {
  if (!oklaomaMonsterSheet?.complete || oklaomaMonsterSheet.naturalWidth === 0) return false;
  const index = monsterSpriteIndex(monster);
  const frameW = oklaomaMonsterSheet.naturalWidth / 4;
  const frameH = oklaomaMonsterSheet.naturalHeight / 2;
  const sx = (index % 4) * frameW;
  const sy = Math.floor(index / 4) * frameH;
  targetCtx.clearRect(x, y, width, height);
  targetCtx.imageSmoothingEnabled = true;
  targetCtx.imageSmoothingQuality = "high";
  targetCtx.drawImage(oklaomaMonsterSheet, sx, sy, frameW, frameH, x, y, width, height);
  return true;
}

function roundedRectOn(targetCtx, x, y, width, height, radius) {
  targetCtx.beginPath();
  targetCtx.moveTo(x + radius, y);
  targetCtx.lineTo(x + width - radius, y);
  targetCtx.quadraticCurveTo(x + width, y, x + width, y + radius);
  targetCtx.lineTo(x + width, y + height - radius);
  targetCtx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  targetCtx.lineTo(x + radius, y + height);
  targetCtx.quadraticCurveTo(x, y + height, x, y + height - radius);
  targetCtx.lineTo(x, y + radius);
  targetCtx.quadraticCurveTo(x, y, x + radius, y);
}

function monsterPalette(monster) {
  const name = monster.name.toLowerCase();
  if (name.includes("loup")) return { body: "#74665a", accent: "#d6d0c4", dark: "#3e342e", bg: "#d7e2c7" };
  if (name.includes("rapace")) return { body: "#9a7247", accent: "#e8d8a9", dark: "#3d2b1e", bg: "#d8e7ef" };
  if (name.includes("bandit")) return { body: "#6b4d3d", accent: "#c75f43", dark: "#30231f", bg: "#ead7b0" };
  if (name.includes("vaseux")) return { body: "#6f9b82", accent: "#b6d2a3", dark: "#3f6350", bg: "#cce1d4" };
  if (name.includes("sanglier")) return { body: "#8a5d43", accent: "#e3c89a", dark: "#3e281d", bg: "#e5d6b8" };
  if (name.includes("gardien")) return { body: "#7f817c", accent: "#c7c0a9", dark: "#454641", bg: "#ddd8c2" };
  if (name.includes("rat")) return { body: "#76685f", accent: "#d2a08b", dark: "#3c302b", bg: "#d8d2c4" };
  if (name.includes("ame")) return { body: "#98b4c9", accent: "#e7f3ff", dark: "#58758d", bg: "#d8e4ee" };
  return { body: "#855a43", accent: "#e9d4b7", dark: "#3e2d25", bg: "#e6dac5" };
}

function drawOklaomaMonsterShape(monster, targetCtx, size) {
  const colors = monsterPalette(monster);
  const name = monster.name.toLowerCase();
  targetCtx.lineWidth = Math.max(2, size * 0.05);
  targetCtx.strokeStyle = colors.dark;
  targetCtx.fillStyle = "rgba(45,35,25,0.20)";
  targetCtx.beginPath();
  targetCtx.ellipse(0, size * 0.32, size * 0.38, size * 0.10, 0, 0, Math.PI * 2);
  targetCtx.fill();

  if (name.includes("rapace")) {
    targetCtx.fillStyle = colors.body;
    targetCtx.beginPath();
    targetCtx.moveTo(0, -size * 0.34);
    targetCtx.lineTo(size * 0.38, size * 0.02);
    targetCtx.lineTo(size * 0.10, size * 0.02);
    targetCtx.lineTo(size * 0.08, size * 0.30);
    targetCtx.lineTo(-size * 0.08, size * 0.30);
    targetCtx.lineTo(-size * 0.10, size * 0.02);
    targetCtx.lineTo(-size * 0.38, size * 0.02);
    targetCtx.closePath();
    targetCtx.fill();
    targetCtx.stroke();
    targetCtx.fillStyle = colors.accent;
    targetCtx.beginPath();
    targetCtx.arc(size * 0.09, -size * 0.12, size * 0.05, 0, Math.PI * 2);
    targetCtx.arc(-size * 0.09, -size * 0.12, size * 0.05, 0, Math.PI * 2);
    targetCtx.fill();
    return;
  }

  if (name.includes("vaseux") || name.includes("ame")) {
    targetCtx.globalAlpha = name.includes("ame") ? 0.82 : 1;
    targetCtx.fillStyle = colors.body;
    targetCtx.beginPath();
    targetCtx.ellipse(0, 0, size * 0.32, size * 0.38, 0, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.stroke();
    targetCtx.fillStyle = colors.accent;
    targetCtx.beginPath();
    targetCtx.arc(-size * 0.10, -size * 0.05, size * 0.04, 0, Math.PI * 2);
    targetCtx.arc(size * 0.10, -size * 0.05, size * 0.04, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.globalAlpha = 1;
    return;
  }

  if (name.includes("gardien")) {
    targetCtx.fillStyle = colors.body;
    targetCtx.fillRect(-size * 0.26, -size * 0.28, size * 0.52, size * 0.55);
    targetCtx.strokeRect(-size * 0.26, -size * 0.28, size * 0.52, size * 0.55);
    targetCtx.fillStyle = colors.accent;
    targetCtx.fillRect(-size * 0.14, -size * 0.12, size * 0.28, size * 0.10);
    return;
  }

  if (name.includes("bandit")) {
    targetCtx.fillStyle = colors.body;
    targetCtx.beginPath();
    targetCtx.arc(0, -size * 0.20, size * 0.15, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.stroke();
    targetCtx.fillRect(-size * 0.16, -size * 0.02, size * 0.32, size * 0.36);
    targetCtx.strokeRect(-size * 0.16, -size * 0.02, size * 0.32, size * 0.36);
    targetCtx.fillStyle = colors.accent;
    targetCtx.fillRect(-size * 0.22, -size * 0.28, size * 0.44, size * 0.10);
    return;
  }

  targetCtx.fillStyle = colors.body;
  targetCtx.beginPath();
  targetCtx.ellipse(0, size * 0.04, size * 0.36, size * 0.25, 0, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.stroke();
  targetCtx.beginPath();
  targetCtx.arc(size * 0.24, -size * 0.03, size * 0.18, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.stroke();
  targetCtx.fillStyle = colors.accent;
  targetCtx.beginPath();
  targetCtx.moveTo(size * 0.30, -size * 0.12);
  targetCtx.lineTo(size * 0.47, -size * 0.25);
  targetCtx.lineTo(size * 0.40, -size * 0.02);
  targetCtx.closePath();
  targetCtx.fill();
  if (name.includes("loup")) {
    targetCtx.fillStyle = colors.dark;
    targetCtx.beginPath();
    targetCtx.moveTo(size * 0.14, -size * 0.18);
    targetCtx.lineTo(size * 0.22, -size * 0.36);
    targetCtx.lineTo(size * 0.30, -size * 0.14);
    targetCtx.fill();
  }
  if (name.includes("rat")) {
    targetCtx.strokeStyle = colors.accent;
    targetCtx.beginPath();
    targetCtx.moveTo(-size * 0.32, size * 0.08);
    targetCtx.quadraticCurveTo(-size * 0.58, size * 0.14, -size * 0.50, -size * 0.05);
    targetCtx.stroke();
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function tileBounds() {
  const width = canvas.clientWidth || 980;
  const height = canvas.clientHeight || 700;
  const okRoom = isOklaomaInteriorArea();
  const inRoom = state.area === "inside" || okRoom;
  const cols = okRoom ? oklaomaInterior.cols : inRoom ? interior.cols : map.cols;
  const rows = okRoom ? oklaomaInterior.rows : inRoom ? interior.rows : map.rows;
  const topReserve = 6;
  const visibleRows = rows;
  const compactLandscape = window.innerWidth <= 980 && window.innerHeight <= 560 && window.innerWidth > window.innerHeight;
  const fullscreenMap = !compactLandscape && !inRoom;
  const fitTile = Math.floor(Math.min((width - 26) / cols, (height - topReserve - 10) / visibleRows));
  const widthFillTile = Math.floor((width - 12) / cols);
  const tile = fullscreenMap ? widthFillTile : fitTile;
  const minTile = compactLandscape ? 14 : 20;
  const maxTile = compactLandscape ? 36 : fullscreenMap ? 72 : 64;
  map.tile = Math.max(minTile, Math.min(maxTile, tile));
  if (fullscreenMap) {
    map.offsetX = 6;
    const mapHeight = visibleRows * map.tile;
    const centeredOnPlayer = Math.round(height * 0.56 - (state.player.y + 0.5) * map.tile);
    map.offsetY = clamp(centeredOnPlayer, height - mapHeight - 6, topReserve);
  } else {
    map.offsetX = Math.round((width - cols * map.tile) / 2);
    map.offsetY = Math.round(topReserve + (height - topReserve - visibleRows * map.tile) / 2);
  }
  return { cols, rows };
}

function isOklaomaInteriorArea() {
  return state.area === "oklaomaInn" || state.area === "oklaomaShop";
}

function tileToPx(x, y) {
  return {
    x: map.offsetX + x * map.tile,
    y: map.offsetY + y * map.tile
  };
}

function draw() {
  normalizeSpawns();
  const width = canvas.clientWidth || 980;
  const height = canvas.clientHeight || 700;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#cfe8a2";
  ctx.fillRect(0, 0, width, height);

  const { cols, rows } = tileBounds();
  if (state.area === "oklaoma") drawOklaoma(cols, rows);
  else if (state.area === "oklaomaInn") drawOklaomaInterior(cols, rows, "Auberge d'Oklaoma", oklaomaInnNpcs);
  else if (state.area === "oklaomaShop") drawOklaomaInterior(cols, rows, "Boutique d'Oklaoma", oklaomaShopNpcs);
  else if (state.area === "inside") drawInterior(cols, rows);
  else drawOutside(cols, rows);
}

function drawOklaomaInterior(cols, rows, title, npcs) {
  if (!drawOklaomaInteriorImage(cols, rows)) {
    drawRoom(cols, rows);
    drawOklaomaInteriorDecor(state.area);
  }
  drawInteriorTitle(title);
  drawInteriorExitWrap();
  npcs.forEach(drawNpc);
  drawNeighborHighlights();
  drawPlayer();
  drawGrid(cols, rows);
}

function drawOklaomaInteriorImage(cols, rows) {
  if (!oklaomaInteriorSheet?.complete || oklaomaInteriorSheet.naturalWidth === 0) return false;
  const panelWidth = oklaomaInteriorSheet.naturalWidth / 2;
  const sx = state.area === "oklaomaShop" ? panelWidth : 0;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  try {
    ctx.drawImage(
      oklaomaInteriorSheet,
      sx,
      0,
      panelWidth,
      oklaomaInteriorSheet.naturalHeight,
      map.offsetX,
      map.offsetY,
      cols * map.tile,
      rows * map.tile
    );
  } catch (error) {
    return false;
  }
  return true;
}

function drawOklaomaInteriorDecor(type) {
  if (type === "oklaomaInn") {
    drawBed(1, 2, "#b85f45");
    drawBed(9, 2, "#476aa5");
    drawChest(8, 5);
    drawPlant(2, 5);
    drawPlant(9, 5);
    drawCounter(4, 4, 4, "#8d623e");
    drawLedger(7, 4);
    return;
  }

  drawCounter(1, 2, 3, "#73513a");
  drawPotionRack(8, 2);
  drawAnvil(2, 5);
  drawCrate(3, 5);
  drawForge(8, 5);
  drawWeaponRack(9, 5);
}

function drawBed(x, y, blanket) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#76533a";
  roundedRect(px.x + 4, px.y + 4, map.tile * 2 - 8, map.tile * 1.4, 8);
  ctx.fill();
  ctx.fillStyle = "#f4e3c0";
  roundedRect(px.x + 9, px.y + 8, map.tile * 0.62, map.tile * 0.42, 7);
  ctx.fill();
  ctx.fillStyle = blanket;
  roundedRect(px.x + map.tile * 0.72, px.y + 9, map.tile * 1.12, map.tile * 1.04, 8);
  ctx.fill();
}

function drawChest(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#7b4e2f";
  roundedRect(px.x + 7, px.y + 12, map.tile * 1.5, map.tile * 0.72, 8);
  ctx.fill();
  ctx.fillStyle = "#caa44b";
  ctx.fillRect(px.x + map.tile * 0.66, px.y + map.tile * 0.42, map.tile * 0.18, map.tile * 0.18);
  ctx.strokeStyle = "rgba(48,32,20,0.35)";
  ctx.strokeRect(px.x + 7, px.y + 12, map.tile * 1.5, map.tile * 0.72);
}

function drawPlant(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#8b5a3e";
  ctx.fillRect(px.x + map.tile * 0.32, px.y + map.tile * 0.58, map.tile * 0.36, map.tile * 0.24);
  ctx.fillStyle = "#4f8b52";
  ctx.beginPath();
  ctx.arc(px.x + map.tile * 0.50, px.y + map.tile * 0.42, map.tile * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6bad5f";
  ctx.beginPath();
  ctx.arc(px.x + map.tile * 0.36, px.y + map.tile * 0.48, map.tile * 0.15, 0, Math.PI * 2);
  ctx.arc(px.x + map.tile * 0.64, px.y + map.tile * 0.48, map.tile * 0.15, 0, Math.PI * 2);
  ctx.fill();
}

function drawCounter(x, y, w, color) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "rgba(65,42,28,0.22)";
  ctx.fillRect(px.x + 6, px.y + 10, map.tile * w, map.tile * 0.64);
  ctx.fillStyle = color;
  roundedRect(px.x, px.y + 6, map.tile * w, map.tile * 0.66, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fillRect(px.x + 8, px.y + 12, map.tile * w - 16, 4);
}

function drawLedger(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#ead8af";
  roundedRect(px.x + map.tile * 0.22, px.y + map.tile * 0.18, map.tile * 0.55, map.tile * 0.34, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(89,60,38,0.35)";
  ctx.beginPath();
  ctx.moveTo(px.x + map.tile * 0.50, px.y + map.tile * 0.20);
  ctx.lineTo(px.x + map.tile * 0.50, px.y + map.tile * 0.50);
  ctx.stroke();
}

function drawPotionRack(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#76533a";
  roundedRect(px.x + 4, px.y + 5, map.tile * 3 - 8, map.tile * 1.25, 8);
  ctx.fill();
  [["#cf5f5f", 0.35], ["#6097cf", 0.75], ["#72b56d", 1.15], ["#d0b45f", 1.55], ["#9b6cc9", 1.95]].forEach(([color, ox]) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px.x + map.tile * ox, px.y + map.tile * 0.62, map.tile * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(px.x + map.tile * ox - 3, px.y + map.tile * 0.50, 4, 4);
  });
}

function drawAnvil(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#5d6266";
  ctx.beginPath();
  ctx.moveTo(px.x + map.tile * 0.15, px.y + map.tile * 0.38);
  ctx.lineTo(px.x + map.tile * 0.80, px.y + map.tile * 0.38);
  ctx.lineTo(px.x + map.tile * 0.68, px.y + map.tile * 0.58);
  ctx.lineTo(px.x + map.tile * 0.38, px.y + map.tile * 0.58);
  ctx.lineTo(px.x + map.tile * 0.32, px.y + map.tile * 0.80);
  ctx.lineTo(px.x + map.tile * 0.55, px.y + map.tile * 0.80);
  ctx.lineTo(px.x + map.tile * 0.48, px.y + map.tile * 0.58);
  ctx.closePath();
  ctx.fill();
}

function drawCrate(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#9d6a3e";
  ctx.fillRect(px.x + 8, px.y + 9, map.tile - 16, map.tile - 15);
  ctx.strokeStyle = "rgba(59,38,24,0.36)";
  ctx.beginPath();
  ctx.moveTo(px.x + 10, px.y + 11);
  ctx.lineTo(px.x + map.tile - 10, px.y + map.tile - 8);
  ctx.moveTo(px.x + map.tile - 10, px.y + 11);
  ctx.lineTo(px.x + 10, px.y + map.tile - 8);
  ctx.stroke();
}

function drawForge(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#6d5d50";
  roundedRect(px.x + 4, px.y + 4, map.tile * 1.5, map.tile * 1.1, 8);
  ctx.fill();
  ctx.fillStyle = "#d76b37";
  ctx.beginPath();
  ctx.arc(px.x + map.tile * 0.75, px.y + map.tile * 0.58, map.tile * 0.26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2c466";
  ctx.beginPath();
  ctx.arc(px.x + map.tile * 0.75, px.y + map.tile * 0.58, map.tile * 0.13, 0, Math.PI * 2);
  ctx.fill();
}

function drawWeaponRack(x, y) {
  const px = tileToPx(x, y);
  ctx.strokeStyle = "#6f4b30";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(px.x + 10, px.y + map.tile * 0.78);
  ctx.lineTo(px.x + map.tile - 8, px.y + map.tile * 0.28);
  ctx.moveTo(px.x + 17, px.y + map.tile * 0.26);
  ctx.lineTo(px.x + map.tile - 12, px.y + map.tile * 0.72);
  ctx.stroke();
  ctx.fillStyle = "#c9c3b0";
  ctx.fillRect(px.x + map.tile * 0.62, px.y + map.tile * 0.26, map.tile * 0.10, map.tile * 0.42);
}

function drawInteriorTitle(title) {
  const px = tileToPx(1, 1);
  ctx.fillStyle = "rgba(255, 248, 218, 0.88)";
  roundedRect(px.x, px.y, map.tile * 4.4, map.tile * 0.9, 10);
  ctx.fill();
  ctx.fillStyle = "#5a3d2a";
  ctx.font = `bold ${Math.max(14, map.tile * 0.28)}px Georgia`;
  ctx.fillText(title, px.x + 8, px.y + map.tile * 0.55);
}

function drawInteriorExitWrap() {
  const exit = currentInteriorExit();
  const px = tileToPx(exit.x, exit.y);
  ctx.fillStyle = "rgba(255, 236, 154, 0.82)";
  ctx.fillRect(px.x + 5, px.y + 5, map.tile - 10, map.tile - 10);
  ctx.strokeStyle = "rgba(104, 72, 31, 0.86)";
  ctx.lineWidth = 2;
  ctx.strokeRect(px.x + 6, px.y + 6, map.tile - 12, map.tile - 12);
  ctx.fillStyle = "rgba(72, 49, 28, 0.64)";
  ctx.beginPath();
  ctx.moveTo(px.x + map.tile * 0.50, px.y + map.tile * 0.72);
  ctx.lineTo(px.x + map.tile * 0.28, px.y + map.tile * 0.42);
  ctx.lineTo(px.x + map.tile * 0.44, px.y + map.tile * 0.42);
  ctx.lineTo(px.x + map.tile * 0.44, px.y + map.tile * 0.22);
  ctx.lineTo(px.x + map.tile * 0.56, px.y + map.tile * 0.22);
  ctx.lineTo(px.x + map.tile * 0.56, px.y + map.tile * 0.42);
  ctx.lineTo(px.x + map.tile * 0.72, px.y + map.tile * 0.42);
  ctx.closePath();
  ctx.fill();
}

function currentInteriorExit() {
  return isOklaomaInteriorArea() ? { x: 5, y: 15 } : { x: 5, y: 7 };
}

function drawOutside(cols, rows) {
  drawDetailedMapBackground(cols, rows);
  drawInteractionWrap();
  drawOutsideNpcs();
  drawVisibleEncounter();
  drawNeighborHighlights();
  drawPlayer();
  drawGrid(cols, rows);
}

function drawDetailedMapBackground(cols, rows) {
  const width = cols * map.tile;
  const height = rows * map.tile;
  if (mapArt.complete && mapArt.naturalWidth > 0) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    try {
      ctx.drawImage(mapArt, map.offsetX, map.offsetY, width, height);
    } catch (error) {
      drawGrassGrid(cols, rows);
      drawLake();
      drawPath();
      drawCemetery();
      drawLargeBuilding();
      outside.rocks.forEach(drawRock);
      outside.grass.forEach(drawGrassTuft);
      return;
    }
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(map.offsetX, map.offsetY, width, height);
    return;
  }

  drawGrassGrid(cols, rows);
  drawLake();
  drawPath();
  drawCemetery();
  drawLargeBuilding();
  outside.rocks.forEach(drawRock);
  outside.grass.forEach(drawGrassTuft);
}

function drawInteractionWrap() {
  const b = outside.building;
  const px = tileToPx(b.wrapX, b.wrapY);
  ctx.fillStyle = "rgba(255, 236, 154, 0.78)";
  ctx.fillRect(px.x + 4, px.y + 4, map.tile - 8, map.tile - 8);
  ctx.strokeStyle = "rgba(104, 72, 31, 0.82)";
  ctx.lineWidth = 2;
  ctx.strokeRect(px.x + 6, px.y + 6, map.tile - 12, map.tile - 12);
  ctx.fillStyle = "rgba(72, 49, 28, 0.72)";
  const door = tileToPx(b.doorX, b.doorY);
  ctx.fillRect(door.x + map.tile * 0.24, door.y + map.tile * 0.42, map.tile * 0.52, map.tile * 0.55);
  ctx.fillStyle = "rgba(73, 51, 27, 0.45)";
  ctx.beginPath();
  ctx.moveTo(px.x + map.tile * 0.5, px.y + map.tile * 0.22);
  ctx.lineTo(px.x + map.tile * 0.72, px.y + map.tile * 0.54);
  ctx.lineTo(px.x + map.tile * 0.56, px.y + map.tile * 0.54);
  ctx.lineTo(px.x + map.tile * 0.56, px.y + map.tile * 0.78);
  ctx.lineTo(px.x + map.tile * 0.44, px.y + map.tile * 0.78);
  ctx.lineTo(px.x + map.tile * 0.44, px.y + map.tile * 0.54);
  ctx.lineTo(px.x + map.tile * 0.28, px.y + map.tile * 0.54);
  ctx.closePath();
  ctx.fill();
}

function drawOutsideNpcs() {
  outside.npcs.forEach(drawNpc);
}

function drawNeighborHighlights() {
  neighborDeltas.forEach(([dx, dy]) => {
    const x = state.player.x + dx;
    const y = state.player.y + dy;
    const px = tileToPx(x, y);
    const allowed = canEnter(x, y);
    if (!allowed) return;
    ctx.fillStyle = "rgba(255, 248, 218, 0.06)";
    ctx.fillRect(px.x + 3, px.y + 3, map.tile - 6, map.tile - 6);
    ctx.strokeStyle = "rgba(255, 248, 218, 0.24)";
    ctx.lineWidth = 1;
    ctx.strokeRect(px.x + 4, px.y + 4, map.tile - 8, map.tile - 8);
  });
}

function drawInterior(cols, rows) {
  if (!drawGuildHallImage(cols, rows)) {
    drawRoom(cols, rows);
    drawGuildHallDecor();
  }
  drawInteriorTitle("Maison de guilde");
  drawInteriorExitWrap();
  indoorNpcs.forEach(drawNpc);
  drawNeighborHighlights();
  drawPlayer();
  drawGrid(cols, rows);
}

function drawGuildHallImage(cols, rows) {
  if (!oklaomaInteriorSheet?.complete || oklaomaInteriorSheet.naturalWidth === 0) return false;
  const panelWidth = oklaomaInteriorSheet.naturalWidth / 2;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.filter = "saturate(1.12) brightness(1.06)";
  try {
    ctx.drawImage(
      oklaomaInteriorSheet,
      0,
      0,
      panelWidth,
      oklaomaInteriorSheet.naturalHeight,
      map.offsetX,
      map.offsetY,
      cols * map.tile,
      rows * map.tile
    );
  } catch (error) {
    ctx.restore();
    return false;
  }
  ctx.restore();
  return true;
}

function drawOklaoma(cols, rows) {
  const info = currentOklaomaMap();
  if (!drawOklaomaImageMap(cols, rows)) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const px = tileToPx(x, y);
        ctx.fillStyle = oklaomaBaseColor(info.theme, x, y);
        ctx.fillRect(px.x, px.y, map.tile, map.tile);
        drawTileTexture(px.x, px.y, info.theme, x, y);
      }
    }
    drawOklaomaTheme(info.theme);
  }
  drawOklaomaWraps();
  if (state.oklaomaMap.x === 0 && state.oklaomaMap.y === 0) drawOklaomaBuildingEntrances();
  drawOklaomaNpcs();
  drawOklaomaMonsters();
  drawOklaomaTitle(info);
  drawNeighborHighlights();
  drawPlayer();
  drawGrid(cols, rows);
}

function drawOklaomaNpcs() {
  const list = oklaomaNpcs[`${state.oklaomaMap.x},${state.oklaomaMap.y}`] || [];
  list.forEach(drawNpc);
}

function drawOklaomaBuildingEntrances() {
  oklaomaBuildingEntrances.forEach((door) => {
    const px = tileToPx(door.x, door.y);
    ctx.fillStyle = "rgba(255, 236, 154, 0.80)";
    ctx.fillRect(px.x + 5, px.y + 5, map.tile - 10, map.tile - 10);
    ctx.strokeStyle = "rgba(104, 72, 31, 0.82)";
    ctx.lineWidth = 2;
    ctx.strokeRect(px.x + 6, px.y + 6, map.tile - 12, map.tile - 12);
    ctx.fillStyle = "rgba(72, 49, 28, 0.62)";
    ctx.beginPath();
    ctx.moveTo(px.x + map.tile * 0.5, px.y + map.tile * 0.24);
    ctx.lineTo(px.x + map.tile * 0.72, px.y + map.tile * 0.54);
    ctx.lineTo(px.x + map.tile * 0.56, px.y + map.tile * 0.54);
    ctx.lineTo(px.x + map.tile * 0.56, px.y + map.tile * 0.78);
    ctx.lineTo(px.x + map.tile * 0.44, px.y + map.tile * 0.78);
    ctx.lineTo(px.x + map.tile * 0.44, px.y + map.tile * 0.54);
    ctx.lineTo(px.x + map.tile * 0.28, px.y + map.tile * 0.54);
    ctx.closePath();
    ctx.fill();
  });
}

function drawOklaomaImageMap(cols, rows) {
  const image = getOklaomaMapImage();
  if (!image || !image.complete || image.naturalWidth === 0) return false;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  try {
    ctx.drawImage(image, map.offsetX, map.offsetY, cols * map.tile, rows * map.tile);
  } catch (error) {
    return false;
  }
  return true;
}

function getOklaomaMapImage() {
  return oklaomaImageMap[`${state.oklaomaMap.x},${state.oklaomaMap.y}`] || null;
}

function drawOklaomaAtlasPanel(cols, rows) {
  if (!oklaomaAtlas.complete || oklaomaAtlas.naturalWidth === 0) return false;
  const panelWidth = Math.floor(oklaomaAtlas.naturalWidth / 3);
  const panelHeight = Math.floor(oklaomaAtlas.naturalHeight / 3);
  const atlasCol = state.oklaomaMap.x + 1;
  const atlasRow = state.oklaomaMap.y + 1;
  ctx.imageSmoothingEnabled = false;
  try {
    ctx.drawImage(
      oklaomaAtlas,
      atlasCol * panelWidth,
      atlasRow * panelHeight,
      panelWidth,
      panelHeight,
      map.offsetX,
      map.offsetY,
      cols * map.tile,
      rows * map.tile
    );
  } catch (error) {
    return false;
  }
  return true;
}

function currentOklaomaMap() {
  return oklaomaMaps[`${state.oklaomaMap.x},${state.oklaomaMap.y}`] || oklaomaMaps["0,0"];
}

function oklaomaBaseColor(theme, x, y) {
  const alt = (x + y) % 2 === 0;
  const palette = {
    central: ["#9dc777", "#acd184"],
    forest: ["#638f55", "#6f9d5e"],
    hills: ["#9aa46d", "#aeb47a"],
    road: ["#bda56a", "#cdb779"],
    swamp: ["#6f9074", "#7aa080"],
    plain: ["#94c66e", "#a4d47b"],
    ruins: ["#8f927f", "#9d9f89"],
    suburb: ["#a9c37a", "#b8ce86"],
    graveyard: ["#728866", "#819674"]
  }[theme];
  return alt ? palette[0] : palette[1];
}

function drawTileTexture(x, y, theme, tx, ty) {
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(x + 3, y + 3, map.tile - 6, map.tile - 6);
  const seed = (tx * 37 + ty * 19) % 7;
  if (seed < 3 && theme !== "central" && theme !== "road") {
    ctx.strokeStyle = "rgba(51, 105, 45, 0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + map.tile * 0.25, y + map.tile * 0.70);
    ctx.lineTo(x + map.tile * 0.34, y + map.tile * 0.50);
    ctx.moveTo(x + map.tile * 0.68, y + map.tile * 0.42);
    ctx.lineTo(x + map.tile * 0.78, y + map.tile * 0.26);
    ctx.stroke();
  }
}

function drawOklaomaTheme(theme) {
  if (theme === "central") {
    drawPlaza();
    return;
  }
  drawRegionalDecor(theme);
}

function drawPlaza() {
  drawStonePlaza(5, 3, 10, 8);
  drawOklaomaRoad(9, 0, 2, 14);
  drawOklaomaRoad(0, 6, 20, 2);
  drawFountain(9, 5);
  drawLamp(7, 4);
  drawLamp(12, 4);
  drawLamp(7, 9);
  drawLamp(12, 9);
  drawOklaomaBuilding(2, 2, 3, 3, "#b75f46");
  drawOklaomaBuilding(15, 2, 3, 3, "#476aa5");
  drawOklaomaBuilding(2, 10, 3, 3, "#6f9b55");
  drawOklaomaBuilding(15, 10, 3, 3, "#9b5aa0");
  drawStall(6, 10, "#d8a342");
  drawStall(12, 10, "#4d8fca");
}

function drawStonePlaza(x, y, w, h) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      const px = tileToPx(xx, yy);
      ctx.fillStyle = (xx + yy) % 2 === 0 ? "#cfc19a" : "#d9caa2";
      ctx.fillRect(px.x, px.y, map.tile, map.tile);
      ctx.strokeStyle = "rgba(100, 86, 63, 0.18)";
      ctx.strokeRect(px.x + 2, px.y + 2, map.tile - 4, map.tile - 4);
    }
  }
}

function drawRegionalDecor(theme) {
  const decor = {
    forest: [["tree", 4, 3], ["tree", 7, 5], ["tree", 13, 4], ["tree", 16, 9], ["tree", 3, 10]],
    hills: [["rock", 5, 4], ["rock", 9, 3], ["rock", 13, 8], ["tree", 16, 5]],
    road: [["stall", 6, 5], ["rock", 15, 4], ["lamp", 10, 5], ["lamp", 10, 8]],
    swamp: [["pond", 5, 5], ["pond", 12, 8], ["tree", 16, 4]],
    plain: [["flower", 5, 5], ["flower", 13, 7], ["tree", 16, 9], ["rock", 4, 10]],
    ruins: [["ruin", 5, 4], ["ruin", 10, 7], ["ruin", 14, 5], ["rock", 7, 10]],
    suburb: [["house", 4, 4], ["stall", 11, 7], ["lamp", 8, 6]],
    graveyard: [["grave", 5, 4], ["grave", 8, 5], ["grave", 12, 7], ["tree", 15, 4]]
  }[theme] || [];
  drawOklaomaRoad(9, 0, 2, 14);
  drawOklaomaRoad(0, 6, 20, 2);
  decor.forEach(([type, x, y]) => drawOklaomaDecor(type, x, y));
}

function drawOklaomaRoad(x, y, w, h) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      const px = tileToPx(xx, yy);
      ctx.fillStyle = "#d6bd78";
      ctx.fillRect(px.x, px.y, map.tile, map.tile);
    }
  }
}

function drawFountain(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#d8d1b9";
  roundedRect(px.x, px.y, map.tile * 2, map.tile * 2, 14);
  ctx.fill();
  ctx.fillStyle = "#6bb5ce";
  ctx.beginPath();
  ctx.arc(px.x + map.tile, px.y + map.tile, map.tile * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.arc(px.x + map.tile, px.y + map.tile * 0.78, map.tile * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function drawLamp(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "rgba(45,35,25,0.22)";
  ctx.beginPath();
  ctx.ellipse(px.x + map.tile * 0.5, px.y + map.tile * 0.82, map.tile * 0.18, map.tile * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2f2924";
  ctx.fillRect(px.x + map.tile * 0.47, px.y + map.tile * 0.30, map.tile * 0.06, map.tile * 0.48);
  ctx.fillStyle = "#f1d779";
  ctx.beginPath();
  ctx.arc(px.x + map.tile * 0.5, px.y + map.tile * 0.25, map.tile * 0.13, 0, Math.PI * 2);
  ctx.fill();
}

function drawOklaomaBuilding(x, y, w, h, roof) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "rgba(60,45,30,0.22)";
  ctx.fillRect(px.x + 6, px.y + 8, w * map.tile, h * map.tile);
  ctx.fillStyle = "#ead6a6";
  ctx.fillRect(px.x, px.y + map.tile * 0.55, w * map.tile, h * map.tile - map.tile * 0.55);
  ctx.fillStyle = "#6f5138";
  ctx.fillRect(px.x + w * map.tile * 0.44, px.y + h * map.tile - map.tile * 0.55, map.tile * 0.36, map.tile * 0.55);
  ctx.fillStyle = "#78a8c6";
  ctx.fillRect(px.x + map.tile * 0.35, px.y + map.tile * 1.12, map.tile * 0.35, map.tile * 0.28);
  ctx.fillRect(px.x + w * map.tile - map.tile * 0.75, px.y + map.tile * 1.12, map.tile * 0.35, map.tile * 0.28);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(px.x - 5, px.y + map.tile * 0.62);
  ctx.lineTo(px.x + (w * map.tile) / 2, px.y);
  ctx.lineTo(px.x + w * map.tile + 5, px.y + map.tile * 0.62);
  ctx.closePath();
  ctx.fill();
}

function drawMarketStalls() {
  [[7, 8, "#d0644f"], [12, 5, "#4d8fca"], [7, 4, "#d8a342"]].forEach(([x, y, color]) => {
    drawStall(x, y, color);
  });
}

function drawStall(x, y, color = "#d0644f") {
    const px = tileToPx(x, y);
    ctx.fillStyle = color;
    ctx.fillRect(px.x + 4, px.y + 10, map.tile * 1.4, map.tile * 0.45);
    ctx.fillStyle = "#8d623e";
    ctx.fillRect(px.x + 8, px.y + 26, map.tile * 1.2, map.tile * 0.35);
}

function drawOklaomaDecor(type, x, y) {
  if (type === "tree") drawTreeTile(x, y);
  if (type === "rock") drawRock({ x, y });
  if (type === "pond") {
    const px = tileToPx(x, y);
    ctx.fillStyle = "#6daec2";
    roundedRect(px.x, px.y, map.tile * 3, map.tile * 2, 18);
    ctx.fill();
  }
  if (type === "ruin") {
    const px = tileToPx(x, y);
    ctx.fillStyle = "#858173";
    ctx.fillRect(px.x + 8, px.y + 4, map.tile * 1.4, map.tile * 0.35);
    ctx.fillRect(px.x + 12, px.y + 4, 10, map.tile * 1.4);
  }
  if (type === "grave") drawTombCross(tileToPx(x, y).x, tileToPx(x, y).y);
  if (type === "flower") drawGrassTuft({ x, y });
  if (type === "stall") drawStall(x, y, "#d8a342");
  if (type === "house") drawOklaomaBuilding(x, y, 3, 2, "#b75f46");
  if (type === "lamp") drawLamp(x, y);
}

function drawTreeTile(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#4f8345";
  ctx.beginPath();
  ctx.arc(px.x + map.tile * 0.5, px.y + map.tile * 0.45, map.tile * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7b5634";
  ctx.fillRect(px.x + map.tile * 0.43, px.y + map.tile * 0.58, map.tile * 0.14, map.tile * 0.32);
}

function drawOklaomaWraps() {
  [[9, 0], [10, 0], [19, 6], [19, 7], [9, 13], [10, 13], [0, 6], [0, 7]].forEach(([x, y]) => {
    if (!isOklaomaMapWrap(x, y)) return;
    const px = tileToPx(x, y);
    ctx.fillStyle = "rgba(255, 236, 154, 0.78)";
    ctx.fillRect(px.x + 5, px.y + 5, map.tile - 10, map.tile - 10);
  });
}

function drawOklaomaMonsters() {
  const list = oklaomaMonsters[`${state.oklaomaMap.x},${state.oklaomaMap.y}`] || [];
  list
    .filter((monster) => monster.hp > 0 && monster.x === state.player.x && monster.y === state.player.y)
    .forEach((monster) => {
      const px = tileToPx(monster.x, monster.y);
      const spriteSize = map.tile * 1.12;
      if (!drawOklaomaMonsterSprite(monster, ctx, px.x + (map.tile - spriteSize) / 2, px.y + map.tile - spriteSize, spriteSize, spriteSize)) {
        ctx.save();
        ctx.translate(px.x + map.tile / 2, px.y + map.tile * 0.55);
        drawOklaomaMonsterShape(monster, ctx, map.tile * 0.88);
        ctx.restore();
      }
      ctx.fillStyle = "#fff0ca";
      ctx.font = `bold ${Math.max(10, map.tile * 0.22)}px Trebuchet MS`;
      ctx.fillText(`Lv ${monster.level}`, px.x + 4, px.y + 13);
    });
}

function drawOklaomaTitle(info) {
  const px = tileToPx(1, 1);
  ctx.fillStyle = "rgba(255, 248, 218, 0.88)";
  roundedRect(px.x, px.y, map.tile * 5.2, map.tile * 1.2, 12);
  ctx.fill();
  ctx.fillStyle = "#5a3d2a";
  ctx.font = `bold ${Math.max(15, map.tile * 0.32)}px Georgia`;
  ctx.fillText(info.name, px.x + 10, px.y + map.tile * 0.48);
  ctx.font = `${Math.max(11, map.tile * 0.22)}px Trebuchet MS`;
  ctx.fillText(info.level, px.x + 10, px.y + map.tile * 0.86);
}

function drawGrassGrid(cols, rows) {
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const px = tileToPx(x, y);
      ctx.fillStyle = (x + y) % 2 === 0 ? "#acd77b" : "#b7df85";
      ctx.fillRect(px.x, px.y, map.tile, map.tile);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(px.x + 4, px.y + 4, map.tile - 8, map.tile - 8);
    }
  }
}

function drawPath() {
  const pathTiles = [];
  for (let y = 4; y <= 11; y += 1) pathTiles.push({ x: 3, y });
  for (let x = 3; x <= 14; x += 1) pathTiles.push({ x, y: 11 });
  for (let y = 8; y <= 11; y += 1) pathTiles.push({ x: 14, y });
  pathTiles.forEach(({ x, y }) => {
    const px = tileToPx(x, y);
    ctx.fillStyle = "#d7bd78";
    ctx.fillRect(px.x, px.y, map.tile, map.tile);
    ctx.fillStyle = "rgba(120,85,45,0.12)";
    ctx.beginPath();
    ctx.arc(px.x + map.tile * 0.35, px.y + map.tile * 0.58, map.tile * 0.08, 0, Math.PI * 2);
    ctx.arc(px.x + map.tile * 0.70, px.y + map.tile * 0.34, map.tile * 0.06, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawLake() {
  const { x, y, w, h } = outside.lake;
  const px = tileToPx(x, y);
  ctx.fillStyle = "#7fc0d6";
  roundedRect(px.x + 4, px.y + 4, w * map.tile - 8, h * map.tile - 8, map.tile * 0.35);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px.x + map.tile * 0.45, px.y + map.tile * 0.9);
  ctx.quadraticCurveTo(px.x + map.tile * 1.8, px.y + map.tile * 0.35, px.x + map.tile * 3.2, px.y + map.tile * 1.05);
  ctx.stroke();
}

function drawCemetery() {
  outside.cemetery.forEach((item) => {
    const px = tileToPx(item.x, item.y);
    ctx.fillStyle = "#93b176";
    ctx.fillRect(px.x, px.y, map.tile, map.tile);
    if (item.type === "skull") drawSkull(px.x, px.y);
    else drawTombCross(px.x, px.y);
  });
}

function drawSkull(x, y) {
  ctx.fillStyle = "#efe7d7";
  ctx.beginPath();
  ctx.arc(x + map.tile * 0.50, y + map.tile * 0.42, map.tile * 0.20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x + map.tile * 0.38, y + map.tile * 0.50, map.tile * 0.24, map.tile * 0.16);
  ctx.fillStyle = "#4b3f36";
  ctx.beginPath();
  ctx.arc(x + map.tile * 0.43, y + map.tile * 0.42, 2.5, 0, Math.PI * 2);
  ctx.arc(x + map.tile * 0.57, y + map.tile * 0.42, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawTombCross(x, y) {
  ctx.fillStyle = "#d8d0bd";
  ctx.fillRect(x + map.tile * 0.45, y + map.tile * 0.22, map.tile * 0.10, map.tile * 0.48);
  ctx.fillRect(x + map.tile * 0.33, y + map.tile * 0.34, map.tile * 0.34, map.tile * 0.09);
  ctx.fillStyle = "rgba(70,55,45,0.18)";
  ctx.fillRect(x + map.tile * 0.35, y + map.tile * 0.72, map.tile * 0.32, 4);
}

function drawLargeBuilding() {
  const b = outside.building;
  const px = tileToPx(b.x, b.y);
  const width = b.w * map.tile;
  const height = b.h * map.tile;
  ctx.fillStyle = "rgba(70, 48, 30, 0.25)";
  ctx.fillRect(px.x + 8, px.y + 10, width, height);
  ctx.fillStyle = "#e7ca8b";
  ctx.fillRect(px.x, px.y + map.tile * 0.68, width, height - map.tile * 0.68);
  ctx.fillStyle = "#f0dbad";
  ctx.fillRect(px.x + 10, px.y + map.tile * 0.92, width - 20, height - map.tile * 1.20);
  ctx.fillStyle = "#b85f45";
  ctx.beginPath();
  ctx.moveTo(px.x - 8, px.y + map.tile * 0.74);
  ctx.lineTo(px.x + width / 2, px.y);
  ctx.lineTo(px.x + width + 8, px.y + map.tile * 0.74);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#7e553a";
  ctx.fillRect(px.x + map.tile * 2.15, px.y + map.tile * 2.90, map.tile * 0.7, map.tile * 1.08);
  ctx.fillStyle = "#86b8d0";
  ctx.fillRect(px.x + map.tile * 0.80, px.y + map.tile * 1.65, map.tile * 0.55, map.tile * 0.45);
  ctx.fillRect(px.x + map.tile * 3.55, px.y + map.tile * 1.65, map.tile * 0.55, map.tile * 0.45);
}

function drawRoom(cols, rows) {
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const px = tileToPx(x, y);
      const wall = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
      ctx.fillStyle = wall ? "#7c563c" : ((x + y) % 2 === 0 ? "#d7b878" : "#e5c98d");
      ctx.fillRect(px.x, px.y, map.tile, map.tile);
      if (wall) {
        ctx.fillStyle = "rgba(54, 32, 22, 0.28)";
        ctx.fillRect(px.x, px.y + map.tile - 8, map.tile, 8);
        ctx.fillStyle = "rgba(255, 231, 168, 0.10)";
        ctx.fillRect(px.x + 3, px.y + 3, map.tile - 6, 4);
      } else {
        ctx.strokeStyle = "rgba(108, 73, 41, 0.12)";
        ctx.lineWidth = 1;
        ctx.strokeRect(px.x + 1, px.y + 1, map.tile - 2, map.tile - 2);
      }
    }
  }
  const door = tileToPx(5, 7);
  ctx.fillStyle = "#6d4b32";
  ctx.fillRect(door.x + map.tile * 0.20, door.y + map.tile * 0.25, map.tile * 0.60, map.tile * 0.75);
}

function drawGuildHallDecor() {
  drawCarpet(3, 2, 6, 5);
  drawBookshelf(1, 1, 2);
  drawBookshelf(9, 1, 2);
  drawCounter(4, 1, 4, "#6d4a32");
  drawTable(5, 4);
  drawChair(4, 4);
  drawChair(7, 4);
  drawChest(1, 5);
  drawPlant(10, 5);
  drawPlant(1, 6);
  drawWallBanner(3, 0, "#2d5f92");
  drawWallBanner(8, 0, "#7b3d7f");
  drawLantern(2, 1);
  drawLantern(9, 1);
}

function drawCarpet(x, y, w, h) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "rgba(120, 45, 38, 0.76)";
  roundedRect(px.x + 8, px.y + 6, map.tile * w - 16, map.tile * h - 12, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(238, 191, 91, 0.76)";
  ctx.lineWidth = 3;
  roundedRect(px.x + 16, px.y + 14, map.tile * w - 32, map.tile * h - 28, 10);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 229, 147, 0.12)";
  ctx.fillRect(px.x + map.tile * 0.55, px.y + 14, map.tile * (w - 1.1), map.tile * h - 28);
}

function drawBookshelf(x, y, h) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#6e4429";
  roundedRect(px.x + 3, px.y + 4, map.tile * 1.55, map.tile * h - 8, 8);
  ctx.fill();
  for (let row = 0; row < h; row += 1) {
    ctx.fillStyle = "rgba(38, 24, 15, 0.32)";
    ctx.fillRect(px.x + 8, px.y + 12 + row * map.tile * 0.72, map.tile * 1.35, 4);
    ["#314d7c", "#8b3f35", "#c09742", "#496f3f"].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(px.x + 12 + index * 11, px.y + 17 + row * map.tile * 0.72, 8, 18);
    });
  }
}

function drawChair(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#72482c";
  roundedRect(px.x + 12, px.y + 18, map.tile * 0.48, map.tile * 0.38, 5);
  ctx.fill();
  ctx.fillStyle = "#5a3824";
  ctx.fillRect(px.x + 13, px.y + 10, map.tile * 0.44, 8);
}

function drawWallBanner(x, y, color) {
  const px = tileToPx(x, y);
  ctx.fillStyle = color;
  ctx.fillRect(px.x + map.tile * 0.25, px.y + map.tile * 0.34, map.tile * 0.50, map.tile * 0.76);
  ctx.fillStyle = "rgba(238, 191, 91, 0.82)";
  ctx.fillRect(px.x + map.tile * 0.25, px.y + map.tile * 0.34, map.tile * 0.50, 4);
}

function drawLantern(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "rgba(255, 207, 98, 0.28)";
  ctx.beginPath();
  ctx.arc(px.x + map.tile * 0.50, px.y + map.tile * 0.46, map.tile * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5a3824";
  ctx.fillRect(px.x + map.tile * 0.42, px.y + map.tile * 0.24, map.tile * 0.16, map.tile * 0.28);
  ctx.fillStyle = "#f3c35c";
  ctx.fillRect(px.x + map.tile * 0.45, px.y + map.tile * 0.34, map.tile * 0.10, map.tile * 0.16);
}

function drawTable(x, y) {
  const px = tileToPx(x, y);
  ctx.fillStyle = "#8d623e";
  roundedRect(px.x + 3, px.y + 8, map.tile * 2 - 6, map.tile * 0.65, 8);
  ctx.fill();
  ctx.fillStyle = "#f4e7bd";
  ctx.fillRect(px.x + map.tile * 0.34, px.y + map.tile * 0.22, map.tile * 0.38, map.tile * 0.18);
}

function drawRock(item) {
  const px = tileToPx(item.x, item.y);
  ctx.fillStyle = "#8e9188";
  ctx.beginPath();
  ctx.moveTo(px.x + map.tile * 0.20, px.y + map.tile * 0.72);
  ctx.lineTo(px.x + map.tile * 0.43, px.y + map.tile * 0.28);
  ctx.lineTo(px.x + map.tile * 0.75, px.y + map.tile * 0.74);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(px.x + map.tile * 0.42, px.y + map.tile * 0.36, map.tile * 0.18, 4);
}

function drawGrassTuft(item) {
  const px = tileToPx(item.x, item.y);
  ctx.strokeStyle = "#5f9c55";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const bx = px.x + map.tile * (0.25 + i * 0.10);
    ctx.moveTo(bx, px.y + map.tile * 0.72);
    ctx.lineTo(bx + 4, px.y + map.tile * 0.45);
  }
  ctx.stroke();
}

function drawNpc(npc) {
  const px = tileToPx(npc.x, npc.y);
  const npcSprite = npcAtlasSprite(npc);
  drawShadow(px.x, px.y, 0.32);
  if (npcSprite) drawSprite(npcSprite, px.x, px.y, 0.82, 1.18);
  else drawNpcMarker(npc, px.x, px.y);
  drawNpcLabel(npc, px.x, px.y, npcSprite ? 1.18 : 1.0);
}

function drawNpcMarker(npc, x, y) {
  const colors = {
    quest: ["#2f6fba", "#f2d47b"],
    gateGuard: ["#655e69", "#d9c27a"],
    vendor: ["#7a9a45", "#f0d08c"],
    mira: ["#6aa56c", "#efe3a7"],
    okPotionVendor: ["#6aa56c", "#efe3a7"],
    equipmentVendor: ["#8f6245", "#f0c36a"],
    innkeeper: ["#a0663d", "#f0c36a"],
    banker: ["#5f7598", "#f0d08c"],
    okQuest: ["#7a9a45", "#efe3a7"],
    okFinal: ["#2f6fba", "#f2d47b"]
  };
  const [base, accent] = colors[npc.role] || ["#6b7f4b", "#efe3a7"];
  const cx = x + map.tile * 0.5;
  const cy = y + map.tile * 0.52;
  const radius = map.tile * 0.23;
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 248, 218, 0.92)";
  ctx.lineWidth = Math.max(2, map.tile * 0.045);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = `bold ${Math.max(13, map.tile * 0.34)}px Georgia`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(npc.name.charAt(0).toUpperCase(), cx, cy + 1);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function npcAtlasSprite(npc) {
  ensureNpcSprites();
  if (state.npcSprites.length === 0) return null;
  if (Number.isInteger(npc.sprite) && state.npcSprites[npc.sprite]) return state.npcSprites[npc.sprite];
  const roleIndexes = {
    vendor: 0,
    equipmentVendor: 1,
    mira: 2,
    okPotionVendor: 2,
    innkeeper: 3,
    quest: 5,
    gateGuard: 4,
    banker: 8,
    okFinal: 12
  };
  const questIndexes = {
    forest: 7,
    hills: 14,
    road: 13,
    swamp: 10,
    plain: 7,
    ruins: 15,
    suburb: 9,
    graveyard: 15
  };
  const index = npc.role === "okQuest"
    ? (questIndexes[npc.questKey] ?? 8)
    : (roleIndexes[npc.role] ?? 0);
  return state.npcSprites[index] || null;
}

function drawNpcLabel(npc, x, y, heightScale = 1.0) {
  const label = npc.name;
  ctx.font = `bold ${Math.max(11, map.tile * 0.22)}px Trebuchet MS`;
  const labelHeight = Math.max(18, map.tile * 0.34);
  const width = ctx.measureText(label).width + 12;
  const labelX = x + map.tile / 2 - width / 2;
  const spriteTop = y + map.tile - map.tile * heightScale - map.tile * 0.06;
  const labelY = Math.max(4, spriteTop - labelHeight - map.tile * 0.08);
  ctx.fillStyle = "rgba(44, 34, 25, 0.72)";
  roundedRect(labelX, labelY, width, labelHeight, 7);
  ctx.fill();
  ctx.fillStyle = "#fff2cf";
  ctx.fillText(label, labelX + 6, labelY + labelHeight * 0.72);
}

function drawOldSage(x, y) {
  const sprite = oldSageSprite();
  drawSprite(sprite, x, y, 0.94, 1.04);
}

function oldSageSprite() {
  if (oldSageSprite.cache) return oldSageSprite.cache;
  const source = document.createElement("canvas");
  source.width = 96;
  source.height = 128;
  const sctx = source.getContext("2d");
  sctx.imageSmoothingEnabled = true;
  sctx.lineCap = "round";
  sctx.lineJoin = "round";
  sctx.fillStyle = "rgba(0,0,0,0)";
  sctx.fillRect(0, 0, source.width, source.height);
  sctx.fillStyle = "rgba(61, 42, 30, 0.22)";
  sctx.beginPath();
  sctx.ellipse(48, 116, 28, 7, 0, 0, Math.PI * 2);
  sctx.fill();
  sctx.fillStyle = "#3d3569";
  sctx.beginPath();
  sctx.moveTo(48, 38);
  sctx.quadraticCurveTo(26, 58, 25, 109);
  sctx.quadraticCurveTo(48, 124, 72, 109);
  sctx.quadraticCurveTo(70, 58, 48, 38);
  sctx.fill();
  sctx.fillStyle = "#6958a5";
  sctx.beginPath();
  sctx.moveTo(48, 42);
  sctx.quadraticCurveTo(38, 66, 39, 112);
  sctx.lineTo(57, 112);
  sctx.quadraticCurveTo(59, 66, 48, 42);
  sctx.fill();
  sctx.strokeStyle = "#d7b964";
  sctx.lineWidth = 4;
  sctx.beginPath();
  sctx.moveTo(48, 57);
  sctx.lineTo(48, 108);
  sctx.stroke();
  sctx.fillStyle = "#dba87c";
  sctx.beginPath();
  sctx.arc(48, 35, 15, 0, Math.PI * 2);
  sctx.fill();
  sctx.fillStyle = "#e8e0d2";
  sctx.beginPath();
  sctx.ellipse(48, 49, 13, 17, 0, 0, Math.PI * 2);
  sctx.fill();
  sctx.fillStyle = "#f1efe8";
  sctx.beginPath();
  sctx.moveTo(48, 3);
  sctx.quadraticCurveTo(30, 17, 29, 34);
  sctx.quadraticCurveTo(47, 25, 67, 34);
  sctx.quadraticCurveTo(64, 16, 48, 3);
  sctx.fill();
  sctx.fillStyle = "#8b78c1";
  sctx.beginPath();
  sctx.arc(48, 31, 19, Math.PI, Math.PI * 2);
  sctx.fill();
  sctx.fillStyle = "#2e261f";
  sctx.fillRect(41, 35, 4, 4);
  sctx.fillRect(52, 35, 4, 4);
  sctx.strokeStyle = "#9b6b38";
  sctx.lineWidth = 5;
  sctx.beginPath();
  sctx.moveTo(73, 52);
  sctx.lineTo(82, 113);
  sctx.stroke();
  sctx.fillStyle = "#84d4ff";
  sctx.beginPath();
  sctx.arc(72, 49, 6, 0, Math.PI * 2);
  sctx.fill();
  sctx.fillStyle = "rgba(255,255,255,0.62)";
  sctx.beginPath();
  sctx.arc(70, 47, 2, 0, Math.PI * 2);
  sctx.fill();
  oldSageSprite.cache = source;
  return source;
}

function drawVisibleEncounter() {
  const monster = selectedMonster();
  if (!monster || state.area !== "outside") return;
  if (state.player.x !== monster.x || state.player.y !== monster.y) return;
  const px = tileToPx(monster.x, monster.y);
  const sprite = state.sprites[3];
  drawShadow(px.x, px.y, 0.38);
  if (sprite) drawSprite(sprite, px.x, px.y, 1.35, 1.18);
  ctx.fillStyle = "#f4d27f";
  ctx.fillRect(px.x + map.tile * 0.12, px.y - map.tile * 0.12, map.tile * 0.76 * (monster.hp / monster.maxHp), 5);
}

function drawPlayer() {
  const px = tileToPx(state.player.x, state.player.y);
  const sprite = getPlayerSprite();
  drawShadow(px.x, px.y, 0.38);
  if (sprite) drawSprite(sprite, px.x, px.y, 1.24, 1.36);
}

function getPlayerSprite() {
  ensureClassSprites();
  const classInfo = currentClass();
  if (classInfo && state.classSprites[classInfo.sprite]) return state.classSprites[classInfo.sprite];
  return state.sprites[0];
}

function drawShadow(x, y, scale) {
  ctx.fillStyle = "rgba(69, 45, 28, 0.22)";
  ctx.beginPath();
  ctx.ellipse(x + map.tile / 2, y + map.tile * 0.82, map.tile * scale, map.tile * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawSprite(sprite, x, y, widthScale, heightScale) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const w = map.tile * widthScale;
  const h = map.tile * heightScale;
  ctx.drawImage(sprite, x + (map.tile - w) / 2, y + map.tile - h - map.tile * 0.06, w, h);
}

function drawGrid(cols, rows) {
  ctx.strokeStyle = "rgba(55, 95, 42, 0.32)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= cols; x += 1) {
    const gx = map.offsetX + x * map.tile + 0.5;
    ctx.beginPath();
    ctx.moveTo(gx, map.offsetY);
    ctx.lineTo(gx, map.offsetY + rows * map.tile);
    ctx.stroke();
  }
  for (let y = 0; y <= rows; y += 1) {
    const gy = map.offsetY + y * map.tile + 0.5;
    ctx.beginPath();
    ctx.moveTo(map.offsetX, gy);
    ctx.lineTo(map.offsetX + cols * map.tile, gy);
    ctx.stroke();
  }
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function canEnter(x, y) {
  const okRoom = isOklaomaInteriorArea();
  const inRoom = state.area === "inside" || okRoom;
  const cols = okRoom ? oklaomaInterior.cols : inRoom ? interior.cols : map.cols;
  const rows = okRoom ? oklaomaInterior.rows : inRoom ? interior.rows : map.rows;
  if (x < 0 || y < 0 || x >= cols || y >= rows) return false;

  if (state.area === "oklaoma") {
    return !isOklaomaBlocked(x, y);
  }

  if (inRoom) {
    const exit = currentInteriorExit();
    const isExit = x === exit.x && y === exit.y;
    const npcs = state.area === "oklaomaInn" ? oklaomaInnNpcs : state.area === "oklaomaShop" ? oklaomaShopNpcs : indoorNpcs;
    const onNpc = npcs.some((npc) => npc.x === x && npc.y === y);
    const onDecor = Boolean(oklaomaInteriorBlocks[state.area]?.has(`${x},${y}`));
    const wall = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
    return isExit || (!wall && !onNpc && !onDecor);
  }

  return !isOutsideBlocked(x, y);
}

function isOklaomaMapWrap(x, y) {
  if (state.oklaomaMap.y > -1 && (x === 9 || x === 10) && y === 0) return true;
  if (state.oklaomaMap.y < 1 && (x === 9 || x === 10) && y === map.rows - 1) return true;
  if (state.oklaomaMap.x > -1 && x === 0 && (y === 6 || y === 7)) return true;
  if (state.oklaomaMap.x < 1 && x === map.cols - 1 && (y === 6 || y === 7)) return true;
  return false;
}

function getOklaomaBuildingEntrance(x, y) {
  if (state.oklaomaMap.x !== 0 || state.oklaomaMap.y !== 0) return null;
  return oklaomaBuildingEntrances.find((entry) => entry.x === x && entry.y === y) || null;
}

function isOklaomaBlocked(x, y) {
  if (isOklaomaMapWrap(x, y) || getOklaomaBuildingEntrance(x, y)) return false;
  const key = `${state.oklaomaMap.x},${state.oklaomaMap.y}`;
  const blocked = oklaomaMapBlocks[key];
  const onNpc = (oklaomaNpcs[key] || []).some((npc) => npc.x === x && npc.y === y);
  return Boolean(onNpc || (blocked && blocked.has(`${x},${y}`)));
}

function isOutsideBlocked(x, y) {
  const b = outside.building;
  const onDoorWrap = isBuildingEntrance(x, y);
  const onBuilding = x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h;
  const inLake = x >= outside.lake.x && x < outside.lake.x + outside.lake.w && y >= outside.lake.y && y < outside.lake.y + outside.lake.h;
  const onRock = outside.rocks.some((rock) => rock.x === x && rock.y === y);
  const onNpc = outside.npcs.some((npc) => npc.x === x && npc.y === y);
  const onFence = (
    (y === 3 && x >= 2 && x <= 6) ||
    (x === 2 && y >= 3 && y <= 7) ||
    (y === 7 && x >= 2 && x <= 6 && x !== 4) ||
    (x === 6 && y >= 3 && y <= 7) ||
    (y === 8 && x >= 17 && x <= 19)
  );

  if (onDoorWrap) return false;
  return onBuilding || inLake || onRock || onFence || onNpc;
}

function move(direction) {
  if (state.pm <= 0) {
    addLog("Tu n'as plus assez de PM.");
    return;
  }
  const deltas = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const [dx, dy] = deltas[direction];
  const nextX = state.player.x + dx;
  const nextY = state.player.y + dy;
  if (!canEnter(nextX, nextY)) {
    addLog("Le passage est bloque.");
    return;
  }

  state.player.x = nextX;
  state.player.y = nextY;
  state.pm -= 1;

  handleTransitions();
  handleTileEvents();
  addLog(`Deplacement vers x ${state.player.x}, y ${state.player.y}.`);
  updateUi();
  drawPortrait();
  draw();
}

function moveToAdjacent(x, y) {
  const dx = x - state.player.x;
  const dy = y - state.player.y;
  if (Math.max(Math.abs(dx), Math.abs(dy)) !== 1) {
    addLog("Clique une case adjacente pour te deplacer.");
    return;
  }
  if (!canEnter(x, y)) {
    addLog("Case bloquee: obstacle, toit, eau, rocher ou barriere.");
    return;
  }
  if (state.pm <= 0) {
    addLog("Tu n'as plus assez de PM.");
    return;
  }

  state.player.x = x;
  state.player.y = y;
  state.pm -= 1;
  handleTransitions();
  handleTileEvents();
  addLog(`Deplacement vers x ${state.player.x}, y ${state.player.y}.`);
  updateUi();
  draw();
}

function handleTransitions() {
  const b = outside.building;
  if (state.area === "outside" && isBuildingEntrance(state.player.x, state.player.y)) {
    state.area = "inside";
    state.player = { x: 5, y: 6 };
    state.targetId = null;
    addLog("Tu entres dans la maison de guilde. Deux PNJ t'attendent.");
  } else if (state.area === "inside" && state.player.x === 5 && state.player.y === 7) {
    state.area = "outside";
    state.player = { x: b.doorX, y: b.doorY + 1 };
    state.targetId = null;
    addLog("Tu ressors sur le chemin du village.");
  } else if (state.area === "oklaoma" && getOklaomaBuildingEntrance(state.player.x, state.player.y)) {
    enterOklaomaBuilding(getOklaomaBuildingEntrance(state.player.x, state.player.y).type);
  } else if (state.area === "oklaomaInn" && state.player.x === currentInteriorExit().x && state.player.y === currentInteriorExit().y) {
    exitOklaomaBuilding("inn");
  } else if (state.area === "oklaomaShop" && state.player.x === currentInteriorExit().x && state.player.y === currentInteriorExit().y) {
    exitOklaomaBuilding("shop");
  }
}

function enterOklaomaBuilding(type) {
  state.area = type === "shop" ? "oklaomaShop" : "oklaomaInn";
  state.player = { x: 5, y: 14 };
  state.targetId = null;
  addLog(type === "shop" ? "Tu entres dans la boutique d'Oklaoma." : "Tu entres dans l'auberge d'Oklaoma.");
}

function exitOklaomaBuilding(type) {
  state.area = "oklaoma";
  state.oklaomaMap = { x: 0, y: 0 };
  const entrance = oklaomaBuildingEntrances.find((entry) => entry.type === type);
  state.player = entrance ? { x: entrance.x, y: entrance.y } : { x: 10, y: 7 };
  state.targetId = null;
  addLog(type === "shop" ? "Tu sors de la boutique." : "Tu sors de l'auberge.");
}

function isBuildingEntrance(x, y) {
  const b = outside.building;
  return x === b.wrapX && y === b.wrapY;
}

function handleTileEvents() {
  if (state.area === "oklaoma") {
    handleOklaomaWrap();
    const info = currentOklaomaMap();
    const monster = getOklaomaMonsterOnPlayer();
    if (monster) {
      state.targetId = `ok-${state.oklaomaMap.x},${state.oklaomaMap.y}-${monster.x},${monster.y}`;
      addCombatToast(`${monster.name} niveau ${monster.level} te provoque.`);
    }
    else addLog(`${info.name} - ${info.level}`);
    return;
  }

  if (state.area === "inside") {
    return;
  }

  const monster = outside.monsters.find((item) => item.hp > 0 && item.x === state.player.x && item.y === state.player.y);
  if (monster) {
    state.targetId = monster.id;
    const count = monstersOnPlayerTile().length;
    state.lastDamage = `${monster.name} surgit sur ta case.`;
    addCombatToast("Rencontre ! Le monstre apparait sur ta case.");
    addLog(`${count} monstre${count > 1 ? "s" : ""} sur cette case.`);
  } else {
    state.targetId = null;
    addLog("La map est calme.");
  }
}

function handleOklaomaWrap() {
  let dx = 0;
  let dy = 0;
  if (state.player.x <= 0) dx = -1;
  if (state.player.x >= map.cols - 1) dx = 1;
  if (state.player.y <= 0) dy = -1;
  if (state.player.y >= map.rows - 1) dy = 1;
  if (dx === 0 && dy === 0) return;

  const nextX = Math.max(-1, Math.min(1, state.oklaomaMap.x + dx));
  const nextY = Math.max(-1, Math.min(1, state.oklaomaMap.y + dy));
  if (nextX === state.oklaomaMap.x && nextY === state.oklaomaMap.y) return;

  state.oklaomaMap = { x: nextX, y: nextY };
  state.player.x = dx < 0 ? map.cols - 2 : dx > 0 ? 1 : state.player.x;
  state.player.y = dy < 0 ? map.rows - 2 : dy > 0 ? 1 : state.player.y;
  const info = currentOklaomaMap();
  addFloatingLog(`Arrivee: ${info.name} (${info.level})`);
}

function getOklaomaMonsterOnPlayer() {
  const list = oklaomaMonsters[`${state.oklaomaMap.x},${state.oklaomaMap.y}`] || [];
  return list.find((item) => item.hp > 0 && item.x === state.player.x && item.y === state.player.y) || null;
}

function openDialogue(npc) {
  document.querySelector("#dialogName").textContent = npc.name;
  renderDialoguePortrait(npc);
  dialogActions.innerHTML = "";
  dialogPanel.classList.remove("is-hidden");

  if (npc.role === "quest") {
    renderQuestDialogue();
    return;
  }

  if (npc.role === "vendor") {
    renderVendorDialogue();
    return;
  }

  if (npc.role === "mira") {
    renderMiraDialogue();
    return;
  }

  if (npc.role === "gateGuard") {
    renderGateGuardDialogue();
    return;
  }

  if (npc.role === "innkeeper") {
    document.querySelector("#dialogText").textContent = "Aubergiste: une chambre chaude te remettra sur pied.";
    addDialogButton("Dormir / se reposer", () => {
      state.hp = state.maxHp;
      closeDialogue();
      addLog("Repos: PV recuperes.");
      updateUi();
    });
    addDialogButton("Fermer", closeDialogue);
    return;
  }

  if (npc.role === "banker") {
    document.querySelector("#dialogText").textContent = "Banquier: ton coffre est pret. Le depot complet arrive bientot.";
    addDialogButton("Consulter la banque", () => addLog("Banque: fonctionnalite preparee."));
    addDialogButton("Fermer", closeDialogue);
    return;
  }

  if (npc.role === "okPotionVendor") {
    renderOkPotionVendor();
    return;
  }

  if (npc.role === "equipmentVendor") {
    renderEquipmentVendor();
    return;
  }

  if (npc.role === "okQuest") {
    renderOklaomaQuestDialogue(npc);
    return;
  }

  if (npc.role === "okFinal") {
    renderOklaomaFinalDialogue();
    return;
  }

  if (npc.role === "ambient") {
    document.querySelector("#dialogText").textContent = npc.line || `${npc.name}: belle journee pour voyager.`;
    addDialogButton("Fermer", closeDialogue);
    return;
  }

  document.querySelector("#dialogText").textContent = `${npc.name}: je n'ai rien a demander pour l'instant.`;
  addDialogButton("Fermer", closeDialogue);
}

function renderDialoguePortrait(npc) {
  dialogAvatarCtx.clearRect(0, 0, dialogAvatar.width, dialogAvatar.height);
  const sprite = npcAtlasSprite(npc);
  if (!sprite) return;
  dialogAvatarCtx.save();
  dialogAvatarCtx.imageSmoothingEnabled = true;
  dialogAvatarCtx.imageSmoothingQuality = "high";
  dialogAvatarCtx.beginPath();
  dialogAvatarCtx.arc(dialogAvatar.width / 2, dialogAvatar.height / 2, dialogAvatar.width * 0.42, 0, Math.PI * 2);
  dialogAvatarCtx.clip();
  const scale = Math.min(dialogAvatar.width * 0.78 / sprite.width, dialogAvatar.height * 0.98 / sprite.height);
  const drawW = sprite.width * scale;
  const drawH = sprite.height * scale;
  dialogAvatarCtx.drawImage(
    sprite,
    (dialogAvatar.width - drawW) / 2 - 5,
    dialogAvatar.height * 0.52 - drawH / 2 - 20,
    drawW,
    drawH
  );
  dialogAvatarCtx.restore();
}

function renderOklaomaQuestDialogue(npc) {
  const def = oklaomaQuestDefs[npc.questKey];
  const status = state.oklaomaQuests[npc.questKey] || "available";
  const progress = state.inventory[`ok_${npc.questKey}`] || 0;
  if (status === "available") {
    document.querySelector("#dialogText").textContent = `${npc.name}: ${def.title}. Elimine ${def.needed} ${def.target}.`;
    addDialogButton("Accepter", () => {
      state.oklaomaQuests[npc.questKey] = "active";
      closeDialogue();
      addLog(`Quete acceptee: ${def.title}.`);
      updateUi();
    });
  } else if (status === "active" && progress >= def.needed) {
    document.querySelector("#dialogText").textContent = `${npc.name}: tu as termine ${def.title}.`;
    addDialogButton("Terminer", () => {
      state.oklaomaQuests[npc.questKey] = "done";
      gainXp(def.rewardXp);
      state.gold += 25;
      closeDialogue();
      maybeUnlockFinalOklaomaQuest();
      addLog(`Quete terminee: ${def.title}.`);
      updateUi();
    });
  } else if (status === "active") {
    document.querySelector("#dialogText").textContent = `${npc.name}: progression ${progress}/${def.needed} contre ${def.target}.`;
  } else {
    document.querySelector("#dialogText").textContent = `${npc.name}: merci pour ton aide.`;
  }
  addDialogButton("Fermer", closeDialogue);
}

function maybeUnlockFinalOklaomaQuest() {
  const completed = Object.values(state.oklaomaQuests).filter((status) => status === "done").length;
  if (completed >= 8 && state.finalOklaomaQuest === "locked") {
    state.finalOklaomaQuest = "available";
    addFloatingLog("Quete finale debloquee a la Place d'Oklaoma.");
  }
}

function renderOklaomaFinalDialogue() {
  const completed = Object.values(state.oklaomaQuests).filter((status) => status === "done").length;
  if (state.finalOklaomaQuest === "locked") {
    document.querySelector("#dialogText").textContent = `Intendante: aide les 8 zones autour d'Oklaoma avant ma mission finale. (${completed}/8)`;
  } else if (state.finalOklaomaQuest === "available") {
    document.querySelector("#dialogText").textContent = "Intendante: la region est stabilisee. Il reste une menace ancienne dans les ruines.";
    addDialogButton("Accepter la quete finale", () => {
      state.finalOklaomaQuest = "active";
      closeDialogue();
      addLog("Quete finale acceptee: Le serment d'Oklaoma.");
      updateUi();
    });
  } else if (state.finalOklaomaQuest === "active") {
    document.querySelector("#dialogText").textContent = "Intendante: la quete finale sera un long combat de region. Prototype pret.";
  } else {
    document.querySelector("#dialogText").textContent = "Intendante: Oklaoma se souviendra de toi.";
  }
  addDialogButton("Fermer", closeDialogue);
}

function renderOkPotionVendor() {
  document.querySelector("#dialogText").textContent = "Herboriste: potions fraiches d'Oklaoma.";
  [
    { key: "potionVie", label: "Potion de vie", price: 20 },
    { key: "potionMana", label: "Potion de mana", price: 20 }
  ].forEach((item) => addShopDialogButton(item, "Acheter", "potion", () => {
    if (state.gold < item.price) return;
    state.gold -= item.price;
    state.inventory[item.key] = (state.inventory[item.key] || 0) + 1;
    addLog(`Achat: ${item.label}.`);
    updateUi();
    openDialogue({ name: "Herboriste", role: "okPotionVendor" });
  }));
  addDialogButton("Fermer", closeDialogue);
}

function renderEquipmentVendor() {
  document.querySelector("#dialogText").textContent = "Armurier: cuir solide et armes adaptees a ta classe.";
  equipmentShopItems
    .filter((item) => !item.classKey || item.classKey === state.chosenClassKey)
    .forEach((item) => addShopDialogButton(item, "Acheter", "equipment", () => buyEquipment(item)));
  addDialogButton("Fermer", closeDialogue);
}

function buyEquipment(item) {
  if (state.gold < item.price) return;
  state.gold -= item.price;
  state.gear.push({ ...item, stats: { ...item.stats } });
  addLog(`Equipement achete: ${item.name}.`);
  updateUi();
  openDialogue({ name: "Armurier", role: "equipmentVendor" });
}

function renderQuestDialogue() {
  if (state.quest === "available") {
    document.querySelector("#dialogText").textContent = "Bonjour, je vois que tu n'as pas d'arme équipé, que dirais tu de me rapporter 5 défences de sangliers sombres en échange de cette lame?*donne lame*";
    addDialogButton("Accepter la quete", () => {
      state.quest = "active";
      closeDialogue();
      addFloatingLog("Quete acceptee: rapporte 5 defenses sombres.");
      addLog("Quete acceptee: 5 defenses sombres.");
      updateUi();
    });
    addDialogButton("Fermer", closeDialogue);
  } else if (state.quest === "active" && state.drops >= 5) {
    document.querySelector("#dialogText").textContent = "Vieux sage: tu as les 5 defenses. Tu peux terminer la quete.";
    addDialogButton("Terminer la quete", () => {
      finishFirstQuest();
      closeDialogue();
    });
    addDialogButton("Fermer", closeDialogue);
  } else if (state.quest === "active") {
    document.querySelector("#dialogText").textContent = `Vieux sage: il me faut 5 defenses sombres. Tu en as ${state.drops}/5.`;
    addDialogButton("Fermer", closeDialogue);
  } else {
    renderElianAfterFirstQuest();
  }
}

function renderElianAfterFirstQuest() {
  if (state.quest2 === "deliver") {
    document.querySelector("#dialogText").textContent = "Ahhh Mira m'a préparé un remède quelque peu spécial... ? Je peux te conférer des pouvoirs, attention, tu n'as qu'un seul choix et il est irréversible. Quelle classe choisis-tu ?";
    addDialogButton("Donner les ingredients prepares", () => {
      state.quest2 = "done";
      state.classQuest = "choose";
      dialogActions.innerHTML = "";
      renderClassChoice();
      updateUi();
    });
    addDialogButton("Fermer", closeDialogue);
    return;
  }

  if (state.classQuest === "choose") {
    renderClassChoice();
    return;
  }

  if (state.gateQuest === "available") {
    document.querySelector("#dialogText").textContent = `Vieux sage: ${state.chosenClass}, va maintenant voir le Garde d'Oklaoma en bas du chemin.`;
    addDialogButton("Fermer", closeDialogue);
    return;
  }

  document.querySelector("#dialogText").textContent = "Vieux sage: va voir Mira dans la maison, elle a la suite pour toi.";
  addDialogButton("Fermer", closeDialogue);
}

function renderClassChoice() {
  document.querySelector("#dialogText").textContent = "Vieux sage: choisis ta voie. Chaque classe changera ton avenir.";
  classes.forEach((item) => {
    addChoiceButton({
      label: item.label,
      desc: `${item.desc} Sort: ${item.spell}. Stat forte: ${labelStat(item.stat)}.`,
      sprite: state.classSprites[item.sprite],
      onClick: () => chooseClass(item)
    });
  });
  addDialogButton("Fermer", closeDialogue);
}

function chooseClass(item) {
  state.chosenClass = item.label;
  state.chosenClassKey = item.key;
  state.classQuest = "done";
  state.gateQuest = "available";
  const weapon = {
    id: `${item.key}-starter`,
    name: classWeapons[item.key].name,
    slot: "weapon",
    icon: classWeapons[item.key].icon,
    stats: { ...classWeapons[item.key].stats }
  };
  state.equipment.weapon = weapon;
  state.maxHp = 100 + totalStat("vitalite") + state.level * 12;
  state.hp = state.maxHp;
  closeDialogue();
  addFloatingLog(`Tu as choisi: ${item.label}. Arme equipee: ${weapon.name}.`);
  addLog(`Classe choisie: ${item.label}. Arme recue: ${weapon.name}.`);
  updateUi();
  drawPortrait();
  draw();
}

function addChoiceButton({ label, desc, sprite, onClick, color }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-card";
  if (color) button.style.background = `linear-gradient(180deg, ${color}, #5b382a)`;
  const preview = document.createElement("canvas");
  preview.width = 56;
  preview.height = 56;
  const previewCtx = preview.getContext("2d");
  if (sprite) {
    previewCtx.imageSmoothingEnabled = true;
    previewCtx.imageSmoothingQuality = "high";
    previewCtx.drawImage(sprite, 6, 4, 44, 50);
  } else if (color) {
    previewCtx.fillStyle = color;
    previewCtx.beginPath();
    previewCtx.arc(28, 28, 20, 0, Math.PI * 2);
    previewCtx.fill();
    previewCtx.fillStyle = "rgba(255,255,255,0.75)";
    previewCtx.fillRect(18, 24, 20, 8);
  }
  const text = document.createElement("span");
  text.innerHTML = `<strong>${label}</strong><small>${desc}</small>`;
  button.append(preview, text);
  button.addEventListener("click", onClick);
  dialogActions.append(button);
}

function renderVendorDialogue() {
  document.querySelector("#dialogText").textContent = "Borin: j'achete et je vends. Mira veut surement mes potions et ma menthe.";
  shopItems.forEach((item) => {
    addShopDialogButton(item, "Acheter", "potion", () => buyItem(item));
  });
  if (state.inventory.defenseSombre > 0) {
    addDialogButton("Vendre Defense sombre (+4 or)", () => {
      state.inventory.defenseSombre -= 1;
      state.gold += 4;
      addLog("Vente: Defense sombre.");
      updateUi();
      openDialogue({ name: "Borin le Vendeur", role: "vendor" });
    });
  }
  Object.entries(state.inventory).forEach(([key, count]) => {
    if (count > 0 && key !== "defenseSombre") {
      const item = shopItems.find((entry) => entry.key === key);
      if (item) addShopDialogButton(item, "Vendre", "potion", () => sellItem(item), Math.floor(item.price / 2));
    }
  });
  addDialogButton("Fermer", closeDialogue);
}

function addShopDialogButton(item, action, type, onClick, customPrice) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "shop-card";

  const icon = document.createElement("canvas");
  icon.width = 46;
  icon.height = 46;
  const iconCtx = icon.getContext("2d");
  if (type === "equipment") drawEquipmentShopIcon(iconCtx, item, 46);
  else drawConsumableIcon(iconCtx, item.key, 46);

  const text = document.createElement("span");
  const name = item.label || item.name;
  const price = customPrice ?? item.price;
  const meta = type === "equipment" ? formatItemStats(item.stats) : itemDescription(item.key);
  text.innerHTML = `<strong>${action} ${name}</strong><small>${meta}</small><em>${price} or</em>`;
  button.append(icon, text);
  button.addEventListener("click", onClick);
  dialogActions.append(button);
}

function drawEquipmentShopIcon(iconCtx, item, size) {
  const sprite = getEquipmentIcon(item.icon);
  iconCtx.clearRect(0, 0, size, size);
  iconCtx.fillStyle = "rgba(255, 249, 235, 0.16)";
  roundedRectOn(iconCtx, 0, 0, size, size, 10);
  iconCtx.fill();
  if (sprite) {
    iconCtx.imageSmoothingEnabled = true;
    iconCtx.imageSmoothingQuality = "high";
    iconCtx.drawImage(sprite, 4, 4, size - 8, size - 8);
    return;
  }
  iconCtx.save();
  iconCtx.translate(size / 2, size / 2);
  iconCtx.strokeStyle = "#f0dfb9";
  iconCtx.fillStyle = "#8f6848";
  iconCtx.lineWidth = 3;
  if (item.slot === "weapon") {
    iconCtx.beginPath();
    iconCtx.moveTo(-size * 0.22, size * 0.28);
    iconCtx.lineTo(size * 0.24, -size * 0.24);
    iconCtx.stroke();
    iconCtx.fillRect(-size * 0.26, size * 0.18, size * 0.18, size * 0.10);
  } else {
    iconCtx.beginPath();
    iconCtx.arc(0, -size * 0.06, size * 0.22, Math.PI, Math.PI * 2);
    iconCtx.lineTo(size * 0.22, size * 0.20);
    iconCtx.lineTo(-size * 0.22, size * 0.20);
    iconCtx.closePath();
    iconCtx.fill();
    iconCtx.stroke();
  }
  iconCtx.restore();
}

function drawConsumableIcon(iconCtx, key, size) {
  const palette = {
    potionVie: ["#d85f5f", "#ffd6cd"],
    potionMana: ["#5f8fd8", "#d4e5ff"],
    potionIvresse: ["#c45da7", "#ffe0f2"],
    menthe: ["#65b56c", "#dcffd9"]
  }[key] || ["#d49b48", "#fff0c4"];
  iconCtx.clearRect(0, 0, size, size);
  iconCtx.fillStyle = "rgba(255, 249, 235, 0.16)";
  roundedRectOn(iconCtx, 0, 0, size, size, 10);
  iconCtx.fill();
  if (key === "menthe") {
    iconCtx.fillStyle = palette[0];
    iconCtx.beginPath();
    iconCtx.ellipse(size * 0.40, size * 0.52, size * 0.18, size * 0.30, -0.7, 0, Math.PI * 2);
    iconCtx.ellipse(size * 0.60, size * 0.45, size * 0.18, size * 0.30, 0.7, 0, Math.PI * 2);
    iconCtx.fill();
    iconCtx.strokeStyle = palette[1];
    iconCtx.beginPath();
    iconCtx.moveTo(size * 0.34, size * 0.64);
    iconCtx.lineTo(size * 0.66, size * 0.34);
    iconCtx.stroke();
    return;
  }
  iconCtx.fillStyle = "#ecd6a9";
  iconCtx.fillRect(size * 0.42, size * 0.14, size * 0.16, size * 0.16);
  iconCtx.fillStyle = palette[0];
  iconCtx.beginPath();
  iconCtx.moveTo(size * 0.34, size * 0.30);
  iconCtx.lineTo(size * 0.66, size * 0.30);
  iconCtx.lineTo(size * 0.74, size * 0.78);
  iconCtx.quadraticCurveTo(size * 0.50, size * 0.92, size * 0.26, size * 0.78);
  iconCtx.closePath();
  iconCtx.fill();
  iconCtx.fillStyle = palette[1];
  iconCtx.fillRect(size * 0.42, size * 0.42, size * 0.16, size * 0.08);
}

function itemDescription(key) {
  return {
    potionVie: "Restaure des points de vie",
    potionMana: "Restaure l'energie magique",
    potionIvresse: "Ingredient de quete",
    menthe: "Herbe fraiche de quete"
  }[key] || "Objet marchand";
}

function buyItem(item) {
  if (state.gold < item.price) {
    document.querySelector("#dialogText").textContent = "Borin: tu n'as pas assez d'or.";
    return;
  }
  state.gold -= item.price;
  state.inventory[item.key] += 1;
  addLog(`Achat: ${item.label}.`);
  updateUi();
  openDialogue({ name: "Borin le Vendeur", role: "vendor" });
}

function sellItem(item) {
  if (state.inventory[item.key] <= 0) return;
  state.inventory[item.key] -= 1;
  state.gold += Math.floor(item.price / 2);
  addLog(`Vente: ${item.label}.`);
  updateUi();
  openDialogue({ name: "Borin le Vendeur", role: "vendor" });
}

function renderMiraDialogue() {
  if (state.quest2 === "locked") {
    document.querySelector("#dialogText").textContent = "Mira: aide d'abord le Vieux sage dehors, ensuite je te parlerai de mon melange.";
    addDialogButton("Fermer", closeDialogue);
  } else if (state.quest2 === "available") {
    document.querySelector("#dialogText").textContent = "Mira: il me faut 3 potions d'ivresse et 2 menthes. Borin les vend ici.";
    addDialogButton("Accepter", () => {
      state.quest2 = "active";
      closeDialogue();
      addLog("Quete de Mira acceptee.");
      updateUi();
    });
    addDialogButton("Fermer", closeDialogue);
  } else if (state.quest2 === "active" && state.inventory.potionIvresse >= 3 && state.inventory.menthe >= 2) {
    document.querySelector("#dialogText").textContent = "Mira: parfait, donne-moi les ingredients. Ensuite rapporte ce melange au Vieux sage.";
    addDialogButton("Donner les ingredients", () => {
      state.inventory.potionIvresse -= 3;
      state.inventory.menthe -= 2;
      state.quest2 = "deliver";
      closeDialogue();
      addLog("Ingredients donnes a Mira. Retourne voir le Vieux sage.");
      updateUi();
    });
    addDialogButton("Fermer", closeDialogue);
  } else if (state.quest2 === "active") {
    document.querySelector("#dialogText").textContent = `Mira: il manque encore ${Math.max(0, 3 - state.inventory.potionIvresse)} potion(s) et ${Math.max(0, 2 - state.inventory.menthe)} menthe(s).`;
    addDialogButton("Fermer", closeDialogue);
  } else {
    document.querySelector("#dialogText").textContent = "Mira: rapporte maintenant mon melange au Vieux sage.";
    addDialogButton("Fermer", closeDialogue);
  }
}

function renderGateGuardDialogue() {
  if (state.classQuest !== "done") {
    document.querySelector("#dialogText").textContent = "Garde: je ne parle pas aux hommes sans competence.";
    addDialogButton("Fermer", closeDialogue);
  } else if (state.gateQuest === "available") {
    document.querySelector("#dialogText").textContent = "Garde: montre-moi si tu es capable de rejoindre les terres d'Oklaoma.";
    addDialogButton("Affronter le garde", () => {
      state.gateQuest = "alignment";
      dialogActions.innerHTML = "";
      renderAlignmentChoice();
      addLog("Duel gagne contre le Garde d'Oklaoma.");
      updateUi();
    });
    addDialogButton("Fermer", closeDialogue);
  } else if (state.gateQuest === "alignment") {
    renderAlignmentChoice();
  } else {
    document.querySelector("#dialogText").textContent = "Garde: ton allegeance est pretee. Va vers Oklaoma.";
    addDialogButton("Fermer", closeDialogue);
  }
}

function renderAlignmentChoice() {
  document.querySelector("#dialogText").textContent = "Garde: a qui pretes-tu allegeance ?";
  alignments.forEach((item) => {
    addChoiceButton({
      label: item.label,
      desc: alignmentDescription(item.key),
      color: item.color,
      onClick: () => chooseAlignment(item)
    });
  });
  addDialogButton("Fermer", closeDialogue);
}

function alignmentDescription(key) {
  return {
    royale: "Bleu. Ordre, protection des routes et serment au royaume.",
    exiles: "Vert. Liberte, survie hors des lois et fraternite des bannis.",
    cartel: "Rouge. Influence, contrats, commerce dur et pouvoir dans l'ombre."
  }[key];
}

function chooseAlignment(item) {
  state.alignment = item.label;
  state.gateQuest = "done";
  state.area = "oklaoma";
  state.oklaomaMap = { x: 0, y: 0 };
  state.player = { x: 10, y: 7 };
  state.targetId = null;
  closeDialogue();
  addFloatingLog(`Tu es teleporte vers Oklaoma. Allegeance: ${item.label}.`);
  addLog(`Allegeance pretee: ${item.label}. Teleportation vers Oklaoma.`);
  updateUi();
  draw();
}

function addDialogButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  dialogActions.append(button);
}

function closeDialogue() {
  dialogPanel.classList.add("is-hidden");
}

function finishFirstQuest() {
  state.quest = "done";
  state.quest2 = "available";
  gainLevel();
  state.gold += 80;
  addFloatingLog("Quete terminee. La deuxieme quete est maintenant disponible dans la maison.");
  addLog("Quete terminee: +1 niveau, +80 or. Quete 2 debloquee.");
  updateUi();
  draw();
}

function gainXp(amount) {
  state.xp += amount;
  while (state.xp >= xpNeed()) {
    state.xp -= xpNeed();
    state.level += 1;
    state.statPoints += 6;
    if (state.level % 5 === 0) state.skillPoints += 1;
    state.maxHp += 12;
    state.hp = state.maxHp;
    addLog(`Niveau ${state.level} atteint.`);
  }
}

function gainLevel() {
  state.xp = 0;
  state.level += 1;
  state.statPoints += 6;
  if (state.level % 5 === 0) state.skillPoints += 1;
  state.maxHp += 12;
  state.hp = state.maxHp;
  addLog(`Niveau ${state.level} atteint.`);
}

function useSkill(skill) {
  skill = effectiveSkill(skill);
  if (state.level < skill.level || (state.cooldowns[skill.id] || 0) > 0) return;
  const actionCost = skill.paCost || 1;
  if (state.pa < actionCost) {
    addLog("Tu n'as plus assez de PA.");
    return;
  }

  if (skill.heal) {
    const heal = skill.heal + ((state.skillLevels[skill.id] || 1) - 1) * 8;
    state.pa -= actionCost;
    state.hp = Math.min(state.maxHp, state.hp + heal);
    state.cooldowns[skill.id] = skill.cooldown;
    state.lastDamage = `+${heal} PV`;
    addLog(`${skill.name}: +${heal} PV.`);
    addCombatToast(`${skill.name}: +${heal} PV`);
    endTurnCooldowns(skill.id);
    updateUi();
    draw();
    return;
  }

  if (skill.boost) {
    state.pa -= actionCost;
    state.boostTurns = 3;
    state.boostDamage = skill.boost;
    state.cooldowns[skill.id] = skill.cooldown;
    state.lastDamage = `Boost actif: +${skill.boost} degats`;
    addLog(`${skill.name} augmente tes degats pour quelques tours.`);
    endTurnCooldowns(skill.id);
    updateUi();
    return;
  }

  const monster = selectedMonster();
  if (!monster || !["outside", "oklaoma"].includes(state.area) || monster.x !== state.player.x || monster.y !== state.player.y) {
    state.lastDamage = "Aucun monstre sur ta case.";
    updateUi();
    return;
  }

  const damage = computeSkillDamage(skill);
  state.pa -= actionCost;
  monster.hp = Math.max(0, monster.hp - damage);
  state.cooldowns[skill.id] = skill.cooldown;
  state.lastDamage = `${skill.name}: -${damage} PV`;
  gainXp(4);

  if (monster.hp <= 0) {
    monster.respawnAt = Date.now() + 20000;
    state.targetId = null;
    if (state.quest === "active") {
      state.drops += 1;
      state.inventory.defenseSombre += 1;
    }
    if (state.area === "oklaoma") registerOklaomaKill(monster);
    const rewardXp = (monster.xp || monster.level * 12) + 12;
    gainXp(rewardXp);
    state.gold += 8;
    state.lastDamage = `${monster.name} vaincu. Respawn dans 20 sec.`;
    addCombatToast(`${monster.name} vaincu: +${rewardXp} XP`);
    addLog(`${monster.name} vaincu: +${rewardXp} XP${monster.drop ? `, +1 ${monster.drop}` : ""}.`);
  } else {
    addLog(`${skill.name} inflige ${damage} degats.`);
    addCombatToast(`${skill.name}: -${damage} PV`);
  }

  if (state.boostTurns > 0) {
    state.boostTurns -= 1;
    if (state.boostTurns === 0) state.boostDamage = 0;
  }
  endTurnCooldowns(skill.id);
  updateUi();
  draw();
}

function registerOklaomaKill(monster) {
  Object.entries(oklaomaQuestDefs).forEach(([key, def]) => {
    if (state.oklaomaQuests[key] === "active" && def.target === monster.name) {
      state.inventory[`ok_${key}`] = (state.inventory[`ok_${key}`] || 0) + 1;
    }
  });
}

function computeSkillDamage(skill) {
  const skillBonus = ((state.skillLevels[skill.id] || 1) - 1) * 5;
  if (skill.id !== "classAttack") {
    return skill.damage + skillBonus + state.boostDamage;
  }
  const classInfo = currentClass();
  const ratioStat = classInfo ? totalStat(classInfo.stat) : Math.floor(totalStat("force") / 2);
  return Math.floor((skill.damage || 8) + ratioStat * 0.9 + skillBonus + state.boostDamage);
}

function endTurnCooldowns(exceptId) {
  Object.keys(state.cooldowns).forEach((id) => {
    if (id !== exceptId && state.cooldowns[id] > 0) state.cooldowns[id] -= 1;
  });
}

function renderSkills() {
  skillList.innerHTML = "";
  document.querySelector("#skillHint").textContent = `Niveau ${state.level}`;
  skills.forEach((skill, index) => {
    const displaySkill = effectiveSkill(skill);
    const locked = state.level < displaySkill.level;
    const cooldown = state.cooldowns[displaySkill.id] || 0;
    const button = document.createElement("button");
    button.className = "skill-card";
    button.type = "button";
    button.disabled = locked || cooldown > 0;
    const icon = document.createElement("i");
    const iconCanvas = document.createElement("canvas");
    iconCanvas.width = 96;
    iconCanvas.height = 96;
    const iconCtx = iconCanvas.getContext("2d");
    const iconSprite = getSkillIcon(displaySkill, index);
    if (iconSprite) {
      iconCtx.imageSmoothingEnabled = true;
      iconCtx.imageSmoothingQuality = "high";
      iconCtx.drawImage(iconSprite, 0, 0, 96, 96);
    } else {
      icon.textContent = displaySkill.icon;
    }
    if (iconSprite) icon.append(iconCanvas);
    const text = document.createElement("span");
    text.innerHTML = `<strong>${displaySkill.name}</strong><small>${locked ? `Debloque niveau ${displaySkill.level}` : displaySkill.desc}</small>`;
    const cd = document.createElement("b");
    cd.textContent = cooldown > 0 ? cooldown : "";
    button.append(icon, text, cd);
    button.addEventListener("click", () => useSkill(displaySkill));
    skillList.append(button);
  });
}

function effectiveSkill(skill) {
  const classInfo = currentClass();
  const override = classInfo ? classSkillSets[classInfo.key]?.[skill.id] : null;
  if (!override) return { ...skill };
  const statDesc = skill.id === "classAttack" ? ` Ratio ${labelStat(classInfo.stat)}.` : "";
  return {
    ...skill,
    ...override,
    desc: `${override.desc}${statDesc}`,
    icon: classInfo.label[0],
    classKey: classInfo.key
  };
}

function getSkillIcon(skill, fallbackIndex) {
  ensureSkillIcons();
  const classKey = currentClass()?.key || "novice";
  const atlasIndex = skillAtlasIndex(classKey, skill.id);
  if (state.skillIcons[atlasIndex]) return state.skillIcons[atlasIndex];
  return illustratedSkillIcon(skill, fallbackIndex);
}

function skillAtlasIndex(classKey, skillId) {
  const maps = {
    novice: { classAttack: 0, heal: 5, boost: 6, weapon: 0, ulti: 8 },
    guerrier: { classAttack: 0, heal: 5, boost: 6, weapon: 7, ulti: 8 },
    archer: { classAttack: 1, heal: 5, boost: 6, weapon: 1, ulti: 8 },
    moine: { classAttack: 9, heal: 5, boost: 6, weapon: 2, ulti: 8 },
    magicien: { classAttack: 3, heal: 5, boost: 6, weapon: 2, ulti: 8 },
    assassin: { classAttack: 4, heal: 5, boost: 6, weapon: 4, ulti: 8 }
  };
  return (maps[classKey] || maps.novice)[skillId] ?? 0;
}

function renderMenuIcons() {
  document.querySelectorAll("[data-game-menu]").forEach((button) => {
    const label = button.getAttribute("aria-label") || button.textContent;
    let icon = button.querySelector("canvas");
    if (!icon) {
      button.textContent = "";
      icon = document.createElement("canvas");
      button.append(icon);
    }
    let title = button.querySelector("span");
    if (!title) {
      title = document.createElement("span");
      button.append(title);
    }
    title.textContent = label;
    icon.width = 96;
    icon.height = 96;
    drawMenuIcon(icon, button.dataset.gameMenu);
    button.title = label;
  });
}

function drawMenuIcon(source, type) {
  const ictx = source.getContext("2d");
  ictx.clearRect(0, 0, source.width, source.height);
  ictx.imageSmoothingEnabled = true;
  ictx.imageSmoothingQuality = "high";
  if (drawReferenceMenuIcon(ictx, type)) return;
  if (type === "map") {
    drawMapMenuIcon(ictx);
    return;
  }
  if (type === "inventory") {
    drawRpgBagIcon(ictx);
    return;
  }
  if (type === "skills") {
    drawRpgBookIcon(ictx, "#5c3a87", "#b48cff", "diamond");
    return;
  }
  if (type === "quests") {
    drawRpgBookIcon(ictx, "#9a4b24", "#ffad3e", "flame");
    return;
  }
  if (type === "profile") {
    drawRpgProfileEmblem(ictx);
    return;
  }
  drawAvatarIllustrationFrame(ictx);
  ictx.save();
  ictx.lineCap = "round";
  ictx.lineJoin = "round";
  if (type === "profile") {
    drawProfileGlyph(ictx);
  } else if (type === "inventory") {
    drawBagGlyph(ictx);
  } else if (type === "skills") {
    drawGrimoireGlyph(ictx);
  } else {
    drawQuestScrollGlyph(ictx);
  }
  ictx.restore();
}

function drawReferenceMenuIcon(ictx, type) {
  if (type === "profile") {
    drawProfileSkinOnlyIcon(ictx);
    return true;
  }
  const cutoutIcons = {
    inventory: menuIconBag,
    skills: menuIconGrimoire,
    quests: menuIconBook
  };
  const cutoutIcon = cutoutIcons[type];
  if (cutoutIcon?.complete && cutoutIcon.naturalWidth > 0) {
    drawMenuCutoutIcon(ictx, cutoutIcon);
    return true;
  }
  if (!menuReferenceSheet.complete || menuReferenceSheet.naturalWidth === 0) return false;
  const cells = {
    profile: [0, 3],
    inventory: [3, 0],
    skills: [3, 1],
    quests: [0, 2]
  };
  const cell = cells[type];
  if (!cell) return false;
  const source = cutReferenceCell(menuReferenceSheet, cell[0], cell[1], 4, 4);
  ictx.drawImage(source, 0, 0, ictx.canvas.width, ictx.canvas.height);
  if (type === "profile") drawPlayerInProfileEmblem(ictx);
  return true;
}

function drawProfileSkinOnlyIcon(ictx) {
  const sprite = getPlayerSprite();
  if (!sprite) return;
  const size = ictx.canvas.width;
  ictx.save();
  ictx.clearRect(0, 0, size, size);
  ictx.imageSmoothingEnabled = true;
  ictx.imageSmoothingQuality = "high";
  const glow = ictx.createRadialGradient(size * 0.50, size * 0.58, size * 0.10, size * 0.50, size * 0.58, size * 0.44);
  glow.addColorStop(0, "rgba(255, 241, 184, 0.42)");
  glow.addColorStop(1, "rgba(255, 241, 184, 0)");
  ictx.fillStyle = glow;
  ictx.beginPath();
  ictx.arc(size / 2, size * 0.56, size * 0.44, 0, Math.PI * 2);
  ictx.fill();
  ictx.shadowColor = "rgba(34, 21, 12, 0.34)";
  ictx.shadowBlur = 7;
  ictx.shadowOffsetY = 5;
  ictx.drawImage(sprite, size * 0.12, size * 0.02, size * 0.76, size * 0.96);
  ictx.restore();
}

function drawMenuCutoutIcon(ictx, image) {
  const size = ictx.canvas.width;
  ictx.save();
  ictx.clearRect(0, 0, size, size);
  const glow = ictx.createRadialGradient(size * 0.50, size * 0.55, size * 0.10, size * 0.50, size * 0.55, size * 0.46);
  glow.addColorStop(0, "rgba(255, 241, 184, 0.42)");
  glow.addColorStop(1, "rgba(255, 241, 184, 0)");
  ictx.fillStyle = glow;
  ictx.beginPath();
  ictx.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2);
  ictx.fill();
  ictx.shadowColor = "rgba(34, 21, 12, 0.34)";
  ictx.shadowBlur = 8;
  ictx.shadowOffsetY = 4;
  const padding = 7;
  ictx.drawImage(image, padding, padding, size - padding * 2, size - padding * 2);
  ictx.restore();
}

function drawMapMenuIcon(ictx) {
  const size = ictx.canvas.width;
  ictx.save();
  ictx.clearRect(0, 0, size, size);
  const glow = ictx.createRadialGradient(size * 0.50, size * 0.55, size * 0.10, size * 0.50, size * 0.55, size * 0.46);
  glow.addColorStop(0, "rgba(255, 241, 184, 0.42)");
  glow.addColorStop(1, "rgba(255, 241, 184, 0)");
  ictx.fillStyle = glow;
  ictx.beginPath();
  ictx.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2);
  ictx.fill();

  ictx.translate(size * 0.15, size * 0.20);
  ictx.rotate(-0.08);
  ictx.fillStyle = "#e7c886";
  ictx.strokeStyle = "#7a4d25";
  ictx.lineWidth = 4;
  ictx.beginPath();
  ictx.roundRect(0, 0, size * 0.70, size * 0.58, 10);
  ictx.fill();
  ictx.stroke();

  ictx.strokeStyle = "rgba(113, 79, 39, 0.54)";
  ictx.lineWidth = 2;
  ictx.beginPath();
  ictx.moveTo(size * 0.23, size * 0.03);
  ictx.lineTo(size * 0.18, size * 0.55);
  ictx.moveTo(size * 0.47, size * 0.04);
  ictx.lineTo(size * 0.51, size * 0.55);
  ictx.stroke();

  ictx.strokeStyle = "#5d8c47";
  ictx.lineWidth = 5;
  ictx.beginPath();
  ictx.moveTo(size * 0.10, size * 0.42);
  ictx.bezierCurveTo(size * 0.22, size * 0.26, size * 0.36, size * 0.45, size * 0.50, size * 0.24);
  ictx.bezierCurveTo(size * 0.57, size * 0.14, size * 0.64, size * 0.15, size * 0.67, size * 0.12);
  ictx.stroke();

  ictx.fillStyle = "#c44733";
  ictx.beginPath();
  ictx.arc(size * 0.55, size * 0.23, size * 0.055, 0, Math.PI * 2);
  ictx.fill();
  ictx.restore();
}

function cutReferenceCell(image, col, row, cols, rows) {
  const cellW = image.naturalWidth / cols;
  const cellH = image.naturalHeight / rows;
  const source = document.createElement("canvas");
  source.width = 256;
  source.height = 256;
  const sctx = source.getContext("2d");
  sctx.imageSmoothingEnabled = true;
  sctx.imageSmoothingQuality = "high";
  const padding = 8;
  const scale = Math.min((source.width - padding * 2) / cellW, (source.height - padding * 2) / cellH);
  const drawW = cellW * scale;
  const drawH = cellH * scale;
  sctx.drawImage(
    image,
    cellW * col,
    cellH * row,
    cellW,
    cellH,
    (source.width - drawW) / 2,
    (source.height - drawH) / 2,
    drawW,
    drawH
  );
  return source;
}

function softenReferenceBackground(source) {
  const sctx = source.getContext("2d");
  let image;
  try {
    image = sctx.getImageData(0, 0, source.width, source.height);
  } catch (error) {
    return;
  }
  const data = image.data;
  const samples = [
    [8, 8], [source.width - 9, 8],
    [8, source.height - 9], [source.width - 9, source.height - 9]
  ].map(([x, y]) => {
    const i = (y * source.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  });
  const bg = samples.reduce((acc, item) => [acc[0] + item[0], acc[1] + item[1], acc[2] + item[2]], [0, 0, 0])
    .map((value) => value / samples.length);
  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - bg[0];
    const dg = data[i + 1] - bg[1];
    const db = data[i + 2] - bg[2];
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist < 34) data[i + 3] = Math.max(0, data[i + 3] - 190);
    else if (dist < 48) data[i + 3] = Math.max(55, data[i + 3] - 90);
  }
  sctx.putImageData(image, 0, 0);
}

function drawPlayerInProfileEmblem(ictx) {
  const sprite = getPlayerSprite();
  if (!sprite) return;
  ictx.save();
  ictx.beginPath();
  ictx.arc(48, 52, 25, 0, Math.PI * 2);
  ictx.clip();
  ictx.drawImage(sprite, 22, 17, 52, 69);
  ictx.restore();
}

function drawRpgShadow(ictx, x, y, rx, ry) {
  ictx.fillStyle = "rgba(46, 28, 14, 0.28)";
  ictx.beginPath();
  ictx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ictx.fill();
}

function drawRpgBagIcon(ictx) {
  const w = ictx.canvas.width;
  const h = ictx.canvas.height;
  drawRpgShadow(ictx, w * 0.50, h * 0.86, w * 0.34, h * 0.08);
  const leather = ictx.createLinearGradient(16, 10, 82, 82);
  leather.addColorStop(0, "#b87a39");
  leather.addColorStop(0.56, "#59331c");
  leather.addColorStop(1, "#24140c");
  ictx.strokeStyle = "#2c170d";
  ictx.lineWidth = 7;
  ictx.lineCap = "round";
  ictx.beginPath();
  ictx.moveTo(26, 33);
  ictx.bezierCurveTo(25, 8, 72, 7, 73, 32);
  ictx.stroke();
  ictx.fillStyle = leather;
  roundedRectOn(ictx, 13, 27, 70, 55, 12);
  ictx.fill();
  ictx.stroke();
  const blue = ictx.createLinearGradient(20, 22, 76, 54);
  blue.addColorStop(0, "#2e7bd7");
  blue.addColorStop(1, "#16376c");
  ictx.fillStyle = blue;
  roundedRectOn(ictx, 17, 25, 62, 30, 10);
  ictx.fill();
  ictx.strokeStyle = "#d5a34c";
  ictx.lineWidth = 3;
  ictx.stroke();
  ictx.fillStyle = "#7b4a25";
  roundedRectOn(ictx, 10, 52, 18, 27, 6);
  ictx.fill();
  roundedRectOn(ictx, 68, 52, 18, 27, 6);
  ictx.fill();
  ictx.strokeStyle = "#2c170d";
  ictx.lineWidth = 4;
  ictx.stroke();
  ictx.fillStyle = "#44d9ff";
  ictx.beginPath();
  ictx.moveTo(48, 32);
  ictx.lineTo(60, 42);
  ictx.lineTo(55, 58);
  ictx.lineTo(41, 58);
  ictx.lineTo(36, 42);
  ictx.closePath();
  ictx.fill();
  ictx.strokeStyle = "#f6e3a0";
  ictx.stroke();
}

function drawRpgBookIcon(ictx, cover, accent, mark) {
  drawRpgShadow(ictx, 48, 84, 34, 7);
  const spine = ictx.createLinearGradient(14, 22, 22, 78);
  spine.addColorStop(0, "#b97832");
  spine.addColorStop(1, "#5a2d17");
  ictx.fillStyle = spine;
  roundedRectOn(ictx, 13, 22, 19, 57, 7);
  ictx.fill();
  const pages = ictx.createLinearGradient(22, 25, 78, 82);
  pages.addColorStop(0, "#fff0c8");
  pages.addColorStop(1, "#b58a54");
  ictx.fillStyle = pages;
  roundedRectOn(ictx, 18, 25, 65, 55, 7);
  ictx.fill();
  ictx.strokeStyle = "#3b2010";
  ictx.lineWidth = 5;
  ictx.stroke();
  const coverGrad = ictx.createLinearGradient(24, 18, 78, 76);
  coverGrad.addColorStop(0, cover);
  coverGrad.addColorStop(1, "#24182f");
  ictx.fillStyle = coverGrad;
  roundedRectOn(ictx, 22, 17, 58, 54, 8);
  ictx.fill();
  ictx.strokeStyle = "#d7ab55";
  ictx.lineWidth = 4;
  ictx.stroke();
  ictx.strokeStyle = "#f4d583";
  ictx.lineWidth = 3;
  ictx.strokeRect(30, 26, 42, 36);
  ictx.fillStyle = accent;
  if (mark === "flame") {
    ictx.beginPath();
    ictx.moveTo(49, 54);
    ictx.bezierCurveTo(34, 42, 45, 28, 51, 21);
    ictx.bezierCurveTo(52, 35, 66, 38, 57, 56);
    ictx.bezierCurveTo(55, 61, 47, 61, 49, 54);
    ictx.fill();
  } else {
    ictx.beginPath();
    ictx.moveTo(51, 27);
    ictx.lineTo(64, 40);
    ictx.lineTo(51, 58);
    ictx.lineTo(38, 40);
    ictx.closePath();
    ictx.fill();
    ictx.strokeStyle = "#efe4ff";
    ictx.lineWidth = 2;
    ictx.stroke();
  }
}

function drawRpgProfileEmblem(ictx) {
  const sprite = getPlayerSprite();
  drawRpgShadow(ictx, 48, 85, 36, 8);
  const gold = ictx.createLinearGradient(15, 10, 82, 88);
  gold.addColorStop(0, "#fff0a3");
  gold.addColorStop(0.48, "#c98722");
  gold.addColorStop(1, "#6b3b11");
  ictx.fillStyle = gold;
  ictx.beginPath();
  ictx.arc(48, 50, 36, 0, Math.PI * 2);
  ictx.fill();
  ictx.fillStyle = "#8e2f23";
  ictx.beginPath();
  ictx.arc(48, 50, 28, 0, Math.PI * 2);
  ictx.fill();
  ictx.strokeStyle = "#42180f";
  ictx.lineWidth = 4;
  ictx.stroke();
  ictx.fillStyle = gold;
  ictx.beginPath();
  ictx.moveTo(30, 20);
  ictx.lineTo(38, 32);
  ictx.lineTo(48, 17);
  ictx.lineTo(58, 32);
  ictx.lineTo(66, 20);
  ictx.lineTo(63, 39);
  ictx.lineTo(33, 39);
  ictx.closePath();
  ictx.fill();
  ictx.strokeStyle = "#5b2d11";
  ictx.stroke();
  if (sprite) {
    ictx.save();
    ictx.beginPath();
    ictx.arc(48, 53, 24, 0, Math.PI * 2);
    ictx.clip();
    ictx.drawImage(sprite, 23, 17, 50, 68);
    ictx.restore();
  }
}

function illustratedSkillIcon(skill, fallbackIndex = 0) {
  const classKey = currentClass()?.key || "novice";
  const cacheKey = `${classKey}:${skill.id}:${skill.name}:avatarstyle`;
  illustratedSkillIcon.cache = illustratedSkillIcon.cache || {};
  if (illustratedSkillIcon.cache[cacheKey]) return illustratedSkillIcon.cache[cacheKey];
  const source = document.createElement("canvas");
  source.width = 72;
  source.height = 72;
  const ictx = source.getContext("2d");
  const palette = skillPalette(classKey, skill.id, fallbackIndex);
  drawAvatarIllustrationFrame(ictx);
  drawClassObjectGlyph(ictx, classKey, skill.id, palette, source.width);
  illustratedSkillIcon.cache[cacheKey] = source;
  return source;
}

function drawProfileGlyph(ictx) {
  const sprite = state.sprites[2];
  if (sprite) {
    drawSpriteRegionIcon(ictx, sprite, 0.02, 0.26, 0.52, 0.44, 0.16, 0.13, 0.72, 0.72);
    return;
  }
  drawProfileBadgeFallback(ictx);
}

function drawBagGlyph(ictx) {
  ensureClassSprites();
  const sprite = state.classSprites[5];
  if (sprite) {
    drawSpriteRegionIcon(ictx, sprite, 0.58, 0.08, 0.38, 0.78, 0.12, 0.03, 0.76, 0.90);
    return;
  }
  drawBagGlyphFallback(ictx);
}

function drawGrimoireGlyph(ictx) {
  const sprite = state.sprites[2];
  if (sprite) {
    drawSpriteRegionIcon(ictx, sprite, 0.00, 0.32, 0.50, 0.36, 0.13, 0.18, 0.72, 0.60);
    return;
  }
  drawGrimoireGlyphFallback(ictx);
}

function drawQuestScrollGlyph(ictx) {
  const sprite = state.sprites[2];
  if (sprite) {
    drawSpriteRegionIcon(ictx, sprite, 0.48, 0.28, 0.30, 0.38, 0.24, 0.10, 0.58, 0.72);
    return;
  }
  drawQuestScrollGlyphFallback(ictx);
}

function drawAvatarIllustrationFrame(ictx) {
  const w = ictx.canvas.width;
  const h = ictx.canvas.height;
  ictx.clearRect(0, 0, w, h);
  const gradient = ictx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#d8ecff");
  gradient.addColorStop(0.52, "#d7b370");
  gradient.addColorStop(1, "#8a5e38");
  ictx.fillStyle = gradient;
  roundedRectOn(ictx, 0, 0, w, h, Math.max(12, w * 0.20));
  ictx.fill();
  ictx.fillStyle = "rgba(255,255,255,0.32)";
  ictx.beginPath();
  ictx.ellipse(w * 0.30, h * 0.22, w * 0.26, h * 0.20, -0.4, 0, Math.PI * 2);
  ictx.fill();
  ictx.fillStyle = "rgba(60,35,20,0.10)";
  roundedRectOn(ictx, w * 0.06, h * 0.07, w * 0.88, h * 0.86, Math.max(10, w * 0.16));
  ictx.fill();
  ictx.fillStyle = "rgba(122, 164, 92, 0.18)";
  ictx.beginPath();
  ictx.ellipse(w * 0.52, h * 0.84, w * 0.36, h * 0.10, 0, 0, Math.PI * 2);
  ictx.fill();
}

function currentMenuSprite() {
  ensureClassSprites();
  const classInfo = currentClass();
  if (classInfo && state.classSprites[classInfo.sprite]) return state.classSprites[classInfo.sprite];
  return state.sprites[0] || null;
}

function drawSpriteRegionIcon(ictx, sprite, sxRatio, syRatio, swRatio, shRatio, dxRatio, dyRatio, dwRatio, dhRatio) {
  if (!sprite) return;
  const w = ictx.canvas.width;
  const h = ictx.canvas.height;
  drawItemShadow(ictx, w * 0.52, h * 0.86, w * 0.32, h * 0.08);
  ictx.save();
  ictx.imageSmoothingEnabled = true;
  ictx.imageSmoothingQuality = "high";
  ictx.drawImage(
    sprite,
    sprite.width * sxRatio,
    sprite.height * syRatio,
    sprite.width * swRatio,
    sprite.height * shRatio,
    w * dxRatio,
    h * dyRatio,
    w * dwRatio,
    h * dhRatio
  );
  ictx.restore();
}

function drawProfileBadgeFallback(ictx) {
  drawItemShadow(ictx, 32, 57, 22, 6);
  ictx.fillStyle = "#fff1ca";
  roundedRectOn(ictx, 15, 10, 34, 46, 12);
  ictx.fill();
  ictx.fillStyle = "#dba87c";
  ictx.beginPath();
  ictx.arc(32, 26, 10, 0, Math.PI * 2);
  ictx.fill();
  ictx.fillStyle = "#6b8f55";
  roundedRectOn(ictx, 20, 38, 24, 14, 8);
  ictx.fill();
}

function drawBagGlyphFallback(ictx) {
  drawItemShadow(ictx, 32, 57, 23, 6);
  ictx.fillStyle = "#8a5635";
  roundedRectOn(ictx, 12, 19, 40, 35, 13);
  ictx.fill();
  ictx.strokeStyle = "#f0d79d";
  ictx.lineWidth = 4;
  ictx.beginPath();
  ictx.arc(32, 22, 13, Math.PI, Math.PI * 2);
  ictx.stroke();
}

function drawGrimoireGlyphFallback(ictx) {
  drawItemShadow(ictx, 33, 57, 22, 6);
  ictx.fillStyle = "#59428f";
  roundedRectOn(ictx, 13, 9, 40, 47, 11);
  ictx.fill();
  ictx.fillStyle = "#9bdfff";
  ictx.beginPath();
  ictx.arc(32, 33, 9, 0, Math.PI * 2);
  ictx.fill();
}

function drawQuestScrollGlyphFallback(ictx) {
  drawItemShadow(ictx, 32, 57, 22, 6);
  ictx.fillStyle = "#fff1ca";
  roundedRectOn(ictx, 12, 10, 40, 45, 11);
  ictx.fill();
  ictx.strokeStyle = "#7c9b51";
  ictx.lineWidth = 3;
  ictx.beginPath();
  ictx.moveTo(24, 27);
  ictx.lineTo(40, 27);
  ictx.moveTo(24, 36);
  ictx.lineTo(37, 36);
  ictx.stroke();
}

function drawItemShadow(ictx, x, y, rx, ry) {
  ictx.fillStyle = "rgba(56, 35, 24, 0.20)";
  ictx.beginPath();
  ictx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ictx.fill();
}

function skillPalette(classKey, skillId, index) {
  const base = {
    guerrier: ["#f4c36d", "#8d4635", "#f5df9d"],
    archer: ["#a9d56f", "#3e7a4b", "#e7f4b4"],
    moine: ["#f2dc8e", "#7a6a3e", "#fff1b8"],
    magicien: ["#9fd7ff", "#4b4f9b", "#d7f3ff"],
    assassin: ["#b79be8", "#4b365f", "#f1ddff"],
    novice: ["#d8b982", "#8d623e", "#fff0c4"]
  }[classKey] || ["#d8b982", "#8d623e", "#fff0c4"];
  const accent = {
    heal: "#8ee898",
    boost: "#ffd65f",
    weapon: base[2],
    ulti: "#fff4b5",
    classAttack: base[2]
  }[skillId] || base[2];
  return { bg: base[0], dark: base[1], accent, skin: "#dba87c" };
}

function drawClassObjectGlyph(ictx, classKey, skillId, palette, size = 72) {
  ictx.save();
  ictx.lineCap = "round";
  ictx.lineJoin = "round";

  if (skillId === "heal") {
    const sprite = state.classSprites[5];
    if (sprite) drawSpriteRegionIcon(ictx, sprite, 0.78, 0.28, 0.16, 0.36, 0.27, 0.12, 0.50, 0.72);
    else drawAvatarPotionGlyph(ictx, classKey === "magicien" ? "#5f8fd8" : "#d85f5f", size);
  } else if (skillId === "boost") {
    const sprite = state.classSprites[classSpriteIndexForKey(classKey)] || currentMenuSprite();
    drawClassAccessoryIcon(ictx, sprite, classKey, "boost");
    drawAvatarAuraOverlay(ictx, palette, size);
  } else if (skillId === "ulti") {
    const sprite = state.classSprites[classSpriteIndexForKey(classKey)] || currentMenuSprite();
    drawClassAccessoryIcon(ictx, sprite, classKey, "ulti");
    drawAvatarUltimateOverlay(ictx, palette, size);
  } else {
    const sprite = state.classSprites[classSpriteIndexForKey(classKey)] || currentMenuSprite();
    if (sprite) drawClassAccessoryIcon(ictx, sprite, classKey, skillId);
    else if (classKey === "archer") drawBowGlyph(ictx, palette);
    else if (classKey === "magicien") drawOrbStaffGlyph(ictx, palette);
    else if (classKey === "moine") drawMonkStaffGlyph(ictx, palette);
    else if (classKey === "assassin") drawDaggerGlyph(ictx, palette);
    else drawSwordGlyph(ictx, palette);
  }
  ictx.restore();
}

function drawClassAccessoryIcon(ictx, sprite, classKey, skillId) {
  if (!sprite) return false;
  const crops = {
    guerrier: skillId === "boost"
      ? [0.50, 0.25, 0.40, 0.48, 0.14, 0.13, 0.72, 0.72]
      : [0.00, 0.18, 0.38, 0.62, 0.12, 0.05, 0.76, 0.86],
    archer: [0.00, 0.20, 0.42, 0.60, 0.12, 0.06, 0.76, 0.84],
    moine: [0.00, 0.08, 0.40, 0.82, 0.18, 0.00, 0.66, 0.96],
    magicien: [0.00, 0.02, 0.38, 0.86, 0.18, 0.00, 0.66, 0.98],
    assassin: [0.00, 0.34, 0.34, 0.40, 0.20, 0.14, 0.60, 0.68],
    novice: [0.00, 0.18, 0.38, 0.62, 0.12, 0.05, 0.76, 0.86]
  };
  drawSpriteRegionIcon(ictx, sprite, ...(crops[classKey] || crops.novice));
  return true;
}

function classSpriteIndexForKey(classKey) {
  return {
    guerrier: 0,
    archer: 1,
    moine: 2,
    magicien: 3,
    assassin: 4,
    novice: 0
  }[classKey] ?? 0;
}

function drawSwordGlyph(ictx, palette) {
  drawItemShadow(ictx, 36, 62, 24, 7);
  ictx.strokeStyle = "#5b3828";
  ictx.lineWidth = 12;
  ictx.beginPath();
  ictx.moveTo(24, 56);
  ictx.lineTo(50, 14);
  ictx.stroke();
  ictx.strokeStyle = "#f6ead0";
  ictx.lineWidth = 8;
  ictx.beginPath();
  ictx.moveTo(25, 55);
  ictx.lineTo(50, 14);
  ictx.stroke();
  ictx.strokeStyle = "#b86e40";
  ictx.lineWidth = 6;
  ictx.beginPath();
  ictx.moveTo(29, 48);
  ictx.lineTo(18, 39);
  ictx.moveTo(29, 48);
  ictx.lineTo(41, 57);
  ictx.stroke();
}

function drawBowGlyph(ictx, palette) {
  drawItemShadow(ictx, 36, 62, 24, 7);
  ictx.strokeStyle = "#5f3d2b";
  ictx.lineWidth = 8;
  ictx.beginPath();
  ictx.arc(39, 36, 22, -1.25, 1.25);
  ictx.stroke();
  ictx.strokeStyle = "#c68a45";
  ictx.lineWidth = 5;
  ictx.beginPath();
  ictx.arc(39, 36, 20, -1.22, 1.22);
  ictx.stroke();
  ictx.strokeStyle = "#fff2cf";
  ictx.lineWidth = 2;
  ictx.beginPath();
  ictx.moveTo(46, 14);
  ictx.lineTo(46, 58);
  ictx.stroke();
  ictx.strokeStyle = palette.accent;
  ictx.lineWidth = 4;
  ictx.beginPath();
  ictx.moveTo(18, 36);
  ictx.lineTo(55, 36);
  ictx.stroke();
}

function drawMonkStaffGlyph(ictx, palette) {
  drawItemShadow(ictx, 36, 62, 24, 7);
  ictx.strokeStyle = "#5f3d2b";
  ictx.lineWidth = 9;
  ictx.beginPath();
  ictx.moveTo(29, 58);
  ictx.lineTo(45, 14);
  ictx.stroke();
  ictx.strokeStyle = "#9b6b38";
  ictx.lineWidth = 5;
  ictx.beginPath();
  ictx.moveTo(29, 58);
  ictx.lineTo(45, 14);
  ictx.stroke();
  ictx.fillStyle = "#fff1a8";
  ictx.beginPath();
  ictx.arc(45, 14, 10, 0, Math.PI * 2);
  ictx.fill();
  ictx.strokeStyle = "#fff5c9";
  ictx.lineWidth = 3;
  ictx.beginPath();
  ictx.arc(35, 35, 15, 0.3, Math.PI * 1.7);
  ictx.stroke();
}

function drawOrbStaffGlyph(ictx, palette) {
  drawItemShadow(ictx, 36, 62, 24, 7);
  ictx.strokeStyle = "#47385f";
  ictx.lineWidth = 9;
  ictx.beginPath();
  ictx.moveTo(28, 58);
  ictx.lineTo(42, 20);
  ictx.stroke();
  ictx.strokeStyle = "#8d6fc5";
  ictx.lineWidth = 5;
  ictx.beginPath();
  ictx.moveTo(28, 58);
  ictx.lineTo(42, 20);
  ictx.stroke();
  ictx.fillStyle = "#9bdfff";
  ictx.beginPath();
  ictx.arc(44, 18, 12, 0, Math.PI * 2);
  ictx.fill();
  ictx.strokeStyle = "#fff5c9";
  ictx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const a = i * Math.PI * 0.4;
    ictx.beginPath();
    ictx.moveTo(44, 18);
    ictx.lineTo(44 + Math.cos(a) * 19, 18 + Math.sin(a) * 19);
    ictx.stroke();
  }
}

function drawDaggerGlyph(ictx, palette) {
  drawItemShadow(ictx, 36, 62, 24, 7);
  ictx.fillStyle = "#52415d";
  ictx.beginPath();
  ictx.moveTo(50, 13);
  ictx.lineTo(40, 50);
  ictx.lineTo(29, 43);
  ictx.closePath();
  ictx.fill();
  ictx.fillStyle = "#e8e4db";
  ictx.beginPath();
  ictx.moveTo(47, 16);
  ictx.lineTo(38, 45);
  ictx.lineTo(32, 41);
  ictx.closePath();
  ictx.fill();
  ictx.strokeStyle = palette.accent;
  ictx.lineWidth = 4;
  ictx.beginPath();
  ictx.moveTo(27, 49);
  ictx.lineTo(39, 38);
  ictx.stroke();
  ictx.fillStyle = "#3b2f45";
  ictx.fillRect(22, 48, 14, 7);
}

function drawAvatarPotionGlyph(ictx, color, size = 72) {
  drawItemShadow(ictx, size * 0.50, size * 0.83, size * 0.27, size * 0.08);
  ictx.fillStyle = "#6f4b30";
  roundedRectOn(ictx, size * 0.41, size * 0.13, size * 0.18, size * 0.13, size * 0.04);
  ictx.fill();
  ictx.fillStyle = color;
  ictx.beginPath();
  ictx.moveTo(size * 0.30, size * 0.29);
  ictx.lineTo(size * 0.70, size * 0.29);
  ictx.lineTo(size * 0.80, size * 0.74);
  ictx.quadraticCurveTo(size * 0.50, size * 0.94, size * 0.20, size * 0.74);
  ictx.closePath();
  ictx.fill();
  ictx.fillStyle = "rgba(255,255,255,0.42)";
  ictx.beginPath();
  ictx.ellipse(size * 0.40, size * 0.52, size * 0.09, size * 0.20, 0.25, 0, Math.PI * 2);
  ictx.fill();
  ictx.strokeStyle = "rgba(255,255,255,0.55)";
  ictx.lineWidth = size * 0.04;
  ictx.beginPath();
  ictx.arc(size * 0.50, size * 0.56, size * 0.20, 0.2, Math.PI * 1.1);
  ictx.stroke();
}

function drawAvatarAuraOverlay(ictx, palette, size = 72) {
  ictx.save();
  ictx.strokeStyle = palette.accent;
  ictx.lineWidth = size * 0.06;
  ictx.globalAlpha = 0.82;
  ictx.beginPath();
  ictx.arc(size * 0.52, size * 0.48, size * 0.34, 0.20, Math.PI * 1.75);
  ictx.stroke();
  ictx.fillStyle = palette.accent;
  ictx.beginPath();
  ictx.moveTo(size * 0.74, size * 0.18);
  ictx.lineTo(size * 0.82, size * 0.42);
  ictx.lineTo(size * 0.69, size * 0.38);
  ictx.closePath();
  ictx.fill();
  ictx.restore();
}

function drawAvatarUltimateOverlay(ictx, palette, size = 72) {
  ictx.save();
  ictx.globalAlpha = 0.80;
  ictx.strokeStyle = palette.accent;
  ictx.lineWidth = size * 0.04;
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8;
    ictx.beginPath();
    ictx.moveTo(size * 0.50, size * 0.50);
    ictx.lineTo(size * 0.50 + Math.cos(angle) * size * 0.43, size * 0.50 + Math.sin(angle) * size * 0.43);
    ictx.stroke();
  }
  ictx.fillStyle = "rgba(255,255,255,0.72)";
  ictx.beginPath();
  ictx.arc(size * 0.50, size * 0.50, size * 0.12, 0, Math.PI * 2);
  ictx.fill();
  ictx.restore();
}

function currentClass() {
  return classes.find((item) => item.key === state.chosenClassKey || item.label === state.chosenClass) || null;
}

function extractSprites() {
  const count = 4;
  const frameWidth = Math.floor(sheet.naturalWidth / count);
  const frameHeight = sheet.naturalHeight;
  state.sprites = Array.from({ length: count }, (_, index) => {
    const source = document.createElement("canvas");
    source.width = frameWidth;
    source.height = frameHeight;
    const sourceCtx = source.getContext("2d");
    sourceCtx.drawImage(sheet, frameWidth * index, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
    let image;
    try {
      image = sourceCtx.getImageData(0, 0, frameWidth, frameHeight);
    } catch (error) {
      return source;
    }
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isGreenScreenPixel(r, g, b)) data[i + 3] = 0;
    }
    sourceCtx.putImageData(image, 0, 0);
    return source;
  });
}

function extractClassSprites() {
  if (!classSheet.complete || classSheet.naturalWidth === 0) return;
  const count = 6;
  const frameWidth = Math.floor(classSheet.naturalWidth / count);
  const frameHeight = classSheet.naturalHeight;
  state.classSprites = Array.from({ length: count }, (_, index) => {
    const source = document.createElement("canvas");
    source.width = frameWidth;
    source.height = frameHeight;
    const sourceCtx = source.getContext("2d");
    sourceCtx.drawImage(classSheet, frameWidth * index, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
    let image;
    try {
      image = sourceCtx.getImageData(0, 0, frameWidth, frameHeight);
    } catch (error) {
      return source;
    }
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isGreenScreenPixel(r, g, b)) data[i + 3] = 0;
    }
    sourceCtx.putImageData(image, 0, 0);
    return source;
  });
}

function isGreenScreenPixel(r, g, b) {
  return g > 105 && r < 130 && b < 130 && g > r * 1.25 && g > b * 1.18;
}

function ensureClassSprites() {
  if (state.classSprites.length === 0 && classSheet.complete && classSheet.naturalWidth > 0) {
    extractClassSprites();
  }
}

function extractGridIcons(image, cols, rows, cells = null) {
  if (!image.complete || image.naturalWidth === 0) return [];
  const frameWidth = image.naturalWidth / cols;
  const frameHeight = image.naturalHeight / rows;
  const cropSize = Math.min(frameWidth, frameHeight);
  const cropX = (frameWidth - cropSize) / 2;
  const cropY = (frameHeight - cropSize) / 2;
  const list = cells || Array.from({ length: cols * rows }, (_, index) => [index % cols, Math.floor(index / cols)]);
  return list.map(([col, row]) => {
    const source = document.createElement("canvas");
    source.width = cropSize;
    source.height = cropSize;
    const sourceCtx = source.getContext("2d");
    sourceCtx.imageSmoothingEnabled = true;
    sourceCtx.imageSmoothingQuality = "high";
    sourceCtx.drawImage(image, frameWidth * col + cropX, frameHeight * row + cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);
    return source;
  });
}

function extractMenuIcons() {
  if (!menuSheet.complete || menuSheet.naturalWidth === 0) return;
  state.menuIcons = extractGridIcons(menuSheet, 4, 4, [[0, 3], [3, 0], [3, 1], [0, 2]]);
}

function ensureMenuIcons() {
  if (state.menuIcons.length === 0 && menuSheet.complete && menuSheet.naturalWidth > 0) {
    extractMenuIcons();
  }
}

function extractSkillIcons() {
  if (!skillSheet.complete || skillSheet.naturalWidth === 0) return;
  if (skillSheet.naturalWidth > skillSheet.naturalHeight * 2.5) {
    state.skillIcons = extractWideSkillIcons(skillSheet, 10);
    state.skillIcons.forEach(removeChromaGreen);
    return;
  }
  state.skillIcons = extractGridIcons(skillSheet, 4, 5);
}

function ensureSkillIcons() {
  if (state.skillIcons.length === 0 && skillSheet.complete && skillSheet.naturalWidth > 0) {
    extractSkillIcons();
  }
}

function extractWideSkillIcons(image, count) {
  const marginX = image.naturalWidth * 0.015;
  const pitch = (image.naturalWidth - marginX * 2) / count;
  const sourceSize = Math.min(pitch * 0.98, image.naturalHeight * 0.29);
  const centerY = image.naturalHeight * 0.5;
  return Array.from({ length: count }, (_, index) => {
    const centerX = marginX + pitch * (index + 0.5);
    const sx = Math.max(0, Math.min(image.naturalWidth - sourceSize, centerX - sourceSize / 2));
    const sy = Math.max(0, Math.min(image.naturalHeight - sourceSize, centerY - sourceSize / 2));
    const source = document.createElement("canvas");
    source.width = 96;
    source.height = 96;
    const sourceCtx = source.getContext("2d");
    sourceCtx.imageSmoothingEnabled = true;
    sourceCtx.imageSmoothingQuality = "high";
    sourceCtx.drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, source.width, source.height);
    return source;
  });
}

function removeChromaGreen(canvas) {
  const sourceCtx = canvas.getContext("2d");
  let image;
  try {
    image = sourceCtx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    return;
  }
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (g > 180 && r < 45 && b < 90) data[i + 3] = 0;
  }
  sourceCtx.putImageData(image, 0, 0);
}

function extractNpcSprites() {
  state.npcSprites = extractNpcCharacterSprites(npcSheet, 4, 4);
}

function ensureNpcSprites() {
  if (state.npcSprites.length === 0 && npcSheet.complete && npcSheet.naturalWidth > 0) {
    extractNpcSprites();
  }
}

function extractNpcCharacterSprites(image, cols, rows) {
  if (!image.complete || image.naturalWidth === 0) return [];
  const cellW = image.naturalWidth / cols;
  const cellH = image.naturalHeight / rows;
  const margin = Math.min(cellW, cellH) * 0.045;
  return Array.from({ length: cols * rows }, (_, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const source = document.createElement("canvas");
    source.width = 128;
    source.height = 160;
    const sourceCtx = source.getContext("2d");
    sourceCtx.imageSmoothingEnabled = true;
    sourceCtx.imageSmoothingQuality = "high";
    sourceCtx.drawImage(
      image,
      col * cellW + margin,
      row * cellH + margin,
      cellW - margin * 2,
      cellH - margin * 2,
      0,
      0,
      source.width,
      source.height
    );
    removeParchmentBackground(source);
    fitVisibleContent(source, 2);
    return source;
  });
}

function removeParchmentBackground(canvas) {
  const sourceCtx = canvas.getContext("2d");
  let image;
  try {
    image = sourceCtx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    return;
  }
  const data = image.data;
  const samples = [
    [4, 4],
    [canvas.width - 5, 4],
    [4, canvas.height - 5],
    [canvas.width - 5, canvas.height - 5]
  ].map(([x, y]) => {
    const i = (y * canvas.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  });
  const bg = samples.reduce((acc, item) => [acc[0] + item[0], acc[1] + item[1], acc[2] + item[2]], [0, 0, 0])
    .map((value) => value / samples.length);
  const visited = new Uint8Array(canvas.width * canvas.height);
  const queue = [];
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
    const pos = y * canvas.width + x;
    if (visited[pos]) return;
    visited[pos] = 1;
    queue.push([x, y]);
  };
  for (let x = 0; x < canvas.width; x += 1) {
    enqueue(x, 0);
    enqueue(x, canvas.height - 1);
  }
  for (let y = 1; y < canvas.height - 1; y += 1) {
    enqueue(0, y);
    enqueue(canvas.width - 1, y);
  }
  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const i = (y * canvas.width + x) * 4;
    if (!isParchmentPixel(data[i], data[i + 1], data[i + 2], bg, 86)) continue;
    data[i + 3] = 0;
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    if (isParchmentPixel(data[i], data[i + 1], data[i + 2], bg, 54)) {
      data[i + 3] = 0;
    } else if (isParchmentPixel(data[i], data[i + 1], data[i + 2], bg, 78)) {
      data[i + 3] = Math.max(0, data[i + 3] - 220);
    }
  }
  for (let y = 1; y < canvas.height - 1; y += 1) {
    for (let x = 1; x < canvas.width - 1; x += 1) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] === 0) continue;
      const nearTransparent =
        data[i - 1] === 0 ||
        data[i + 7] === 0 ||
        data[i - canvas.width * 4 + 3] === 0 ||
        data[i + canvas.width * 4 + 3] === 0;
      if (nearTransparent && isParchmentPixel(data[i], data[i + 1], data[i + 2], bg, 72)) {
        data[i + 3] = Math.max(0, data[i + 3] - 190);
      }
    }
  }
  sourceCtx.putImageData(image, 0, 0);
}

function isParchmentPixel(r, g, b, bg, tolerance = 62) {
  const dr = r - bg[0];
  const dg = g - bg[1];
  const db = b - bg[2];
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lowSaturation = max - min < 62;
  const parchmentRange = r > 164 && g > 132 && b > 82 && r >= g * 0.96 && g >= b * 0.76;
  const palePaper = r > 205 && g > 182 && b > 132 && max - min < 92;
  return dist < tolerance || (lowSaturation && parchmentRange) || palePaper;
}

function fitVisibleContent(canvas, padding) {
  const sourceCtx = canvas.getContext("2d");
  let image;
  try {
    image = sourceCtx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    return;
  }
  const data = image.data;
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha <= 48) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (minX > maxX || minY > maxY) return;
  const contentW = maxX - minX + 1;
  const contentH = maxY - minY + 1;
  const scale = Math.min((canvas.width - padding * 2) / contentW, (canvas.height - padding * 2) / contentH);
  const drawW = contentW * scale;
  const drawH = contentH * scale;
  const buffer = document.createElement("canvas");
  buffer.width = contentW;
  buffer.height = contentH;
  buffer.getContext("2d").putImageData(image, -minX, -minY);
  sourceCtx.clearRect(0, 0, canvas.width, canvas.height);
  sourceCtx.imageSmoothingEnabled = true;
  sourceCtx.imageSmoothingQuality = "high";
  sourceCtx.drawImage(buffer, (canvas.width - drawW) / 2, canvas.height - drawH - padding, drawW, drawH);
}

function extractEquipmentIcons() {
  if (!equipmentSheet.complete || equipmentSheet.naturalWidth === 0) return;
  const count = 12;
  const frameWidth = Math.floor(equipmentSheet.naturalWidth / count);
  const frameHeight = equipmentSheet.naturalHeight;
  const cropSize = Math.min(frameWidth, frameHeight);
  const cropY = Math.floor((frameHeight - cropSize) / 2);
  state.equipmentIcons = Array.from({ length: count }, (_, index) => {
    const source = document.createElement("canvas");
    source.width = cropSize;
    source.height = cropSize;
    const sourceCtx = source.getContext("2d");
    sourceCtx.drawImage(equipmentSheet, frameWidth * index, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);
    return source;
  });
}

function ensureEquipmentIcons() {
  if (state.equipmentIcons.length === 0 && equipmentSheet.complete && equipmentSheet.naturalWidth > 0) {
    extractEquipmentIcons();
  }
}

function drawPortrait() {
  accountCtx.clearRect(0, 0, accountAvatar.width, accountAvatar.height);
  const classInfo = currentClass();
  const sprite = classInfo ? state.classSprites[classInfo.sprite] : state.sprites[0];
  if (!sprite) return;
  accountCtx.imageSmoothingEnabled = true;
  accountCtx.imageSmoothingQuality = "high";
  accountCtx.drawImage(
    sprite,
    accountAvatar.width * 0.17,
    accountAvatar.height * 0.05,
    accountAvatar.width * 0.66,
    accountAvatar.height * 0.86
  );
}

function fitCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const compactLandscape = window.innerWidth <= 980 && window.innerHeight <= 560 && window.innerWidth > window.innerHeight;
  canvas.width = Math.max(compactLandscape ? 360 : 720, Math.floor(rect.width * ratio));
  canvas.height = Math.max(compactLandscape ? 220 : 520, Math.floor(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw();
}

document.querySelector("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#loginName").value.trim();
  const password = document.querySelector("#loginPassword").value;
  if (!name || !password) {
    setLoginStatus("Pseudo et mot de passe requis.");
    return;
  }
  const accounts = loadAccounts();
  const key = accountKey(name);
  const account = accounts[key];
  if (!account) {
    setLoginStatus("Compte introuvable. Clique sur Creer.");
    return;
  }
  if (account.password !== password) {
    setLoginStatus("Mot de passe incorrect.");
    return;
  }
  setLoginStatus("");
  finishAuth(key, account, `${account.name} est connecte. Progression chargee.`);
});

document.querySelector("#createAccountButton").addEventListener("click", () => {
  const name = document.querySelector("#loginName").value.trim();
  const password = document.querySelector("#loginPassword").value;
  if (!name || !password) {
    setLoginStatus("Choisis un pseudo et un mot de passe.");
    return;
  }
  if (name.length < 3) {
    setLoginStatus("Pseudo trop court.");
    return;
  }
  const accounts = loadAccounts();
  const key = accountKey(name);
  if (accounts[key]) {
    setLoginStatus("Ce pseudo existe deja.");
    return;
  }
  const freshSave = cloneData(defaultSaveState);
  freshSave.playerName = name;
  accounts[key] = {
    name,
    password,
    save: freshSave,
    createdAt: new Date().toISOString(),
    savedAt: new Date().toISOString()
  };
  writeAccounts(accounts);
  setLoginStatus("");
  finishAuth(key, accounts[key], `Compte cree. Bienvenue ${name}.`);
});

document.querySelector("#logoutButton").addEventListener("click", () => {
  saveCurrentAccount();
  const name = state.playerName;
  currentAccountKey = null;
  document.querySelector("#loginForm").classList.remove("is-hidden");
  document.querySelector("#accountCard").classList.add("is-hidden");
  document.body.classList.remove("is-authenticated");
  document.querySelector("#loginName").value = name;
  document.querySelector("#loginPassword").value = "";
  setLoginStatus("Progression sauvegardee.");
  addLog(`${name} est deconnecte. Progression sauvegardee.`);
});

const gameMenuTitles = {
  profile: ["Personnage", "Profil"],
  inventory: ["Sac et equipement", "Inventaire"],
  skills: ["Progression", "Competences"],
  quests: ["Journal", "Quetes"]
};

function openGameMenu(section) {
  updateUi();
  const panel = document.querySelector("#gameMenuPanel");
  panel.classList.remove("is-hidden");
  panel.dataset.activeMenu = section;
  document.querySelectorAll("[data-game-menu]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.gameMenu === section);
  });
  document.querySelectorAll("[data-game-section]").forEach((item) => {
    item.classList.toggle("is-hidden", item.dataset.gameSection !== section);
  });
  const [kicker, title] = gameMenuTitles[section];
  document.querySelector("#gameMenuKicker").textContent = kicker;
  document.querySelector("#gameMenuTitle").textContent = title;
  fitCanvas();
}

document.querySelectorAll("[data-game-menu]").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.querySelector("#gameMenuPanel");
    if (button.dataset.gameMenu === "map") {
      panel.classList.add("is-hidden");
      delete panel.dataset.activeMenu;
      document.querySelectorAll("[data-game-menu]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      fitCanvas();
      return;
    }
    const alreadyOpen = !panel.classList.contains("is-hidden") && button.classList.contains("is-active");
    if (alreadyOpen) {
      panel.classList.add("is-hidden");
      delete panel.dataset.activeMenu;
      document.querySelectorAll("[data-game-menu]").forEach((item) => item.classList.remove("is-active"));
      fitCanvas();
      return;
    }
    openGameMenu(button.dataset.gameMenu);
  });
});

document.querySelector("#gameMenuClose").addEventListener("click", () => {
  const panel = document.querySelector("#gameMenuPanel");
  panel.classList.add("is-hidden");
  delete panel.dataset.activeMenu;
  document.querySelectorAll("[data-game-menu]").forEach((item) => item.classList.remove("is-active"));
  fitCanvas();
});

document.querySelectorAll("[data-move]").forEach((button) => {
  button.addEventListener("click", () => move(button.dataset.move));
});

window.addEventListener("keydown", (event) => {
  const keyMap = {
    ArrowUp: "up", z: "up", w: "up",
    ArrowDown: "down", s: "down",
    ArrowLeft: "left", q: "left", a: "left",
    ArrowRight: "right", d: "right"
  };
  const direction = keyMap[event.key];
  if (direction) {
    event.preventDefault();
    move(direction);
  }
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left - map.offsetX) / map.tile);
  const y = Math.floor((event.clientY - rect.top - map.offsetY) / map.tile);
  const adjacent = Math.max(Math.abs(x - state.player.x), Math.abs(y - state.player.y)) <= 1;

  if (state.area === "outside") {
    const npc = outside.npcs.find((item) => item.x === x && item.y === y);
    if (npc && adjacent) {
      openDialogue(npc);
      updateUi();
      draw();
      return;
    }
    const monster = selectedMonster();
    if (monster && monster.x === state.player.x && monster.y === state.player.y && x === monster.x && y === monster.y) {
      useSkill(skills[0]);
      return;
    }
  } else if (state.area === "oklaoma") {
    const entrance = getOklaomaBuildingEntrance(x, y);
    if (entrance && adjacent) {
      enterOklaomaBuilding(entrance.type);
      updateUi();
      draw();
      return;
    }
    const npc = (oklaomaNpcs[`${state.oklaomaMap.x},${state.oklaomaMap.y}`] || []).find((item) => item.x === x && item.y === y);
    if (npc && adjacent) {
      openDialogue(npc);
      updateUi();
      draw();
      return;
    }
    const monster = getOklaomaMonsterOnPlayer();
    if (monster && monster.x === x && monster.y === y) {
      useSkill(skills[0]);
      return;
    }
  } else {
    const exit = currentInteriorExit();
    if (x === exit.x && y === exit.y && adjacent && ["oklaomaInn", "oklaomaShop"].includes(state.area)) {
      exitOklaomaBuilding(state.area === "oklaomaShop" ? "shop" : "inn");
      updateUi();
      draw();
      return;
    }
    const npcs = state.area === "oklaomaInn" ? oklaomaInnNpcs : state.area === "oklaomaShop" ? oklaomaShopNpcs : indoorNpcs;
    const npc = npcs.find((item) => item.x === x && item.y === y);
    if (npc && adjacent) {
      openDialogue(npc);
      updateUi();
      draw();
      return;
    }
  }

  moveToAdjacent(x, y);
});

window.addEventListener("resize", fitCanvas);
document.addEventListener("dblclick", (event) => {
  if (event.target.closest(".game-shell, .site-header")) event.preventDefault();
}, { passive: false });
window.addEventListener("beforeunload", () => saveCurrentAccount());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveCurrentAccount();
});
mapArt.addEventListener("load", () => draw());
oklaomaCentralMap.addEventListener("load", () => draw());
oklaomaAtlas.addEventListener("load", () => draw());
oklaomaInteriorSheet.addEventListener("load", () => draw());
oklaomaMonsterSheet.addEventListener("load", () => draw());
classSheet.addEventListener("load", () => {
  extractClassSprites();
  illustratedSkillIcon.cache = {};
  drawPortrait();
  updateUi();
  draw();
});
menuSheet.addEventListener("load", () => {
  extractMenuIcons();
  renderMenuIcons();
});
skillSheet.addEventListener("load", () => {
  extractSkillIcons();
  renderSkills();
});
npcSheet.addEventListener("load", () => {
  extractNpcSprites();
  draw();
});
equipmentSheet.addEventListener("load", () => {
  extractEquipmentIcons();
  illustratedSkillIcon.cache = {};
  updateUi();
});
setInterval(() => {
  normalizeSpawns();
  updateUi();
  draw();
}, 1000);

sheet.addEventListener("load", () => {
  extractSprites();
  if (classSheet.complete) extractClassSprites();
  if (menuSheet.complete) extractMenuIcons();
  if (skillSheet.complete) extractSkillIcons();
  if (npcSheet.complete) extractNpcSprites();
  if (equipmentSheet.complete) extractEquipmentIcons();
  illustratedSkillIcon.cache = {};
  renderSkills();
  renderMenuIcons();
  drawPortrait();
  updateUi();
  fitCanvas();
  addLog("Bienvenue pres du cimetiere de Valombre.");
});

if (sheet.complete) {
  extractSprites();
  if (classSheet.complete) extractClassSprites();
  if (menuSheet.complete) extractMenuIcons();
  if (skillSheet.complete) extractSkillIcons();
  if (npcSheet.complete) extractNpcSprites();
  if (equipmentSheet.complete) extractEquipmentIcons();
  illustratedSkillIcon.cache = {};
  renderSkills();
  renderMenuIcons();
  drawPortrait();
  updateUi();
  fitCanvas();
  addLog("Bienvenue pres du cimetiere de Valombre.");
}
