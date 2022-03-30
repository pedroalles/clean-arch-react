import { InvalidFieldError } from '@/validation/errors'
import { IFieldValidation } from '@/validation/protocols/field-validation'

export class CompareFieldsValidation implements IFieldValidation {
  constructor (
    readonly fieldName:string,
    private readonly valueToCompare: string
  ) {}

  validate (value: string): Error {
    console.log(value)
    return new InvalidFieldError()
  }
}
