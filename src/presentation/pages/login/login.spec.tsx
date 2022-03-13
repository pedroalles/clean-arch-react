import { InvalidCredentialsError } from '@/domain/errors'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import faker from 'faker'
import Login from './login'
import 'jest-localstorage-mock'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

const history = createMemoryHistory({ initialEntries: ['/login'] })

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
  const sut = render(
    <Router history={history}>
      <Login validation={validationSpy} authentication={authenticationSpy}/>
    </Router>
  )
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

const testValidSubmit = async (getByTestId, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  populateEmailField(getByTestId, email)
  populatePasswordField(getByTestId, password)
  const form = getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

const testStatusForField = (getByTestId, fieldName: string, validationError?:string):void => {
  const emailStatus = getByTestId(`${fieldName}-status`)
  expect(emailStatus.title).toBe(validationError || 'ok')
  expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('Login Component', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    localStorage.clear()
  })

  it('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    const errorWrap = getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeTruthy()
    testStatusForField(getByTestId, 'email', validationError)
    testStatusForField(getByTestId, 'password', validationError)
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
    testStatusForField(getByTestId, 'email', validationError)
  })

  it('should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    populatePasswordField(getByTestId)
    testStatusForField(getByTestId, 'password', validationError)
  })

  it('should show valid email state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    populateEmailField(getByTestId)
    testStatusForField(getByTestId, 'email')
  })

  it('should show valid password state if Validation succeeds', async () => {
    const { sut: { getByTestId } } = makeSut()
    populatePasswordField(getByTestId)
    testStatusForField(getByTestId, 'password')
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
    await testValidSubmit(getByTestId)
    const spinner = getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  it('should call Authentication with correct values', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await testValidSubmit(getByTestId, email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  it('should call Authentication only once', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    await testValidSubmit(getByTestId)
    await testValidSubmit(getByTestId)
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
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(error)))
    await testValidSubmit(getByTestId)
    const errorWrap = getByTestId('error-wrap')
    const mainError = getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })

  it('should add accessToken to localstorage on success', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    await testValidSubmit(getByTestId)
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  it('should go to singup page', async () => {
    const { sut: { getByTestId } } = makeSut()
    const register = getByTestId('singup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/singup')
  })
})
