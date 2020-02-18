// @ts-ignore
import Model from 'radiks/lib/model';
import { Attrs } from './Attrs';
import { ACL, acl } from './ACL';


export class ActiveUser extends Model {
  static className = 'ActiveUser';

  // @ts-ignore
  attrs: IPost;
  
  static schema  = {
    user: {
      type: String,
      decrypted: true,
    },
    avatar: {
      type: String, 
      decrypted: true,
    },
    awayMessage: {
      type: String,
      decrypted: true,
    },
    acl: {
      type: acl,
      decrypted: true,
    },
  };
  

}

export interface IActiveUser extends Attrs {
  user: string;
  avatar?: string;
  awayMessage: string;
  acl: ACL // access control level
}
