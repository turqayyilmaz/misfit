const User = require('../models/User');

module.exports = (req, res, next) => {
    User.findById(req.session.userID, (err, user)=>{
        if(err || !user) {
            res.locals.pageName = 'login';
            res.locals.pageTitle = 'Login';
            return res.redirect('/login');
        }
        next();
    })
};