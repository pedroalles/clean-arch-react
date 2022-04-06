import { Helper, ValidationSpy } from '@/presentation/test'
import { cleanup, render, RenderResult } from '@testing-library/react'
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
    Helper.testStatusForField(getByTestId, 'email', validationError)
    Helper.testStatusForField(getByTestId, 'password', validationError)
    Helper.testStatusForField(getByTestId, 'passwordConfirmation', validationError)
  })

  it('should show name error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    Helper.populateField(getByTestId, 'name')
    Helper.testStatusForField(getByTestId, 'name', validationError)
  })

  it('should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    Helper.populateField(getByTestId, 'email')
    Helper.testStatusForField(getByTestId, 'email', validationError)
  })

  it('should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    Helper.populateField(getByTestId, 'password')
    Helper.testStatusForField(getByTestId, 'password', validationError)
  })

  it('should show passwordConfirmation error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    Helper.populateField(getByTestId, 'passwordConfirmation')
    Helper.testStatusForField(getByTestId, 'passwordConfirmation', validationError)
  })

  it('should show valid name state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    Helper.populateField(getByTestId, 'name')
    Helper.testStatusForField(getByTestId, 'name')
  })

  it('should show valid email state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    Helper.populateField(getByTestId, 'email')
    Helper.testStatusForField(getByTestId, 'email')
  })

  it('should show valid password state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    Helper.populateField(getByTestId, 'password')
    Helper.testStatusForField(getByTestId, 'password')
  })

  it('should show valid passwordConfirmation state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    Helper.populateField(getByTestId, 'passwordConfirmation')
    Helper.testStatusForField(getByTestId, 'passwordConfirmation')
  })
})
