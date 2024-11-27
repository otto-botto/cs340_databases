-- Select states to populate dropdown
SELECT State FROM Campgrounds;

-- Get all customer IDs, first and last names, and contact information for the Customer Records page
SELECT CustomerId, FirstName, LastName, CustomerPhone, CustomerEmail FROM Customers
ORDER BY LastName DESC;

-- Get all campground IDs, names, contact information, location information, and numbers of available sites to populate the
--      reservation table for a specific state
SELECT CampgroundId, CampgroundName, CampgroundPhone, NumberOfSites, ClosestTown,
       DistanceToTown, Longitude, Latitude FROM Campgrounds
WHERE State = :state_selected_from_dropdown;

-- Get all reservation IDs, the associated site and customer IDs, the timestamp, and the start and end times of the reservation for the
--      Reservations Records page
SELECT ReservationId, SiteReservationId, CustReservationId, ReservationStart,
       ReservationEnd, ReservationTimestamp FROM SiteReservations;

-- Get all campsite IDs, associated campground IDs, and associated campsite numbers
SELECT SiteId, GroundSiteId, SiteNumber FROM CampgroundSites;

-- Get relational data between campgrounds and customers
SELECT CampCustomerId, CampgroundRefId, CustId FROM CampgroundsCustomers;



#----- CRUD Operations -----

#-- Add a new customer
INSERT INTO Customers (FirstName, LastName, CustomerPhone, CustomerEmail)
VALUES (:fname_input, :lname_input, :cust_phone_input, :cust_email_input);

#-- Add a new campground
INSERT INTO Campgrounds (CampgroundName, CampgroundPhone, NumberOfSites,
                         ClosestTown, DistanceToTown, Longitude, Latitude)
VALUES (:campground_name_input, 
        :campground_phone_input,
        :number_of_sites_input,
        :closest_town,
        :distance_to_town,
        :longitude,
        :latitude);

-- Add a new campsite to a campground
INSERT INTO CampgroundSites (GroundSiteId, SiteNumber)
VALUES (:campground_id_input, :site_number_input);

-- Add a reservation to Reservation Records page
INSERT INTO SiteReservations (SiteReservationId, CustReservationId, ReservationStart, ReservationEnd)
VALUES ((SELECT GroundSiteId FROM CampgroundSites WHERE SiteNumber = :site_number_selected_from_reservation_page), 
        :cust_id_input, :selected_reservation_start_date, :selected_reservation_end_date);

-- Associate a campground with a customer (M:M)
INSERT INTO CampgroundsCustomers (CampgroundRefId, CustId)
VALUES (:campground_id_from_reservation_page, :customer_id_from_reservation_page);

-- Update a customer's information based on the submission of the Update Customer form
UPDATE Customers SET FirstName = :fname_input,
                     LastName = :lname_input,
                     CustomerPhone = :cust_phone_input,
                     CustomerEmail = :cust_email_input
WHERE CustomerId = :customer_id_input;

-- Update the information for a campground
UPDATE Campgrounds
SET CampgroundName = :campground_name_input,
    CampgroundPhone = :campground_phone_input,
    NumberOfSites = :number_of_sites_input,
    ClosestTown = :closest_town_input,
    DistanceToTown = :distance_to_town_input,
    Longitude = :longitude_input,
    Latitude = :latitude_input

WHERE CampgroundId = :campground_id_input;

-- Update a customer's reservation
UPDATE SiteReservations 
SET GroundSiteId = :campsite_id_input,
    ReservationStart = :reservation_start_input,
    ReservationEnd = :reservation_end_input

WHERE ReservationId = :reservation_id_input;

-- Delete a customer
DELETE FROM Customers
       WHERE CustomerId = :id_selected_from_customer_records_page;

-- Delete a campground
DELETE FROM Campgrounds
       WHERE CampgroundId = :id_selected_from_campgrounds_page;

-- Delete a site from a campground
DELETE FROM CampgroundSites
       WHERE SiteId = :id_selected_from_campgrounds_page;

-- Delete a reservation
DELETE FROM SiteReservations
       WHERE ReservationId = :id_selected_from_reservation_page;

-- Delete a Customer-Campground relation (M:M)
DELETE FROM CampgroundsCustomers
       WHERE CampCustomerId = (SELECT CampCustomerId FROM CampgroundsCustomers WHERE CustId = :customer_id_from_reservation_page);
