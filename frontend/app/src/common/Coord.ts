export class Coord {
  x: number;
  y: number;

  static UDLF: Coord[] = [
    new Coord( 0, 1),
    new Coord( 0,-1),
    new Coord( 1, 0),
    new Coord(-1, 0),
  ];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isSameCoord(coord: Coord): boolean {
    return this.x === coord.x && this.y === coord.y;
  }

  clone(): Coord {
    return new Coord(this.x, this.y);
  }

  add(coord: Coord): Coord {
    this.x += coord.x;
    this.y += coord.y;
    return this;
  }
}