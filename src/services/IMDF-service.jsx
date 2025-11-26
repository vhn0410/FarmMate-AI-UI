import { imdfAPI } from "./global-axios";

const getAddresses = () => imdfAPI.get(`/addresses`);
const getVenues = () => imdfAPI.get(`/venues`);
const getFootprints = () => imdfAPI.get(`/footprints`);
const getBuildings = () => imdfAPI.get(`/buildings`);

const getKiosks = () => imdfAPI.get(`/kiosks`);
const getFixtures = () => imdfAPI.get(`/fixtures`);
const getOccupants = () => imdfAPI.get(`/occupants`);
const getOpenings = () => imdfAPI.get(`/openings`);
const getAnchors = () => imdfAPI.get(`/anchors`);
const getAmenities = () => imdfAPI.get(`/amenities`);
const getUnits = () => imdfAPI.get(`/units`);
const getLevels = () => imdfAPI.get(`/levels`);
const getDetails = () => imdfAPI.get(`/details`);
export const getIMDFData = {
    addresses: getAddresses,
    venues: getVenues,
    footprints: getFootprints,
    buildings: getBuildings,
    kiosks: getKiosks,
    fixtures: getFixtures,
    occupants: getOccupants,
    openings: getOpenings,
    anchors: getAnchors,
    amenities: getAmenities,
    units: getUnits,
    levels: getLevels,
    details: getDetails
}