import { EventEmitter } from 'events';
import { customBar } from './customBar';
import { command } from './command';

class ExtensionEmitter extends EventEmitter { }

export const extensionEmitter = new ExtensionEmitter();

extensionEmitter.on('setting-update', () => {
  customBar.onSettingUpdate();
  command.changeContext();
});
