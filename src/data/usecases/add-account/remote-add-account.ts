import { IHttpPostClient } from '@/data/protocols/http'
import { AccountModel } from '@/domain/models'
import { AddAccountParams, IAddAccount } from '@/domain/usecases'

class RemoteAddAccount implements IAddAccount {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: IHttpPostClient<AddAccountParams, AccountModel>

  ) {}

  async add (params: AddAccountParams): Promise<AccountModel> {
    await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    return null
  }
}

export default RemoteAddAccount
