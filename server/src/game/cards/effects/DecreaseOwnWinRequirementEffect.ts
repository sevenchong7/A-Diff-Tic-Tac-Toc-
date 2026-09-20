export function decreaseOwnWinRequirementEffect(
  currentRequirement: number
): number {
  if (currentRequirement <= 3) {
    throw new Error(
      "Win requirement cannot be lower than 3"
    );
  }

  return currentRequirement - 1;
}