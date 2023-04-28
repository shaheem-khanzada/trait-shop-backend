import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import ApesTraitsAbi from '../contract/ApesTraitsAbi.json';
import Web3 from 'web3';
import { AbiItem, isAddress } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApesTraitsContractService {
  contract: Contract;
  web3: Web3;
  constructor(private configService: ConfigService) {
    const providerUrl = this.configService.get<string>('blockchainNetworkUrl');
    this.web3 = new Web3(providerUrl);
    this.contract = new this.web3.eth.Contract(
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

  async signMessage(body: any) {
    console.log('body', body);
    let message: string;

    if (body.type === 'buyTraitWithERC20') {
      // validate required fields exist
      const requiredFields = [
        'traitId',
        'sponsorAddress',
        'commissionPercentage',
        'quantity',
        'price',
        'erc20TokenAddress',
        'signerAddress',
      ];
      for (const field of requiredFields) {
        if (!(field in body)) {
          throw new HttpException(
            `Missing required field: ${field}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // validate address fields
      const addressFields = Object.keys(body).filter((key) =>
        key.endsWith('Address'),
      );
      for (const field of addressFields) {
        if (!isAddress(body[field])) {
          throw new HttpException(
            `Invalid address field: ${field}`,
            HttpStatus.CONFLICT,
          );
        }
      }

      message = this.web3.utils.soliditySha3(
        { type: 'uint256', value: body.traitId.toString() },
        { type: 'address', value: body.sponsorAddress },
        { type: 'uint256', value: body.commissionPercentage.toString() },
        { type: 'uint256', value: body.quantity.toString() },
        { type: 'uint256', value: body.price.toString() },
        { type: 'address', value: body.erc20TokenAddress },
        { type: 'address', value: body.signerAddress },
      );
    } else if (body.type === 'buyTraitWithETH') {
      // validate required fields exist
      const requiredFields = [
        'traitId',
        'sponsorAddress',
        'commissionPercentage',
        'quantity',
        'price',
        'signerAddress',
      ];
      for (const field of requiredFields) {
        if (!(field in body)) {
          throw new HttpException(
            `Missing required field: ${field}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // validate address fields
      const addressFields = Object.keys(body).filter((key) =>
        key.endsWith('Address'),
      );
      for (const field of addressFields) {
        if (!isAddress(body[field])) {
          throw new HttpException(
            `Invalid address field: ${field}`,
            HttpStatus.CONFLICT,
          );
        }
      }

      message = this.web3.utils.soliditySha3(
        { type: 'uint256', value: body.traitId.toString() },
        { type: 'address', value: body.sponsorAddress },
        { type: 'uint256', value: body.commissionPercentage.toString() },
        { type: 'uint256', value: body.quantity.toString() },
        { type: 'uint256', value: body.price.toString() },
        { type: 'address', value: body.signerAddress },
      );
    } else {
      throw new HttpException(
        'Invalid type must be one of [buyTraitWithERC20, buyTraitWithETH]',
        HttpStatus.CONFLICT,
      );
    }

    const privateKey = this.configService.get<string>('walletPrivateKey');

    const signature = this.web3.eth.accounts.sign(message, privateKey);

    console.log(signature);
    return signature;
  }
}
