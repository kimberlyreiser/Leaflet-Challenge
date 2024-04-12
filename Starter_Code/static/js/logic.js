
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(queryUrl).then
  (function (data) {

    createFeatures(data.features);

    console.log(data);
  });
function Get_Color_Depth(depth){              
  if (depth > 90) return '#c20814';
  else if (depth >= 70) return '#e35b07';
  else if (depth >= 50) return '#ed8309';
  else if (depth >= 30) return '#edc709';
  else if (depth >= 10) return '#ede509';
  else return '#4ded09';
}
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
    layer.bindPopup(`<h2>Earthquake Recorded</h2><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>
    <p>Origination Depth: ${feature.geometry.coordinates[2]} kilometers</p><p>Epicenter Location: ${feature.properties.place}</p>`);
  }
  
  
  let earthquakeLayer = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
      
      pointToLayer: function(feature, latlng) {            
      let marker = {
          radius: feature.properties.mag * 25000,
          fillColor: Get_Color_Depth(feature.geometry.coordinates[2]),  
          fillOpacity: 0.5,
          color: '#000000',           
          weight: 0.5
        }
      return L.circle(latlng,marker);
    }
  });

  
  createMap(earthquakeLayer);
}





function createMap(earthquakeLayer) {


  let mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })


  let myMap = L.map('map', {
    center: [37.09, -95.71],   
    zoom: 5,
    layers: [mapLayer, earthquakeLayer] 
  
  });


  
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let depth = [-10, 10, 30, 50, 70, 90];
    let labels = [];
  
    div.innerHTML = '<h2>Earthquake Depth</h2>';

    for (var i = 0; i < depth.length; i++) {
      labels.push('<ul style="background-color:' + Get_Color_Depth(depth[i] +1) + '"> <span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
    }

      div.innerHTML += '<ul>' + labels.join('') + '</ul>';

    return div;
  };
  legend.addTo(myMap);
};