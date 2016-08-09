/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'create':function(req,res,next){
		var newUser = {
			name: req.param('name'),
			email: req.param('email'),
			password: req.param('password'),
			confirmation: req.param('confirmation')
		}
		User.create(newUser, function userCreate(err, user){

			if(err){
				res.status(500).send(err);
				return;
			}

			req.session.authenticated = true;
			req.session.User = user;
			res.redirect('/');
		})
	},
	'sendAll':function(req,res,next){
		User.find({},function(err,user){
			if (err) next (err);
			console.log(user.length);

			for (i=0; i < user.length; i++){
				delete user[i].encryptedPassword;
				delete user[i].createdAt;
				delete user[i].updatedAt;
				delete user[i].isAdmin;
			}
			console.log(user);
			res.send(user);
		})
	},
	'mymarkers': function(req,res,next){
		User.findOne(req.session.User.id)
			.populate('markers')
			.exec(function foundedMarkers(err, user){
			if (err) next(err);
			res.send(user.markers);
		});
	}
};

