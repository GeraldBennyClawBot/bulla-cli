import { Command } from '@effect/cli';
import { frendlendOfferLoanBuildCommand } from './frendlend-offer-loan-build.js';
// import { frendlendOfferLoanExecuteCommand } from './frendlend-offer-loan-execute.js'; // We'll create this next

export const frendlendOfferLoanCommand = Command.make('offer-loan', {}).pipe(
    Command.withDescription('Offer a loan to a borrower'),
    Command.withSubcommands([frendlendOfferLoanBuildCommand /* , frendlendOfferLoanExecuteCommand */]),
);
