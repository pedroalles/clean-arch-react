
import { SetStorageMock } from '@/data/test'
import { LocalSaveAcessToken } from './local-save-access-token'
import faker from 'faker'

type SutTypes = {
  sut: LocalSaveAcessToken,
  setStorageMock: SetStorageMock
}

const makeSut = () : SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalSaveAcessToken(setStorageMock)
  return {
    sut,
    setStorageMock
  }
}

describe('LocalSaveAccessToken', () => {
  it('should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut()
    const accessToken = faker.datatype.uuid()

    await sut.save(accessToken)

    expect(setStorageMock.key).toBe('accessToken')
    expect(setStorageMock.value).toBe(accessToken)
  })

  it('should throw if SetStorage throws', async () => {
    const { sut, setStorageMock } = makeSut()
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error())

    const promise = sut.save(faker.datatype.uuid())

    await expect(promise).rejects.toThrow(new Error())
  })
})
