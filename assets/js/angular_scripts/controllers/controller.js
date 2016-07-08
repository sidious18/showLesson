var bezoMainMap = angular.module('bezoMainMap',[initialize,'ngFileUpload','ngRoute','luegg.directives']);
var URL;

bezoMainMap.directive("sortMarker", function() {
    return {
    	restrict : "C",
        templateUrl : "/partials/sort.ejs"
    };
});
bezoMainMap.directive("freshNews", function() {
    return {
    	restrict : "C",
        templateUrl : "/partials/fresh-news.html"
    };
});
bezoMainMap.directive("createMarker", function() {
    return {
    	restrict : "C",
        templateUrl : "/partials/create-marker.html"
    };
});

bezoMainMap.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
 });
bezoMainMap.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
        	var ifFirst = true;
            element.bind('load', function() {
                element.parent().removeClass('uploading')
                element.css('visibility', 'visible');
            });
            element.bind('error', function(){
            	element.parent().attr("class", "uploading");
            	element.css('visibility', 'hidden');
                setTimeout(function(){
                	attrs.$set('src', attrs.ngSrc);
        		}, 2000);
            });
        }
    };
});
bezoMainMap.controller('bezoMarkerShow',['$scope', '$http', '$compile', '$routeParams', function($scope,$http,$compile,$routeParams){
	$scope.loadJson = function(){
		i=1;
		createdLast=false;
		$("#marker-holder").modal('show');
		$('#marker-holder').on('hidden.bs.modal', function () {
		    document.location = "/#";
		});
		$http({
			url:"/marker/openMarker",
			method:"post",
			data:{
				id:$routeParams.markerId
			}
		}).success(function(data){
			$scope.markerData = data;
			$scope.pictureList = new Array($scope.markerData.img.length);
			$scope.pictureList[0] = $scope.markerData.img[0];
			$scope.markerTitle = data.title;
			$scope.markerPlace = data.place;
			$scope.markerCoordX = data.xCoord;
			$scope.markerCoordY = data.yCoord;
			$scope.markerDescription = data.description;
			$scope.markerType = data.type;
			$scope.markerDate = data.date;
            $scope.markerID = data.id;
			console.log(data);
		});
	}
	$scope.nextImage = function(){
		if(i==($scope.markerData.img.length))
		{
			$(".carousel div:nth-child("+i+")").removeClass("active");
			i=1;
			$(".carousel div:nth-child("+i+")").addClass("active");
		}
		else if($scope.pictureList[i]==undefined){
			$(".carousel div:nth-child("+i+")").removeClass("active");
		   	$scope.pictureList[i] = ($scope.markerData.img[i]);
		   	i++;
		   	$(".carousel div:nth-child("+i+")").addClass("active");
		}		
		else if($scope.pictureList[i]!=undefined){
			$(".carousel div:nth-child("+i+")").removeClass("active");
			i++;
			$(".carousel div:nth-child("+(i)+")").addClass("active");
		}
	}
	$scope.prevImage=function(){
		if(i==1)
		{
			if (!createdLast)
			{
				$scope.pictureList[$scope.pictureList.length-1] = ($scope.markerData.img[$scope.pictureList.length-1]);
				i = $scope.pictureList.length;
				$(".carousel li:nth-child(1)").removeClass("active");
				$(".carousel li:nth-child("+i+")").addClass("active");
				createdLast = true;
			}
			else 
			{
			$(".carousel li:nth-child("+i+")").removeClass("active");
			i=$scope.pictureList.length;
			$(".carousel li:nth-child("+i+")").addClass("active");
			}
		}
		else if($scope.pictureList[i-2]==undefined){
			$(".carousel li:nth-child("+i+")").removeClass("active");
			i--;
			$scope.pictureList[i-1] = ($scope.markerData.img[i-1]);
			$(".carousel li:nth-child("+i+")").addClass("active");   	
		}		
		else if($scope.pictureList[i-2]!=undefined){
			$(".carousel li:nth-child("+i+")").removeClass("active");
			i--;
			$(".carousel li:nth-child("+i+")").addClass("active");
		}		
	}
}]);


bezoMainMap.controller('bezoMarkerSort',['$scope', '$http', '$compile', '$routeParams', function($scope,$http,$compile,$routeParams){
	$scope.initSort = function(){
		$("#sort-holder").modal('show');
		$('#sort-holder').on('hidden.bs.modal', function () {
		    document.location = "/#";
		});

		$( ".input-autocompliete" ).autocomplete({
		    source: availableTags,
		    select: function( event, ui ){
		      	for(i=0;i<=allMarkers.length-1;i++){
		      		if(ui.item.value==allMarkers[i].markerPlace){
		      			var setMap = new google.maps.LatLng(allMarkers[i].xCoord,allMarkers[i].yCoord)
		      			map.setCenter(setMap);
		     			map.setZoom(18);
		     			allMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
		     			$("#sort-marker").modal("hide");
		      			break;
		      		}
		     	}
		    }
		});
		//Очищаем Автозаполнение на клик
		$(".input-autocompliete").click(function(){
			$(".input-autocompliete").val("");
		});
		//метод сортировки маркеров по типу
		function sortType(event,checker){
			for (i=0;i<allMarkers.length;i++){
				if(allMarkers[i].dateVisible){
					if(allMarkers[i].markerType==event&&checker.length==0){
						allMarkers[i].setVisible(false);
						availableTags[i]="";
						allMarkers[i].visibleEvent=false;
						$( ".input-autocompliete" ).autocomplete({
			      			source: availableTags,
			      			messages: {
						        noResults: '',
						        results: function() {}
						    }
			      		})
			      		//скрываем в ленте описание маркера
			      		$("#"+allMarkers[i].markerID).addClass('hidden');
					}
					else if (allMarkers[i].markerType==event){
						allMarkers[i].setVisible(true);
						availableTags[i] = allMarkers[i].markerPlace;
						allMarkers[i].visibleEvent=true;
						//показываем в ленте описание маркера
						$("#"+allMarkers[i].markerID).removeClass('ng-hide');
						$("#"+allMarkers[i].markerID).removeClass('hidden');
					}
				}
			}
			$( ".input-autocompliete" ).autocomplete({
				source: availableTags
			})
		}
		//Делаем все чекбоксы включенными
		uncheckSortCheckbox();
		//привязываем событие сортировки к чекбоксу
		$(".show-select input").click(function(){
			//формируем цикл из чекбоксов
			for (j=0; j<$(".show-select input").length; j++){
				sortType($(".show-select input")[j].id,$("#"+$(".show-select input")[j].id+":checked"));
			}
		});
		//Устанавливаем сегодняшнюю дату инпутам по дате
		setPast(".from-year",".from-month",".from-day",".from-hour",".from-minute",".from-second");
		setFuture(".to-year",".to-month",".to-day",".to-hour",".to-minute",".to-second");
		//Инициализируем проверку правильности ввода даты
		initializeCheckDate(".from-year",".from-month",".from-day",".from-hour",".from-minute",".from-second");
		initializeCheckDate(".to-year",".to-month",".to-day",".to-hour",".to-minute",".to-second");
		//Очищаем инпут даты по клику
		$(".search-date-input input").click(function(){
			$(this).val("");
		});
		//Запускаем поиск по дате на клик
		$(".search-date").click(function(){
			dataSearch();
			$("#sort-marker").modal("hide");
		});

		function dataSearch(){
			var from = getFullDate(".from-year",".from-month",".from-day",".from-hour",".from-minute",".from-second");
			var to = getFullDate(".to-year",".to-month",".to-day",".to-hour",".to-minute",".to-second");
			if (from>to){
				var changer = from;
				from = to;
				to = changer;
			}
			for (i=0;i<allMarkers.length;i++)
			{
				if(allMarkers[i].visibleEvent==true){
					if(allMarkers[i].markerDate>from && allMarkers[i].markerDate<to){
						allMarkers[i].setVisible(true);
						allMarkers[i].dateVisible = true;
						availableTags[i] = allMarkers[i].markerPlace;
						//показываем в ленте описание маркера
						$("#"+allMarkers[i].markerID).removeClass('ng-hide');
						$("#"+allMarkers[i].markerID).removeClass('hidden');
					}
					else
					{
						allMarkers[i].setVisible(false);
						allMarkers[i].dateVisible = false;
						availableTags[i]="";
						//скрываем в ленте описание маркера
			      		$("#"+allMarkers[i].markerID).addClass('hidden');
					}
				}			
			}
			$( ".input-autocompliete" ).autocomplete({
			  	source: availableTags
			});
		}

		//Сбрасываем сортировку
		$(".reset-all").click(function(){
			$(".news-feed tr").removeClass('ng-hide');
			$(".news-feed tr").removeClass('hidden');
			$("#sort-marker").modal("hide");
			uncheckSortCheckbox();
			setPast(".from-year",".from-month",".from-day",".from-hour",".from-minute",".from-second");
			setFuture(".to-year",".to-month",".to-day",".to-hour",".to-minute",".to-second");
			availableTags=new Array();
			for(i=0;i<=allMarkers.length-1;i++){
				allMarkers[i].setVisible(true);
			    allMarkers[i].dateVisible = true;
			    allMarkers[i].visibleEvent = true;
			   	allMarkers[i].showInfo = true;
			    allInfos[i].close();
			    availableTags.push(allMarkers[i].markerPlace);
			}
			$( ".input-autocompliete" ).autocomplete({
			    source: availableTags
			})
		});
		//Скрыть форму сортировки
		$(".sort-holder-ok").click(function(event) {
			$("#sort-marker").modal("hide");
		});
		function uncheckSortCheckbox(){
			console.log($(".show-select input"))
			for (i=0; i < $(".show-select input").length; i++){
				console.log($(".show-select input").length);
				$('.show-select input')[i].checked = true;
			}
			if ($("#real-time").is(":checked")){
				$('#real-time').click();
			}
		};

		$('#real-time').click(function(){
			if ($("#real-time").is(":checked")){
				dataSearch();
				setToday(".to-year",".to-month",".to-day",".to-hour",".to-minute",".to-second");
				realTimer = setInterval(function() { setToday(".to-year",".to-month",".to-day",".to-hour",".to-minute",".to-second"); }, 1000);
			}
			else{
				setFuture(".to-year",".to-month",".to-day",".to-hour",".to-minute",".to-second");
				clearInterval(realTimer);
				dataSearch();
			}
		});
	};
}]);

var availableTags = new Array();
bezoMainMap.controller('bezoMarkerSet',["$scope", "$http", function($scope,$http){

	$scope.newsBoxInit = function(){
		initFilter();
		$("#news-holder").modal('show');
		$('#news-holder').on('hidden.bs.modal', function () {
		    document.location = "/#";
		});
	};

	$scope.socketInit = function(){
		io.socket.on('connect', function(){
		   io.socket.get('/marker/getMarker', function(data){
		   	$scope.markers = data;
		   	$(".news-date").click();
		   	for(var i=0; i < data.length; i++){
		   		addMarker(data[i].xCoord,data[i].yCoord,data[i].id,data[i].title,data[i].type,data[i].date,data[i].place,true,true);
		   		availableTags.push(data[i].place);
		   	}
		   });
		   io.socket.on('marker', function(marker){
		     addMarker(marker.data.xCoord,marker.data.yCoord,marker.data.id,marker.data.title,marker.data.type,marker.data.date,marker.data.place,true,true);
		   });
		});
		io.socket.on('disconnect', function(){
		   console.log('Lost connection to server');
		});
	}
	$scope.orderer="date";
	$scope.newsOrder = function(orderer){
		console.log("AAA");
		$scope.orderer = orderer;
	}
	$scope.markerLink = function(message){
		$("#news-holder").click();
		$('#news-holder').on('hidden.bs.modal', function () {
		    document.location = "/#"+message;
		});
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
bezoMainMap.controller('bezoMarkerWrite', ['$scope','$http','$routeParams', 'Upload', function ($scope, $http, $routeParams, Upload) {
	console.log($routeParams);
    $scope.selectFiles = function(files) {
        $scope.files = files;
        console.log(files);
        if(files.length >= 5){
			$scope.files = $scope.files.slice(0, 5)
		}
    }
    $scope.uploadFiles = function(markerName){
    	var ifImage = false;
    	if($(".title-input").val()==""){
			console.log("Введите заголовок маркера");
		}
		else if($(".place-input").val()==""){
			console.log("Введите местоположение маркера");
		}
		else if($(".xcoord-input").val()==""){
			console.log("Введите широту");
		}
		else if($(".ycoord-input").val()==""){
			console.log("Введите долготу");
		}
		else if($(".pictures-input").val()==""){
			console.log("Загрузите фотографии");
		}
		else if($(".description-input").val()==""){
			console.log("Введите описание маркера");
		}
    	else{
    		//clearSendMarker();
    		Upload.upload({
				url: '/marker/create',
				data:{
					title:$(".title-input").val(),
					place:$(".place-input").val(),
					xCoord:$(".xcoord-input").val(),
					yCoord:$(".ycoord-input").val(),
					description:$(".description-input").val(),
					date:getFullDate(".year",".month",".day",".hour",".minute",".second"),
					type:$(".choose-type").find('option:selected').attr("name"),
					files: $scope.files
				},
			});
	    }
    }
    $('input[type=file]').val("");
}]);
var URL;
bezoMainMap.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/messages', {
        templateUrl: '/partials/message-box.html'
      })
      .when('/marker/:markerId', {
        templateUrl: '/partials/marker.html'
      })
      .when('/sort', {
        templateUrl: '/partials/sort.ejs'
      })
      .when('/news', {
        templateUrl: '/partials/fresh-news.html'
      })
      .otherwise({
        redirectTo: function (routeParams, path, search) {
        if(path!="/"){
        	URL = path;
        }
        markerLink(path);
      }
      });
  }]);
function markerLink(path){
	if(path!="/")
	{
		for(i=0;i<=allMarkers.length-1;i++){
	      	if(path.substring(1)==allMarkers[i].markerID){
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

