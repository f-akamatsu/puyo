/**
 * 連結数を参照渡しにしたいため。。
 */
export class Connect {
  private _size: number;

  constructor() {
    this._size = 1;
  }

  increment(): void {
    this._size++;
  }

  isErasable(): boolean {
    return this._size >= 4;
  }

  get size(): number {
    return this._size;
  }
}