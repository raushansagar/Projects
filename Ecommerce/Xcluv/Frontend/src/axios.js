
import axios from "axios";


const instance = axios.create({
    baseURL: 'https://xcluv-backend.onrender.com',
    withCredentials: true,
  });
  
export default instance;