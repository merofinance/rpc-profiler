const { ALCHEMY_KEY, INFURA_KEY, LLAMA_NODES_KEY } = require("./secrets");

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
const INFURA_URL = `https://mainnet.infura.io/v3/${INFURA_KEY}`;
const LLAMA_NODES_URL = `https://eth.llamarpc.com/rpc/${LLAMA_NODES_KEY}`;

const RUN_TIME = 5 * 60 * 1000; // 5 minutes

const ethers = require("ethers");

const canGetbalance = async (contract) => {
  try {
    const USER_ADDRESS = "0x477b8D5eF7C2C42DB84deB555419cd817c336b6F";
    const balance = await contract.balanceOf(USER_ADDRESS);
    const balanceInUsd = ethers.utils.formatUnits(balance, 6);
    return balanceInUsd > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const testSpeed = async (providerUrl) => {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const BALANCE = "function balanceOf(address owner) view returns (uint256)";
  const contractAbi = [BALANCE];
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  let testing = true;

  setTimeout(() => {
    testing = false;
  }, RUN_TIME);

  let successCount = 0;
  let errorCount = 0;
  while (testing) {
    const success = await canGetbalance(contract);
    if (success) successCount++;
    else errorCount++;
  }
  return { successCount, errorCount };
};

(async function main() {
  testSpeed(ALCHEMY_URL).then((result) => {
    console.log("Alchemy", result);
  });
  testSpeed(INFURA_URL).then((result) => {
    console.log("Infura", result);
  });
  testSpeed(LLAMA_NODES_URL).then((result) => {
    console.log("Llama Nodes", result);
  });
})();
