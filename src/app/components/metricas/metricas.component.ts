import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/mock-data.service';
import { ExportService } from '../../services/export.service';
import { Trato, Cliente, EtapaTrato } from '../../models/models';

interface MetricaKpi {
  titulo: string;
  valor: string;
  tendencia: number;
  icono: string;
  color: string;
}

interface EtapaFunnel {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  monto: number;
  color: string;
}

interface ActividadReciente {
  descripcion: string;
  fecha: string;
  tipo: 'trato' | 'cliente' | 'etapa';
  icono: string;
}

@Component({
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.css']
})
export class MetricasComponent implements OnInit {

  kpis: MetricaKpi[] = [];
  etapasFunnel: EtapaFunnel[] = [];
  topTratos: Trato[] = [];
  clientesActivos: { cliente: Cliente; cantidadTratos: number; montoTotal: number }[] = [];
  actividades: ActividadReciente[] = [];

  private tratos: Trato[] = [];
  private clientes: Cliente[] = [];

  etapasOrden: EtapaTrato[] = ['Prospecto', 'Negociación', 'Propuesta', 'Cerrado'];
  etapasColores: Record<string, string> = {
    'Prospecto': 'bg-blue-500',
    'Negociación': 'bg-amber-500',
    'Propuesta': 'bg-purple-500',
    'Cerrado': 'bg-emerald-500'
  };

  constructor(
    private dataService: DataService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.dataService.getTratos().subscribe(tratos => {
      this.tratos = tratos;
      this.dataService.getClientes().subscribe(clientes => {
        this.clientes = clientes;
        this.calcularTodo();
      });
    });
  }

  private calcularTodo(): void {
    this.calcularKpis();
    this.calcularFunnel();
    this.calcularTopTratos();
    this.calcularClientesActivos();
    this.generarActividades();
  }

  private calcularKpis(): void {
    const totalTratos = this.tratos.length;
    const tratosCerrados = this.tratos.filter(t => t.etapa === 'Cerrado');
    const montoPipeline = this.tratos.reduce((sum, t) => sum + t.monto, 0);
    const montoGanado = tratosCerrados.reduce((sum, t) => sum + t.monto, 0);
    const ticketPromedio = totalTratos > 0 ? Math.round(montoPipeline / totalTratos) : 0;
    const tasaConversion = totalTratos > 0 ? Math.round((tratosCerrados.length / totalTratos) * 100) : 0;

    this.kpis = [
      {
        titulo: 'Pipeline Total',
        valor: '$' + montoPipeline.toLocaleString('en-US'),
        tendencia: 12.5,
        icono: 'pipeline',
        color: 'from-blue-500 to-blue-600'
      },
      {
        titulo: 'Ingresos Cerrados',
        valor: '$' + montoGanado.toLocaleString('en-US'),
        tendencia: 8.3,
        icono: 'revenue',
        color: 'from-emerald-500 to-emerald-600'
      },
      {
        titulo: 'Ticket Promedio',
        valor: '$' + ticketPromedio.toLocaleString('en-US'),
        tendencia: 3.7,
        icono: 'ticket',
        color: 'from-purple-500 to-purple-600'
      },
      {
        titulo: 'Tasa de Conversión',
        valor: tasaConversion + '%',
        tendencia: tasaConversion > 15 ? 5.2 : -1.8,
        icono: 'conversion',
        color: 'from-amber-500 to-amber-600'
      }
    ];
  }

  private calcularFunnel(): void {
    const totalTratos = this.tratos.length;
    this.etapasFunnel = this.etapasOrden.map(etapa => {
      const tratosEtapa = this.tratos.filter(t => t.etapa === etapa);
      const monto = tratosEtapa.reduce((sum, t) => sum + t.monto, 0);
      return {
        nombre: etapa,
        cantidad: tratosEtapa.length,
        porcentaje: totalTratos > 0 ? Math.round((tratosEtapa.length / totalTratos) * 100) : 0,
        monto: monto,
        color: this.etapasColores[etapa]
      };
    });
  }

  private calcularTopTratos(): void {
    this.topTratos = [...this.tratos]
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5);
  }

  private calcularClientesActivos(): void {
    const clienteMap = new Map<string, { cliente: Cliente; cantidadTratos: number; montoTotal: number }>();

    this.tratos.forEach(trato => {
      const cliente = this.clientes.find(c => c.id === trato.clienteId);
      if (cliente) {
        if (clienteMap.has(cliente.id)) {
          const entry = clienteMap.get(cliente.id)!;
          entry.cantidadTratos++;
          entry.montoTotal += trato.monto;
        } else {
          clienteMap.set(cliente.id, {
            cliente: cliente,
            cantidadTratos: 1,
            montoTotal: trato.monto
          });
        }
      }
    });

    this.clientesActivos = Array.from(clienteMap.values())
      .sort((a, b) => b.montoTotal - a.montoTotal)
      .slice(0, 5);
  }

  private generarActividades(): void {
    this.actividades = [
      { descripcion: 'Trato "Implementación CRM" cerrado con EcoEnergies', fecha: 'Hace 2 horas', tipo: 'trato', icono: '🎉' },
      { descripcion: 'Nuevo prospecto: Auditoría de Seguridad con TechCorp', fecha: 'Hace 5 horas', tipo: 'trato', icono: '🆕' },
      { descripcion: 'Elena Mora actualizada a estado Activo', fecha: 'Hace 1 día', tipo: 'cliente', icono: '✅' },
      { descripcion: 'Trato "Expansión Servidores" movido a Negociación', fecha: 'Hace 1 día', tipo: 'etapa', icono: '🔄' },
      { descripcion: 'Consultoría Q4 con Finanza Startup avanza a Propuesta', fecha: 'Hace 2 días', tipo: 'etapa', icono: '📋' },
      { descripcion: 'Nuevo cliente David Silva registrado', fecha: 'Hace 3 días', tipo: 'cliente', icono: '👤' },
    ];
  }

  getMaxMontoPipeline(): number {
    if (this.etapasFunnel.length === 0) return 1;
    return Math.max(...this.etapasFunnel.map(e => e.monto));
  }

  getBarWidth(monto: number): number {
    const max = this.getMaxMontoPipeline();
    return max > 0 ? Math.round((monto / max) * 100) : 0;
  }

  getFunnelWidth(index: number): number {
    // El funnel va de 100% (arriba) hasta 30% (abajo)
    const total = this.etapasFunnel.length;
    if (total === 0) return 100;
    return 100 - (index * (70 / (total - 1 || 1)));
  }

  getEtapaBadgeClass(etapa: string): string {
    const clases: Record<string, string> = {
      'Prospecto': 'bg-blue-100 text-blue-700',
      'Negociación': 'bg-amber-100 text-amber-700',
      'Propuesta': 'bg-purple-100 text-purple-700',
      'Cerrado': 'bg-emerald-100 text-emerald-700'
    };
    return clases[etapa] || 'bg-slate-100 text-slate-700';
  }

  // ==== FUNCIONES DE EXPORTACIÓN E IMPRESIÓN ====

  exportarDatos(): void {
    if (this.tratos.length === 0) return;
    this.exportService.exportarTratosCSV(this.tratos);
  }

  imprimirDashboard(): void {
    window.print();
  }
}
