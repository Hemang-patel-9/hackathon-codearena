const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const { upload } = require("../middlewares/upload.middleware");

//auth
router.get('/auth', authController.getUserFromToken)

// Auth routes
router.post('/register', upload.single("avatar"), userController.register);
router.post('/login', userController.login);

// User management
router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/update-password/:id', userController.updatePassword);
router.patch('/update-profile/:id', upload.single('avatar'), userController.updateProfile);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.get("/userdata/quiz", userController.getAllUsersWithQuizzes);
router.get("/userdata/quiz/:userId", userController.getUserDetailsWithQuizzes);
// Google SignIn
router.post("/auth/google", authController.googleSignIn);

//Github SignIn
// router.get("/auth/github", authController.GithubRedirectUrl);
// router.get("/auth/github/callback", authController.GithubCallBack);

//Facebook SignIn
router.get("/auth/facebook", authController.FaceBookRedirectUrl);
router.get("/auth/facebook/callback", authController.FacebookCallback);

module.exports = router;
