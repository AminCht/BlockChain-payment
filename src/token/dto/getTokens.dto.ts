import { ApiProperty } from "@nestjs/swagger";
import {Currency} from "../../database/entities/Currency.entity";

export class GetTokensResponseDto {
    static tokens(userTokens: Currency[]) {
        const mapTokens = userTokens.map((token) => {
            return {
                id: token.id,
                network: token.network,
                name: token.name,
                symbol: token.symbol,
                status: token.status,
            };
        });
        return mapTokens;
    }
    @ApiProperty()
    network: string;

    @ApiProperty()
    name: string;
    
    @ApiProperty()
    symbol: string;
    
    @ApiProperty()
    status: boolean;
}