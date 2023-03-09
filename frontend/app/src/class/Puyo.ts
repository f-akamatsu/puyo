export class Puyo {
  private _color: string;

  constructor(color: string) {
    this._color = color;
  }

  isColorPuyo(): boolean {
    return this._color === "1"
        || this._color === "2"
        || this._color === "3"
        || this._color === "4"
        || this._color === "5";
  }

  isOjama(): boolean {
    return this._color === "9";
  }

  isSameColor(puyo: Puyo): boolean {
    return this._color === puyo.color;
  }

  get color(): string {
    return this._color;
  }
}