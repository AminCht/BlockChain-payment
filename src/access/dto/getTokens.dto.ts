import { ApiProperty } from "@nestjs/swagger";

export class GetTokensResponseDto {
    @ApiProperty()
    network: string;

    @ApiProperty()
    symbol: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    status: boolean;
}