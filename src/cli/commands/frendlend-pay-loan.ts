import { Command } from '@effect/cli';
import { frendlendPayLoanBuildCommand } from './frendlend-pay-loan-build.js';

export const frendlendPayLoanCommand = Command.make('pay-loan', {}).pipe(
    Command.withDescription('Pay a loan'),
    Command.withSubcommands([frendlendPayLoanBuildCommand]),
);
