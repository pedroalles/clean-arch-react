export type HttpPostClientParams = {
  url: string
  body: object
}

export interface IHttpPostClient {
  post(params: HttpPostClientParams): Promise<void>
}
