import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";

import ipfs from './ipfs'

import "./App.css";

class App extends Component {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };

  constructor(props) {
    super(props)

    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer: null, ipfsHash: '' };
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  };


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });
    //
    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();
    //
    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

  captureFile(event) {
    // console.log('capture file...');
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result) });
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit(event) {
    event.preventDefault();
    ipfs.files.add(this.state.buffer, (err, result) => {
      if(err) {
        console.error(err);
        return;
      }
      console.log('ipfsHash', result)
      return this.setState({ipfsHash: result[0].hash})

    })
  }



  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>New Blog</h1>
        <p>Your blog is stored on IPFS and Ethereum</p>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt={""}/>
        <h2>Upload Blog</h2>
        <form onSubmit={this.onSubmit}>
          <input type='file' onChange={this.captureFile}/>
          <input type='submit'/>
        </form>
        {/*<p>*/}
          {/*If your contracts compiled and migrated successfully, below will show*/}
          {/*a stored value of 5 (by default).*/}
        {/*</p>*/}
        {/*<p>*/}
          {/*Try changing the value stored on <strong>line 40</strong> of App.js.*/}
        {/*</p>*/}
        {/*<div>The stored value is: {this.state.storageValue}</div>*/}
      </div>
    );
  }
}

//   render() {
//     return (
//         <div className="App">
//           <nav className="navbar pure-menu pure-menu-horizontal">
//             <a href="#" className="pure-menu-heading pure-menu-link">IPFS File Upload DApp</a>
//           </nav>
//
//           <main className="container">
//             <div className="pure-g">
//               <div className="pure-u-1-1">
//                 <h1>Your Image</h1>
//                 <p>This image is stored on IPFS & The Ethereum Blockchain!</p>
//                 <img src={'https://ipfs.io/ipfs/${this.state.ipfsHash}'} alt=""/>
//                 <h2>Upload Image</h2>
//                 <form onSubmit={this.onSubmit} >
//                   <input type='file' onChange={this.captureFile} />
//                   <input type='submit' />
//                 </form>
//               </div>
//             </div>
//           </main>
//         </div>
//     );
//   }
// }


export default App;
