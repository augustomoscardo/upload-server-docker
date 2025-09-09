import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { uploadImageRoute } from './routes/upload-image'
import { healthCheckRoute } from './routes/health-check'
import { fastifyMultipart } from '@fastify/multipart'
// import { log } from './infra/logger'
// import { vault } from './infra/secret'
// import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
// import { kmsValues, secretManagerValues, ssmValues } from './infra/aws'

// const client = new SSMClient({ region: 'us-east-1' })


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

  // const values = await ssmValues()
  // console.log(values);

  // const results = await kmsValues()
  // console.log(results);

  // const secrets = await secretManagerValues()
  // console.log(secrets);

  console.log('HTTP server running!')
  // log.info('HTTP server running!')
})