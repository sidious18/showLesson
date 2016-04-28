/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  upload: function  (req, res) {
  	console.log(req.body);
	var fs = require('fs');
	var dirImage = '../../assets/markers/marker'+req.body.id+'/images';
	var imagesList = [];
	fs.mkdir(dirImage, 0744, function(err) {
	    if (err) {
	    	if(err.code == "ENOENT"){
	    		for(var i = 0; i <= 4; i++){    			
			    	req.file('files'+"["+i+"]").upload({dirname: dirImage}, function (err, files) {
				    	if(files[0] != undefined){
				    		Marker.findOne(req.body.id, function(error, marker) {
							    if(error) {
							       console.log(error);
							    }
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
								            console.log(marker.img);        
								        }
							   		});
							});
						}
						if (err)
						    return res.serverError(err);
						return res.ok();
					});
				}
	    	}
	    	else{
	    		console.log(err);	
	    	}
	    }
	})
  }
};