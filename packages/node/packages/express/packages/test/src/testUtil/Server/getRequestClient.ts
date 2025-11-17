import { axiosJsonConfig } from '@xylabs/axios'
import { isDefined } from '@xylabs/typeof'
import { Axios } from 'axios'

let axios: Axios

export const getRequestClient = () => {
  if (isDefined(axios)) return axios
  const baseURL = process.env.API_DOMAIN
  console.log(`baseURL: ${baseURL}`)
  axios = new Axios(axiosJsonConfig({ baseURL }))
  return axios
}
