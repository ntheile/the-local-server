
import { genGroupKeyPutCentral, inviteMember } from './../utils/group';
import { verifyUser } from './Keychain';



// called from a client websocket
// https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
export async function PlaceController(io: any, socket: any, room: any, RadiksController: any, authToken: string) {

  // @todo write logic to see if the user can join the room based on location
  socket.join(room, async () => {
    
    console.log('new joiner attempting to connect to room ', room);

    let isPresent = await proofOfPresense(); // @todo check that the user is within the geo-fence via proof of presence
    let userId = await verifyUser(authToken);
    
    if (isPresent && userId){
      let roomSession: any = await createRoomSession(room, RadiksController, socket);

      // 2) Invite the requesting users public key to the room.
      let inviteId = await inviteMember(roomSession._id, userId);
  
      // 3) send request back to user to accept 
      if (inviteId){
        socket.emit('message', {radiksType: 'GroupInvitation', inviteId: inviteId});
      }
      
  
      // 4) emit message to everybody in the room that you have a new joiner
      // io.in(room).emit('message', {radiksType: 'NewJoiner', 'userProfile': {location: [1,2], distance: 1000, image: '', userName: userId } });  


    } else{
      socket.emit('message', {radiksType: 'Error', 'message': 'access denied. failed proof of presence'});
    }
    
  });

};


export async function createRoomSession(room: any, RadiksController: any, socket: any) {
  let session: any = null;
  let placeId = room;
  return new Promise((resolve, reject) => {
    // Search for Room
    RadiksController.centralCollection.find({ "_id": placeId }).toArray(async (error: any, item: any) => {
      //1) Create Room if not exsists
      if (item.length > 0) {
        // grab session if it exists
        session = item[0].group;
      } else {
        // create room 
        session = await genGroupKeyPutCentral(placeId);
      }
      resolve(session);
    });
  });
}


export async function proofOfPresense(){
  return new Promise( (resolve, reject)=>{
    resolve(true);
  })
}

