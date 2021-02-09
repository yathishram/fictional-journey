import React, {useState} from 'react'
import { Input, CallToAction } from '@magiclabs/ui';
import {ethers} from "ethers"
const Web3Component = ({web3Provider}) => {

    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(message){
            const signer = web3Provider.getSigner();
            const userAddress = await signer.getAddress();
            const signedMessage = await signer.signMessage(message);
            alert(`Signed Message: ${signedMessage}`);
            console.log(signedMessage);
            const signerAddress = ethers.utils.verifyMessage(
                message,
                signedMessage
            );
            console.log(signerAddress == userAddress);
        }
    }
    return (
        <div>
            <div>
            <Input
                placeholder='Enter your message'
                size='sm'
                type='email'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            </div>
            <div className='submit'>
                <CallToAction
                    color='primary'
                    size='sm'
                    onClick={handleSubmit}
                >
                    Sign message
                </CallToAction>
            </div>
        </div>
    )
}

export default Web3Component
