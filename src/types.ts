/* eslint-disable @typescript-eslint/naming-convention */
export enum Commands {
  'EnableAll' = 'CustomBar.EnableAll',
  'DisableAll' = 'CustomBar.DisableAll',
  'EnableCpuLoad' = 'CustomBar.EnableCpuLoad',
  'DisableCpuLoad' = 'CustomBar.DisableCpuLoad',
  'EnableNetworkSpeed' = 'CustomBar.EnableNetworkSpeed',
  'DisableNetworkSpeed' = 'CustomBar.DisableNetworkSpeed',
  'EnableGpuLoad' = 'CustomBar.EnableGpuLoad',
  'DisableGpuLoad' = 'CustomBar.DisableGpuLoad',
}

export enum ConfigurationKeys {
  RefreshInterval = 'refreshInterval',
  Location = 'location',
  Priority = 'priority',
  Modules = 'modules',
  AllEnabled = 'enabled',
  CpuLoadFormat = 'cpuLoad.format',
  NetworkSpeedFormat = 'networkSpeed.format',
  GpuLoadFormat = 'gpuload.format',
}
