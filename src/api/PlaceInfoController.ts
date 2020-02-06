const express = require('express');
// @ts-ignore
import { decorateApp } from '@awaitjs/express';
// import Geohash from 'latlon-geohash';
const minPeopleCount = 5;

export const PlaceInfoController = (db: any) => {

    const Router = decorateApp(express.Router());

    Router.getAsync('/headcount/:geohash', async (req: any, res: any) => {
        const { geohash } = req.params;

        let query = { _id: { $regex: geohash } };
        let headcount = await geohashQuery(query);
        res.json({
            geohash,
            count: headcount
        });

        //res.json({ error: e });

    });


    Router.getAsync('/nearest/populated/:lat/:long', async (req:any, res:any) => {
        const { lat, long } = req.params;

        // get all 8 hashes
        // let precision = 9; // 1 whole world, 9 exact location
        // let headcount = 0;
        // let geohash = Geohash.encode(lat, long, precision);

        // try {
        //     while (headcount < minPeopleCount && precision != 0) {
        //         geohash = Geohash.encode(lat, long, precision);
        //         var query = { _id: { $regex: geohash } };
        //         headcount = await geohashQuery(query);
        //         if (headcount < minPeopleCount) {
        //             precision--;
        //         }
        //     }
        //     res.json({
        //         geohash,
        //         count: headcount
        //     });
        // } catch (e) {
            res.json({ error: 'e' });
        //}

    });

    async function geohashQuery(query: any) {
        let cursor = db.collection("radiks-central-data").find(query);
        let result = await cursor.toArray();
        // console.log('result of query', result);
        try {
            const headcount = result[0].group.attrs.members.length;
            return headcount;
        } catch (e) {
            return 0;
        }
    }

    return Router;
};


