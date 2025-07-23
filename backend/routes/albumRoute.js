
import express from 'express';
import upload from '../middleware/multer.js';
import { addAlbum, listAlbum, removeAlbum } from '../controllers/albumController.js';

const albumRouter = express.Router();

albumRouter.post('/addAlbum', upload.single('image') , addAlbum);
albumRouter.get('/listAlbum', listAlbum);
albumRouter.post('/removeAlbum', removeAlbum);

export default albumRouter