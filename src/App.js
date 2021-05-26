import {useEffect, useState} from "react";
import {ABI, ABI2} from "./ABI";

const Web3 = require("web3");

let token = '0xe0dbb927165c1611a8639e375649b85cc790a702'

let pairs = {
    '0x91748D8F524c49700FF944480782A77046707fab': '0x6cb1E588b18781783F5Ab4E639Ff1A3f87603E76',
    '0x40e8ba5285797655f5ca14c9c157536f1d73db20': '0x33134E04D586513B57F558eC70eE6616ec87F77e'
}

let ethContract

let App = () => {

    // let connectMetaMask = () => {
    //
    // }

    let [address, setAddress] = useState('0x')

    let [amount, setAmount] = useState(0.0)

    let [contractBalance, setContractBalance] = useState(0.0)

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

            if (pairs[accountAddress]) {

                console.log(await window.web3.eth.getBalance(pairs[accountAddress]))

                ethContract = new window.web3.eth.Contract(ABI2, pairs[accountAddress])

                // setContract(ethContract);

                console.log(ethContract)
                console.log(ethContract.methods)

                setReleasableAmount(ethContract)
            }

            if (ethContract.methods.balanceOf)
                ethContract.methods.balanceOf(token).call((err, val) => {
                    setContractBalance(val / 1e10)
                    console.log(val)
                })

            return true;
        }
        return false;
    }

    let setReleasableAmount = async () => {

        // console.log('setReleasableAmount')
        // console.log(ethContract)

        if (ethContract) {

            ethContract.methods.releasableAmount(token).call((err, val) => {
                setAmount(val / 1e10)
                console.log(val / 1e10)
            })


            // ethContract.methods.balanceOf(token).call((err, val) => {
            //     setContractBalance(val / 1e10)
            //     console.log(val)
            // })

            // ethContract.methods.vestedAmount(token).call((err, val) => {
            //     setContractBalance(val / 1e10)
            //     console.log(val / 1e10)
            // })
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
            <div>{pairs[address] ? pairs[address] : 'No'}</div>
            <div>Contract balance: {contractBalance} ENX</div>
            <div className={'button'} onClick={release}>Release: {amount}</div>
        </div>
    );
}

export default App;
