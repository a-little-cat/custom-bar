import * as si from 'systeminformation';
import * as os from 'os';
import { getMacOsMemoryUsageInfo } from './memory';
import { isDarwin, isWin32 } from '../utils';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
import { spawn } from 'child_process';


export function siInit() {
  if (isWin32) {
    si.powerShellStart();
  }
}

export function siRelease() {
  if (isWin32) {
    si.powerShellRelease();
  }
}

export async function getCpuLoad() {
  try {
    const valueObject = {
      currentLoad: 'currentLoad',
      mem: 'total,free,buffers,cached'
    }
    const data = await si.get(valueObject);
    const mem = data.mem
    const used = mem.total - mem.free - mem.buffers - mem.cached
    return {
      cpu_used: data.currentLoad.currentLoad,
      total: data.mem.total,
      used: used,
    };
  } catch (err) { }
}

export async function getNetworkSpeed() {
  try {
    const defaultInterface = await si.networkInterfaceDefault();
    const res = await si.networkStats(defaultInterface);
    const cur = res[0];
    return {
      up: cur.tx_sec,
      down: cur.rx_sec
    };
  } catch (err) { }
}

export async function getMemoryUsage() {
  try {
    if (isDarwin) {
      const res = await getMacOsMemoryUsageInfo();
      return {
        total: res.total,
        used: res.used,
        active: res.active,
        pressurePercent: res.pressurePercent,
        usagePercent: res.usagePercent
      };
    } else {
      const res = await si.mem();
      return {
        total: res.total,
        used: res.used,
        active: res.active
      };
    }
  } catch (err) { }
}

async function getX86GpuInfo() {
  try {
    const { stdout, stderr } = await execPromise('nvidia-smi --query-gpu=memory.total,memory.used,utilization.gpu --format=csv,noheader,nounits');
    if (stderr) {
      return null;
    }

    const lines = stdout.trim().split('\n');
    const gpuInfo = lines.map(line => {
      const [totalMemory, usedMemory, gpuUtilization] = line.split(', ').map(Number);
      return {
        totalMemory,
        usedMemory,
        gpuUtilization,
      };
    });
    return gpuInfo;
  } catch (error) {
    return null;
  }
}

async function getTegraGpuInfo() {
  try {
    const { stdout, stderr } = await execPromise('tegrastats');
    if (stderr) {
      return null;
    }

    const lines = stdout.trim().split('\n');
    const tegraInfo = lines.map(line => {
      const match = line.match(/(\d+)\/(\d+)\s+MB\s+(\d+)%/);
      if (match) {
        const usedMemory = Number(match[1]);
        const totalMemory = Number(match[2]);
        const gpuUtilization = Number(match[3]);
        return {
          usedMemory,
          totalMemory,
          gpuUtilization,
        };
      }
      return null;
    }).filter(Boolean);

    return tegraInfo;
  } catch (error) {
    return null;
  }
}

async function GetGpuInfo() {
  try {
    const { stdout } = await execPromise('uname -m');
    const arch = stdout.trim();

    if (arch === 'x86_64' || arch === 'i686') {
      return await getX86GpuInfo();
    } else if (arch.includes('tegra')) {
      return await getTegraGpuInfo();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function getGpuLoad() {
  try {
    return GetGpuInfo();
  } catch (err) { }
}

export const sysinfoData = {
  networkSpeed: getNetworkSpeed,
  cpuLoad: getCpuLoad,
  gpuLoad: getGpuLoad,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AllSysModules = Object.keys(sysinfoData) as StatsModule[];

export type SysinfoData = typeof sysinfoData;

export type StatsModule = keyof typeof sysinfoData;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StatsModuleNameMap: { [key in StatsModule]: string } = {
  cpuLoad: 'CpuLoad',
  networkSpeed: 'NetworkSpeed',
  gpuLoad: 'GpuLoad'
};
