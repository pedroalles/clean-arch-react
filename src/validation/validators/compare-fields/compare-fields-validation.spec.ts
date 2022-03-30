import { InvalidFieldError } from '@/validation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (valueToCompare: string): CompareFieldsValidation => new CompareFieldsValidation('field', valueToCompare)

describe('CompareFieldsValidation', () => {
  it('should return error if compare is invalid', () => {
    const sut = makeSut('field')
    const error = sut.validate('field2')
    expect(error).toEqual(new InvalidFieldError())
  })
})
