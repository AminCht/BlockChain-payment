import { Controller, Get } from '@nestjs/common';
import { AccessService } from './access.service';

@Controller('access')
export class AccessController {
    constructor(private accessService: AccessService) {}
    @Get('tokens')
    async getAllTokens() {
        return await this.accessService.getAllTokens();
    }
}
