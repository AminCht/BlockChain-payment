import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApikeyService } from './apikey.service';

@ApiTags('ApiKey')
@Controller('apikey')
export class ApikeyController {
    constructor( private apikeyService: ApikeyService){}
    
}
