import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  /**
   * Formatea un número crudo (ej: 5491143211234)
   * a un formato legible (+54 9 11 4321-1234).
   */
  transform(value: string | number | undefined | null): string {
    if (!value) return '';

    // Limpiamos cualquier caracter extraño del string
    let cleaned = value.toString().replace(/\D/g, '');

    // Formato Específico para Argentina WhatsApp (13 dígitos que inician en 549)
    // Ejemplo: 549 11 1234 5678
    if (cleaned.length === 13 && cleaned.startsWith('549')) {
      const country = cleaned.slice(0, 2);
      const prefix = cleaned.slice(2, 3);
      const area = cleaned.slice(3, 5);
      const part1 = cleaned.slice(5, 9);
      const part2 = cleaned.slice(9, 13);
      return `+${country} ${prefix} ${area} ${part1}-${part2}`;
    }

    // Formato de 10 dígitos (Ej: 3415109918, típico sin el +549)
    if (cleaned.length === 10) {
      const area = cleaned.slice(0, 3);
      const mid = cleaned.slice(3, 6);
      const last = cleaned.slice(6, 10);
      return `+54 9 ${area} ${mid}-${last}`; // Ej: +54 9 341 510-9918
    }

    // Fallback genérico para otros números
    const match = cleaned.match(/^(\d{1,3})(\d{1,4})?(\d{1,4})?$/);
    if (match) {
      let final = '+' + match[1];
      if (match[2]) final += ' ' + match[2];
      if (match[3]) final += '-' + match[3];
      return final;
    }

    // Si no entra en ninguna regla, se retorna con un '+' inicial
    return '+' + cleaned;
  }
}
