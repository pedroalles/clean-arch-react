import { Helper, AuthenticationSpy, ValidationSpy, SaveAccessTokenMock } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import faker from 'faker'
import Login from './login'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

const history = createMemoryHistory({ initialEntries: ['/login'] })

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  validationSpy.errorMessage = params?.validationError
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const sut = render(
    <Router history={history}>
      <Login
        validation={validationSpy}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )
  return {
    sut,
    validationSpy,
    authenticationSpy,
    saveAccessTokenMock
  }
}

const simulateValidSubmit = async (getByTestId, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField(getByTestId, 'email', email)
  Helper.populateField(getByTestId, 'password', password)
  const form = getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

const testElemetText = (getByTestId, elementTestId: string, text: string):void => {
  const element = getByTestId(elementTestId)
  expect(element.textContent).toBe(text)
}

describe('Login Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId } } = makeSut({ validationError })
    Helper.testChildCount(getByTestId, 'error-wrap', 0)
    Helper.testButtonStatus(getByTestId, 'submit', true)
    Helper.testStatusForField(getByTestId, 'email', validationError)
    Helper.testStatusForField(getByTestId, 'password', validationError)
  })

  it('should call Validation with correct email', async () => {
    const { sut: { getByTestId }, validationSpy } = makeSut()
    const email = faker.internet.email()
    Helper.populateField(getByTestId, 'email', email)
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual(email)
  })

  it('should call Validation with correct password', async () => {
    const { sut: { getByTestId }, validationSpy } = makeSut()
    const password = faker.internet.password()
    Helper.populateField(getByTestId, 'password', password)
    expect(validationSpy.fieldName).toEqual('password')
    expect(validationSpy.fieldValue).toEqual(password)
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

  it('should enable submit button if form is valid', async () => {
    const { sut: { getByTestId } } = makeSut()
    Helper.populateField(getByTestId, 'email')
    Helper.populateField(getByTestId, 'password')
    Helper.testButtonStatus(getByTestId, 'submit', false)
  })

  it('should show load spinner on submit', async () => {
    const { sut: { getByTestId } } = makeSut()
    await simulateValidSubmit(getByTestId)
    Helper.testElementExists(getByTestId, 'spinner')
  })

  it('should call Authentication with correct values', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(getByTestId, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  it('should call Authentication only once', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    await simulateValidSubmit(getByTestId)
    await simulateValidSubmit(getByTestId)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  it('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId }, authenticationSpy } = makeSut({ validationError })
    await simulateValidSubmit(getByTestId)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  it('should present error if Authentication fails', async () => {
    const { sut: { getByTestId }, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(error)))
    await simulateValidSubmit(getByTestId)
    Helper.testChildCount(getByTestId, 'error-wrap', 1)
    testElemetText(getByTestId, 'main-error', error.message)
  })

  it('should call SaveAccessToken on success', async () => {
    const { sut: { getByTestId }, authenticationSpy, saveAccessTokenMock } = makeSut()
    await simulateValidSubmit(getByTestId)
    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  it('should present error if SaveAccessToken fails', async () => {
    const { sut: { getByTestId }, saveAccessTokenMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(error)))
    await simulateValidSubmit(getByTestId)
    Helper.testChildCount(getByTestId, 'error-wrap', 1)
    testElemetText(getByTestId, 'main-error', error.message)
  })

  it('should go to singup page', async () => {
    const { sut: { getByTestId } } = makeSut()
    const register = getByTestId('singup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/singup')
  })
})
