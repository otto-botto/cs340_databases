SET FOREIGN_KEY_CHECKS=0;

#--------------------------
#----- TABLE CREATION -----
#--------------------------

DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
    CustomerId INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(64) NOT NULL,
    LastName VARCHAR(64) NOT NULL,
    CustomerEmail VARCHAR(64) NOT NULL,
    CustomerPhone VARCHAR(64) NOT NULL,
    PRIMARY KEY (CustomerId),
    CONSTRAINT UNIQUE (CustomerEmail),
    CONSTRAINT UNIQUE (CustomerPhone)
);

DROP TABLE IF EXISTS Campgrounds;
CREATE TABLE Campgrounds (
    CampgroundId INT NOT NULL AUTO_INCREMENT,
    CampgroundName VARCHAR(255),
    CampgroundPhone VARCHAR(12),
    NumberOfSites SMALLINT(6) NOT NULL,
    State TINYTEXT,
    ClosestTown VARCHAR(64),
    DistanceToTown DECIMAL(6,3),
    Longitude DECIMAL(6,3),
    Latitude DECIMAL(6,3),
    PRIMARY KEY (CampgroundId),
    CONSTRAINT UNIQUE (CampgroundPhone)
);

DROP TABLE IF EXISTS CampgroundSites;
CREATE TABLE CampgroundSites (
    SiteId INT NOT NULL AUTO_INCREMENT,
    GroundSiteId INT NOT NULL,
    SiteNumber INT NOT NULL,
    PRIMARY KEY (SiteId),
    FOREIGN KEY (GroundSiteId) REFERENCES Campgrounds (CampgroundId)
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS CampgroundsCustomers;
CREATE TABLE CampgroundsCustomers (
    CampCustomerId INT NOT NULL AUTO_INCREMENT,
    CampgroundRefId INT NOT NULL,
    CustId INT NOT NULL,
    PRIMARY KEY (CampCustomerId),
    FOREIGN KEY (CampgroundRefId) REFERENCES Campgrounds (CampgroundId)
        ON DELETE CASCADE,
    FOREIGN KEY (CustId) REFERENCES Customers (CustomerId)
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS SiteReservations;
CREATE TABLE SiteReservations (
    ReservationId INT NOT NULL AUTO_INCREMENT,
    SiteReservationId INT,
    CustReservationId INT,
    ReservationTimestamp TIMESTAMP,
    ReservationStart DATE,
    ReservationEnd DATE,
    PRIMARY KEY (ReservationId),
    FOREIGN KEY (SiteReservationId) REFERENCES CampgroundSites (SiteId)
        ON DELETE CASCADE,
    FOREIGN KEY (CustReservationId) REFERENCES Customers (CustomerId)
        ON DELETE CASCADE
);

#----- TESTING TABLE CREATION ----

DESCRIBE Customers;
DESCRIBE SiteReservations;
DESCRIBE Campgrounds;
DESCRIBE CampgroundSites;
DESCRIBE CampgroundsCustomers;

#------------------------------
#----- END TABLE CREATION -----
#------------------------------

#------------------------------
#----- INSERTING VALUES -------
#------------------------------

INSERT INTO Customers (FirstName, LastName, CustomerEmail, CustomerPhone)
VALUES
    ('Ivan', 'Miratov', 'miratov267@email.com', '2024689183'),
    ('Janika', 'Eisel', 'janeisel@email.com', '2027293517'),
    ('Anastasia', 'Vinogradova', 'anyakoshka@email.com', '2025230163');


INSERT INTO Campgrounds (CampgroundName, CampgroundPhone, NumberOfSites, 
    State, ClosestTown, DistanceToTown, Longitude, Latitude)
VALUES ('Fox Creek', "502.784.1511", 16, 'WA', 'Ardenvoir', 14.60, -120.511, 47.925);

INSERT INTO Campgrounds (CampgroundName, CampgroundPhone, NumberOfSites, 
    State, ClosestTown, DistanceToTown, Longitude, Latitude)
VALUES ('Lynx Pass', "970.638.4516", 11, 'CO', 'Toponas', 5.9, -106.699, 40.078);

INSERT INTO Campgrounds (CampgroundName, CampgroundPhone, NumberOfSites, 
    State, ClosestTown, DistanceToTown, Longitude, Latitude)
VALUES ('Hobo Gulch', "530.623.2121", 10, 'CA', 'Junction City', 14.5, -123.153, 40.929);

INSERT INTO CampgroundSites (GroundSiteId, SiteNumber)
VALUES ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId=1), 1);

INSERT INTO CampgroundSites (GroundSiteId, SiteNumber)
VALUES ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId=1), 2);

INSERT INTO CampgroundSites (GroundSiteId, SiteNumber)
VALUES ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId=2), 1);

INSERT INTO CampgroundSites (GroundSiteId, SiteNumber)
VALUES ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId=2), 2);

INSERT INTO CampgroundSites (GroundSiteId, SiteNumber)
VALUES ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId=3), 1);

INSERT INTO CampgroundSites (GroundSiteId, SiteNumber)
VALUES ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId=3), 2);

INSERT INTO CampgroundSites (GroundSiteId, SiteNumber)
VALUES ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId=3), 3);

INSERT INTO SiteReservations (SiteReservationId, CustReservationId, ReservationStart, ReservationEnd)
VALUES
    (
        (SELECT SiteId FROM CampgroundSites WHERE SiteId=1),
        (SELECT CustomerId FROM Customers WHERE CustomerId=1),
        '2024-07-12', '2024-07-17'),
    (
        (SELECT SiteId FROM CampgroundSites WHERE SiteId=2),
        (SELECT CustomerId FROM Customers WHERE CustomerId=2),
        '2024-06-22', '2024-07-01'),
    (
        (SELECT SiteId FROM CampgroundSites WHERE SiteId=6),
        (SELECT CustomerId FROM Customers WHERE CustomerId=3),
        '2024-08-15', '2024-08-20');

INSERT INTO CampgroundsCustomers (CampgroundRefId, CustId)
VALUES
    ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId = 1),
     (SELECT CustomerId FROM Customers WHERE CustomerId = 1)),
    ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId = 1),
     (SELECT CustomerId FROM Customers WHERE CustomerId = 2)),
    ((SELECT CampgroundId FROM Campgrounds WHERE CampgroundId = 3),
     (SELECT CustomerId FROM Customers WHERE CustomerId = 3));

#----- TESTING DATA INSERTION -----

SELECT * FROM Customers;
SELECT * FROM Campgrounds;
SELECT * FROM CampgroundSites;
SELECT * FROM SiteReservations;
SELECT * FROM CampgroundsCustomers;

#------------------------------
#----- END INSERTION ----------
#------------------------------

#---------------
#----- END -----
#---------------

SET FOREIGN_KEY_CHECKS=1;
