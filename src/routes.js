import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';
import SessionController from './controllers/SessionController';
import HouseController from './controllers/HouseController';
import DashboardController from './controllers/DashboardController';
import ReservaController from './controllers/ReservaController';

const routes = new Router();
const upload = multer(uploadConfig);

// Session Controller
routes.post('/sessions', SessionController.store);

// House Controller
routes.post('/houses', upload.single('thumbnail'), HouseController.store);
routes.get('/houses', HouseController.index);
routes.put(
  '/houses/:house_id',
  upload.single('thumbnail'),
  HouseController.update
);
routes.delete('/houses', HouseController.destroy);

// Dashboard Controller
routes.get('/dashboard', DashboardController.show);

// Reserva Controller
routes.post('/houses/:house_id/reserva', ReservaController.store);
routes.get('/reservas', ReservaController.index);
routes.delete('/reservas/cancel', ReservaController.destroy);

export default routes;
