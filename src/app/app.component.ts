import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DataService } from './services/mock-data.service';
import { NotificationService, AppNotification } from './services/notification.service';
import { ThemeService } from './services/theme.service';
import Swal from 'sweetalert2';
import { PhonePipe } from './pipes/phone.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sidebarAbierto: boolean = true;
  isLoggedIn: boolean = false;
  mostrarMenuPerfil: boolean = false;
  
  mostrarNotificaciones: boolean = false;
  unreadCount: number = 0;
  notifications: AppNotification[] = [];
  
  isRegistering: boolean = false;
  nombreAdmin: string = 'Administrador';
  loginData = {
    nombre: '',
    email: 'admin@sagrada.com',
    password: ''
  };
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService, 
    private dataService: DataService, 
    private notifService: NotificationService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.notifService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = notifs.filter(n => !n.read).length;
    });
  }

  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
    if (this.mostrarMenuPerfil) this.mostrarMenuPerfil = false;
  }

  marcarTodoLeido() {
    this.notifService.markAllAsRead();
  }

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebarMobile() {
    if (window.innerWidth < 768) {
      this.sidebarAbierto = false;
    }
  }

  toggleMenuPerfil() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
    if (this.mostrarNotificaciones) this.mostrarNotificaciones = false;
  }

  actualizarBusquedaGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dataService.setBusquedaGlobal(input.value);
  }

  toggleRegister() {
    this.isRegistering = !this.isRegistering;
  }

  doRegister() {
    if (!this.loginData.nombre || !this.loginData.email || !this.loginData.password) {
      Swal.fire('Oops...', 'Por favor completa todos los campos', 'warning');
      return;
    }

    this.isSubmitting = true;

    // Guardar el nombre para que se vea reflejado en el Dashboard
    if (this.loginData.nombre) {
      this.nombreAdmin = this.loginData.nombre;
    }

    setTimeout(() => {
      this.isSubmitting = false;
      Swal.fire({
        icon: 'success',
        title: '¡Administrador Creado!',
        text: 'La estructura para enviarlo al Backend de Spring está lista.',
        confirmButtonColor: '#4A2B65' // sagrada-purple
      });
      // Devolvemos a modo login tras crear
      this.isRegistering = false; 
    }, 1200);
  }

  doLogin() {
    // ENTORNO DE DESARROLLO (MOCK): Acceso directo sin restricciones de credenciales
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.isLoggedIn = true;
    }, 500); // Check rápido animado simulado
  }

  doLogout() {
    this.mostrarMenuPerfil = false;
    this.isLoggedIn = false;
    this.loginData.password = ''; // Limpiamos la contraseña por seguridad
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Sesión cerrada exitosamente',
      showConfirmButton: false,
      timer: 3000
    });
  }

  async configTelefono() {
    this.mostrarMenuPerfil = false;
    const numeroGuardado = localStorage.getItem('whatsapp_phone') || '';

    const { value: telefono } = await Swal.fire({
      title: 'Vincular WhatsApp',
      input: 'text',
      inputValue: numeroGuardado,
      inputLabel: 'Ingresa tu número de teléfono con código de área',
      inputPlaceholder: 'Ej: +54 9 11 1234 5678',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      inputValidator: (value) => {
        if (!value) {
          return '¡Necesitas escribir un número de teléfono!'
        }
        return null;
      }
    });

    if (telefono) {
      // Usamos el PhonePipe "manualmente" para formatear lo que acabas de escribir
      const telefonoFormateado = new PhonePipe().transform(telefono);

      localStorage.setItem('whatsapp_phone', telefonoFormateado);
      // En el futuro, esto hará un POST al backend (ej: this.authService.updatePhone(telefono))
      Swal.fire('Guardado', `Tu número ${telefonoFormateado} ha sido vinculado correctamente para los envíos de WhatsApp.`, 'success');
    }
  }
}
