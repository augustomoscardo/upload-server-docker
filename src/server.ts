import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { uploadImageRoute } from './routes/upload-image'
import { healthCheckRoute } from './routes/health-check'
import { fastifyMultipart } from '@fastify/multipart'
import { log } from './infra/logger'
import { vault } from './infra/secret'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'

const client = new SSMClient({ region: 'us-east-1' })

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyMultipart)
server.register(uploadImageRoute)
server.register(healthCheckRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(async () => {
  // const values = await vault.read('secret/data/widget-server-stg')
  const values = await client.send(new GetParameterCommand({
    Name: 'test'
  }))
  console.log(values);
  
  console.log('HTTP server running!')  
  log.info('HTTP server running!')
})