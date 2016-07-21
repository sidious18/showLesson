var bezoMainMap = angular.module('bezoMainMap',[initialize,'ngFileUpload','ngRoute','luegg.directives']);
var URL;
var availableTags = new Array();

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

bezoMainMap.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/marker/:markerId', {
        templateUrl: '/partials/marker.html'
      })
      .when('/sort', {
        templateUrl: '/partials/sort.ejs'
      })
      .when('/news', {
        templateUrl: '/partials/fresh-news.html'
      })
      .when('/markerslist', {
        templateUrl: '/partials/markers-list.ejs'
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
