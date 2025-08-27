import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { uploadImageRoute } from './routes/upload-image'
import { healthCheckRoute } from './routes/health-check'
import { fastifyMultipart } from '@fastify/multipart'
import { log } from './infra/logger'
import { vault } from './infra/secret'

import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { DecryptCommand, KMSClient } from '@aws-sdk/client-kms'
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

const ssm = new SSMClient({ region: "us-east-2" });
const kms = new KMSClient({ region: "us-east-2" });
const secretManager = new SecretsManagerClient({ region: "us-east-2" });

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyMultipart)
server.register(uploadImageRoute)
server.register(healthCheckRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(async () => {
  // const values = await vault.read('secret/data/widget-server-stg')
  // console.log(values.data.data);

  // const values = await ssm.send(new GetParameterCommand({
  //   Name: 'CLOUDFLARE_ACCESS_KEY_ID',
  //   WithDecryption: true
  // }))
  // console.log(values.Parameter?.Value);

  // const command = new DecryptCommand({
  //   CiphertextBlob: Buffer.from(values.Parameter?.Value as string, 'base64')
  // })

  // const commandResult = await kms.send(command)
  // console.log(commandResult);
  // const result = new TextDecoder().decode(commandResult.Plaintext)
  // console.log(result);

  const secret = await secretManager.send(new GetSecretValueCommand({
    SecretId: 'stg/widget-server'
  }))
  console.log(JSON.parse(secret.SecretString as string));

  console.log('HTTP server running!')
  log.info('HTTP server running!')
})