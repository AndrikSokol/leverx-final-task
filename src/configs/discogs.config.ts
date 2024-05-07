import { HttpModuleOptions } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export const getDiscogsConfig = async (
  configService: ConfigService,
): Promise<HttpModuleOptions> => {
  return {
    headers: {
      Authorization: 'Discogs token=' + configService.get('DISCOGS_TOKEN'),
    },
    timeout: 7000,
    maxRedirects: 5,
  };
};
