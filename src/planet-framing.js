// A sphere's silhouette uses a tangent, not its equatorial radius at the origin.
// Fit the particle shell against the narrower horizontal/vertical half-frustum.
export function fitSphereDistance(radius, aspect, verticalFov = 36, occupancy = .78) {
  if (!(radius > 0 && aspect > 0 && verticalFov > 0 && verticalFov < 180 && occupancy > 0 && occupancy < 1)) {
    throw new RangeError('Invalid sphere framing parameters');
  }
  const tanHalf = Math.tan(verticalFov * Math.PI / 360) * Math.min(1, aspect);
  return radius * Math.sqrt(1 + 1 / (occupancy * tanHalf) ** 2);
}

export function projectedSphereRadius(radius, distance, height, verticalFov = 36) {
  if (distance <= radius) return Infinity;
  return radius / Math.sqrt(distance * distance - radius * radius) / Math.tan(verticalFov * Math.PI / 360) * height / 2;
}
