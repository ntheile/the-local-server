
import { GenGroupKeyPutCentral, inviteMember } from './../utils/group';


// called from a client websocket
// https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
export async function PlaceController(io: any, socket: any, room: any, RadiksController: any) {

  console.log('new joiner ', room);

  // @todo write logic to see if the user can join the room based on location
  socket.join(room, async () => {
    //io.in(room).emit('message', `New client connected to ${room}`);
    console.log(`New client connected to ${room}`);
    await createRoomSession();

    async function createRoomSession() {
      // @todo check that the user is within the geo-fence via proof of presence
      let session: any = null;
      let placeId = room;

      return new Promise((resolve, reject) => {

        // https://flaviocopes.com/node-mongodb/
        let placeKey = `place_${placeId}`;
        RadiksController.centralCollection.find({ "_id": { $regex: placeKey } }).toArray(async (error: any, item: any) => {

          if (item.length > 0) {
            // grab session
            session = item;
          } else {
            // create room session
            // 1) create a new Group membership for the room that will last 1 day
            // createRadiksGroup
            
            session = await GenGroupKeyPutCentral(placeId);
            // 2) Invite the requesting users public key to the room.
            // inviteMemberIfNotExists(placeId, userToInvite);
            // 3) send request back to user to accept 
            // client accepts like this

          }

          socket.emit('message', session);

      
          resolve(session);
        });
      });
    }

    function inviteMemberIfNotExists(placeId: any, userToInvite: any) {
      
      inviteMember(placeId, userToInvite);
    }

  });

};
