import { ISetStorage } from '../protocols/cache/set-storage'

export class SetStorageMock implements ISetStorage {
  key:string
  value: any

  async set (key: string, value: any): Promise<void> {
    this.key = key
    this.value = value
  }
}
