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
				id:$routeParams.markerId,
				_csrf:$(".csrf").val(),
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