"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreaseOwnWinRequirementEffect = decreaseOwnWinRequirementEffect;
function decreaseOwnWinRequirementEffect(currentRequirement) {
    if (currentRequirement <= 3) {
        throw new Error("Win requirement cannot be lower than 3");
    }
    return currentRequirement - 1;
}
