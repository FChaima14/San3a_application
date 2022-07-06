import express from 'express'
import { SignIn, SignUp } from '../controlers/user.js';

const routes=express.Router();
routes.post('/login', SignIn);
routes.post('/register', SignUp);

export default routes;

