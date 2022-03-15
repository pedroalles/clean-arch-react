import { FieldValidationSpy } from '../test/mock-field-validation'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  it('should return error if any validation fails', () => {
    const validationSpy1 = new FieldValidationSpy('any_field')
    const validationSpy2 = new FieldValidationSpy('any_field')
    validationSpy2.error = new Error('any_error_message')
    const sut = new ValidationComposite([
      validationSpy1,
      validationSpy2
    ])
    const error = sut.validate('any_field', 'any_value')
    expect(error).toBe('any_error_message')
  })
})
