import { Component, OnInit } from '@angular/core';
import { Kpi } from 'src/app/models/models';
import { DataService } from 'src/app/services/mock-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  kpis: Kpi[] = [];

  // El servicio ahora se inyecta aquí
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getKpis().subscribe(data => {
      this.kpis = data;
    });
  }

}
