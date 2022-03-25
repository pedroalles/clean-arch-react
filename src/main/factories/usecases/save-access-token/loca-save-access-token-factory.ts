import { LocalSaveAcessToken } from '@/data/usecases/save-access-token/local-save-access-token'
import { ISaveAccessToken } from '@/domain/usecases'
import { makeLocalStorageAdapter } from '../../cache/local-storage-adapter-factory'

export const makeLocalSaveAccessToken = (): ISaveAccessToken => {
  return new LocalSaveAcessToken(makeLocalStorageAdapter())
}
