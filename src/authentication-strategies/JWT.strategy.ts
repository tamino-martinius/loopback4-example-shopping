// Copyright IBM Corp. 2018, 2019. All Rights Reserved.
// Node module: @loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// Consider turn it to a binding
const SECRET = 'secretforjwt';
import {Request, HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/authentication';
import {AuthenticationStrategy} from './authentication.strategy';
import {inject} from '@loopback/core';
import {JWTAuthenticationService} from '../services/JWT.authentication.service';

export class JWTStrategy implements AuthenticationStrategy {
  constructor(
    @inject('JWT.authentication.service')
    public jwtAuthService: JWTAuthenticationService,
  ) {}
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = request.query.access_token || request.headers['authorization'];
    if (!token) throw new HttpErrors.Unauthorized('No access token found!');

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    try {
      const user = await this.jwtAuthService.decodeAccessToken(token);
      return user;
    } catch (err) {
      Object.assign(err, {
        code: 'INVALID_ACCESS_TOKEN',
        statusCode: 401,
      });
      throw err;
    }
  }
}
