'use strict'
import { GetAirportData } from './api.js'

/**
 * @type {import('./api.js').Airport | undefined}
 */
let selectedAirport = undefined;

/**
 * @type {import('./api.js').Airport[] | undefined}
 */
let airportData = undefined;

/**
 * 
 * @param {HTMLElement} parent 
 * @param {*} name 
 * @param {*} content 
 * @returns 
 */
function createContentForSlot(parent, name, content) {
    const slot = parent.getElementsByClassName(name)[0];
    slot.innerHTML = content;
    return slot;
}
function appendContentForSlot(parent, name, content) {
    const slot = parent.getElementsByClassName(name)[0];
    slot.append(content);
    return slot;
}

function clearContentForSlot(parent, name) {
    parent.getElementsByClassName(name)[0].innerHTML = "";
}



/**
 * 
 * @param {import('./api.js').Airport[]} data 
 */
function loadAirportsList(data) {
    const airportList = document.getElementById('airport-list');
    airportList.innerHTML = "";
    for (let airport of data) {
        const row = document.getElementById('list-row-template').cloneNode(true);
        row.hidden = false;
        createContentForSlot(row, 'name', `<b>(${airport.identifier})</b> ${airport.name}`);

        const maxRunway = airport.runways.reduce((acc, curr) => curr.length >= acc.length && curr.weight_limit >= acc.weight_limit ? curr : acc, airport.runways[0]);
        createContentForSlot(row, 'max-runway', `${maxRunway.length}Ft / ${maxRunway.weight_limit}Lbs`);
        createContentForSlot(row, 'wind', `${airport.wheather.wind_mph}mph ${airport.wheather.wind_direction}&deg;`);
        createContentForSlot(row, 'visibility', `${airport.wheather.visibility} miles`);
        const fuelDiv = document.createElement('div');
        fuelDiv.classList.add('d-flex');
        fuelDiv.classList.add('flex-col');
        for (let fuel of airport.fuel) {
            const fuelLine = document.createElement('div');
            fuelLine.innerHTML = `<b>${fuel.type}</b> ${fuel.price}`;
            fuelDiv.append(fuelLine);
        }
        appendContentForSlot(row, 'fuel', fuelDiv);
        airportList.append(row);
        row.getElementsByClassName('view-btn')[0].addEventListener('click', () => {
            console.log('loading', airport);
            loadAirport(airport)
        })
    }
    showView('airport-list');
}

const views =
{
    'airport-single': document.getElementById('airport-view'),
    'airport-list': document.getElementById('airport-list-view')
}


function back() {
    selectedAirport = undefined;
    showView('airport-list')
}

/**
 * 
 * @param {import('./api.js').Airport} airport 
 */
function loadAirport(airport) {
    selectedAirport = airport;
    const view = views['airport-single'];
    clearContentForSlot(view, 'weather');
    clearContentForSlot(view, 'fuel');
    clearContentForSlot(view, 'radios');
    clearContentForSlot(view, 'runways');
    createContentForSlot(view, 'name', `<b>(${selectedAirport.identifier})</b> ${selectedAirport.name}`);
    // weather
    createContentForSlot(view, 'weather', `<div>Wind is <b>${airport.wheather.wind_mph}mph</b> at <b>${airport.wheather.wind_direction}&deg;</b></div><div>Temperature is <b>${airport.wheather.temperature}</b></div><div>Cloud cover is <b>${airport.wheather.clouds}</b> at <b>${airport.wheather.clouds_height}ft</b></div>`);
    // fuel
    for (let fuel of airport.fuel) {
        const fuelDiv = document.createElement('div')
        fuelDiv.innerHTML = `<b>${fuel.type}</b> at ${fuel.price}`
        appendContentForSlot(view, 'fuel', fuelDiv)
    }
    // radios
    for (let radio of Object.entries(airport.radio_frequencies)) {
        let cleanRadioName = radio[0].replace('_', ' ').split(' ').map(x => x.substring(0, 1).toUpperCase() + x.substring(1)).join(' ');
        const radioDiv = document.createElement('div')
        radioDiv.innerHTML = `${cleanRadioName}: <b>${radio[1]}</b>`
        appendContentForSlot(view, 'radios', radioDiv)
    }
    for (let runway of airport.runways) {
        const row = document.getElementById('list-runway-template').cloneNode(true);
        row.hidden = false;
        Object.entries(runway).forEach((x) => {
            console.log('setting', x[0], x[1])
            createContentForSlot(row, x[0], x[1])
        })
        view.getElementsByClassName('runways')[0].append(row);
    }
    showView('airport-single');
}

/**
 * 
 * @param {keyof views} viewName 
 */
function showView(viewName) {
    for (let view in views) {
        views[view].hidden = view !== viewName;
    }
}

function init(data) {
    airportData = data;
    loadAirportsList(airportData);
    document.getElementById('loading').classList.add('fade-out');
    document.getElementById('back-btn').addEventListener('click', () => back())
}

GetAirportData().then(init);