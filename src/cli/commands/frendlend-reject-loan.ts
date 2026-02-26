import { Command } from '@effect/cli';
import { frendlendRejectLoanBuildCommand } from './frendlend-reject-loan-build.js';

export const frendlendRejectLoanCommand = Command.make('reject-loan', {}).pipe(
    Command.withDescription('Reject a loan offer'),
    Command.withSubcommands([frendlendRejectLoanBuildCommand]),
);
