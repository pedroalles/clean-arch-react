import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import faker from 'faker'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'

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
    const emailInput = getByTestId('email')
    const fakeEmail = faker.internet.email()
    fireEvent.input(emailInput, { target: { value: fakeEmail } })
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual(fakeEmail)
  })

  it('should call Validation with correct password', async () => {
    const { sut: { getByTestId }, validationSpy } = makeSut()
    const passwordInput = getByTestId('password')
    const fakePassword = faker.internet.password()
    fireEvent.input(passwordInput, { target: { value: fakePassword } })
    expect(validationSpy.fieldName).toEqual('password')
    expect(validationSpy.fieldValue).toEqual(fakePassword)
  })

  it('should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    const emailInput = getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
  })

  it('should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    const passwordInput = getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  it('should show valid email state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    const emailInput = getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe('ok')
    expect(emailStatus.textContent).toBe('🟢')
  })

  it('should show valid password state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    const passwordInput = getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe('ok')
    expect(passwordStatus.textContent).toBe('🟢')
  })

  it('should enable submit button if form is valid', async () => {
    const { sut: { getByTestId } } = makeSut()
    const emailInput = getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const passwordInput = getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeFalsy()
  })

  it('should show load spinner on submit', async () => {
    const { sut: { getByTestId } } = makeSut()
    const emailInput = getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const passwordInput = getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const submitButton = getByTestId('submit') as HTMLButtonElement
    fireEvent.click(submitButton)
    const spinner = getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  it('should call Authentication with correct values', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const emailInput = getByTestId('email')
    fireEvent.input(emailInput, { target: { value: email } })
    const passwordInput = getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: password } })
    const submitButton = getByTestId('submit') as HTMLButtonElement
    fireEvent.click(submitButton)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
})
