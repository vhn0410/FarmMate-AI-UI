import { sensorthingsAPI } from "./global-axios";
const token = import.meta.env.VITE_SENSORTHINGS_TOKEN;

export const getObservations = (page) => sensorthingsAPI.get(`/get_observations?top=${page}`,
    {
        headers: {
            'token': token,
        }
    }
);


export const getThingsOGCSensorthings = (expandString) =>
  sensorthingsAPI.get(`/get-things${expandString}`, {
    headers: {
      'token': token
    },
    validateStatus: status => status < 500
});


export const getThingOGCSensorthings = (expandString) =>
  sensorthingsAPI.get(`/get-thing${expandString}`, {
    headers: {
      'token': token
    },
    validateStatus: status => status < 500
});

export const getDatastreamOGCSensothings = (expandString) => 
    sensorthingsAPI.get(`/get-datastream${expandString}`,
    {
        headers: {
            'token': token,
        }
    }
);