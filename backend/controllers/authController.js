const authService = require("../services/authService");

const authController = {
    signup: async (_, { username, email, password, role }) => {
        return await authService.signup(username, email, password, role);
    },
    login: async (_, { email, password }) => {
        return await authService.login(email, password);
    }
};

module.exports = authController;
