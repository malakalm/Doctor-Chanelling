import express from 'express';
const router = express.Router();
import { getAllUsers, 
         getUserById ,
         loginUser ,
         signupUser ,
         updateFCM , 
         updateUserDetails ,
         deleteUserAccount ,
         resetPassword,
         setSubplane
        } from '../controllers/userController.mjs';

import { 
         getAvailableDoctors,
         getDoctorVenues
        } from '../controllers/doctorController.mjs';


/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *        - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users       
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /users-byid:
 *   get:
 *     tags:
 *        - Users
 *     summary: Get user by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Get a user
 */
router.get('/users-byid', getUserById);

/**
 * @swagger
 * /UserLogin:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login user with email or phone
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailorphone:
 *                 type: string
 *                 description: User's email (optional if phone is provided)
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/UserLogin', loginUser);

/**
 * @swagger
 * /UserSignup:
 *   post:
 *     tags:
 *       - Users
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *               name:
 *                 type: string
 *                 description: User's name
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               address:
 *                 type: string
 *                 description: User's address
 *               image:
 *                 type: string
 *                 description: User's image
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email or phone already exists
 */
router.post('/UserSignup', signupUser);

/**
 * @swagger
 * /updateFCM:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update the user's FCM token
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fcmToken:
 *                 type: string
 *                 description: The user's FCM token to update
 *     responses:
 *       200:
 *         description: FCM token updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 *       409:
 *         description: FCM token already exists
 */
router.put('/updateFCM', updateFCM);

/**
 * @swagger
 * /updateUserDetails:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user details (name, address, image)
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               address:
 *                 type: string
 *                 description: User's address
 *               image:
 *                 type: string
 *                 description: URL or file path for user's profile image
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */
router.put('/updateUserDetails', updateUserDetails);

/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Soft delete a user account by updating their status
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User account marked as deleted
 *       400:
 *         description: Invalid or missing user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */
router.delete('/deleteUser', deleteUserAccount);

/**
 * @swagger
 * /resetPassword:
 *   put:
 *     tags:
 *       - Users
 *     summary: Reset user password using email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */
router.put('/setSubplane', resetPassword);

/**
 * @swagger
 * /setSubplane:
 *   put:
 *     tags:
 *       - Subscription
 *     summary: Update the user's Subscription Plane
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               setSubplane:
 *                 type: integer
 *                 description: The user's Subscription Plane to update
 *     responses:
 *       200:
 *         description: setSubplane updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 *       409:
 *         description: setSubplane already exists
 */
router.put('/setSubplane', setSubplane);

/**
 * @swagger
 * /getAvailableDoctors:
 *   get:
 *     tags:
 *        - Doctors
 *     summary: Get all Doctors
 *     responses:
 *       200:
 *         description: A list of Doctors       
 */
router.get('/getAvailableDoctors', getAvailableDoctors);

/**
 * @swagger
 * /getDoctorVenues:
 *   get:
 *     tags:
 *        - Doctors
 *     summary: Get Venues by Doctor ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Get a Venues
 */
router.get('/getDoctorVenues', getDoctorVenues);



export default router;
