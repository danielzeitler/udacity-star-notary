<!-- Please remove this file from your project -->
<template>
  <section>
    <div>
      Selected: {{ selectedAccount }}
    </div>

    <div>
      <input type="text" v-model="mintStar">
      <button @click="mintToken">Claim Star</button>
    </div>

    <div>
      <p>{{ starName }}</p>
      <input type="text" v-model="starId">
      <button @click="lookUptokenIdToStarInfo">Look Up Star</button>
    </div>

  </section>
</template>

<script>
import Web3 from 'web3';
import NFTContractBuild from '../../build/contracts/StarNotary.json';
// const providerUrl = "https://rinkeby.infura.io/v3/___ID____" || "http://localhost:8545";

export default {
  data() {
    return {
      starName: "",
      starId: "",
      mintStar: "",
      id: 25,
      selectedAccount: "",
      nftContract: "",
      isProviderAvailable: false
    }
  },
  methods: {
    async mintToken() {
      const obj = this.nftContract.methods;
      // await this.nftContract.methods.claimStar().send({ from: this.selectedAccount})
      const newId = this.id++;
      await this.nftContract.methods.createStar(this.mintStar, newId).send({ from: this.selectedAccount});
    },
    async lookUptokenIdToStarInfo() {
      const answer = await this.nftContract.methods.lookUptokenIdToStarInfo(this.starId).call();
      this.starName = answer;
    }
  },
  async mounted() {
   let provider = window.ethereum;
  
   if(typeof provider !== 'undefined') {
     // MetaMask is installed
     provider.request({ method: 'eth_requestAccounts'}).then(accounts => {
       this.selectedAccount = accounts[0];
     }).catch(err => console.log(err))

     provider.on("accountsChanged", (accounts) => {
       this.selectedAccount = accounts[0]; 
     })
   } else {
     this.isProviderAvailable = false;
   }

   const web3 = new Web3(provider)

   const networkId = await web3.eth.net.getId();
   
   this.nftContract = new web3.eth.Contract(NFTContractBuild.abi, NFTContractBuild.networks[networkId].address)
  }
}
</script>
