import {useEffect, useState} from "react";

const Web3 = require("web3");

let token = '0xe0dbb927165c1611a8639e375649b85cc790a702'

let pairs = {
    '0x91748D8F524c49700FF944480782A77046707fab': '0x6cb1E588b18781783F5Ab4E639Ff1A3f87603E76'
}

let ethContract

let App = () => {

    // let connectMetaMask = () => {
    //
    // }

    let [address, setAddress] = useState('0x')

    let [amount, setAmount] = useState(0.0)

    let [contract, setContract] = useState({})

    const release = async () => {
        if (ethContract) {
            await ethContract.methods.release(token).send({from: address})
            setReleasableAmount(ethContract)
        }
    }

    const ethEnabled = async () => {

        if (window.ethereum) {

            await window.ethereum.send('eth_requestAccounts');
            window.web3 = new Web3(window.ethereum);

            let accountAddress = (await window.web3.eth.getAccounts())[0]

            setAddress(accountAddress)
            console.log(accountAddress)

            let abi = [{
                "inputs": [{
                    "internalType": "address",
                    "name": "beneficiary_",
                    "type": "address"
                }, {"internalType": "uint256", "name": "start_", "type": "uint256"}, {
                    "internalType": "uint256",
                    "name": "cliff_",
                    "type": "uint256"
                }, {"internalType": "uint256", "name": "duration_", "type": "uint256"}, {
                    "internalType": "bool",
                    "name": "revocable_",
                    "type": "bool"
                }], "stateMutability": "nonpayable", "type": "constructor"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                }, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
                "name": "OwnershipTransferred",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{"indexed": false, "internalType": "address", "name": "token", "type": "address"}],
                "name": "TokenVestingRevoked",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": false,
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
                "name": "TokensReleased",
                "type": "event"
            }, {
                "inputs": [],
                "name": "beneficiary",
                "outputs": [{"internalType": "address", "name": "", "type": "address"}],
                "stateMutability": "view",
                "type": "function"
            }, {
                "inputs": [],
                "name": "cliff",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }, {
                "inputs": [],
                "name": "duration",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }, {
                "inputs": [],
                "name": "owner",
                "outputs": [{"internalType": "address", "name": "", "type": "address"}],
                "stateMutability": "view",
                "type": "function"
            }, {
                "inputs": [{"internalType": "contract IERC20", "name": "token", "type": "address"}],
                "name": "releasableAmount",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }, {
                "inputs": [{"internalType": "contract IERC20", "name": "token", "type": "address"}],
                "name": "release",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
                "name": "released",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }, {
                "inputs": [],
                "name": "renounceOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "inputs": [],
                "name": "revocable",
                "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
                "stateMutability": "view",
                "type": "function"
            }, {
                "inputs": [{"internalType": "contract IERC20", "name": "token", "type": "address"}],
                "name": "revoke",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
                "name": "revoked",
                "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
                "stateMutability": "view",
                "type": "function"
            }, {
                "inputs": [],
                "name": "start",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }, {
                "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "inputs": [{"internalType": "contract IERC20", "name": "token", "type": "address"}],
                "name": "vestedAmount",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }]

            if (pairs[accountAddress]) {

                console.log(await window.web3.eth.getBalance(pairs[accountAddress]))

                ethContract = new window.web3.eth.Contract(abi, pairs[accountAddress])

                // setContract(ethContract);

                console.log(ethContract)
                console.log(ethContract.methods)

                setReleasableAmount(ethContract)
            }

            return true;
        }
        return false;
    }

    let setReleasableAmount = () => {

        // console.log('setReleasableAmount')
        // console.log(ethContract)

        if (ethContract) {
            ethContract.methods.releasableAmount(token).call((err, val) => {
                setAmount(val / 1e10)
                console.log(val / 1e10)
            })
        }
    }

    useEffect(() => {

        let interval

        if (address === '0x') {
            ethEnabled().then(r => {})
            interval = setInterval(() => setReleasableAmount(ethContract), 5000);
        }

        return () => {
            if (interval)
                clearInterval(interval)
        }
    }, [])

    return (
        <div className={'form'}>
            <div className={'title'}>Vesting</div>
            {/*<div>Execute contract</div>*/}
            <div className={'button'} onClick={ethEnabled}>Connect MetaMask</div>
            <div>Your Address</div>
            <div>{address}</div>
            <div>Contract Address</div>
            <div>{pairs[address] ? pairs[address] : 'No'}</div>
            <div className={'button'} onClick={release}>Release: {amount}</div>
        </div>
    );
}

export default App;
