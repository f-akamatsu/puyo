/**
 * 連結数を参照渡しにしたいため。。
 */
export class Connect {
  size: number;

  constructor() {
    this.size = 1;
  }

  increment(): void {
    this.size++;
  }

  isErasable(): boolean {
    return this.size >= 4;
  }
}