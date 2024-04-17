import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome to the Metacrafters ATM!",
        yourAccount: "Your Account:",
        yourBalance: "Your Balance:",
        deposit: "Deposit 1 ETH",
        withdraw: "Withdraw 1 ETH",
        pleaseInstall: "Please install Metamask in order to use this ATM.",
        pleaseConnect: "Please connect your Metamask wallet",
        userName: "User Name:",
        age: "Age:",
        accountType: "Account Type:",
        cardNumber: "Card Number:",
        monthlyTransaction: "Monthly Average Transaction:",
        digitalReceipt: "Digital Receipt"
      }
    },
    hi: {
      translation: {
        welcome: "मेटाक्राफ्टर्स एटीएम में आपका स्वागत है!",
        yourAccount: "आपका खाता:",
        yourBalance: "आपका शेष:",
        deposit: "1 ईथर जमा करें",
        withdraw: "1 ईथर निकालें",
        pleaseInstall: "कृपया इस एटीएम का उपयोग करने के लिए मेटामास्क स्थापित करें।",
        pleaseConnect: "कृपया अपना मेटामास्क वॉलेट कनेक्ट करें",
        userName: "उपयोगकर्ता नाम:",
        age: "उम्र:",
        accountType: "खाता प्रकार:",
        cardNumber: "कार्ड नंबर:",
        monthlyTransaction: "मासिक औसत लेनदेन:",
        digitalReceipt: "डिजिटल रसीद"
      }
    },
    gu: {
      translation: {
        welcome: "મેટાક્રાફ્ટર્સ એટીએમમાં આપનું સ્વાગત છે!",
        yourAccount: "તમારું એકાઉન્ટ:",
        yourBalance: "તમારો બેલેન્સ:",
        deposit: "1 ઈથર જમા કરો",
        withdraw: "1 ઈથર પુનઃપ્રાપ્ત કરો",
        pleaseInstall: "આ એટીએમનો ઉપયોગ કરવા માટે કૃપા કરીને મેટામાસ્ક સ્થાપિત કરો.",
        pleaseConnect: "કૃપા કરીને તમારું મેટામાસ્ક વોલેટ કનેક્ટ કરો",
        userName: "વપરાશકર્તા નામ:",
        age: "ઉંમર:",
        accountType: "એકાઉન્ટ પ્રકાર:",
        cardNumber: "કાર્ડ નંબર:",
        monthlyTransaction: "માસિક ઔસત લેન-દેન:",
        digitalReceipt: "ડિજિટલ રસીદ"
      }
    },
    te: {
      translation: {
        welcome: "మెటాక్రాఫ్టర్స్ ఎటిఎంలో స్వాగతం!",
        yourAccount: "మీ ఖాతా:",
        yourBalance: "మీ బ్యాలెన్స్:",
        deposit: "1 ఎథర్ డిపాజిట్ చేయండి",
        withdraw: "1 ఎథర్ పొందండి",
        pleaseInstall: "ఈ ఎటిఎమ్ ని ఉపయోగించడానికి మీరు మెటామాస్క్ ఇన్‌స్టాల్ చేయాలి.",
        pleaseConnect: "దయచేసి మీ మెటామాస్క్ వాలెట్‌ను కనెక్ట్ చేయండి",
        userName: "వాడుకరి పేరు:",
        age: "వయసు:",
        accountType: "ఖాతా రకం:",
        cardNumber: "కార్డు సంఖ్య:",
        monthlyTransaction: "నెలకు సరికొత్త లెనికివారా:",
        digitalReceipt: "డిజిటల్ రసీద్"
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [lastTransactionType, setLastTransactionType] = useState("");
  const [lastTransactionAmount, setLastTransactionAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert(t("pleaseInstall"));
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      setLastTransactionType(t("deposit"));
      setLastTransactionAmount("1 ETH");
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      setLastTransactionType(t("withdraw"));
      setLastTransactionAmount("1 ETH");
      getBalance();
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const showReceipt = () => {
    // Display the receipt details
    alert(`
      User Name: Ayush Yadav
      Age: 30
      Account Type: Saving
      Card Number: 89674573
      Monthly Average Transaction: $9000
      Last Transaction:
        Type: ${lastTransactionType}
        Amount: ${lastTransactionAmount}
    `);
  };
  

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>{t("pleaseInstall")}</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>{t("pleaseConnect")}</button>;
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>{t("yourAccount")} {account}</p>
        <p>{t("yourBalance")} {balance}</p>
        <button onClick={deposit}>{t("deposit")}</button>
        <button onClick={withdraw}>{t("withdraw")}</button>
        <button onClick={showReceipt}>{t("digitalReceipt")}</button>
        <div>
          <button onClick={() => changeLanguage("en")}>English</button>
          <button onClick={() => changeLanguage("hi")}>हिन्दी</button>
          <button onClick={() => changeLanguage("gu")}>ગુજરાતી</button>
          <button onClick={() => changeLanguage("te")}>తెలుగు</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>{t("welcome")}</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
