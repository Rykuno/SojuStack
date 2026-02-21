import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@Configuration()
export class MailConfig {
  @IsString()
  @IsNotEmpty()
  @Value('MAIL_DOMAIN')
  domain!: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  @Value('MAILPIT_URL', {
    default: 'http://localhost:8025',
  })
  mailpitUrl!: string;
}
