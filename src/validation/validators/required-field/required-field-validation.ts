import { IFieldValidation } from '@/validation/protocols/field-validation'
import { RequiredFieldError } from '@/validation/errors'

export class RequiredFieldValidation implements IFieldValidation {
  constructor (readonly fieldName: string) {}

  validate (value: string): Error {
    return value ? null : new RequiredFieldError()
  }
}
