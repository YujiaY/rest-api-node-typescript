import AsyncHandler from '../../../../utils/AsyncHandler';
import * as SequelizeStatic from 'sequelize';
import {ResetPasswordTokenAttributes} from '../../../../models/interfaces/reset_password_token';

export interface Options {
  readonly userId: number;
  readonly token: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

type Signature = AsyncHandler<Options,any>;

export default Signature;