(function(){

	var app = angular.module('finpo',[]);



	app.controller('apiController',['$scope','$http','$timeout',function($scope,$http,$timeout){

		$scope.apis = [];
		$scope.apiData = {};
		$scope.Category = '';
		$scope.apiId = '';

		if(window.location.hash){
			var hash = window.location.hash ;
			hash = hash.replace('#','');
			$http.get('/api/'+hash).success(function(res){
				$scope.apis = res.api ;
				$scope.apiId = res._id ;
			});
		}

		$scope.deleteApi = function(data){
			if(!confirm("delete this API ?")){
				return false ;
			}

			angular.forEach( $scope.apis ,function(value){
				angular.forEach( value.api , function(api,index){
					if( api == data){
						value.api.splice(index,1);
					}
				});
			});
		}

		$scope.doUpdate = function(){
			$http.put('/api/'+$scope.apiId,$scope.apis).success(function(res){
				if(res.success){
					alert('update success');
				}else{
					alert('something went wrong');
				}
			});
		};

		$scope.doSave = function(){
			$http.post('/api',$scope.apis).success(function(res){
				console.log(res);
				if(res.success){
					$scope.apiId = res.api._id ;
					location.replace("#"+res.api._id);
					alert('save success');
				}else{
					alert('something went wrong');
				}
			});
		};

		$scope.createApi = function(){
			var error = false ;
			if(!$scope.apiData.category){
				error = true;
			}
			if(!$scope.apiData.path){
				error = true ;
			}
			if(!$scope.apiData.method){
				error = true ;
			}
			if(error){
				return false ;
			}

			var exitData = _.find($scope.apis,{category : $scope.apiData.category});
			if(exitData){
				exitData.api.push({
					path : $scope.apiData.path ,
					desc : $scope.apiData.desc ,
					method : $scope.apiData.method
				});
			}else{
				$scope.apis.push({
					category : $scope.apiData.category ,
					api : [{
						path : $scope.apiData.path ,
						desc : $scope.apiData.desc ,
						method : $scope.apiData.method
					}]
				});
			}
			delete $scope.apiData.desc;
			$('#myModal').modal('hide');
		};

		$scope.deleteCategory = function(category){
			if(!confirm("delete this category ? [ "+category+" ]")){
				return false ;
			}
			angular.forEach($scope.apis,function(value,index){
				if(value.category == category){
					$scope.apis.splice(index,1);
				}
			});
		};

		$scope.filterCategory = function(category){
			$scope.Category = category ;
		};
	}]);

})();