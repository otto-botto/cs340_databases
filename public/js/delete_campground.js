function deleteCampground(campgroundID){
    // Put the data to be sent in a javascript object
    let data = {
        CampgroundId: campgroundID
    };
    console.log(data); 

    // Setup the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-campground-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(campgroundID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(campgroundID){

    let table = document.getElementById("campgrounds-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == campgroundID) {
        table.deleteRow(i);
        break;
       }
    }
}
