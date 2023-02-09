import React, { ReactElement } from "react";
import { Typography } from "antd";
import { Box } from "../../styles/StyledComponents.styles";
import { Keypair, PublicKey } from "@solana/web3.js";

const { Paragraph } = Typography;


const PhraseBox = ({ guardian }: { guardian: Array<PublicKey> | null }): ReactElement => {
  return (
    <Box>
      <Paragraph copyable={{ text: `${guardian}`, tooltips: `Copy` }}>
        {}
      </Paragraph>
    </Box>
  );
};

export default PhraseBox;
