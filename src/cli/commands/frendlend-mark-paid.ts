import { Command } from '@effect/cli';
import { frendlendMarkPaidBuildCommand } from './frendlend-mark-paid-build.js';

export const frendlendMarkPaidCommand = Command.make('mark-paid', {}).pipe(
    Command.withDescription('Mark a loan as paid'),
    Command.withSubcommands([frendlendMarkPaidBuildCommand]),
);
