/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name:{
  		type:'string',
  		required:true
  	},
  	email:{
  		type:'string',
  		required:true,
  		email:true,
  		unique:true
  	},
  	encryptedPassword:{
  		type:'string'
  	},
  	avatar:{
  		type:'string'
  	},
  	isAdmin:{
  		type:'boolean',
  		defaultsTo: false
  	},
    markers:{
      collection: 'marker',
      via: 'creator'
    }
  },
  beforeCreate: function(values, next){
  	if(!values.password || values.password != values.confirmation){
  		return res.status(500).send("Password doesn't match password confirmation");
  	}
  	require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
  		if (err) return next(err);
  		values.encryptedPassword = encryptedPassword;
  		next();
  	});
  }
};

