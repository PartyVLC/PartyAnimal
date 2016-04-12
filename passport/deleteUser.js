var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/dj');

module.exports = function(passport){

	passport.use('deleteUser', new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
    function(req, username, done) {

      deleteUser = function(){
        // find a user in Mongo with provided username
        User.findOne({ 'username' :  username }, function(err, user) {
          // In case of any error, return using the done method
          if (err){
              console.log('Error in Deletion: '+err);
              return done(err);
          }
          // User does not exist
          if (user == null) {
            console.log('User does not exist with the username '+username);
            return done(null, false, req.flash('message','User Does Not Exist'));
          } else {
            // if there is a user with that username
            // pull from the database
            // this process cannot be undone, can only be run by admin
            users.deleteOne(
              {
                username: username
              },
              function(err) {
                if (err) {
                  console.log(err)
                }
              }
            )

            // save the user
            user.save(function(err) {
              if (err){
                console.log('Error in Saving user: '+err);  
                throw err;  
              }
              console.log('User '+username+' is now delete');
            });
          }
        });
      };
      // Delay the execution of deleteUser and execute the method
      // in the next tick of the event loop
      process.nextTick(deleteUser);
    })
  );
}