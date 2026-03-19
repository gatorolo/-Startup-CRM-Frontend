import { Component, OnInit } from '@angular/core';
import { DataService } from './services/mock-data.service';
import { Kpi } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidebarAbierto: boolean = false;

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }
}
