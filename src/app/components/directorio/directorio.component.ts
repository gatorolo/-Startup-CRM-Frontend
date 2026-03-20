import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/mock-data.service';
import { Cliente } from '../../models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  busquedaGlobal: string = '';
  mostrarModalNuevoCliente: boolean = false;
  clienteSeleccionado: Cliente | null = null;
  
  nuevoClienteData = {
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    estado: 'Activo' as const
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getClientes().subscribe(data => {
      this.clientes = data;
      this.aplicarFiltro();
    });
    this.dataService.busquedaGlobal$.subscribe(term => {
      this.busquedaGlobal = term;
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    const term = this.busquedaGlobal.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c => 
      c.nombre.toLowerCase().includes(term) || c.empresa.toLowerCase().includes(term)
    );
  }

  abrirModalNuevoCliente() {
    this.mostrarModalNuevoCliente = true;
    this.nuevoClienteData = { nombre: '', empresa: '', email: '', telefono: '', estado: 'Activo' };
  }

  cerrarModalNuevoCliente() {
    this.mostrarModalNuevoCliente = false;
  }

  guardarNuevoCliente() {
    if (!this.nuevoClienteData.nombre || !this.nuevoClienteData.empresa) {
      Swal.fire('Error', 'Nombre y Empresa son campos obligatorios para agendar un cliente', 'error');
      return;
    }

    const nuevo: Cliente = {
      id: Math.random().toString(36).substr(2, 9),
      nombre: this.nuevoClienteData.nombre,
      empresa: this.nuevoClienteData.empresa,
      email: this.nuevoClienteData.email,
      telefono: this.nuevoClienteData.telefono,
      estado: this.nuevoClienteData.estado,
      avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
      ultimaInteraccion: new Date().toISOString().split('T')[0]
    };

    this.dataService.addCliente(nuevo);
    this.cerrarModalNuevoCliente();
    Swal.fire('¡Cliente Agendado!', `${nuevo.nombre} ha sido añadido al directorio exitosamente.`, 'success');
  }

  verDetalleCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
  }

  cerrarDetalleCliente() {
    this.clienteSeleccionado = null;
  }
}
