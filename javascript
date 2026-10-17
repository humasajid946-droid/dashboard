// Map Initialize around Rawalpindi Center
var map = L.map('map').setView([33.6150, 73.0650], 13);

// OpenStreetMap Base Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Hospital Coordinates
var holyFamilyCoords = [33.6297, 73.0722];
var benazirCoords = [33.6025, 73.0682];

// Add Markers for both Hospitals on Map
L.marker(holyFamilyCoords).addTo(map).bindPopup("<b>Holy Family Hospital</b><br>Rawalpindi").openPopup();
L.marker(benazirCoords).addTo(map).bindPopup("<b>Benazir Bhutto Hospital</b><br>Rawalpindi");

var userLocation = null;
var routingControl = null;

// Get User Current Location via Browser Geolocation API
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        userLocation = [position.coords.latitude, position.coords.longitude];
        
        // Custom Blue Circle Marker for Current Location
        L.circleMarker(userLocation, {
            radius: 8,
            fillColor: "#2563eb",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map).bindPopup("<b>Your Current Location</b>");

    }, function () {
        alert("Geolocation failed or access denied. Defaulting to center location.");
        userLocation = [33.6150, 73.0650];
    });
} else {
    alert("Browser does not support Geolocation.");
    userLocation = [33.6150, 73.0650];
}

// Function to Navigate and Route to Selected Hospital
function navigateToHospital(lat, lng, name) {
    if (!userLocation) {
        alert("Fetching your current location. Please try again in a moment.");
        return;
    }

    // Remove existing route if already drawn
    if (routingControl !== null) {
        map.removeControl(routingControl);
    }

    // Create Routing Path using Leaflet Routing Machine
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(lat, lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        show: false // Hide text instructions box on map
    }).addTo(map);

    // Calculate & Show Distance and Travel Time in Right Sidebar
    routingControl.on('routesfound', function(e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        
        var distanceKm = (summary.totalDistance / 1000).toFixed(2);
        var timeMin = Math.round(summary.totalTime / 60);

        var infoBox = document.getElementById('route-info');
        var routeText = document.getElementById('route-text');
        
        infoBox.style.display = 'block';
        routeText.innerHTML = "<b>Destination:</b> " + name + "<br>" +
                              "<b>Distance:</b> " + distanceKm + " km<br>" +
                              "<b>Est. Time:</b> " + timeMin + " mins";
    });
}