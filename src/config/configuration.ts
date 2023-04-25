export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  blockchainNetworkUrl: process.env.RCP_URL,
  apesTraitContractAddress: process.env.APES_TRAIT_CONTRACT_ADDRESS,
  walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
});
