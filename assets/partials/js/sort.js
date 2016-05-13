//инициализируем автокомплит
jQuery(document).ready(function($) {
	alert("AAA");
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
		if (!$(".show-select input").is(":checked")){
			$('.show-select input').click();
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

});