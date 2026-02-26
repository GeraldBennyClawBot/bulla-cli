import { Options } from '@effect/cli';

// Loan offer and claim options
export const offerIdOption = Options.text('offer-id').pipe(Options.withDescription('Loan offer ID'));

export const claimIdOption = Options.integer('claim-id').pipe(Options.withDescription('The ID of the loan claim'));

export const loanAmountOption = Options.text('loan-amount').pipe(Options.withDescription('Loan amount in token wei'));

export const termLengthOption = Options.integer('term-length').pipe(Options.withDescription('Loan term length in seconds'));

// Address options
export const creditorOption = Options.text('creditor').pipe(Options.withDescription('Creditor address'));

export const debtorOption = Options.text('debtor').pipe(Options.withDescription('Debtor address'));

export const receiverOption = Options.text('receiver').pipe(
    Options.withDescription('Receiver address for loan funds'),
);

// Offer expiration and callback options
export const expiresAtOption = Options.integer('expires-at').pipe(
    Options.withDefault(0),
    Options.withDescription('Offer expiration timestamp (0 for no expiry)'),
);

export const callbackContractOption = Options.text('callback-contract').pipe(
    Options.withDefault('0x0000000000000000000000000000000000000000'),
    Options.withDescription('Callback contract address'),
);

export const callbackSelectorOption = Options.text('callback-selector').pipe(
    Options.withDefault('0x00000000'),
    Options.withDescription('Callback function selector (bytes4 hex)'),
);

// Payment and loan ID options
export const paymentAmountOption = Options.text('payment-amount').pipe(Options.withDescription('Payment amount in token wei'));

export const loanIdOption = Options.text('loan-id').pipe(Options.withDescription('Loan ID'));

// Reused from invoice-options (re-exported for convenience)
export const descriptionOption = Options.text('description').pipe(
    Options.withDefault(''),
    Options.withDescription('Loan description'),
);

export const impairmentGracePeriodOption = Options.integer('impairment-grace-period').pipe(
    Options.withDefault(0),
    Options.withDescription('Grace period in seconds after due date before loan can be marked impaired'),
);

export const interestRateBpsOption = Options.integer('interest-rate-bps').pipe(
    Options.withDefault(0),
    Options.withDescription('Interest rate in basis points (1% = 100 bps, 0 = no interest)'),
);

export const periodsPerYearOption = Options.integer('periods-per-year').pipe(
    Options.withDefault(0),
    Options.withDescription('Number of compounding periods per year (0 = simple interest, 1-365 for compound)'),
);

// Token option (reused from pay-options)
export const tokenOption = Options.text('token').pipe(
    Options.withDefault('0x0000000000000000000000000000000000000000'),
    Options.withAlias('t'),
    Options.withDescription('ERC20 token address. Omit or use 0x0...0 for native currency'),
);
