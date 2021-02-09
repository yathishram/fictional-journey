import { useUser } from '../lib/hooks';
import Layout from './layout';
import Web3Component from './web3Component';

const Home = ({web3provider}) => {
  const user = useUser();

  return (
    <Layout>
      {user ? <div><Web3Component web3Provider={web3provider}/></div> : <div>Log in to continue</div>}
      <style>{`
        div {
          font-size: 17px;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
