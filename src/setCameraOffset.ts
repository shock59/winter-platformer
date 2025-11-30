export default function setCameraOffset(
  playerPosition: number,
  halfViewDimension: number,
  cameraBounds: { min: number; max: number }
) {
  if (playerPosition - halfViewDimension < cameraBounds.min) {
    return cameraBounds.min - (playerPosition - halfViewDimension);
  } else if (playerPosition + halfViewDimension > cameraBounds.max) {
    return -(playerPosition + halfViewDimension - cameraBounds.max);
  } else {
    return 0;
  }
}
