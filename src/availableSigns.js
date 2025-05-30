// Available sign animations, this is hardcoded for now

// Train anouncement signs
export const availableSigns = [
  {name: "1", file: "signs/trein/1.glb", start: 90, end: 140 },
  {name: "2", file: "signs/trein/2.glb", start: 95, end: 150 },
  {name: "3", file: "signs/trein/3.glb", start: 90, end: 150 },
  {name: "4", file: "signs/trein/4.glb", start: 90, end: 150 },
  {name: "5", file: "signs/trein/5.glb", start: 90, end: 150 },
  {name: "6", file: "signs/trein/6.glb", start: 90, end: 150 },
  {name: "7", file: "signs/trein/7.glb", start: 90, end: 150 },
  {name: "8", file: "signs/trein/8.glb", start: 90, end: 150 },
  {name: "9", file: "signs/trein/9.glb", start: 90, end: 150 },
  {name: "10", file: "signs/trein/10.glb", start: 90, end: 150 },
  {name: "11", file: "signs/trein/11.glb", start: 100, end: 150 },
  {name: "12", file: "signs/trein/12.glb", start: 110, end: 150 },
  {name: "13", file: "signs/trein/13.glb", start: 95, end: 150 },
  {name: "14", file: "signs/trein/14.glb", start: 90, end: 150 },
  {name: "15", file: "signs/trein/15.glb", start: 90, end: 150 },
  {name: "5 OVER", file: "signs/trein/5_Over.glb", start: 80, end: 170 },
  {name: "5 VOOR", file: "signs/trein/5_Voor.glb", start: 80, end: 180 },
  {name: "10 OVER", file: "signs/trein/10_Over.glb", start: 60, end: 160 },
  {name: "10 VOOR", file: "signs/trein/10_Voor.glb", start: 60, end: 160 },
  {name: "A", file: "signs/trein/A.glb", start: 80, end: 110 },
  {name: "B", file: "signs/trein/B.glb", start: 90, end: 120 },
  {name: "AMSTERDAM", file: "signs/trein/Amsterdam.glb", start: 90, end: 180 },
  {name: "DEN HAAG", file: "signs/trein/Den_Haag.glb", start: 90, end: 160 },
  {name: "DIEMEN", file: "signs/trein/Diemen.glb", start: 90, end: 160 },
  {name: "GRONINGEN", file: "signs/trein/Groningen.glb", start: 95, end: 190 },
  {name: "HAARLEM", file: "signs/trein/Haarlem.glb", start: 110, end: 170 },
  {name: "TREIN", file: "signs/trein/Trein.glb", start: 90, end: 160 },
  {name: "INTERCITY", file: "signs/trein/Intercity.glb", start: 85, end: 135 },
  {name: "SPRINTER", file: "signs/trein/Sprinter.glb", start: 90, end: 155 },
  {name: "PERRON", file: "signs/trein/Perron.glb", start: 85, end: 155 },
  {name: "SPOOR", file: "signs/trein/Spoor.glb", start: 85, end: 160 },
  {name: "VERTREKT", file: "signs/trein/Vertrekt.glb", start: 100, end: 175 },
  {name: "VERTREKT OVER", file: "signs/trein/Vertrekt_Over.glb", start: 90, end: 200 },
  {name: "VERTREKT OM", file: "signs/trein/Vertrekt_Om.glb", start: 90, end: 200 },
  {name: "VERTREKT VAN", file: "signs/trein/Vertrekt_Van.glb", start: 90, end: 200 },
  {name: "VERTRAAGD", file: "signs/trein/Vertraagd.glb", start: 70, end: 165 },
  {name: "VAN", file: "signs/trein/Van.glb", start: 95, end: 135},
  {name: "NAAR", file: "signs/trein/Naar.glb", start: 90, end: 150 },
  {name: "OM", file: "signs/trein/Om.glb", start: 40, end: 105 },
  {name: "OVER", file: "signs/trein/Over.glb", start: 90, end: 200 },
  {name: "OVER2", file: "signs/trein/Over2.glb", start: 90, end: 200 },
  {name: "VOOR", file: "signs/trein/Voor.glb", start: 90, end: 150 },
  {name: "HALF", file: "signs/trein/Half.glb", start: 90, end: 160 },
  {name: "KWART OVER", file: "signs/trein/Kwart_Over.glb", start: 90, end: 190 },
  {name: "KWART VOOR", file: "signs/trein/Kwart_Voor.glb", start: 90, end: 190 },
  {name: "MINUTEN", file: "signs/trein/Minuten.glb", start: 85, end: 130 },
  {name: "MINUUT", file: "signs/trein/Minuut.glb", start: 90, end: 135 },
  {name: "BESTE REIZIGERS", file: "signs/trein/Beste_Reizigers.glb", start: 85, end: 250 },
  {name: "ZIN 1 ", file: "signs/trein/Zin_1.glb"},
  {name: "ZIN 2", file: "signs/trein/Zin_2.glb"},
  {name: "ZIN 3", file: "signs/trein/Zin_3.glb"},
  {name: "ZIN 4", file: "signs/trein/Zin_4.glb"},
  {name: "ZIN 5", file: "signs/trein/Zin_5.glb"},
  {name: "ZIN 6", file: "signs/trein/Zin_6.glb"},
  {name: "ZIN 7", file: "signs/trein/Zin_7.glb"},
  {name: "ZIN 8", file: "signs/trein/Zin_8.glb"},
  {name: "ZIN 9", file: "signs/trein/Zin_9.glb"},
  {name: "ZIN 10", file: "signs/trein/Zin_10.glb"}
];


// Mapping to get the item from the name
export const availableSignsMap = availableSigns.reduce((acc, sign) => {
  acc[sign.name] = sign;
  return acc;
}
, {});  

// Old dataset, used for testing
export const availableSigns2 = [
  { name: "HALLO", file: "signs/HALLO-C_250226_1.glb", start:60, end: 100 },
  { name: "SCHOOL", file: "signs/SCHOOL-D_250226_1.glb", start: 40, end: 110 },
  { name: "HAARLEM", file: "signs/HAARLEM_250226_1.glb", start: 15, end: 90 },
  { name: "KRIJGEN-A", file: "signs/KRIJGEN-A_250228_5.glb", start: 60, end: 110 },
  { name: "LELYSTAD", file: "signs/LELYSTAD_250314_1.glb", start:55, end: 130 },
  { name: "LES", file: "signs/LES_250228_2.glb", start: 85, end: 150 },
  { name: "PROBEREN-E", file: "signs/PROBEREN-E_250226_2.glb", start: 50, end: 117 },
  { name: "SCHULDGEVEN", file: "signs/SCHULDGEVEN_250226_1.glb", start: 50, end: 90 },
  { name: "VRAGEN-A", file: "signs/VRAGEN-A_250226_1.glb", start: 65, end: 100 },
  { name: "WACHTEN-B", file: "signs/WACHTEN-B_250226_1.glb", start: 30, end: 103 },
  {name: "lelystad", file: "signs/LELYSTAD_250314_1_GlassesGuyRecord_C_1.glb", start:55, end: 130 },
  {name: "2", file: "signs/mabel/2.glb", start: 0, end: 200 },
  {name: "3", file: "signs/mabel/3.glb", start: 0, end: 200 },
  {name: "4", file: "signs/mabel/4.glb", start: 0, end: 200 },
  {name: "Zin_250528_75.glb", file: "signs/mabel/Zin_250528_75.glb", start: 0, end: 500 },
  {name: "Trein", file: "signs/mabel/Trein_250528_59.glb", start: 0, end: 500 },
];