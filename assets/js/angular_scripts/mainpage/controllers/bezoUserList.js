bezoMainMap.controller('bezoUserList',["$scope", "$http", function($scope,$http){

	$scope.newsBoxInit = function(){
		initFilter();

		$http({
			url:"/user/sendAll",
			method:"GET"
		}).success(function(data){
			$scope.userList = data;
			console.log($scope.userList);
		});

		$("#user-holder").modal('show');
		$('#user-holder').on('hidden.bs.modal', function () {
		    document.location = "/#";
		});
	};



}]);
