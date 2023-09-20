import { ethers, InfuraProvider, Provider } from 'ethers';
import { TronWeb } from 'tronweb';

export class Providers {
    public static selectEvmProvider(network: string): Provider {
        if (network == "ethereum") return new InfuraProvider(process.env.ETH_NETWORK, process.env.ETH_APIKEY);
        if (network == "sepolia") return new InfuraProvider(process.env.SEPOLIA_NETWORK, process.env.SEPOLIA_APIKEY);
        if (network == "bsc") return new ethers.JsonRpcProvider(process.env.SMARTCHAIN_NETWORK);
        throw 'Invalid network';
    }
    public static selectTvmProvider(network: string): TronWeb {
        if (network == 'nile')
            return new TronWeb({
                fullHost: 'https://nile.trongrid.io',
                solidityNode: 'https://api.trongrid.io',
            });
    }
}
