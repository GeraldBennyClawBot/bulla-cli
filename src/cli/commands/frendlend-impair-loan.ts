import { Command } from '@effect/cli';
import { frendlendImpairLoanBuildCommand } from './frendlend-impair-loan-build.js';

export const frendlendImpairLoanCommand = Command.make('impair-loan', {}).pipe(
    Command.withDescription('Mark a loan as impaired'),
    Command.withSubcommands([frendlendImpairLoanBuildCommand]),
);
