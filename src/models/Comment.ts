// @ts-ignore
import Model from 'radiks/lib/model';

// @ts-ignore
export default class Comment extends Model {
  static className = 'Comment';

  static schema = {
    text: {
      type: String,
      decrypted: true,
    },
    createdBy: {
      type: String,
      decrypted: true,
    },
    postId: {
      type: String,
      decrypted: true,
    }
  };

}
