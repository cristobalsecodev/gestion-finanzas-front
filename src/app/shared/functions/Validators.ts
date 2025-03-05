import { AbstractControl } from "@angular/forms"

// Validador de doble contraseña
export function passwordMatchValidator(control: AbstractControl) {

  const password = control.get('password')?.value
  const passwordConfirm = control.get('passwordConfirm')?.value

  if(!password || !passwordConfirm) {
    return null
  }

  return password === passwordConfirm ? null : { mismatch: true }

}

// Validador objeto seleccionado
export function objectSelectedValidator(control: AbstractControl) {

  return typeof control.value === 'object' || !control.value ? null : { objectSelected: true }

}

// Validador formulario vacío
export function whiteSpaceValidator(control: AbstractControl) {

  if (!control.value) {
    return null
  }

  return control.value.trim().length === 0 ? { whiteSpace: true } : null

}