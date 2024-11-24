
// Get the objects we need to modify
let updateCampgroundForm = document.getElementById('update-campground-form-ajax');

// Modify the objects we need
updateCampgroundForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCampgroundName = document.getElementById("mySelect");
    let inputCampLocationId = document.getElementById("input-CampLocationId-update");

    // Get the values from the form fields
    let CampgroundNameValue = inputCampgroundName.value;
    let CampLocationIdValue = inputCampLocationId.value;
    
    // currently the database table for Campgrounds does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(CampLocationIdValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        CampgroundName: CampgroundNameValue,
        CampLocationId: CampLocationIdValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-campground-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, CampgroundNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, campgroundID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("campgrounds-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == campgroundID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of CampLocationId value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign CampLocationId to the value based on the update
            td.innerHTML = parsedData[0].CampgroundName; 
       }
    }
}

