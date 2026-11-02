function groupNearbyPoints(groups, points, radius) {
  const ordered = groups
    .map((group, index) => ({ group, point: points[index] }))
    .sort((a, b) => a.group.key.localeCompare(b.group.key, 'pt-BR'));
  const assigned = new Set();
  const clusters = [];

  ordered.forEach((entry, index) => {
    if (assigned.has(index)) return;

    assigned.add(index);
    const cluster = [entry.group];
    ordered.forEach((candidate, candidateIndex) => {
      if (assigned.has(candidateIndex)) return;
      if (entry.point.distanceTo(candidate.point) > radius) return;
      assigned.add(candidateIndex);
      cluster.push(candidate.group);
    });
    clusters.push(cluster);
  });

  return clusters;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = groupNearbyPoints;
} else {
  window.groupNearbyPoints = groupNearbyPoints;
}
