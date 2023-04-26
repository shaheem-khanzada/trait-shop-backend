import { Injectable } from '@nestjs/common';
import ApesTraitsAbi from '../contract/ApesTraitsAbi.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApesTraitsContractService {
  contract: Contract;
  constructor(private configService: ConfigService) {
    const providerUrl = this.configService.get<string>('blockchainNetworkUrl');
    const web3 = new Web3(providerUrl);
    this.contract = new web3.eth.Contract(
      ApesTraitsAbi as AbiItem[],
      this.configService.get<string>('apesTraitContractAddress'),
    );
  }

  async getTotalSuppyByTokenId(tokenID: number) {
    try {
      const totalCount = await this.contract.methods
        .totalSupply(tokenID)
        .call();
      return parseInt(totalCount);
    } catch (e) {
      throw e;
    }
  }

  async getBalanceOfOwnerByTokenId(tokenID: number, owner: string) {
    try {
      const totalCount = await this.contract.methods
        .balanceOff(owner, tokenID)
        .call();
      console.log('totalCount', totalCount);
      return totalCount;
    } catch (e) {
      throw e;
    }
  }
}
