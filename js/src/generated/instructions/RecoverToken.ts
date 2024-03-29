/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category RecoverToken
 * @category generated
 */
export const RecoverTokenStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number
}>([['instructionDiscriminator', beet.u8]], 'RecoverTokenInstructionArgs')
/**
 * Accounts required by the _RecoverToken_ instruction
 *
 * @property [] profileInfo PDA of Krypton Program to be recovered
 * @property [] authorityInfo Pubkey of keypair of PDA to be recovered
 * @property [] newProfileInfo PDA to be recovered into
 * @property [**signer**] newAuthorityInfo Pubkey of the keypair to be recovered into
 * @property [_writable_] oldTokenAccountInfo ATA of the PDA to be recovered
 * @property [_writable_] newTokenAccountInfo ATA of the PDA to be recovered into
 * @category Instructions
 * @category RecoverToken
 * @category generated
 */
export type RecoverTokenInstructionAccounts = {
  profileInfo: web3.PublicKey
  authorityInfo: web3.PublicKey
  newProfileInfo: web3.PublicKey
  newAuthorityInfo: web3.PublicKey
  oldTokenAccountInfo: web3.PublicKey
  newTokenAccountInfo: web3.PublicKey
  tokenProgram?: web3.PublicKey
}

export const recoverTokenInstructionDiscriminator = 10

/**
 * Creates a _RecoverToken_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category RecoverToken
 * @category generated
 */
export function createRecoverTokenInstruction(
  accounts: RecoverTokenInstructionAccounts,
  programId = new web3.PublicKey('2aJqX3GKRPAsfByeMkL7y9SqAGmCQEnakbuHJBdxGaDL')
) {
  const [data] = RecoverTokenStruct.serialize({
    instructionDiscriminator: recoverTokenInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.profileInfo,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.authorityInfo,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.newProfileInfo,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.newAuthorityInfo,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.oldTokenAccountInfo,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.newTokenAccountInfo,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
