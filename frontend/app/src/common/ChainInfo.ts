export class ChainInfo {
  static CHAIN = [0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512];
  static CONNECT = [0, 2, 3, 4, 5, 6, 7, 10];
  static COLOR = [0, 3, 6, 12, 24];

  /** 連鎖数 */
  chain: number;
  /** 消去数 */
  erase: number;
  /** 色数 */
  color: number;
  /** 連結数 */
  connect: number[];
  /** 得点 */
  score?: number;

  constructor(chain: number, erase: number, color: number, connect: number[]) {
    this.chain = chain;
    this.erase = erase;
    this.color = color;
    this.connect = connect;
    this.score = this.calcScore();
  }

  calcScore(): number {
    const bonus = this.calcBonus();
    const score = this.erase * bonus * 10;
    return score;
  }

  calcBonus(): number {
    // 連鎖
    const chainBonus = ChainInfo.CHAIN[this.chain - 1];

    // 色数
    const colorBonus = ChainInfo.COLOR[this.color - 1];
    
    // 連結
    let connectBonus = 0;
    this.connect.forEach(el => {
      const index = (el > 11 ? 11 : el) - 4;
      connectBonus += ChainInfo.CONNECT[index];
    });

    let bonus = colorBonus + chainBonus + connectBonus;
    if (bonus === 0) {
      bonus = 1;
    }

    return bonus;
  }
}