export interface IFieldValidation {
  fieldName: string
  validate(value: string): Error
}
