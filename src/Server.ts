import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response, Router } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
// @ts-ignore
import { setup } from 'radiks-server';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

// Init express
const app = express();
const router = Router();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api', BaseRouter);

/**
 * Point express to the 'views' directory. If you're using a
 * single-page-application framework like react or angular
 * which has its own development server, you might want to
 * configure this to only serve the index file while in
 * production mode.
 */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('/', (req: Request, res: Response) => {
     res.sendFile('index.html', {root: viewsDir});
});
app.get('/manifest.json', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.sendFile(path.join(__dirname, '..', 'static', 'manifest.json'));
});

setup().then( ( RadiksController: any ) => {
    app.use('/radiks', RadiksController);
});


app.get('/api/test/:id', async (req: Request, res: Response) => {    
    const { id } = req.params; 
    return res.status(OK).json({a:  id});
});



// Export express instance
export default app;
