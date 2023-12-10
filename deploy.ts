import { Account,Ed25519PrivateKey, Aptos, AptosConfig, Network, AccountAddress } from '@aptos-labs/ts-sdk';
import { load } from 'ts-dotenv';

const env = load({
    PRIVATE_KEY: String,
});

const privateKeyBytes = env.PRIVATE_KEY;
const privateKey = new Ed25519PrivateKey(privateKeyBytes);


const account = Account.fromPrivateKey({ privateKey });

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

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
