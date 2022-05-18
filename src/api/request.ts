import axios from 'axios';
import { inject } from './util';


const request = axios.create({
  baseURL: 'https://openapi.surreal-ai.com',
});

inject(request);

export default request;
