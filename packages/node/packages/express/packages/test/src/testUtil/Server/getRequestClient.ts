import { AxiosJson } from '@xylabs/axios'
import { isDefined } from '@xylabs/typeof'
import { Axios } from 'axios'

let axios: AxiosJson

export const getRequestClient = () => {
  if (isDefined(axios)) return axios
  const baseURL = process.env.API_DOMAIN
  console.log(`baseURL: ${baseURL}`)
  axios = new Axios(AxiosJson.axiosConfig({ baseURL }))
  return axios
}
