import assert from 'assert';
import anchor from '@project-serum/anchor';
const {SystemProgram} = anchor.web3;
describe('mycalculatordapp', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const calculator = anchor.web3.Keypair.generate();
    const program = anchor.workspace.Mycalculatordapp;

    it('Creates a calculator', async() => {
        await program.rpc.create('Welcome to my calculator dapp', {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                SystemProgram: SystemProgram.programId
            },
            signers: [calculator]
        });
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.greeting === 'Welcome to my calculator dapp');
    })

    it("Adds two numbers", async() => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(5)))
    })

    it("Subtracts two numbers", async() => {
        await program.rpc.subtract(new anchor.BN(3), new anchor.BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(1)))
    })

    it("Multiplies two numbers", async() => {
        await program.rpc.multiply(new anchor.BN(3), new anchor.BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(6)))
    })

    it("Divides two numbers", async() => {
        await program.rpc.divide(new anchor.BN(6), new anchor.BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(3)))
        assert.ok(account.remainder.eq(new anchor.BN(0)))
    })
})