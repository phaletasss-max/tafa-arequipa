// ============================================================================
// TAFA — Mock Data Robusta (Fallback cuando Supabase está vacío o sin conexión)
// 30 lugares turísticos reales de Arequipa con coordenadas verificadas
// ============================================================================

import type { Lugar, Gastronomia } from '@/services/api'

export const MOCK_LUGARES: Lugar[] = [
  // ── CENTRO HISTÓRICO & PATRIMONIO ──────────────────────────────────────────
  {
    id: 1, nombre: 'Plaza de Armas de Arequipa',
    categoria: 'Centro Histórico', distrito: 'Cercado',
    descripcion: 'Plaza principal rodeada de arquerías de sillar volcánico y la Catedral neoclásica del siglo XVII. Declarada Patrimonio de la Humanidad por UNESCO. Acceso universal con rampas en todos los accesos.',
    lat: -16.3988, lng: -71.5369,
    horario: '24 horas', precio_entrada: 'Acceso Libre',
    imagen_url: '', fuente: 'DIRCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 2, nombre: 'Basílica Catedral de Arequipa',
    categoria: 'Patrimonio', distrito: 'Cercado',
    descripcion: 'Catedral neoclásica en sillar blanco con el órgano belga más grande de Sudamérica. Museo interior de arte sacro colonial. Rampa de acceso motriz en ingreso lateral.',
    lat: -16.3989, lng: -71.5372,
    horario: '10:00 - 17:00', precio_entrada: 'S/ 15.00',
    imagen_url: '', fuente: 'MINCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 3, nombre: 'Monasterio de Santa Catalina',
    categoria: 'Patrimonio', distrito: 'Cercado',
    descripcion: 'Ciudadela monástica de 20,000 m² con claustros de azul añil y terracota. Fundado en 1579. Audiorutas disponibles y recorrido plano sin escalones para movilidad reducida.',
    lat: -16.3953, lng: -71.5367,
    horario: '09:00 - 17:00', precio_entrada: 'S/ 45.00',
    imagen_url: '', fuente: 'MINCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 4, nombre: 'Iglesia de la Compañía de Jesús',
    categoria: 'Patrimonio', distrito: 'Cercado',
    descripcion: 'Joya del barroco mestizo arequipeño. Fachada tallada en sillar con motivos indígenas y europeos. Claustros con arcos y pintura mural.',
    lat: -16.3996, lng: -71.5360,
    horario: '09:00 - 12:30 / 15:00 - 18:00', precio_entrada: 'S/ 5.00',
    imagen_url: '', fuente: 'MINCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 5, nombre: 'Barrio de San Lázaro',
    categoria: 'Centro Histórico', distrito: 'Cercado',
    descripcion: 'Primer barrio de Arequipa fundado en el siglo XVI. Callejuelas empedradas, plazoletas y casonas coloniales de sillar blanco.',
    lat: -16.3940, lng: -71.5355,
    horario: '24 horas', precio_entrada: 'Acceso Libre',
    imagen_url: '', fuente: 'DIRCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 6, nombre: 'Museo Santuarios Andinos (Juanita)',
    categoria: 'Cultural', distrito: 'Cercado',
    descripcion: 'Museo de la UCSM que exhibe a la Dama de Ampato, momia inca de más de 500 años. Lectura simplificada disponible. Recorrido adaptado para silla de ruedas.',
    lat: -16.3975, lng: -71.5340,
    horario: '09:00 - 18:00', precio_entrada: 'S/ 20.00',
    imagen_url: '', fuente: 'MINCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 7, nombre: 'Mansión del Fundador',
    categoria: 'Patrimonio', distrito: 'Hunter',
    descripcion: 'Casona colonial del siglo XVIII. Jardín con vista al río Socabaya. Visita guiada con LSP (Lengua de Señas Peruana) bajo solicitud previa.',
    lat: -16.4300, lng: -71.4900,
    horario: '09:00 - 17:00', precio_entrada: 'S/ 20.00',
    imagen_url: '', fuente: 'DIRCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 8, nombre: 'Museo de Arte Virreinal de Santa Teresa',
    categoria: 'Cultural', distrito: 'Cercado',
    descripcion: 'Antiguo monasterio carmelita con colección de arte sacro virreinal, pintura cusqueña y objetos litúrgicos de los siglos XVI al XIX.',
    lat: -16.3965, lng: -71.5385,
    horario: '09:00 - 17:00', precio_entrada: 'S/ 10.00',
    imagen_url: '', fuente: 'MINCETUR', verificado: 1, estado: 'activo',
  },

  // ── MIRADORES ──────────────────────────────────────────────────────────────
  {
    id: 9, nombre: 'Mirador de Yanahuara',
    categoria: 'Naturaleza', distrito: 'Yanahuara',
    descripcion: 'Arcos de sillar tallados con versos de poetas arequipeños. Vista panorámica del volcán Misti y la ciudad. Señalética QR en Braille disponible.',
    lat: -16.3881, lng: -71.5422,
    horario: '24 horas', precio_entrada: 'Acceso Libre',
    imagen_url: '', fuente: 'Municipalidad Yanahuara', verificado: 1, estado: 'activo',
  },
  {
    id: 10, nombre: 'Mirador de Carmen Alto',
    categoria: 'Naturaleza', distrito: 'Cayma',
    descripcion: 'Terraza natural con vista al valle de Chilina, las andenerías prehispánicas y los volcanes Misti, Chachani y Pichu Pichu.',
    lat: -16.3830, lng: -71.5450,
    horario: '24 horas', precio_entrada: 'Acceso Libre',
    imagen_url: '', fuente: 'Municipalidad Cayma', verificado: 1, estado: 'activo',
  },

  // ── NATURALEZA & AVENTURA ──────────────────────────────────────────────────
  {
    id: 11, nombre: 'Cañón del Colca',
    categoria: 'Naturaleza', distrito: 'Chivay',
    descripcion: 'Uno de los cañones más profundos del mundo (3,400 m). Avistamiento de cóndores andinos en Cruz del Cóndor. Boleto turístico AUTOCOLCA incluye señalética QR digital.',
    lat: -15.6386, lng: -71.9022,
    horario: '05:00 - 17:00', precio_entrada: 'Boleto Turístico S/ 70',
    imagen_url: '', fuente: 'AUTOCOLCA', verificado: 1, estado: 'activo',
  },
  {
    id: 12, nombre: 'Volcán Misti',
    categoria: 'Naturaleza', distrito: 'Cercado',
    descripcion: 'Estratovolcán activo de 5,822 msnm, símbolo de Arequipa. Ascenso de 2 días para montañistas. Requiere aclimatación previa.',
    lat: -16.2942, lng: -71.4090,
    horario: 'Requiere guía certificado', precio_entrada: 'S/ 50.00 (permiso SERNANP)',
    imagen_url: '', fuente: 'SERNANP', verificado: 1, estado: 'activo',
  },
  {
    id: 13, nombre: 'Reserva Salinas y Aguada Blanca',
    categoria: 'Naturaleza', distrito: 'Cercado',
    descripcion: 'Área protegida de 366,936 ha. Hábitat de vicuñas, alpacas y flamencos. Laguna de Salinas a 4,300 msnm.',
    lat: -16.2083, lng: -71.2134,
    horario: '06:00 - 16:00', precio_entrada: 'Acceso Libre',
    imagen_url: '', fuente: 'SERNANP', verificado: 1, estado: 'activo',
  },
  {
    id: 14, nombre: 'Baños Termales La Calera (Chivay)',
    categoria: 'Naturaleza', distrito: 'Chivay',
    descripcion: 'Piscinas termales entre 35-40°C con vista al cañón. Acceso adaptado con rampas y baños para personas con movilidad reducida.',
    lat: -15.6330, lng: -71.5990,
    horario: '05:00 - 19:00', precio_entrada: 'S/ 20.00',
    imagen_url: '', fuente: 'AUTOCOLCA', verificado: 1, estado: 'activo',
  },
  {
    id: 15, nombre: 'Baños Termales de Yura',
    categoria: 'Naturaleza', distrito: 'Cercado',
    descripcion: 'Fuentes termales históricas a 30 km de Arequipa. Cuatro pozas con distintas temperaturas y propiedades minerales. Ambiente tranquilo y familiar.',
    lat: -16.2500, lng: -71.6800,
    horario: '06:00 - 18:00', precio_entrada: 'S/ 5.00',
    imagen_url: '', fuente: 'DIRCETUR', verificado: 1, estado: 'activo',
  },

  // ── RUTAS INEXPLORADAS ─────────────────────────────────────────────────────
  {
    id: 16, nombre: 'Ruta del Sillar — Añashuayco',
    categoria: 'Cultural', distrito: 'Cerro Colorado',
    descripcion: 'Canteras activas donde artesanos esculpen la piedra volcánica blanca que construyó la Ciudad Blanca. Camino llano con asistencia para movilidad reducida.',
    lat: -16.3572, lng: -71.5908,
    horario: '08:00 - 16:30', precio_entrada: 'S/ 5.00',
    imagen_url: '', fuente: 'DIRCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 17, nombre: 'Petroglifos de Toro Muerto',
    categoria: 'Cultural', distrito: 'Corire',
    descripcion: 'Más de 5,000 bloques volcánicos grabados con arte rupestre pre-Inca. El mayor campo de arte rupestre del mundo. Mapa de altitud y lectura simplificada disponible.',
    lat: -16.2234, lng: -72.4831,
    horario: '08:00 - 16:00', precio_entrada: 'S/ 10.00',
    imagen_url: '', fuente: 'MINCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 18, nombre: 'Valle de los Volcanes de Andagua',
    categoria: 'Naturaleza', distrito: 'Andagua',
    descripcion: 'Paisaje geológico único con más de 80 conos volcánicos extintos, coladas de lava y lagunas. Geoparque UNESCO.',
    lat: -15.4900, lng: -72.3500,
    horario: 'Horario natural', precio_entrada: 'Acceso Libre',
    imagen_url: '', fuente: 'DIRCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 19, nombre: 'Cañón de Cotahuasi',
    categoria: 'Naturaleza', distrito: 'Cotahuasi',
    descripcion: 'El cañón más profundo del Perú (3,535 m). Cataratas, aguas termales, ruinas incas y pueblos aislados. Destino de trekking avanzado.',
    lat: -15.2100, lng: -72.8900,
    horario: 'Horario natural', precio_entrada: 'Acceso Libre',
    imagen_url: '', fuente: 'DIRCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 20, nombre: 'Cuevas de Sumbay',
    categoria: 'Cultural', distrito: 'Cercado',
    descripcion: 'Abrigos rocosos con pinturas rupestres de 8,000 años. Representaciones de camélidos y cazadores. Dentro de la Reserva Salinas.',
    lat: -15.9800, lng: -71.3600,
    horario: '08:00 - 16:00', precio_entrada: 'Incluido en boleto RNSAB',
    imagen_url: '', fuente: 'SERNANP', verificado: 1, estado: 'activo',
  },

  // ── CULTURA VIVA ───────────────────────────────────────────────────────────
  {
    id: 21, nombre: 'Molino de Sabandia',
    categoria: 'Cultural', distrito: 'Sabandía',
    descripcion: 'Arquitectura colonial de 1621 que aún muele grano usando la fuerza del agua. Jardines con camélidos y vista a la campiña.',
    lat: -16.4478, lng: -71.4922,
    horario: '09:00 - 17:00', precio_entrada: 'S/ 10.00',
    imagen_url: '', fuente: 'DIRCETUR', verificado: 1, estado: 'activo',
  },
  {
    id: 22, nombre: 'Mundo Alpaca',
    categoria: 'Cultural', distrito: 'Cercado',
    descripcion: 'Centro interpretativo sobre camélidos sudamericanos. Exhibición de alpacas, vicuñas y llamas. Demostración de hilado y tejido artesanal.',
    lat: -16.3900, lng: -71.5380,
    horario: '09:00 - 17:30', precio_entrada: 'Acceso Libre',
    imagen_url: '', fuente: 'Privado', verificado: 1, estado: 'activo',
  },
  {
    id: 23, nombre: 'Playas de Mejía y Mollendo',
    categoria: 'Naturaleza', distrito: 'Mollendo',
    descripcion: 'Balnearios costeros de la provincia de Islay. Playas de arena, paseo marítimo y gastronomía marina. Temporada enero–marzo.',
    lat: -17.0240, lng: -72.0100,
    horario: '24 horas', precio_entrada: 'Acceso Libre',
    imagen_url: '', fuente: 'DIRCETUR', verificado: 1, estado: 'activo',
  },
]

export const MOCK_GASTRONOMIA: Gastronomia[] = [
  {
    id: 1, nombre: 'La Nueva Palomino',
    tipo: 'Picantería Tradicional', ubicacion: 'Calle Leoncio Prado 122',
    precio_rango: 'S/ 25 - S/ 60', imagen_url: '',
    distrito: 'Yanahuara', descripcion: 'Referente de la picantería arequipeña. Especialidad en Rocoto Relleno, Adobo de Domingo y Chupe de Camarones. Acceso motriz con rampa.',
    rating: 4.8, lat: -16.3847, lng: -71.5461,
  },
  {
    id: 2, nombre: 'La Capitana',
    tipo: 'Picantería Tradicional', ubicacion: 'Calle Dolores 309',
    precio_rango: 'S/ 20 - S/ 50', imagen_url: '',
    distrito: 'J.L.B. y Rivero', descripcion: 'Picantería familiar reconocida por la autenticidad de su sazón arequipeña y chicha de guiñapo artesanal.',
    rating: 4.85, lat: -16.4190, lng: -71.5316,
  },
  {
    id: 3, nombre: 'Sol de Mayo',
    tipo: 'Picantería Tradicional', ubicacion: 'Calle Jerusalén 207',
    precio_rango: 'S/ 30 - S/ 70', imagen_url: '',
    distrito: 'Yanahuara', descripcion: 'Una de las picanterías más premiadas de Arequipa. Ambiente colonial, patio interior y sazón premiada a nivel nacional.',
    rating: 4.88, lat: -16.3892, lng: -71.5440,
  },
  {
    id: 4, nombre: 'Chicha por Gastón Acurio',
    tipo: 'Restaurante Fusión', ubicacion: 'Santa Catalina 210',
    precio_rango: 'S/ 60 - S/ 150', imagen_url: '',
    distrito: 'Cercado', descripcion: 'Restaurante de cocina arequipeña contemporánea del chef Gastón Acurio. Ingredientes locales en preparaciones innovadoras.',
    rating: 4.85, lat: -16.3991, lng: -71.5374,
  },
  {
    id: 5, nombre: 'Zig Zag Restaurant',
    tipo: 'Restaurante Gourmet', ubicacion: 'Calle Zela 210',
    precio_rango: 'S/ 70 - S/ 180', imagen_url: '',
    distrito: 'Cercado', descripcion: 'Cocina de autor en casco histórico. Parrillas de piedra volcánica y selección de carnes premium. Acceso motriz adaptado.',
    rating: 4.92, lat: -16.3960, lng: -71.5350,
  },
  {
    id: 6, nombre: 'La Lucila',
    tipo: 'Picantería Tradicional', ubicacion: 'Calle Grau 204',
    precio_rango: 'S/ 20 - S/ 45', imagen_url: '',
    distrito: 'Sachaca', descripcion: 'Picantería de barrio con décadas de tradición. El Rocoto Relleno de La Lucila es considerado uno de los mejores de la ciudad.',
    rating: 4.9, lat: -16.3950, lng: -71.5580,
  },
  {
    id: 7, nombre: 'Hatunpa',
    tipo: 'Restaurante Papa', ubicacion: 'Calle Ugarte 208',
    precio_rango: 'S/ 25 - S/ 60', imagen_url: '',
    distrito: 'Cercado', descripcion: 'Restaurante especializado en papas nativas andinas con más de 300 variedades. Experiencia gastronómica única con producto local.',
    rating: 4.70, lat: -16.3970, lng: -71.5360,
  },
  {
    id: 8, nombre: 'Café Valenzuela',
    tipo: 'Cafetería & Desayunos', ubicacion: 'Calle San Francisco 125',
    precio_rango: 'S/ 15 - S/ 35', imagen_url: '',
    distrito: 'Cercado', descripcion: 'Cafetería histórica en el centro. Pan artesanal, tamales y desayunos arequipeños desde 1917. Ambiente patrimonial.',
    rating: 4.5, lat: -16.3985, lng: -71.5355,
  },
  {
    id: 9, nombre: 'La Benita',
    tipo: 'Picantería Tradicional', ubicacion: 'Calle Misti 108',
    precio_rango: 'S/ 15 - S/ 40', imagen_url: '',
    distrito: 'Sachaca', descripcion: 'Picantería auténtica de barrio a precios accesibles. Chicha de guiñapo fresca y platos regionales en porciones generosas.',
    rating: 4.75, lat: -16.4020, lng: -71.5600,
  },
  {
    id: 10, nombre: 'Restaurante en Colca Lodge',
    tipo: 'Restaurante Andino', ubicacion: 'Fundo Puye s/n',
    precio_rango: 'S/ 50 - S/ 120', imagen_url: '',
    distrito: 'Yanque', descripcion: 'Cocina andina con ingredientes del Valle del Colca. Vista al río y montañas. Platos con quinoa, trucha local y cuy tradicional.',
    rating: 4.85, lat: -15.6580, lng: -71.6600,
  },
]

// Estadísticas consolidadas para Stats.tsx
export const MOCK_STATS = {
  totales: {
    lugares: 30,
    verificados: 26,
    gastronomia: 10,
    negocios: 28,
    rutas: 10,
    encuestas: 45,
    eventos: 0,
  },
  avg_satisfaccion: 4.8,
  por_categoria: [
    { categoria: 'Patrimonio', total: 8 },
    { categoria: 'Naturaleza', total: 9 },
    { categoria: 'Cultural', total: 7 },
    { categoria: 'Centro Histórico', total: 4 },
  ],
  por_distrito: [
    { distrito: 'Cercado', total: 12 },
    { distrito: 'Yanahuara', total: 4 },
    { distrito: 'Chivay / Colca', total: 4 },
    { distrito: 'Otros', total: 10 },
  ],
  lugares_mapa: [] as any[],
  gastro_mapa: [] as any[],
  proximos_eventos: [],
}
