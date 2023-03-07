import { Coord } from "@/class/Coord";
/**
 * フィールドのアニメーション用のインターフェース群。
 */

/**
 * 1つのぷよが落ちる。
 */
export interface DropPuyoAnime {
  /** 落ちる元の座標 */
  fromCoord: Coord;
  /** 落ちる先の座標 */
  toCoord: Coord;
}

/**
 * 複数のぷよが同時に落ちる。
 */
export interface DropAnime {
  dropPuyoAnimeList: DropPuyoAnime[];
}

/**
 * 1つのぷよが消える。
 */
export interface ErasePuyoAnime {
  coord: Coord;
}

/**
 * 複数のぷよが同時に消える。
 */
export interface EraseAnime {
  erasePuyoAnimeList: ErasePuyoAnime[];
}

/**
 * 1連鎖分。
 * 落ちて→消える。
 */
export interface ChainAnime {
  dropAnime: DropAnime;
  eraseAnime: EraseAnime;
}

/**
 * 連鎖全体。
 */
export interface AllChainAnime {
  chainAnimeList: ChainAnime[];
}