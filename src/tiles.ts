const tileSize = 16;

const tiles: Record<string, AtlasPosition[]> = Object.fromEntries(
  Object.entries({
    groundLeft: [[0, 0]],
    groundMiddle: [[1, 0]],
    groundRight: [[2, 0]],
    groundBottom: [[3, 0]],
    crate: [[4, 0]],
    platformLeft: [[5, 0]],
    platformMiddle: [[6, 0]],
    platformRight: [[7, 0]],
    water: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 1],
      [7, 1],
    ],
    waterBottom: [[0, 2]],
    flag: [
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
    ],
    tree: [[0, 3]],
    bush: [[1, 3]],
  }).map((entry) => [
    entry[0],
    entry[1].map((position) => [
      position[0] * (tileSize + 2) + 1,
      position[1] * (tileSize + 2) + 1,
    ]),
  ])
);

export default tiles;
