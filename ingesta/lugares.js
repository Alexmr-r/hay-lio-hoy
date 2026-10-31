// Lugares de España que salen en los titulares, con coordenadas aproximadas.
// Sirven para situar en el mapa las noticias, que no traen coordenadas.
//
// CIUDADES: [expresión, nombre, lat, lng]
// SITIOS:   [expresión, nombre, lat, lng, ciudad]  → plazas y calles conocidas dentro de una ciudad.
// Un sitio solo cuenta si su ciudad sale en el titular o si no sale ninguna otra ciudad
// (así "plaza de España" va a Madrid salvo que el titular diga Barcelona, Sevilla…).
// Para abrir otro país más adelante, basta con añadir sus ciudades aquí.

export const CIUDADES = [
  [/santiago de compostela|\bcompostela\b/i, 'Santiago de Compostela', 42.8782, -8.5448],
  [/las palmas/i, 'Las Palmas de Gran Canaria', 28.1235, -15.4363],
  [/santa cruz de tenerife|\btenerife\b/i, 'Santa Cruz de Tenerife', 28.4636, -16.2518],
  [/alcal[aá] de henares/i, 'Alcalá de Henares', 40.4818, -3.3643],
  [/l'?hospitalet/i, "L'Hospitalet", 41.3597, 2.0997],
  [/\bmadrid\b(?! de los)/i, 'Madrid', 40.4168, -3.7038],
  [/\bbarcelona\b/i, 'Barcelona', 41.3874, 2.1686],
  [/\bvalencia\b|\bval[eè]ncia\b/i, 'Valencia', 39.4699, -0.3763],
  [/\bsevilla\b/i, 'Sevilla', 37.3891, -5.9845],
  [/\bzaragoza\b/i, 'Zaragoza', 41.6488, -0.8891],
  [/\bm[aá]laga\b/i, 'Málaga', 36.7213, -4.4214],
  [/\bmurcia\b/i, 'Murcia', 37.9922, -1.1307],
  [/\bpalma\b(?! de gran canaria)|\bmallorca\b/i, 'Palma', 39.5696, 2.6502],
  [/\bbilbao\b/i, 'Bilbao', 43.2630, -2.9350],
  [/\balicante\b|\balacant\b/i, 'Alicante', 38.3452, -0.4810],
  [/\bc[oó]rdoba\b/i, 'Córdoba', 37.8882, -4.7794],
  [/\bvalladolid\b/i, 'Valladolid', 41.6523, -4.7245],
  [/\bvigo\b/i, 'Vigo', 42.2406, -8.7207],
  [/\bgij[oó]n\b/i, 'Gijón', 43.5322, -5.6611],
  [/\bvitoria\b|\bgasteiz\b/i, 'Vitoria', 42.8467, -2.6716],
  [/a coru[ñn]a|la coru[ñn]a/i, 'A Coruña', 43.3623, -8.4115],
  [/\bgranada\b/i, 'Granada', 37.1773, -3.5986],
  [/\belche\b|\belx\b/i, 'Elche', 38.2669, -0.6983],
  [/\boviedo\b/i, 'Oviedo', 43.3614, -5.8593],
  [/\bbadalona\b/i, 'Badalona', 41.4500, 2.2474],
  [/\bcartagena\b/i, 'Cartagena', 37.6257, -0.9966],
  [/\bterrassa\b/i, 'Terrassa', 41.5632, 2.0089],
  [/\bjerez\b/i, 'Jerez', 36.6850, -6.1261],
  [/\bsabadell\b/i, 'Sabadell', 41.5433, 2.1094],
  [/\bpamplona\b|\biru[ñn]a\b/i, 'Pamplona', 42.8125, -1.6458],
  [/\balmer[ií]a\b/i, 'Almería', 36.8340, -2.4637],
  [/san sebasti[aá]n|\bdonostia\b/i, 'San Sebastián', 43.3183, -1.9812],
  [/\bsantander\b/i, 'Santander', 43.4623, -3.8099],
  [/\bcastell[oó]n\b/i, 'Castellón', 39.9864, -0.0513],
  [/\bburgos\b/i, 'Burgos', 42.3439, -3.6969],
  [/\balbacete\b/i, 'Albacete', 38.9943, -1.8585],
  [/\blogro[ñn]o\b/i, 'Logroño', 42.4627, -2.4450],
  [/\bbadajoz\b/i, 'Badajoz', 38.8794, -6.9707],
  [/\bsalamanca\b/i, 'Salamanca', 40.9701, -5.6635],
  [/\bhuelva\b/i, 'Huelva', 37.2614, -6.9447],
  [/\blleida\b|\bl[eé]rida\b/i, 'Lleida', 41.6176, 0.6200],
  [/\btarragona\b/i, 'Tarragona', 41.1189, 1.2445],
  [/\ben le[oó]n\b|\bde le[oó]n\b(?!\s+xiv)/i, 'León', 42.5987, -5.5671],
  [/\bc[aá]diz\b/i, 'Cádiz', 36.5271, -6.2886],
  [/\bja[eé]n\b/i, 'Jaén', 37.7796, -3.7849],
  [/\bourense\b|\borense\b/i, 'Ourense', 42.3358, -7.8639],
  [/\bgirona\b|\bgerona\b/i, 'Girona', 41.9794, 2.8214],
  [/\blugo\b/i, 'Lugo', 43.0097, -7.5568],
  [/\bc[aá]ceres\b/i, 'Cáceres', 39.4753, -6.3724],
  [/\bguadalajara\b/i, 'Guadalajara', 40.6330, -3.1669],
  [/\btoledo\b/i, 'Toledo', 39.8628, -4.0273],
  [/\bpontevedra\b/i, 'Pontevedra', 42.4310, -8.6444],
  [/\bpalencia\b/i, 'Palencia', 42.0095, -4.5288],
  [/ciudad real/i, 'Ciudad Real', 38.9848, -3.9274],
  [/\bzamora\b/i, 'Zamora', 41.5034, -5.7467],
  [/\b[aá]vila\b/i, 'Ávila', 40.6565, -4.6818],
  [/\bcuenca\b/i, 'Cuenca', 40.0704, -2.1374],
  [/\bhuesca\b/i, 'Huesca', 42.1401, -0.4087],
  [/\bsegovia\b/i, 'Segovia', 40.9429, -4.1088],
  [/\bsoria\b/i, 'Soria', 41.7666, -2.4790],
  [/\bteruel\b/i, 'Teruel', 40.3457, -1.1065],
  [/\bm[eé]rida\b/i, 'Mérida', 38.9161, -6.3437],
  [/\bceuta\b/i, 'Ceuta', 35.8894, -5.3213],
  [/\bmelilla\b/i, 'Melilla', 35.2923, -2.9381],
  [/\bibiza\b|\beivissa\b/i, 'Ibiza', 38.9067, 1.4206],
  [/\bmarbella\b/i, 'Marbella', 36.5101, -4.8825],
  [/\balgeciras\b/i, 'Algeciras', 36.1408, -5.4562],
  [/\bbenidorm\b/i, 'Benidorm', 38.5411, -0.1225],
  [/\breus\b/i, 'Reus', 41.1561, 1.1069],
  [/\bmatar[oó]\b/i, 'Mataró', 41.5381, 2.4447],
  [/\bgetafe\b/i, 'Getafe', 40.3057, -3.7329],
  [/\blegan[eé]s\b/i, 'Leganés', 40.3280, -3.7635],
  [/\bm[oó]stoles\b/i, 'Móstoles', 40.3223, -3.8650],
  [/\bfuenlabrada\b/i, 'Fuenlabrada', 40.2842, -3.7942],
  [/\balcorc[oó]n\b/i, 'Alcorcón', 40.3458, -3.8249],
  [/\balcobendas\b/i, 'Alcobendas', 40.5475, -3.6420],
  [/\btorrej[oó]n\b/i, 'Torrejón de Ardoz', 40.4554, -3.4697],
];

export const SITIOS = [
  // Madrid
  [/puerta de alcal[aá]/i, 'Puerta de Alcalá, Madrid', 40.4200, -3.6887, 'Madrid'],
  [/plaza de castilla/i, 'Plaza de Castilla, Madrid', 40.4669, -3.6890, 'Madrid'],
  [/puerta del sol|plaza (de|del) sol|real casa de correos/i, 'Puerta del Sol, Madrid', 40.4169, -3.7035, 'Madrid'],
  [/plaza de espa[ñn]a/i, 'Plaza de España, Madrid', 40.4233, -3.7122, 'Madrid'],
  [/plaza mayor/i, 'Plaza Mayor, Madrid', 40.4155, -3.7074, 'Madrid'],
  [/delegaci[oó]n del gobierno/i, 'Delegación del Gobierno, Madrid', 40.4362, -3.6955, 'Madrid'],
  [/nuevos ministerios/i, 'Nuevos Ministerios, Madrid', 40.4460, -3.6920, 'Madrid'],
  [/ciudad universitaria|complutense/i, 'Ciudad Universitaria, Madrid', 40.4450, -3.7280, 'Madrid'],
  [/tirso de molina/i, 'Tirso de Molina, Madrid', 40.4123, -3.7044, 'Madrid'],
  [/cibeles/i, 'Cibeles, Madrid', 40.4193, -3.6931, 'Madrid'],
  [/gran v[ií]a/i, 'Gran Vía, Madrid', 40.4200, -3.7050, 'Madrid'],
  [/callao/i, 'Callao, Madrid', 40.4199, -3.7058, 'Madrid'],
  [/\bcol[oó]n\b/i, 'Colón, Madrid', 40.4253, -3.6903, 'Madrid'],
  [/atocha/i, 'Atocha, Madrid', 40.4066, -3.6915, 'Madrid'],
  [/neptuno/i, 'Neptuno, Madrid', 40.4153, -3.6940, 'Madrid'],
  [/\bcongreso\b/i, 'Congreso de los Diputados, Madrid', 40.4163, -3.6966, 'Madrid'],
  [/ferraz/i, 'Calle Ferraz, Madrid', 40.4300, -3.7186, 'Madrid'],
  [/g[eé]nova/i, 'Calle Génova, Madrid', 40.4255, -3.6935, 'Madrid'],
  [/moncloa/i, 'Moncloa, Madrid', 40.4352, -3.7189, 'Madrid'],
  [/lavapi[eé]s/i, 'Lavapiés, Madrid', 40.4087, -3.7010, 'Madrid'],
  [/malasa[ñn]a/i, 'Malasaña, Madrid', 40.4260, -3.7040, 'Madrid'],
  [/chueca/i, 'Chueca, Madrid', 40.4229, -3.6972, 'Madrid'],
  [/castellana/i, 'Paseo de la Castellana, Madrid', 40.4359, -3.6895, 'Madrid'],
  [/bernab[eé]u/i, 'Estadio Bernabéu, Madrid', 40.4531, -3.6883, 'Madrid'],
  [/vallecas/i, 'Vallecas, Madrid', 40.3920, -3.6600, 'Madrid'],
  [/carabanchel/i, 'Carabanchel, Madrid', 40.3830, -3.7280, 'Madrid'],
  // Barcelona
  [/pla[çc]a (de )?catalunya|plaza (de )?catalu[ñn]a/i, 'Plaça de Catalunya, Barcelona', 41.3870, 2.1700, 'Barcelona'],
  [/\b(la|las) rambla/i, 'La Rambla, Barcelona', 41.3809, 2.1735, 'Barcelona'],
  [/passeig de gr[aà]cia|paseo de gracia/i, 'Passeig de Gràcia, Barcelona', 41.3917, 2.1649, 'Barcelona'],
  [/via laietana|v[ií]a layetana/i, 'Via Laietana, Barcelona', 41.3853, 2.1777, 'Barcelona'],
  [/portal de l'[aà]ngel|portal del [aá]ngel/i, "Portal de l'Àngel, Barcelona", 41.3858, 2.1730, 'Barcelona'],
  [/pla[çc]a sant jaume|plaza (de )?sant jaume/i, 'Plaça Sant Jaume, Barcelona', 41.3826, 2.1770, 'Barcelona'],
  [/arc de triomf|arco de triunfo/i, 'Arc de Triomf, Barcelona', 41.3910, 2.1806, 'Barcelona'],
  [/pla[çc]a d'espanya|plaza (de )?espa[ñn]a/i, "Plaça d'Espanya, Barcelona", 41.3750, 2.1491, 'Barcelona'],
  [/pla[çc]a universitat|plaza universidad/i, 'Plaça Universitat, Barcelona', 41.3863, 2.1640, 'Barcelona'],
  [/\braval\b/i, 'El Raval, Barcelona', 41.3800, 2.1690, 'Barcelona'],
  [/barceloneta/i, 'La Barceloneta, Barcelona', 41.3800, 2.1890, 'Barcelona'],
  [/\bsants\b/i, 'Sants, Barcelona', 41.3790, 2.1400, 'Barcelona'],
  // Valencia
  [/plaza del ayuntamiento|pla[çc]a de l'ajuntament/i, 'Plaza del Ayuntamiento, Valencia', 39.4697, -0.3774, 'Valencia'],
  [/plaza de espa[ñn]a/i, 'Plaza de España, Valencia', 39.4660, -0.3830, 'Valencia'],
  // Sevilla
  [/plaza nueva/i, 'Plaza Nueva, Sevilla', 37.3887, -5.9953, 'Sevilla'],
  [/plaza de espa[ñn]a/i, 'Plaza de España, Sevilla', 37.3772, -5.9869, 'Sevilla'],
  // Bilbao
  [/plaza moy[uú]a|plaza el[ií]ptica/i, 'Plaza Moyúa, Bilbao', 43.2630, -2.9350, 'Bilbao'],
];

export function buscarLugar(texto) {
  const pos = re => { const m = texto.match(re); return m ? m.index : -1; };
  const ciudades = CIUDADES.map(([re, nombre, lat, lng]) => ({ nombre, lat, lng, i: pos(re) })).filter(c => c.i >= 0).sort((a, b) => a.i - b.i);
  const nombres = new Set(ciudades.map(c => c.nombre));
  for (const [re, nombre, lat, lng, ciudad] of SITIOS) {
    if (re.test(texto) && (nombres.size === 0 || nombres.has(ciudad))) return { nombre, lat, lng };
  }
  return ciudades.length ? { nombre: ciudades[0].nombre, lat: ciudades[0].lat, lng: ciudades[0].lng } : null;
}
