import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContext = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    
    const [currentAccount, setcurrentAccount] = useState('')
    const [formData, setFormData] = useState({ addressTo:'', amount:'', keyword:'', message:''}); 
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));


    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value}));
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please Install Metamask");

            const accounts = await ethereum.request({ method: 'eth_accounts'});
    
            if(accounts.length){
                setcurrentAccount([accounts[0]]);
            } else{
                console.log('No Account Found');
            }
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object.")
        }
       
    }

    const connectWallet = async () => {
        try {
        if(!ethereum) return alert("Please Install Metamask");

        const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
        
        setcurrentAccount(accounts[0]);

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object.")
        }
    }

    const sendTransaction = async() => {
        try {
            if(!ethereum) return alert("Please Install Metamask");
            const {addressTo, amount, keyword, message} = formData;
           const transactionContract =  getEthereumContract();
           const parsedAmount = ethers.util.parseEhter(amount);
           await ethereum.request({
            method: 'eth_sendTransaction',
            params:[{
                from: currentAccount,
                to: addressTo,
                gas: '0x5208', //21000 GWEI
                value: parsedAmount._hex
            }]
           });

           const transactionHash =  await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
           
           setIsLoading(true);
           console.log(`Loading  - ${transactionHash.hash}`);
           await transactionHash.wait();

           setIsLoading(false);
           console.log(`Success  - ${transactionHash.hash}`);

           const transactionCount = await transactionContract.getTransactionCount();

           setTransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum Object.")
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}