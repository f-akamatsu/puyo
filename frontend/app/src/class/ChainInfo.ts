export class ChainInfo {
  private static CHAIN = [0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512];
  private static CONNECT = [0, 2, 3, 4, 5, 6, 7, 10];
  private static COLOR = [0, 3, 6, 12, 24];

  /** 連鎖数 */
  private _chain: number;
  /** 消去数 */
  private _erase: number;
  /** 色数 */
  private _color: number;
  /** 連結数 */
  private _connect: number[];
  /** 得点 */
  private _score: number;

  constructor(chain: number, erase: number, color: number, connect: number[]) {
    this._chain = chain;
    this._erase = erase;
    this._color = color;
    this._connect = connect;
    this._score = this.calcScore(chain, erase, color, connect);
  }

  calcScore(chain: number, erase: number, color: number, connect: number[]): number {
    const bonus = erase > 0 ? this.calcBonus(chain, color, connect) : 0;
    const score = erase * bonus * 10;
    return score;
  }

  calcBonus(chain: number, color: number, connect: number[]): number {
    // 連鎖
    const chainBonus = ChainInfo.CHAIN[chain - 1];

    // 色数
    const colorBonus = ChainInfo.COLOR[color - 1];
    
    // 連結
    let connectBonus = 0;
    connect.forEach(el => {
      const index = (el > 11 ? 11 : el) - 4;
      connectBonus += ChainInfo.CONNECT[index];
    });

    let bonus = colorBonus + chainBonus + connectBonus;
    if (bonus === 0) {
      bonus = 1;
    }

    return bonus;
  }

  /**
   * 
   */
  public isErased(): boolean {
    return this._erase > 0;
  }
}