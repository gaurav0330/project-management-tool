const authController = require("../../controllers/authController");

const authResolvers = {
    Mutation: {
        signup: authController.signup,
        login: authController.login
    }
};

module.exports = authResolvers;
