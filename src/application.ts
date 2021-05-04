import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
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
import {AllowedOriginProvider} from './middlewares/allowed-origin.middleware';
import {LogginProvider} from './middlewares/logger.middleware';
import {LoggerProvider} from './providers/logger.provider';
import {MySequence} from './sequence';
import {CustomerLogin} from './services/customer-login';
import {CustomerSignup} from './services/customer-signup';

export {ApplicationConfig};

export class UserApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    this.add(createBindingFromClass(LogginProvider));
    this.add(createBindingFromClass(AllowedOriginProvider));

    dotenv.config({path: '.env'});

    this.bind(BinderKeys.LOGGER).toProvider(LoggerProvider);
    this.bind(BinderKeys.CUSTOMERSIGNUP).toClass(CustomerSignup);
    this.bind(BinderKeys.CUSTOMERLOGIN).toClass(CustomerLogin);

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
