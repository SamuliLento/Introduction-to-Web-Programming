
const submitDataButton = document.getElementById("submit-data");
const emptyTableButton = document.getElementById("empty-table");

submitDataButton.addEventListener("click", function(event) {

    const tableBody = document.getElementById("table-body");

    tableBody.appendChild(document.createElement("tr"));

    let newUsername = document.createElement("td");
    let newEmail = document.createElement("td");
    let newAdmin = document.createElement("td");

    newUsername.innerText = document.getElementById("input-username").value;
    newEmail.innerText = document.getElementById("input-email").value;
    if (document.getElementById("input-admin").checked) {
        newAdmin.innerText = "X";
    } else {
        newAdmin.innerText = "-";
    }
    
    tableBody.lastChild.appendChild(newUsername);
    tableBody.lastChild.appendChild(newEmail);
    tableBody.lastChild.appendChild(newAdmin);

    event.preventDefault();
});

emptyTableButton.addEventListener("click", function() {
    const tableBody = document.getElementById("table-body");
    while (tableBody.hasChildNodes()) {
        tableBody.removeChild(tableBody.lastChild);
    }
});