// Create Leaflet map on map element.
const map = L.map("map").setView([22.9074872, 79.07306671], 5); // [Lat, Long], zoom;

const tileUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
// s is a placeholder for subdomain -> subdomain because single domain has limitations on API calls,
// z -> zoon, x -> x coordinates, y -> y coordinates

const attribution =
  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Coded with love, by Shivam Bandral';
// As we are using OSM (Open Street Map) we are giving them recognition for their work.

// First Layer is the TILE LAYER -> Getting a tile layer
const tiles = L.tileLayer(tileUrl, { attribution });
// Add OSM tile layer to the Leaflet map.
tiles.addTo(map);

function generateHubList() {
  const ul = document.querySelector(".hub-list");

  hubList.forEach((hub) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const a = document.createElement("a");
    const p = document.createElement("p");

    div.classList.add("hub-item");
    a.innerText = hub.properties.name;
    a.addEventListener("click", () => {
      flyToHub(hub);
    });
    a.href = "#";
    p.innerText = hub.properties.address;

    div.appendChild(a);
    div.appendChild(p);

    li.appendChild(div);

    ul.appendChild(li);
  });
}

generateHubList();

function populatingPopupContent(eachHub) {
  return `
    <div>
        <h4>${eachHub.properties.name}</h4>
        <p>${eachHub.properties.address}</p>
        <div class="phone-number">
            <a href="tel:${eachHub.properties.phone}">${eachHub.properties.phone}</a>
        </div>
    </div>
    `;
}

const myIconLayer = L.icon({
  iconUrl: "marker_icon.png",
  iconSize: [35, 35],
  className: "icon-blinking",
});

// To add popup we used to do .bind on the layer but in hubsLayer we are not getting any layer, thus, we defined onEachHub inside the hubs geoJSON
// This function will run for every item in the geoJSON
function onEachHub(eachHub, layer) {
  layer.bindPopup(populatingPopupContent(eachHub), {
    closeButton: false,
    offset: L.point(0, -5),
  });
  // on bindpopup we can pass options as the second argument and leaflet provides us with somefunctions to design our popup, like hiding close button and making popup go bit up by using offset
}

// onEachFeature and pointToLayer are function provided with geoJSON to style our geoJSON elements
const hubsLayer = L.geoJSON(hubList, {
  onEachFeature: onEachHub,
  pointToLayer: function (eachHub, latlong) {
    return L.marker(latlong, { icon: myIconLayer });
  },
});
hubsLayer.addTo(map);

function flyToHub(hub) {
  const durationToFlyToHub = 1.5; // This is in seconds
  const [lat, lng] = [hub.geometry.coordinates[1], hub.geometry.coordinates[0]];
  map.flyTo([lat, lng], 14, {
    duration: durationToFlyToHub,
    //  this duration is in seconds
  });

  // As soon as someone flies to a hub we want to show popup open by default
  // Idea is to create another layer of popup and open this popup at the hub lat long

  // As this flyToHub function will take 1.5 sec to reach the destination, and we want to show the popup at hub only when it has been reached
  // Thus delaying the popup layer by using setTimeout for 1.5sec
  setTimeout(() => {
    L.popup({ closeButton: false, offset: L.point(0, -5) })
      .setLatLng([lat, lng])
      .setContent(populatingPopupContent(hub))
      .openOn(map);
  }, durationToFlyToHub * 1000);
}

/* 
  // L is a global instance provided by leaflet to use.

  // -> This is how we can make a circle layer (provided by leaflet), called circle which will make a circle on the map with a given radius.
  const circleLayer = L.circle([22.9074872, 79.07306671], { radius: 200 }); 
  // stroke, color, fillColor, fillOpacity are some of the other options we can add along with radius. Radius provided is in meters.
  circleLayer.addTo(map);
*/

/* 
  // -> This is how we can make a rectangle layer (provided by leaflet), here instead of radius we have to give bounds that contains the latLongs
  // define rectangle geographical bounds
  const bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];

  // create an orange rectangle
  const rectangeLayer = L.rectangle(bounds, {color: "#ff7800", weight: 1});
  rectangleLayer.addTo(map);

  // zoom the map to the rectangle bounds
  map.fitBounds(bounds);
*/

/* 
  // -> This is how we can make a polygon layer (provided by leaflet), here instead of radius we have to give bounds that contains array of latLongs each latLong will be treated as a vertex of polygon

  const bermudaTriangleCoords = [[
    [25.774, -80.19],
    [18.466, -66.118],
    [32.321, -64.757],
  ]];

  const polygonLayer = L.polygon(bermudaTriangleCoords);
  polygonLayer.addTo(map);
*/



/* 
  // -> This is how we can make a line (provided by leaflet)


  // create a red polyline from an array of LatLng points
  var latlngs = [
    [45.51, -122.68],
    [37.77, -122.43],
    [34.04, -118.2]
  ];

  var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

  // zoom the map to the polyline
  map.fitBounds(polyline.getBounds());
*/


