import { ExtensionContext } from 'vscode';
import { setting } from './setting';
import { customBar } from './customBar';
import { command } from './command';

export function activate(context: ExtensionContext) {
  setting.init(context);
  command.init(context);
  customBar.init(context);
}

export function deactivate() {
  customBar.cancelUpdate(true);
}
