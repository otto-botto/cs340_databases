// Get the objects we need to modify
let addCampgroundForm = document.getElementById('add-campground-form-ajax');

// Modify the objects we need
addCampgroundForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCampgroundName = document.getElementById("input-CampgroundName");
    let inputCampgroundPhone = document.getElementById("input-CampgroundPhone");
    let inputCampLocationId = document.getElementById("input-CampLocationId");
    console.log(inputCampLocationId);
    let inputNumberOfSites = document.getElementById("input-numSites");

    // Get the values from the form fields
    let CampgroundNameValue = inputCampgroundName.value;
    let CampgroundPhoneValue = inputCampgroundPhone.value;
    let CampLocationIdValue = inputCampLocationId.value;
    let NumberOfSitesValue = inputNumberOfSites.value;

    // Put our data we want to send in a javascript object
    let data = {
        CampgroundName: CampgroundNameValue,
        CampgroundPhone: CampgroundPhoneValue,
        CampLocationId: CampLocationIdValue,
        NumberOfSites: NumberOfSitesValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-campground-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCampgroundName.value = '';
            inputCampgroundPhone.value = '';
            inputCampLocationId.value = '';
            inputNumberOfSites.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Campgrounds

addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("campgrounds-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let CampgroundIdidCell = document.createElement("TD");
    let CampgroundNameCell = document.createElement("TD");
    let CampgroundPhoneCell = document.createElement("TD");
    let CampLocationIdCell = document.createElement("TD");
    let NumberOfSitesCell = document.createElement("TD");

 
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    CampgroundIdidCell.innerText = newRow.CampgroundId;
    CampgroundNameCell.innerText = newRow.CampgroundName;
    CampgroundPhoneCell.innerText = newRow.CampgroundPhone;
    CampLocationIdCell.innerText = newRow.CampLocationId;
    NumberOfSitesCell.innerText = newRow.NumberOfSites;

    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteCampground(newRow.CampgroundId);
    };


    // Add the cells to the row 
    row.appendChild(CampgroundIdidCell);
    row.appendChild(CampgroundNameCell);
    row.appendChild(CampgroundPhoneCell);
    row.appendChild(CampLocationIdCell);
    row.appendChild(NumberOfSitesCell);
    
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.CampgroundId);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Code addition to update a campground record

    // Find drop down menu, create a new option, fill data in the option (camp name and id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    

    
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.CampgroundName;
    option.value = newRow.CampgroundId;
    selectMenu.add(option);
}
