import { Coord } from "@/common/Coord";
import { Connect } from "@/common/Connect";

export class FieldPuyo {
  coord: Coord;
  color: string;
  connect?: Connect;

  constructor(coord: Coord, color: string) {
    this.coord = coord;
    this.color = color;
  }

  resetConnect(): void {
    this.connect = undefined;
  }

  isSetConnect(): boolean {
    return this.connect !== undefined;
  }

  isColorPuyo(): boolean {
    return this.color === "1"
        || this.color === "2"
        || this.color === "3"
        || this.color === "4"
        || this.color === "5";
  }

  isOjama(): boolean {
    return this.color === "9";
  }

  isSameColor(fieldPuyo: FieldPuyo): boolean {
    return this.color === fieldPuyo.color;
  }
}