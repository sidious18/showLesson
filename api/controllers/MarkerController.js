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
		var sync = require('synchronize');
		Marker.create(
			{
				title:req.body.title,
				place:req.body.place,
				xCoord:req.body.xCoord,
				yCoord:req.body.yCoord,
				description:req.body.description,
				date:req.body.date,
				type:req.body.type,
				img:[]
			}, 
			function markerCreate(err, marker){
				if (err){
					console.log(err);
					req.session.flash = {
						err: err
					}
					res.serverError();
				}
				var dirImage = '../../assets/markers/marker'+marker.id+'/images';
				var imagesList = [];
				var fs = require('fs');
				var fileWay;
				var i = 0;
				fs.mkdir(dirImage, 0744, function(err) {
					
				    if (err) {
				    	if(err.code == "ENOENT"){
				    		async.map(['files[0]','files[1]','files[2]','files[3]','files[4]'], function(file, cb) {
								    req.file(file).upload({dirname: dirImage}, function (err, image) {
								    	fileWay = image[0].fd.split("/");
								    	marker.img.push("/markers/marker"+marker.id+"/images/"+fileWay[(fileWay.length - 1)]);
								        return (function(){
								        	i++;
								        	console.log(i);
								        	if (i==5){
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
								        })();
								    });
								}, function doneUploading(err, files) {
										Marker.publishCreate({
											id: marker.id,
											title: marker.title,
											place: marker.place,
											xCoord: marker.xCoord,
											yCoord: marker.yCoord,
											date: marker.date,
											type: marker.type
										});  
								       // If any errors occurred, show server error
								       if (err) {return res.serverError(err);}
 

								});
				    		/*
				    		sync.fiber(function() {
				    			req.file('files'+"["+0+"]").upload({dirname: dirImage});
				    			req.file('files'+"["+1+"]").upload({dirname: dirImage});
				    			req.file('files'+"["+2+"]").upload({dirname: dirImage});
				    			req.file('files'+"["+3+"]").upload({dirname: dirImage});
				    			Marker.publishCreate({
										id: marker.id,
										title: marker.title,
										place: marker.place,
										xCoord: marker.xCoord,
										yCoord: marker.yCoord,
										date: marker.date,
										type: marker.type
								});  
				    		});

				    		   
				    			


				    			//image.upload({dirname:dirImage}, function(err,files){
				    			//});
				    		     			
						    	req.file('files'+"["+i+"]").upload({dirname: dirImage}, function (err, files) {
							    	if(files[0] != undefined){
										var promAdress = files[0].fd.split('/');
										var resultAdress = [];
										for(var i=promAdress.length-1; i>= 0; i--){
										   	resultAdress.push(promAdress[i]);
										   	if(promAdress[i] == "markers"){
										   		resultAdress.reverse();
										   		resultAdress = resultAdress.join("/");
										   		resultAdress = "/" + resultAdress;
										  		imagesList.push(resultAdress);
										   		break;
										  	}
										}
										marker.img = [];
										marker.img = marker.img.concat(imagesList);
										    marker.save(function(error) {
											    if(error) {
											        console.log(error);
											    } else {
											        //console.log(marker.img);        
											    }
										   	});
									}
									if (err)
									    return res.serverError(err);
									return res.ok();
								});*/
							
				    	}
				    	else{
				    		console.log(err);	
				    	}
				    }
				});
			
			
			req.session.flash={};
		});
	},
	getMarker: function(req,res){
		Marker.watch(req.socket);
		Marker.find({}, function(err, markers){
			res.send(markers);
			Marker.subscribe(req.socket,markers);
		});
		console.log("SUBSCIRIBED!");
	},
	openMarker: function(req,res){
		Marker.findOne({id:req.body.id},function(err, marker){
			if(err) console.log(err);
			res.send(marker);
		})
	}
};