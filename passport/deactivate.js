var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/dj');

module.exports = function(passport){

	passport.use('deactivate', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, done) {

            deactivateUser = function(){
                console.log("deactivate user")
                // find a user in Mongo with provided username
                User.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in Deactivation: '+err);
                        return done(err);
                    }
                    // User does not exist
                    if (user == null) {
                        console.log('User does not exist with the username '+username);
                        return done(null, false, req.flash('message','User Does Not Exist'));
                    } else {
                        // if there is a user with that username
                        // set isActive to false
                        // if needed, admins can fully delete accounts
                        user.isActive = false;
                        console.log("user.isActive = " + user.isActive)

                        // save the user
                        user.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User '+username+' is now deactivated');    
                            return done(null, true);
                        });
                    }
                });
            };
            // Delay the execution of deactivateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(deactivateUser);
        })
    );
}