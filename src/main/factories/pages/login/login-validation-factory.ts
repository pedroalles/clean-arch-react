import { EmailValidation } from '@/validation/validators/email/email-validation'
import { MinLengthValidation } from '@/validation/validators/min-length/min-length-validation'
import { RequiredFieldValidation } from '@/validation/validators/required-field/required-field-validation'
import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite'

export const makeLoginValidation = ():ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('email'),
    new EmailValidation('email'),
    new RequiredFieldValidation('password'),
    new MinLengthValidation('password', 5)
  ])
}
