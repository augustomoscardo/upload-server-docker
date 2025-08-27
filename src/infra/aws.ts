import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { DecryptCommand, KMSClient } from '@aws-sdk/client-kms'
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

const ssm = new SSMClient({ region: "us-east-2" });
const kms = new KMSClient({ region: "us-east-2" });
const secretManager = new SecretsManagerClient({ region: "us-east-2" });

export async function ssmValues() {
  const values = await ssm.send(new GetParameterCommand({
    Name: 'CLOUDFLARE_ACCESS_KEY_ID',
    WithDecryption: true
  },))

  return values
}

export async function kmsValues() {
  // SSM values
  const values = await ssmValues()

  const command = new DecryptCommand({
    CiphertextBlob: Buffer.from(values.Parameter?.Value as string, 'base64')
  })

  const commandResult = await kms.send(command)
  const result = new TextDecoder().decode(commandResult.Plaintext)

  return result
}

export async function secretManagerValues() {
  const secret = await secretManager.send(new GetSecretValueCommand({
    SecretId: 'stg/widget-server'
  }))

  return JSON.parse(secret.SecretString as string)
}