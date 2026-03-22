export interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  avatar: string;
  estado: 'Activo' | 'Inactivo';
  ultimaInteraccion: string;
  ciudad?: string;
  email?: string;
  telefono?: string;
}

export type EtapaTrato = 'Prospecto' | 'Negociación' | 'Propuesta' | 'Cerrado';

export interface Trato {
  id: string;
  nombre: string;
  monto: number;
  etapa: EtapaTrato;
  clienteId: string;
  empresa: string;
}

export interface Kpi {
  titulo: string;
  valor: string | number;
  tendencia: number;
  icono: string;
}
