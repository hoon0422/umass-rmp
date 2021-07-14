import { createParamDecorator } from '@nestjs/common';
import { UserBody } from '@rmp/dto/User';

export const ReqUser = createParamDecorator((data, ctx) => {
  return ctx.switchToHttp().getRequest().user as UserBody;
});
