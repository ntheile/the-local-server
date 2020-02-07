import './LoadEnv'; // Must be the first import
import app from '@server';
import { logger } from '@shared';
import 'localstorage-polyfill';
const Window = require('window');
const window = new Window();
import 'localstorage-polyfill';
const fetch = require('node-fetch');
// @ts-ignore
global.window = window; // for radiks to work
// @ts-ignore
global.document = window.document; // for nextjs client side dom to work


// Start the server
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
