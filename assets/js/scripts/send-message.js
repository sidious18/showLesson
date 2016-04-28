bezoMainMap.controller('bezoSendMessage',function($scope,$http){
	$injector = angular.injector(['ng']);
	q = $injector.get('$q');
	var canceler = false;
	$scope.sendMessage = function(){                
		$http({
			method:"post",
			url:"php/send-message.php",
			data:{
				author:$(".author-name").val(),
				text:$(".author-message").val()
			}
		}).success(function(data){
		});
            $(".author-message").val("");
	}
	var ifFirst = "true";
	$scope.getMessages = function(){
		$http({
			method:"post",
			timeout: canceler.promise,
			url:"php/getMessages.php",
			data:{
				First:ifFirst
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).success(function(data){
			ifFirst = "false";
			$scope.messages = data;
			$scope.getMessages();
		});
	};
	$scope.cancel = function(){
		canceler = q.defer();
		canceler.resolve();
	};
});
