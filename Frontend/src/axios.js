
import axios from "axios";


const instance = axios.create({
    baseURL: 'http://localhost:9000/xcluv/v2/users/',
    withCredentials: true,
  });
  
export default instance;