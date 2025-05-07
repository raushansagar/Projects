
import axios from "axios";


const instance = axios.create({
    baseURL: 'https://xcluv-backend.onrender.com/xcluv/v2/users/',
    withCredentials: true,
  });
  
export default instance;