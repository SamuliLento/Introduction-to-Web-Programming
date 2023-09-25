const submitDataButton = document.getElementById("submit-data");
const showContainer = document.querySelector(".show-container");

async function getData() {

    const url ="https://api.tvmaze.com/search/shows?q="
    let q = document.getElementById("input-show").value;

    const dataPromise = await fetch(url + q);
    const dataJSON = await dataPromise.json();

    dataJSON.forEach((show) => {
        let showData = document.createElement("div");
        let showInfo = document.createElement("div");
        let img = document.createElement("img");
        let h1 = document.createElement("h1");
        let p = document.createElement("p");

        showData.classList.add("show-data");
        showInfo.classList.add("show-info");

        if (show.show.image != null) {
            img.src = show.show.image.medium;
        } else {
            img.alt = "image";
        }

        h1.innerText = show.show.name;
        p.innerHTML = show.show.summary;

        showData.appendChild(img);
        showData.appendChild(showInfo);
        showInfo.appendChild(h1);
        showInfo.appendChild(p);

        showContainer.appendChild(showData);
    });
}

submitDataButton.addEventListener("click", function () {
    while (showContainer.hasChildNodes()) {
        showContainer.removeChild(showContainer.lastChild);
    }
    getData();
});