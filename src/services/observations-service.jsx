import { observationsAPI } from "./global-axios";
const token = import.meta.env.VITE_SENSORTHINGS_TOKEN;

export const getLatestObservationService = (data) => observationsAPI.post(`/observations/dataStreamIds/latest`,data);
export const getAllObservationService = (data, expandedString) => observationsAPI.post(`/observations/dataStreamIds/byRange?${expandedString}`,data);