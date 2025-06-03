import { Router } from 'express';
import { usersRouter } from './users';
import { loginRouter } from './login';
import { logoutRouter } from './logout';

const api = Router();
api.use('/users', usersRouter);
api.use('/login', loginRouter);
api.use('/logout', logoutRouter);

export { api as apiV1Router };