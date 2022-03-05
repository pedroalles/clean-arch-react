import { HttpPostClientParams, HttpResponse, IHttpPostClient } from '@/data/protocols/http'

import axios from 'axios'

export class AxiosHttpClient implements IHttpPostClient<any, any> {
  async post (params: HttpPostClientParams<any>): Promise<HttpResponse<any>> {
    const response = await axios.post(params.url, params.body)
    return {
      statusCode: response.status,
      body: response.data
    }
  }
}
