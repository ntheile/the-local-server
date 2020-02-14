const express = require('express');
// @ts-ignore
import { decorateApp } from '@awaitjs/express';
import { Db } from 'mongodb';

export function PeopleController(db: Db) {

    const Router = decorateApp(express.Router());

    Router.getAsync('/nearby', async (req: any, res: any) => {
        let doc = await PeopleNearby(db);
        res.json(doc);
        //res.json({ error: e });
    });

    return Router;
};


export async function PeopleNearby(db: Db){
    let query = {
        'location': {
            $near:
            {
                $geometry:
                    { type: "Point", coordinates: [41, -87] },
                $maxDistance: 1000
            }
        }
    };
    let doc = await db.collection("radiks-server-data").find(query).toArray();
    return doc
}

