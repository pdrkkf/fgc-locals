const assert = require('node:assert/strict');
const test = require('node:test');
const groupNearbyPoints = require('../dist/clustering.js');

function point(x, y = 0) {
  return { x, y, distanceTo(other) { return Math.hypot(this.x - other.x, this.y - other.y); } };
}

function clusterKeys(groups, points, radius) {
  return groupNearbyPoints(groups, points, radius).map(cluster => cluster.map(group => group.key));
}

test('keeps clusters compact instead of chaining nearby points transitively', () => {
  const groups = [{ key: 'a' }, { key: 'b' }, { key: 'c' }];
  const clusters = clusterKeys(groups, [point(0), point(30), point(60)], 40);

  assert.deepEqual(clusters, [['a', 'b'], ['c']]);
});

test('returns the same clusters regardless of input order', () => {
  const groups = [{ key: 'c' }, { key: 'a' }, { key: 'b' }];
  const clusters = clusterKeys(groups, [point(60), point(0), point(30)], 40);

  assert.deepEqual(clusters, [['a', 'b'], ['c']]);
});

test('preserves every location and leaves cluster anchors far enough apart', () => {
  const groups = [{ key: 'a', count: 3 }, { key: 'b', count: 2 }, { key: 'c', count: 1 }, { key: 'd', count: 4 }];
  const points = [point(0), point(20), point(130), point(145)];
  const clusters = groupNearbyPoints(groups, points, 40);
  const members = clusters.flat();
  const anchors = clusters.map(cluster => points[groups.indexOf(cluster[0])]);

  assert.equal(members.reduce((sum, group) => sum + group.count, 0), 10);
  assert.equal(new Set(members.map(group => group.key)).size, groups.length);
  assert.ok(anchors[0].distanceTo(anchors[1]) > 40);
});
