import { ExtensionContext, commands, window, env, ConfigurationTarget } from 'vscode';
import { Commands, ConfigurationKeys } from './types';
import { setting } from './setting';

class Command {
  init(context: ExtensionContext) {
    this.registerCommand();
    this.changeContext();
  }

  changeContext() {
    const modules = setting.curModules;
    setting.allModules.forEach(moduleName => {
      commands.executeCommand('setContext', `statsBar.${moduleName}`, modules.includes(moduleName));
    });
  }

  registerCommand() {
    commands.registerCommand(
      Commands.EnableAll,
      () => {
        setting.cfg?.update(ConfigurationKeys.AllEnabled, true, ConfigurationTarget.Global);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableAll,
      () => {
        setting.cfg?.update(ConfigurationKeys.AllEnabled, false, ConfigurationTarget.Global);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableCpuLoad,
      () => {
        setting.enableModule('cpuLoad');
      },
      this
    );

    commands.registerCommand(
      Commands.DisableCpuLoad,
      () => {
        setting.disableModule('cpuLoad');
      },
      this
    );

    commands.registerCommand(
      Commands.EnableNetworkSpeed,
      () => {
        setting.enableModule('networkSpeed');
      },
      this
    );

    commands.registerCommand(
      Commands.DisableNetworkSpeed,
      () => {
        setting.disableModule('networkSpeed');
      },
      this
    );
  }
}

export const command = new Command();
