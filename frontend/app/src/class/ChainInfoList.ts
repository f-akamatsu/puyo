import { ChainInfo } from "./ChainInfo";

export class ChainInfoList {
  private _chainInfoList: ChainInfo[];

  constructor(chainInfoList: ChainInfo[]) {
    this._chainInfoList = chainInfoList;
  }
}