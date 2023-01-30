const { expect } = require('chai');
const { BN, expectEvent, expectRevert, makeInterfaceId, time } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const EthCrypto = require("eth-crypto");
const FactoryERC721 = artifacts.require('FactoryERC721');
const ERC721Instance = artifacts.require('ERC721Instance');

const MINUS_ONE = new BN(-1);
const ZERO = new BN(0);
const ONE = new BN(1);
const TWO = new BN(2);
const THREE = new BN(3);
const FOUR = new BN(4);
const FIVE = new BN(5);
const SIX = new BN(6);
const SEVEN = new BN(7);
const EIGHT = new BN(8);
const NINE = new BN(9);
const TEN = new BN(10);
const TWENTY = new BN(20);

const DECIMALS = new BN(18);
const ONE_TOKEN = TEN.pow(DECIMALS);
const TWO_TOKEN = ONE_TOKEN.mul(TWO);

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

require('dotenv').config();
const {
} = process.env;

let FactoryERC721Inst;
let signer;
let chainID;

contract (
    'ERC721 factory and instance',
    ([
        deployer,
        owner,
        user1,
        user2
    ]) => {

        it('Main functionality', async () => {

            chainID = await web3.eth.getChainId();

            FactoryERC721Inst = await FactoryERC721.new(owner);
            await FactoryERC721Inst.transferOwnership(owner);

            signer = EthCrypto.createIdentity();

            await expectRevert(FactoryERC721Inst.setSigner(signer.address), "Ownable: caller is not the owner");
            await FactoryERC721Inst.setSigner(signer.address, {from: owner});

            await time.advanceBlock();
            let TIME = new BN(await time.latest()).add(new BN(60));
            let signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user1},
                    {type: "address", value: FactoryERC721Inst.address},
                    {type: "string", value: "name"},
                    {type: "string", value: "symbol"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await expectRevert(FactoryERC721Inst.deployERC721Instance(ZERO, "name", "symbol", TIME, signature, {from: user2}), "Invalid signature");

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user1},
                    {type: "address", value: FactoryERC721Inst.address},
                    {type: "string", value: "name"},
                    {type: "string", value: "symbol"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await expectRevert(FactoryERC721Inst.deployERC721Instance(ZERO, "symbol", "name", TIME, signature, {from: user1}), "Invalid signature");

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID + 1},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user1},
                    {type: "address", value: FactoryERC721Inst.address},
                    {type: "string", value: "name"},
                    {type: "string", value: "symbol"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await expectRevert(FactoryERC721Inst.deployERC721Instance(ZERO, "name", "symbol", TIME, signature, {from: user1}), "Invalid signature");

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user1},
                    {type: "address", value: FactoryERC721Inst.address},
                    {type: "string", value: "name"},
                    {type: "string", value: "symbol"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await time.increase(time.duration.minutes(2));
            await expectRevert(FactoryERC721Inst.deployERC721Instance(ZERO, "name", "symbol", TIME, signature, {from: user1}), "Deadline passed");

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user1},
                    {type: "address", value: FactoryERC721Inst.address},
                    {type: "string", value: "name"},
                    {type: "string", value: "symbol"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            let tx = await FactoryERC721Inst.deployERC721Instance(ZERO, "name", "symbol", TIME, signature, {from: user1});
            let Instance = await ERC721Instance.at(tx.logs[0].args.instance);

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user2},
                    {type: "address", value: FactoryERC721Inst.address},
                    {type: "string", value: "name"},
                    {type: "string", value: "symbol"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await expectRevert(FactoryERC721Inst.deployERC721Instance(ZERO, "name", "symbol", TIME, signature, {from: user2}), "Order ID already used");

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user2},
                    {type: "address", value: Instance.address},
                    {type: "string", value: "a"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await expectRevert(Instance.mint(ZERO, "a", TIME, signature, {from: user1}), "Invalid signature");

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user2},
                    {type: "address", value: Instance.address},
                    {type: "string", value: "a"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await time.increase(time.duration.minutes(2));
            await time.advanceBlock();
            await expectRevert(Instance.mint(ZERO, "a", TIME, signature, {from: user2}), "Deadline passed");

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user2},
                    {type: "address", value: Instance.address},
                    {type: "string", value: "a"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await Instance.mint(ZERO, "a", TIME, signature, {from: user2});
            expect(await Instance.totalSupply()).bignumber.equal(ONE);

            await Instance.burn(ZERO, {from: user2});
            expect(await Instance.totalSupply()).bignumber.equal(ZERO);

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "0"},
                    {type: "address", value: user1},
                    {type: "address", value: Instance.address},
                    {type: "string", value: "a"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await expectRevert(Instance.mint(ZERO, "a", TIME, signature, {from: user1}), "Mint ID already used");

            await time.advanceBlock();
            TIME = new BN(await time.latest()).add(new BN(60));
            signature = EthCrypto.sign(signer.privateKey, EthCrypto.hash.keccak256([
                {type: "string", value: "\x19Ethereum Signed Message:\n32"},
                {type: "bytes32", value: EthCrypto.hash.keccak256([
                    {type: "uint256", value: chainID},
                    {type: "uint256", value: "1"},
                    {type: "address", value: user1},
                    {type: "address", value: Instance.address},
                    {type: "string", value: "a"},
                    {type: "uint256", value: TIME.toString()}])
                }])
            );
            await Instance.mint(ONE, "a", TIME, signature, {from: user1});
            expect(await Instance.totalSupply()).bignumber.equal(ONE);
        })
    }
)