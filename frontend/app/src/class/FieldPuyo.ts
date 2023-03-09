import { Coord } from "@/class/Coord";
import { Connect } from "@/class/Connect";
import { Puyo } from "./Puyo";

export class FieldPuyo extends Puyo {
  private _coord: Coord;
  private _connect?: Connect;

  constructor(coord: Coord, color: string) {
    super(color);
    this._coord = coord;
  }

  resetConnect(): void {
    this._connect = undefined;
  }

  isSetConnect(): boolean {
    return this._connect !== undefined;
  }

  isSameCoord(coord: Coord): boolean {
    return this._coord.equals(coord);
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

  set coord(coord: Coord) {
    this._coord = coord;
  }

  get connect(): Connect|undefined {
    return this._connect;
  }

  set connect(connect: Connect|undefined) {
    this._connect = connect;
  }
}