// Create the map and center it on the USA
const myMap = L.map('map').setView([37.09, -95.71], 5);

// Add a tile layer (map background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(myMap);
// URL to fetch earthquake data (past 7 days)
const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch data using D3.js
d3.json(earthquakeURL).then((data) => {
    // Call a function to process and visualize the data
    addEarthquakeData(data.features);
});
function addEarthquakeData(features) {
    features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const magnitude = feature.properties.mag;
        const depth = coords[2]; // Depth is the third coordinate

        // Determine marker size and color based on magnitude and depth
        const markerSize = magnitude * 4;
        const markerColor = depth > 90 ? 'darkred' :
                            depth > 70 ? 'red' :
                            depth > 50 ? 'orange' :
                            depth > 30 ? 'yellow' :
                            depth > 10 ? 'lightgreen' : 'green';

        // Add a circle marker to the map
        L.circleMarker([coords[1], coords[0]], {
            radius: markerSize,
            fillColor: markerColor,
            color: '#000',
            weight: 1,
            fillOpacity: 0.8
        }).bindPopup(`
            <h3>${feature.properties.place}</h3>
            <p>Magnitude: ${magnitude}</p>
            <p>Depth: ${depth} km</p>
        `).addTo(myMap);
    });
}
const legend = L.control({ position: 'bottomright' });

legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend');
    const depths = [-10, 10, 30, 50, 70, 90];
    const colors = ['green', 'lightgreen', 'yellow', 'orange', 'red', 'darkred'];

    for (let i = 0; i < depths.length; i++) {
        div.innerHTML += `
            <i style="background: ${colors[i]}"></i> 
            ${depths[i]}${depths[i + 1] ? `&ndash;${depths[i + 1]}<br>` : '+'}
        `;
    }

    return div;
};

legend.addTo(myMap);
