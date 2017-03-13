var point1, point2;

/*OBSOLETAS*/
/*
function getCurrentPosition() {
	
	if (Ti.Geolocation.locationServicesEnabled) {
	    Ti.Geolocation.getCurrentPosition(function(e) {
	        if (e.error) { Ti.API.error('Error: ' + e.error); }
	        else { Ti.API.info('lat:'+e.coords.latitude+' long:'+e.coords.longitude);
	        	}
	    });
	} else { alert('Please enable location services'); }
}

function setDefaultAnnotations() {
	
	// -- La Sagrada Familia
	point1 = Map.createAnnotation({
	    latitude: 41.404095, 
	    longitude: 2.174582,
	    title:"La Sagrada Familia",
	    subtitle:'Carrer de la Marina 266-270',
	    pincolor: Map.ANNOTATION_RED,
	    myid: 1 // Custom property to uniquely identify this annotation.
	});
	mapview.addAnnotation(point1);
	
	
	// -- Zoo de Barcelona
	point2 = Map.createAnnotation({
	    latitude: 41.3883324, longitude: 2.1862068,
	    title: "Zoo de Barcelona",
	    subtitle: 'Parc de la Ciutadella',
	    pincolor: Map.ANNOTATION_RED,
	    myid: 2 // Custom property to uniquely identify this annotation.
	});
	mapview.addAnnotation(point2);

}

function setDefaultLine() {
	
	var line1 = Map.createRoute({
	    width: 4,
	    color: '#f00',
	    points: [
	        { latitude: point1.latitude, longitude: point1.longitude },
	        { latitude: point2.latitude, longitude: point2.longitude },
	    ]
	});
	mapview.addRoute(line1);
}

function setDefaultRoute() {
	
	var url = 
		"http://maps.googleapis.com/maps/api/directions/json" + 
		"?origin=" + point1.latitude + "," + point1.longitude + 
	 	"&destination=" + point2.latitude + "," + point2.longitude + 
	 	"&sensor=true";
	 
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open('GET', url);
	Ti.API.info('URL: ' + url);
	 
	xhr.onload = function() {
	    Ti.API.info('inside the xhr-->' + this.responseText);
	    var xml = this.responseText;
	    var points = [];
	 
	    // Obtenemos todas las posiciones de la ruta
	    var position =
	        JSON.parse(this.responseText).routes[0].legs[0].steps;
	    
	    if (position[0] != null) {
	 
	        points.push({
	            latitude : position[0].start_location.lat,
	            longitude : position[0].start_location.lng,
	        });
	 
	      // Here we use the for loop to collect all the steps and push it to the array and use this array to form the route in android.
	 
	        for (var i = 0; i < position.length; i++) {
	 
		        points.push({
		            latitude : position[i].end_location.lat,
		            longitude : position[i].end_location.lng,
		        });
		    }
	    } else {
	        alert('no route');
	    }
	 
	    var route = Map.createRoute({
		    width: 4,
		    color: '#00f',
		    points: points
	    });
	    mapview.addRoute(route);
	};

	xhr.send();
}

 */


function setDefaultAccuracy(){
	
	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.Geolocation.purpose = 'Get Current Location';
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.distanceFilter = 10;
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
		/*
		Ti.Geolocation.addEventListener('location', function(e) {
			if (e.error) { alert('Error: ' + e.error); }
			else { Ti.API.info(e.coords); }
		});
		*/  
	} else { alert('Please enable location services'); }
	
}



function setMapPosition() {
	
	if (Ti.Geolocation.locationServicesEnabled) {
	    Ti.Geolocation.getCurrentPosition(function(e) {
	        if (e.error) { Ti.API.error('Error: ' + e.error); }
	        else { 
	        	Ti.API.info(e.coords);
	        	var region={latitude:37.7261475};
	        	mapview.setRegion(region);
	        	//mapview.setLocation({latitude:e.coords.latitude,longitude:e.coords.longitude,latitudeDelta:1,longitudeDelta:1,animate:true,});
	        	mapview.setLocation({latitude: 41.7261475, longitude: 1.6430278,latitudeDelta:1,longitudeDelta:1,animate:true,});
	        	}
	    });
	} else { alert('Please enable location services'); }
}

function onMapComplete() {
	
	setDefaultAccuracy();
	getSetPositionButton();
//	getCurrentPosition();
//	getInitialMapPosition();
//	setDefaultAnnotations();
//	setDefaultLine();
//	setDefaultRoute();
}


////// INICIO VENTANA

var win = Ti.UI.createWindow({});

win.open();




// MAPA

var Map = require('ti.map');

var mapview = Map.createView({
    mapType: Map.NORMAL_TYPE,
    region: {
    	latitude: 41.7261475, longitude: 1.6430278,
        latitudeDelta: 8, longitudeDelta: 8, zoom:8
        
    },
    animate: true,
    regionFit: true,
    userLocation: false,
    //annotations: [point1, point2]
});
mapview.addEventListener('complete', function() {
	onMapComplete();
});
win.add(mapview);



//BOTON
function getSetPositionButton(){
	var button = Ti.UI.createView({
		backgroundColor:'brown',
		backgroundImage:'/assets/images/my-icons-collection/png/001-map.png',
		title:'Hola',
		width:50,
		height:50,
		bottom: 5,
		borderRadius:25,
	});
	
		
	button.addEventListener('click',function(){
		console.log('boton pulsado');
		setMapPosition();
		/*view.animate({
			duration:1000,
			left: 300,
			autoreverse: true,
		},function(){
			alert('acabe');
		});*/
	});
		
	win.add(button);	
}

