// I decided to have the data pruned here on the front end side in order to better manage a volume of users. 

var totalValues = {}

var svgLoadingAni = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgLoadingAni.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
svgLoadingAni.setAttribute('viewBox', '0 0 200 200');
svgLoadingAni.innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="150px" height="150px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><path d="M10 50A40 40 0 0 0 90 50A40 43.1 0 0 1 10 50" fill="#ff9000" stroke="none"><animateTransform attributeName="transform" type="rotate" dur="0.9900990099009901s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51.55;360 50 51.55"></animateTransform></path>';

const loadStyle = feature => {
    return {
        fillColor: 'black',
        weight: 2,
        color: 'black',
        fillOpacity: 0.5    
    };
}

const populateTotalValues = async function(totalValues) {
    for (loc of locationField.children) {
        heatMapData = await fetch(`/heatmap/${loc.value}`).then(response => response.json()).then(data => {return data})
        areaValues = heatMapData['results']
        let mostRecentYear = 0
        let mostRecentValue = 0
        for (value of areaValues) {
            if (value['data_year'] > mostRecentYear) {
                mostRecentValue = value['incident_count']
            }
        }
        totalValues[loc.value] = {}
        totalValues[loc.value]['count'] = mostRecentValue
    }
    return totalValues
}

const getColor = c => {
    return c < .05 ? '#fafa38' :
           c < .1   ? '#fcf128' :
           c < .15 ? '#fee814' :
           c < .2   ? '#ffdf00' :
           c < .25  ? '#ffd500' :
           c < .3    ? '#ffcc00' :
           c < .35  ? '#ffc200' :
           c < .4  ? '#ffb800' :
           c < .45 ? '#ffae00' :
           c < .5   ? '#ffa400' :
           c < .55 ? '#ff9900' :
           c < .6    ? '#ff8f00' :
           c < .65  ? '#ff8300' :
           c < .7    ? '#ff7800' :
           c < .75 ? '#ff6c00' :
           c < .8   ? '#ff5f00' :
           c < .85  ? '#ff5000' :
           c < .9    ? '#ff4000' :
           c < .95   ? '#ff2b00' :
                      '#ff0000';
}

const assignColorsObj = totalValues => {
    maxVal = 0
    Object.values(totalValues).map(function(value) {
        if (value['count'] > maxVal) {
            maxVal = value['count']
        }
    })
    Object.values(totalValues).map(function(value) {
        let c = value['count']/maxVal
        value['color'] = getColor(c)
    })
    return totalValues
}

const featureStyle = feature => {
    return {
        fillColor: totalValues[(feature.properties.name).toString()].color,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

const makeHeatMap = async function() {
    if (scopeField.value === 'regions' || scopeField.value === 'states') {
        
        imageBounds = [[45, -89], [33, -101]];
        var activeLoadingAni = L.svgOverlay(svgLoadingAni, imageBounds).addTo(map);
        var activeLoadingLayer = L.geoJson(statesData, {style: loadStyle}).addTo(map); 

        totalValues = await populateTotalValues(totalValues)
        totalValues = assignColorsObj(totalValues)
        console.log(totalValues)

        if (scopeField.value === 'regions') {
            mapData = regionsData
        }
        if (scopeField.value === 'states') {
            mapData = statesData
        }

        activeLoadingAni.remove()
        activeLoadingLayer.remove()

        map.removeLayer(regionLayer)
        map.removeLayer(stateLayer)
        var heatMapLayer = L.geoJson(mapData, {style: featureStyle}).addTo(map); 

        heatMapLayer.addTo(map)
    }
}

makeHeatMap()


form.onsubmit = async function() {
    ori_list = await fetch('/results').then(response => response.json()).then(data => {return data})
    console.log(await ori_list) 
    return await ori_list
    console.log(ori_list)
}

