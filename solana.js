const {
    Connection,
    PublicKey,
    clusterApiUrl,
    sendAndConfirmTransaction,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    Account,
  } = require("@solana/web3.js");
  
  const transferSOL = async (from, to, amount) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(from.publicKey.toString()),
          toPubkey: new PublicKey(to.publicKey.toString()),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      const signature = await sendAndConfirmTransaction(connection, transaction, [
        from,
      ]);
      return signature;
    } catch (err) {
      console.log(err);
    }
  };
  
  const getWalletBalance = async (publicKey) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const walletBalance = await connection.getBalance(new PublicKey(publicKey));
      return parseInt(walletBalance) / LAMPORTS_PER_SOL;
    } catch (err) {
      console.log(err);
    }
  };
  
  const airDropSol = async (wallet, amount) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(wallet.publicKey.toString()),
        amount * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
      console.log(err);
    }
  };
  
  module.exports = {
    getWalletBalance,
    transferSOL,
    airDropSol,
  };