import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@Configuration()
export class MailConfig {
  @IsString()
  @IsNotEmpty()
  @Value('MAIL_FROM_NAME', {
    default: 'SojuStack',
  })
  fromName!: string;

  @IsString()
  @IsNotEmpty()
  @Value('MAIL_FROM_EMAIL', {
    default: 'noreply@example.com',
  })
  fromEmail!: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  @Value('MAILPIT_URL', {
    default: 'http://localhost:8025',
  })
  mailpitUrl!: string;

  @IsString()
  @Value('RESEND_API_KEY', {
    default: '',
  })
  resendApiKey!: string;
}
