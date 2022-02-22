export type HttpPostClientParams = {
  url: string
}

export interface IHttpPostClient {
  post(params: HttpPostClientParams): Promise<void>
}
