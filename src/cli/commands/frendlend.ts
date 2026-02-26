import { Command } from '@effect/cli';
import { frendlendOfferLoanCommand } from './frendlend-offer-loan.js';
import { frendlendAcceptLoanCommand } from './frendlend-accept-loan.js';
import { frendlendRejectLoanCommand } from './frendlend-reject-loan.js';
import { frendlendPayLoanCommand } from './frendlend-pay-loan.js';
import { frendlendImpairLoanCommand } from './frendlend-impair-loan.js';
import { frendlendMarkPaidCommand } from './frendlend-mark-paid.js';
import { frendlendSetCallbackCommand } from './frendlend-set-callback.js';

export const frendlendCommand = Command.make('frendlend', {}).pipe(
    Command.withDescription('FrendLend loan operations'),
    Command.withSubcommands([
        frendlendOfferLoanCommand,
        frendlendAcceptLoanCommand,
        frendlendRejectLoanCommand,
        frendlendPayLoanCommand,
        frendlendImpairLoanCommand,
        frendlendMarkPaidCommand,
        frendlendSetCallbackCommand,
    ]),
);
