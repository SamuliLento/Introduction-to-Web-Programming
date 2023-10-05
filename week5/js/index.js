let positiveMigration = [];
let positiveIndex;
let negativeMigration = [];
let negativeIndex;

async function getData() {
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const dataPromise = await fetch(url);
    const dataJSON = await dataPromise.json();

    initMap(dataJSON);
}

async function getMigrationData(url, migration) {
    const dataPromise = await fetch(url);
    const dataJSON = await dataPromise.json();

    if (migration == "+") {
        positiveMigration = Object.values(dataJSON.dataset.value);
        positiveIndex = dataJSON.dataset.dimension.Tuloalue.category.index;
    } else if (migration == "-") {
        negativeMigration = Object.values(dataJSON.dataset.value);
        negativeIndex = dataJSON.dataset.dimension.Lähtöalue.category.index;
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

    const areaCode = "KU" + feature.properties.kunta;
    const pId = positiveIndex[areaCode];
    const nId = negativeIndex[areaCode];

    layer.bindTooltip(feature.properties.name);
    layer.bindPopup(
        `<ul>
            <li>Name: ${feature.properties.name}</li>
            <li>Positive migration: ${positiveMigration[pId]}</li>
            <li>Negative migration: ${negativeMigration[nId]}</li>
        </ul>`
    )
};

const getStyle = (feature) => {

    const areaCode = "KU" + feature.properties.kunta;
    const pId = positiveIndex[areaCode];
    const nId = negativeIndex[areaCode];

    if (((positiveMigration[pId] / negativeMigration[nId])**3 * 60) > 120) {
        return {
            color: `hsl(120 75% 50%)`
        }
    } else {
        return {
            color: `hsl(${(positiveMigration[pId] / negativeMigration[nId])**3 * 60} 75% 50%)`
        }
    }
};

getMigrationData("https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f", "+");
getMigrationData("https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e", "-");
getData();