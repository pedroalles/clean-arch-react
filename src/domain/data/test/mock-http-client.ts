import { HttpPostClientParams, IHttpPostClient } from '../protocols/http/http-post-client'

export class HttpPostClientSpy implements IHttpPostClient {
  public url?: string

  async post (params: HttpPostClientParams): Promise<void> {
    this.url = params.url
  }
}
