/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var bcrypt = require('bcrypt');

module.exports = {
	'index' :function(req, res, next){
		res.view();
	},
	'create': function(req,res,next){
		if (!req.param('email') || !req.param('password')){
			res.status(500).send("You must enter email and password");
			return;
		}

		User.findOneByEmail(req.param('email'), function createSession(err,user){
			if (err) return next(err);

			if(!user){
				res.status(500).send("You must enter email and password");
				return;
			}

			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid){

				if(!valid){
					res.status(500).send("Invalid email or password");
					return;
				}

				req.session.authenticated = true;
				req.session.User = user;

				res.ok();

			})

		})
	},
	'destroy' :function (req,res,next){
		User.findOne(req.session.User.id, function logout(err,user){
			if(err) return next(err);
			req.session.destroy();
			res.redirect("/");
		})
	}
};

