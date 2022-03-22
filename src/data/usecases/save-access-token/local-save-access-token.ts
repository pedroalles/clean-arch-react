import { ISetStorage } from '@/data/protocols/cache/set-storage'
import { ISaveAccessToken } from '@/domain/usecases/save-access-token'

export class LocalSaveAcessToken implements ISaveAccessToken {
  constructor (
    private readonly setStorage : ISetStorage
  ) {}

  async save (accessToken: string):Promise<void> {
    await this.setStorage.set('accessToken', accessToken)
  }
}
