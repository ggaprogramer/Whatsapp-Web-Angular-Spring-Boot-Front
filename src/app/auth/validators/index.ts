import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordsMatchValidator(
  group: AbstractControl
): ValidationErrors | null {

  const password1 = group.get('password1')?.value;
  const password2 = group.get('password2')?.value;

  if (!password1 || !password2) return null;

  return password1 === password2
    ? null
    : { passwordsDontMatch: true };
}