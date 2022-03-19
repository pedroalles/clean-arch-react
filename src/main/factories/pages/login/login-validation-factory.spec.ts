import { EmailValidation } from '@/validation/validators/email/email-validation'
import { MinLengthValidation } from '@/validation/validators/min-length/min-length-validation'
import { RequiredFieldValidation } from '@/validation/validators/required-field/required-field-validation'
import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite'
import { makeLoginValidation } from './login-validation-factory'

describe('LoginValidationFactory', () => {
  it('should make ValidationComposite with correct validations', () => {
    const composite = makeLoginValidation()
    expect(composite).toEqual(
      new ValidationComposite([
        new RequiredFieldValidation('email'),
        new EmailValidation('email'),
        new RequiredFieldValidation('password'),
        new MinLengthValidation('password', 5)
      ])
    )
  })
})
