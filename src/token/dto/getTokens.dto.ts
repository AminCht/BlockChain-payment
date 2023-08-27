import { ApiProperty } from "@nestjs/swagger";
import {User} from "../../database/entities/User.entity";

export class GetTokensResponseDto {
    static tokens(user: User) {
        const tokens = user.tokens.map((token) => {
            return {
                id: token.id,
                network: token.network,
                name: token.name,
                symbol: token.symbol,
                status: token.status,
            };
        });
        return tokens;
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