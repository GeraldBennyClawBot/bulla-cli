import { Command } from '@effect/cli';
import { frendlendSetCallbackBuildCommand } from './frendlend-set-callback-build.js';

export const frendlendSetCallbackCommand = Command.make('set-callback', {}).pipe(
    Command.withDescription('Set paid loan callback'),
    Command.withSubcommands([frendlendSetCallbackBuildCommand]),
);
