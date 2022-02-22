import { HttpPostClientParams, IHttpPostClient } from '@/data/protocols/http/http-post-client'

export class HttpPostClientSpy implements IHttpPostClient {
  public url?: string
  public body?: object

  async post (params: HttpPostClientParams): Promise<void> {
    this.url = params.url
    this.body = params.body
  }
}
