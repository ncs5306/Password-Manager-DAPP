import React, {useState} from 'react';
import { ethers } from "ethers";
import './App.css';

const {abi} = require('../truffle/build/contracts/PasswordManager.json');

const App = () =>{
    const [account, setAccount] = useState('...');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const [websiteInput, setWebsiteInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const [getInput, setGetInput] = useState('');
    const [userInfo, setUserInfo] = useState([]);
    
    

    const contractAddress = '0xF83741e3930115D055Ff0423F9aD5D754B70f5aC'


    const onConnectClick = async () =>{
        if(window.ethereum){
            try{
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                await provider.send("eth_requestAccounts", []);
                const account = await provider.listAccounts();
                const signer = provider.getSigner()
                const contract = new ethers.Contract(contractAddress, abi, provider)
                setProvider(provider);
                setAccount(account);
                setSigner(signer);
                setContract(contract);

            }catch(error){console.log(error)}

        } else {console.log('metamask not detected')}
    }

    const onUpdateFormSubmit = (event) =>{
        event.preventDefault()
        callSetCredentials()
    }

    const callSetCredentials = () =>{
        console.log(websiteInput, usernameInput, passwordInput)
        const contractWithSigner = contract.connect(signer);
        contractWithSigner.setCredentials(websiteInput, usernameInput, passwordInput);
    }

    const onGetFormSubmit = (event) =>{
        event.preventDefault()
        callGetCredentials()
    }

    const callGetCredentials = async() =>{
        const userInfo = await contract.getCredentials(getInput)
        setUserInfo(userInfo)
    }


    


    return(
        <div>
            <div className='connection ui'>
                <button 
                    className='connect-button' 
                    onClick={onConnectClick}>Connect To Metamask</button>
                    
                <label>{account}</label><br/>
                <button>Disconnect</button>
            </div>
            <div className='update-form-ui'>
                <form onSubmit={onUpdateFormSubmit} >
                    <label>Enter Website:</label>
                    <input
                        className='website-input'
                        type='text' 
                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        value={websiteInput}
                        onChange={e => setWebsiteInput(e.target.value)}/><br/>

                    <label>Enter Username:</label>
                    <input
                        className='username-input'
                        type='text'
                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        value={usernameInput}
                        onChange={e => setUsernameInput(e.target.value)}/><br/>

                    <label>Enter Password:</label>
                    <input
                        className='password-input'
                        type='text' 
                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}/><br/>

                    <button type='submit'>Submit</button>
                </form>
            </div>
            <div className='get-form-ui'>
                <form onSubmit={onGetFormSubmit}>
                    <label>Enter Website:</label>
                    <input
                        className='get-input'
                        type='text' 
                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        value={getInput}
                        onChange={e => setGetInput(e.target.value)}/>
                    <button type='submit'>Get Credentials</button><br/>
                    <label className='username-output'>Username: {userInfo[0]}</label><br/>
                    <label className='password-output'>Password: {userInfo[1]}</label>

                </form>
            </div>
        </div>
    )
}

export default App;