import tiles from "./tiles";

function t(count: number, tile: undefined | AtlasPosition[]) {
  return new Array(count).fill(tile);
}

function ground(width: number) {
  return [
    tiles.groundLeft,
    ...t(width - 2, tiles.groundMiddle),
    tiles.groundRight,
  ];
}

function platform(width: number) {
  return [
    tiles.platformLeft,
    ...t(width - 2, tiles.platformMiddle),
    tiles.platformRight,
  ];
}

export const level: Level = [
  ...new Array(4).fill(t(40, undefined)),
  [...t(22, undefined), ...ground(2), ...t(16, undefined)],
  [
    ...t(16, undefined),
    ...platform(2),
    ...t(4, undefined),
    ...t(2, tiles.groundBottom),
    ...t(16, undefined),
  ],
  [
    ...t(22, undefined),
    ...t(2, tiles.groundBottom),
    ...t(14, undefined),
    tiles.flag,
    undefined,
  ],
  [
    ...ground(11),
    ...t(3, undefined),
    ...ground(8),
    ...t(2, tiles.groundBottom),
    ...ground(3),
    ...t(3, undefined),
    ...ground(11),
  ],
  [
    ...t(11, tiles.groundBottom),
    ...t(3, undefined),
    ...t(12, tiles.groundBottom),
    ...t(3, undefined),
    ...t(11, tiles.groundBottom),
  ],
];

export const background: Level = [
  ...new Array(6).fill(t(40, undefined)),
  [
    tiles.tree,
    ...t(6, undefined),
    ...t(2, tiles.bush),
    ...t(10, undefined),
    tiles.bush,
    ...t(10, undefined),
    tiles.tree,
    ...t(4, undefined),
    tiles.tree,
    ...t(5, undefined),
  ],
  ...new Array(2).fill(t(40, undefined)),
];
