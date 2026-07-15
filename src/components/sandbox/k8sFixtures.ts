export const FAKE_PODS = [
  { name: 'api-7d8f9c6b8-x2k9p', ready: '1/1', status: 'Running', restarts: '0', age: '2d' },
  { name: 'web-6b5f9d8c7-p8m2q', ready: '1/1', status: 'Running', restarts: '1', age: '5h' },
  { name: 'redis-0', ready: '1/1', status: 'Running', restarts: '0', age: '10d' },
  { name: 'migration-job-4kd9x', ready: '0/1', status: 'CrashLoopBackOff', restarts: '5', age: '15m' },
];

export const FAKE_DEPLOYMENTS = [
  { name: 'api', ready: '3/3', upToDate: '3', available: '3', age: '10d' },
  { name: 'web', ready: '2/2', upToDate: '2', available: '2', age: '10d' },
];

export const FAKE_SERVICES = [
  { name: 'api', type: 'ClusterIP', clusterIp: '10.96.12.34', externalIp: '<none>', ports: '80/TCP', age: '10d' },
  { name: 'web', type: 'LoadBalancer', clusterIp: '10.96.45.67', externalIp: '203.0.113.10', ports: '80:31245/TCP', age: '10d' },
];

export const FAKE_NAMESPACES = [
  { name: 'default', status: 'Active', age: '60d' },
  { name: 'kube-system', status: 'Active', age: '60d' },
];
