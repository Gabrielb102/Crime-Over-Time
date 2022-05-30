const mapboxAccessToken = 'pk.eyJ1Ijoid2F4ZWQtbGVvcGFyZHMiLCJhIjoiY2wybGQxZms2MWdiZzNlc2JnOTdxeG8xOSJ9.YJVR_bne2for9zGWz2g6Gg'
const map = L.map('map', {minZoom: 3}).setView([37.8, -96], 4);

const mapSwitch = document.querySelector('#map-switch')
const mapSettings = document.querySelector('#map-settings')



L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoid2F4ZWQtbGVvcGFyZHMiLCJhIjoiY2wybGQxZms2MWdiZzNlc2JnOTdxeG8xOSJ9.YJVR_bne2for9zGWz2g6Gg'
}).addTo(map);

// function getColor(d) {
//     return d > 1000 ? '#800026' :
//            d > 500  ? '#BD0026' :
//            d > 200  ? '#E31A1C' :
//            d > 100  ? '#FC4E2A' :
//            d > 50   ? '#FD8D3C' :
//            d > 20   ? '#FEB24C' :
//            d > 10   ? '#FED976' :
//                       '#FFEDA0';
// }

// STYLE FUNCTIONS ////////////////////////////////////////

const stateStyle = feature => {
    if(feature.properties.name === locationField.value && !sessionStorage.getItem('zoom')) {
        return {
            weight: 3,
            color: 'aquamarine',
            fillColor: 'none',
            dashArray: '',
            fillOpacity: 0.0    
        }
    }

    return {
        fillColor: 'black',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.3
    };
}

const regionStyle = feature => {
    if(feature.properties.name === locationField.value && !sessionStorage.getItem('zoom')) {
        return {
            weight: 3,
            color: 'aquamarine',
            fillColor: 'none',
            dashArray: '',
            fillOpacity: 0.0    
        }
    }

    return {
        fillColor: 'gray',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5    
    };
}

const natStyle = feature => {
    return {
        fillColor: 'black',
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.1    
    };
}

// INDIVIDUAL LOCATION SELECTION FUNCTIONS/////////////////

const highlightFeature = e => {
    var feature = e.target;
    if(locationField.value !== e.target['feature']['properties']['name']) {
        feature.setStyle({
            weight: 3,
            color: 'orange',
            fillColor: 'orange',
            dashArray: '',
            fillOpacity: 0.7
        });
    }
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        feature.bringToFront();
    }
}

const resetHighlight = e => {
    var feature = e.target;

    if(locationField.value !== feature['feature']['properties']['name']) {
        layer.resetStyle(feature);
        feature.bringToBack()
    }
}

const zoomToFeature = e => {
    sessionStorage.setItem('zoom', 1)
    console.log('zoom')
    var feature = e.target;
    layer.resetStyle(feature.map)
    feature.setStyle({
        weight: 3,
        color: 'aquamarine',
        fillColor: 'none',
        dashArray: '',
        fillOpacity: 0.0
    });

    map.fitBounds(feature.getBounds());
    layer.resetStyle(feature.getBounds());
    let location = feature['feature']['properties']['name']
    locationField.value = location
}

const onEachFeature = (feature, layer) => {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// TOGGLE POLITICAL MAP LAYER FUNCTIONS ///////////////////
var natLayer = L.geoJson(statesData, {style: natStyle}).addTo(map); 
var stateLayer = L.geoJson(statesData, {style: stateStyle, onEachFeature: onEachFeature}).addTo(map); 
var regionLayer = L.geoJson(regionsData, {style: regionStyle, onEachFeature: onEachFeature}).addTo(map);

const mapCheck = () => {
    scope = scopeField.value
    if (scope === 'national') {
        layer = natLayer
        map.removeLayer(regionLayer)
        map.removeLayer(stateLayer)
        natLayer.addTo(map)
    } else if (scope === 'regions') {
        layer = regionLayer
        map.removeLayer(stateLayer)
        map.removeLayer(natLayer)
        regionLayer.addTo(map) 
    } else {
        layer = stateLayer
        map.removeLayer(regionLayer)
        map.removeLayer(natLayer)
        stateLayer.addTo(map)
    }    
}

mapCheck()
form.onchange = mapCheck;
document.addEventListener('DOMContentLoaded', function() {
    sessionStorage.removeItem('zoom')
})


// var marker = L.marker([51.5, -0.09]).addTo(map);

// var circle = L.circle([51.508, -0.11], {
//     color: 'black',
//     fillColor: 'yellow',
//     fillOpacity: 0.2,
//     radius: 500
// }).addTo(map);

// var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(map);

// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");
