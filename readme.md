the-local-server
================

1. `npm i`
2. `npm run build:dev`
3. create folder called env and add /env/production.env and /env/development.env
```
# Environment
NODE_ENV=production

# Server
PORT=5000
HOST=

USE_MOCK_DB=false

MONGODB_URI=mongodb://localhost:27017/thelocal
RADIKS_API_SERVER=http://localhost:5000
SEED=your own twelve word seed phrase mnemonic following bitcoin bip39 
```
4. `npm run start`


geokeys
=======
group keys for a geohash/geofence/lat-lng-radius