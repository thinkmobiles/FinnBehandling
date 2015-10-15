var express = require('express');
var userRouter = express.Router();
var UserHandler = require('../handlers/users');

module.exports = function (PostGre) {
    var userHandler = new UserHandler(PostGre);

    userRouter.route('/signUp').post(userHandler.userSignUp);

    userRouter.route('/signIn').post(userHandler.signIn);

    userRouter.route('/').get(userHandler.getUsers);

    /*userRouter.route('/count').get(userHandler.getNewsCount);*/

    userRouter.route('/:id').get(userHandler.getOneUser);
    userRouter.route('/:id').put(userHandler.updateUser);
    userRouter.route('/:id').delete(userHandler.removeUser);

    return userRouter;
};

