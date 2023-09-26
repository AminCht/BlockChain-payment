import { Wallet } from "../../database/entities/Wallet.entity"


export class GetWalletResponseDto{
    address: string

    wallet_network: string

    type: string

    lock: boolean

    status: boolean

    static ResponseToDto(wallet: Wallet){
        const responseDto = new GetWalletResponseDto();
        responseDto.address = wallet.address;
        responseDto.wallet_network = wallet.wallet_network;
        responseDto.type = wallet.type;
        responseDto.lock = wallet.lock;
        responseDto.status = wallet.status;
        return responseDto;
    }
}