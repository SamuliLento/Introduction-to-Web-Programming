const dataTable = document.getElementById("data");

async function getData() {

    const url = "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff";

    const dataPromise = await fetch(url);
    const dataJSON = await dataPromise.json();

    const municipalityArray = Object.values(dataJSON.dataset.dimension.Alue.category.label);
    const populationArray = Object.values(dataJSON.dataset.value);

    const url2 = "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065";

    const dataPromise2 = await fetch(url2);
    const dataJSON2 = await dataPromise2.json();

    const employmentArray = Object.values(dataJSON2.dataset.value);

    let i = 0;

    while (
        municipalityArray[i] != null &&
        populationArray[i] != null &&
        employmentArray[i] != null
    ) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");

        td1.innerText = municipalityArray[i];
        td2.innerText = populationArray[i];
        td3.innerText = employmentArray[i];

        let employmentPercentage = (employmentArray[i] / populationArray[i]) * 100;

        td4.innerText = employmentPercentage.toFixed(2) + "%";

        if (employmentPercentage > 45) {
            tr.classList.add("green");
        } else if (employmentPercentage < 25) {
            tr.classList.add("red");
        } else {
            tr.classList.add("basic");
        }

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        dataTable.appendChild(tr);

        i++;
    }
}

getData();