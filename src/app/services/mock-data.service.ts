import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cliente, Kpi, Trato, EtapaTrato } from '../models/models';

let MOCK_CLIENTES: Cliente[] = [
  { id: '1', nombre: 'Ana García', empresa: 'TechCorp', avatar: 'https://i.pravatar.cc/150?img=1', estado: 'Activo', ultimaInteraccion: '2023-10-25', email: 'ana@techcorp.com', telefono: '+5491144445555' },
  { id: '2', nombre: 'Carlos Ruiz', empresa: 'Global Logistics', avatar: 'https://i.pravatar.cc/150?img=2', estado: 'Inactivo', ultimaInteraccion: '2023-09-15', email: 'carlos@global.com', telefono: '+5491122223333' },
  { id: '3', nombre: 'Elena Mora', empresa: 'Finanza Startup', avatar: 'https://i.pravatar.cc/150?img=3', estado: 'Activo', ultimaInteraccion: '2023-11-02', email: 'elena@finanza.com' },
  { id: '4', nombre: 'David Silva', empresa: 'EcoEnergies', avatar: 'https://i.pravatar.cc/150?img=4', estado: 'Activo', ultimaInteraccion: '2023-11-10', telefono: '3415109918' }
];

const MOCK_TRATOS: Trato[] = [
  { id: 't1', nombre: 'Renovación Licencias', monto: 15400, etapa: 'Prospecto', clienteId: '1', empresa: 'TechCorp' },
  { id: 't2', nombre: 'Expansión de Servidores', monto: 32000, etapa: 'Negociación', clienteId: '2', empresa: 'Global Logistics' },
  { id: 't3', nombre: 'Consultoría Q4', monto: 8500, etapa: 'Propuesta', clienteId: '3', empresa: 'Finanza Startup' },
  { id: 't4', nombre: 'Implementación CRM', monto: 45000, etapa: 'Cerrado', clienteId: '4', empresa: 'EcoEnergies' },
  { id: 't5', nombre: 'Auditoría de Seguridad', monto: 12000, etapa: 'Negociación', clienteId: '1', empresa: 'TechCorp' },
];

const MOCK_KPIS: Kpi[] = [
  { titulo: 'Total Clientes', valor: 124, tendencia: 12.5, icono: 'users' },
  { titulo: 'Tratos Abiertos', valor: 45, tendencia: 5.2, icono: 'briefcase' },
  { titulo: 'Ingresos Mensuales', valor: '$45,200', tendencia: 8.4, icono: 'dollar-sign' },
  { titulo: 'Tareas Pendientes', valor: 12, tendencia: -2.1, icono: 'check-circle' },
];

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private clientesSubject = new BehaviorSubject<Cliente[]>(MOCK_CLIENTES);
  public clientes$ = this.clientesSubject.asObservable();

  private busquedaGlobalSubject = new BehaviorSubject<string>('');
  public busquedaGlobal$ = this.busquedaGlobalSubject.asObservable();

  private tratosSubject = new BehaviorSubject<Trato[]>(MOCK_TRATOS);
  public tratos$ = this.tratosSubject.asObservable();

  constructor() { }

  getClientes(): Observable<Cliente[]> {
    // Al suscribirse, enviamos la emisión actual con un pequeño delay inicial mockeado
    return this.clientes$.pipe(delay(200));
  }

  addCliente(nuevoCliente: Cliente) {
    const actuales = this.clientesSubject.getValue();
    this.clientesSubject.next([nuevoCliente, ...actuales]);
  }

  getTratos(): Observable<Trato[]> {
    return this.tratos$.pipe(delay(200));
  }

  addTrato(nuevo: Trato) {
    const actuales = this.tratosSubject.getValue();
    this.tratosSubject.next([nuevo, ...actuales]);
  }

  updateTratoEtapa(id: string, etapa: EtapaTrato) {
    const actuales = this.tratosSubject.getValue();
    const index = actuales.findIndex(t => t.id === id);
    if (index !== -1) {
      actuales[index].etapa = etapa;
      this.tratosSubject.next([...actuales]);
    }
  }

  getKpis(): Observable<Kpi[]> {
    return of(MOCK_KPIS).pipe(delay(200));
  }

  setBusquedaGlobal(term: string) {
    this.busquedaGlobalSubject.next(term);
  }
}
