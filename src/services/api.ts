export interface Lugar {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  lat: number;
  lng: number;
  distrito: string;
  horario: string;
  precio_entrada: string;
  imagen_url: string;
  fuente: string;
  verificado: number;
  estado: string;
}

export interface Gastronomia {
  id: number;
  nombre: string;
  tipo: string;
  ubicacion: string;
  precio_rango: string;
  imagen_url: string;
  distrito: string;
  descripcion: string;
  rating: number;
  lat: number;
  lng: number;
}

export interface Evento {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  lugar_id?: number;
  lugar_nombre?: string;
  tipo: string;
  descripcion: string;
}

export interface DashboardResumen {
  totales: {
    lugares: number;
    gastronomia: number;
    eventos: number;
    encuestas: number;
    verificados: number;
  };
  avg_satisfaccion: number;
  por_categoria: { categoria: string; total: number }[];
  por_distrito: { distrito: string; total: number }[];
  lugares_mapa: Lugar[];
  gastro_mapa: Gastronomia[];
  proximos_eventos: Evento[];
}

export async function fetchDashboard(): Promise<DashboardResumen> {
  const res = await fetch('/api/dashboard');
  if (!res.ok) throw new Error('Error al cargar dashboard');
  return res.json();
}

export async function fetchLugares(query?: { distrito?: string; categoria?: string; search?: string }): Promise<Lugar[]> {
  const params = new URLSearchParams();
  if (query?.distrito) params.append('distrito', query.distrito);
  if (query?.categoria) params.append('categoria', query.categoria);
  if (query?.search) params.append('search', query.search);
  
  const res = await fetch(`/api/lugares?${params.toString()}`);
  if (!res.ok) throw new Error('Error al cargar lugares');
  const json = await res.json();
  return json.data || [];
}

export async function fetchGastronomia(): Promise<Gastronomia[]> {
  const res = await fetch('/api/gastronomia');
  if (!res.ok) throw new Error('Error al cargar gastronomía');
  const json = await res.json();
  return json.data || [];
}

export async function fetchEventos(): Promise<Evento[]> {
  const res = await fetch('/api/eventos');
  if (!res.ok) throw new Error('Error al cargar eventos');
  const json = await res.json();
  return json.data || [];
}

export async function submitEncuesta(data: {
  origen: string;
  fecha_visita?: string;
  motivo: string;
  gasto_promedio?: number;
  satisfaccion: number;
  lugares_visitados?: string[];
  medio_transporte?: string;
  dias_estancia?: number;
}): Promise<{ id: number; message: string }> {
  const res = await fetch('/api/encuestas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al enviar encuesta');
  return res.json();
}

export async function createLugar(data: Partial<Lugar>): Promise<{ id: number; message: string }> {
  const res = await fetch('/api/lugares', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear lugar');
  return res.json();
}
