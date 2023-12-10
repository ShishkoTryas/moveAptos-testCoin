# TestCoinForTask Token

This repository contains the source code for the `TestCoinForTask` token, a custom token deployed on the Aptos testnet. The token is deployed at the address `0x69835c6a05de00242e3fe34fa04178529b62bbe393453505257c2a59a6aa9f10`.

## Token Details

The `TestCoinForTask` token is a custom token designed for testing purposes on the Aptos testnet. It is part of the `admin::TestCoinForTask` module, which provides the following functions:

- `init_module`: Initializes the module and mints an initial supply of tokens.
- `transfer`: Transfers tokens from one account to another.
- `check_balance`: Checks the balance of a specific account.
- `register_for_receiver`: Registers a receiver for the token.

## Using the Token in TypeScript

To interact with the `TestCoinForTask` token in TypeScript, you can use the Aptos TypeScript SDK. Here is a basic example of how to use the `check_balance` function:

```typescript
// Import necessary modules
import { Account, Ed25519PrivateKey, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Initialize the Aptos client
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

// Create a new account
const privateKeyBytes = 'env file'; // replace with your private key bytes
const privateKey = new Ed25519PrivateKey(privateKeyBytes);
const account = Account.fromPrivateKey({ privateKey });

const balance = async (
    name: string,
    accountAddress: AccountAddress,
): Promise<number> => {
    const amount = await aptos.getAccountAPTAmount({
        accountAddress,
    });
    console.log(`${name}'s balance is: ${amount}`);
    return amount;
};
async function main() {
    await balance("MyAcc", account.accountAddress);

    const balance1 = await aptos.build.transaction({
        sender: account.accountAddress,
        data: {
            function: "0x1::admin::TestCoinForTask::check_balance",
            typeArguments: ["0x1::admin::TestCoinForTask::TestCoin"],
            functionArguments: [account.accountAddress],
        },
    });
    console.log(`Balance: ${balance1}`);

    const receiver = Account.generate();
    const amount = 100;
    const transaction = await aptos.build.transaction({
        sender: account.accountAddress,
        data: {
            function: "0x1::admin::TestCoinForTask::transfer",
            typeArguments: ["0x1::admin::TestCoinForTask::TestCoin"],
            functionArguments: [receiver.accountAddress, amount],
        },
    });
    const senderAuthenticator = aptos.sign.transaction({
        signer: account,
        transaction,
    });
    const pendingTransaction = await aptos.submit.transaction({
        transaction,
        senderAuthenticator,
    });

    const committedTransaction = await aptos.waitForTransaction({
        transactionHash: pendingTransaction.hash,
    });

}

main();
 arguments: [account.accountAddress],
});
console.log(`Balance: ${balance}`);
```
