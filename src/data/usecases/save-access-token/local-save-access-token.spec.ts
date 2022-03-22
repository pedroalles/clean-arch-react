import { SetStorageSpy } from '@/data/test/mock-storage'
import { LocalSaveAcessToken } from './local-save-access-token'
import faker from 'faker'

describe('LocalSaveAccessToken', () => {
  it('should call SetStorage with correct value', async () => {
    const setStorageSpy = new SetStorageSpy()
    const sut = new LocalSaveAcessToken(setStorageSpy)
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)

    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})
