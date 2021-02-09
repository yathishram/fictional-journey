import React, {useState, useEffect} from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { OAuthExtension } from '@magic-ext/oauth';
import { Magic } from 'magic-sdk';
import Home from './components/home';
import Login from './components/login';
import Profile from './components/profile';
import Callback from './components/callback';
import {ethers} from "ethers"
import { generateIDX } from './lib/ceramic';
function App() {

  const [magic, setMagic] = useState(null);
  const [web3provider, setWeb3Provider] = useState(null)
  const [ceramic, setCeramic] = useState(null);
  const [idx, setIdx] = useState(null);
  const [signer, setSigner] = useState(null)

  useEffect(() => {
      !magic &&
      setMagic(
        new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, {
          extensions: [new OAuthExtension()],
        })
      );
    magic?.preload();
    if(magic){
      console.log(magic)
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
      const signer = provider.getSigner();
      console.log(provider)
      setWeb3Provider(provider)
      setSigner(signer)
      generateIDX(provider).then(data=>{
        setIdx(data.idx)
        setCeramic(data.ceramic)
        console.log(data)
      })
    }
  }, [magic]);


  return (
    <Router>
      <Switch>
        <Route path='/' exact render={(props) => (
          <Home {...props} idx={idx}/>
      )}/>
        <Route path='/login'  exact render={(props) => (
          <Login {...props} magic={magic}/>
      )}/>
        <Route path='/profile' exact render={(props) => (
          <Profile {...props}/>
      )}/>
        <Route path='/callback'  exact render={(props) => (
          <Callback {...props} magic={magic} setWeb3Provider={setWeb3Provider} setCeramic={setCeramic} setIdx={setIdx}/>
      )}/>
      </Switch>
    </Router>
  );
}

export default App;
