import { Coord } from "@/class/Coord";
import { FieldPuyo } from "@/class/FieldPuyo";
import { Connect } from "@/class/Connect";
import { ChainInfo } from "@/class/ChainInfo";
import { ChainInfoList } from "@/class/ChainInfoList";
import { AllChainAnime, ChainAnime, DropAnime, DropPuyoAnime, EraseAnime, ErasePuyoAnime } from "@/interface/FieldAnimationInterfaces"

export class FieldPuyoList implements Iterable<FieldPuyo> {

  private _fieldPuyoList: FieldPuyo[];

  constructor() {
    this._fieldPuyoList = [];
  }

  [Symbol.iterator]() {
    let pointer = 0;
    const fieldPuyoList = this._fieldPuyoList;

    return {
      next(): IteratorResult<FieldPuyo> {
        if (pointer < fieldPuyoList.length) {
          return {
            done: false,
            value: fieldPuyoList[pointer++]
          };
        } else {
          return {
            done: true,
            value: null
          };
        }
      }
    };
  }

  /**
   * 
   * @param coord 
   * @returns 
   */
  getFieldPuyo(coord: Coord): FieldPuyo|undefined {
    const fieldPuyo = this._fieldPuyoList.find(fieldPuyo => {
      return fieldPuyo.isSameCoord(coord);
    });
    return fieldPuyo;
  }

  /**
   * 
   * @param fieldPuyo 
   */
  setFieldPuyo(fieldPuyo: FieldPuyo): void {
    this.removeFieldPuyo(fieldPuyo.coord);
    this._fieldPuyoList.push(fieldPuyo);
  }

  /**
   * 
   * @param coord 
   */
  removeFieldPuyo(coord: Coord): void {
    const tempList = this._fieldPuyoList.filter(fieldPuyo => {
      return !fieldPuyo.isSameCoord(coord);
    });
    this._fieldPuyoList = tempList;
  }

  startChain(): [ChainInfoList, AllChainAnime] {
    const chainInfoList: ChainInfo[] = [];
    const chainAnimeList: ChainAnime[] = [];

    let chainInfo;
    let chainNum = 0;
    do {
      // 1. 浮いているぷよを落とす
      const dropAnime = this.drop();
      
      // 2. 連鎖
      let eraseAnime;
      [chainInfo, eraseAnime] = this.chain(++chainNum);

      if (chainInfo.isErased()) {
        chainInfoList.push(chainInfo);
      }
      chainAnimeList.push({ dropAnime, eraseAnime });
  
      // 3. 1つ以上消していたら繰り返す
    } while (chainInfo.isErased());

    return [new ChainInfoList(chainInfoList), { chainAnimeList }];
  }

  private drop(): DropAnime {
    const dropPuyoAnimeList: DropPuyoAnime[] =[];

    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 12; y++) {
        // 下の段から順にチェック。
        // ぷよがある場合はスキップ。
        // ぷよがない場合は、それより上にぷよがあるを確認し、あれば落としてくる。
        // 最上段はチェック不要（それより上にぷよはないため）。
        const toCoord = new Coord(x, y);
        const toFieldPuyo = this.getFieldPuyo(toCoord);
  
        if (toFieldPuyo !== undefined) {
          continue;
        }
  
        let fromCoord = new Coord(x, y);
        let fromFieldPuyo: FieldPuyo|undefined;
        do {
          fromCoord = fromCoord.addY(1);
          fromFieldPuyo = this.getFieldPuyo(fromCoord);
        } while(fromCoord.y < 12 && fromFieldPuyo === undefined);
  
        if (fromFieldPuyo === undefined) {
          continue;
        }
  
        fromFieldPuyo.coord = toCoord;

        dropPuyoAnimeList.push({ fromCoord, toCoord });
      }
    }

    return { dropPuyoAnimeList };
  }

  private chain(chainNum: number): [ChainInfo, EraseAnime] {
    let eraseAnime: EraseAnime;

    this.calcConnect();
    const chainInfo = this.calcScore(chainNum);
    if (chainInfo.isErased()) {
      eraseAnime = this.erase();
    } else {
      eraseAnime = { erasePuyoAnimeList: [] }
    }
    return [chainInfo, eraseAnime];
  }

  private calcScore(chain: number): ChainInfo {
    const connectArray: Connect[] = [];
    const colorArray: string[] = [];
    this._fieldPuyoList.forEach(fieldPuyo => {
      if (fieldPuyo.isErasable()) {
        const connect = fieldPuyo.connect;
        if (connect === undefined) {
          throw Error("想定外のエラー");
        }
        if (!connectArray.includes(connect)) {
          connectArray.push(connect);
        }
        if (!colorArray.includes(fieldPuyo.color)) {
          colorArray.push(fieldPuyo.color);
        }
      }
    });

    const erase = connectArray.reduce((sum, connect) => { return sum + connect.size; }, 0);
    const connectSizeArray = connectArray.map(connect => connect.size);
    const color = colorArray.length;

    return new ChainInfo(chain, erase, color, connectSizeArray);
  }

  private calcConnect(): void {
    this.resetConnect();

    this._fieldPuyoList.forEach(el => {
      this.calcConnectRecursive(el);
    });
  }

  private calcConnectRecursive(fieldPuyo: FieldPuyo, preFieldPuyo?: FieldPuyo): void {
    // ゆうれいの場合は終了
    if (fieldPuyo.isGhost()) {
      return;
    }

    // 連結数が計算済の場合は終了
    if (fieldPuyo.isSetConnect()) {
      return;
    }

    // 色ぷよでない場合は終了
    if (!fieldPuyo.isColorPuyo()) {
      return;
    }

    let connect: Connect;
    if (preFieldPuyo === undefined) {
      connect = new Connect();
    } else {
      if (!fieldPuyo.isSameColor(preFieldPuyo)) {
        return;
      }
      if (preFieldPuyo.connect === undefined) {
        throw Error("想定外のエラー");
      }
      connect = preFieldPuyo.connect;
      connect.increment();
    }

    fieldPuyo.connect = connect;

    // 四方向に再帰
    Coord.UDLF.forEach(coord => {
      const nextCoord = fieldPuyo.coord.add(coord);
      const nextFieldPuyo = this.getFieldPuyo(nextCoord);
      if (nextFieldPuyo !== undefined) {
        this.calcConnectRecursive(nextFieldPuyo, fieldPuyo);
      }
    });
  }

  private erase(): EraseAnime {
    const erasePuyoAnimeList: ErasePuyoAnime[] = [];

    this._fieldPuyoList.forEach(fieldPuyo => {
      if  (fieldPuyo.isErasable()) {
        // 自分を消す
        this.removeFieldPuyo(fieldPuyo.coord);
        erasePuyoAnimeList.push({ coord: fieldPuyo.coord });
        
        // 隣のお邪魔を消す
        Coord.UDLF.forEach(coord => {
          const nextCoord = fieldPuyo.coord.add(coord);
          const nextFieldPuyo = this.getFieldPuyo(nextCoord);
          if (nextFieldPuyo !== undefined && nextFieldPuyo.isOjama() && !nextFieldPuyo.isGhost()) { // ゆうれいは不要
            this.removeFieldPuyo(nextCoord);
            erasePuyoAnimeList.push({ coord: nextCoord });
          }
        });
      }
    });

    return { erasePuyoAnimeList };
  }
  
  /**
   * 
   */
  private resetConnect(): void {
    this._fieldPuyoList.forEach(fieldPuyo => {
      fieldPuyo.resetConnect();
    });
  }
}