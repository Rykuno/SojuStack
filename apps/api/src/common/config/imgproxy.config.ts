import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsUrl } from 'class-validator';

@Configuration()
export class ImgProxyConfig {
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  @Value('IMGPROXY_URL')
  url!: string;
}
