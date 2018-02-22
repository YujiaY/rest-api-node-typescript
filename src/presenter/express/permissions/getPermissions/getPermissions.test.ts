import initTests from '../../utils/initTests';
import {API_ROUTE_V1} from '../../../../utils/constants';
import {Response} from 'express';
import {OK_200_HTTP_CODE, FORBIDDEN_403_HTTP_CODE, UNAUTHORISED_401_HTTP_CODE} from '../../utils/constants';
import config from '../../../../config';
import {TEST_INVALID_JWT_TOKEN, TEST_VALID_REGISTER_USER } from '../../../../utils/testValues';
import expectError from '../../utils/expectError';
import generateJwtToken from '../../../../utils/jwt/generateToken';
import createUserWithPermission from '../../utils/createUserWithPermission';
import {CAN_GET_PERMISSIONS, DEFAULT_PERMISSIONS_PAGINATION_LIMIT, DEFAULT_POSTS_PAGINATION_OFFSET} from '../../../../utils/constants';
import {fakePermissions} from '../../../../utils/fakesFactory';

describe(__filename, () => {

  const { service, request } = initTests();

  it('should fail to get permissions when unauthenticated', async () => {
    const response = await request.get(`${API_ROUTE_V1}/permissions`);
    expectError(response, UNAUTHORISED_401_HTTP_CODE);
  });

  it('should fail to get permissions when invalid token provided in authorization header', async () => {
    const response = await request.get(`${API_ROUTE_V1}/permissions`)
                                  .set('Authorization' , TEST_INVALID_JWT_TOKEN);
    expectError(response, UNAUTHORISED_401_HTTP_CODE);
  });

  it('should fail to get permissions when insufficent permissions', async () => {
    const userWithoutPermissions = await service.createUser(TEST_VALID_REGISTER_USER);
    const validToken = await generateJwtToken({data: {id: userWithoutPermissions.id}});
    const response = await request.get(`${API_ROUTE_V1}/permissions`)
                                  .set('Authorization' , validToken);
    expectError(response, FORBIDDEN_403_HTTP_CODE);
  });

  it('should get permissions with default offset and limit when not passed', async () => {
    const user = await createUserWithPermission(service, CAN_GET_PERMISSIONS);

    const permissions = fakePermissions({
      count: 10,
      only: ['id','name','label', 'description']
    }).map(async (permission: any) => {
      return service.createPermission(permission);
    }); 
    await Promise.all(permissions);

    const validToken = await generateJwtToken({data: {id: user.id}});

    const response = await request.get(`${API_ROUTE_V1}/permissions`)
                                  .set('Authorization', validToken);
    expect(response.status).toBe(OK_200_HTTP_CODE);
    expect(response.body.count).toBe(10);
    expect(response.body.total).toBe(11);
    expect(response.body.perPage).toBe(DEFAULT_PERMISSIONS_PAGINATION_LIMIT);
    expect(response.body.currentPage).toBe(1);
  });

  it('should get permissions when offset and limit provided', async () => {
    const user = await createUserWithPermission(service, CAN_GET_PERMISSIONS);

    const permissions = fakePermissions({
      count: 10,
      only: ['id','name', 'label', 'description']
    }).map(async (permission: any) => {
      return service.createPermission(permission);
    }); 
    await Promise.all(permissions);

    const validToken = await generateJwtToken({data: {id: user.id}});

    const response = await request.get(`${API_ROUTE_V1}/permissions?offset=0&limit=5`)
                                  .set('Authorization', validToken);
    expect(response.body.count).toBe(5);
    expect(response.body.total).toBe(11);
    expect(response.body.currentPage).toBe(1);
    expect(response.status).toBe(OK_200_HTTP_CODE);
  });

  it('should get permissions sorted according to the keys provided', async () => {
    const user = await createUserWithPermission(service, CAN_GET_PERMISSIONS);
    
    const permissions = fakePermissions({
      count: 5,
      only: ['id','name', 'label', 'description']
    }).map(async (permission: any) => {
      return service.createPermission(permission);
    }); ; 

    await Promise.all(permissions);
    const validToken = await generateJwtToken({data: {id: user.id}});

    const response = await request.get(`${API_ROUTE_V1}/permissions?sort=id:desc`)
                                  .set('Authorization', validToken);
    expect(response.status).toBe(OK_200_HTTP_CODE);
    expect(response.body.data[0].id).toBe(6);
  });
 
});