import {useEffect, useState} from "react";
import {ABI, ABI2} from "./ABI";
import {addressContract} from "./contracts";

const Web3 = require("web3");

let token = '0xe0dbb927165c1611a8639e375649b85cc790a702'

let ethContract

let App = () => {

    let [address, setAddress] = useState('0x')

    let [amount, setAmount] = useState(0.0)

    let [contractBalance, setContractBalance] = useState(0.0)

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

            setAddress(accountAddress)
            console.log(accountAddress)

            console.log(addressContract)

            if (addressContract[accountAddress]) {

                console.log(await window.web3.eth.getBalance(addressContract[accountAddress]))

                let tokenContract = new window.web3.eth.Contract(ABI, token)

                ethContract = new window.web3.eth.Contract(ABI2, addressContract[accountAddress])

                // setContract(ethContract);

                console.log(ethContract)
                console.log(ethContract.methods)

                setReleasableAmount(ethContract).then()

                console.log(tokenContract)
                console.log(tokenContract.methods)

                if (tokenContract.methods.balanceOf)
                    tokenContract.methods.balanceOf(addressContract[accountAddress]).call((err, val) => {
                        setContractBalance(val / 1e10)
                        console.log(val)
                    })
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
            ethEnabled().then(r => {
            })
            interval = setInterval(() => setReleasableAmount(ethContract), 5000);
            // console.log(balance)
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
            <div>{addressContract[address] ? addressContract[address] : 'No'}</div>
            <div>Contract balance: {contractBalance} ENX</div>
            <div className={'button'} onClick={release}>Release: {amount} ENX</div>
        </div>
    );
}

export default App;
