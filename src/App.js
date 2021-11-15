import {useEffect, useState} from "react";
import {ABI, ABI2} from "./ABI";
import {addressContract} from "./contracts";

console.log('0.0.2')

const Web3 = require("web3");

let token = '0xd0d7a9f2021958e51d60d6966b7bbed9d1cb22b5'

let ethContract

let App = () => {

    let [address, setAddress] = useState('0x')

    let [amount, setAmount] = useState(0.0)

    let [contractBalance, setContractBalance] = useState(0.0)

    let [contractIndex, setContractIndex] = useState(0)

    const release = async () => {
        if (ethContract) {
            await ethContract.methods.release(token).send({from: address})
            await setReleasableAmount(ethContract)
        }
    }

    const ethEnabled = async () => {

        if (window.ethereum) {

            await window.ethereum.send('eth_requestAccounts');
            window.web3 = new Web3(window.ethereum);

            let accountAddress = (await window.web3.eth.getAccounts())[0]
            // let accountAddress = '0x40e8ba5285797655f5ca14c9c157536f1d73db20'
            console.log(typeof accountAddress)

            setAddress(accountAddress)
            console.log(accountAddress)
            console.log(addressContract)
            console.log(addressContract[accountAddress])

            if (addressContract.hasOwnProperty(accountAddress + '')) {

                let addressContractString = addressContract[accountAddress][contractIndex]

                console.log(accountAddress)

                return

                console.log(await window.web3.eth.getBalance(addressContractString))

                let tokenContract = new window.web3.eth.Contract(ABI, token)

                ethContract = new window.web3.eth.Contract(ABI2, addressContractString)

                // setContract(ethContract);

                console.log(ethContract)
                console.log(ethContract.methods)

                setReleasableAmount(ethContract).then()

                console.log(tokenContract)
                console.log(tokenContract.methods)

                if (tokenContract.methods.balanceOf)
                    tokenContract.methods.balanceOf(addressContractString).call((err, val) => {
                        setContractBalance(val / 1e10)
                        console.log(val)
                    })

                // detect Metamask account change
                window.ethereum.on('accountsChanged', function (accounts) {
                    console.log('accountsChanges', accounts);

                });

                // detect Network account change
                window.ethereum.on('networkChanged', function (networkId) {
                    console.log('networkChanged', networkId);
                });

                console.log(window.ethereum.net)

            } else {
                console.log('NO ADDRESS IN LIST')
            }

            return true;
        }
        return false;
    }

    let setReleasableAmount = async () => {

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
            // ethEnabled().then(r => {})
            interval = setInterval(() => setReleasableAmount(ethContract), 5000);
            // console.log(balance)
        }

        return () => {
            if (interval)
                clearInterval(interval)
        }
    }, [])

    let renderList = () => {
        let list = []
        if (addressContract[address]) {
            for (let i = 0; i < addressContract[address].length; i++) {
                list.push(<div className={(contractIndex === i ? 'contract select' : 'contract')} onClick={() => setContractIndex(i)}>{addressContract[address][i].toString()}</div>)
            }
        }

        return list
    }

    return (
        <div className={'form'}>
            <div className={'title'}>Vesting</div>
            {/*<div>Execute contract</div>*/}
            <div className={'button'} onClick={ethEnabled}>Connect MetaMask</div>
            <div>Your Address</div>
            <div>{address}</div>
            <div>Contract Address</div>
            {renderList()}
            <div>Contract balance: {contractBalance} ENX</div>
            <div className={'button'} onClick={release}>Release: {amount} ENX</div>
        </div>
    );
}

export default App;
