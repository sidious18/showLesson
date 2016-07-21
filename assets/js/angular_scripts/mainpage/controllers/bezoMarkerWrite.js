bezoMainMap.controller('bezoMarkerWrite', ['$scope','$http','$routeParams', 'Upload', function ($scope, $http, $routeParams, Upload) {
	console.log($routeParams);
    $scope.selectFiles = function(files) {
        $scope.files = files;
        console.log(files);
        if(files.length >= 5){
			$scope.files = $scope.files.slice(0, 5)
		}
    }
    $scope.uploadFiles = function(){
    	var uploadErrors = new Array();
    	if($(".title-input").val()==""){
			uploadErrors.push('Введите Заголовок')
		}
		if($(".place-input").val()==""){
			uploadErrors.push('Введите местоположение маркера')
		}
		if($(".xcoord-input").val()==""){
			uploadErrors.push("Введите широту");
		}
		if($(".ycoord-input").val()==""){
			uploadErrors.push("Введите долготу");
		}
		if($(".pictures-input").val()==""){
			uploadErrors.push("Загрузите фотографии");
		}
		if($(".description-input").val()==""){
			uploadErrors.push("Введите описание маркера");
		}
    	if(uploadErrors.length == 0){
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
					_csrf:$(".csrf").val(),
					files: $scope.files
				},
			}).then(function(){
				$("#send-marker").modal("hide");
			}, function(error){
				if(error.data != null){
					$(".error-notification").remove();
					$("body").append("<div class='error-notification'></div>");
					$(".error-notification").append(error.data.summary);
					setTimeout(function(){
			    		$(".error-notification").fadeOut(1000);
			    	},2000);
		    	}
			},
				function(){
					$("#send-marker").modal("hide");
				}
			);
	    }
	    else{
	    	$(".error-notification").remove();
	    	$("body").append("<div class='error-notification'></div>")
	    	for(i=0; i < uploadErrors.length; i++){
	    		$(".error-notification").append(uploadErrors[i] + "<br>");
	    	}
	    	setTimeout(function(){
	    		$(".error-notification").fadeOut(1000);
	    	},3000);
	    	
	    }
    }
    $('input[type=file]').val("");
}]);
