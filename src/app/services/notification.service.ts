import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface WhatsAppPayload {
  phone: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/api';
  
  // Estado global de notificaciones visuales
  private notificationsSource = new BehaviorSubject<AppNotification[]>([
    {
      id: '1',
      title: '¡Bienvenido al CRM!',
      message: 'Las notificaciones del sistema aparecerán aquí.',
      date: new Date(),
      read: false,
      type: 'info'
    }
  ]);
  public notifications$ = this.notificationsSource.asObservable();

  constructor(private http: HttpClient) { }

  addNotification(title: string, message: string, type: 'info' | 'success' | 'warning' = 'info'): void {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      date: new Date(),
      read: false,
      type
    };
    
    // Agregamos al principio de la lista
    const current = this.notificationsSource.getValue();
    this.notificationsSource.next([newNotif, ...current]);
  }

  markAllAsRead(): void {
    const current = this.notificationsSource.getValue().map(n => ({...n, read: true}));
    this.notificationsSource.next(current);
  }

  markAsRead(id: string): void {
    const current = this.notificationsSource.getValue().map(n => n.id === id ? {...n, read: true} : n);
    this.notificationsSource.next(current);
  }

  playSuccessSound(): void {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); 
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); 
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio no soportado', e);
    }
  }


  sendEmail(payload: EmailPayload): Observable<any> {
    console.log('📬 [MOCK] Solicitud de envío de Email enviada:', payload);


    return of({ success: true, message: 'Email enviado exitosamente (Mock)' }).pipe(
      delay(1500),
      tap(response => {
        console.log('✅ [MOCK] Respuesta del servidor Email:', response);
        this.addNotification('Correo Enviado', `Se ha enviado el correo Mock = ${payload.to}`, 'success');
        this.playSuccessSound();
      })
    );

  }


  sendWhatsApp(payload: WhatsAppPayload): Observable<any> {
    console.log('💬 [MOCK] Solicitud de envío de WhatsApp enviada:', payload);


    return of({ success: true, message: 'WhatsApp enviado exitosamente (Mock)' }).pipe(
      delay(1500),
      tap(response => {
        console.log('✅ [MOCK] Respuesta del servidor WhatsApp:', response);
        this.addNotification('WhatsApp Enviado', `Se ha enviado un WhatsApp Mock a ${payload.phone}`, 'success');
        this.playSuccessSound();
      })
    );


  }
}
