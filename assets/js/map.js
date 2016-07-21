var currentMarker;
var allMarkers = new Array();
var allInfos = new Array();
var ifRedirect = true;
function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(49.988222,36.233948),
    zoom:12,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    disableDoubleClickZoom: true
  };
  map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
  google.maps.event.addListener(map, "rightclick", function(event) {
    hideAllInfos();
    document.location = "/#";
  });
  google.maps.event.addListener(map, "dblclick", function(event) {
    var geocoder = new google.maps.Geocoder;
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var markerDate = new Date();
    $(".xcoord-input").val(lat.toFixed(6));
    $(".ycoord-input").val(lng.toFixed(6));
    setDate(markerDate);
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    geocoder.geocode({'location': latlng,'language':'ru'}, function(results, status){
       if(results[0]!=undefined){
          $(".place-input").val(results[0].formatted_address);
       }
       else{
          $(".place-input").val("Неведомая дичь!");
       }
    });
    $(".send-marker-holder").css('display', 'block');
    initializeCheckDate(".year",".month",".day",".hour",".minute",".second");
    $("#send-marker").modal();
  });
}
function addMarker(xCoord,yCoord,id,title,type,date,place,visibility){
	//Инициализируем положение маркера
  var myCenter=new google.maps.LatLng(xCoord,yCoord);
  //Инициализируем всплывающий тайтл
  var infowindow = new google.maps.InfoWindow({
    content: title
  }); 
	var marker=new google.maps.Marker({
  	position:myCenter,
    animation: google.maps.Animation.DROP,
    markerID: id,
    markerTitle: title,
    markerType: type,
    markerDate: date,
    markerPlace: place,
    xCoord:xCoord,
    yCoord:yCoord,
    dateVisible: true,
    visibleEvent: true,
    showInfo:true
	  });
  //скрываем маркер, если не прошел сортировку
  if(!visibility){
    marker.setVisible(false);
  }

  allMarkers.push(marker);
  allInfos.push(infowindow);

	google.maps.event.addListener(marker,'click',function() {
      marker.setAnimation(null);
      if(marker.showInfo){
        infowindow.open(map, marker);
        marker.showInfo = false;
        ifRedirect = false; 
        var obj = { Title: "as", Url: "/#/"+marker.markerID };
        history.pushState(obj, obj.Title, obj.Url);
      }
      else{
        hideAllInfos();
        marker.showInfo = true;
        document.location = "/#/marker/"+marker.markerID;
      }
  	});
	marker.setMap(map);
}

function hideAllInfos(){
  for (i=0;i<allInfos.length;i++)
    {
      allInfos[i].close();
      allMarkers[i].setAnimation(null);
      allMarkers[i].showInfo = true;
    }
}