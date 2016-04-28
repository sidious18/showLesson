io.socket.on('connect', function(){
   io.socket.get('/marker/getMarker', function(data){
   	for(var i=0; i < data.length; i++){
         //добавляем маркеры
   		addMarker(data[i].xCoord,data[i].yCoord,data[i].id,data[i].title,data[i].type,data[i].date,data[i].place,true,true);
   	}
   });
   io.socket.on('marker', function(marker){
      console.log(marker);
      //console.log(marker.data.id);
      //console.log(marker.data.title);
     addMarker(marker.data.xCoord,marker.data.yCoord,marker.data.id,marker.data.title,marker.data.type,marker.data.date,marker.data.place,true,true);
   });
});
io.socket.on('disconnect', function(){
   console.log('Lost connection to server');
});