import { HttpStatusCode, IHttpPostClient } from '@/data/protocols/http'
import { EmailInUseError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { AddAccountParams, IAddAccount } from '@/domain/usecases'

class RemoteAddAccount implements IAddAccount {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: IHttpPostClient<AddAccountParams, AccountModel>

  ) {}

  async add (params: AddAccountParams): Promise<AccountModel> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.forbidden: throw new EmailInUseError()
      default: return null
    }
  }
}

export default RemoteAddAccount
