jQuery(document).ready(function($) {
    $(".pictures-input").change(function(event) {
		    var files, reader;
		    files = event.target.files;
		    files = Array.prototype.slice.call(files, 0, 5);
			for(i=0;i<files.length+1;i++){
				reader = new FileReader();
				reader.onload = function (event) {
					var exif, tags;
				    exif = new ExifReader();
				    exif.load(event.target.result);
				    tags = exif.getAllTags();
				    if(tags["GPSLatitude"].description && tags["GPSLongitude"].description){
				    	$(".xcoord-input").val(tags["GPSLatitude"].description);
				    	$(".ycoord-input").val(tags["GPSLongitude"].description);
				    	var geocoder = new google.maps.Geocoder;
					    geocoder.geocode({'location': new google.maps.LatLng(tags["GPSLatitude"].description,tags["GPSLongitude"].description),'language':'ru'}, function(results, status){
							$(".place-input").val(results[0].formatted_address)
						});
				    }
				    if(tags["GPSTimeStamp"].description){
				    	
				    	var dateAll = tags["DateTime"].description.split(" "); 
				    	dateTag = dateAll[0].split(":");
				    	time = dateAll[1].split(":");
				    	var date = new Date;
					    date.setFullYear(dateTag[0],dateTag[1],dateTag[2]);
					    date.setHours(time[0]);
					    date.setMinutes(time[1]);
					    date.setSeconds(time[2]);
					    setDate(date);
					    currentMarkerDate = date;
				    }
				};
			reader.readAsArrayBuffer(files[i].slice(0, 128 * 1024));
		}
	});
	$(".marker-holder, .close-marker").click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(".marker-holder").hide();
		$(".carousel li").removeClass('active');
		$(".carousel li:nth-child(1)").addClass('active');
	});
	$(".close-marker-send").click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(".send-marker-holder").hide();
	});
	$(".marker-holder div").click(function(e) {
		e.preventDefault();
        e.stopPropagation();
  	 });
	$(".send-marker-holder div, #send-marker div").click(function(e) {
        e.stopPropagation();
  	});
  	$(".cancel-info, .send-marker-holder, #send-marker").click(function(event){
  		clearSendMarker()
  	});
  	$(".cancel-info, .send-marker-holder").click(function(event){
  		clearSendMarker()
  	});
});
function clearSendMarker(event){
	$(".title-input").val("");
  	$(".place-input").val("");
  	$(".xcoord-input").val("");
  	$(".ycoord-input").val("");
  	$(".pictures-input").val("");
  	$(".description-input").val("");
  	$(".pictures-input").val("");
  	$("#send-marker").modal("hide");
}
function setToday (year,month,day,hour,minute,second){
	var today = new Date();
	$(year).val(today.getFullYear());
	$(month).val(today.getMonth()+1);
	$(day).val(today.getDate());
	$(hour).val(today.getHours());
	$(minute).val(today.getMinutes());
	$(second).val(today.getSeconds());
	checkDate.checkYear(year);
	checkDate.checkMonth(month);
	checkDate.checkDay(year,month,day);
	checkDate.checkHour(hour);
	checkDate.checkMinuteAndSecond(minute);
	checkDate.checkMinuteAndSecond(second);
}
function setPast (year,month,day,hour,minute,second){
	$(year).val("1001");
	$(month).val("01");
	$(day).val("01");
	$(hour).val("01");
	$(minute).val("01");
	$(second).val("01");
}
function setFuture (year,month,day,hour,minute,second){
	$(year).val("3999");
	$(month).val("12");
	$(day).val("30");
	$(hour).val("23");
	$(minute).val("59");
	$(second).val("59");
}
function setDate(date){
	$(".year").val(date.getFullYear());
	$(".month").val(date.getMonth()+1);
	$(".day").val(date.getDate());
	$(".hour").val(date.getHours());
	$(".minute").val(date.getMinutes());
	$(".second").val(date.getSeconds());
}
function getFullDate(year,month,day,hour,minute,second)
{
	var fullDate = $(year).val()+"-"+$(month).val()+"-"+$(day).val()+" "+$(hour).val()+":"+$(minute).val()+":"+$(second).val();
	return fullDate;
}
var checkDate ={
	checkHour:function(hour){
		if($(hour).val() < 24 && $(hour).val()>0){$(hour).val(Math.round($(hour).val()));}
		else if($(hour).val() < 0) $(hour).val("1");
		else if ($(hour).val() >= 24) ($(hour).val("23"));
		else $(hour).val("12");
		if ($(hour).val()>=1 && $(hour).val()<=9){
			$(hour).val("0"+$(hour).val());
		}
	},
	checkMinuteAndSecond: function(minuteOrSecond){
		if($(minuteOrSecond).val() < 60 && $(minuteOrSecond).val()>0){$(minuteOrSecond).val(Math.round($(minuteOrSecond).val()));}
		else if($(minuteOrSecond).val() < 0) $(minuteOrSecond).val("1");
		else if ($(minuteOrSecond).val() >= 60) ($(minuteOrSecond).val("59"));
		else $(minuteOrSecond).val("30");
		if ($(minuteOrSecond).val()>=1 && $(minuteOrSecond).val()<=9){
			$(minuteOrSecond).val("0"+$(minuteOrSecond).val());
		}
	},
	checkMonth: function(month){
		if($(month).val() < 12 && $(month).val()>0){$(month).val(Math.round($(month).val()));}
		else if($(month).val() < 0) $(month).val("1");
		else if ($(month).val() >= 12) ($(month).val("12"));
		else $(month).val("6");
		if ($(month).val()>=1 && $(month).val()<=9){
			$(month).val("0"+$(month).val());
		}
	},
	checkDay: function(year,month,day){
		var max;
		if($(month).val()=="1" || $(month).val()=="3" || $(month).val()=="5" || $(month).text()=="7" || $(month).text()=="9" || $(month).text()=="10" || $(month).text()=="12"){ max=31; }
		else if ($(month).val()=="2")
		{
			if($(year).val()%4 == 0)
			{
				max=29;
			}
			else 
			{
				max=28;
			}
		}
		else max=30;
		if($(day).val() < max && $(day).val()>0){$(day).val(Math.round($(day).val()));}
		else if($(day).val() < 0) $(day).val("1");
		else if ($(day).val() >= max) ($(day).val(max));
		else $(day).val("15");
		if ($(day).val()>=1 && $(day).val()<=10){
			$(day).val("0"+$(day).val());
		}
	},
	checkYear : function(year){
		$(year).blur(function(){
		if($(year).val() > 1000 && $(year).val() < 4000){
			$(year).val(Math.round($(year).val()));
		}
		else if($(year).val() <= 4000){
			$(year).val("2016");
		}
		else $(year).val("2016");

	});
	}
}
function initializeCheckDate(year,month,day,hour,minute,second){
	checkDate.checkYear(year);
	checkDate.checkMonth(month);
	checkDate.checkDay(year,month,day);
	checkDate.checkHour(hour);
	checkDate.checkMinuteAndSecond(minute);
	checkDate.checkMinuteAndSecond(second);
	$(year).blur(function(){
		checkDate.checkYear(year);
		checkDate.checkDay(year,month,day);
	});
	$(month).blur(function(){
		checkDate.checkMonth(month);
		checkDate.checkDay(year,month,day);
	});
	$(day).blur(function(){
		checkDate.checkDay(year,month,day);
	});
	$(hour).blur(function(){
		checkDate.checkHour(hour);
	});
  	$(minute).blur(function(){
		checkDate.checkMinuteAndSecond(minute);
	});
	$(second).blur(function(){
		checkDate.checkMinuteAndSecond(second);
	});
}

//Фильтр в таблице
(function(document) {
	'use strict';
	var LightTableFilter = (function(Arr) {
		var _input;
		function _onInputEvent(e) {
			_input = e.target;
			var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
			Arr.forEach.call(tables, function(table) {
				Arr.forEach.call(table.tBodies, function(tbody) {
					Arr.forEach.call(tbody.rows, _filter);
				});
			});
		}
		function _filter(row) {
			var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
			row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
		}
		return {
			init: function() {
				var inputs = document.getElementsByClassName('light-table-filter');
				Arr.forEach.call(inputs, function(input) {
					input.oninput = _onInputEvent;
				});
			}
		};
	})(Array.prototype);
	document.addEventListener('readystatechange', function() {
		if (document.readyState === 'complete') {
			LightTableFilter.init();
		}
	});
})(document);