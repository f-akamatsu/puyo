import { Coord } from "@/common/Coord";
import { FieldPuyo } from "@/common/FieldPuyo";
import { Connect } from "@/common/Connect";
import { ChainInfo } from "./ChainInfo";

export class FieldPuyoList implements Iterable<FieldPuyo> {

  fieldPuyoList: FieldPuyo[];

  constructor() {
    this.fieldPuyoList = [];
  }

  [Symbol.iterator]() {
    let pointer = 0;
    const fieldPuyoList = this.fieldPuyoList;

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
    const fieldPuyo = this.fieldPuyoList.find(el => {
      return el.coord.isSameCoord(coord);
    });
    return fieldPuyo;
  }

  /**
   * 
   * @param fieldPuyo 
   */
  setFieldPuyo(fieldPuyo: FieldPuyo): void {
    this.removeFieldPuyo(fieldPuyo.coord);
    this.fieldPuyoList.push(fieldPuyo);
  }

  /**
   * 
   * @param coord 
   */
  removeFieldPuyo(coord: Coord): void {
    const tempList = this.fieldPuyoList.filter(el => {
      return !el.coord.isSameCoord(coord);
    });
    this.fieldPuyoList = tempList;
  }

  drop(): void {
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 12; y++) {
        // 下の段から順にチェック。
        // ぷよがある場合はスキップ。
        // ぷよがない場合は、それより上にぷよがあるを確認し、あれば落としてくる。
        // 最上段はチェック不要（それより上にぷよはないため）。
        const toCoord = new Coord(x, y);
        const toPuyo = this.getFieldPuyo(toCoord);
  
        if (toPuyo !== undefined) {
          continue;
        }
  
        const fromCoord = new Coord(x, y);
        let fromPuyo: FieldPuyo | undefined;
        do {
          fromCoord.y++;
          fromPuyo = this.getFieldPuyo(fromCoord);
        } while(fromCoord.y < 12 && fromPuyo === undefined);
  
        if (fromPuyo === undefined) {
          continue;
        }
  
        const newPuyo = new FieldPuyo(toCoord, fromPuyo.color);
        this.setFieldPuyo(newPuyo);
        this.removeFieldPuyo(fromCoord);
      }
    }
  }

  chain(chainNum: number): ChainInfo {
    this.calcConnect();
    const chainInfo = this.calcScore(chainNum);
    if (chainInfo.erase > 0) {
      this.erase();
    }
    return chainInfo;
  }

  calcScore(chain: number): ChainInfo {
    const connectArray: Connect[] = [];
    const colorArray: string[] = [];
    this.fieldPuyoList.forEach(el => {
      if (el.connect !== undefined && el.connect.isErasable()) {
        if (!connectArray.includes(el.connect)) {
          connectArray.push(el.connect);
        }
        if (!colorArray.includes(el.color)) {
          colorArray.push(el.color);
        }
      }
    });

    const erase = connectArray.reduce((sum, connect) => { return sum + connect.size; }, 0);
    const connectSizeArray = connectArray.map(connect => connect.size);
    const color = colorArray.length;

    return new ChainInfo(chain, erase, color, connectSizeArray);
  }

  calcConnect(): void {
    this.resetConnect();

    this.fieldPuyoList.forEach(el => {
      this.calcConnectRecursive(el);
    });
  }

  calcConnectRecursive(fieldPuyo: FieldPuyo, preFieldPuyo?: FieldPuyo): void {
    // ゆうれいの場合は終了
    if (fieldPuyo.coord.y >= 12) {
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
      const nextCoord = fieldPuyo.coord.clone().add(coord);
      const nextFieldPuyo = this.getFieldPuyo(nextCoord);
      if (nextFieldPuyo !== undefined) {
        this.calcConnectRecursive(nextFieldPuyo, fieldPuyo);
      }
    });
  }

  erase(): void {
    this.fieldPuyoList.forEach(puyo => {
      if  (puyo.connect !== undefined && puyo.connect.isErasable()) {
        // 自分を消す
        this.removeFieldPuyo(puyo.coord);
        
        // 隣のお邪魔を消す
        Coord.UDLF.forEach(coord => {
          const nextCoord = puyo.coord.clone().add(coord);
          const nextFieldPuyo = this.getFieldPuyo(nextCoord);
          if (nextFieldPuyo !== undefined && nextFieldPuyo.isOjama() && nextCoord.y < 12) { // ゆうれいは不要
            this.removeFieldPuyo(nextCoord);
          }
        });
      }
    });
  }
  
  /**
   * 
   */
  resetConnect(): void {
    this.fieldPuyoList.forEach(el => {
      el.resetConnect();
    });
  }
}