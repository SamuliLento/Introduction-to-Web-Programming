let positiveMigration = [];
let negativeMigration = [];

async function getData() {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const dataPromise = await fetch(url);
    const dataJSON = await dataPromise.json();

    initMap(dataJSON, positiveMigration, negativeMigration);
}

async function getMigrationData(url, migration) {
    const dataPromise = await fetch(url);
    const dataJSON = await dataPromise.json();

    if (migration == "+") {
        positiveMigration = Object.values(dataJSON.dataset.value);
    } else if (migration == "-") {
        negativeMigration = Object.values(dataJSON.dataset.value);
    }
}

const initMap = (data) => {
    let map = L.map("map", {
        minZoom: -3,
    });

    let geoJson = L.geoJSON(data, {
        onEachFeature: getFeature,
        style: getStyle,
        weight: 2,
    }).addTo(map);

    let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap",
        }).addTo(map);

    map.fitBounds(geoJson.getBounds());
};

const getFeature = (feature, layer) => {
    if (!feature) return;

    const id = feature.id.split("."); //stackoverflow convert string to array

    layer.bindTooltip(feature.properties.name);
    layer.bindPopup(
        `<ul>
            <li>Name: ${feature.properties.name}</li>
            <li>Positive migration: ${positiveMigration[id[1]]}</li>
            <li>Negative migration: ${negativeMigration[id[1]]}</li>
        </ul>`
    )
};

const getStyle = (feature) => {

    const id = feature.id.split("."); //stackoverflow convert string to array

    let hue = (positiveMigration[id[1]] / negativeMigration[id[1]])**3 * 60;
    if (hue > 120) {
        hue = 120;
    }
    return {
        color: `hsl(${hue} 75% 50%)`
    }
};

getMigrationData("https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f", "+");
getMigrationData("https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e", "-");
getData();