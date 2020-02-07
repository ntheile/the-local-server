import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response, Router } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
// @ts-ignore
import { setup } from 'radiks-server';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { PlaceInfoController } from './api/PlaceInfoController'
import { createKeyChain, loadServerSession } from './api/Keychain';
const EventEmitter = require('wolfy87-eventemitter');
import { PlaceController } from './api/PlaceController';
const makeApiController = require('./api/ApiController');
const { STREAM_CRAWL_EVENT } = require('radiks-server/app/lib/constants');

// Init express and socket.io
const app = express();
let server = require('http').createServer(app);
const io = require('socket.io')(server);


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
     //res.sendFile('index.html', {root: viewsDir});
     return res.status(OK).json({'hi': 'the-local-server'});
});
app.get('/manifest.json', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.sendFile(path.join(__dirname, '..', 'static', 'manifest.json'));
});


setup().then( async ( RadiksController: any ) => {

    
    
   

   
    app.use('/radiks', RadiksController);
    app.use('/api', makeApiController(RadiksController.DB));
    app.use('/placeinfo', PlaceInfoController(RadiksController.DB));    
    let keychain = await createKeyChain(); // or get seed from .env
    let session = await loadServerSession(keychain);
    console.log('keychain', keychain);
    console.log('session', session);

    RadiksController.emitter.on(STREAM_CRAWL_EVENT, ([attrs]: any) => {
        // notifier(RadiksController.DB, attrs);
        if (attrs.geohash){
          let room = attrs.geohash;
          io.in(room).emit('message', attrs);
        }
    });

    io.on('connection', function (socket: any) {
      console.log('new connection');
  
      // join room
      socket.on('join', (room: any) => {
        PlaceController(io, socket, room, RadiksController)
      });
  
      // // broadcast room messages
      // socket.on('message', ({room, message })  => {
      //   console.log('message', message);
      //   io.in(room).emit('message', message);
      // });
    });
   
    // app.get('/api/test/:id', async (req: Request, res: Response) => {    
    //     const { id } = req.params; 
    //     return res.status(OK).json({a:  id});
    // });

});

  
// Export express instance
export default app;
