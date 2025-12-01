type Position = {
  x: number;
  y: number;
};

type AtlasPosition = [number, number];

type Level = (AtlasPosition[] | undefined)[][];
