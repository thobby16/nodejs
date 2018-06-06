var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


var multer = require('multer');
var uploads = multer({dest: './uploads'});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup',function(req, res, next){
  res.render('signup',{
    'title': 'signup'
  });
    
});
router.get('/login', function(req, res, next){
    res.render('login',{
        'title': 'login'
    });

});


router.post('/signup', uploads.single('profileimg'),function(req, res, next){
    //get form values
    var name = req.body.name;
    var email = req.body.email;
    var number = req.body.number;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;



    //check for image field
    if(req.file){
        console.log('uploading file...');

        var profileImageOriginalName    = req.files.profileimage.originalname;
        var profileImageName            = req.files.profileimage.name;
        var profileImageMime            = req.files.profileimage.mimetype;
        var profileImagePath            = req.files.profileimage.path;
        var profileImageExt             = req.files.profileimage.extension;
        var profileImageSize            = req.files.profileimage.size;

        } else{
            //set default image
            var profileImageName = 'noimage.png';
        }

    //form validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('number', 'number field is required').notEmpty();
    req.checkBody('username', 'username field is required').notEmpty();
    req.checkBody('password', 'password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


    //check for errors
    var errors = req.validationErrors();

    if (errors){
        res.render('signup',{
            errors: errors,
            name: name,
            email: email,
            number: number,
            username: username,
            password: password,
            password2: password2
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            number: number,
            username: username,
            password: password,
            profileimage: profileImageName

        });
        //create user
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);

       });

        //success Message
        req.flash('success','you are now registered and may log in');

        res.location('/');
        res.redirect('/');
    }


});

passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
        
    });
    
});

passport.use(new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true

    },
    function(username, password, done){
    User.getUserByUsername(username, function(err, user) {
        if(err) throw err;
        if(!user){
            console.log('Unknown User');
            return done(null, false,{message:'Unknown user'});
        }

        User.comparePassword(password,user.password, function (err, isMatch) {
            if(err) throw err;
            if(isMatch) {
                return done(null, user);
            }else {
                console.log('invalid password');
                return done(null, false, {message:'invalid password'});
            }
            
        });
    });
    }
));

router.post('/login', passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function (req, res) {
    console.log('Authentication successful');
    req.flash('success', 'you are now logged in');
    res.redirect('/');
});


module.exports = router;
