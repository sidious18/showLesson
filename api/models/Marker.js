/**
 * Marker.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	date:{
  		type:"string",
  		required:true
  	},
  	type:{
  		type:"string",
  		required:true
  	},
  	description:{
  		type:"string",
  		required:true,
  		maxLength:500
  	},
  	yCoord:{
  		type:"string",
  		required:true
  	},
  	xCoord:{
  		type:"string",
  		required:true
  	},
  	place:{
  		type:"string",
  		required:true
  	},
  	title:{
  		type:"string",
  		required:true
  	},
  	img:{
  		type:"array"
  	}
  }
};

