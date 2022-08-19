const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // We will avoid this method

    // We should use following method
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.PASSWORD
    // );
    // wallet = wallet.connect(provider);

    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    );

    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    );

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);
    console.log(`Contract Address : ${contract.address}`);
    console.log(
        "Contract attached to the main chain and deployed successfully"
    );

    // const number = await contract.retrieve();

    // console.log(
    //     `Your number before the storing anything: ${number.toString()}`
    // );

    // const txRes = await contract.store("1000");
    // const txReceipt = txRes.wait(1);

    // const updatedNumber = await contract.retrieve();
    // console.log(`Your updated number is : ${updatedNumber}`);

    let currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
    console.log("Updating favorite number...");
    let transactionResponse = await contract.store("1000");
    let transactionReceipt = await transactionResponse.wait();
    currentFavoriteNumber = await contract.retrieve();
    console.log(`New Favorite Number: ${currentFavoriteNumber}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
