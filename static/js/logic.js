// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let map = L.map('map', {
  center: [37.7749, -122.4194],  // Center of map (San Francisco)
  zoom: 5,
  layers: [basemap]  // Default layer is the basemap
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.8,
      fillColor: getColor(feature.geometry.coordinates[2]), // depth determines color
      color: "#000000", // border color
      radius: getRadius(feature.properties.mag), // magnitude determines size
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth <= -10) {
      return "#00ffff";  // Cyan for depths less than or equal to -10 (example: negative depth)
    } else if (depth <= 10) {
      return "#00ff00";  // Green for shallow earthquakes (0 to 10 km)
    } else if (depth <= 30) {
      return "#80ff00";  // Light green for depths between 10 and 30 km
    } else if (depth <= 50) {
      return "#ffff00";  // Yellow for depths between 30 and 50 km
    } else if (depth <= 70) {
      return "#ff8000";  // Orange for depths between 50 and 70 km
    } else if (depth <= 90) {
      return "#ff4000";  // Dark orange for depths between 70 and 90 km
    } else {
      return "#ff0000";  // Red for depths greater than 90 km
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4; // Multiply by 4 to increase the size of the markers
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  let earthquakeLayer = L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3>
        <hr>
        <p>Magnitude: ${feature.properties.mag}</p>
        <p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }

  
  
}).addTo(map);
  
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    
  
  // Initialize depth intervals and colors for the legend
    const depthIntervals = [-10,10,30,50,70,90,90];
    const colors = [
      "#00ffff", // Cyan
      "#00ff00", // Green
      "#80ff00", // Light green
      "#ffff00", // Yellow
      "#ff8000", // Orange
      "#ff4000", // Dark orange
      "#ff0000"  // Red
    ];
    


    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthIntervals.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></i> ' + 
        depthIntervals[i] + 
        (depthIntervals[i + 1] ? '&ndash;' + depthIntervals[i + 1] : '+') + ' km<br>';
    }

    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(map);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

  });
});
