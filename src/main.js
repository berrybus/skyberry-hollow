/* Skyberry Hollow — original browser-first platform RPG prototype. */
const W = 800;
const H = 600;
const TILE = 12;
const WORLD_W = 27600;
const WORLD_GRAVITY = 1300;
const WORLD_H = 720;
const ASSET_VERSION = '135';
const JUMP_VELOCITY = -570;
const UI_FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const MAP_DEFINITIONS = {
  sprout_camp: {
    id:'sprout_camp', kind:'town', art:'sprout-camp', x:0, width:1152, region:'dawnleaf', terrainTint:0xffdc9b,
    label:'DAWNLEAF ISLE • SPROUT CAMP', spawn:{left:[72,594],right:[1032,594],camp:[72,594],market:[720,594]},
    platforms:[[60,612,96],[156,564,108],[264,516,156],[420,468,192],[612,516,156],[768,564,108],[876,612,120]],
    exits:[{x:1092,to:'sunmeadow',spawn:'left',label:'SUNMEADOW TRAIL'},{x:330,to:'brambleway',spawn:'left',label:'ROOT-CELLAR PASSAGE',secret:true},{x:720,to:'sprout_market',spawn:'door',label:'CAMP MARKET'}],
    npcs:[{x:190,frame:0,name:'MIRA',role:'ISLAND GUIDE',type:'guide'}],
    enemies:[], berries:[[390,556],[600,496],[820,532]], chests:[],
  },
  brambleway: {
    id:'brambleway', kind:'field', art:'brambleway', x:1404, width:1440, region:'dawnleaf', terrainTint:0xa6d27b,
    label:'DAWNLEAF ISLE • BRAMBLEWAY', spawn:{left:[108,594],right:[1332,594]},
    platforms:[[296,564,180],[600,444,168],[780,600,156],[840,564,120],[984,516,132],[1128,468,156]],
    exits:[{x:60,to:'sunmeadow',spawn:'right',label:'SUNMEADOW TRAIL'},{x:1380,to:'windroot',spawn:'left',label:'WINDROOT CROSSING'},{x:720,to:'sprout_camp',spawn:'camp',label:'ROOT-CELLAR PASSAGE',secret:true},{x:1160,to:'tidehollow',spawn:'left',label:'REED-COVERED CREEK',secret:true}],
    npcs:[], enemies:[[510,634,390,760,'bramblehog'],[1080,634,930,1290,'bramblehog']], berries:[[300,568],[510,508],[738,448],[978,520],[1200,460]], chests:[[724,444]],
  },
  tidehollow: {
    id:'tidehollow', kind:'town', art:'tidehollow', x:3096, width:1152, region:'dawnleaf', terrainTint:0xd2a779,
    label:'DAWNLEAF ISLE • TIDEHOLLOW PORT', spawn:{left:[108,594],right:[1032,594],ferry:[960,594],market:[780,594]},
    platforms:[[720,612,180],[900,564,156],[768,516,132],[612,468,156],[432,516,132]],
    exits:[{x:60,to:'windroot',spawn:'right',label:'WINDROOT CROSSING'},{x:510,to:'brambleway',spawn:'right',label:'REED-COVERED CREEK',secret:true},{x:780,to:'tide_market',spawn:'door',label:'HARBOR SHOPS'}],
    npcs:[{x:980,frame:1,name:'CAPTAIN SOL',role:'FERRY TO CROWNWIND',type:'ferry'}],
    enemies:[], berries:[[318,544],[570,484],[804,436]], chests:[],
  },
  gullhaven: {
    id:'gullhaven', kind:'town', art:'gullhaven', x:4500, width:1440, region:'crownwind', terrainTint:0xb9cad6,
    label:'CROWNWIND REACH • GULLHAVEN', spawn:{left:[108,594],right:[1332,594],dock:[100,594],market:[510,594]},
    platforms:[[600,612,144],[744,564,120],[864,516,120],[984,468,144],[1128,516,120]],
    exits:[{x:1380,to:'saltwind',spawn:'left',label:'SALTWIND SHORE'},{x:510,to:'gull_market',spawn:'door',label:'DOCK MARKET'}],
    npcs:[{x:210,frame:1,name:'DOCKMASTER ORI',role:'FERRY TO DAWNLEAF',type:'return_ferry'}],
    enemies:[], berries:[[438,556],[708,496],[954,532],[1200,472]], chests:[],
  },
  stonewatch: {
    id:'stonewatch', kind:'town', art:'stonewatch', x:6192, width:1344, region:'crownwind', terrainTint:0xbbb4ae,
    label:'CROWNWIND REACH • STONEWATCH RISE', spawn:{left:[108,594],right:[1236,594],mentor:[260,594],market:[690,594]},
    platforms:[[540,612,156],[696,564,144],[840,516,132],[972,468,132],[1104,420,120]],
    exits:[{x:60,to:'saltwind',spawn:'right',label:'SALTWIND SHORE'},{x:1284,to:'rubblepass',spawn:'left',label:'RUBBLE PASS'},{x:930,to:'crystal_hollow',spawn:'right',label:'WATCH MINE BRANCH'},{x:690,to:'stone_market',spawn:'door',label:'FORGE ROW'}],
    npcs:[{x:240,frame:2,name:'BRANN',role:'WARRIOR MENTOR',type:'mentor_warrior'}],
    enemies:[], berries:[[474,556],[678,496],[870,436],[1098,376]], chests:[],
  },
  greenbloom: {
    id:'greenbloom', kind:'town', art:'greenbloom', x:7788, width:1440, region:'crownwind', terrainTint:0x83c97b,
    label:'CROWNWIND REACH • GREENBLOOM WILDS', spawn:{left:[108,594],right:[1332,594],mentor:[280,594],market:[1110,594]},
    platforms:[[540,612,144],[684,564,144],[828,516,180],[624,468,144],[1008,468,180],[804,420,156]],
    exits:[{x:60,to:'rubblepass',spawn:'right',label:'RUBBLE PASS'},{x:1380,to:'whispering_range',spawn:'left',label:'WHISPERING RANGE'},{x:760,to:'moonlit_boughs',spawn:'left',label:'OWLKEEPER PATH'},{x:1110,to:'green_market',spawn:'door',label:'CANOPY MARKET'}],
    npcs:[{x:260,frame:3,name:'LYRA',role:'BOWMAN MENTOR',type:'mentor_bowman'}],
    enemies:[], berries:[[516,544],[768,484],[1008,424],[1254,484]], chests:[],
  },
  starwillow: {
    id:'starwillow', kind:'town', art:'starwillow', x:9480, width:1344, region:'crownwind', terrainTint:0xb397df,
    label:'CROWNWIND REACH • STARWILLOW GROVE', spawn:{left:[108,594],right:[1236,594],mentor:[280,594],market:[990,594]},
    platforms:[[480,612,120],[600,564,120],[720,516,120],[840,468,120],[960,516,120],[1080,564,120]],
    exits:[{x:60,to:'whispering_range',spawn:'right',label:'WHISPERING RANGE'},{x:1284,to:'moonlit_boughs',spawn:'left',label:'MOONLIT BOUGHS'},{x:690,to:'saltwind',spawn:'right',label:'MOON-SAIL LANDING'},{x:990,to:'star_market',spawn:'door',label:'LANTERN ARCADE'}],
    npcs:[{x:250,frame:4,name:'ORIN',role:'MAGICIAN MENTOR',type:'mentor_magician'}],
    enemies:[], berries:[[516,556],[720,496],[924,436],[1140,376]], chests:[],
  },
  sunmeadow: {
    id:'sunmeadow',kind:'field',art:'sunmeadow',x:11076,width:1344,region:'dawnleaf',terrainTint:0xc9df7e,
    label:'DAWNLEAF ISLE • SUNMEADOW TRAIL',spawn:{left:[108,594],right:[1236,594]},
    platforms:[[180,612,144],[420,564,240],[876,564,180],[1092,468,132]],
    exits:[{x:60,to:'sprout_camp',spawn:'right',label:'SPROUT CAMP'},{x:1284,to:'brambleway',spawn:'left',label:'BRAMBLEWAY'}],
    npcs:[],enemies:[[510,634,390,720,'spriglet'],[1010,634,900,1190,'spriglet']],berries:[[300,580],[540,532],[756,484],[984,532]],chests:[[1150,468]],
  },
  windroot: {
    id:'windroot',kind:'field',art:'windroot',x:12672,width:1440,region:'dawnleaf',terrainTint:0x8fc07d,
    label:'DAWNLEAF ISLE • WINDROOT CROSSING',spawn:{left:[108,594],right:[1332,594]},
    platforms:[[276,564,132],[480,468,132],[684,372,132],[888,468,132],[1116,564,144]],
    exits:[{x:60,to:'brambleway',spawn:'right',label:'BRAMBLEWAY'},{x:1380,to:'tidehollow',spawn:'left',label:'TIDEHOLLOW PORT'}],
    npcs:[],enemies:[[470,634,350,680,'bramblehog'],[1080,634,930,1260,'spriglet']],berries:[[282,568],[486,508],[690,448],[894,388],[1098,448]],chests:[[750,372]],
  },
  saltwind: {
    id:'saltwind',kind:'field',art:'saltwind',x:14364,width:1344,region:'crownwind',terrainTint:0xd3b581,
    label:'CROWNWIND REACH • SALTWIND SHORE',spawn:{left:[108,594],right:[1236,594]},
    platforms:[[180,612,132],[384,588,108],[588,612,108],[900,564,156],[1128,468,108]],
    exits:[{x:60,to:'gullhaven',spawn:'right',label:'GULLHAVEN'},{x:1284,to:'stonewatch',spawn:'left',label:'STONEWATCH RISE'},{x:820,to:'starwillow',spawn:'left',label:'MOON-SAIL LANDING'}],
    npcs:[],enemies:[[520,634,390,690,'tidecrab'],[1010,634,900,1190,'tidecrab']],berries:[[336,556],[576,508],[804,556],[1044,484]],chests:[[1180,468]],
  },
  rubblepass: {
    id:'rubblepass',kind:'field',art:'rubblepass',x:15960,width:1344,region:'crownwind',terrainTint:0xa59d94,
    label:'CROWNWIND REACH • RUBBLE PASS',spawn:{left:[108,594],right:[1236,594]},
    platforms:[[276,564,156],[528,468,156],[780,372,180],[1032,468,156]],
    exits:[{x:60,to:'stonewatch',spawn:'right',label:'STONEWATCH RISE'},{x:1284,to:'greenbloom',spawn:'left',label:'GREENBLOOM'}],
    npcs:[],enemies:[[510,634,390,720,'stonepup'],[1030,634,890,1190,'stonepup']],berries:[[288,568],[492,520],[696,472],[900,424],[1104,376]],chests:[[1100,468]],
  },
  whispering_range: {
    id:'whispering_range',kind:'field',art:'whispering-range',x:17556,width:1344,region:'crownwind',terrainTint:0x78bd78,
    label:'CROWNWIND REACH • WHISPERING RANGE',spawn:{left:[108,594],right:[1236,594]},
    platforms:[[180,612,144],[420,564,180],[612,492,132],[720,420,180],[936,516,180],[1200,420,108]],
    exits:[{x:60,to:'greenbloom',spawn:'right',label:'GREENBLOOM'},{x:1284,to:'starwillow',spawn:'left',label:'STARWILLOW GROVE'},{x:720,to:'crystal_hollow',spawn:'left',label:'HOLLOW TREE DESCENT',secret:true}],
    npcs:[],enemies:[[540,634,400,750,'bloomcap'],[1050,634,900,1200,'bloomcap']],berries:[[318,556],[564,496],[798,436],[1032,496]],chests:[[790,420]],
  },
  moonlit_boughs: {
    id:'moonlit_boughs',kind:'field',art:'moonlit-boughs',x:19152,width:1344,region:'crownwind',terrainTint:0x9c83cf,
    label:'CROWNWIND REACH • MOONLIT BOUGHS',spawn:{left:[108,594],right:[1236,594]},
    platforms:[[276,564,144],[516,468,144],[720,372,216],[1032,468,144],[1200,564,96]],
    exits:[{x:60,to:'starwillow',spawn:'right',label:'STARWILLOW GROVE'},{x:1284,to:'crystal_hollow',spawn:'left',label:'CRYSTAL HOLLOW'},{x:630,to:'greenbloom',spawn:'right',label:'OWLKEEPER PATH'}],
    npcs:[],enemies:[[520,634,380,720,'starcrawler'],[1030,634,880,1190,'starcrawler']],berries:[[288,568],[492,508],[696,448],[900,388],[1104,448]],chests:[[820,372]],
  },
  crystal_hollow: {
    id:'crystal_hollow',kind:'field',art:'crystal-hollow',x:20748,width:1344,region:'crownwind',terrainTint:0x79cbd0,
    label:'CROWNWIND REACH • CRYSTAL HOLLOW',spawn:{left:[108,594],right:[1236,594]},
    platforms:[[180,468,120],[396,564,180],[756,564,144],[996,468,180],[1188,372,108]],
    exits:[{x:60,to:'moonlit_boughs',spawn:'right',label:'MOONLIT BOUGHS'},{x:420,to:'stonewatch',spawn:'right',label:'WATCH MINE BRANCH'},{x:900,to:'whispering_range',spawn:'right',label:'HOLLOW TREE DESCENT',secret:true}],
    npcs:[],enemies:[[550,634,400,760,'starcrawler'],[1060,634,900,1210,'stonepup']],berries:[[330,544],[570,484],[792,424],[1026,364]],chests:[[1220,372]],
  },
  sprout_market:{id:'sprout_market',kind:'interior',showOnWorldMap:false,art:'sprout-camp',x:22200,width:800,region:'dawnleaf',terrainTint:0xb77a4c,label:'SPROUT CAMP • CAMP MARKET',spawn:{door:[400,594]},platforms:[[108,564,180],[512,564,180]],exits:[{x:400,to:'sprout_camp',spawn:'camp',label:'BACK TO SPROUT CAMP'}],npcs:[{x:198,frame:1,name:'PERRIN',role:'POTION SELLER',type:'shop_potion'},{x:602,frame:2,name:'TESSA',role:'ARMOR SELLER',type:'shop_armor'}],enemies:[],berries:[],chests:[]},
  tide_market:{id:'tide_market',kind:'interior',showOnWorldMap:false,art:'tidehollow',x:23100,width:800,region:'dawnleaf',terrainTint:0x9c6948,label:'TIDEHOLLOW • HARBOR SHOPS',spawn:{door:[400,594]},platforms:[[108,564,180],[512,564,180]],exits:[{x:400,to:'tidehollow',spawn:'left',label:'BACK TO TIDEHOLLOW'}],npcs:[{x:198,frame:1,name:'MARLO',role:'POTION SELLER',type:'shop_potion'},{x:602,frame:2,name:'VENA',role:'ARMOR SELLER',type:'shop_armor'}],enemies:[],berries:[],chests:[]},
  gull_market:{id:'gull_market',kind:'interior',showOnWorldMap:false,art:'gullhaven',x:24000,width:800,region:'crownwind',terrainTint:0x765a49,label:'GULLHAVEN • DOCK MARKET',spawn:{door:[400,594]},platforms:[[108,564,180],[512,564,180]],exits:[{x:400,to:'gullhaven',spawn:'dock',label:'BACK TO GULLHAVEN'}],npcs:[{x:198,frame:1,name:'CORAL',role:'POTION SELLER',type:'shop_potion'},{x:602,frame:2,name:'HOLT',role:'ARMOR SELLER',type:'shop_armor'}],enemies:[],berries:[],chests:[]},
  stone_market:{id:'stone_market',kind:'interior',showOnWorldMap:false,art:'stonewatch',x:24900,width:800,region:'crownwind',terrainTint:0x665c59,label:'STONEWATCH • FORGE ROW',spawn:{door:[400,594]},platforms:[[108,564,180],[512,564,180]],exits:[{x:400,to:'stonewatch',spawn:'mentor',label:'BACK TO STONEWATCH'}],npcs:[{x:198,frame:1,name:'EMBER',role:'POTION SELLER',type:'shop_potion'},{x:602,frame:2,name:'ANVIL',role:'ARMOR SELLER',type:'shop_armor'}],enemies:[],berries:[],chests:[]},
  green_market:{id:'green_market',kind:'interior',showOnWorldMap:false,art:'greenbloom',x:25800,width:800,region:'crownwind',terrainTint:0x557d4c,label:'GREENBLOOM • CANOPY MARKET',spawn:{door:[400,594]},platforms:[[108,564,180],[512,564,180]],exits:[{x:400,to:'greenbloom',spawn:'mentor',label:'BACK TO GREENBLOOM'}],npcs:[{x:198,frame:1,name:'SAGE',role:'POTION SELLER',type:'shop_potion'},{x:602,frame:2,name:'FERN',role:'ARMOR SELLER',type:'shop_armor'}],enemies:[],berries:[],chests:[]},
  star_market:{id:'star_market',kind:'interior',showOnWorldMap:false,art:'starwillow',x:26700,width:800,region:'crownwind',terrainTint:0x65517d,label:'STARWILLOW • LANTERN ARCADE',spawn:{door:[400,594]},platforms:[[108,564,180],[512,564,180]],exits:[{x:400,to:'starwillow',spawn:'mentor',label:'BACK TO STARWILLOW'}],npcs:[{x:198,frame:1,name:'MOTE',role:'POTION SELLER',type:'shop_potion'},{x:602,frame:2,name:'VELA',role:'ARMOR SELLER',type:'shop_armor'}],enemies:[],berries:[],chests:[]},
};
const MAP_LIST = Object.values(MAP_DEFINITIONS);
const FIELD_ENEMY_POOLS={dawnleaf:['spriglet','bramblehog','tidecrab'],crownwind:['stonepup','bloomcap','starcrawler','tidecrab']};
MAP_LIST.filter(map=>map.kind==='field').forEach((map,index)=>{
  const patterns=[[[120,612,108],[330,540,120],[570,492,132],[810,540,120],[1050,492,132]],[[144,564,132],[372,612,120],[612,516,144],[864,444,144],[1116,516,120]],[[108,612,144],[348,564,120],[552,468,132],[792,516,144],[1050,420,132]]];
  patterns[index%patterns.length].forEach(candidate=>{if(!map.platforms.some(([x,y,w])=>Math.abs(x-candidate[0])<90&&Math.abs(y-candidate[1])<40))map.platforms.push(candidate);});
  const pool=FIELD_ENEMY_POOLS[map.region],type=pool[index%pool.length],x=250+(index%3)*90;
  map.enemies.push([x,634,Math.max(90,x-130),Math.min(map.width-90,x+170),type]);
});
const validatePlatformTraversal=()=>{
  const maxRise=Math.floor((JUMP_VELOCITY*JUMP_VELOCITY)/(2*WORLD_GRAVITY))-4,maxGap=120;
  MAP_LIST.forEach(map=>{
    const surfaces=[{x:0,y:660,width:map.width},...map.platforms.map(([x,y,width])=>({x,y,width}))];
    const reachable=new Set([0]);
    let changed=true;
    while(changed){
      changed=false;
      surfaces.forEach((target,index)=>{
        if(reachable.has(index))return;
        for(const sourceIndex of reachable){
          const source=surfaces[sourceIndex];
          const gap=Math.max(0,target.x-(source.x+source.width),source.x-(target.x+target.width));
          if(source.y-target.y<=maxRise&&gap<=maxGap){reachable.add(index);changed=true;break;}
        }
      });
    }
    if(reachable.size!==surfaces.length)throw new Error(`${map.id} has unreachable platforms (${reachable.size}/${surfaces.length})`);
  });
};
validatePlatformTraversal();
const WORLD_MAP_POSITIONS={
  sprout_camp:[82,130],sunmeadow:[180,130],brambleway:[282,130],windroot:[390,88],tidehollow:[502,88],
  gullhaven:[82,360],saltwind:[182,360],stonewatch:[292,360],rubblepass:[402,292],greenbloom:[516,260],
  whispering_range:[628,218],starwillow:[710,142],moonlit_boughs:[558,430],crystal_hollow:[402,430],
};
// Field-only traversal slopes. Each tuple is x, topY, width, signed rise.
// Town centers remain flat so NPC interaction zones are never obstructed.
const MAP_SLOPES={
  sunmeadow:[[324,660,96,96],[780,660,96,96]],
  brambleway:[[200,660,96,96],[960,564,96,-96]],
  windroot:[[180,660,96,96],[1020,468,96,-96]],
  saltwind:[[804,660,96,96]],
  rubblepass:[[180,660,96,96],[432,564,96,96],[684,468,96,96]],
  whispering_range:[[324,660,96,96],[900,420,96,-96]],
  moonlit_boughs:[[180,660,96,96],[420,564,96,96],[936,372,96,-96]],
  crystal_hollow:[[300,468,96,-96],[660,660,96,96],[900,564,96,96]],
};
const TOWN_SUPPORT_FRACTIONS={
  sprout_camp:[.2,.8], tidehollow:[.1,.9], gullhaven:[.15,.5,.85],
  stonewatch:[.08,.92], greenbloom:[.25,.75], starwillow:[.5],
};
const ENEMY_TYPES = {
  spriglet:{name:'SPRIGLET',material:'sprig_leaf',materialName:'Sprig Leaf',equipment:['beginner_cap','beginner_clothes']},
  bramblehog:{name:'BRAMBLEHOG',material:'bramble_quill',materialName:'Bramble Quill',equipment:['beginner_sword','beginner_cape']},
  tidecrab:{name:'TIDECRAB',material:'tide_shell',materialName:'Tide Shell',equipment:['bowman_cap','bowman_bow']},
  stonepup:{name:'STONEPUP',material:'stone_core',materialName:'Stone Core',equipment:['warrior_helm','warrior_axe']},
  bloomcap:{name:'BLOOMCAP',material:'glow_spore',materialName:'Glow Spore',equipment:['bowman_clothes','bowman_cape']},
  starcrawler:{name:'STARCRAWLER',material:'star_shard',materialName:'Star Shard',equipment:['magician_hat','magician_staff']},
};
const TOWN_SERVICES = {
  sprout_camp:[['NELL','CAMP STORYTELLER','story_sprout',790,3],['PIP','KITE MAKER','lore_pip',1020,4]],
  tidehollow:[['FINN','DOCKHAND','story_tide',650,0],['ADA','TIDE CLOCK KEEPER','lore_ada',540,4]],
  gullhaven:[['JUNE','HARBOR HISTORIAN','story_gull',900,3],['BIX','GULL WHISPERER','lore_bix',1160,4]],
  stonewatch:[['ROOK','WATCH KEEPER','story_stone',880,0],['IONE','BELL TUNER','lore_ione',1110,4]],
  greenbloom:[['WREN','RANGE WARDEN','story_bloom',960,3],['TOBI','SEED CARTOGRAPHER','lore_tobi',1180,4]],
  starwillow:[['ELIO','STAR SCRIBE','story_star',920,4],['SURI','DREAM LANTERNER','lore_suri',1120,3]],
};
// Authored NPC footholds. Values are local map x and the exact walkable
// surface y; town casts occupy distinct reachable terraces instead of a row.
const NPC_LAYOUTS={
  sprout_camp:{MIRA:[190,564],PERRIN:[330,516],TESSA:[500,468],NELL:[690,516],PIP:[820,564]},
  tidehollow:{'CAPTAIN SOL':[980,564],MARLO:[220,660],VENA:[500,516],FINN:[680,468],ADA:[820,516]},
  gullhaven:{'DOCKMASTER ORI':[210,660],CORAL:[630,612],HOLT:[790,564],JUNE:[920,516],BIX:[1170,516]},
  stonewatch:{BRANN:[240,660],EMBER:[600,612],ANVIL:[760,564],ROOK:[900,516],IONE:[1150,420]},
  greenbloom:{LYRA:[260,660],SAGE:[600,612],FERN:[740,564],WREN:[900,516],TOBI:[1090,468]},
  starwillow:{ORIN:[250,660],MOTE:[540,612],VELA:[660,564],ELIO:[900,468],SURI:[1120,564]},
  sprout_market:{PERRIN:[198,564],TESSA:[602,564]}, tide_market:{MARLO:[198,564],VENA:[602,564]},
  gull_market:{CORAL:[198,564],HOLT:[602,564]}, stone_market:{EMBER:[198,564],ANVIL:[602,564]},
  green_market:{SAGE:[198,564],FERN:[602,564]}, star_market:{MOTE:[198,564],VELA:[602,564]},
};
const NPC_STORIES={
  lore_pip:'Every kite carries a wish over the nursery roof. Mine keeps circling Sunmeadow, as if the trail itself is dreaming.',
  lore_ada:'The tide clock is seven heartbeats late. That only happens when the Windroot trees drink too deeply from the shore.',
  lore_bix:'The harbor gulls remember every ship. One has been calling the name of a vessel that vanished before Gullhaven was built.',
  lore_ione:'Each Stonewatch bell has a different warning voice. The cracked eastern bell has begun singing when no one touches it.',
  lore_tobi:'I map seeds instead of roads. Their journeys reveal hidden breezes through Whispering Range that ordinary maps miss.',
  lore_suri:'Dream lanterns glow for travelers who are lost between choices. Tonight, one is shining for someone in Crystal Hollow.',
};
const SKYBERRY_LORE={
  title:'THE HOLLOW CHIME',
  premise:'Long ago, the Skyberry Tree held every island to the sky by remembering its true name. When the star called Vesper fell through its crown, seven root-bells were forged to keep those names alive. Now one bell is ringing from beneath the earth—and each night another road forgets where it leads.',
};
const MAIN_STORY_STAGES=[
  'Speak with Mira beneath the nursery lanterns.',
  'Follow the impossible bell-song into Sunmeadow Trail and inspect its old chest.',
  'Show the black-glass chime to Captain Sol in Tidehollow.',
  'Find June, Gullhaven’s historian, before the tide erases her harbor records.',
  'Listen for root-echoes in Stonewatch, Greenbloom, and Starwillow.',
  'Find the hidden descent into Crystal Hollow.',
  'Open the sealed reliquary where the seventh root-bell sleeps.',
  'Return to Mira with the awakened bell.',
  'The Hollow Chime is awake. The road beyond Crownwind is waiting.',
];
const npcSlug=name=>name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
const ALL_NPC_NAMES=[...new Set([...MAP_LIST.flatMap(map=>map.npcs.map(n=>n.name)),...Object.values(TOWN_SERVICES).flatMap(list=>list.map(n=>n[0]))])];
const IMAGEGEN_NPCS=new Set(ALL_NPC_NAMES);
const STORY_QUESTS = {
  story_sprout:{name:'A Roof That Remembers Rain',material:'sprig_leaf',need:3,rewardXp:35,rewardMesos:30,journal:'Recover memory-rich leaves before the nursery roof forgets how to shelter children.',intro:'The nursery roof is not leaking, exactly. It has forgotten that rain belongs outside. Last night, three sleeping children woke beneath a private little storm.',request:'Spriglets preserve weather-memory in the silver veins of their fallen leaves. Bring me three. I can teach the old beams what a roof is for before the next cloud arrives.',reminder:'Listen before you strike: healthy leaves rustle. The hollow ones whisper names. I need three intact silver-veined leaves, or the nursery will keep surrendering to the sky.',complete:'There—the beams remember rain. Do you hear that dry wooden sigh? A house is only a promise made by timber. Tonight, ours intends to keep it.'},
  story_tide:{name:'The Rope That Feared the Sea',material:'tide_shell',need:4,rewardXp:55,rewardMesos:45,journal:'Use Tidecrab shells to prove the ferry rope can survive a sea it has begun to fear.',intro:'The ferry ropes recoil whenever the tide touches them. Sailors call it rot because fear embarrasses them when it appears in an object.',request:'Tidecrab shells carry the pressure-memory of the deep. Four ground into the pitch will remind the rope that water can press against something without destroying it.',reminder:'Four shells. Not trophies—evidence. We are trying to convince a terrified rope that the sea is not the same thing as drowning.',complete:'The line holds. More importantly, it no longer flinches. Sailors will praise my pitch and learn nothing. Perhaps that is mercy.'},
  story_gull:{name:'The Harbor’s Missing Face',material:'tide_shell',need:5,rewardXp:70,rewardMesos:60,journal:'Restore the erased captain in Gullhaven’s memorial before the town forgets she existed.',intro:'Someone has vanished from the harbor mosaic. Not broken away—removed so completely that the surrounding tiles lean inward, pretending no face was ever there.',request:'Old Tidecrab shells keep the colors of every moon they survived. Bring five. Their nacre can expose the original outline, and perhaps the name our records refuse to hold.',reminder:'I need five moon-stained shells. Every day the blank space becomes more convincing. Soon I may remember ordering an empty portrait on purpose.',complete:'A woman’s face. Captain Maelin Vale. I know that name—and I know I did not know it yesterday. Whatever erased her has begun editing the people who notice.'},
  story_stone:{name:'A Bell With No Warning',material:'stone_core',need:5,rewardXp:90,rewardMesos:75,journal:'Rebuild the eastern warning bell’s memory before the mountain moves unseen.',intro:'The eastern bell still rings beautifully. That is the problem. It was forged to sound ugly when the mountain shifts, and beauty has made the watchmen stop listening.',request:'Stonepups swallow tremors and store them in their cores. Five cores will give the bell back its vocabulary of fractures. Drive the beasts away; take only what they shed when stunned.',reminder:'Five Stone Cores. Each contains a small remembered earthquake. Without them, the next collapse will arrive wearing silence.',complete:'Hear that cracked note? Awful. Honest. The mountain is moving toward Crystal Hollow, and now the bell has recovered the courage to say so.'},
  story_bloom:{name:'Lanterns for Those Who Return',material:'glow_spore',need:5,rewardXp:110,rewardMesos:90,journal:'Relight the return-path before the forest convinces lost travelers they never had homes.',intro:'The range lanterns illuminate the outward trail, but their homeward faces have gone dark. Travelers can leave Greenbloom. The forest simply declines to show them how to return.',request:'Bloomcaps feed on abandoned intentions. Their spores glow brightest around a promise someone nearly forgot. Bring five; I will seed the homeward lenses with remembered reasons to come back.',reminder:'Five Glow Spores. Do not breathe too deeply near them. You may remember a life you almost chose and mistake grief for directions.',complete:'The inward lights are burning again. Notice how much warmer they look? Same flame. Different promise.'},
  story_star:{name:'The Atlas That Omits You',material:'star_shard',need:6,rewardXp:140,rewardMesos:120,journal:'Repair a prophetic atlas whose newest map excludes every living traveler.',intro:'This atlas draws tomorrow’s roads. Its newest page is immaculate—and contains no travelers, no towns, no handwriting in the margins. A perfect map for a world after us.',request:'Starcrawlers digest failed possibilities and leave the bright fragments behind. Six shards will let the page imagine alternatives again. Defeat them before they consume those futures completely.',reminder:'Six Star Shards. Each is a future too stubborn to disappear. Handle them carefully; hope has edges.',complete:'There. Ink returns: crooked roads, arguments, missed ferries, children drawing monsters over the legend. An untidy future. A living one.'},
};
const crispText = text => {
  if(text?.setFontFamily)text.setFontFamily(UI_FONT);
  if(text?.setFontSize){
    const requested=parseFloat(text.style?.fontSize || 8);
    text.setFontSize(`${Math.max(11,requested)}px`);
  }
  if(text?.setResolution)text.setResolution(4);
  return text;
};
const HAT_STYLES = ['traveler', 'berry', 'arcane'];
const CLOTHES_STYLES = ['traveler', 'moss', 'arcane'];
const CAPE_STYLES = ['indigo', 'moss', 'arcane'];
const ROOT_ANCHORS = {
  motion: { width:96, roots:[48,48,48,48,48,48,44,48], originY:.5 },
  air: { width:128, roots:[60,64,62,66], originY:.5 },
  'attack-none': { width:192, roots:[98,88,84,110], originY:.5 },
  'attack-wood': { width:192, roots:[106,76,70,110], originY:.5 },
  'attack-axe': { width:256, roots:[128,138,120,130], originY:.6 },
};
const ATTACKS = {
  none: { pose:'none', frameRate:12, hitDelay:115, cooldown:360, range:58 },
  wood: { pose:'wood', frameRate:10, hitDelay:150, cooldown:440, range:86 },
  axe: { pose:'axe', frameRate:8, hitDelay:245, cooldown:560, range:106 },
  bow: { pose:'none', frameRate:12, hitDelay:130, cooldown:370, range:250, projectile:'arrow' },
  staff: { pose:'none', frameRate:12, hitDelay:165, cooldown:430, range:220, projectile:'orb' },
};
const CARRY_ATTACHMENTS = {
  idle: [
    {x:10,y:3,angle:-28}, {x:10,y:2,angle:-26},
    {x:10,y:3,angle:-29}, {x:10,y:2,angle:-27},
  ],
  walk: [
    {x:10,y:2,angle:-26}, {x:9,y:1,angle:-20},
    {x:11,y:4,angle:-34}, {x:10,y:3,angle:-28},
  ],
  air: {
    1: {x:13,y:10,angle:-52},
    3: {x:12,y:11,angle:-58},
  },
};
const CLASS_PROFILES = {
  beginner: {
    name:'BEGINNER', role:'ISLAND APPRENTICE', primary:'str', secondary:'dex',
    base:{str:5,dex:5,int:5,vit:5}, growth:{str:.8,dex:.8,int:.8,vit:.8},
    hpBonus:0, attackBonus:0, defenseBonus:0, critBonus:0,
    passive:'THREE SNAILS  •  LEARN THE BASICS', color:0xd9a35f, moveSpeed:93, cooldown:1, damageTaken:1,
  },
  warrior: {
    name:'WARRIOR', role:'DURABLE FRONTLINER', primary:'str', secondary:'vit',
    base:{str:8,dex:4,int:2,vit:7}, growth:{str:1.6,dex:.6,int:.2,vit:1.4},
    hpBonus:15, attackBonus:1, defenseBonus:2, critBonus:0,
    passive:'IRON BODY  •  15% LESS DAMAGE', color:0xd66b55, moveSpeed:88, cooldown:1.05, damageTaken:.85,
  },
  bowman: {
    name:'BOWMAN', role:'RANGED SCOUT', primary:'dex', secondary:'str',
    base:{str:4,dex:8,int:3,vit:5}, growth:{str:.7,dex:1.7,int:.3,vit:.9},
    hpBonus:0, attackBonus:0, defenseBonus:0, critBonus:5,
    passive:'KEEN EYES  •  FAST RANGED ATTACKS', color:0x70b66b, moveSpeed:108, cooldown:.82, damageTaken:1,
  },
  magician: {
    name:'MAGICIAN', role:'ARCANE CASTER', primary:'int', secondary:'dex',
    base:{str:4,dex:4,int:8,vit:5}, growth:{str:.7,dex:.7,int:1.7,vit:.9},
    hpBonus:5, attackBonus:1, defenseBonus:0, critBonus:2,
    passive:'ENERGY BOLT  •  HEALS ON DEFEAT', color:0x8b79d1, moveSpeed:96, cooldown:.95, damageTaken:1,
  },
};
const STAT_INFO = {
  str:'Weapon power and guard', dex:'Critical chance and finesse',
  int:'Arcane weapon power', vit:'Maximum HP and defense',
};

class GameAudio {
  constructor(){this.context=null;this.master=null;this.music=null;this.effects=null;this.running=false;this.muted=false;this.theme='dawnleaf-town';this.step=0;this.timer=null;}
  ensure(){
    if(this.context)return true;const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return false;
    this.context=new AudioContext();this.master=this.context.createGain();this.music=this.context.createGain();this.effects=this.context.createGain();
    this.master.gain.value=.82;this.music.gain.value=.42;this.effects.gain.value=.68;this.music.connect(this.master);this.effects.connect(this.master);this.master.connect(this.context.destination);return true;
  }
  start(){if(!this.ensure())return;const firstStart=!this.running;this.context.resume();if(!firstStart)return;this.running=true;this.step=0;this.loop();this.sfx('startup');}
  activateOrToggle(){
    if(!this.ensure())return this.muted;
    if(!this.running||this.context.state!=='running'){this.muted=false;this.master.gain.setTargetAtTime(.82,this.context.currentTime,.02);this.start();return false;}
    return this.toggleMute();
  }
  setTheme(theme){if(this.theme===theme)return;this.theme=theme;this.step=0;}
  toggleMute(){this.muted=!this.muted;if(this.master&&this.context)this.master.gain.setTargetAtTime(this.muted?0:.82,this.context.currentTime,.03);return this.muted;}
  frequency(midi){return 440*Math.pow(2,(midi-69)/12);}
  note(midi,duration=.18,type='square',volume=.08,when=0,destination=this.music){
    if(!this.context||this.muted)return;const now=this.context.currentTime+when,osc=this.context.createOscillator(),gain=this.context.createGain();
    osc.type=type;osc.frequency.setValueAtTime(this.frequency(midi),now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(gain);gain.connect(destination);osc.start(now);osc.stop(now+duration+.03);
  }
  loop(){
    if(!this.running)return;
    const themes={
      'dawnleaf-town':{tempo:310,melody:[72,76,79,76,74,77,81,77],bass:[48,48,53,55],wave:'triangle'},
      'dawnleaf-field':{tempo:245,melody:[69,72,76,72,67,71,74,71],bass:[45,48,43,47],wave:'square'},
      'crownwind-town':{tempo:330,melody:[67,71,74,79,76,74,71,69],bass:[43,50,46,48],wave:'triangle'},
      'crownwind-field':{tempo:225,melody:[64,67,71,74,71,67,66,69],bass:[40,43,38,42],wave:'square'},
      interior:{tempo:380,melody:[72,null,76,null,79,null,76,null],bass:[48,53,55,53],wave:'sine'},
    },theme=themes[this.theme]||themes['dawnleaf-town'],index=this.step%theme.melody.length,midi=theme.melody[index];
    if(midi)this.note(midi,.20,theme.wave,.13);if(this.step%2===0)this.note(theme.bass[Math.floor(this.step/2)%theme.bass.length],.32,'triangle',.09);
    if(this.step%4===2)this.note(84,.05,'square',.04);this.step++;this.timer=setTimeout(()=>this.loop(),theme.tempo);
  }
  sfx(name){
    if(!this.ensure()||this.muted)return;this.context.resume();const play=(midi,duration,type='square',volume=.14,delay=0)=>this.note(midi,duration,type,volume,delay,this.effects);
    const sounds={
      jump:()=>{play(69,.09,'square',.11);play(76,.12,'square',.09,.06);},attack:()=>{play(55,.05,'sawtooth',.13);play(48,.10,'square',.08,.045);},
      hit:()=>{play(43,.07,'sawtooth',.16);play(38,.09,'square',.10,.035);},hurt:()=>{play(52,.10,'sawtooth',.15);play(45,.16,'triangle',.12,.07);},
      defeat:()=>{play(60,.08,'square',.12);play(55,.08,'square',.10,.07);play(48,.18,'triangle',.12,.14);},pickup:()=>{play(76,.07,'square',.10);play(81,.08,'square',.09,.055);play(88,.12,'triangle',.08,.11);},
      chest:()=>{play(60,.10,'triangle',.11);play(67,.10,'triangle',.11,.09);play(72,.20,'triangle',.12,.18);},portal:()=>{play(60,.12,'sine',.10);play(67,.15,'sine',.10,.08);play(79,.28,'sine',.10,.16);},
      dialogue:()=>play(79,.055,'triangle',.08),ui:()=>play(72,.055,'square',.10),startup:()=>{play(67,.10,'triangle',.13);play(72,.12,'triangle',.14,.09);play(79,.22,'square',.12,.18);},complete:()=>{[60,64,67,72,76,79,84].forEach((note,index)=>play(note,.24,index<3?'triangle':'square',.13,index*.085));},
    };(sounds[name]||sounds.ui)();
  }
}

class SkyberryHollow extends Phaser.Scene {
  constructor() { super('hollow'); }

  preload() {
    this.load.image('hollow', 'public/assets/skyberry-hollow-grid.png');
    this.load.json('runtime-assets-800',`public/assets/runtime-800/manifest.json?v=${ASSET_VERSION}`);
    MAP_LIST.forEach(map=>{
      this.load.image(`map-back-${map.id}`,`public/assets/runtime-800/environments/${map.art}-back.png?v=${ASSET_VERSION}`);
      this.load.image(`map-mid-${map.id}`,`public/assets/runtime-800/environments/${map.art}-mid.png?v=${ASSET_VERSION}`);
      ['left','mid','right'].forEach(part=>this.load.image(`platform-${map.id}-${part}`,`public/assets/runtime-800/terrain/${map.art}-platform-${part}.png?v=${ASSET_VERSION}`));
      this.load.image(`ground-${map.id}`,`public/assets/runtime-800/terrain/${map.art}-ground.png?v=${ASSET_VERSION}`);
      this.load.image(`slope-${map.id}-up`,`public/assets/runtime-800/terrain/${map.art}-slope-up.png?v=${ASSET_VERSION}`);
      this.load.image(`slope-${map.id}-down`,`public/assets/runtime-800/terrain/${map.art}-slope-down.png?v=${ASSET_VERSION}`);
      if(map.kind==='interior')this.load.image(`shop-interior-${map.id}`,`public/assets/runtime-800/shops/${map.id}-interior.png?v=${ASSET_VERSION}`);
      if(map.kind==='town')this.load.image(`shop-facade-${map.id}`,`public/assets/runtime-800/shops/${map.id}-facade.png?v=${ASSET_VERSION}`);
    });
    this.load.spritesheet('body-motion', `public/assets/runtime-800/legacy-player/body-motion.png?v=${ASSET_VERSION}`, { frameWidth:96, frameHeight:128 });
    this.load.spritesheet('body-air', `public/assets/runtime-800/legacy-player/body-air.png?v=${ASSET_VERSION}`, { frameWidth:128, frameHeight:128 });
    this.load.spritesheet('body-attack-none', `public/assets/runtime-800/legacy-player/body-attack-none.png?v=${ASSET_VERSION}`, { frameWidth:192, frameHeight:128 });
    this.load.spritesheet('body-attack-wood', `public/assets/runtime-800/legacy-player/body-attack-wood.png?v=${ASSET_VERSION}`, { frameWidth:192, frameHeight:128 });
    this.load.spritesheet('body-attack-axe', `public/assets/runtime-800/legacy-player/body-attack-axe.png?v=${ASSET_VERSION}`, { frameWidth:256, frameHeight:160 });
    this.load.json('paperdoll-anchors', `public/assets/runtime-800/legacy-player/anchors.json?v=${ASSET_VERSION}`);
    this.load.atlas('avatar-rig-v1', `public/assets/runtime-800/player-rig/atlas.png?v=${ASSET_VERSION}`, `public/assets/runtime-800/player-rig/atlas.json?v=${ASSET_VERSION}`);
    this.load.json('avatar-rig-v1-manifest', `public/assets/runtime-800/player-rig/rig.json?v=${ASSET_VERSION}`);
    this.load.spritesheet('npc-v1', `public/assets/npcs-v1.png?v=${ASSET_VERSION}`, { frameWidth:48, frameHeight:64 });
    ALL_NPC_NAMES.forEach(name=>this.load.spritesheet(`npc-${npcSlug(name)}`,`public/assets/runtime-800/npcs/${npcSlug(name)}.png?v=${ASSET_VERSION}`,{frameWidth:104,frameHeight:136}));
    Object.keys(ENEMY_TYPES).forEach(type=>this.load.spritesheet(`enemy-${type}`,`public/assets/runtime-800/enemies/${type}.png?v=${ASSET_VERSION}`,{frameWidth:96,frameHeight:96}));
    ['chest-closed','chest-open','coin','potion','equipment','sprig_leaf','bramble_quill','tide_shell','stone_core','glow_spore','star_shard','bell_fragment'].forEach(item=>
      this.load.image(`item-${item}`,`public/assets/runtime-800/items/${item}.png?v=${ASSET_VERSION}`));
    const sequences = {
      motion:{width:96,height:128}, air:{width:128,height:128},
      'attack-none':{width:192,height:128}, 'attack-wood':{width:192,height:128},
      'attack-axe':{width:256,height:160},
    };
    Object.entries(sequences).forEach(([sequence, size]) => {
      HAT_STYLES.forEach(style => this.load.spritesheet(
        `hat-${style}-${sequence}`, `public/assets/runtime-800/legacy-player/equipment/hat-${style}-${sequence}.png?v=${ASSET_VERSION}`,
        {frameWidth:size.width,frameHeight:size.height},
      ));
      CLOTHES_STYLES.forEach(style => this.load.spritesheet(
        `clothes-${style}-${sequence}`, `public/assets/runtime-800/legacy-player/equipment/clothes-${style}-${sequence}.png?v=${ASSET_VERSION}`,
        {frameWidth:size.width,frameHeight:size.height},
      ));
      CAPE_STYLES.forEach(style => this.load.spritesheet(
        `cape-${style}-${sequence}`, `public/assets/runtime-800/legacy-player/equipment/cape-${style}-${sequence}.png?v=${ASSET_VERSION}`,
        {frameWidth:size.width+8,frameHeight:size.height},
      ));
    });
    this.load.spritesheet('mistruffle-ground-v3', 'public/assets/mistruffle-ground-v3.png', { frameWidth: 48, frameHeight: 48 });
  }

  create() {
    this.audio=new GameAudio();
    this.game.canvas.setAttribute('tabindex','0');
    this.input.on('pointerdown',()=>{this.game.canvas.focus();this.audio.start();});
    this.setupInventory();
    this.playerName=(localStorage.getItem('skyberry_name')||'Lumi').slice(0,14);
    const startAdventure=event=>{
      this.audio.start();
      this.playerName=(event.detail?.name||'Lumi').slice(0,14);
      this.chapterStartedAt=this.time.now;
      if(!new URLSearchParams(window.location.search).has('map'))this.enterMap('sprout_camp','camp',true);
      this.refreshHud();this.requestInventoryRefresh();
      if(this.previewChapterComplete)this.time.delayedCall(350,()=>this.showChapterOneComplete());
      const playtestClass=new URLSearchParams(window.location.search).get('playtest');
      if(['beginner','warrior','bowman','magician'].includes(playtestClass))this.time.delayedCall(180,()=>this.runStorylinePlaytest(playtestClass));
    };
    window.addEventListener('skyberry:start',startAdventure);
    if(window.__skyberryStartRequest)this.time.delayedCall(0,()=>startAdventure({detail:window.__skyberryStartRequest}));
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.createParallaxMaps();
    this.makeTextures();
    this.addFireflies();
    this.platformSurfaces=this.cache.json.get('runtime-assets-800').maps;
    this.createTileMap();
    this.paperdollAnchors = this.cache.json.get('paperdoll-anchors');
    this.capeLayer = this.add.sprite(108, 594, 'cape-indigo-motion', 0).setDepth(3.3);
    this.player = this.physics.add.sprite(108, 594, 'body-motion', 0).setVisible(false).setCollideWorldBounds(true).setSize(44, 84).setOffset(26, 42);
    this.bodyLayer = this.add.sprite(108, 594, 'body-motion', 0).setDepth(4);
    this.clothesLayer = this.add.sprite(108, 594, 'clothes-traveler-motion', 0).setDepth(4.4);
    this.hatLayer = this.add.sprite(108, 594, 'hat-traveler-motion', 0).setDepth(5);
    this.carriedWeapon = this.add.sprite(this.player.x - 9, this.player.y + 2, 'carry-wood').setDepth(3).setOrigin(.5, .72).setAngle(-28);
    this.rigManifest = this.cache.json.get('avatar-rig-v1-manifest');
    this.createRigLayers();
    this.player.setData({ facing: 1, canAttack: true, attacking: false, score: 0 });
    this.bodyLayer.play('body-idle');
    this.syncEquipmentLayers();
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.player, this.oneWayPlatforms);
    this.physics.add.collider(this.player, this.mapBoundaries);
    this.enemies = this.physics.add.group();
    MAP_LIST.filter(map=>map.kind==='field').forEach(map=>map.enemies.forEach(([x,y,minX,maxX,type])=>
      this.spawnWisp(map.x+x,y,map.x+minX,map.x+maxX,map.region,map.id,type)
    ));
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
    this.currency=0;this.materials={};this.consumables={redPotion:1};
    this.drops=this.physics.add.group();
    this.physics.add.collider(this.drops,this.groundLayer);
    this.physics.add.overlap(this.player,this.drops,this.collectDrop,null,this);
    this.projectiles=this.physics.add.group({allowGravity:false});
    this.physics.add.overlap(this.projectiles,this.enemies,this.projectileHit,null,this);
    this.createNPCs();
    this.createPortals();
    this.createChests();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('A,E,I,J,M,Q,S,V,SPACE');
    if(document.activeElement?.id==='hero-name')this.input.keyboard.enabled=false;
    window.addEventListener('skyberry:namefocus',event=>{
      if(!this.input?.keyboard)return;
      this.input.keyboard.enabled=!event.detail?.focused;
      if(event.detail?.focused)this.input.keyboard.resetKeys();
    });
    this.hpValue = this.maxHp();
    this.lastGrounded = 0;
    this.fixedUiObjects=[];
    this.cameras.main.setZoom(1);
    this.makeHud();
    this.hudContainer=this.add.container(0,0,this.fixedUiObjects).setDepth(100).setScrollFactor(0);
    this.inventoryOpen = false;
    this.questPanelOpen = false;
    this.buildInventoryPanel();
    this.cameras.main.startFollow(this.player,true,.12,.12);
    this.cameras.main.setDeadzone(240,140).setRoundPixels(true);
    const requestedMap=new URLSearchParams(window.location.search).get('map');
    const initialMap=MAP_DEFINITIONS[requestedMap]?requestedMap:'sprout_camp';
    this.enterMap(initialMap,initialMap==='sprout_camp'?'camp':'left',true);
    this.syncFixedUi();
    this.updateQuestHud();
    if(new URLSearchParams(window.location.search).get('preview')==='chapter-complete'){
      this.mainQuest.stage=8;this.mainQuest.echoes={stonewatch:true,greenbloom:true,starwillow:true};this.totalKills=12;
      this.previewChapterComplete=true;
    }
  }

  makeTextures() {
    const g = this.make.graphics({ add: false });
    // Low-resolution source textures deliberately scale as clean, hard-edged pixels.
    g.fillStyle(0x49343f).fillRect(0, 7, 12, 5); g.fillStyle(0x77514b).fillRect(0, 5, 12, 3); g.fillStyle(0x8dab55).fillRect(0, 2, 12, 4); g.fillStyle(0xd4e883).fillRect(0, 0, 12, 2); g.fillStyle(0xf0f4a4).fillRect(2, 0, 3, 1); g.generateTexture('terrain-tile', 12, 12); g.clear();
    g.fillStyle(0x593b79).fillRect(5, 8, 14, 10); g.fillStyle(0xfb83a6).fillRect(7, 7, 10, 9); g.fillStyle(0xffefa3).fillRect(8, 6, 4, 3); g.generateTexture('berry', 24, 24); g.clear();
    g.fillStyle(0x9a592f).fillRect(1,4,14,9);g.fillStyle(0xf3c85c).fillRect(3,2,10,11);g.fillStyle(0xffef9a).fillRect(5,3,4,2);g.generateTexture('coin-drop',16,16);g.clear();
    g.fillStyle(0x51364d).fillRect(2,4,14,11);g.fillStyle(0xc98b65).fillRect(4,2,10,12);g.fillStyle(0xf2d38b).fillRect(7,4,4,4);g.generateTexture('loot-drop',18,18);g.clear();
    g.fillStyle(0x50362f).fillRect(1,5,30,18);g.fillStyle(0xb06b3e).fillRect(3,7,26,14);g.fillStyle(0xe0b467).fillRect(1,4,30,5);g.fillStyle(0x5d446a).fillRect(14,10,5,7);g.generateTexture('chest-closed',32,24);g.clear();
    g.fillStyle(0x50362f).fillRect(1,10,30,13);g.fillStyle(0xb06b3e).fillRect(3,12,26,9);g.fillStyle(0xe0b467).fillRect(1,9,30,5);g.fillStyle(0x7c563b).fillRect(3,2,26,7);g.generateTexture('chest-open',32,24);g.clear();
    // Practice sword uses the same warm wood palette as its baked attack frames.
    g.fillStyle(0x502119).fillRect(3, 0, 3, 18);
    g.fillStyle(0x93452f).fillRect(4, 1, 2, 16);
    g.fillStyle(0xc7633d).fillRect(4, 2, 1, 14);
    g.fillStyle(0xb45e3a).fillRect(1, 17, 7, 2);
    g.fillStyle(0x6f3524).fillRect(3, 19, 3, 7);
    g.fillStyle(0x3f1515).fillRect(4, 25, 2, 1);
    g.generateTexture('carry-wood', 9, 26); g.clear();
    g.fillStyle(0x815036).fillRect(6, 5, 3, 23); g.fillStyle(0xa86b46).fillRect(7, 6, 1, 21); g.fillStyle(0x9db9c7).fillRect(2, 0, 10, 8); g.fillStyle(0xd9f0f3).fillRect(1, 1, 8, 3); g.fillStyle(0x496b82).fillRect(9, 2, 4, 7); g.fillStyle(0xffd56b).fillRect(6, 6, 3, 3); g.generateTexture('carry-axe', 14, 28); g.clear();
    g.lineStyle(2,0x7a452b).beginPath().arc(8,13,7,-1.25,1.25).strokePath(); g.lineStyle(1,0xe5bd73).lineBetween(10,6,10,20); g.fillStyle(0x553022).fillRect(8,11,4,4); g.generateTexture('carry-bow',18,26); g.clear();
    g.fillStyle(0x604064).fillRect(3,3,3,25); g.fillStyle(0xa986bd).fillRect(4,4,1,22); g.fillStyle(0x7ae0e0).fillRect(1,0,7,6); g.fillStyle(0xe9ffff).fillRect(3,1,3,3); g.generateTexture('carry-staff',9,28); g.clear();
    g.fillStyle(0xe7c078).fillRect(0,1,15,2); g.fillStyle(0x805133).fillRect(14,0,3,4); g.fillStyle(0xfff0b2).fillTriangle(17,2,13,0,13,4); g.generateTexture('arrow-shot',18,4); g.clear();
    g.fillStyle(0x6654ad).fillRect(1,1,6,6); g.fillStyle(0x8be7ef).fillRect(2,0,4,8); g.fillStyle(0xeaffff).fillRect(3,2,3,3); g.generateTexture('orb-shot',8,8); g.clear();
    const npcTexture=(key,coat,accent)=>{g.fillStyle(0x57382f).fillRect(5,1,10,8);g.fillStyle(0xf4c99c).fillRect(6,6,8,8);g.fillStyle(coat).fillRect(4,14,12,15);g.fillStyle(accent).fillRect(3,16,14,4);g.fillStyle(0x49302e).fillRect(5,29,4,5).fillRect(11,29,4,5);g.generateTexture(key,20,34);g.clear();};
    npcTexture('npc-guide',0xe3a35d,0xffe6a3); npcTexture('npc-captain',0x4d6d91,0xf2d581); npcTexture('npc-warrior',0x9d4f44,0xe0b47c); npcTexture('npc-bowman',0x5f9c55,0xd5e88b); npcTexture('npc-magician',0x7662ae,0x82e0e0);
    g.destroy();
    if (!this.anims.exists('body-idle')) this.anims.create({ key:'body-idle', frames:this.anims.generateFrameNumbers('body-motion', {frames:[0,1,2,3]}), frameRate:2, repeat:-1, repeatDelay:500 });
    if (!this.anims.exists('body-walk')) this.anims.create({ key:'body-walk', frames:this.anims.generateFrameNumbers('body-motion', {frames:[4,5,6,7,8,9,10,11]}), frameRate:12, repeat:-1 });
    ['none','wood','axe'].forEach(pose => {
      const key=`body-attack-${pose}`, attack=ATTACKS[pose];
      if (!this.anims.exists(key)) this.anims.create({key,frames:this.anims.generateFrameNumbers(key,{frames:[0,1,2,3]}),frameRate:attack.frameRate,repeat:0});
    });
    if (!this.anims.exists('mistruffle-idle-v3')) this.anims.create({ key: 'mistruffle-idle-v3', frames: this.anims.generateFrameNumbers('mistruffle-ground-v3', { frames: [0, 1] }), frameRate: 2, repeat: -1, repeatDelay: 700 });
    if (!this.anims.exists('mistruffle-walk-v3')) this.anims.create({ key: 'mistruffle-walk-v3', frames: this.anims.generateFrameNumbers('mistruffle-ground-v3', { frames: [2, 3] }), frameRate: 5, repeat: -1 });
    Object.keys(ENEMY_TYPES).forEach(type=>{
      if(!this.anims.exists(`enemy-${type}-walk`))this.anims.create({key:`enemy-${type}-walk`,frames:this.anims.generateFrameNumbers(`enemy-${type}`,{frames:[0,1,2,3]}),frameRate:5,repeat:-1});
      if(!this.anims.exists(`enemy-${type}-die`))this.anims.create({key:`enemy-${type}-die`,frames:this.anims.generateFrameNumbers(`enemy-${type}`,{frames:[4,5]}),frameRate:8,repeat:0});
    });
    ALL_NPC_NAMES.forEach(name=>{const slug=npcSlug(name),key=`npc-${slug}-idle`;if(!this.anims.exists(key))this.anims.create({key,frames:this.anims.generateFrameNumbers(`npc-${slug}`,{frames:[0,1,2,3]}),frameRate:3,repeat:-1,repeatDelay:Phaser.Math.Between(350,900)});});
  }

  setupInventory() {
    this.itemCatalog = {
      beginner_cap: { name:'COTTON BANDANA', slot:'hat', stat:'VIT +1', desc:'A Dawnleaf apprentice keepsake.', look:'traveler', classId:'beginner', rarity:'COMMON', bonuses:{vit:1} },
      beginner_clothes: { name:'BEGINNER TUNIC', slot:'clothes', stat:'DEF +1', desc:'Simple clothes issued to new apprentices.', look:'traveler', classId:'beginner', rarity:'COMMON', bonuses:{def:1} },
      beginner_cape: { name:'ISLAND MANTLE', slot:'cape', stat:'DEX +1', desc:'A light mantle for the Dawnleaf trails.', look:'indigo', classId:'beginner', rarity:'COMMON', bonuses:{dex:1} },
      beginner_sword: { name:'WOODEN SWORD', slot:'weapon', stat:'ATK +3', desc:'A safe training sword carved by islanders.', weapon:'wood', classId:'beginner', rarity:'COMMON', bonuses:{atk:3} },
      warrior_helm: { name:'IRONWARD HELM', slot:'hat', stat:'STR +2 • VIT +1', desc:'A Stonewatch-forged helm for committed Warriors.', look:'traveler', classId:'warrior', rarity:'RARE', bonuses:{str:2,vit:1} },
      warrior_armor: { name:'IRON BODY MAIL', slot:'clothes', stat:'DEF +4 • VIT +2', desc:'Layered training mail from the Warrior mentor.', look:'moss', classId:'warrior', rarity:'RARE', bonuses:{def:4,vit:2} },
      warrior_cape: { name:'HIGHLAND CAPE', slot:'cape', stat:'DEF +2 • HP +15', desc:'A heavy cape that steadies a frontliner.', look:'moss', classId:'warrior', rarity:'RARE', bonuses:{def:2,hp:15} },
      warrior_axe: { name:'STONEWATCH BATTLE AXE', slot:'weapon', stat:'ATK +7 • STR +1', desc:'A slow, powerful axe awarded at advancement.', weapon:'axe', classId:'warrior', rarity:'EPIC', bonuses:{atk:7,str:1} },
      bowman_cap: { name:'GREENBLOOM SCOUT CAP', slot:'hat', stat:'DEX +2 • CRIT +2%', desc:'A bright cap that keeps the sight line clear.', look:'berry', classId:'bowman', rarity:'RARE', bonuses:{dex:2,crit:2} },
      bowman_clothes: { name:'ARCHER TRAINING SUIT', slot:'clothes', stat:'DEX +2 • DEF +1', desc:'Flexible fieldwear for mobile ranged combat.', look:'traveler', classId:'bowman', rarity:'RARE', bonuses:{dex:2,def:1} },
      bowman_cape: { name:'GREENWIND CAPE', slot:'cape', stat:'DEX +1 • HP +5', desc:'A short cape cut to avoid the bowstring.', look:'indigo', classId:'bowman', rarity:'RARE', bonuses:{dex:1,hp:5} },
      bowman_bow: { name:'GREENBLOOM LONG BOW', slot:'weapon', stat:'ATK +6 • DEX +1', desc:'A balanced beginner bow with generous range.', weapon:'bow', classId:'bowman', rarity:'EPIC', bonuses:{atk:6,dex:1} },
      magician_hat: { name:'STARWILLOW WISDOM CAP', slot:'hat', stat:'INT +2 • CRIT +1%', desc:'A violet cap threaded with quiet mana.', look:'arcane', classId:'magician', rarity:'RARE', bonuses:{int:2,crit:1} },
      magician_robe: { name:'MANAWEAVE ROBE', slot:'clothes', stat:'INT +2 • DEF +1', desc:'Arcane cloth that amplifies spellcasting.', look:'arcane', classId:'magician', rarity:'RARE', bonuses:{int:2,def:1} },
      magician_cape: { name:'STARWILLOW MANTLE', slot:'cape', stat:'INT +1 • HP +10', desc:'A luminous mantle from the forest academy.', look:'arcane', classId:'magician', rarity:'RARE', bonuses:{int:1,hp:10} },
      magician_staff: { name:'WOODEN WAND', slot:'weapon', stat:'ATK +6 • INT +1', desc:'A living-wood focus for Energy Bolt.', weapon:'staff', classId:'magician', rarity:'EPIC', bonuses:{atk:6,int:1} },
    };
    this.classLoadouts = {
      beginner:{hat:'beginner_cap',clothes:'beginner_clothes',cape:'beginner_cape',weapon:'beginner_sword'},
      warrior:{hat:'warrior_helm',clothes:'warrior_armor',cape:'warrior_cape',weapon:'warrior_axe'},
      bowman:{hat:'bowman_cap',clothes:'bowman_clothes',cape:'bowman_cape',weapon:'bowman_bow'},
      magician:{hat:'magician_hat',clothes:'magician_robe',cape:'magician_cape',weapon:'magician_staff'},
    };
    this.equipment = {hat:null,clothes:'beginner_clothes',cape:null,weapon:'beginner_sword'};
    this.inventory = [];
    this.progression = { level:1, xp:0, statPoints:0, skillPoints:1, skills:{aoe:1}, classId:'beginner', allocated:{str:0,dex:0,int:0,vit:0}, unlockedClasses:{beginner:true}, advanced:false };
    this.quest = { tutorial:'not_started', berries:0, mobs:0, ferryUnlocked:false, advancement:null, advancementKills:0 };
    this.storyQuestState={};
    this.mainQuest={stage:0,echoes:{}};
    this.chapterStartedAt=this.time.now;this.totalKills=0;this.chapterOneRewarded=false;this.pendingChapterOneComplete=false;
    this.dialogueHistory=[];
    this.questJournalTab='quests';
    this.questHistoryPage=0;
    this.discoveredSecrets=new Set();
    this.lastTownMapId='sprout_camp';
    this.inventoryTab = 'gear';
    this.selectedItemId = this.equipment.weapon;
    this.selectedItemSource = 'equipment';
  }

  currentHat() { return this.equipment.hat ? this.itemCatalog[this.equipment.hat].look : null; }
  currentClothes() { return this.equipment.clothes ? this.itemCatalog[this.equipment.clothes].look : null; }
  currentCape() { return this.equipment.cape ? this.itemCatalog[this.equipment.cape].look : null; }
  currentWeapon() { return this.equipment.weapon ? this.itemCatalog[this.equipment.weapon].weapon : 'none'; }
  classProfile() { return CLASS_PROFILES[this.progression.classId]; }
  xpToNext() { return 60 + this.progression.level * 20; }
  gearBonuses() {
    const total = {str:0,dex:0,int:0,vit:0,atk:0,def:0,hp:0,crit:0};
    Object.values(this.equipment).filter(Boolean).forEach(itemId => {
      const bonuses = this.itemCatalog[itemId].bonuses || {};
      Object.keys(total).forEach(key => { total[key] += bonuses[key] || 0; });
    });
    return total;
  }
  coreStats() {
    const profile = this.classProfile();
    const levels = this.progression.level - 1;
    const stats = {};
    ['str','dex','int','vit'].forEach(key => {
      stats[key] = profile.base[key] + Math.floor(profile.growth[key] * levels) + this.progression.allocated[key];
    });
    return stats;
  }
  totalStats() {
    const core = this.coreStats(), gear = this.gearBonuses();
    return {str:core.str+gear.str,dex:core.dex+gear.dex,int:core.int+gear.int,vit:core.vit+gear.vit};
  }
  derivedStats() {
    const profile = this.classProfile(), stats = this.totalStats(), gear = this.gearBonuses();
    const primary = stats[profile.primary], secondary = stats[profile.secondary];
    return {
      maxHp:65 + stats.vit * 7 + this.progression.level * 4 + profile.hpBonus + gear.hp,
      attack:2 + Math.floor(primary * .75) + Math.floor(secondary * .25) + profile.attackBonus + gear.atk,
      defense:Math.floor(stats.vit * .5 + stats.str * .15) + profile.defenseBonus + gear.def,
      crit:Math.min(35, 4 + Math.floor(stats.dex * .6) + profile.critBonus + gear.crit),
    };
  }
  attackPower() { return this.derivedStats().attack; }
  defense() { return this.derivedStats().defense; }
  maxHp() { return this.derivedStats().maxHp; }

  equipItem(itemId) {
    const item = this.itemCatalog[itemId];
    if (!item || (item.classId && item.classId !== this.progression.classId)) return;
    const healthRatio = this.hpValue / this.maxHp();
    const previous = this.equipment[item.slot];
    this.equipment[item.slot] = itemId;
    this.inventory = this.inventory.filter(id => id !== itemId);
    if (previous) this.inventory.push(previous);
    this.classLoadouts[this.progression.classId] = {...this.equipment};
    this.hpValue = Math.max(1, Math.round(this.maxHp() * healthRatio));
    this.selectedItemId = itemId;
    this.selectedItemSource = 'equipment';
    this.refreshHud();
    this.refreshAppearance();
    this.requestInventoryRefresh();
  }

  unequipSlot(slot) {
    const itemId = this.equipment[slot];
    if (!itemId) return;
    const healthRatio = this.hpValue / this.maxHp();
    this.inventory.push(itemId);
    this.equipment[slot] = null;
    this.classLoadouts[this.progression.classId] = {...this.equipment};
    this.hpValue = Math.max(1, Math.round(this.maxHp() * healthRatio));
    this.selectedItemId = itemId;
    this.selectedItemSource = 'inventory';
    this.refreshHud();
    this.refreshAppearance();
    this.requestInventoryRefresh();
  }

  allocateStat(stat) {
    if (this.progression.statPoints <= 0) return;
    this.progression.statPoints -= 1;
    this.progression.allocated[stat] += 1;
    this.refreshHud();
    this.requestInventoryRefresh();
  }

  chooseClass(classId) {
    if (classId === this.progression.classId || !this.progression.unlockedClasses[classId] || this.progression.advanced) return;
    const healthRatio = this.hpValue / this.maxHp();
    this.progression.classId = classId;
    this.equipment = {...this.classLoadouts[classId]};
    this.inventory = [];
    this.selectedItemId = this.equipment.weapon;
    this.selectedItemSource = 'equipment';
    this.hpValue = Math.max(1, Math.round(this.maxHp() * healthRatio));
    this.refreshHud();
    this.refreshAppearance();
    this.requestInventoryRefresh();
  }

  advanceClass(classId) {
    this.progression.unlockedClasses[classId] = true;
    this.chooseClass(classId);
    this.progression.advanced = true;
  }

  gainXp(amount) {
    this.progression.xp += amount;
    let leveled = false;
    while (this.progression.xp >= this.xpToNext()) {
      this.progression.xp -= this.xpToNext();
      this.progression.level += 1;
      this.progression.statPoints += 2;
      this.progression.skillPoints += 1;
      leveled = true;
    }
    if (leveled) {
      this.hpValue = this.maxHp();
      const notice = this.add.text(this.player.x, this.player.y - 38, `LEVEL ${this.progression.level}!\n+2 STAT POINTS`, {
        align:'center',fontFamily:UI_FONT,fontSize:'8px',fontStyle:'bold',color:'#fff2a8',stroke:'#57406f',strokeThickness:2,
      }).setOrigin(.5).setDepth(35);
      this.uiCamera?.ignore(notice);
      this.tweens.add({targets:notice,y:notice.y-18,alpha:0,duration:1100,onComplete:()=>notice.destroy()});
    }
    this.refreshHud();
    if (this.inventoryOpen) this.requestInventoryRefresh();
  }

  createRigLayers() {
    if (!this.rigManifest) return;
    this.rigLayers = {};
    const order = this.rigManifest.drawOrder.default;
    order.forEach((slot,index) => {
      this.rigLayers[slot] = this.add.sprite(this.player.x,this.player.y,'avatar-rig-v1')
        .setDepth(3.15 + index * .08).setVisible(false);
    });
  }

  usesRigSlice() {
    if (!this.rigManifest || this.progression.classId !== 'beginner') return false;
    // Never swap render pipelines in the middle of an animation. Rigid
    // weapons follow the rig's authored hand socket during attack frames.
    const allowed = {
      hat:[null,'beginner_cap'], clothes:[null,'beginner_clothes'], cape:[null,'beginner_cape'], weapon:[null,'beginner_sword'],
    };
    return Object.entries(allowed).every(([slot,values])=>values.includes(this.equipment[slot] || null));
  }

  rigAnimationState() {
    const texture = this.bodyLayer.texture.key;
    const rawFrame = Number(this.bodyLayer.frame.name) || 0;
    if (texture === 'body-air') return { animation: rawFrame === 3 ? 'fall' : 'jump', frame:0 };
    if (texture.startsWith('body-attack-')) return { animation:this.currentWeapon()==='wood'?'attack-wood':'attack', frame:Math.min(3,rawFrame) };
    return rawFrame >= 4 ? { animation:'walk', frame:rawFrame-4 } : { animation:'idle', frame:rawFrame };
  }

  rigActiveItems() {
    const items = { body:'base_body' };
    if (this.equipment.clothes === 'beginner_clothes') items.clothes_front='beginner_tunic';
    if (this.equipment.hat === 'beginner_cap') items.hat_front='beginner_cap';
    if (this.equipment.cape === 'beginner_cape') items.cape_back='island_mantle';
    return items;
  }

  syncRigLayers() {
    if (!this.rigLayers || !this.rigManifest) return;
    const state = this.rigAnimationState();
    const animation = this.rigManifest.animations[state.animation];
    const [width,height] = animation.canvas;
    const [rootX,rootY] = animation.root;
    const hidden = new Set();
    const items = this.rigActiveItems();
    Object.values(items).forEach(itemId => {
      const item = this.rigManifest.items[itemId];
      if (!item) return;
      (item.hides || []).forEach(slot => hidden.add(slot));
      (item.replaces || []).forEach(slot => hidden.add(slot));
    });
    const order = this.rigManifest.drawOrder[state.animation === 'attack' ? 'attack' : 'default'];
    order.forEach((slot,index) => {
      const layer = this.rigLayers[slot];
      const itemId = items[slot];
      if (!itemId || hidden.has(slot)) { layer.setVisible(false); return; }
      const item = this.rigManifest.items[itemId];
      if (!item?.layers?.[slot]) { layer.setVisible(false); return; }
      layer.setVisible(true)
        .setTexture('avatar-rig-v1', `${itemId}/${slot}/${state.animation}/${state.frame}`)
        .setPosition(Math.round(this.player.x),Math.round(this.player.y))
        .setOrigin((this.player.flipX ? width-rootX : rootX)/width,rootY/height)
        .setScale(1)
        .setFlipX(this.player.flipX)
        .setDepth(3.15 + index * .08);
    });
  }

  visualLayers() {
    return [this.bodyLayer,this.clothesLayer,this.capeLayer,this.hatLayer,...Object.values(this.rigLayers || {})];
  }

  currentSequence() {
    const texture = this.bodyLayer.texture.key;
    if (texture === 'body-air') return 'air';
    if (texture.startsWith('body-attack-')) return texture.replace('body-', '');
    return 'motion';
  }

  syncVisualRoot() {
    const sequence = this.currentSequence();
    const frame = Number(this.bodyLayer.frame.name) || 0;
    const anchor = this.paperdollAnchors?.base?.[sequence] || ROOT_ANCHORS[sequence];
    const root = anchor.roots[frame] ?? anchor.width / 2;
    const originRoot = this.player.flipX ? anchor.width - root : root;
    this.bodyLayer.setPosition(Math.round(this.player.x), Math.round(this.player.y))
      .setOrigin(originRoot / anchor.width, anchor.originY)
      .setFlipX(this.player.flipX);
  }

  syncEquipmentLayers() {
    if (!this.player || !this.bodyLayer || !this.hatLayer || !this.clothesLayer || !this.capeLayer) return;
    this.syncVisualRoot();
    if (this.usesRigSlice()) {
      [this.bodyLayer,this.clothesLayer,this.hatLayer,this.capeLayer].forEach(layer=>layer.setVisible(false));
      this.syncRigLayers();
      return;
    }
    Object.values(this.rigLayers || {}).forEach(layer=>layer.setVisible(false));
    const sequence = this.currentSequence();
    const frame = Number(this.bodyLayer.frame.name) || 0;
    const baseAnchor = this.paperdollAnchors?.base?.[sequence] || ROOT_ANCHORS[sequence];
    const syncLayer = (layer, key, anchor = baseAnchor, offset = {x:0,y:0}) => {
      if (!key) { layer.setVisible(false); return; }
      layer.setVisible(true);
      if (layer.texture.key !== key) layer.setTexture(key, frame);
      else layer.setFrame(frame);
      const root = anchor.roots[frame] ?? anchor.width / 2;
      const originRoot = this.player.flipX ? anchor.width - root : root;
      const offsetX = this.player.flipX ? -offset.x : offset.x;
      layer.setPosition(Math.round(this.player.x + offsetX), Math.round(this.player.y + offset.y))
        .setOrigin(originRoot / anchor.width, anchor.originY)
        .setFlipX(this.player.flipX);
    };
    const hat = this.currentHat();
    const clothes = this.currentClothes();
    const cape = this.currentCape();
    const clothesAnchor = this.paperdollAnchors?.clothes?.[sequence] || baseAnchor;
    const socketOffset = clothes
      ? (this.paperdollAnchors?.socketDelta?.[sequence]?.[frame] || {x:0,y:0})
      : {x:0,y:0};
    this.bodyLayer.setVisible(!clothes);
    syncLayer(this.clothesLayer, clothes ? `clothes-${clothes}-${sequence}` : null, clothesAnchor);
    // Hat frames are authored in the same pose canvas as the visible body.
    // Share that body's root directly so attacks do not receive a second
    // inferred head correction.
    syncLayer(this.hatLayer, hat ? `hat-${hat}-${sequence}` : null, clothesAnchor, {x:0,y:-2});
    const capeAnchor={...baseAnchor,width:baseAnchor.width+8,roots:baseAnchor.roots.map(root=>root+4)};
    syncLayer(this.capeLayer, cape ? `cape-${cape}-${sequence}` : null, capeAnchor, socketOffset);
  }

  syncCarriedWeapon() {
    if (!this.carriedWeapon || !this.player) return;
    const weapon = this.currentWeapon();
    const facing = this.player.getData('facing');
    const rigSlice = this.usesRigSlice();
    const bakedRigWeapon=rigSlice&&this.player.getData('attacking')&&weapon==='wood';
    const visible = weapon !== 'none' && !bakedRigWeapon && (rigSlice || !this.player.getData('attacking'));
    this.carriedWeapon.setVisible(visible);
    if (!visible) return;
    if (rigSlice) {
      const state=this.rigAnimationState();
      const socket=this.rigManifest?.sockets?.hand?.[state.animation]?.[state.frame];
      if (socket) {
        const [x,y]=socket.position, [scaleX,scaleY]=socket.scale, [pivotX,pivotY]=socket.pivot;
        // Socket X is authored from the root toward the facing hand.
        this.carriedWeapon.setTexture('carry-wood').setPosition(Math.round(this.player.x+facing*x*2),Math.round(this.player.y+y*2))
          .setOrigin(pivotX,pivotY).setScale(scaleX*2,scaleY*2).setAngle(facing<0?-socket.rotation:socket.rotation)
          .setFlipX(facing<0).setDepth(3.72);
        return;
      }
    }
    const frame = Number(this.bodyLayer.frame.name) || 0;
    const texture = this.bodyLayer.texture.key;
    let attachment;
    if (texture === 'body-air') attachment = CARRY_ATTACHMENTS.air[frame] || CARRY_ATTACHMENTS.air[1];
    else if (frame >= 4) attachment = CARRY_ATTACHMENTS.walk[frame - 4] || CARRY_ATTACHMENTS.walk[0];
    else attachment = CARRY_ATTACHMENTS.idle[frame] || CARRY_ATTACHMENTS.idle[0];
    const carryTexture={axe:'carry-axe',bow:'carry-bow',staff:'carry-staff',wood:'carry-wood'}[weapon]||'carry-wood';
    this.carriedWeapon.setTexture(carryTexture);
    this.carriedWeapon.setPosition(Math.round(this.player.x - facing * attachment.x*2), Math.round(this.player.y + attachment.y*2)).setDepth(3.72).setScale(2);
    this.carriedWeapon.setFlipX(facing < 0).setAngle(facing < 0 ? -attachment.angle : attachment.angle);
  }

  refreshAppearance() {
    if (!this.player || this.player.getData('attacking')) return;
    if (this.player.body.velocity.y !== 0) {
      this.bodyLayer.anims.stop();
      this.bodyLayer.setTexture('body-air', this.player.body.velocity.y < 0 ? 1 : 3);
    } else {
      this.bodyLayer.play('body-idle', true);
    }
    this.syncEquipmentLayers();
    this.syncCarriedWeapon();
  }

  toggleInventory() {
    if(!this.inventoryOpen&&this.questPanelOpen)this.toggleQuestPanel();
    this.inventoryOpen = !this.inventoryOpen;
    this.inventoryPanel.setVisible(this.inventoryOpen);
    this.hudContainer?.setVisible(!this.inventoryOpen&&!this.worldMapOpen&&!this.questPanelOpen);
    if (this.inventoryOpen) {
      this.player.setVelocityX(0);
      this.physics.world.pause();
    } else this.physics.world.resume();
  }

  requestInventoryRefresh() {
    if (!this.inventoryPanel || this.inventoryRebuildQueued) return;
    this.inventoryRebuildQueued = true;
    this.time.delayedCall(16,()=>{
      this.inventoryRebuildQueued=false;
      if(this.inventoryPanel)this.buildInventoryPanel();
    });
  }

  buildInventoryPanel() {
    if (this.inventoryPanel) this.inventoryPanel.destroy(true);
    const inventoryScale=1.18;
    const panel = this.add.container((W-470*inventoryScale)/2, (H-272*inventoryScale)/2).setScale(inventoryScale).setDepth(140).setScrollFactor(0);
    const add = object => { object.setScrollFactor(0);panel.add(object); return object; };
    const box = (x,y,w,h,fill=0x233353,stroke=0x60779c,alpha=1) => add(
      this.add.rectangle(x,y,w,h,fill,alpha).setOrigin(0).setStrokeStyle(1,stroke)
    );
    const label = (x,y,text,size=8,color='#eaf2ff',extra={}) => add(this.add.text(x,y,text,{
      fontFamily:UI_FONT,fontSize:`${Math.max(9,size+1)}px`,color,lineSpacing:1,...extra,
    }).setResolution(4));
    const button = (x,y,w,h,text,onClick,active=false,disabled=false) => {
      const base = active ? 0x6179a3 : 0x344969;
      const shape = box(x,y,w,h,disabled?0x26344d:base,active?0xffdda0:0x7188a9);
      if (!disabled) {
        shape.setInteractive({useHandCursor:true});
        shape.on('pointerover',()=>shape.setFillStyle(active?0x718bb8:0x4a6287));
        shape.on('pointerout',()=>shape.setFillStyle(base));
        shape.on('pointerdown',onClick);
      }
      label(x+w/2,y+h/2,text,7,disabled?'#70819b':'#fff6dd',{fontStyle:'bold'}).setOrigin(.5);
      return shape;
    };
    const shortName = name => name.replace('TRAVELER ','TRAVEL ').replace('MOSSGUARD ','MOSS ');
    const rarityColor = {COMMON:0xa9bfd2,RARE:0x76d4a1,EPIC:0xc39af3};
    const itemTap=(key,onSingle,onDouble)=>{
      const now=this.time.now,last=this.lastInventoryTap;
      if(last?.key===key&&now-last.time<=360){this.lastInventoryTap=null;onDouble();return;}
      this.lastInventoryTap={key,time:now};onSingle();
    };

    add(this.add.rectangle(-(W-470)/2,-(H-272)/2,W,H,0x10172a,.62).setOrigin(0));
    add(this.add.rectangle(4,5,470,272,0x0b1223,.42).setOrigin(0));
    box(0,0,470,272,0x17233d,0xffe0a3);
    box(1,1,468,28,0x22375b,0x506a91);
    label(12,8,`${this.playerName.toUpperCase()}  /  CHARACTER & INVENTORY`,10,'#fff0b2',{fontStyle:'bold'});
    const profile = this.classProfile();
    label(292,9,`LV ${this.progression.level}  ${profile.name}`,7,'#cce7ff');
    button(442,6,20,16,'×',()=>this.toggleInventory());

    ['gear','stats','class','skills'].forEach((tab,index) => button(
      12+index*88,34,82,21,tab.toUpperCase(),()=>{this.inventoryTab=tab;this.requestInventoryRefresh();},this.inventoryTab===tab
    ));
    if(this.inventoryTab==='stats')label(286,41,`STAT POINTS  ${this.progression.statPoints}`,7,this.progression.statPoints?'#ffe08a':'#8295b2');
    box(12,61,446,1,0x4f6689,0x4f6689);

    if (this.inventoryTab === 'gear') {
      label(14,69,'EQUIPPED',8,'#9fc9ea',{fontStyle:'bold'});
      const slotLabels = {hat:'HEAD',clothes:'OUTFIT',cape:'CAPE',weapon:'WEAPON'};
      const slotGlyph = {hat:'H',clothes:'C',cape:'P',weapon:'W'};
      ['hat','clothes','cape','weapon'].forEach((slot,index) => {
        const x=14+(index%2)*87, y=83+Math.floor(index/2)*56;
        const itemId=this.equipment[slot], item=itemId?this.itemCatalog[itemId]:null;
        const selected=this.selectedItemSource==='equipment'&&this.selectedItemId===itemId;
        const card=box(x,y,81,49,item?0x2a4163:0x202d47,selected?0xffdc91:0x617897);
        card.setInteractive({useHandCursor:true}).on('pointerdown',()=>{
          if(!itemId)return;
          itemTap(`equipped:${slot}`,
            ()=>{this.selectedItemId=itemId;this.selectedItemSource='equipment';this.requestInventoryRefresh();},
            ()=>this.unequipSlot(slot));
        });
        box(x+5,y+8,18,18,item?0x425d83:0x293852,0x8095b2);
        label(x+14,y+17,slotGlyph[slot],9,item?'#fff0be':'#60718b',{fontStyle:'bold'}).setOrigin(.5);
        label(x+5,y+2,slotLabels[slot],6,'#8fb4d1');
        label(x+27,y+10,item?shortName(item.name):'EMPTY',6,item?'#fff9e8':'#72849e',{wordWrap:{width:49}});
        if(item) label(x+27,y+31,item.stat,5,'#9ed5b4',{wordWrap:{width:49}});
      });

      label(196,69,`BACKPACK  ${this.inventory.length}/8`,8,'#9fc9ea',{fontStyle:'bold'});
      for(let index=0;index<8;index++){
        const x=196+(index%4)*65,y=83+Math.floor(index/4)*52;
        const itemId=this.inventory[index],item=itemId?this.itemCatalog[itemId]:null;
        const selected=itemId&&this.selectedItemSource==='inventory'&&this.selectedItemId===itemId;
        const cell=box(x,y,59,46,item?0x293f60:0x1d2940,selected?0xffdc91:0x536b8d);
        if(item){
          cell.setInteractive({useHandCursor:true});
          cell.on('pointerover',()=>cell.setFillStyle(0x3a5378));cell.on('pointerout',()=>cell.setFillStyle(0x293f60));
          cell.on('pointerdown',()=>itemTap(`inventory:${itemId}`,
            ()=>{this.selectedItemId=itemId;this.selectedItemSource='inventory';this.requestInventoryRefresh();},
            ()=>this.equipItem(itemId)));
          box(x+4,y+5,15,15,0x415d84,rarityColor[item.rarity]||0xa9bfd2);
          label(x+11.5,y+12.5,item.slot[0].toUpperCase(),7,'#fff1c7',{fontStyle:'bold'}).setOrigin(.5);
          label(x+4,y+24,shortName(item.name),5,'#eef5ff',{wordWrap:{width:52}});
          box(x+4,y+42,51,2,parseInt((rarityColor[item.rarity]||0xa9bfd2).toString(16),16),rarityColor[item.rarity]||0xa9bfd2);
        } else label(x+29.5,y+23,'·',8,'#34435b').setOrigin(.5);
      }

      const selected=this.selectedItemId?this.itemCatalog[this.selectedItemId]:null;
      box(14,199,442,58,0x202f4a,0x60789a);
      if(selected){
        label(24,207,selected.name,8,rarityColor[selected.rarity]?'#ffe7a8':'#fff1c7',{fontStyle:'bold'});
        label(24,220,`${selected.rarity}  •  ${selected.stat}`,6,`#${(rarityColor[selected.rarity]||0xa9bfd2).toString(16).padStart(6,'0')}`);
        label(24,232,selected.desc,6,'#b9cce2',{wordWrap:{width:280}});
        const equipped=this.selectedItemSource==='equipment'&&this.equipment[selected.slot]===this.selectedItemId;
        button(369,215,75,24,equipped?'UNEQUIP':'EQUIP',()=>equipped?this.unequipSlot(selected.slot):this.equipItem(this.selectedItemId));
      } else label(24,223,'SELECT AN ITEM TO VIEW DETAILS',7,'#8497b1');
    } else if (this.inventoryTab === 'stats') {
      const derived=this.derivedStats(),stats=this.totalStats();
      box(14,70,137,185,0x202f4a,0x60789a);
      label(24,81,this.playerName.toUpperCase(),12,'#fff0b2',{fontStyle:'bold'});
      label(24,99,`${profile.name}  •  LV ${this.progression.level}`,7,'#9fd4f0');
      label(24,118,'HP',6,'#8ea8c5');box(24,127,109,7,0x111a2b,0x405472);
      box(25,128,107*(this.hpValue/this.maxHp()),5,0xee6f94,0xee6f94);
      label(24,138,`${this.hpValue} / ${this.maxHp()}`,6,'#ffdbe5');
      label(24,154,'XP',6,'#8ea8c5');box(24,163,109,7,0x111a2b,0x405472);
      box(25,164,107*(this.progression.xp/this.xpToNext()),5,0x78c7d8,0x78c7d8);
      label(24,174,`${this.progression.xp} / ${this.xpToNext()}`,6,'#cceff4');
      label(24,194,`ATTACK     ${derived.attack}\nDEFENSE    ${derived.defense}\nCRITICAL   ${derived.crit}%`,7,'#f3e6c8',{lineSpacing:4});

      label(165,70,'ATTRIBUTES',8,'#9fc9ea',{fontStyle:'bold'});
      ['str','dex','int','vit'].forEach((stat,index)=>{
        const y=86+index*40;
        box(165,y,291,34,0x243752,0x536d90);
        label(176,y+6,stat.toUpperCase(),9,'#ffe2a1',{fontStyle:'bold'});
        label(217,y+6,String(stats[stat]),10,'#ffffff',{fontStyle:'bold'});
        label(247,y+7,STAT_INFO[stat],6,'#abc0d8');
        button(423,y+7,24,20,'+',()=>this.allocateStat(stat),false,this.progression.statPoints<=0);
      });
      label(165,247,'CLASS GROWTH IS AUTOMATIC • SP LETS YOU SPECIALIZE',6,'#7f94b1');
    } else if(this.inventoryTab==='class') {
      label(14,70,`CURRENT PATH  ${profile.name}`,8,'#ffe0a0',{fontStyle:'bold'});
      label(14,82,this.progression.advanced?'Your mentor path is permanent. Each class has unique gear and combat.':'Finish Dawnleaf Isle, then earn a path from a Crownwind mentor.',6,'#9fb7d1');
      Object.entries(CLASS_PROFILES).forEach(([classId,classData],index)=>{
        const x=14+(index%2)*224,y=99+Math.floor(index/2)*77;
        const active=classId===this.progression.classId;
        const unlocked=Boolean(this.progression.unlockedClasses[classId]);
        const selectable=unlocked&&!active&&!this.progression.advanced;
        const card=box(x,y,214,69,active?0x32496b:(unlocked?0x283d5c:0x1c2940),active?0xffdda0:(unlocked?0x6d86a8:0x45546b));
        if(selectable){
          card.setInteractive({useHandCursor:true});
          card.on('pointerover',()=>card.setFillStyle(0x354e70));
          card.on('pointerout',()=>card.setFillStyle(0x283d5c));
          card.on('pointerdown',()=>this.chooseClass(classId));
        }
        box(x+9,y+9,24,24,classData.color,unlocked?0xffe7ba:0x647087);
        label(x+21,y+21,unlocked?classData.name[0]:'?',11,unlocked?'#fff8e8':'#8b97a9',{fontStyle:'bold'}).setOrigin(.5);
        label(x+40,y+8,classData.name,8,unlocked?'#fff0b4':'#8190a6',{fontStyle:'bold'});
        label(x+40,y+21,classData.role,5,unlocked?'#9fcbe5':'#69798f');
        label(x+9,y+40,`MAIN ${classData.primary.toUpperCase()}  •  ${classData.passive}`,5,unlocked?'#a9d8b9':'#627187',{wordWrap:{width:196}});
        label(x+201,y+8,active?'CURRENT':(selectable?'SELECT':(unlocked?'PATH CLOSED':'MENTOR LOCKED')),5,active?'#ffe09c':(selectable?'#b6cae0':'#68788f'),{fontStyle:'bold'}).setOrigin(1,0);
      });
    } else {
      const names={beginner:['CYCLONE CUT','WIDE ARC','IRON TEMPO'],warrior:['EARTH CLEAVE','GUARDIAN ROAR','TITAN SWING'],bowman:['ARROW RAIN','PIERCING WIND','FALCON VOLLEY'],magician:['STARFALL','CHAIN SPARK','HOLLOW NOVA']}[this.progression.classId];
      label(14,72,`${profile.name} SKILL TREE  •  ${this.progression.skillPoints} SKILL POINTS`,10,'#ffe0a0',{fontStyle:'bold'});
      names.forEach((name,index)=>{
        const y=96+index*52,level=this.progression.skills[index===0?'aoe':`node${index}`]||0,locked=index>0&&!(this.progression.skills[index===1?'aoe':'node1']||0);
        box(18,y,430,42,level?0x304d62:0x23334d,level?0x8fd3b1:0x617796);
        label(30,y+7,name,10,locked?'#708096':'#fff1bd',{fontStyle:'bold'});label(30,y+24,index===0?'AOE strike • S':index===1?'Improves radius and damage':'Class mastery finisher',8,'#aec5d8');
        button(397,y+10,40,24,level?`LV ${level}`:'+',()=>{if(!locked&&this.progression.skillPoints>0){const key=index===0?'aoe':`node${index}`;this.progression.skills[key]=(this.progression.skills[key]||0)+1;this.progression.skillPoints--;this.requestInventoryRefresh();}},Boolean(level),locked||this.progression.skillPoints<=0);
      });
      label(18,260,'S  AOE SKILL   •   Q  POTION   •   A  BASIC ATTACK',9,'#9fc9df',{fontStyle:'bold'});
    }

    label(14,256,'I CLOSES  •  CLICK A TAB TO SWITCH VIEWS',6,'#7186a5');
    panel.list.forEach(object=>object.setScrollFactor(0));
    this.inventoryPanel = panel.setVisible(this.inventoryOpen);
  }

  createParallaxMaps() {
    this.mapArt={};
    MAP_LIST.forEach(map=>{
      const back=this.add.image(map.x*.25+map.width/2,WORLD_H/2,`map-back-${map.id}`)
        .setScrollFactor(.25,.25).setDepth(-14).setOrigin(.5).setVisible(false);
      const mid=this.add.image(map.x*.5+map.width/2,WORLD_H/2,`map-mid-${map.id}`)
        .setScrollFactor(.5,1).setDepth(-8).setOrigin(.5).setVisible(false);
      this.mapArt[map.id]={back,mid};
    });
  }

  createTileMap() {
    const columns=Math.ceil(WORLD_W/TILE);
    const data=Array.from({length:60},()=>Array(columns).fill(-1));
    const span=(row,from,to)=>{for(let col=Math.max(0,from);col<=Math.min(columns-1,to);col++)data[row][col]=0;};
    MAP_LIST.forEach(map=>span(55,map.x/TILE,(map.x+map.width)/TILE-1));
    this.map=this.make.tilemap({data,tileWidth:TILE,tileHeight:TILE});
    const terrain=this.map.addTilesetImage('terrain','terrain-tile',TILE,TILE,0,0);
    this.groundLayer=this.map.createLayer(0,terrain,0,0).setDepth(2);
    this.groundLayer.setCollision(0);
    this.oneWayPlatforms=this.physics.add.staticGroup();
    this.groundColliders=this.physics.add.staticGroup();
    this.groundCollisionObjects=[];
    this.mapBoundaries=this.physics.add.staticGroup();
    MAP_LIST.forEach(map=>{
      const platformMeta=this.platformSurfaces[map.art];
      const groundHeight=platformMeta.groundHeight;
      if(map.kind==='interior'){
        this.add.image(map.x+map.width/2,360,`shop-interior-${map.id}`).setDisplaySize(map.width,600).setDepth(-7);
        this.add.rectangle(map.x+map.width/2,360,map.width,600,Phaser.Display.Color.ValueToColor(map.terrainTint).darken(34).color,.98).setDepth(-6);
        this.add.rectangle(map.x+map.width/2,168,map.width-72,18,0xead49a,.9).setDepth(-5);
        [72,304,496,728].forEach(localX=>this.add.rectangle(map.x+localX,360,16,384,0x513b38,.9).setDepth(-5));
        [198,602].forEach(localX=>{
          this.add.rectangle(map.x+localX,410,210,150,0x332b38,.78).setStrokeStyle(4,0xe5c67e).setDepth(-4);
          this.add.rectangle(map.x+localX,478,170,14,0xd1a45e,1).setDepth(-3);
        });
      }
      this.add.tileSprite(map.x+map.width/2,660,map.width,groundHeight,`ground-${map.id}`)
        .setOrigin(.5,0).setDepth(2);
      this.add.rectangle(map.x+map.width/2,660+groundHeight,map.width,WORLD_H-660-groundHeight,map.terrainTint)
        .setOrigin(.5,0).setDepth(2);
      const groundCollider=this.add.rectangle(map.x+map.width/2,660,map.width,12,0x000000,0).setOrigin(.5,0).setVisible(false);
      this.physics.add.existing(groundCollider,true);
      this.groundColliders.add(groundCollider);
      this.groundCollisionObjects.push(groundCollider);
      map.platforms.forEach(([x,y,width])=>{
        const height=platformMeta.platformHeight || platformMeta.sourceHeight;
        const surfaceY=platformMeta.surfaceY ?? Math.round(height*platformMeta.surfaceRatio);
        const visualY=y-surfaceY,cap=48,middle=Math.max(0,width-cap*2);
        this.add.image(map.x+x,visualY,`platform-${map.id}-left`).setOrigin(0,0).setDepth(2);
        if(middle)this.add.tileSprite(map.x+x+cap,visualY,middle,height,`platform-${map.id}-mid`).setOrigin(0,0).setDepth(2);
        this.add.image(map.x+x+width-cap,visualY,`platform-${map.id}-right`).setOrigin(0,0).setDepth(2);
        if(map.kind==='town'){
          (TOWN_SUPPORT_FRACTIONS[map.id]||[.2,.8]).forEach(fraction=>{
            const supportX=x+width*fraction;
            const lowerSurfaces=map.platforms
              .filter(([otherX,otherY,otherWidth])=>otherY>y&&supportX>=otherX&&supportX<=otherX+otherWidth)
              .map(([,otherY])=>otherY);
            const bottom=Math.min(660,...lowerSurfaces),supportHeight=Math.max(0,bottom-y-6);
            if(supportHeight>8)this.add.tileSprite(map.x+supportX,y+6,12,supportHeight,`ground-${map.id}`)
              .setOrigin(.5,0).setDepth(1.9);
          });
        }
        const slopes=MAP_SLOPES[map.id]||[];
        const trimStart=slopes.some(([sx,sy,sw,rise])=>Math.abs(sx+sw-x)<2&&Math.abs(sy-rise-y)<2)?12:0;
        const trimEnd=slopes.some(([sx,sy])=>Math.abs(sx-(x+width))<2&&Math.abs(sy-y)<2)?12:0;
        const colliderWidth=width-trimStart-trimEnd;
        const colliderX=map.x+x+trimStart+colliderWidth/2;
        const collider=this.add.rectangle(colliderX,y,colliderWidth,8,0x000000,0).setOrigin(.5,0).setVisible(false);
        this.physics.add.existing(collider,true);
        collider.body.checkCollision.down=false;collider.body.checkCollision.left=false;collider.body.checkCollision.right=false;collider.body.checkCollision.up=true;
        this.oneWayPlatforms.add(collider);
      });
      // Slopes use dedicated authored 45-degree sprites. Collision is handled
      // continuously by applySlopeAssist; there are no rotated slabs or stairs.
      (MAP_SLOPES[map.id]||[]).forEach(([x,y,width,rise])=>{
        const direction=rise>=0?'up':'down',top=Math.min(y,y-rise);
        this.add.image(map.x+x+width/2,top,`slope-${map.id}-${direction}`)
          .setOrigin(.5,0).setDepth(2);
      });
      for(let col=map.x/TILE;col<(map.x+map.width)/TILE;col++){
        const tile=this.groundLayer.getTileAt(col,55);
        if(tile)tile.tint=map.terrainTint;
      }
      [map.x+3,map.x+map.width-3].forEach(x=>{
        const wall=this.add.rectangle(x,WORLD_H/2,6,WORLD_H,0x000000,0).setVisible(false);
        this.physics.add.existing(wall,true);
        this.mapBoundaries.add(wall);
      });
    });
    // Ground collision remains tile-based, but its old placeholder grass art
    // is replaced entirely by each location's image-generated material kit.
    this.groundLayer.setVisible(false);
  }

  createNPCs() {
    this.npcs=[];
    MAP_LIST.forEach(map=>{
      const services=(TOWN_SERVICES[map.id]||[]).map(([name,role,type,x,frame])=>({name,role,type,x,frame}));
      [...map.npcs,...services].forEach(data=>{
      const [localX,surfaceY]=NPC_LAYOUTS[map.id]?.[data.name]||[data.x,660];
      const x=map.x+localX;
      const sprite=this.add.sprite(x,surfaceY+4,`npc-${npcSlug(data.name)}`,0).setOrigin(.5,1).setDepth(5).play(`npc-${npcSlug(data.name)}-idle`);
      // Every source sheet is registered to the same runtime canvas, even if
      // its authored source resolution differs.
      sprite.setDisplaySize(104,136);
      const tag=crispText(this.add.text(x,surfaceY+4,`${data.name}\n${data.role}`,{
        fontFamily:UI_FONT,fontSize:'13px',fontStyle:'bold',align:'center',color:'#fff7d6',
        backgroundColor:'rgba(28,45,77,.92)',padding:{x:6,y:4},lineSpacing:2,
      }).setOrigin(.5,0).setDepth(6));
      const marker=crispText(this.add.text(x,surfaceY-144,'E  •',{fontFamily:UI_FONT,fontSize:'12px',fontStyle:'bold',color:'#eaf5ff',backgroundColor:'rgba(25,45,72,.94)',padding:{x:7,y:4}}).setOrigin(.5).setDepth(8));
      this.npcs.push({...data,x,mapId:map.id,sprite,tag,marker});
      });
    });
  }

  createChests() {
    this.chests=[];
    MAP_LIST.forEach(map=>(map.chests||[]).forEach(([x,y])=>{
      const sprite=this.add.sprite(map.x+x,y,'item-chest-closed').setOrigin(.5,1).setDepth(4);
      this.chests.push({mapId:map.id,sprite,opened:false});
    }));
  }

  nearbyChest() {
    return this.chests?.find(chest=>!chest.opened&&chest.mapId===this.currentMapId&&Math.abs(chest.sprite.x-this.player.x)<50&&Math.abs(chest.sprite.y-this.player.y)<90);
  }

  openChest(chest) {
    if(!chest||chest.opened)return;
    this.audio.sfx('chest');
    chest.opened=true;chest.sprite.setTexture('item-chest-open');
    this.spawnDrop(chest.sprite.x-8,chest.sprite.y-20,'coin',{amount:Phaser.Math.Between(18,34)});
    this.spawnDrop(chest.sprite.x+8,chest.sprite.y-20,'potion',{amount:2});
    const themed=ENEMY_TYPES[(this.currentMap.enemies[0]||[])[4]||'spriglet'];
    const itemId=Phaser.Utils.Array.GetRandom(themed.equipment);
    this.spawnDrop(chest.sprite.x,chest.sprite.y-24,'equipment',{itemId});
    if(this.mainQuest.stage===1&&this.currentMapId==='sunmeadow'){
      this.mainQuest.stage=2;this.quest.ferryUnlocked=true;
      this.showDialogue('THE BLACK-GLASS CHIME','The chest contains no dust—only a warm shard shaped like a bell. It rings without moving, and the grass leans toward Tidehollow.');
    }else if(this.mainQuest.stage===6&&this.currentMapId==='crystal_hollow'){
      this.mainQuest.stage=7;this.inventory.push('beginner_cape');
      this.showDialogue('THE SEVENTH ROOT-BELL','The reliquary opens. A bell of living crystal speaks your name, then shows you a sky with one island missing. Return to Mira.');
    }else this.showDialogue('TREASURE CHEST','A little cache bursts open: coins, potions, and a piece of equipment!');
    this.updateQuestHud();
  }

  createPortals() {
    this.portals=[];
    MAP_LIST.forEach(map=>map.exits.forEach(exit=>{
      const portal={...exit,x:map.x+exit.x,mapId:map.id};
      this.portals.push(portal);
      if(portal.secret)return;
      const shopEntrance=map.kind==='town'&&MAP_DEFINITIONS[portal.to]?.kind==='interior';
      if(shopEntrance)this.add.image(portal.x,660,`shop-facade-${map.id}`).setOrigin(.5,1).setDepth(1.85);
      this.add.rectangle(portal.x,shopEntrance?610:604,shopEntrance?40:54,shopEntrance?74:112,0x8bdad8,shopEntrance?.12:.4).setStrokeStyle(shopEntrance?1:3,0xffefb0,shopEntrance?.35:1).setDepth(3);
      if(!shopEntrance)this.add.rectangle(portal.x,620,30,76,0xd8ffff,.25).setDepth(3.1);
      crispText(this.add.text(portal.x,530,`↑  ${portal.label}`,{
        fontFamily:UI_FONT,fontSize:'12px',fontStyle:'bold',color:'#fff4c2',
        backgroundColor:'rgba(28,45,77,.94)',padding:{x:7,y:4},
      }).setOrigin(.5).setDepth(4));
    }));
  }

  nearbyNpc() {
    return this.npcs.find(npc=>npc.mapId===this.currentMapId&&Math.abs(npc.x-this.player.x)<58&&Math.abs(npc.sprite.y-this.player.y)<88);
  }

  npcMarkerState(npc){
    if(npc.name==='MIRA'){
      if(this.mainQuest.stage===7||(this.quest.tutorial==='active'&&this.quest.berries>=3&&this.quest.mobs>=1))return {symbol:'✓',color:'#9ff0ad'};
      if(this.mainQuest.stage===0||this.quest.tutorial==='not_started')return {symbol:'!',color:'#ffd76f'};
      if(this.quest.tutorial==='active')return {symbol:'…',color:'#9fc9e8'};
    }
    if((npc.name==='CAPTAIN SOL'&&this.mainQuest.stage===2)||(npc.name==='JUNE'&&this.mainQuest.stage===3))return {symbol:'!',color:'#ffd76f'};
    if(npc.type?.startsWith('story_')){
      const quest=STORY_QUESTS[npc.type],state=this.storyQuestState[npc.type]||'not_started',count=this.materials[quest.material]||0;
      if(state==='not_started')return {symbol:'!',color:'#ffd76f'};
      if(state==='active'&&count>=quest.need)return {symbol:'✓',color:'#9ff0ad'};
      if(state==='active')return {symbol:'…',color:'#9fc9e8'};
    }
    if(npc.type?.startsWith('mentor_')&&!this.progression.advanced){
      if(!this.quest.advancement)return {symbol:'!',color:'#ffd76f'};
      if(this.quest.advancement.classId===npc.type.replace('mentor_','')&&this.quest.advancementKills>=3)return {symbol:'✓',color:'#9ff0ad'};
      if(this.quest.advancement.classId===npc.type.replace('mentor_',''))return {symbol:'…',color:'#9fc9e8'};
    }
    return {symbol:'•',color:'#d8e8f6'};
  }

  updateNpcMarkers(){
    const modalOpen=Boolean(this.dialoguePanel||this.shopPanel||this.inventoryOpen||this.questPanelOpen||this.worldMapOpen);
    this.npcs.forEach(npc=>{
      const visible=npc.mapId===this.currentMapId&&!modalOpen;npc.marker.setVisible(visible);
      if(!visible)return;const state=this.npcMarkerState(npc);npc.marker.setText(`E  ${state.symbol}`).setColor(state.color);
    });
  }

  nearbyPortal() {
    return this.portals?.find(portal=>portal.mapId===this.currentMapId&&Math.abs(portal.x-this.player.x)<42&&this.player.y>535);
  }

  interactPortal() {
    const portal=this.nearbyPortal();
    if(!portal||this.mapTransitioning)return;
    if(portal.secret){
      const key=[portal.mapId,portal.to].sort().join(':');
      if(!this.discoveredSecrets.has(key)){
        this.discoveredSecrets.add(key);
        this.showDialogue('SECRET ENTRANCE',`You found ${portal.label}! It is now recorded on your world map.`);
        return;
      }
    }
    const returnSpawn=this.currentMap?.kind==='interior'&&MAP_DEFINITIONS[portal.to]?.kind==='town'?'market':portal.spawn;
    this.audio.sfx('portal');
    this.enterMap(portal.to,returnSpawn);
  }

  enterMap(mapId,spawnName='left',immediate=false) {
    const map=MAP_DEFINITIONS[mapId];
    if(!map)return;
    const arrive=()=>{
      const [localX,y]=map.spawn[spawnName]||map.spawn.left||map.spawn.door||Object.values(map.spawn)[0];
      this.currentMap=map;
      this.currentMapId=map.id;
      this.currentRegion=map.region;
      this.audio?.setTheme(map.kind==='interior'?'interior':`${map.region}-${map.kind==='town'?'town':'field'}`);
      let storyNotice='';
      if(this.mainQuest?.stage===4&&['stonewatch','greenbloom','starwillow'].includes(map.id)){
        this.mainQuest.echoes[map.id]=true;const heard=Object.keys(this.mainQuest.echoes).length;
        storyNotice=`A root-echo answers beneath ${map.label.split(' • ')[1]}. ${heard}/3 echoes remembered.`;
        if(heard>=3){this.mainQuest.stage=5;storyNotice+=' Together they whisper: “Below the glass tree.”';}
      }
      if(this.mainQuest?.stage===5&&map.id==='crystal_hollow'){this.mainQuest.stage=6;storyNotice='The black-glass chime pulls toward a sealed reliquary. Something inside knows your name.';}
      if(map.kind==='town')this.lastTownMapId=map.id;
      Object.entries(this.mapArt).forEach(([id,layers])=>{
        const visible=id===map.id;
        layers.back.setVisible(visible);
        layers.mid.setVisible(visible);
      });
      this.player.setPosition(map.x+localX,y).setVelocity(0,0);
      this.cameras.main.setBounds(map.x,0,map.width,WORLD_H);
      this.cameras.main.centerOn(this.player.x,this.player.y);
      if(this.mapTitle)this.mapTitle.setText(`${map.kind==='town'?'TOWN':(map.kind==='interior'?'SHOP':'TRAINING STOP')} • ${map.label.split(' • ')[1]}`);
      if(this.interactionText)this.interactionText.setText('').setVisible(false);
      this.closeDialogue(true);
      this.mapTransitioning=false;
      if(!immediate)this.cameras.main.fadeIn(180,20,27,47);
      this.updateQuestHud();
      if(storyNotice)this.showDialogue('THE HOLLOW CHIME',storyNotice);
    };
    if(immediate){arrive();return;}
    this.mapTransitioning=true;
    this.cameras.main.fadeOut(160,20,27,47);
    this.cameras.main.once('camerafadeoutcomplete',arrive);
  }

  showDialogue(name,body) {
    if(this.dialogueTypeEvent)this.dialogueTypeEvent.remove(false);
    if(this.dialoguePanel)this.dialoguePanel.destroy(true);
    const cleanName=String(name),cleanBody=String(body);
    const previous=this.dialogueHistory[this.dialogueHistory.length-1];
    if(!previous||previous.name!==cleanName||previous.body!==cleanBody){
      this.dialogueHistory.push({name:cleanName,body:cleanBody,map:this.currentMap?.label?.split(' • ')[1]||'UNKNOWN',order:this.dialogueHistory.length+1});
      if(this.dialogueHistory.length>100)this.dialogueHistory.shift();
    }
    const panel=this.add.container(24,H-178).setDepth(55).setScrollFactor(0);
    panel.add(this.add.rectangle(0,0,W-48,158,0x17243f,.98).setOrigin(0).setStrokeStyle(3,0xffdfa0));
    panel.add(crispText(this.add.text(18,13,cleanName,{fontFamily:UI_FONT,fontSize:'16px',fontStyle:'bold',color:'#ffe5a4'})));
    this.dialogueBodyText=crispText(this.add.text(18,42,'',{fontFamily:UI_FONT,fontSize:'14px',color:'#f4f8ff',lineSpacing:5,wordWrap:{width:W-92}}));panel.add(this.dialogueBodyText);
    this.dialogueHintText=crispText(this.add.text(W-70,14,'E  REVEAL',{fontFamily:UI_FONT,fontSize:'12px',fontStyle:'bold',color:'#b9d8ef'}).setOrigin(1,0));panel.add(this.dialogueHintText);
    this.dialoguePanel=panel;
    this.dialoguePages=this.splitDialoguePages(cleanBody);this.dialoguePageIndex=0;this.startDialoguePage();
  }

  splitDialoguePages(body,maxCharacters=175){
    const sentences=String(body).match(/[^.!?]+[.!?]+(?:[”’"']+)?|[^.!?]+$/g)?.map(part=>part.trim()).filter(Boolean)||[String(body)];
    const chunks=[];
    sentences.forEach(sentence=>{
      if(sentence.length<=maxCharacters){chunks.push(sentence);return;}
      const words=sentence.split(/\s+/);let line='';
      words.forEach(word=>{const next=line?`${line} ${word}`:word;if(next.length>maxCharacters&&line){chunks.push(line);line=word;}else line=next;});
      if(line)chunks.push(line);
    });
    const pages=[];let page='';
    chunks.forEach(chunk=>{const next=page?`${page} ${chunk}`:chunk;if(next.length>maxCharacters&&page){pages.push(page);page=chunk;}else page=next;});
    if(page)pages.push(page);return pages.length?pages:[''];
  }

  startDialoguePage(){
    if(this.dialogueTypeEvent)this.dialogueTypeEvent.remove(false);
    this.audio.sfx('dialogue');
    this.dialogueFullText=this.dialoguePages[this.dialoguePageIndex]||'';this.dialogueCharacters=Array.from(this.dialogueFullText);this.dialogueCharacterIndex=0;this.dialogueTyping=true;
    this.dialogueBodyText.setText('');this.updateDialogueHint('REVEAL');
    this.dialogueTypeEvent=this.time.addEvent({delay:18,loop:true,callback:()=>{
      if(!this.dialoguePanel||!this.dialogueTyping)return;
      this.dialogueCharacterIndex=Math.min(this.dialogueCharacters.length,this.dialogueCharacterIndex+1);
      this.dialogueBodyText.setText(this.dialogueCharacters.slice(0,this.dialogueCharacterIndex).join(''));
      if(this.dialogueCharacterIndex>=this.dialogueCharacters.length)this.finishDialogueTyping();
    }});
  }

  updateDialogueHint(action){
    const pages=this.dialoguePages?.length||1,index=(this.dialoguePageIndex||0)+1;
    this.dialogueHintText.setText(`${index}/${pages}  •  E  ${action}`);
  }

  finishDialogueTyping(){
    if(!this.dialoguePanel)return;
    this.dialogueTyping=false;if(this.dialogueTypeEvent)this.dialogueTypeEvent.remove(false);
    this.dialogueBodyText.setText(this.dialogueFullText);this.updateDialogueHint(this.dialoguePageIndex<this.dialoguePages.length-1?'NEXT':'CLOSE');
  }

  openShop(npc) {
    this.closeDialogue(true);if(this.shopPanel)this.shopPanel.destroy(true);
    this.physics.world.pause();this.player.setVelocityX(0);
    const panel=this.add.container(0,0).setDepth(165).setScrollFactor(0),add=o=>{o.setScrollFactor(0);panel.add(o);return o;};
    add(this.add.rectangle(0,0,W,H,0x081323,.84).setOrigin(0));
    add(this.add.rectangle(90,62,620,468,0x172942,.99).setOrigin(0).setStrokeStyle(3,0xf0c978));
    add(crispText(this.add.text(116,82,`${npc.name} • ${npc.type==='shop_potion'?'APOTHECARY':'OUTFITTER'}`,{fontFamily:UI_FONT,fontSize:'22px',fontStyle:'bold',color:'#ffe3a0'})));
    add(crispText(this.add.text(116,115,npc.type==='shop_potion'?'Travel remedies, bottled fresh this morning.':'Equipment fitted for your current path.',{fontFamily:UI_FONT,fontSize:'13px',color:'#bcd4e5'})));
    const stock=npc.type==='shop_potion'
      ? [{id:'red_potion',name:'RED POTION',desc:'Restore 35 HP. Hotkey: Q',price:15}]
      : Object.values(this.classLoadouts[this.progression.classId]).filter(Boolean).map(id=>({id,name:this.itemCatalog[id].name,desc:this.itemCatalog[id].stat,price:id.includes('weapon')?90:60}));
    stock.forEach((item,index)=>{
      const y=154+index*70,owned=item.id!=='red_potion'&&(this.inventory.includes(item.id)||Object.values(this.equipment).includes(item.id));
      add(this.add.rectangle(114,y,572,58,0x243a59,.98).setOrigin(0).setStrokeStyle(2,owned?0x53647c:0x7fa6bb));
      add(crispText(this.add.text(130,y+8,item.name,{fontFamily:UI_FONT,fontSize:'14px',fontStyle:'bold',color:owned?'#8e9bad':'#fff0bd'})));
      add(crispText(this.add.text(130,y+31,item.desc,{fontFamily:UI_FONT,fontSize:'12px',color:'#b9cee0'})));
      const buy=add(this.add.rectangle(630,y+29,88,34,owned?0x303b4c:0x4c755f).setStrokeStyle(2,owned?0x596678:0xa6dfae).setInteractive({useHandCursor:!owned}));
      add(crispText(this.add.text(630,y+29,owned?'OWNED':`${item.price} COINS`,{fontFamily:UI_FONT,fontSize:'11px',fontStyle:'bold',color:owned?'#7f8b9d':'#efffdc'}).setOrigin(.5)));
      if(!owned)buy.on('pointerdown',()=>{
        if(this.currency<item.price){this.shopMessage.setText(`You need ${item.price-this.currency} more coins.`);return;}
        this.currency-=item.price;
        if(item.id==='red_potion')this.consumables.redPotion+=1;else if(!this.inventory.includes(item.id))this.inventory.push(item.id);
        this.refreshHud();this.shopMessage.setText(`${item.name} added to your bag.`);
      });
    });
    this.shopMessage=add(crispText(this.add.text(116,478,'Double-click equipment in your bag to equip it.',{fontFamily:UI_FONT,fontSize:'12px',color:'#9fc9d9'})));
    const close=add(this.add.rectangle(660,92,36,36,0x493c50).setStrokeStyle(2,0xffd795).setInteractive({useHandCursor:true}));close.on('pointerdown',()=>this.closeShop());
    add(crispText(this.add.text(660,92,'×',{fontFamily:UI_FONT,fontSize:'22px',color:'#fff1d0'}).setOrigin(.5)));
    this.shopPanel=panel;
  }

  closeShop() {if(!this.shopPanel)return false;this.shopPanel.destroy(true);this.shopPanel=null;this.physics.world.resume();return true;}

  closeDialogue(force=false) {
    if(this.closeShop())return true;
    if(!this.dialoguePanel)return false;
    if(!force&&this.dialogueTyping){this.finishDialogueTyping();return true;}
    if(!force&&this.dialoguePageIndex<this.dialoguePages.length-1){this.dialoguePageIndex++;this.startDialoguePage();return true;}
    this.dialoguePanel.destroy(true);
    this.dialoguePanel=null;
    if(this.dialogueTypeEvent)this.dialogueTypeEvent.remove(false);
    if(!force&&this.pendingChapterOneComplete){this.pendingChapterOneComplete=false;this.time.delayedCall(120,()=>this.showChapterOneComplete());}
    return true;
  }

  formatChapterTime(milliseconds){
    const seconds=Math.max(1,Math.floor(milliseconds/1000)),minutes=Math.floor(seconds/60),remainder=seconds%60;
    return `${minutes}:${String(remainder).padStart(2,'0')}`;
  }

  showChapterOneComplete(){
    if(this.chapterOnePanel)return;
    this.audio.sfx('complete');
    const elapsed=Math.max(1000,this.time.now-this.chapterStartedAt),seconds=Math.floor(elapsed/1000),stored=Number(localStorage.getItem('skyberry_chapter_one_best')||0);
    if(!stored||seconds<stored)localStorage.setItem('skyberry_chapter_one_best',String(seconds));
    localStorage.setItem('skyberry_chapter_one_complete','true');
    if(!this.chapterOneRewarded){this.chapterOneRewarded=true;this.currency+=250;this.consumables.redPotion+=3;this.refreshHud();}
    this.physics.world.pause();this.player.setVelocityX(0);
    const panel=this.add.container(0,0).setDepth(220).setScrollFactor(0),add=object=>{object.setScrollFactor(0);panel.add(object);return object;};
    add(this.add.rectangle(0,0,W,H,0x081426,.92).setOrigin(0).setInteractive());
    add(this.add.circle(W/2,166,82,0x213f5c,1).setStrokeStyle(4,0xffda78));
    add(crispText(this.add.text(W/2,91,'CHAPTER ONE COMPLETE',{fontFamily:UI_FONT,fontSize:'18px',fontStyle:'bold',color:'#8ee6db',letterSpacing:2}).setOrigin(.5)));
    add(crispText(this.add.text(W/2,126,'THE HOLLOW CHIME',{fontFamily:UI_FONT,fontSize:'32px',fontStyle:'bold',color:'#ffe09a',stroke:'#493d69',strokeThickness:4}).setOrigin(.5)));
    add(crispText(this.add.text(W/2,180,'THE SEVENTH BELL REMEMBERS YOU',{fontFamily:UI_FONT,fontSize:'14px',fontStyle:'bold',color:'#f5f4df'}).setOrigin(.5)));
    add(crispText(this.add.text(W/2,223,'You proved that the missing island was erased—not destroyed.\nCrownwind’s three root-echoes now carry its memory, and the road to Vale can be found again.',{fontFamily:UI_FONT,fontSize:'14px',align:'center',color:'#d9e8f1',lineSpacing:7,wordWrap:{width:570}}).setOrigin(.5,0)));
    add(this.add.rectangle(130,322,540,94,0x172a45,.98).setOrigin(0).setStrokeStyle(2,0x6e8dac));
    add(crispText(this.add.text(160,341,`TIME  ${this.formatChapterTime(elapsed)}\nLEVEL  ${this.progression.level}\nCREATURES DEFEATED  ${this.totalKills}`,{fontFamily:UI_FONT,fontSize:'13px',fontStyle:'bold',color:'#f2f7ff',lineSpacing:6})));
    add(crispText(this.add.text(454,341,`ROOT-ECHOES  ${Object.keys(this.mainQuest.echoes).length}/3\nSECRETS FOUND  ${this.discoveredSecrets.size}\nTARGET JOURNEY  ~20 MIN`,{fontFamily:UI_FONT,fontSize:'13px',fontStyle:'bold',color:'#c4d8e9',lineSpacing:6})));
    add(crispText(this.add.text(W/2,438,'REWARD  •  250 COINS  •  3 RED POTIONS  •  COTTON BANDANA',{fontFamily:UI_FONT,fontSize:'13px',fontStyle:'bold',color:'#ffe19a'}).setOrigin(.5)));
    const continueButton=add(this.add.rectangle(W/2,503,292,52,0x4e765f).setStrokeStyle(3,0xb8edbd).setInteractive({useHandCursor:true}));
    add(crispText(this.add.text(W/2,503,'CONTINUE EXPLORING',{fontFamily:UI_FONT,fontSize:'16px',fontStyle:'bold',color:'#f4ffe9'}).setOrigin(.5)));
    continueButton.on('pointerover',()=>continueButton.setFillStyle(0x638d70));continueButton.on('pointerout',()=>continueButton.setFillStyle(0x4e765f));continueButton.on('pointerdown',()=>this.closeChapterOneComplete());
    for(let index=0;index<24;index++){
      const piece=add(this.add.rectangle(Phaser.Math.Between(40,760),Phaser.Math.Between(-100,20),Phaser.Math.Between(4,8),Phaser.Math.Between(8,14),Phaser.Utils.Array.GetRandom([0xffd56f,0x8fe0d6,0xed8da5,0xa89be8]),1).setAngle(Phaser.Math.Between(0,180)));
      this.tweens.add({targets:piece,y:Phaser.Math.Between(520,680),angle:piece.angle+Phaser.Math.Between(180,540),duration:Phaser.Math.Between(2400,4200),delay:Phaser.Math.Between(0,800)});
    }
    this.chapterOnePanel=panel;
  }

  closeChapterOneComplete(){if(!this.chapterOnePanel)return;this.chapterOnePanel.destroy(true);this.chapterOnePanel=null;this.physics.world.resume();}

  runStorylinePlaytest(classId){
    const assert=(condition,message)=>{if(!condition)throw new Error(message);};
    const route=(from,to)=>{
      const queue=[[from,[from]]],visited=new Set([from]);
      while(queue.length){const [mapId,path]=queue.shift();if(mapId===to)return path;const links=(MAP_DEFINITIONS[mapId]?.exits||[]).map(exit=>exit.to);if(mapId==='tidehollow')links.push('gullhaven');if(mapId==='gullhaven')links.push('tidehollow');for(const next of links){if(!visited.has(next)){visited.add(next);queue.push([next,[...path,next]]);}}}
      return null;
    };
    const enter=mapId=>{assert(MAP_DEFINITIONS[mapId],`Missing map ${mapId}`);this.enterMap(mapId,MAP_DEFINITIONS[mapId].kind==='town'?'left':'left',true);};
    const talk=name=>{
      const npc=this.npcs.find(candidate=>candidate.name===name&&candidate.mapId===this.currentMapId);assert(npc,`Missing ${name} in ${this.currentMapId}`);
      this.player.setPosition(npc.x,npc.sprite.y);this.interactWithNpc();
    };
    const dismiss=()=>{if(this.dialoguePanel)this.closeDialogue(true);};
    const killEnemies=(mapId,count)=>{
      enter(mapId);const targets=this.enemies.getChildren().filter(enemy=>enemy.active&&enemy.getData('alive')&&enemy.getData('mapId')===mapId).slice(0,count);
      assert(targets.length===count,`${mapId} only supplied ${targets.length}/${count} enemies`);targets.forEach(enemy=>{this.player.setPosition(enemy.x-50,enemy.y);this.damageEnemy(enemy,999);});
    };
    try{
      window.__storyPlaytestResult={classId,status:'running'};
      MAP_LIST.forEach(map=>map.exits.forEach(exit=>{const destination=MAP_DEFINITIONS[exit.to];assert(destination,`${map.id} points to missing map ${exit.to}`);assert(destination.spawn?.[exit.spawn],`${map.id} → ${exit.to} uses missing spawn ${exit.spawn}`);}));
      [['sprout_camp','sunmeadow'],['sunmeadow','tidehollow'],['gullhaven','stonewatch'],['gullhaven','greenbloom'],['gullhaven','starwillow'],['starwillow','crystal_hollow'],['crystal_hollow','gullhaven'],['tidehollow','sprout_camp']].forEach(([from,to])=>assert(route(from,to),`No playable route from ${from} to ${to}`));
      enter('sprout_camp');talk('MIRA');assert(this.mainQuest.stage===1,'Mira did not begin Chapter One');dismiss();
      killEnemies('sunmeadow',1);assert(this.quest.mobs>=1,'Tutorial kill did not register');
      for(let index=0;index<3;index++){const drop=this.spawnDrop(this.player.x,this.player.y-8,'material',{material:'sprig_leaf',name:'Sprig Leaf'});this.collectDrop(this.player,drop);}
      assert(this.quest.berries>=3,'Tutorial leaves did not register');enter('sprout_camp');talk('MIRA');assert(this.quest.tutorial==='complete','Mira did not complete tutorial');dismiss();
      enter('sunmeadow');const meadowChest=this.chests.find(chest=>chest.mapId==='sunmeadow');assert(meadowChest,'Sunmeadow chest missing');this.openChest(meadowChest);assert(this.mainQuest.stage===2,'Sunmeadow chime did not advance story');dismiss();
      enter('tidehollow');talk('CAPTAIN SOL');assert(this.mainQuest.stage===3,'Captain Sol did not advance story');dismiss();talk('CAPTAIN SOL');assert(this.mapTransitioning,'Unlocked ferry did not initiate travel');enter('gullhaven');
      if(classId!=='beginner'){
        const mentor={warrior:['stonewatch','BRANN'],bowman:['greenbloom','LYRA'],magician:['starwillow','ORIN']}[classId];
        enter(mentor[0]);talk(mentor[1]);assert(this.quest.advancement?.classId===classId,`${classId} trial did not start`);dismiss();
        killEnemies('saltwind',3);assert(this.quest.advancementKills>=3,`${classId} trial kills did not register`);
        enter(mentor[0]);talk(mentor[1]);assert(this.progression.classId===classId&&this.progression.advanced,`${classId} advancement failed`);dismiss();
        assert(this.equipment.weapon===this.classLoadouts[classId].weapon,`${classId} weapon was not equipped`);
      }
      enter('gullhaven');talk('JUNE');assert(this.mainQuest.stage===4,'June did not reveal root-bells');dismiss();
      ['stonewatch','greenbloom','starwillow'].forEach(mapId=>{enter(mapId);dismiss();});assert(this.mainQuest.stage===5&&Object.keys(this.mainQuest.echoes).length===3,'Root-echo route did not complete');
      enter('crystal_hollow');assert(this.mainQuest.stage===6,'Crystal Hollow did not reveal reliquary');dismiss();
      const crystalChest=this.chests.find(chest=>chest.mapId==='crystal_hollow');assert(crystalChest,'Crystal Hollow chest missing');this.openChest(crystalChest);assert(this.mainQuest.stage===7,'Seventh bell did not awaken');dismiss();
      enter('sprout_camp');talk('MIRA');assert(this.mainQuest.stage===8,'Mira did not complete Chapter One');
      let guard=0;while(this.dialoguePanel&&guard++<30){if(this.dialogueTyping)this.finishDialogueTyping();else this.closeDialogue(false);}
      assert(guard<30,'Final dialogue could not be closed');
      this.time.delayedCall(220,()=>{window.__storyPlaytestResult={classId,status:this.chapterOnePanel?'passed':'failed',stage:this.mainQuest.stage,class:this.progression.classId,equipment:{...this.equipment},echoes:Object.keys(this.mainQuest.echoes).length,completionScreen:Boolean(this.chapterOnePanel)};console.info('STORY_PLAYTEST',JSON.stringify(window.__storyPlaytestResult));});
    }catch(error){window.__storyPlaytestResult={classId,status:'failed',error:error.message,stage:this.mainQuest.stage};console.error('STORY_PLAYTEST',JSON.stringify(window.__storyPlaytestResult));}
  }

  interactWithNpc() {
    const npc=this.nearbyNpc();
    if(!npc)return;
    if(npc.name==='MIRA'&&this.mainQuest.stage===0){this.mainQuest.stage=1;this.quest.tutorial='active';this.showDialogue('MIRA',`${SKYBERRY_LORE.premise} Last night, a bell rang beneath Sunmeadow—where no bell has ever stood. The Spriglets returned carrying leaves whose veins spell names no one remembers. Defeat one and recover three leaves. We need to know whether the bell is calling creatures—or using them to write us a warning.`);this.updateQuestHud();return;}
    if(npc.name==='MIRA'&&this.mainQuest.stage===7){this.mainQuest.stage=8;this.gainXp(180);if(!this.inventory.includes('beginner_cap')&&!Object.values(this.equipment).includes('beginner_cap'))this.inventory.push('beginner_cap');this.pendingChapterOneComplete=true;this.showDialogue('MIRA','So the seventh bell remembers you. Then the missing island was not destroyed—it was erased. Keep the bell. Beyond Crownwind, someone is teaching the sky to forget.');this.updateQuestHud();return;}
    if(npc.name==='CAPTAIN SOL'&&this.mainQuest.stage===2){this.mainQuest.stage=3;this.quest.ferryUnlocked=true;this.showDialogue('CAPTAIN SOL','I carried a chime like that once. The passenger vanished, and every manifest forgot her—except June’s forbidden copy in Gullhaven. We sail now, before the tide notices you.');this.updateQuestHud();return;}
    if(npc.name==='JUNE'&&this.mainQuest.stage===3){this.mainQuest.stage=4;this.showDialogue('JUNE','The erased passenger visited three root-bells: Stonewatch, Greenbloom, Starwillow. Her notes end with one warning: “When all three answer, do not trust the road shown on any map.”');this.updateQuestHud();return;}
    if(npc.type==='shop_potion'){
      this.openShop(npc);
    }else if(npc.type==='shop_armor'){
      this.openShop(npc);
    }else if(npc.type.startsWith('story_')){
      this.handleStoryQuest(npc);
    }else if(npc.type.startsWith('lore_')){
      this.showDialogue(npc.name,NPC_STORIES[npc.type]);
    }else if(npc.type==='guide'){
      if(this.quest.tutorial==='not_started'){
        this.quest.tutorial='active';
        this.showDialogue('MIRA','The Spriglets are tearing memory-veined leaves from the nursery tree. Defeat one so it releases its hoard, then bring me three intact leaves. If their veins carry the same impossible name, we will know Sunmeadow’s bell is sending a message—not merely making noise.');
      }else if(this.quest.tutorial==='active'&&this.quest.berries>=3&&this.quest.mobs>=1){
        this.quest.tutorial='complete';this.quest.ferryUnlocked=true;this.gainXp(40);
        this.showDialogue('MIRA','Excellent work. Captain Sol can now take you to Crownwind Reach. Your real path begins there!');
      }else if(this.quest.tutorial==='active'){
        this.showDialogue('MIRA',`Training progress: Sprig Leaves ${Math.min(3,this.quest.berries)}/3 • Spriglets ${Math.min(1,this.quest.mobs)}/1.`);
      }else this.showDialogue('MIRA','The ferry waits at Tidehollow Port. Crownwind Reach has mentors for every Explorer path.');
    }else if(npc.type==='ferry'){
      if(!this.quest.ferryUnlocked)this.showDialogue('CAPTAIN SOL','Mira must approve your island training before I can let you aboard.');
      else this.enterMap('gullhaven','dock');
    }else if(npc.type==='return_ferry'){
      this.enterMap('tidehollow','ferry');
    }else if(npc.type.startsWith('mentor_')){
      const classId=npc.type.replace('mentor_','');
      if(this.progression.advanced){
        this.showDialogue(npc.name,this.progression.classId===classId?`You walk the path of the ${this.classProfile().name}. Keep training your core attributes.`:'Your class path has already been chosen. Train it with pride.');
      }else if(!this.quest.advancement){
        this.quest.advancement={classId,status:'active'};this.quest.advancementKills=0;
        this.showDialogue(npc.name,`You seek the ${CLASS_PROFILES[classId].name} path? Defeat 3 Crownwind Mistruffles, then return to me.`);
      }else if(this.quest.advancement.classId!==classId){
        this.showDialogue(npc.name,`Complete your ${CLASS_PROFILES[this.quest.advancement.classId].name} trial before seeking another path.`);
      }else if(this.quest.advancementKills>=3){
        this.advanceClass(classId);this.gainXp(50);this.quest.advancement.status='complete';
        this.showDialogue(npc.name,`Advancement complete! Your ${CLASS_PROFILES[classId].name} equipment and combat style are now active.`);
      }else this.showDialogue(npc.name,`Advancement trial: Mistruffles ${this.quest.advancementKills}/3.`);
    }
    this.updateQuestHud();
  }

  handleStoryQuest(npc) {
    const quest=STORY_QUESTS[npc.type], state=this.storyQuestState[npc.type]||'not_started';
    const count=this.materials[quest.material]||0;
    if(state==='not_started'){
      this.storyQuestState[npc.type]='active';
      this.showDialogue(npc.name,`${quest.intro} ${quest.request}`);
    }else if(state==='active'&&count>=quest.need){
      this.materials[quest.material]-=quest.need;this.storyQuestState[npc.type]='complete';
      this.currency+=quest.rewardMesos;this.gainXp(quest.rewardXp);this.refreshHud();
      this.showDialogue(npc.name,`${quest.complete} Reward: ${quest.rewardXp} XP and ${quest.rewardMesos} coins.`);
    }else if(state==='active')this.showDialogue(npc.name,`${quest.reminder} You have ${count} of ${quest.need}.`);
    else this.showDialogue(npc.name,quest.complete);
  }

  updateQuestHud() {
    if(!this.questText)return;
    const active=this.questEntries().filter(q=>q.status==='active');
    this.questText.setText(active.slice(0,2).map(q=>`${q.name.toUpperCase()}  •  ${q.progress}`).join('\n')||'NO ACTIVE QUESTS  •  J OPENS QUEST JOURNAL');
  }

  questEntries() {
    const entries=[{id:'main',name:SKYBERRY_LORE.title,status:this.mainQuest.stage>=8?'complete':'active',progress:MAIN_STORY_STAGES[this.mainQuest.stage],detail:'Follow the impossible bell-song and uncover why the sky-islands are losing their names.'}];
    if(this.quest.tutorial!=='complete')entries.push({id:'tutorial',name:'Names in the Leaves',status:this.quest.tutorial==='not_started'?'available':'active',progress:this.quest.tutorial==='not_started'?'Talk to Mira':`Leaves ${Math.min(3,this.quest.berries)}/3  •  Spriglets ${Math.min(1,this.quest.mobs)}/1`,detail:'Recover the Spriglets’ stolen leaves and learn what the impossible veins are trying to spell.'});
    else entries.push({id:'tutorial',name:'Names in the Leaves',status:'complete',progress:'Complete',detail:'The leaf-veins confirmed that Sunmeadow’s impossible bell is deliberately sending a warning.'});
    if(this.quest.tutorial==='complete'&&!this.progression.advanced&&!this.quest.advancement)entries.push({id:'class_path',name:'Choose Your Path',status:'active',progress:this.currentRegion==='crownwind'?'Speak to a class mentor':'Take the ferry to Crownwind',detail:'Travel to Crownwind Reach and choose a class mentor.'});
    if(this.quest.advancement){const className=CLASS_PROFILES[this.quest.advancement.classId].name;entries.push({id:'advancement',name:`${className} Trial`,status:this.quest.advancement.status,progress:`Mistruffles ${Math.min(3,this.quest.advancementKills)}/3`,detail:`Complete the ${className} mentor’s advancement trial.`});}
    Object.entries(this.storyQuestState).forEach(([id,status])=>{const q=STORY_QUESTS[id];if(q)entries.push({id,name:q.name,status,progress:status==='complete'?'Complete':`${q.material.replaceAll('_',' ')} ${Math.min(q.need,this.materials[q.material]||0)}/${q.need}`,detail:q.journal});});
    return entries;
  }

  reopenQuestPanel(tab=this.questJournalTab,page=this.questHistoryPage){
    this.questJournalTab=tab;this.questHistoryPage=Math.max(0,page);
    if(this.questPanel)this.questPanel.destroy(true);
    this.questPanel=null;this.questPanelOpen=false;this.toggleQuestPanel();
  }

  toggleQuestPanel() {
    if(!this.questPanelOpen&&this.inventoryOpen)this.toggleInventory();
    if(!this.questPanelOpen&&this.worldMapOpen)this.toggleWorldMap();
    this.questPanelOpen=!this.questPanelOpen;
    if(this.questPanel)this.questPanel.destroy(true);
    this.hudContainer?.setVisible(!this.questPanelOpen&&!this.inventoryOpen&&!this.worldMapOpen);
    if(!this.questPanelOpen){this.questPanel=null;this.physics.world.resume();return;}
    this.player.setVelocityX(0);this.physics.world.pause();
    const panel=this.add.container(0,0).setDepth(150).setScrollFactor(0),entries=this.questEntries();
    panel.add(this.add.rectangle(0,0,W,H,0x0b1426,.9).setOrigin(0).setInteractive());
    panel.add(crispText(this.add.text(72,52,'QUEST JOURNAL',{fontFamily:UI_FONT,fontSize:'22px',fontStyle:'bold',color:'#ffe5a3'})));
    const journalTab=(x,label,id)=>{
      const active=this.questJournalTab===id,button=this.add.rectangle(x,91,150,30,active?0x506d96:0x293b58).setOrigin(0).setStrokeStyle(2,active?0xffd890:0x607897).setInteractive({useHandCursor:true});
      button.on('pointerdown',()=>this.reopenQuestPanel(id,0));panel.add(button);
      panel.add(crispText(this.add.text(x+75,106,label,{fontFamily:UI_FONT,fontSize:'12px',fontStyle:'bold',color:active?'#fff0b4':'#a9bfd5'}).setOrigin(.5)));
    };
    journalTab(72,'QUESTS','quests');journalTab(230,'DIALOGUE HISTORY','history');
    const close=this.add.rectangle(730,64,38,38,0x3b4f73).setStrokeStyle(2,0xffdf9b).setInteractive({useHandCursor:true});
    close.on('pointerdown',()=>this.toggleQuestPanel());panel.add(close);panel.add(crispText(this.add.text(730,64,'×',{fontFamily:UI_FONT,fontSize:'22px',color:'#fff4d1'}).setOrigin(.5)));
    if(this.questJournalTab==='quests'){
      if(!entries.length)panel.add(crispText(this.add.text(72,140,'No quests recorded yet.',{fontFamily:UI_FONT,fontSize:'15px',color:'#c1d0df'})));
      entries.slice(0,6).forEach((quest,index)=>{
        const y=132+index*64,active=quest.status==='active',complete=quest.status==='complete';
        panel.add(this.add.rectangle(70,y,660,58,active?0x263e60:(complete?0x203b38:0x252d42),.98).setOrigin(0).setStrokeStyle(2,active?0xffd377:(complete?0x76c99b:0x5f7190)));
        panel.add(this.add.rectangle(516,y+5,208,48,0x14243a,.72).setOrigin(0));
        panel.add(crispText(this.add.text(84,y+6,quest.name,{fontFamily:UI_FONT,fontSize:'14px',fontStyle:'bold',color:active?'#fff0b1':(complete?'#a8e0ba':'#c4d0e0')})));
        panel.add(crispText(this.add.text(84,y+26,quest.detail,{fontFamily:UI_FONT,fontSize:'11px',color:'#afc3d8',wordWrap:{width:410},maxLines:2})));
        panel.add(crispText(this.add.text(712,y+8,quest.status.toUpperCase(),{fontFamily:UI_FONT,fontSize:'11px',fontStyle:'bold',color:active?'#ffd377':(complete?'#8ed8aa':'#92a6c0')})).setOrigin(1,0));
        panel.add(crispText(this.add.text(712,y+27,quest.progress,{fontFamily:UI_FONT,fontSize:'10px',align:'right',color:'#eef5ff',wordWrap:{width:188},maxLines:2}).setOrigin(1,0)));
      });
    }else{
      const pageSize=5,history=[...this.dialogueHistory].reverse(),maxPage=Math.max(0,Math.ceil(history.length/pageSize)-1);
      this.questHistoryPage=Math.min(this.questHistoryPage,maxPage);
      const visible=history.slice(this.questHistoryPage*pageSize,(this.questHistoryPage+1)*pageSize);
      if(!visible.length)panel.add(crispText(this.add.text(72,148,'Past conversations will appear here after you speak with someone.',{fontFamily:UI_FONT,fontSize:'14px',color:'#b9cce0'})));
      visible.forEach((entry,index)=>{
        const y=132+index*78;panel.add(this.add.rectangle(70,y,660,70,0x202f4a,.98).setOrigin(0).setStrokeStyle(2,0x587391));
        panel.add(crispText(this.add.text(84,y+7,`${entry.name}  •  ${entry.map}`,{fontFamily:UI_FONT,fontSize:'13px',fontStyle:'bold',color:'#ffe2a3'})));
        panel.add(crispText(this.add.text(84,y+27,entry.body,{fontFamily:UI_FONT,fontSize:'12px',color:'#d9e6f2',lineSpacing:2,wordWrap:{width:620},maxLines:2})));
      });
      const pageButton=(x,label,delta,disabled)=>{const b=this.add.rectangle(x,536,92,30,disabled?0x202a3b:0x3a5274).setStrokeStyle(2,disabled?0x405067:0x88a6c3);if(!disabled)b.setInteractive({useHandCursor:true}).on('pointerdown',()=>this.reopenQuestPanel('history',this.questHistoryPage+delta));panel.add(b);panel.add(crispText(this.add.text(x,536,label,{fontFamily:UI_FONT,fontSize:'11px',fontStyle:'bold',color:disabled?'#66758a':'#e8f2ff'}).setOrigin(.5)));};
      pageButton(118,'PREVIOUS',-1,this.questHistoryPage===0);pageButton(682,'NEXT',1,this.questHistoryPage>=maxPage);
      panel.add(crispText(this.add.text(W/2,536,`PAGE ${this.questHistoryPage+1} / ${maxPage+1}`,{fontFamily:UI_FONT,fontSize:'11px',color:'#9fb8cf'}).setOrigin(.5)));
    }
    panel.add(crispText(this.add.text(W/2,558,'J  CLOSE JOURNAL',{fontFamily:UI_FONT,fontSize:'12px',fontStyle:'bold',color:'#9fb5cf'}).setOrigin(.5)));
    panel.list.forEach(object=>object.setScrollFactor(0));
    this.questPanel=panel;
  }

  makeHud() {
    const fixed=object=>{object.setScrollFactor(0);this.fixedUiObjects.push(object);return crispText(object);};
    fixed(this.add.rectangle(12,12,244,86,0x15243f,.97).setOrigin(0).setStrokeStyle(2,0xffe6ab).setDepth(20));
    this.hudIdentity=fixed(this.add.text(24,20,'',{fontFamily:UI_FONT,fontSize:'14px',fontStyle:'bold',color:'#fff1c4'}).setDepth(21));
    fixed(this.add.rectangle(70,51,170,12,0x0d1729).setOrigin(0).setDepth(20));
    this.hp=fixed(this.add.rectangle(71,52,168,10,0xee6f94).setOrigin(0).setDepth(21));
    fixed(this.add.text(24,48,'HP',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',color:'#ffc2d2'}).setDepth(21));
    fixed(this.add.rectangle(70,75,170,11,0x0d1729).setOrigin(0).setDepth(20));
    this.xpBar=fixed(this.add.rectangle(71,76,168,9,0x73c4d4).setOrigin(0).setDepth(21));
    fixed(this.add.text(24,72,'XP',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',color:'#bcecf2'}).setDepth(21));
    this.hudValues=fixed(this.add.text(236,47,'',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',align:'right',color:'#ffffff'}).setOrigin(1,0).setDepth(22));
    this.xpValue=fixed(this.add.text(236,71,'',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',align:'right',color:'#ffffff'}).setOrigin(1,0).setDepth(22));
    fixed(this.add.rectangle(W/2,12,288,34,0x172b49,.96).setOrigin(.5,0).setStrokeStyle(2,0x8fa9c3).setDepth(20));
    this.mapTitle=fixed(this.add.text(W/2,29,'DAWNLEAF ISLE • SPROUT CAMP',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',color:'#fff0af'}).setOrigin(.5).setDepth(21));
    this.questText=fixed(this.add.text(W/2,52,'',{fontFamily:UI_FONT,fontSize:'11px',fontStyle:'bold',align:'center',color:'#f5f9ff',backgroundColor:'rgba(25,45,72,.94)',padding:{x:8,y:6},lineSpacing:2,wordWrap:{width:272}}).setOrigin(.5,0).setDepth(21));
    this.scoreText=fixed(this.add.text(W-20,18,'COINS 0  •  Q POTION 1',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',color:'#fff5bb',stroke:'#5c497b',strokeThickness:2}).setOrigin(1,0).setDepth(21));
    const bagButton = fixed(this.add.rectangle(W-28, 70, 38, 38, 0x35456f, .96).setStrokeStyle(2,0xffe6a5).setDepth(21).setInteractive({useHandCursor:true}));
    bagButton.on('pointerover',()=>bagButton.setFillStyle(0x556b91));
    bagButton.on('pointerout',()=>bagButton.setFillStyle(0x35456f));
    bagButton.on('pointerdown',()=>this.toggleInventory());
    fixed(this.add.text(W-28, 70, '▣', {fontFamily:UI_FONT,fontSize:'20px',color:'#fff6d0'}).setOrigin(.5).setDepth(22));
    const mapButton=fixed(this.add.rectangle(W-74,70,38,38,0x35456f,.96).setStrokeStyle(2,0x9edee2).setDepth(21).setInteractive({useHandCursor:true}));
    mapButton.on('pointerdown',()=>this.toggleWorldMap());
    fixed(this.add.text(W-74,70,'◆',{fontFamily:UI_FONT,fontSize:'18px',color:'#d8ffff'}).setOrigin(.5).setDepth(22));
    const questButton=fixed(this.add.rectangle(W-120,70,38,38,0x35456f,.96).setStrokeStyle(2,0xffcf78).setDepth(21).setInteractive({useHandCursor:true}));
    questButton.on('pointerover',()=>questButton.setFillStyle(0x556b91));questButton.on('pointerout',()=>questButton.setFillStyle(0x35456f));questButton.on('pointerdown',()=>this.toggleQuestPanel());
    fixed(this.add.text(W-120,70,'☷',{fontFamily:UI_FONT,fontSize:'21px',color:'#ffe2a0'}).setOrigin(.5).setDepth(22));
    const audioButton=fixed(this.add.rectangle(W-166,70,38,38,0x35456f,.96).setStrokeStyle(2,0xa9d5b3).setDepth(21).setInteractive({useHandCursor:true}));
    audioButton.on('pointerover',()=>audioButton.setFillStyle(0x556b91));audioButton.on('pointerout',()=>audioButton.setFillStyle(0x35456f));audioButton.on('pointerdown',()=>{const muted=this.audio.activateOrToggle();this.audioHudText.setText(muted?'×':'♪');});
    this.audioHudText=fixed(this.add.text(W-166,70,'♪',{fontFamily:UI_FONT,fontSize:'19px',fontStyle:'bold',color:'#dcffe5'}).setOrigin(.5).setDepth(22));
    this.interactionText=fixed(this.add.text(W/2,H-46,'',{fontFamily:UI_FONT,fontSize:'14px',fontStyle:'bold',color:'#fff5c4',backgroundColor:'rgba(25,45,72,.94)',padding:{x:12,y:7}}).setOrigin(.5).setDepth(24).setVisible(false));
    this.refreshHud();
  }

  toggleWorldMap() {
    if(!this.worldMapOpen&&this.questPanelOpen)this.toggleQuestPanel();
    if(!this.worldMapOpen&&this.inventoryOpen)this.toggleInventory();
    this.worldMapOpen=!this.worldMapOpen;
    if(this.worldMapPanel)this.worldMapPanel.destroy(true);
    this.hudContainer?.setVisible(!this.worldMapOpen&&!this.inventoryOpen&&!this.questPanelOpen);
    if(!this.worldMapOpen){this.worldMapPanel=null;return;}
    const panel=this.add.container(0,0).setDepth(120).setScrollFactor(0);
    panel.add(this.add.rectangle(0,0,W,H,0x0b1426,.94).setOrigin(0).setInteractive());
    panel.add(crispText(this.add.text(W/2,18,'WORLD MAP • M TO CLOSE',{fontFamily:'monospace',fontSize:'13px',fontStyle:'bold',color:'#ffe4a3'}).setOrigin(.5)));
    const drawn=new Set();
    const [ferryX1,ferryY1]=WORLD_MAP_POSITIONS.tidehollow,[ferryX2,ferryY2]=WORLD_MAP_POSITIONS.gullhaven;
    panel.add(this.add.line(0,0,ferryX1,ferryY1,ferryX2,ferryY2,0xffcf70,.55).setOrigin(0));
    panel.add(crispText(this.add.text((ferryX1+ferryX2)/2,(ferryY1+ferryY2)/2,'FERRY',{fontFamily:'monospace',fontSize:'10px',color:'#ffe1a0',backgroundColor:'rgba(11,20,38,.8)',padding:{x:4,y:2}}).setOrigin(.5)));
    panel.add(crispText(this.add.text(82,72,'DAWNLEAF ISLE',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',color:'#aee8c0'})));
    panel.add(crispText(this.add.text(82,300,'CROWNWIND REACH',{fontFamily:'monospace',fontSize:'12px',fontStyle:'bold',color:'#ffe0a0'})));
    MAP_LIST.filter(map=>map.showOnWorldMap!==false).forEach(map=>map.exits.forEach(exit=>{
      if(MAP_DEFINITIONS[exit.to]?.showOnWorldMap===false)return;
      const key=[map.id,exit.to].sort().join(':'),known=!exit.secret||this.discoveredSecrets.has(key);
      if(!known||drawn.has(key))return;drawn.add(key);
      const [x1,y1]=WORLD_MAP_POSITIONS[map.id],[x2,y2]=WORLD_MAP_POSITIONS[exit.to];
      panel.add(this.add.line(0,0,x1,y1,x2,y2,exit.secret?0xc79af2:0x6687a6,exit.secret ? .75 : 1).setOrigin(0));
    }));
    MAP_LIST.filter(map=>map.showOnWorldMap!==false).forEach(map=>{
      const [x,y]=WORLD_MAP_POSITIONS[map.id],current=map.id===this.currentMapId;
      panel.add(this.add.rectangle(x,y,map.kind==='town'?16:10,map.kind==='town'?16:10,current?0x78eff0:(map.kind==='town'?0xffcf70:0x7fc08a),1).setStrokeStyle(1,0xf5f5df));
      const short=map.label.split(' • ')[1].replace(' CROSSING','').replace(' GROVE','').replace(' TRAIL','').replace(' RISE','').replace(' WILDS','').replace(' BOUGHS','');
      panel.add(crispText(this.add.text(x,y+12,short,{fontFamily:'monospace',fontSize:'10px',fontStyle:'bold',color:current?'#bfffff':'#f3f6ff',align:'center',wordWrap:{width:92}}).setOrigin(.5,0)));
    });
    panel.add(crispText(this.add.text(W/2,570,'GOLD = TOWN  •  GREEN = TRAINING STOP  •  VIOLET = DISCOVERED SECRET',{fontFamily:'monospace',fontSize:'10px',color:'#bcd0df'}).setOrigin(.5)));
    panel.list.forEach(object=>object.setScrollFactor(0));
    this.worldMapPanel=panel;
  }

  refreshHud() {
    if (!this.hp || !this.xpBar) return;
    const profile=this.classProfile(),derived=this.derivedStats();
    this.hp.width=168*Phaser.Math.Clamp(this.hpValue/derived.maxHp,0,1);
    this.xpBar.width=168*Phaser.Math.Clamp(this.progression.xp/this.xpToNext(),0,1);
    this.hudIdentity.setText(`${this.playerName.toUpperCase()}  •  LV ${this.progression.level} ${profile.name}`);
    this.hudValues.setText(`${this.hpValue}/${derived.maxHp}`);
    this.xpValue.setText(`${this.progression.xp}/${this.xpToNext()}`);
    if(this.scoreText)this.scoreText.setText(`COINS ${this.currency||0}  •  Q POTION ${this.consumables?.redPotion||0}`);
  }

  addFireflies() {
    MAP_LIST.forEach(map=>{
      for(let i=0;i<14;i++){
        const star=this.add.rectangle(map.x+Phaser.Math.Between(24,map.width-24),Phaser.Math.Between(350,WORLD_H-72),Phaser.Math.Between(1,2),Phaser.Math.Between(1,2),0xfff2ad,.7).setDepth(1);
        this.tweens.add({targets:star,y:star.y-Phaser.Math.Between(6,16),alpha:.1,duration:Phaser.Math.Between(900,1600),yoyo:true,repeat:-1,delay:Phaser.Math.Between(0,1200)});
      }
    });
  }

  spawnWisp(x,y,minX,maxX,region='crownwind',mapId='gullhaven',type='spriglet') {
    if(MAP_DEFINITIONS[mapId]?.kind!=='field')return null;
    const speed=Phaser.Math.Between(18,25);
    // Runtime frame registration places the visible ground contact at +27px
    // from the physics sprite center; y=633 lands it on world surface y=660.
    const w=this.enemies.create(x,633,`enemy-${type}`,0).setDepth(3).setOrigin(.5).setDisplaySize(96,96).setCollideWorldBounds(true).setVelocityX(speed);
    this.uiCamera?.ignore(w);
    // The authored opaque foot line is y=92. A 38px body beginning at y=54
    // ends on that exact line, so collision and visible ground contact agree.
    w.setSize(60,38).setOffset(18,54);
    w.body.setAllowGravity(false);
    const maxHp=22+(this.progression.level-1)*5;
    const healthBack=this.add.rectangle(w.x-30,w.y-61,60,7,0x111827,.95).setOrigin(0).setDepth(8).setStrokeStyle(1,0xf4e6c3);
    const healthFill=this.add.rectangle(w.x-29,w.y-60,58,5,0xe96676,1).setOrigin(0).setDepth(8.1);
    const healthLabel=crispText(this.add.text(w.x,w.y-78,`${ENEMY_TYPES[type].name}  ${maxHp}/${maxHp}`,{fontFamily:UI_FONT,fontSize:'11px',fontStyle:'bold',color:'#fff5d5',stroke:'#24304a',strokeThickness:2}).setOrigin(.5).setDepth(8.2));
    [healthBack,healthFill,healthLabel].forEach(object=>this.uiCamera?.ignore(object));
    w.setData({alive:true,type,hp:maxHp,maxHp,healthBack,healthFill,healthLabel,aggroUntil:0,xp:18,patrolMin:minX,patrolMax:maxX,patrolSpeed:speed,region,mapId,spawn:{x,y,minX,maxX,region,mapId,type}});
    w.play(`enemy-${type}-walk`);
  }

  spawnDrop(x,y,kind,data={}) {
    const materialKey=String(data.material||'').toLowerCase().replaceAll(' ','_');
    const key=kind==='coin'?'item-coin':kind==='potion'?'item-potion':kind==='equipment'?'item-equipment':`item-${materialKey}`;
    const drop=this.drops.create(x,y,key).setDepth(5).setBounce(.35).setVelocity(Phaser.Math.Between(-45,45),-105);
    this.uiCamera?.ignore(drop);
    drop.setData({kind,...data});drop.body.setSize(14,14);
    this.time.delayedCall(18000,()=>{if(drop.active)drop.destroy();});
    return drop;
  }

  dropEnemyLoot(enemy) {
    const type=enemy.getData('type'), info=ENEMY_TYPES[type];
    this.spawnDrop(enemy.x,enemy.y-8,'coin',{amount:Phaser.Math.Between(3,9)});
    if(Phaser.Math.Between(1,100)<=62)this.spawnDrop(enemy.x+8,enemy.y-10,'material',{material:info.material,name:info.materialName});
    if(Phaser.Math.Between(1,100)<=10)this.spawnDrop(enemy.x-8,enemy.y-10,'equipment',{itemId:Phaser.Utils.Array.GetRandom(info.equipment)});
  }

  collectDrop(player,drop) {
    if(!drop.active)return;
    this.audio.sfx('pickup');
    const kind=drop.getData('kind');let message='';
    if(kind==='coin'){const amount=drop.getData('amount')||1;this.currency+=amount;message=`+${amount} COINS`;}
    else if(kind==='material'){
      const material=drop.getData('material');this.materials[material]=(this.materials[material]||0)+1;
      if(material==='sprig_leaf')this.quest.berries=this.materials.sprig_leaf;
      message=`${drop.getData('name').toUpperCase()} +1`;
    }else if(kind==='potion'){const amount=drop.getData('amount')||1;this.consumables.redPotion+=amount;message=`RED POTION +${amount}`;}
    else if(kind==='equipment'){
      const itemId=drop.getData('itemId'), item=this.itemCatalog[itemId];
      if(!item)message='MYSTERY GEAR';
      else if(this.inventory.length>=12){this.currency+=20;message='BAG FULL • SOLD FOR 20';}
      else{this.inventory.push(itemId);message=`GEAR • ${item.name}`;this.requestInventoryRefresh();}
    }
    drop.disableBody(true,true);this.refreshHud();this.updateQuestHud();
    const notice=crispText(this.add.text(player.x,player.y-38,message,{fontFamily:'monospace',fontSize:'7px',fontStyle:'bold',color:'#fff0a8',stroke:'#263450',strokeThickness:2}).setOrigin(.5).setDepth(35));
    this.uiCamera?.ignore(notice);
    this.tweens.add({targets:notice,y:notice.y-14,alpha:0,duration:800,onComplete:()=>notice.destroy()});
  }

  collectBerry(player,berry) {
    if(!berry.active)return;
    berry.disableBody(true,true);
    const score=player.getData('score')+1;
    player.setData('score',score);
    this.scoreText.setText(`✦ ${score}`);
    this.tweens.add({targets:this.scoreText,scale:1.35,duration:100,yoyo:true});
    if(this.quest.tutorial==='active'&&berry.getData('region')==='dawnleaf')this.quest.berries+=1;
    this.gainXp(5);
    this.updateQuestHud();
  }

  meleeAttack() {
    const grounded = this.player.body.onFloor() || this.player.body.blocked.down || this.player.body.touching.down;
    if (!this.player.getData('canAttack')) return;
    this.audio.sfx('attack');
    const weapon = this.currentWeapon();
    const attack = ATTACKS[weapon];
    this.player.setData({ canAttack:false, attacking:true, attackAirborne:!grounded });
    if (grounded) this.player.setVelocityX(0);
    this.carriedWeapon.setVisible(false);
    this.bodyLayer.play(`body-attack-${attack.pose}`);
    this.syncEquipmentLayers();
    this.syncCarriedWeapon();
    this.time.delayedCall(attack.hitDelay, () => {
      if(!this.player.getData('attacking'))return;
      const facing = this.player.getData('facing');
      const critical=Phaser.Math.Between(1,100)<=this.derivedStats().crit;
      const damage=critical?Math.round(this.attackPower()*1.5):this.attackPower();
      if(attack.projectile){this.shootProjectile(attack.projectile,damage,critical);return;}
      this.enemies.getChildren().forEach(enemy => {
        if (!enemy.active || !enemy.getData('alive')) return;
        const forward = (enemy.x - this.player.x) * facing;
        const enemyNearEdge=forward-(enemy.body?.halfWidth||30);
        // Measure reach to the enemy's near edge, not its center. The old
        // center test required the two physics bodies to overlap before a
        // wooden-sword swing could connect.
        if (forward > 0 && enemyNearEdge <= attack.range && Math.abs(enemy.y - this.player.y) < 54) {
          this.damageEnemy(enemy,damage,critical);
        }
      });
    });
    this.time.delayedCall(Math.round(attack.cooldown*this.classProfile().cooldown), () => {
      this.player.setData({ canAttack:true, attacking:false, attackAirborne:false });
      this.refreshAppearance();
    });
  }

  useAoeSkill() {
    if(!this.progression.skills.aoe||this.time.now<(this.aoeReadyAt||0)||this.player.getData('attacking'))return;
    this.aoeReadyAt=this.time.now+2200;const level=this.progression.skills.aoe,radius=118+level*14,damage=Math.round(this.attackPower()*(1.15+level*.18));
    const ring=this.add.circle(this.player.x,this.player.y-22,18,0xffd76d,.2).setStrokeStyle(5,0x8de5e5,.9).setDepth(8);
    this.tweens.add({targets:ring,scale:radius/18,alpha:0,duration:280,onComplete:()=>ring.destroy()});
    this.enemies.getChildren().forEach(enemy=>{
      if(enemy.active&&enemy.getData('alive')&&enemy.getData('mapId')===this.currentMapId&&Phaser.Math.Distance.Between(this.player.x,this.player.y,enemy.x,enemy.y)<radius)this.damageEnemy(enemy,damage,false);
    });
  }

  shootProjectile(kind,damage,critical) {
    const facing=this.player.getData('facing');
    const texture=kind==='arrow'?'arrow-shot':'orb-shot';
    const projectile=this.projectiles.create(this.player.x+facing*22,this.player.y-8,texture).setDepth(7).setFlipX(facing<0);
    this.uiCamera?.ignore(projectile);
    projectile.setVelocityX(facing*(kind==='arrow'?300:230));
    projectile.setData({damage,critical});
    this.time.delayedCall(1100,()=>{if(projectile.active)projectile.destroy();});
  }

  projectileHit(projectile,enemy) {
    if(!projectile.active||!enemy.active||!enemy.getData('alive'))return;
    const damage=projectile.getData('damage');
    const critical=projectile.getData('critical');
    projectile.destroy();
    this.damageEnemy(enemy,damage,critical);
  }

  damageEnemy(enemy, amount, critical=false) {
    if(!enemy.getData('alive')) return;
    this.audio.sfx('hit');
    const popup=crispText(this.add.text(enemy.x,enemy.y-30,`${critical?'CRIT ':''}${amount}`,{fontFamily:UI_FONT,fontSize:critical?'22px':'18px',fontStyle:'bold',color:critical?'#ffe07d':'#ffffff',stroke:'#5b3a5f',strokeThickness:4})).setOrigin(.5).setDepth(35);
    this.uiCamera?.ignore(popup);
    this.tweens.add({targets:popup,y:popup.y-24,alpha:0,duration:750,onComplete:()=>popup.destroy()});
    const hp=enemy.getData('hp')-amount; enemy.setData('hp',hp);
    enemy.setData('aggroUntil',this.time.now+5000);
    const healthFill=enemy.getData('healthFill'),healthLabel=enemy.getData('healthLabel'),maxHp=enemy.getData('maxHp');
    if(healthFill)healthFill.width=58*Phaser.Math.Clamp(hp/maxHp,0,1);
    if(healthLabel)healthLabel.setText(`${ENEMY_TYPES[enemy.getData('type')].name}  ${Math.max(0,hp)}/${maxHp}`);
    const knockDirection=enemy.x>=this.player.x?1:-1;enemy.setVelocityX(knockDirection*55);enemy.setData('knockbackUntil',this.time.now+100);
    if(hp>0){enemy.setTint(0xffffff);this.time.delayedCall(100,()=>enemy.clearTint());return;}
    const spawn=enemy.getData('spawn');
    const region=enemy.getData('region');
    enemy.setData('alive',false);enemy.body.enable=false;enemy.setVelocity(0,0);
    this.audio.sfx('defeat');
    this.totalKills+=1;
    ['healthBack','healthFill','healthLabel'].forEach(key=>enemy.getData(key)?.setVisible(false));
    if(this.quest.tutorial==='active'&&region==='dawnleaf')this.quest.mobs+=1;
    if(this.quest.advancement?.status==='active'&&region==='crownwind')this.quest.advancementKills+=1;
    this.gainXp(enemy.getData('xp')||18);
    if(this.progression.classId==='magician')this.hpValue=Math.min(this.maxHp(),this.hpValue+8);
    this.refreshHud();
    this.updateQuestHud();
    this.dropEnemyLoot(enemy);
    enemy.anims.play(`enemy-${enemy.getData('type')}-die`,true);
    enemy.once('animationcomplete',()=>{['healthBack','healthFill','healthLabel'].forEach(key=>enemy.getData(key)?.destroy());enemy.destroy();});
    this.time.delayedCall(4500,()=>this.spawnWisp(spawn.x,spawn.y,spawn.minX,spawn.maxX,spawn.region,spawn.mapId,spawn.type));
  }

  applySlopeAssist() {
    const map=MAP_DEFINITIONS[this.currentMapId],slopes=MAP_SLOPES[this.currentMapId]||[];
    if(!map||!slopes.length||this.player.body.velocity.y<-20){this.player.setData('activeSlope',null);return false;}
    const body=this.player.body,feet=body.bottom,active=this.player.getData('activeSlope');
    for(let index=0;index<slopes.length;index++){
      const [x,y,width,rise]=slopes[index];
      const start=map.x+x,t=(this.player.x-start)/width;
      if(t<0||t>1)continue;
      const surface=y-rise*t;
      const key=`${this.currentMapId}:${index}`;
      const enteringLow=Math.abs(t)<.15&&Math.abs(feet-y)<=18;
      const enteringHigh=Math.abs(t-1)<.15&&Math.abs(feet-(y-rise))<=18;
      const landing=body.velocity.y>=0&&feet>=surface-18&&feet<=surface+26;
      if(active===key||enteringLow||enteringHigh||landing){
        const deltaY=surface-feet;
        this.player.y+=deltaY;
        body.position.y+=deltaY;
        this.player.setVelocityY(0);
        this.player.setData('activeSlope',key);
        this.lastGrounded=this.time.now;
        return true;
      }
    }
    this.player.setData('activeSlope',null);
    return false;
  }

  syncFixedUi() {
    // UI containers use scrollFactor(0); no world-space compensation needed.
  }
  hitPlayer(player,wisp) {
    if(this.time.now<(player.getData('invulnerableUntil')||0))return;
    this.audio.sfx('hurt');
    const invulnerabilityMs=850;player.setData('hurt',true);player.setData('invulnerableUntil',this.time.now+invulnerabilityMs);player.setData('knockbackUntil',this.time.now+180);
    const raw=Math.max(5,Math.round(15+this.progression.level*1.5-this.defense()*.7));const damage=Math.max(1,Math.round(raw*this.classProfile().damageTaken));
    this.hpValue=Math.max(0,this.hpValue-damage);this.refreshHud();player.setVelocity(wisp.x<player.x?80:-80,-70);
    const layers=this.visualLayers();layers.forEach(layer=>layer.setTint(0xffb3bd));
    const blink=this.tweens.add({targets:layers,alpha:.32,duration:75,yoyo:true,repeat:4});
    this.time.delayedCall(invulnerabilityMs,()=>{blink.stop();layers.forEach(layer=>{layer.setAlpha(1);layer.clearTint();});player.setData('hurt',false);});
    if(this.hpValue===0)this.time.delayedCall(220,()=>this.respawnPlayer());
  }

  respawnPlayer() {
    const lost=Math.floor(this.progression.xp*.1);
    this.progression.xp=Math.max(0,this.progression.xp-lost);
    const map=MAP_DEFINITIONS[this.lastTownMapId]||MAP_DEFINITIONS.sprout_camp;
    this.hpValue=this.maxHp();
    this.player.setData({hurt:false,invulnerableUntil:0,attacking:false,canAttack:true,attackAirborne:false});
    this.visualLayers().forEach(layer=>layer.clearTint());
    this.enterMap(map.id,'left',true);this.refreshAppearance();this.refreshHud();
    this.showDialogue('RECOVERY',`You awaken in ${map.label.split(' • ')[1]}. Recovery cost: ${lost} XP (10% of your current progress).`);
  }

  usePotion() {
    if(!this.consumables.redPotion||this.hpValue>=this.maxHp())return;
    this.consumables.redPotion-=1;this.hpValue=Math.min(this.maxHp(),this.hpValue+35);this.refreshHud();
  }
  win() { this.physics.pause(); this.add.rectangle(W/2,H/2,216,86,0x35466f,.94).setDepth(40).setStrokeStyle(2,0xffedb4); crispText(this.add.text(W/2,H/2-18,'SKYBERRY SATCHEL FILLED!',{fontFamily:UI_FONT,fontSize:'15px',fontStyle:'bold',color:'#fff2bb',stroke:'#5a497b',strokeThickness:2})).setOrigin(.5).setDepth(41); crispText(this.add.text(W/2,H/2+12,'THE CLOUD PATHS ARE BRIGHT AGAIN.\nPRESS R TO WANDER ANEW.',{align:'center',fontFamily:UI_FONT,fontSize:'8px',color:'#fff8ed'})).setOrigin(.5).setDepth(41); this.input.keyboard.once('keydown-R',()=>this.scene.restart()); }

  update() {
    this.syncFixedUi();
    if(this.chapterOnePanel)return;
    if (Phaser.Input.Keyboard.JustDown(this.keys.I)) this.toggleInventory();
    if (Phaser.Input.Keyboard.JustDown(this.keys.M)) this.toggleWorldMap();
    if (Phaser.Input.Keyboard.JustDown(this.keys.J)) this.toggleQuestPanel();
    if (Phaser.Input.Keyboard.JustDown(this.keys.V)){const muted=this.audio.activateOrToggle();if(this.audioHudText)this.audioHudText.setText(muted?'×':'♪');}
    if(this.questPanelOpen){this.syncEquipmentLayers();this.syncCarriedWeapon();return;}
    if(this.worldMapOpen){this.syncEquipmentLayers();this.syncCarriedWeapon();return;}
    if (this.inventoryOpen) {
      this.syncEquipmentLayers();
      this.syncCarriedWeapon();
      return;
    }
    if(this.mapTransitioning){this.player.setVelocity(0,0);this.syncEquipmentLayers();this.syncCarriedWeapon();return;}
    const body = this.player.body;
    const left=this.cursors.left.isDown, right=this.cursors.right.isDown;
    // Strong air steering preserves horizontal reach while the higher gravity
    // makes the vertical arc much faster and less floaty.
    const moveSpeed=this.classProfile().moveSpeed*1.15*(body.velocity.y!==0?1.6:1);
    const knockedBack=this.time.now<(this.player.getData('knockbackUntil')||0);
    if(!knockedBack){if(left){this.player.setVelocityX(-moveSpeed);this.player.setFlipX(true);this.player.setData('facing',-1);} else if(right){this.player.setVelocityX(moveSpeed);this.player.setFlipX(false);this.player.setData('facing',1);} else this.player.setVelocityX(0);}
    if(this.player.y>WORLD_H-18){this.respawnPlayer();return;}
    this.applySlopeAssist();
    // Arcade Physics can report either onFloor, blocked, or touching after a platform collision.
    // Remember ground contact briefly so jumping at a platform edge still feels responsive.
    if (body.onFloor() || body.blocked.down || body.touching.down) this.lastGrounded = this.time.now;
    // E talks to NPCs; Up is reserved for nearby travel gates.
    const pressedJump = Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    if (pressedJump && this.time.now - this.lastGrounded < 140) {
      this.audio.sfx('jump');
      this.player.setData('activeSlope',null);
      this.player.setVelocityY(JUMP_VELOCITY);
      this.lastGrounded = 0;
    }
    if(Phaser.Input.Keyboard.JustDown(this.keys.E)) {
      if(!this.closeDialogue()){const chest=this.nearbyChest();if(chest)this.openChest(chest);else this.interactWithNpc();}
    }
    if(Phaser.Input.Keyboard.JustDown(this.keys.Q))this.usePotion();
    if(Phaser.Input.Keyboard.JustDown(this.keys.S))this.useAoeSkill();
    if(Phaser.Input.Keyboard.JustDown(this.cursors.up))this.interactPortal();
    if (this.player.getData('attacking')) {
      if (!this.player.getData('attackAirborne')) this.player.setVelocityX(0);
    } else if (body.velocity.y !== 0) {
      this.bodyLayer.anims.stop();
      const airFrame = body.velocity.y < 0 ? 1 : 3;
      this.bodyLayer.setTexture('body-air', airFrame);
    } else {
      if (left || right) this.bodyLayer.play('body-walk', true);
      else this.bodyLayer.play('body-idle', true);
    }
    if(Phaser.Input.Keyboard.JustDown(this.keys.A)) this.meleeAttack();
    this.syncEquipmentLayers();
    this.syncCarriedWeapon();
    const chest=this.nearbyChest(),npc=this.nearbyNpc(), portal=this.nearbyPortal();
    const secretKnown=portal?.secret&&this.discoveredSecrets.has([portal.mapId,portal.to].sort().join(':'));
    const prompt=chest?'E  OPEN CHEST':(portal?(portal.secret&&!secretKnown?'↑  SEARCH THIS SPOT':`↑  ENTER ${portal.label}`):'');
    this.interactionText.setText(prompt).setVisible(Boolean(prompt));
    this.updateNpcMarkers();
    this.enemies.getChildren().forEach(enemy => {
      if (!enemy.active || !enemy.getData('alive')) return;
      const sameMap=enemy.getData('mapId')===this.currentMapId;
      ['healthBack','healthFill','healthLabel'].forEach(key=>enemy.getData(key)?.setVisible(sameMap));
      const healthBack=enemy.getData('healthBack'),healthFill=enemy.getData('healthFill'),healthLabel=enemy.getData('healthLabel');
      if(healthBack)healthBack.setPosition(enemy.x-30,enemy.y-61);
      if(healthFill)healthFill.setPosition(enemy.x-29,enemy.y-60);
      if(healthLabel)healthLabel.setPosition(enemy.x,enemy.y-78);
      if(!sameMap)return;
      if(this.time.now<(enemy.getData('knockbackUntil')||0))return;
      const speed = enemy.getData('patrolSpeed');
      const aggro=this.time.now<(enemy.getData('aggroUntil')||0)&&Math.abs(this.player.x-enemy.x)<520;
      if(aggro)enemy.setVelocityX(Math.sign(this.player.x-enemy.x||1)*Math.max(38,speed*1.65));
      else if (enemy.x <= enemy.getData('patrolMin')) enemy.setVelocityX(speed);
      else if (enemy.x >= enemy.getData('patrolMax')) enemy.setVelocityX(-speed);
      enemy.setFlipX(enemy.body.velocity.x < 0);
    });
  }
}

const startGame=()=>window.__skyberryGame=new Phaser.Game({ type:Phaser.AUTO, parent:'game', width:W, height:H, pixelArt:true, antialias:false, roundPixels:true, backgroundColor:'#78bee3', physics:{ default:'arcade', arcade:{ gravity:{y:WORLD_GRAVITY}, debug:false } }, scene:SkyberryHollow, scale:{ mode:Phaser.Scale.FIT, autoCenter:Phaser.Scale.CENTER_BOTH } });
startGame();
