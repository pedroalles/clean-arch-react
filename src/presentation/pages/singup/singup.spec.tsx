import { EmailInUseError } from '@/domain/errors'
import { AddAccountSpy, Helper, SaveAccessTokenMock, ValidationSpy } from '@/presentation/test'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import faker from 'faker'
import SingUp from './singup'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

const history = createMemoryHistory({ initialEntries: ['/login'] })

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const sut = render(
    <Router history={history}>
      <SingUp
        validation={validationSpy}
        addAccount = {addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>)
  return {
    sut,
    addAccountSpy,
    saveAccessTokenMock
  }
}

const simulateValidSubmit = async (getByTestId, name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField(getByTestId, 'name', name)
  Helper.populateField(getByTestId, 'email', email)
  Helper.populateField(getByTestId, 'password', password)
  Helper.populateField(getByTestId, 'passwordConfirmation', password)
  const form = getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
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

  it('should enable submit button if form is valid', async () => {
    const { sut: { getByTestId } } = makeSut()
    Helper.populateField(getByTestId, 'name')
    Helper.populateField(getByTestId, 'email')
    Helper.populateField(getByTestId, 'password')
    Helper.populateField(getByTestId, 'passwordConfirmation')
    Helper.testButtonStatus(getByTestId, 'submit', false)
  })

  it('should show load spinner on submit', async () => {
    const { sut: { getByTestId } } = makeSut()
    await simulateValidSubmit(getByTestId)
    Helper.testElementExists(getByTestId, 'spinner')
  })

  it('should call AddAccount with correct values', async () => {
    const { sut: { getByTestId }, addAccountSpy } = makeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(getByTestId, name, email, password)
    expect(addAccountSpy.params).toEqual({ name, email, password, passwordConfirmation: password })
  })

  it('should call AddAccount only once', async () => {
    const { sut: { getByTestId }, addAccountSpy } = makeSut()
    await simulateValidSubmit(getByTestId)
    await simulateValidSubmit(getByTestId)
    expect(addAccountSpy.callsCount).toBe(1)
  })

  it('should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut: { getByTestId }, addAccountSpy } = makeSut({ validationError })
    await simulateValidSubmit(getByTestId)
    expect(addAccountSpy.callsCount).toBe(0)
  })

  it('should present error if AddAccount fails', async () => {
    const { sut: { getByTestId }, addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmit(getByTestId)
    Helper.testChildCount(getByTestId, 'error-wrap', 1)
    Helper.testElemetText(getByTestId, 'main-error', error.message)
  })

  it('should call SaveAccessToken on success', async () => {
    const { sut: { getByTestId }, addAccountSpy, saveAccessTokenMock } = makeSut()
    await simulateValidSubmit(getByTestId)
    expect(saveAccessTokenMock.accessToken).toBe(addAccountSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  it('should present error if SaveAccessToken fails', async () => {
    const { sut: { getByTestId }, saveAccessTokenMock } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)
    await simulateValidSubmit(getByTestId)
    Helper.testChildCount(getByTestId, 'error-wrap', 1)
    Helper.testElemetText(getByTestId, 'main-error', error.message)
  })
})
