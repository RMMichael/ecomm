import {pool} from "./queries";
import {Auth} from "../lib/Auth";

export class SessionsController {
  static getAll = () => {
    return Auth.getAllSessions();
  }

  static deleteId = async (id: any) => {
    // ...
    // if (fooResult.rowCount === 0) {
    //   throw new Error('Resource not found.');
    // }
    //
    // if (fooResult.rowCount > 1) {
    //   throw new Error('Data integrity constraint violation.');
    // }
    //
    // return fooResult[0].id;
    return {success: undefined, error: undefined};
  }
}
