import "jasmine";
// @ts-ignore
import { setup } from 'radiks-server';

describe('Mongo tests', () => {

    let db: any = null;

    beforeAll((done) => {
        setup().then(async (RadiksController: any) => {
            db = RadiksController.DB;
            done();
        });
    });

    describe(`GeoSpatial location near a point test`, () => {
        it(`should return a JSON object if it is near it`, async (done) => {

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

            expect(doc).toBeDefined();
            done();

        });
    });

});
