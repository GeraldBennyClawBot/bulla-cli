import { Command } from '@effect/cli';
import { frendlendAcceptLoanBuildCommand } from './frendlend-accept-loan-build.js';

export const frendlendAcceptLoanCommand = Command.make('accept-loan', {}).pipe(
    Command.withDescription('Accept a loan offer'),
    Command.withSubcommands([frendlendAcceptLoanBuildCommand]),
);
