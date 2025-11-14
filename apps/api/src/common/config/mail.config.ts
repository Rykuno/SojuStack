import { Configuration, Value } from '@itgorillaz/configify';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Configuration()
export class MailConfig {
  @IsString()
  @IsNotEmpty()
  @Value('MAIL_DOMAIN')
  domain!: string;

  @IsNotEmpty()
  mailpit = {
    url: 'http://localhost:8025',
  };
}
