import { Command } from '@effect/cli';
import { Console, Effect, Either } from 'effect';
import { buildSetPaidLoanCallback } from '../../application/services/frendlend-service.js';
import { isChainId } from '../../domain/types/eth.js';
import { validateAddress } from '../../domain/validation/eth.js';
import { formatTransaction, type OutputFormat } from '../formatters/index.js';
import { chainOption, formatOption } from '../options/common.js';
import { loanIdOption, callbackContractOption, callbackSelectorOption } from '../options/frendlend-options.js';

export const frendlendSetCallbackBuildCommand = Command.make(
    'build',
    {
        chain: chainOption,
        loanId: loanIdOption,
        callbackContract: callbackContractOption,
        callbackSelector: callbackSelectorOption,
        format: formatOption,
    },
    ({ chain, loanId, callbackContract, callbackSelector, format }) =>
        Effect.gen(function* () {
            if (!isChainId(chain)) {
                yield* Console.error(`Unsupported chain ID: ${chain}`);
                return;
            }

            // Validate callback contract address
            const contractResult = validateAddress(callbackContract);
            if (Either.isLeft(contractResult)) {
                yield* Console.error(`Invalid callback contract address: ${contractResult.left.message}`);
                return;
            }

            // Validate callback selector format (should be bytes4 hex string)
            if (!callbackSelector.startsWith('0x') || callbackSelector.length !== 10) {
                yield* Console.error(`Invalid callback selector: ${callbackSelector}. Must be a bytes4 hex string (e.g., 0x12345678)`);
                return;
            }

            const params = {
                chainId: chain,
                loanId: BigInt(loanId),
                callbackContract: contractResult.right,
                callbackSelector,
            };

            const tx = yield* buildSetPaidLoanCallback(params);
            const output = formatTransaction(tx, params.chainId, format as OutputFormat);
            yield* Console.log(output);
        }),
).pipe(Command.withDescription('Build an unsigned setPaidLoanCallback transaction (no private key required)'));
