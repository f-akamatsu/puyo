import { Coord } from "@/class/Coord";
import { Connect } from "@/class/Connect";

export class FieldPuyo {
  private _coord: Coord;
  private _color: string;
  private _connect?: Connect;

  constructor(coord: Coord, color: string) {
    this._coord = coord;
    this._color = color;
  }

  resetConnect(): void {
    this._connect = undefined;
  }

  isSetConnect(): boolean {
    return this._connect !== undefined;
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

  isSameColor(fieldPuyo: FieldPuyo): boolean {
    return this._color === fieldPuyo._color;
  }

  isSameCoord(coord: Coord): boolean {
    return this._coord.isSameCoord(coord);
  }

  isErasable(): boolean {
    return this._connect !== undefined && this._connect.isErasable();
  }

  isGhost(): boolean {
    return this._coord.y >= 12;
  }

  get coord(): Coord {
    return this._coord;
  }

  get color(): string {
    return this._color;
  }

  get connect(): Connect|undefined {
    return this._connect;
  }

  set connect(connect: Connect|undefined) {
    this._connect = connect;
  }
}