/**
 * 座標クラス。ValueObject意識。
 */
export class Coord {
  private _x: number;
  private _y: number;

  static UDLF: Coord[] = [
    new Coord( 0, 1),
    new Coord( 0,-1),
    new Coord( 1, 0),
    new Coord(-1, 0),
  ];

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  equals(coord: Coord): boolean {
    return this._x === coord._x && this._y === coord._y;
  }

  add(coord: Coord): Coord {
    return new Coord(this._x + coord.x, this._y + coord.y);
  }

  addY(n: number): Coord {
    return new Coord(this._x, this._y + n);
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }
}