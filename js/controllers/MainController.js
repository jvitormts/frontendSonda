app.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.selectedItem;

    $scope.getData = function() {
		$scope.loading = true;
		$http.get("http://localhost:8080/aeronaves/")
		.then(function(response){ 
			$scope.details = response.data;
			$scope.loading = false;
            console.log($scope.details);
            $scope.getDecades();
            $scope.getCurrentWeekData();
            $scope.getMarcasQtd();
		});
	}	

    $scope.getIconClass = function(item) {
        if(item){
            return 'bi bi-check-circle-fill';
        }else{
            return 'bi bi-x-square';
        }
    }

    $scope.getButtonClass = function(item) {
        if(item){
            return 'btn btn-success';
        }else{
            return 'btn btn-warning';
        }
    }

    $scope.selectItem = function(item) {
        $scope.selectedItem = item;
        $scope.editForm = {
            nome: item.nome,
            marca: item.marca,
            ano: item.ano,
            vendido: item.vendido
        }
    }

    $scope.getMarcasQtd = function() {
       $scope.embraer = $scope.details.filter(function (el) {
        return el.marca == "Embraer";
      });
      $scope.boeing = $scope.details.filter(function (el) {
        return el.marca == "Boeing";
      });
      $scope.airbus = $scope.details.filter(function (el) {
        return el.marca == "Airbus";
      });
    }

    $scope.getDecades = function() {
        $scope.decades = new Array();
        $scope.decadesAux= new Array();
        $scope.details.forEach(function(item, indice){            
        var year = item.ano;
        var decade = year.toString().substring(2,3) + "0";
        if ($scope.decades.hasOwnProperty( decade )) {
            $scope.decades[ decade.toString() ].push(year);
        } else {
            $scope.decadesAux.push(decade.toString());
            $scope.decades[ decade.toString() ] = [ year ];
        }
        });
    }

    $scope.getCurrentWeekData = function(){
        $scope.qntWeek = 0;
        var now = moment();
        $scope.details.forEach(function(item, indice){       
            var input = moment(item.created);
            if(now.isoWeek() == input.isoWeek()){
                $scope.qntWeek++;
            }
            });
    }

    $scope.delete = function(id) {
		$scope.loading = true;
		$http.delete("http://localhost:8080/aeronaves/"+id)
		.then(function(response){ 
			$scope.status = response.status;
            console.log($scope.status);
            $scope.getData();
		});
	}
    
    $scope.save = function(id) {
		$scope.loading = true;
        if($scope.myForm == undefined || !$scope.validate($scope.vm.myForm)){
            alert("preencha todos os campos");
            return;
        }
		$http.post("http://localhost:8080/aeronaves/", $scope.myForm
        )
		.then(function(response){ 
			$scope.status = response.status;
            console.log($scope.status);
            $scope.getData();
		});
	}

    $scope.edit = function(id) {
		$scope.loading = true;
		$http.put("http://localhost:8080/aeronaves/"+id, $scope.editForm
        )
		.then(function(response){ 
			$scope.status = response.status;
            console.log($scope.status);
            $scope.getData();
		});
	}

    $scope.validate = function(form) {
        console.log(form.marca.$valid);
        console.log(form.nome.$valid);
        console.log(form.ano.$valid);
        console.log(form.vendido.$valid);
        if(form.marca.$valid && form.nome.$valid && form.ano.$valid && form.vendido.$valid){
            return true;
        }else {
            return false;
        }
    }

    $scope.filter = function( searchParameter ) {
        return function( item ) {
          return typeof searchParameter == 'undefined' || searchParameter == '' || item.id == searchParameter || item.nome.includes(searchParameter);
        };
      };

    $scope.getData();
    
  }]);