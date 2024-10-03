import axios from "axios";
import store from "../redux/store";

const api = axios.create({
    baseURL:'http://localhost:3000/admin'
})

api.interceptors.request.use(
    (config) => {
      const { token } = store.getState().adminauth;
  
      if (!config.headers) {
        config.headers = {};
      }
  
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  

  export default api