import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/Layout";
import { ReactNode } from "react";

type Props = {
  Component: any;
  pageProps: any;
};

const MyApp = ({ Component, pageProps }: Props) => {
  return (
    <Layout>
      <>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta charSet="utf-8" />
          <title>Krypton</title>
          <meta name="description" content="Next-gen smart contract wallet" />
          <link rel="icon" href="/krypton_logo.ico" />
        </Head>
        <Component {...pageProps} />
      </>
    </Layout>
  );
};
export default MyApp;
