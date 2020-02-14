import './LoadEnv'; // Must be the first import
//import { logger } from '@shared';
import 'localstorage-polyfill';
const Window = require('window');
const window = new Window();
import 'localstorage-polyfill';
const fetch = require('node-fetch');
// @ts-ignore
global.window = window; // for radiks to work
// @ts-ignore
global.document = window.document; // for nextjs client side dom to work
import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response, Router } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
// @ts-ignore
import { setup } from 'radiks-server';
import { OK } from 'http-status-codes';
import { PlaceInfoController } from './api/PlaceInfoController'
import { createKeyChain, loadServerSession } from './api/Keychain';
import { PlaceController } from './api/PlaceController';
const makeApiController = require('./api/ApiController');
const { STREAM_CRAWL_EVENT } = require('radiks-server/app/lib/constants');
import mongoSetup from './mongoSetup';
import { PostsController } from './api/PostsController';
import { PeopleController } from './api/PeopleController';


// Init express and socket.io
const app = express();


// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api', BaseRouter);


// Pre server setup
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


// Start the server
const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => {
    console.log('Express server started on port: ' + port);
});


// Setup the server
setup().then( async ( RadiksController: any ) => {
   

    // setup database indexes
    mongoSetup(RadiksController)
    

    // setup Routes
    app.use('/radiks', RadiksController);
    app.use('/api', makeApiController(RadiksController.DB));
    app.use('/placeinfo', PlaceInfoController(RadiksController.DB));    
    app.use('/api/v1/posts', PostsController(RadiksController.DB));
    app.use('/api/v1/people', PeopleController(RadiksController.DB));

    // test route
    // app.get('/api/test/:id', async (req: Request, res: Response) => {    
    //     const { id } = req.params; 
    //     return res.status(OK).json({a:  id});
    // });
    

    // setup crypto
    let keychain = await createKeyChain(); // or get seed from .env
    let session = await loadServerSession(keychain);
    console.log('keychain', keychain);
    console.log('session', session);


    // setup event emmitters
    RadiksController.emitter.on(STREAM_CRAWL_EVENT, ([attrs]: any) => {
        console.log('emmiting message');
        // notifier(RadiksController.DB, attrs);
        if (attrs.geohash){
          let room = attrs.geohash;
          io.in(room).emit('message', attrs);
        }
    });


    // setup Websockets
    const io = require('socket.io')(server);
    io.on('connection', function (socket: any) {
      console.log('new connection');
      // join room
      socket.on('join', (room: any) => {
        PlaceController(io, socket, room, RadiksController)
      });
      // // broadcast room messages
      socket.on('message', ({room, message}: any)  => {
        message.radiksType = "Joiner";
        io.in(room).emit('message', message);
      });
    });
   
    
});

export default app;