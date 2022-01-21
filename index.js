const inquirer = require("inquirer");
const figlet = require("figlet");
const { Keypair } = require("@solana/web3.js");

const { getWalletBalance, transferSOL, airDropSol } = require("./solana");
const { getReturnAmount, randomNumber } = require("./helper");

const init = () => {
  console.log((figlet.textSync("SOL Roulette")));
  console.log(`The max bidding amount is 2 SOL here`);
};

const web3 = require("@solana/web3.js");

const userWallet=Keypair.generate();
const userSecretKey = userWallet._keypair.secretKey
const treasureWallet = Keypair.generate()
const treasureSecretKey = treasureWallet._keypair.secretKey

const gameFlow = () => {
    const questions = [
      {
        name: "SOL",
        type: "number",
        message: "What is the amount of SOL you want to stake?",
      },
      {
        name: "RATIO",
        type: "rawlist",
        message: "What is the ratio of your staking?",
        choices: ["1:1.25", "1:1.5", "1:1.75", "1:2"],
        filter: function (val) {
          const factor = val.split(":")[1];
          return factor;
        },
      },
      {
        name: "RANDOM",
        type: "number",
        message: "Guess a random number from 1 to 5 (both 1, 5 included)",
        when: async (val) => {
          if (parseFloat(totalAmtToBePaid(val.SOL)) > 2) {
            console.log(
              chalk.red`You have violated the max stake limit. Stake with smaller amount.`
            );
            return false;
          } else {
            const userBalance = await getWalletBalance(
              userWallet.publicKey.toString()
            );
            console.log(`WALLET BALANCE: ${chalk.green`${userBalance}`} SOL`);
            console.log(
              `You need to pay ${chalk.green`${totalAmtToBePaid(
                val.SOL
              )}`} to move forward`
            );
            if (userBalance < totalAmtToBePaid(val.SOL)) {
              console.log(
                chalk.red`You don't have enough balance in your wallet`
              );
              return false;
            } else {
              console.log(
                chalk.green`You will get ${getReturnAmount(
                  val.SOL,
                  parseFloat(val.RATIO)
                )} if guessing the number correctly`
              );
              return true;
            }
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  };
  
  const driverFunction = async () => {
    init();
    const generateRandomNumber = randomNumber(1, 5);
    const answers = await askQuestions();
    if (answers.RANDOM) {
      const paymentSignature = await transferSOL(
        userWallet,
        treasureWallet,
        answers.SOL
      );
      console.log(
        `Signature of payment for playing the game`,
        chalk.green`${paymentSignature}`
      );
      if (answers.RANDOM === generateRandomNumber) {    //correct guess
        await airDropSol(
          treasureWallet,
          getReturnAmount(answers.SOL, parseFloat(answers.RATIO))
        );
        const prizeSignature = await transferSOL(
          treasureWallet,
          userWallet,
          getReturnAmount(answers.SOL, parseFloat(answers.RATIO))
        );
        console.log(chalk.green`Your guess is absolutely correct`);
        console.log(
          `Here is the price signature `,
          chalk.green`${prizeSignature}`
        );
      } else {  //incorrect guess
        console.log(chalk.yellowBright`Better luck next time`);
      }
    }
  };
  
  driverFunction();