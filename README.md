# La Villette

### DB table points_of_interest
`CREATE TABLE points_of_interest (
 	id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
     teaser_id int DEFAULT NULL,
     name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
     area VARCHAR(255) NOT NULL,
     type VARCHAR(255) NOT NULL,
     icon VARCHAR(255) DEFAULT NULL,
     coordinates TEXT NOT NULL COMMENT '"marker" or "polygon"',
     active tinyint(1) DEFAULT 1
 );`

### Changing points of interest
Points of interest (places) are used in the page /{{#LABEL_ROUTE_INTERACTIVE_MAP#}}.
Each place of interest is a teaser, but not all data is in the teaser.
In the table `points_of_interest` is the extra data, that is required to display the place on the map.
* `type` can be "polygon" or "marker", and it corresponds to `google.maps.Polygon` nad `google.maps.Marker`.
* `icon` can be "toilet", "metro", "parking", "food", "money", "shop", "ambulance", "bus", "info", "train", "taxi", and "bike".
This list could be wrong because, in time, new icons could be added, or removed.
Based on this icon, an appropriate url is generated.
The icon column should be `NULL` if the type column value is "polygon".
* `area` can be "culturalPlaces", "gardens", "services", and "folie". These correspond to "Lieux culturels", "Espace Verts", "Service", and "Folie", respectively.
* `coordinates` is a json string that represents a polygon or a marker.

I case of a polygon the coordinates json is an array of objects wit "lat" and "lng" properties, for example:
 
 `[{"lng":2.3920383,"lat":48.8953488},{"lng":2.3920825,"lat":48.8953964},{"lng":2.3922542,"lat":48.8953329},{"lng":2.3920383,"lat":48.8953488}]`
 
 In case of a marker the coordinates json is a single object wit "lat" and "lng" properties, for example:
 
 `{"lng":2.3920383,"lat":48.8953488}`
 
 If the coordinates json is not in the right format in regards to the `type` column, the google map will break.