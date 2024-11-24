/*
    SETUP
*/

// Handlebars and Express


// Express
var express = require('express');
var app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

PORT        = 37198;                 // Set a port number at the top so it's easy to change in the future

// Set up pages
app.use(express.static(__dirname + '/public'));         // this is needed to allow for the form to use the ccs style sheet/javscript

// Database
var db = require('./database/db-connector')

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.





/*
    ROUTES
*/

// GET Routes


app.get('/', function(req, res)
    {   

        // Declare the first query
        let query1;

        // If there is no query string, perform SELECT
        if (req.query.CampgroundName === undefined)
        {
            query1 = "SELECT * FROM Campgrounds;";
        }

        // If there is a query string, assume it's from search and return the appropriate result
        else
        {
            query1 = `SELECT * FROM Campgrounds WHERE CampgroundName LIKE "${req.query.CampgroundName}%"`
        }
        
        let query2 = "SELECT * FROM CampgroundsLocations;";

        // Run the first query
        db.pool.query(query1, function(error, rows, fields){  // Execute the query
            
            // Save the campgrounds
            let campgrounds = rows; 

            // Run the second query
            db.pool.query(query2, (error, rows, fields) => {
                
                // Save the locations
                let locations = rows;
                
                // Render the index.hbs file and send the renderer an object where 'data' = the 'rows'
                // we receive back from the query
                return res.render('index', {data:campgrounds, locations: locations});
            })
        
        })
    
    });

    app.get('/sites', function(req,res){
        let query1 = "SELECT * FROM CampgroundSites;";
        db.pool.query(query1, function(error, rows, fields){
            let sites = rows;
            res.render('sites', {data:sites});
        })

    });

    app.get('/campscustomers', function(req,res){
        let query1 = "SELECT * FROM CampgroundsCustomers;";
        db.pool.query(query1, function(error, rows, fields){
            let campscustomers = rows;
            res.render('campscustomers', {data:campscustomers});
        })

    });

    app.get('/locations', function(req,res){
        let query1 = "SELECT * FROM CampgroundsLocations;";
        db.pool.query(query1, function(error, rows, fields){
            let locations = rows;
            res.render('locations', {data:locations});
        })

    });

    app.get('/customers', function(req,res){
        let query1 = "SELECT * FROM Customers;";
        db.pool.query(query1, function(error, rows, fields){
            let customers = rows;
            res.render('customers', {data:customers});
        })

    });

    app.get('/reservations', function(req,res){
        let query1 = "SELECT * FROM SiteReservations;";
        db.pool.query(query1, function(error, rows, fields){
            let reservations = rows;
            res.render('reservations', {data:reservations});
        })

    });
    
    


// POST Routes
app.post('/add-campground-ajax', function(req, res) 
    {
    // Capture the incoming data and parse it back to a JS object
        let data = req.body;
        console.log(req.body);
                                                   
        // Capture NULL values
        let CampLocationId = parseInt(data.CampLocationId);
        if (isNaN(CampLocationId))
        {
            CampLocationId = 'NULL'
        }

                                                   
        let NumberOfSites = parseInt(data.NumberOfSites);
        if (isNaN(NumberOfSites))
        {
            NumberOfSites = 'NULL'
        }
                                                   
        // Create the query and run it on the database
        query1 = `INSERT INTO Campgrounds (CampgroundName, CampgroundPhone, CampLocationId, NumberOfSites) 
        VALUES ('${data.CampgroundName}', '${data.CampgroundPhone}', ${CampLocationId}, ${NumberOfSites})`;
        db.pool.query(query1, function(error, rows, fields){
                                                   
            // Check to see if there was an error
            if (error) {
                                                   
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * Campgrounds
                query2 = `SELECT * FROM Campgrounds;`;
                db.pool.query(query2, function(error, rows, fields){
                                                   
                // If there was an error on the second query, send a 400
                if (error) {
                                                                       
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP reponse 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
                })
            }
        })
    });

    // DELETE Routes
    app.delete('/delete-campground-ajax/', function(req,res,next){
        let data = req.body;
        let campgroundID = parseInt(data.CampgroundId);
        let deleteCampgroundsCustomers = `DELETE FROM CampgroundsCustomers WHERE CampgroundRefId = ?`;
        let deleteCampgroundSites = `DELETE FROM CampgroundSites WHERE GroundSiteId = ?`;
        let deleteCampground= `DELETE FROM Campgrounds WHERE CampgroundId = ?`;
      
      
              // Run the 1st query
            db.pool.query(deleteCampgroundsCustomers, [campgroundID], function(error, rows, fields){
                if (error) {
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                }
      
                else
                {
                    // Run the second query
                    db.pool.query(deleteCampgroundSites, [campgroundID], function(error, rows, fields) {
                        if (error) {
                              console.log(error);
                              res.sendStatus(400);
                        } 
                        else 
                        {
                            // Run the third query
                            db.pool.query(deleteCampground, [campgroundID], function(error, rows, fields){
                                if (error){
                                    console.log(error);
                                    res.sendStatus(400);
                                }
                                else
                                {
                                    res.sendStatus(204);
                                }
                            })
                        }
                    })
                }
            })
    });

    // PUT Routes
    app.put('/put-campground-ajax', function(req,res,next){
        let data = req.body;
      
        let CampLocationId = parseInt(data.CampLocationId);
        let CampgroundName = parseInt(data.CampgroundName);
      
        let queryUpdateCampground = `UPDATE Campgrounds SET CampLocationId = ? WHERE Campgrounds.CampgroundId = ?`;
        let selectCampgroundsLocations = `SELECT * FROM CampgroundsLocations WHERE LocationId = ?`
      
              // Run the 1st query
              db.pool.query(queryUpdateCampground, [CampLocationId, CampgroundName], function(error, rows, fields){
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
      
                  // If there was no error, we run our second query and return that data so we can use it to update the people's
                  // table on the front-end
                  else
                  {
                      // Run the second query
                      db.pool.query(selectCampgroundsLocations, [CampLocationId], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                              res.send(rows);
                          }
                      })
                  }
      })});

/*
    LISTENER
*/

// Basic syntax for a 'listener', which receives incoming requests on the specified PORT.
app.listen(PORT, function(){            
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
