var express = require('express');
var userRouter = express.Router();
var UserHandler = require('../handlers/users');

module.exports = function (PostGre) {
    var userHandler = new UserHandler(PostGre);

    userRouter.route('/').get(userHandler.getUsers);

    userRouter.route('/isAuthorized').get(userHandler.isAuthorizedUser);

    userRouter.route('/signUp').post(userHandler.userSignUp);

    userRouter.route('/signIn').post(userHandler.signIn);

    userRouter.route('/signOut').get(userHandler.signOut);

    userRouter.route('/count').get(userHandler.getUsersCount);

    userRouter.route('/:id').get(userHandler.getOneUser);
    userRouter.route('/:id').put(userHandler.updateUser);
    userRouter.route('/:id').delete(userHandler.removeUser);

    return userRouter;
};

