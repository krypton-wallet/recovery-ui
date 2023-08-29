import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import WalletContextProvider from "../../components/WalletContextProvider";
import { SignTransaction } from "../../components/signTransaction";
import styles from "./[pk].module.css";

const Recover: NextPage = () => {
  const [finished, setFinished] = useState<boolean>(false);

  const router = useRouter();
  const { pk } = router.query;

  return (
    <>
      <h1>Recover your Kryptonian</h1>

      <div className={styles.container}>
        {!finished && (
          <p className={styles.paragraph}>
            Sign a recovery transaction to help your Kryptonian <br />
            <code>{pk}</code>
          </p>
        )}

        <WalletContextProvider>
          {!finished && (
            <>
              <WalletMultiButton />
              <br />
            </>
          )}
          <SignTransaction
            pk={pk}
            finished={finished}
            setFinished={setFinished}
          />
        </WalletContextProvider>
      </div>
    </>
  );
};

export default Recover;
