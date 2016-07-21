/**
 * MarkerController
 *
 * @description :: Server-side logic for managing markers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
	'new': function(req, res){
		res.locals.flash = _.clone(req.session.flash);
		req.session.flash={};
		res.view();
		
	},
	create: function(req,res,next){
		var Sync = require('synchronize');
		Marker.create(
			{
				title:req.body.title,
				place:req.body.place,
				xCoord:req.body.xCoord,
				yCoord:req.body.yCoord,
				description:req.body.description,
				date:req.body.date,
				type:req.body.type,
				img:[],
				creator:req.session.User.id
			}, 
			function markerCreate(err, marker){
				if(err){
					res.status(500).send(err);
					return;
				}
				var dirImage = '../../assets/markers/marker'+marker.id+'/images';
				var imagesList = [];
				var fs = require('fs');
				fs.mkdir(dirImage, 0744, function(err) {
				    if (err) {
				    	var ifFirst = true;
				    	if(err.code == "ENOENT"){
							
				    		for(i=0; i<=4; i++){	    			
							    req.file('files'+"["+i+"]").upload({dirname: dirImage}, function (err, files) {
								   	if(files[0] != undefined){
										if(ifFirst){
											ifFirst = false;
											Marker.publishCreate({
											    id: marker.id,
											    title: marker.title,
											    place: marker.place,
											    xCoord: marker.xCoord,
											    yCoord: marker.yCoord,
											    date: marker.date,
											    type: marker.type
											}); 
										}
										marker.img.push('/markers/marker'+marker.id+'/images/' + files[0].fd.split('/')[files[0].fd.split('/').length-1]);
										
										marker.save(function(error) {
										if(error) {
										        console.log(error);
										    } else {
										        //console.log(marker.img);        
										    }
										});
									}
									if (err)  return res.serverError(err);
								});
							}
				    	}
				    	else{
				    		res.status(500).send(err);
				    	}
				    }
				});
		});
	},
	getMarker: function(req,res){
		Marker.watch(req.socket);
		Marker.find({}, function(err, markers){
			res.send(markers);
			Marker.subscribe(req.socket,markers);
		});
	},
	openMarker: function(req,res){
		Marker.findOne({id:req.body.id},function(err, marker){
			if(err) console.log(err);
			res.send(marker);
		})
	}
};