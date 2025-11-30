const tileSize = 16;

const atlasPositions: Record<string, AtlasPosition> = Object.fromEntries(
  Object.entries({
    groundLeft: [0, 0],
    groundMiddle: [1, 0],
    groundRight: [2, 0],
    groundBottom: [3, 0],
    crate: [4, 0],
    platform: [5, 0],
    tree: [6, 0],
    bush: [7, 0],
    water: [0, 1],
    waterBottom: [0, 2],
    flag: [1, 2],
  }).map((entry) => [
    entry[0],
    [entry[1][0] * tileSize, entry[1][1] * tileSize, tileSize],
  ])
);

export default atlasPositions;
