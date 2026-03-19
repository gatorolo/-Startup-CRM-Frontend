import { Component, OnInit } from '@angular/core';
import { DataService } from './services/mock-data.service';
import { Trato, EtapaTrato } from './models/models';

@Component({
  selector: 'app-kanban-board',
  template: `
    <div class="bg-sagrada-bg min-h-[600px] rounded-xl">
      <div class="p-6 border-b border-[#d5c3af] bg-sagrada-paper rounded-t-xl flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-sagrada-purple-dark">Pipeline de Ventas</h2>
          <p class="text-sm text-slate-500 mt-1">Arrastra y suelta oportunidades (Próximamente)</p>
        </div>
        <button class="bg-sagrada-purple hover:bg-sagrada-purple-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Añadir Trato
        </button>
      </div>

      <!-- Contenedor Flex para las Columnas del Kanban -->
      <div class="p-6 flex gap-6 overflow-x-auto pb-8 items-start">
        
        <!-- Iteramos sobre nuestras columnas definidas -->
        <div *ngFor="let columna of columnas" class="flex-1 min-w-[240px] bg-sagrada-paper/60 rounded-xl p-4 border border-[#d5c3af]/60">
          
          <!-- Cabecera de Columna -->
          <div class="flex justify-between items-center mb-4 px-1">
            <h3 class="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" [ngClass]="columna.color"></span>
              {{ columna.nombre }}
            </h3>
            <span class="bg-sagrada-bg text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
              {{ getTratosPorEtapa(columna.nombre).length }}
            </span>
          </div>

          <!-- Lista de Tarjetas (Oportunidades) -->
          <div class="space-y-3">
            <div *ngFor="let trato of getTratosPorEtapa(columna.nombre)" 
                 class="bg-sagrada-paper p-4 rounded-xl shadow-sm border border-[#d5c3af] hover:shadow-md hover:border-sagrada-gold transition-all cursor-pointer group">
              
              <!-- Empresa y Opciones -->
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold tracking-wide text-slate-400 uppercase">{{ trato.empresa }}</span>
                <button class="text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                </button>
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
            <div *ngIf="getTratosPorEtapa(columna.nombre).length === 0" 
                 class="border-2 border-dashed border-[#d5c3af] rounded-xl p-6 flex flex-col items-center justify-center text-slate-400">
              <span class="text-xs font-medium">Sin tratos</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class KanbanBoardComponent implements OnInit {
  
  tratos: Trato[] = [];
  
  // Definimos la configuración visual de nuestras columnas
  columnas: { nombre: EtapaTrato, color: string }[] = [
    { nombre: 'Prospecto', color: 'bg-blue-400' },
    { nombre: 'Negociación', color: 'bg-amber-400' },
    { nombre: 'Propuesta', color: 'bg-purple-400' },
    { nombre: 'Cerrado', color: 'bg-emerald-400' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTratos().subscribe({
      next: (data: Trato[]) => {
        this.tratos = data;
      },
      error: (err: any) => console.error("Error cargando tratos", err)
    });
  }

  getTratosPorEtapa(etapa: EtapaTrato): Trato[] {
    return this.tratos.filter(trato => trato.etapa === etapa);
  }
}
