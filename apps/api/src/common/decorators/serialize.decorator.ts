import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { TransformDataInterceptor } from '../interceptors/transform-data.interceptor';

/**
 * Decorator that applies data transformation using class-transformer
 * @param classToUse - The class to transform the response data to
 */
export const Serialize = (
  classToUse: ClassConstructor<unknown>,
): MethodDecorator => {
  return UseInterceptors(new TransformDataInterceptor(classToUse));
};
