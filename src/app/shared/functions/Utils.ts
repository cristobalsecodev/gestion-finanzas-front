import { FormGroup, Validators } from "@angular/forms";

export function normalizeString(str: string): string {

  if(str) {

    return str
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Eliminar los acentos
    .trim() // Eliminar espacios al inicio y final
    .replace(/\s+/g, ''); // Eliminar todos los espacios

  } else {

    return str
    
  }

}

export function capitalizeString(str: string): string {

  return str.charAt(0).toUpperCase() + str.slice(1)

}

export function markForms(form: FormGroup): void {

    Object.keys(form.controls).forEach(controlName => {

      const control = form.get(controlName);

      if (control && control.invalid && control.hasValidator(Validators.required)) {
        control.markAsTouched();
      }
      
    });

}