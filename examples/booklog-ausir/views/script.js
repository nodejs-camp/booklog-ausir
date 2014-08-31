(function(){

	var app = angular.module('finpo',[]);

	app.controller('apiController',['$scope','$http',function(s,$http){
		s.categories = [];
		s.apis = [];

		s.apiData = {};

		s.apiData.method = "PUT";

		$http.get('/category').success(function(res){
			if(res.success){
				s.categories = res.rows ;
			}
		});

		s.createApi = function(){
			$http.post('/api/1',s.apiData).success(function(res){
				if(res.success){
					s.getApi();
					$('#myModal').modal('hide');

				}
			});
		};

		s.getApi = function(c_id){
			$http.get('/api/'+c_id).success(function(res){
				if(res.success){
					s.apis = res.rows;
				}
			});
		};
	}]);

})();