import { Injectable } from '@angular/core';
import { Cliente, Trato } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Exporta un array de Clientes a CSV y dispara la descarga automática.
   */
  exportarClientesCSV(clientes: Cliente[]): void {
    const encabezados = ['ID', 'Nombre', 'Empresa', 'Ciudad', 'Estado', 'Email', 'Teléfono', 'Última Interacción'];

    const filas = clientes.map(cliente => [
      cliente.id,
      cliente.nombre,
      cliente.empresa,
      cliente.ciudad || '',
      cliente.estado,
      cliente.email || '',
      cliente.telefono || '',
      cliente.ultimaInteraccion
    ]);

    const csv = this.generarCSV(encabezados, filas);
    this.descargarArchivo(csv, 'clientes_sagrada_madre.csv');
  }

  /**
   * Exporta un array de Tratos a CSV y dispara la descarga automática.
   */
  exportarTratosCSV(tratos: Trato[]): void {
    const encabezados = ['ID', 'Nombre', 'Empresa', 'Etapa', 'Monto (USD)'];

    const filas = tratos.map(trato => [
      trato.id,
      trato.nombre,
      trato.empresa,
      trato.etapa,
      trato.monto.toString()
    ]);

    const csv = this.generarCSV(encabezados, filas);
    this.descargarArchivo(csv, 'tratos_sagrada_madre.csv');
  }

  /**
   * Genera el string CSV completo a partir de encabezados y filas.
   * Escapa comas y comillas dentro de los valores.
   */
  private generarCSV(encabezados: string[], filas: string[][]): string {
    const escaparCelda = (valor: string): string => {
      if (valor.includes(',') || valor.includes('"') || valor.includes('\n')) {
        return '"' + valor.replace(/"/g, '""') + '"';
      }
      return valor;
    };

    const lineas: string[] = [];
    lineas.push(encabezados.map(escaparCelda).join(','));

    for (const fila of filas) {
      lineas.push(fila.map(escaparCelda).join(','));
    }

    return lineas.join('\n');
  }

  /**
   * Crea un Blob con el contenido CSV y dispara la descarga del archivo.
   * Usa BOM UTF-8 para que Excel reconozca tildes y ñ correctamente.
   */
  private descargarArchivo(contenido: string, nombreArchivo: string): void {
    const bom = '\uFEFF'; // BOM UTF-8 para Excel
    const blob = new Blob([bom + contenido], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.style.display = 'none';

    document.body.appendChild(enlace);
    enlace.click();

    // Limpieza
    document.body.removeChild(enlace);
    window.URL.revokeObjectURL(url);
  }
}
