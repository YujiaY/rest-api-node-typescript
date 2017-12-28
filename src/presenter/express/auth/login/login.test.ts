import initTests from '../../utils/initTests';
import {API_ROUTE_V1, DEFAULT_USER_PERMISSIONS} from '../../../../utils/constants';
import {Response} from 'express';
import {CREATED_201_HTTP_CODE, OK_200_HTTP_CODE, UNPROCESSABLE_ENTITY_422_HTTP_CODE, CONFLICT_409_HTTP_CODE} from '../../utils/constants';
import config from '../../../../config';
import {TEST_VALID_LOGIN_USER, TEST_INVALID_EMAIL,TEST_VALID_PASSWORD, TEST_VALID_EMAIL, TEST_TOO_SHORT_PASSWORD, TEST_DIFFERENT_VALID_PASSWORD} from '../../../../utils/testValues';
import * as R  from 'ramda';
import expectError from '../../utils/expectError';

describe(__filename, () => {

  const { service, request } = initTests();

  it('should fail to log in user without input', async () => {
    const response = await request.post(`${API_ROUTE_V1}/auth/login`);
    expectError(response);
  });

  it('should fail to log in user when email is invalid', async () => {
    const response = await request.post(`${API_ROUTE_V1}/auth/login`)
                                  .send({
                                    email: TEST_INVALID_EMAIL, 
                                    password: TEST_VALID_PASSWORD
                                  });
    expectError(response);
  });

  it('should fail to log in a user without password', async () => {
    const response = await request.post(`${API_ROUTE_V1}/auth/login`)
                                  .send({email: TEST_VALID_EMAIL});
    expectError(response);
  });

  it('should fail to log in when user does not exist', async () => {
    const response = await request.post(`${API_ROUTE_V1}/auth/login`)
                                  .send(TEST_VALID_LOGIN_USER);
    expectError(response);
  });

  it('should fail to log in a user when password is invalid', async () => {
    
    const registeredUser = await service.register({
      email: TEST_VALID_EMAIL, 
      password: TEST_VALID_PASSWORD
    });
    
    const response = await request.post(`${API_ROUTE_V1}/auth/login`)
                                  .send({
                                    email: TEST_VALID_EMAIL, 
                                    password: TEST_DIFFERENT_VALID_PASSWORD,
                                  });
    expectError(response);
  });

  it('should succesfully log in a user', async () => {
    
    const registeredUser = await service.register(TEST_VALID_LOGIN_USER);

    const response = await request.post(`${API_ROUTE_V1}/auth/login`)
                                  .send(TEST_VALID_LOGIN_USER);

    const {user, token} = response.body;
    expect(response.status).toBe(OK_200_HTTP_CODE);
    expect(token).toMatch(/JWT/);
    expect(user.email).toEqual(TEST_VALID_LOGIN_USER.email);
  });

});