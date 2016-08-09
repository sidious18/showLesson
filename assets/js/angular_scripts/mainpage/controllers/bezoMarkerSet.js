bezoMainMap.controller('bezoMarkerSet',["$scope", "$http", 'sharedProperties', function($scope,$http,sharedProperties){
	$scope.socketInit = function(){
		io.socket.on('connect', function(){
		   io.socket.get('/marker/getMarker', function(data){
		   	$scope.markers = data;
		   	$(".news-date").click();
		   	for(var i=0; i < data.length; i++){
		   		addMarker(data[i].xCoord,data[i].yCoord,data[i].id,data[i].title,data[i].type,data[i].date,data[i].place,true);
		   		sharedProperties.setMarkerPlaces(data[i].place);
		   		sharedProperties.setMarkerID(data[i].id);
		   		console.log(sharedProperties.getMarkerID()[i]);
		   		console.log(sharedProperties.getMarkerPlaces()[i]);
		   	}
		   });
		   io.socket.on('marker', function(marker){
		   	console.log(marker);
		     addMarker(marker.data.xCoord,marker.data.yCoord,marker.data.id,marker.data.title,marker.data.type,marker.data.date,marker.data.place,true);
		     sharedProperties.setMarkerPlaces(data[i].place);
		     sharedProperties.setMarkerId(data[i].id);
		     $scope.markers.push(marker);
		   });
		});
		io.socket.on('disconnect', function(){
		   console.log('Lost connection to server');
		});
	}
	$scope.orderer="date";

	$scope.newsBoxInit = function(){
		initFilter();
		$("#news-holder").modal('show');
		$('#news-holder').on('hidden.bs.modal', function () {
		    document.location = "/#";
		});
	};

	$scope.showMyMarkers = function(){
		$scope.activeTab = 3;
		$scope.activePartial = 'partials/markers-list.ejs';
		$http({
			url:"/user/mymarkers",
			method:"GET"
		}).success(function(data){
			$scope.myMarkers = data;
		});
	}

	$scope.newsOrder = function(orderer){
		$scope.orderer = orderer;
	}

	$scope.markerLink = function(message){
		$("#news-holder").click();
		$('#news-holder').on('hidden.bs.modal', function () {
		    document.location = "/#"+message;
		});
	}

	$scope.activeTab = 1;



	$scope.showMyNews = function(){
		$scope.activeTab = 1;
		$scope.activePartial = null;
	}

	$scope.showMySettings = function(){
		$scope.activeTab = 2;
		$scope.activePartial = 'partials/sort.ejs';
	}

	$scope.showMySubscrubers = function(){
		$scope.activeTab = 4;
	}

	$scope.checkActiveTab = function(number){
		if (number === $scope.activeTab){
			return true
		}
		else{
			return false
		}

	}

	/*function getMarkers() {

		$http({
			method: "post",
			url: "/controllers/getMarkers.js",
			data:{
				First:ifFirst
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).success(function(data){
			if($scope.markers.length!=data.length){
				$scope.markersNumber = $scope.markers.length; 
				console.log(ifFirst);
				if(ifFirst=="true"){
					$scope.markers = data;
					console.log(data);
				}
				else{
					if (data!=""){
						$scope.markers=$scope.markers.concat(data);
						console.log($scope.markers);
					}
				}
				for ($scope.markersNumber; $scope.markersNumber!=$scope.markers.length; $scope.markersNumber++){

					//Создаем переменную, определяющую видимость маркера
					$scope.markers[$scope.markersNumber].visible = true;
					console.log($scope.markers[$scope.markersNumber].visible);
					if(ifFirst=="false"){
						//определеяем подходит ли тип маркера под текущие настройки
						var from = getFullDate(".from-year",".from-month",".from-day",".from-hour",".from-minute",".from-second");
						var to = getFullDate(".to-year",".to-month",".to-day",".to-hour",".to-minute",".to-second");
						if (from>to){
							var changer = from;
							from = to;
							to = changer;
						}	
						for (i=0; i<$(".show-select input").length; i++){
					        if($("#"+$(".show-select input")[i].id+":checked").val()!="on" && $scope.markers[$scope.markersNumber].markerType  == $(".show-select input")[i].id){
					        	availableTags.push("");
					        	$scope.markers[$scope.markersNumber].visible = false;
					        	break;
					        }
					    }
					    if($scope.markers[$scope.markersNumber].visible){
							if(!($scope.markers[$scope.markersNumber].markerDate>from && $scope.markers[$scope.markersNumber].markerDate<to)){
								$scope.markers[$scope.markersNumber].visible = false;
							}
						}
						if ($scope.markers[$scope.markersNumber].visible){
					    	availableTags.push($scope.markers[$scope.markersNumber].markerPlace);
					    	$("#"+$scope.markerID).hide();
					    	console.log($("#"+$scope.markers[$scope.markersNumber].markerID));
					    }
				    }
				    else{
				    	availableTags.push($scope.markers[$scope.markersNumber].markerPlace);
				    }
				    addMarker($scope.markers[$scope.markersNumber].markerCoordX,$scope.markers[$scope.markersNumber].markerCoordY,$scope.markers[$scope.markersNumber].markerID,$scope.markers[$scope.markersNumber].markerTitle,$scope.markers[$scope.markersNumber].markerType,$scope.markers[$scope.markersNumber].markerDate,$scope.markers[$scope.markersNumber].markerPlace,ifFirst,$scope.markers[$scope.markersNumber].visible);
				}
				if(URL!="/"&&typeof URL!=="function" && ifFirst=="true")
				{
					for(i=0;i<=allMarkers.length-1;i++){
				      	if(URL.substring(1)==allMarkers[i].markerID){
				      		map.setZoom(18);
				      		var setMap = new google.maps.LatLng(allMarkers[i].xCoord,allMarkers[i].yCoord)
				      		map.setCenter(setMap);
				     		map.setZoom(18);
				     		allMarkers[i].setVisible(true);
				     		allMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
				      		break;
				    	}
				    }
				}
			}
			ifFirst = "false";
			getMarkers();
		})
		.error(function(data){
			getMarkers();
		});
	}
	getMarkers($scope.markers);*/
}]);