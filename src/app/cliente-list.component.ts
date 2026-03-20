import { Component, OnInit } from '@angular/core';
import { DataService } from './services/mock-data.service';
import { Cliente } from './models/models';
import { NotificationService } from './services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-list',
  template: `
    <div class="bg-sagrada-paper rounded-xl shadow-sm border border-[#efe6d8] overflow-hidden">
      
      <!-- Cabecera de la Tabla & Filtros Rápidos -->
      <div class="p-6 border-b border-[#efe6d8]">
        <h2 class="text-lg font-bold text-sagrada-purple-dark mb-4">Directorio de Clientes</h2>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-end items-center">
          
          <!-- Píldoras de Filtro por Estado -->
          <div class="flex gap-2 w-full sm:w-auto">
            <button 
              (click)="setFiltroEstado('Todos')"
              [ngClass]="filtroEstado === 'Todos' ? 'bg-sagrada-purple text-white' : 'bg-[#e6d9ce] text-sagrada-purple hover:bg-[#d6c4b4]'"
              class="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Todos
            </button>
            <button 
              (click)="setFiltroEstado('Activo')"
              [ngClass]="filtroEstado === 'Activo' ? 'bg-sagrada-gold text-white' : 'bg-[#f0e3d2] text-sagrada-gold hover:bg-[#e6d0a7]'"
              class="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Activos
            </button>
            <button 
              (click)="setFiltroEstado('Inactivo')"
              [ngClass]="filtroEstado === 'Inactivo' ? 'bg-sagrada-purple text-white' : 'bg-[#e6d9ce] text-sagrada-purple hover:bg-[#d6c4b4]'"
              class="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Inactivos
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla Responsive -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-sagrada-bg text-slate-500 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-semibold">Cliente</th>
              <th class="px-6 py-4 font-semibold">Empresa</th>
              <th class="px-6 py-4 font-semibold">Estado</th>
              <th class="px-6 py-4 font-semibold">Última Interacción</th>
              <th class="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr *ngFor="let cliente of getClientesFiltrados()" class="hover:bg-sagrada-bg transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img [src]="cliente.avatar" alt="Avatar" class="w-10 h-10 rounded-full shadow-sm">
                  <div>
                    <p class="font-semibold text-sagrada-purple-dark">{{ cliente.nombre }}</p>
                    <p class="text-xs text-slate-500">ID: {{ cliente.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-600 font-medium">{{ cliente.empresa }}</td>
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  [ngClass]="cliente.estado === 'Activo' ? 'bg-[#e6cc98] text-[#7a5c18]' : 'bg-slate-100 text-slate-600'">
                  {{ cliente.estado }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-500">{{ cliente.ultimaInteraccion | date:'mediumDate' }}</td>
              <td class="px-6 py-4 text-right">
                <!-- Acciones (Visibles solo en hover) -->
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button (click)="enviarWhatsApp(cliente)" title="Enviar WhatsApp" class="text-slate-400 hover:text-emerald-500 transition-colors p-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </button>
                  <button (click)="enviarEmail(cliente)" title="Enviar Email" class="text-slate-400 hover:text-blue-500 transition-colors p-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </button>
                  <button class="text-slate-400 hover:text-slate-600 transition-colors p-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Estado Vacío (Zero State) -->
            <tr *ngIf="getClientesFiltrados().length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                <div class="flex flex-col items-center justify-center">
                  <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                  <p class="text-base font-medium text-slate-600">No se encontraron clientes</p>
                  <p class="text-sm">Intenta ajustar los filtros de búsqueda</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClienteListComponent implements OnInit {
  
  clientes: Cliente[] = [];
  busquedaGlobal: string = '';
  filtroEstado: 'Todos' | 'Activo' | 'Inactivo' = 'Todos';

  constructor(private dataService: DataService, private notifService: NotificationService) {}

  ngOnInit() {
    this.dataService.getClientes().subscribe(data => {
      this.clientes = data;
    });
    this.dataService.busquedaGlobal$.subscribe(term => {
      this.busquedaGlobal = term;
    });
  }

  setFiltroEstado(estado: 'Todos' | 'Activo' | 'Inactivo') {
    this.filtroEstado = estado;
  }

  getClientesFiltrados(): Cliente[] {
    const termGlobal = this.busquedaGlobal.toLowerCase();
    const estado = this.filtroEstado;
    
    return this.clientes.filter(c => {
      const coincideGlobal = c.nombre.toLowerCase().includes(termGlobal) || c.empresa.toLowerCase().includes(termGlobal);
      const coincideEstado = estado === 'Todos' || c.estado === estado;
      
      return coincideGlobal && coincideEstado;
    });
  }

  enviarWhatsApp(cliente: Cliente) {
    this.notifService.sendWhatsApp({ phone: '+5491122334455', message: `Hola ${cliente.nombre}, ¿cómo estás?` }).subscribe(res => {
      Swal.fire('¡Enviado!', `WhatsApp enviado a ${cliente.nombre}`, 'success');
    });
  }

  enviarEmail(cliente: Cliente) {
    this.notifService.sendEmail({ to: 'fake@email.com', subject: 'Contacto CRM', body: `Hola ${cliente.nombre}...` }).subscribe(res => {
      Swal.fire('¡Enviado!', `Email enviado a ${cliente.nombre}`, 'success');
    });
  }
}
