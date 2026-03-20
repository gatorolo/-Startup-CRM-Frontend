import { Component, OnInit } from '@angular/core';
import { DataService } from './services/mock-data.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Trato, EtapaTrato, Cliente } from './models/models';
import { NotificationService } from './services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kanban-board',
  template: `
    <div class="bg-sagrada-bg min-h-[600px] rounded-xl">
      <div class="p-6 border-b border-[#d5c3af] bg-sagrada-paper rounded-t-xl flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-sagrada-purple-dark">Pipeline de Ventas</h2>
          <p class="text-sm text-slate-500 mt-1">Arrastra y suelta oportunidades para avanzar en el pipeline</p>
        </div>
        <button (click)="abrirModalTrato()" class="bg-sagrada-purple hover:bg-sagrada-purple-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          + Añadir Trato
        </button>
      </div>

      <!-- Contenedor Flex para las Columnas del Kanban -->
      <div cdkDropListGroup class="p-4 flex gap-3 overflow-x-auto pb-8 items-start">
        
        <!-- Iteramos sobre nuestras columnas definidas -->
        <div *ngFor="let columna of columnas" class="flex-1 min-w-[160px] lg:min-w-[200px] xl:min-w-[240px] bg-sagrada-paper/60 rounded-xl p-3 border border-[#d5c3af]/60">
          
          <!-- Cabecera de Columna -->
          <div class="flex justify-between items-center mb-4 px-1">
            <h3 class="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" [ngClass]="columna.color"></span>
              {{ columna.nombre }}
            </h3>
            <span class="bg-sagrada-bg text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
              {{ tratosPorEtapa[columna.nombre].length }}
            </span>
          </div>

          <!-- Lista de Tarjetas (Oportunidades) -->
          <div class="space-y-3 min-h-[150px]"
               cdkDropList
               [cdkDropListData]="tratosPorEtapa[columna.nombre]"
               (cdkDropListDropped)="drop($event, columna.nombre)">
            <div *ngFor="let trato of tratosPorEtapa[columna.nombre]" 
                 cdkDrag
                 class="bg-sagrada-paper p-4 rounded-xl shadow-sm border border-[#d5c3af] cursor-grab active:cursor-grabbing hover:shadow-md hover:border-sagrada-gold transition-all group max-w-full">
              
              <!-- Placeholder Mágico durante Drag -->
              <div *cdkDragPlaceholder class="bg-slate-100/50 border-2 border-dashed border-[#d5c3af] rounded-xl h-24"></div>

              <!-- Empresa y Opciones -->
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold tracking-wide text-slate-400 uppercase">{{ trato.empresa }}</span>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button (click)="enviarWhatsApp(trato)" title="Enviar WhatsApp" class="text-slate-300 hover:text-emerald-500 transition-colors p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </button>
                  <button (click)="enviarEmail(trato)" title="Enviar Email" class="text-slate-300 hover:text-blue-500 transition-colors p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </button>
                </div>
              </div>

              <!-- Nombre del Trato -->
              <h4 class="font-semibold text-sagrada-purple-dark leading-tight mb-3">
                {{ trato.nombre }}
              </h4>

              <!-- Monto y Separador -->
              <div class="pt-3 border-t border-[#eee4d8] flex justify-between items-center">
                <span class="text-slate-500 text-xs font-medium">Monto estimado</span>
                <span class="font-bold text-sagrada-purple-dark bg-[#e6cc98] text-[#7a5c18] px-2 py-1 rounded-md text-sm">
                  {{ trato.monto | currency:'USD':'symbol':'1.0-0' }}
                </span>
              </div>
            </div>

            <!-- Estado Vacío por Columna -->
            <div *ngIf="tratosPorEtapa[columna.nombre].length === 0" 
                 class="border-2 border-dashed border-transparent rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
              <span class="text-xs font-medium">Arrastra aquí</span>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- Modal Nuevo Trato -->
    <div *ngIf="mostrarModalNuevoTrato" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div class="bg-sagrada-bg p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-sagrada-purple-dark">Nuevo Trato</h3>
          <button (click)="cerrarModalTrato()" class="text-slate-400 hover:text-slate-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label for="dealName" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre del Trato</label>
            <input id="dealName" name="dealName" type="text" [(ngModel)]="nuevoTrato.nombre" placeholder="Ej. Renovación Licencias" class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-sagrada-purple focus:ring-1 focus:ring-sagrada-purple outline-none">
          </div>
          <div class="relative">
            <label for="dealClient" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cliente Asociado</label>
            
            <!-- Input Buscador Custom -->
            <div class="relative">
              <input id="dealClient" type="text" 
                     autocomplete="off"
                     [(ngModel)]="busquedaClienteModal" 
                     (focus)="mostrarDropdownClientes = true"
                     (input)="mostrarDropdownClientes = true"
                     placeholder="Escribe para buscar un cliente..." 
                     class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:border-sagrada-purple focus:ring-1 focus:ring-sagrada-purple outline-none bg-white transition-all">
              <svg class="w-4 h-4 absolute left-4 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              
              <!-- Botón Limpiar x -->
              <button *ngIf="nuevoTrato.clienteId" (click)="limpiarClienteModal()" class="absolute right-3 top-2.5 text-slate-400 hover:text-red-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <!-- Dropdown Resultados (Absoluto) -->
            <ul *ngIf="mostrarDropdownClientes" 
                class="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto divide-y divide-slate-100">
              <li *ngIf="getClientesFiltradosModal().length === 0" class="p-4 text-center text-sm text-slate-500">
                No se encontraron coincidencias.
              </li>
              <li *ngFor="let cliente of getClientesFiltradosModal()" 
                  (click)="seleccionarClienteModal(cliente)"
                  class="p-3 hover:bg-sagrada-bg cursor-pointer transition-colors flex items-center gap-3">
                <img [src]="cliente.avatar || 'https://i.pravatar.cc/150?img=11'" class="w-8 h-8 rounded-full border border-slate-200">
                <div>
                  <p class="text-sm font-bold text-sagrada-purple-dark leading-none">{{ cliente.nombre }}</p>
                  <p class="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">{{ cliente.empresa }}</p>
                </div>
              </li>
            </ul>
            
            <!-- Backdrop Invisible para cerrar dropdown al hacer click afuera (Aproximación simple sin directives) -->
            <div *ngIf="mostrarDropdownClientes" (click)="mostrarDropdownClientes = false" class="fixed inset-0 z-0"></div>
          </div>
          <div>
            <label for="dealAmount" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Monto Estimado (USD)</label>
            <input id="dealAmount" name="dealAmount" type="number" [(ngModel)]="nuevoTrato.monto" placeholder="Ej. 15000" class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-sagrada-purple focus:ring-1 focus:ring-sagrada-purple outline-none">
          </div>
          <div>
            <label for="dealStage" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Etapa Inicial</label>
            <select id="dealStage" name="dealStage" [(ngModel)]="nuevoTrato.etapa" class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-sagrada-purple focus:ring-1 focus:ring-sagrada-purple outline-none bg-white">
              <option *ngFor="let col of columnas" [value]="col.nombre">{{ col.nombre }}</option>
            </select>
          </div>
          
          <div class="pt-4 flex gap-3 justify-end">
            <button (click)="cerrarModalTrato()" class="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
            <button (click)="guardarTrato()" [disabled]="!nuevoTrato.nombre || !nuevoTrato.clienteId || !nuevoTrato.monto" class="px-5 py-2 rounded-xl bg-sagrada-purple hover:bg-sagrada-purple-dark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">Guardar Trato</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class KanbanBoardComponent implements OnInit {
  
  tratosPorEtapa: Record<EtapaTrato, Trato[]> = {
    'Prospecto': [],
    'Negociación': [],
    'Propuesta': [],
    'Cerrado': []
  };
  
  // Definimos la configuración visual de nuestras columnas
  columnas: { nombre: EtapaTrato, color: string }[] = [
    { nombre: 'Prospecto', color: 'bg-blue-400' },
    { nombre: 'Negociación', color: 'bg-amber-400' },
    { nombre: 'Propuesta', color: 'bg-purple-400' },
    { nombre: 'Cerrado', color: 'bg-emerald-400' }
  ];

  clientes: Cliente[] = [];
  
  // Estado para el Dropdown Autocomplete de Clientes
  busquedaClienteModal: string = '';
  mostrarDropdownClientes: boolean = false;

  mostrarModalNuevoTrato: boolean = false;
  nuevoTrato: Partial<Trato> = {
    nombre: '',
    clienteId: '',
    monto: 0,
    etapa: 'Prospecto'
  };

  constructor(private dataService: DataService, private notifService: NotificationService) {}

  ngOnInit(): void {
    this.dataService.getTratos().subscribe({
      next: (data: Trato[]) => {
        // Mapeamos los datos limpios a cada columna
        this.columnas.forEach(col => {
          this.tratosPorEtapa[col.nombre] = data.filter(t => t.etapa === col.nombre);
        });
      },
      error: (err: any) => console.error("Error cargando tratos", err)
    });

    // Cargar todos los clientes del backend (mock o real) para el combobox
    this.dataService.getClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  drop(event: CdkDragDrop<Trato[]>, etapaDestino: string) {
    if (event.previousContainer === event.container) {
      // Reordenar en la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Mover a otra columna
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      // Informar al backend del cambio de etapa
      const tratoMovido = event.container.data[event.currentIndex];
      this.dataService.updateTratoEtapa(tratoMovido.id, etapaDestino as EtapaTrato);
    }
  }

  abrirModalTrato() {
    this.nuevoTrato = { nombre: '', clienteId: '', monto: null as any, etapa: 'Prospecto' };
    this.busquedaClienteModal = '';
    this.mostrarDropdownClientes = false;
    this.mostrarModalNuevoTrato = true;
  }

  cerrarModalTrato() {
    this.mostrarModalNuevoTrato = false;
    this.mostrarDropdownClientes = false;
  }

  getClientesFiltradosModal(): Cliente[] {
    const search = this.busquedaClienteModal.toLowerCase();
    if (!search) return this.clientes;
    return this.clientes.filter(c => 
      c.nombre.toLowerCase().includes(search) || 
      c.empresa.toLowerCase().includes(search)
    );
  }

  seleccionarClienteModal(cliente: Cliente) {
    this.nuevoTrato.clienteId = cliente.id;
    this.busquedaClienteModal = `${cliente.nombre} (${cliente.empresa})`;
    this.mostrarDropdownClientes = false;
  }

  limpiarClienteModal() {
    this.nuevoTrato.clienteId = '';
    this.busquedaClienteModal = '';
    this.mostrarDropdownClientes = true; 
  }

  guardarTrato() {
    if (this.nuevoTrato.nombre && this.nuevoTrato.clienteId && this.nuevoTrato.monto) {
      
      const clienteSeleccionado = this.clientes.find(c => c.id === this.nuevoTrato.clienteId);
      const nombreEmpresa = clienteSeleccionado ? clienteSeleccionado.empresa : 'Empresa Desconocida';

      const nuevo: Trato = {
        id: 'T' + Math.floor(Math.random() * 10000).toString(),
        nombre: this.nuevoTrato.nombre,
        empresa: nombreEmpresa,
        monto: this.nuevoTrato.monto,
        etapa: this.nuevoTrato.etapa as EtapaTrato,
        clienteId: this.nuevoTrato.clienteId
      };
      this.dataService.addTrato(nuevo);
      this.cerrarModalTrato();
      Swal.fire('¡Creado!', 'El trato ha sido añadido al Pipeline', 'success');
    }
  }

  enviarWhatsApp(trato: Trato) {
    this.notifService.sendWhatsApp({ phone: '+5491122334455', message: `Acerca del trato: ${trato.nombre}` }).subscribe(res => {
      Swal.fire('¡Enviado!', `WhatsApp enviado por el trato con ${trato.empresa}`, 'success');
    });
  }

  enviarEmail(trato: Trato) {
    this.notifService.sendEmail({ to: 'fake@email.com', subject: 'Actualización de trato', body: `Novedades sobre el trato: ${trato.nombre}` }).subscribe(res => {
      Swal.fire('¡Enviado!', `Email enviado por el trato con ${trato.empresa}`, 'success');
    });
  }
}
