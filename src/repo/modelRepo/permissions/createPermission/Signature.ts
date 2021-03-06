import AsyncHandler from '../../../../utils/AsyncHandler';
import { PermissionAttributes} from '../../../../models/interfaces/permission';
export interface Options {
    readonly name: string;
    readonly label?: string;
    readonly description?: string;
}

type Signature = AsyncHandler<Options, PermissionAttributes>;

export default Signature;