import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTicketRequestDto, CreateTicketResponseDto, GetTicketResponseDto } from './dto/ticket.dto';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtRoleGuard } from './jwtguard.guard';
import { SendMessageRequestDto } from './dto/message.dto';

@ApiTags('ticket')
@Controller('ticket')
export class TicketController {

    constructor(private ticketService: TicketService){}

    @ApiCookieAuth('accessToken')
    @ApiOperation({ summary: 'Create Ticket' })
    @ApiResponse({ status: 201, type: CreateTicketResponseDto })
    @UseGuards(AuthGuard(['jwt']))
    @Post()
    async createTicket(@Body() dto: CreateTicketRequestDto, @Req() req: Request){
        return await this.ticketService.createTicket(dto, req['user']);
    }

    @ApiOperation({ summary: `Get user's tickets` })
    @ApiResponse({ status: 200, type: [GetTicketResponseDto] })
    @ApiCookieAuth('accessToken')
    @UseGuards(AuthGuard(['jwt']))
    @Get()
    async getUserTickets(@Req() req: Request){
        return await this.ticketService.getUserTickets(req['user']);
    }

    @ApiOperation({ summary: 'Get Ticket By id' })
    @ApiResponse({ status: 200, type: CreateTicketResponseDto })
    @ApiCookieAuth('accessToken')
    @UseGuards(AuthGuard(['jwt']))
    @Get(':id')
    async getTicketById(@Param('id') id:string, @Req() req: Request){
        return await this.ticketService.getTicketById(Number(id),req['user'])
    }

    @ApiCookieAuth('accessToken')
    @UseGuards(AuthGuard(['jwt']))
    @Patch(':id')
    async closeTicket(@Param('id') id:string, @Req() req: Request){
        return await this.ticketService.closeTikcet(Number(id), req['user'])
    }

    @ApiCookieAuth('accessToken')
    @UseGuards(JwtRoleGuard)
    @Post(':id/messages')
    async sendMessage(@Body() dto: SendMessageRequestDto, @Param('id') id: string, @Req() req: Request){
       return await this.ticketService.sendMessage(dto, Number(id), req['user'])
    }

    @ApiCookieAuth('accessToken')
    @UseGuards(AuthGuard(['jwt']))
    @Get(':id/messages')
    async getTicketMessages(@Param('id') id: string, @Req() req: Request){
        return this.ticketService.getTicketById(Number(id), req['user']);
    }
}
