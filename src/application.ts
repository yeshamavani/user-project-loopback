import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, TokenServiceBindings} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import path from 'path';
import {BinderKeys} from './keys';
import {LoggerProvider} from './providers/logger.provider';
import {MySequence} from './sequence';
import {CustomerSignup} from './services/customer-signup';
import {MyJWTService} from './services/jwt-service';
import {UserSignup} from './services/user-signup';

export {ApplicationConfig};

export class UserApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    //this.add(createBindingFromClass(LogginProvider));
    //this.add(createBindingFromClass(AllowedOriginProvider));

    dotenv.config({path: '.env'});

    this.bind(BinderKeys.LOGGER).toProvider(LoggerProvider);
    this.bind(BinderKeys.CUSTOMERSIGNUP).toClass(CustomerSignup);
    this.bind(BinderKeys.USERSIGNUP).toClass(UserSignup);

    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(MyJWTService)

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      // controllers: {
      //   // Customize ControllerBooter Conventions here
      //   dirs: ['mycontrollers'],
      //   extensions: ['.controller.js'],
      //   nested: true,
      // },
    };
  }
}
