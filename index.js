const { ALCHEMY_KEY, INFURA_KEY, CHAINSTACK_ENDPOINT, LLAMA_NODES_KEY, TENDERLY_KEY, QUICKNODE_ENDPOINT } = require("./secrets");

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
const INFURA_URL = `https://mainnet.infura.io/v3/${INFURA_KEY}`;
const CHAINSTACK_URL = `${CHAINSTACK_ENDPOINT}`;
const LLAMA_NODES_URL = `https://eth.llamarpc.com/rpc/${LLAMA_NODES_KEY}`;
const TENDERLY_URL = `https://mainnet.gateway.tenderly.co/${TENDERLY_KEY}`
const QUICKNODE_URL = `${QUICKNODE_ENDPOINT}`;

const RUN_TIME = 5 * 60 * 1000; // 5 minutes
const CONCURRENT_REQUESTS = 1000; // 1,000

const ethers = require("ethers");

const getContract = (providerUrl) => {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const BALANCE = "function balanceOf(address owner) view returns (uint256)";
  const contractAbi = [BALANCE];
  return new ethers.Contract(contractAddress, contractAbi, provider);
};

const canGetbalance = async (contract) => {
  try {
    const USER_ADDRESS = "0x477b8D5eF7C2C42DB84deB555419cd817c336b6F";
    const balance = await contract.balanceOf(USER_ADDRESS);
    const balanceInUsd = ethers.utils.formatUnits(balance, 6);
    return balanceInUsd > 0;
  } catch (error) {
    return false;
  }
};

const testSpeed = async (providerUrl) => {
  const contract = getContract(providerUrl);
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

const testConcurrentRequests = async (providerUrl) => {
  const startTime = Date.now();
  const contract = getContract(providerUrl);
  const requests = Array.from({ length: CONCURRENT_REQUESTS }, () =>
    canGetbalance(contract)
  );
  const results = await Promise.all(requests);
  const successCount = results.filter((result) => result).length;
  const errorCount = results.filter((result) => !result).length;
  const endTime = Date.now();
  const timeElapsed = endTime - startTime;
  return { successCount, errorCount, timeElapsed: `${timeElapsed / 1000}s` };
};

(async function main() {
  //   // Speed tests
  //   await testSpeed(ALCHEMY_URL).then((result) => {
  //     console.log("Alchemy Speed: ", result);
  //   });
  //   await testSpeed(INFURA_URL).then((result) => {
  //     console.log("Infura Speed: ", result);
  //   });
  //   await testSpeed(CHAINSTACK_URL).then((result) => {
  //     console.log("Chainstack Speed: ", result);
  //   });
  //   await testSpeed(LLAMA_NODES_URL).then((result) => {
  //     console.log("Llama Nodes Speed: ", result);
  //   });
  //   await testSpeed(TENDERLY_URL).then((result) => {
  //     console.log("Tenderly Web3 Gateway Speed: ", result);
  //   });
  //   await testSpeed(QUICKNODE_URL).then((result) => {
  //     console.log("QuickNode Speed: ", result);
  //   });

  // Concurrent requests tests
  await testConcurrentRequests(ALCHEMY_URL).then((result) => {
    console.log("Alchemy Concurrent Requests: ", result);
  });
  await testConcurrentRequests(INFURA_URL).then((result) => {
    console.log("Infura Concurrent Requests: ", result);
  });
  await testConcurrentRequests(CHAINSTACK_URL).then((result) => {
    console.log("Chainstack Concurrent Requests: ", result);
  });
  await testConcurrentRequests(LLAMA_NODES_URL).then((result) => {
    console.log("Llama Nodes Concurrent Requests: ", result);
  });
  await testConcurrentRequests(TENDERLY_URL).then((result) => {
    console.log("Tenderly Web3 Gateway Concurrent Requests: ", result);
  });
  await testConcurrentRequests(QUICKNODE_URL).then((result) => {
    console.log("QuickNode Concurrent Requests: ", result);
  });
})();
