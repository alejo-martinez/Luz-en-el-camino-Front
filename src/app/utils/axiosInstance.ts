const url = process.env.NEXT_PUBLIC_URL_BACK

import axios, {AxiosInstance} from 'axios';

const api:AxiosInstance = axios.create({
    baseURL: url,
    timeout:15000,
    withCredentials:true
})

export default api;