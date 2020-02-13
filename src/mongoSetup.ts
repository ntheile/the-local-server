

export default function mongoSetup(RadiksController: any) {
    createIndexes(RadiksController);

}

function createIndexes(RadiksController: any){
    RadiksController.DB.collection('radiks-server-data').createIndex({ location: "2dsphere"}, function(err: any, result: any) {
        if (err){
            console.log('err creating mongo index', err);
        } else{
            console.log('created mongo indexes! ', result);
            // callback(result);
        }
    });
}
