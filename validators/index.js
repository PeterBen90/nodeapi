exports.createPostValidator = (req, res, next) => {
    // title validator
    req.check('title', 'Please type your title').notEmpty();
    req.check('title', 'Title must be between 4 to 100 characters').isLength({
        min: 4,
        max: 100
    });

    //body validator
    req.check('body', 'Please type your body content').notEmpty();
    req.check('body', 'Title must be between 4 to 2000 characters').isLength({
        min: 4,
        max: 2000
    });

    //check for errors
    const errors = req.validationErrors();

    //if there is errors, show them as they appear
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    //proceed to next middleware
    next();
};

exports.createUserValidator = (req, res, next) => {
    //name is not null and between 4 to 15 characters
    req.check('username', 'Username is required').notEmpty();
    req.check(
        'username',
        'Username must be between 4 - 15 characters'
    ).isLength({
        min: 4,
        max: 15
    });

    //email is not null, valid and normalized
    req.check('email', 'Email must be bteween 4 to 32 characters').isLength({
        min: 4,
        max: 32
    });
    req.check('email', 'Valid email is required').isEmail();

    //check for password
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({
            min: 6
        })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');

    //check for errors
    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }

    //proceed to next middleware
    next();
};
