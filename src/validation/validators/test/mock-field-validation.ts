import { IFieldValidation } from '@/validation/protocols/field-validation'

export class FieldValidationSpy implements IFieldValidation {
  error: Error = null
  constructor (readonly fieldName: string) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate (value: string): Error {
    return this.error
  }
}
