import { Router } from 'express';
import { usersRouter } from './users';
import { loginRouter } from './login';
import { logoutRouter } from './logout';
import { sessionsRouter } from './sessions';

// TODO: admin authorization for certain APIs
const api = Router();
api.use('/users', usersRouter);
api.use('/login', loginRouter);
api.use('/logout', logoutRouter);
api.use('/sessions', sessionsRouter);

// api URLs prefixed with /api/v1/...

// operating on sessions
// GET /api/v1/sessions
// DELETE /api/v1/sessions/:id

// operating on users
// GET /api/v1/users(/id)
// POST /api/v1/users/1/delete
// POST /api/v1/users/1/update
// POST /api/v1/users/create

export { api as apiV1Router };