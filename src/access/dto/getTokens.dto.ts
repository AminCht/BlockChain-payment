import { ApiProperty } from "@nestjs/swagger";

export class GetTokensResponseDto {
    @ApiProperty()
    network: string;

    @ApiProperty()
    name: string;
    
    @ApiProperty()
    symbol: string;
    
    @ApiProperty()
    status: boolean;
}