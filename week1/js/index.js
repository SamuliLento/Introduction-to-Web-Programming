if (document.readyState !== "loading") {
    console.log("Document is ready!");
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Document is ready after waiting!");
      initializeCode();
    });
  }
  
function initializeCode() {

    const myButton = document.getElementById("my-button");

    myButton.addEventListener("click", function () {
        console.log("hello world");
        document.getElementById("h1").innerText = "Moi maailma";
    });

    const addData = document.getElementById("add-data");

    addData.addEventListener("click", function () {

        const myList = document.getElementById("my-list");
        let newListItem = document.createElement("li");

        newListItem.innerText = document.getElementById("textarea").value;

        myList.appendChild(newListItem);
        
    });
}