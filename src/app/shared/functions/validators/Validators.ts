import { AbstractControl } from "@angular/forms"

// Validador de doble contraseña
export function passwordMatchValidator(control: AbstractControl) {

  const password = control.get('password')?.value
  const passwordConfirm = control.get('passwordConfirm')?.value

  return password === passwordConfirm ? null : { mismatch: true }

}