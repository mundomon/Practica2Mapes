var point1, point2;
var isHiddenTown=true;
var isHiddenSimbol=true;
var isHiddenPosition=true;
var mapLoaded=false;
var climaArray=[];
var townArray=[];
var myPositionAnnotation;


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
	if(isHiddenPosition){
		if (Ti.Geolocation.locationServicesEnabled) {
		    Ti.Geolocation.getCurrentPosition(function(e) {
		        if (e.error) { Ti.API.error('Error: ' + e.error); }
		        else { 
		        	Ti.API.info(e.coords);
		        	//mapview.setLocation({latitude:e.coords.latitude,longitude:e.coords.longitude,latitudeDelta:1,longitudeDelta:1,animate:true,});
		        	mapview.setLocation({latitude: 41.7261475, longitude: 1.6430278,latitudeDelta:1,longitudeDelta:1,animate:true,});
		        	var point = Map.createAnnotation({
						title: 'Me',
						latitude: 41.7261475, 
						longitude: 1.6430278,
						pincolor: Map.ANNOTATION_RED,
						image:'/assets/images/my-icons-collection/png/004-people.png',		
					});
					mapview.addAnnotation(point);
					myPositionAnnotation=point;
		        }
		    });
		} else { alert('Please enable location services'); }
		isHiddenPosition=false;
	}
	else{
		mapview.removeAnnotation(myPositionAnnotation);
		isHiddenPosition=true;
	}

}

function show_nice_towns(){
	//POBLES BONICS
	if(isHiddenTown){
		var nice_town_data = require('data/nice_town_data').data;
		//crear anotacion
		for (var i=0;i<nice_town_data.length;i++){
			var point = Map.createAnnotation({
				title: nice_town_data[i].name,
				latitude: nice_town_data[i].latitude, 
		    	longitude: nice_town_data[i].longitude,
				pincolor: Map.ANNOTATION_RED,
				//image:'/assets/images/nice_towns/'+nice_town_data[i].id+'.jpg',
				
			});
			var bubbleView= Ti.UI.createView({
				width:45,
				height:45
			});
			bubbleView.add( Ti.UI.createImageView({
			    image:'/assets/images/nice_towns/'+nice_town_data[i].id+'.jpg',
				width: 45,
				height: 45
			  }));
			
			point.setLeftView(bubbleView);
			mapview.addAnnotation(point);
			townArray.push(point);
		}
		isHiddenTown=false;
	}
	else{
		mapview.removeAnnotations(townArray);
		townArray=[];
		isHiddenTown=true;
	}
}

function paintSimbolData(dataSource){
	if(isHiddenSimbol){
		for(var i=0; i<dataSource.length && i<15;i++){
			
			var icono;		
			var position=dataSource[i].posicio;
			var lon=parseFloat(position.substr(position.indexOf('(')+1,position.indexOf(',')-1));
			var lat=parseFloat(position.substr(position.indexOf(',')+1,position.indexOf(')')-position.indexOf(',')-1));
			var codi=parseInt(dataSource[i].codi);
			
			if(codi==1){icono='1-clima.png';}
			else if(codi>1 && codi<=3){icono='2-clima.png';}
			else if(codi==4 || codi==20 || codi==21){icono='3-clima.png';}
			else if(codi>4 && codi<=7 || codi>=22 && codi<=26){icono='4-clima.png';}
			else if(codi>7 && codi<=9 || codi==31 || codi==32){icono='5-clima.png';}
			else {icono='6-clima.png';console.log('Simbol Codi: '+codi);}
			
			var point = Map.createAnnotation({
					latitude: lat, 
			    	longitude: lon,		    	
					image: '/assets/images/my-icons-collection/png/'+icono,
				});
			//console.log('lat: '+lat+' lon: '+lon+' title:'+dataSource[i].codi);	
			mapview.addAnnotation(point);
			climaArray.push(point);
		}	
		isHiddenSimbol=false;
	}
	else{
		mapview.removeAnnotations(climaArray);
		climaArray=[];
		isHiddenSimbol=true;
	}	
}


function getPrediction(day){
	var xhr = Ti.Network.createHTTPClient();
	var urlClima='http://static-m.meteo.cat/content/opendata/dadesobertes_pg.json';
	
	xhr.onload = function(){
		Ti.API.info('Data received: '+this.responseText);
		jsonClimaData=JSON.parse(this.responseText);
		var matiEstatDelCelData = jsonClimaData[day].versio.mati.simbols.estatDelCel;
		paintSimbolData(matiEstatDelCelData);
	};
	
	xhr.onerror = function(){
		alert('Connection error');
	};
	
	xhr.open('GET',urlClima);
	xhr.send();
}


function onMapComplete() {
	mapLoaded=true;
	setDefaultAccuracy();
//	getPrediction(0);

//	show_nice_towns();
//	getCurrentPosition();
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

//PIE PAGINA
var footer = Ti.UI.createView({
	height:50,
	bottom:0,
	width:180,
	layout:'horizontal'
});
win.add(footer);

getShowTownsButton();
getSetPositionButton();
getShowClimaButton();

//BOTONES
function getSetPositionButton(){
	var button = Ti.UI.createView({
		backgroundColor:'brown',
		backgroundImage:'/assets/images/my-icons-collection/png/001-map.png',
		borderColor: 'brown',
		width:50,
		height:50,
		left: 10,
		borderRadius:25,
	});
	button.addEventListener('click',function(){
		if(mapLoaded){setMapPosition();}
	});
		
	footer.add(button);	
}

function getShowTownsButton(){
	var button = Ti.UI.createView({
		backgroundColor: 'cyan',
		backgroundImage:'/assets/images/my-icons-collection/png/008-village-1.png',
		borderColor: 'white',
		width:50,
		height:50,
		left: 10,
		borderRadius:25,
	});
	
		
	button.addEventListener('click',function(){
		if(mapLoaded){show_nice_towns();}
	});
		
	footer.add(button);	
}

function getShowClimaButton(){
	var button = Ti.UI.createView({
		backgroundColor:'white',
		backgroundImage:'/assets/images/my-icons-collection/png/003-tornado.png',
		borderColor: 'green',
		width:50,
		height:50,
		left: 10,
		borderRadius:25,
	});
	
		
	button.addEventListener('click',function(){
		if(mapLoaded){getPrediction(0);}
	});
		
	footer.add(button);	
}




