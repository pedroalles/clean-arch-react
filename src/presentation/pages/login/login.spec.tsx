import { InvalidCredentialsError } from '@/domain/errors'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import faker from 'faker'
import Login from './login'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  validationSpy.errorMessage = params?.validationError
  const sut = render(<Login validation={validationSpy} authentication={authenticationSpy}/>)
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

const populateEmailField = (getByTestId, email = faker.internet.email()): void => {
  const emailInput = getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (getByTestId, password = faker.internet.password()): void => {
  const passwordInput = getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateValidSubmit = (getByTestId, email = faker.internet.email(), password = faker.internet.password()): void => {
  populateEmailField(getByTestId, email)
  populatePasswordField(getByTestId, password)
  const submitButton = getByTestId('submit') as HTMLButtonElement
  fireEvent.click(submitButton)
}

describe('Login Component', () => {
  afterEach(cleanup)

  it('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    const errorWrap = getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeTruthy()
    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  it('should call Validation with correct email', async () => {
    const { sut: { getByTestId }, validationSpy } = makeSut()
    const email = faker.internet.email()
    populateEmailField(getByTestId, email)
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual(email)
  })

  it('should call Validation with correct password', async () => {
    const { sut: { getByTestId }, validationSpy } = makeSut()
    const password = faker.internet.password()
    populatePasswordField(getByTestId, password)
    expect(validationSpy.fieldName).toEqual('password')
    expect(validationSpy.fieldValue).toEqual(password)
  })

  it('should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    populateEmailField(getByTestId)
    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
  })

  it('should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    populatePasswordField(getByTestId)
    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  it('should show valid email state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    populateEmailField(getByTestId)
    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe('ok')
    expect(emailStatus.textContent).toBe('🟢')
  })

  it('should show valid password state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    populatePasswordField(getByTestId)
    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe('ok')
    expect(passwordStatus.textContent).toBe('🟢')
  })

  it('should enable submit button if form is valid', async () => {
    const { sut: { getByTestId } } = makeSut()
    populateEmailField(getByTestId)
    populatePasswordField(getByTestId)
    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeFalsy()
  })

  it('should show load spinner on submit', async () => {
    const { sut: { getByTestId } } = makeSut()
    simulateValidSubmit(getByTestId)
    const spinner = getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  it('should call Authentication with correct values', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(getByTestId, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  it('should call Authentication only once', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    simulateValidSubmit(getByTestId)
    simulateValidSubmit(getByTestId)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  it('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId }, authenticationSpy } = makeSut({ validationError })
    populateEmailField(getByTestId)
    fireEvent.submit(getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })

  it('should present error if Authentication fails', async () => {
    const { sut: { getByTestId, findByTestId }, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(error)))
    simulateValidSubmit(getByTestId)
    const errorWrap = getByTestId('error-wrap')
    const mainError = await findByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })
})
