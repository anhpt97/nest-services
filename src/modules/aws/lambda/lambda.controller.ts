import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayloadDto } from './lambda.dto';
import { LambdaService } from './lambda.service';

@ApiTags('aws')
@Controller('')
export class LambdaController {
  constructor(private lambdaService: LambdaService) {}

  @Post('invoke')
  invoke(@Body() dto: PayloadDto) {
    return this.lambdaService.invoke(dto);
  }
}
