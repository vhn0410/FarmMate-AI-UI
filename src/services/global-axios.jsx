import axios from "axios";

const SENSORTHINGS_API = import.meta.env.VITE_SENSORTHINGS_API;
const OBSERVATIONS_API = import.meta.env.VITE_OBSERVATION_SERVICE_API;

const sensorthingsAPI = axios.create({baseURL: `${SENSORTHINGS_API}`})
const observationsAPI = axios.create({baseURL: `${OBSERVATIONS_API}`})
const IMDF_API_URL = import.meta.env.VITE_IMDF_SERVICE_API;
const imdfAPI = axios.create({baseURL: `${IMDF_API_URL}/imdf-api`})


export {
    sensorthingsAPI,
    observationsAPI,
    imdfAPI
};