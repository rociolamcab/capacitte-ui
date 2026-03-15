import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // Esto es lo que evita el error NG0401
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);