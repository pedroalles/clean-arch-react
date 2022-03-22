
import { SetStorageSpy } from '@/data/test/mock-storage'
import faker from 'faker'
import { LocalSaveAcessToken } from './local-save-access-token'

type SutTypes = {
  sut: LocalSaveAcessToken,
  setStorageSpy: SetStorageSpy
}

const makeSut = () : SutTypes => {
  const setStorageSpy = new SetStorageSpy()
  const sut = new LocalSaveAcessToken(setStorageSpy)
  return {
    sut,
    setStorageSpy
  }
}

describe('LocalSaveAccessToken', () => {
  it('should call SetStorage with correct value', async () => {
    const { sut, setStorageSpy } = makeSut()
    const accessToken = faker.datatype.uuid()

    await sut.save(accessToken)

    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})
