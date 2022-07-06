'use strict'
import { apiResult } from './apiData.js';

/** @typedef {object} Airport
 * @property {string} name
 * @property {string} identifier
 * @property {object[]} runways
 * @property {string} runways.runway_identifier
 * @property {number} runways.length
 * @property {number} runways.width
 * @property {number} runways.slope
 * @property {number} runways.elevation
 * @property {string} runways.surface
 * @property {number} runways.runway_heading
 * @property {number} runways.weight_limit
 * @property {object[]} fuel
 * @property {string} fuel.type
 * @property {string} fuel.price
 * @property {object} wheather
 * @property {number} wheather.wind_mph
 * @property {number} wheather.wind_direction
 * @property {string} wheather.visibility
 * @property {string} wheather.temperature
 * @property {string} wheather.clouds
 * @property {number} wheather.clouds_height
 * @property {object} radio_frequencies
 */



/**
 * 
 * @returns {Promise<Airport[]>} Promise of type Airport[]
 */
export async function GetAirportData() {
    return new Promise((resolve) => resolve(apiResult.results));
}