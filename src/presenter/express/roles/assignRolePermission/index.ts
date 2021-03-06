import Config from '../../Config';
import catchErrors from '../../utils/catchErrors';
import { OK } from 'http-status-codes';
import getAuthUserAndPermissions from '../../../../utils/jwt/getAuthUserAndPermissions';
import hasPermission from '../../../../utils/jwt/hasPermission';
import { CAN_ASSIGN_PERMISSION } from '../../../../utils/constants';
import { maybe, required, checkType, composeRules, restrictToSchema } from 'rulr';

const validateAssignRolePermission = maybe( composeRules([
  restrictToSchema({
    permission_id: required(checkType(String))
  })
]));

export default (config: Config) => {
  return catchErrors(config, async (req, res) => {
  
    const { permissions } = await getAuthUserAndPermissions({req, service: config.service});
    
    hasPermission({permissions, permissionName: CAN_ASSIGN_PERMISSION});
 
    validateAssignRolePermission(req.body, ['role']);

    const {role_id} = req.params;
    const {permission_id} = req.body;

    await config.service.assignRolePermission({
      role_id, permission_id
    });

    res.status(OK).json({success: true});
  });
};