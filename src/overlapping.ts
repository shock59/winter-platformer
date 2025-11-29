export default function overlapping(
  edgesA: [number, number],
  edgesB: [number, number]
) {
  return (
    (edgesA[0] < edgesB[0] && edgesA[1] >= edgesB[0]) ||
    (edgesA[0] <= edgesB[1] && edgesA[1] > edgesB[1]) ||
    (edgesA[0] <= edgesB[0] && edgesA[1] >= edgesB[1]) ||
    (edgesA[0] >= edgesB[0] && edgesA[1] <= edgesB[1])
  );
}
