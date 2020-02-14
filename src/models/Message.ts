// @ts-ignore
import Model from 'radiks/lib/model';
import moment from 'moment';
import { Attrs } from 'radiks/src/types';

export default class Message extends Model {
  static className = 'Message';

  // @ts-ignore
  attrs: IMessage;

  static schema = {
    content: {
      type: String,
      decrypted: true,
    },
    createdBy: {
      type: String,
      decrypted: true,
    }
  }

  ago() {
    return moment(this.attrs.createdAt).fromNow();
  }
}

export interface IMessage extends Attrs {
  content: string;
  createdBy: string;
}