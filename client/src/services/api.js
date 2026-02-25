import axios from "axios";

const API = axios.create({
  baseURL: "https://food-app-kuhy.onrender.com/api"
});

export default API;