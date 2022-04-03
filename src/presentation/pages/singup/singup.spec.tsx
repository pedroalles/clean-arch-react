import { Helper, ValidationSpy } from '@/presentation/test'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import faker from 'faker'
import SingUp from './singup'

type SutParams = {
  validationError: string
}

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = params?.validationError
  const sut = render(
    <SingUp
      validation={validationSpy}
    />)
  return {
    sut,
    validationSpy
  }
}

const populateField = (getByTestId, fieldName: string, value = faker.random.word()): void => {
  const emailInput = getByTestId(fieldName)
  fireEvent.input(emailInput, { target: { value } })
}

describe('Singup Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    Helper.testChildCount(getByTestId, 'error-wrap', 0)
    Helper.testButtonStatus(getByTestId, 'submit', true)
    Helper.testStatusForField(getByTestId, 'name', validationError)
    Helper.testStatusForField(getByTestId, 'email', 'Required Field')
    Helper.testStatusForField(getByTestId, 'password', 'Required Field')
    Helper.testStatusForField(getByTestId, 'passwordConfirmation', 'Required Field')
  })

  it('should show name error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    populateField(getByTestId, 'name')
    Helper.testStatusForField(getByTestId, 'name', validationError)
  })
})
