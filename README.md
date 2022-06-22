# Freelancer DAPP
This is the Solidity SmartContract + React.js code for the Freelancer DAPP 😙

## How to work 👷
- Anybody can CREATE the **Task** with `detail` and `amount` as Creator
- Anybody can APPLY the **Task** as Freelancer
- Creator START the **Task**
- Freelancer COMPLETE the **Task**
- Once **Task** is completed, Freelancer is get paid 💰

## Getting setup ⚙️
- Copy `.env` file to `.env.local`
- Create an App in [Pork Portal](https://www.portal.pokt.network/) and Update *PORK_RINKEBY_URL* in `.env.local`
- Copy your metamask Rinkeby account private key and Update *RINKEBY_PRIVATE_KEY* in `.env.local` 🤫
- Run `npm install`

## Deploy Smart Contract 🐶
- Compile Smart Contract: `npx hardhat compile`
- Deploy Smart Contract to Rinkeby Testnet: `npx hardhat run scripts/deploy.js --network rinkeby`

## Running React App 🍪
- Copy `Freelancer.json` file from `artifacts/contracts/Freelancer.sol/` to `pages/abi/`
- Update contractAddress variable in `.env.local` file with deployed Contract Address
- Run `npm start` and Enjoy 👌



