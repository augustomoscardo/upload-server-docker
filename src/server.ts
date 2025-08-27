import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { uploadImageRoute } from './routes/upload-image'
import { healthCheckRoute } from './routes/health-check'
import { fastifyMultipart } from '@fastify/multipart'
import { log } from './infra/logger'
import { vault } from './infra/secret'

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifyMultipart)
server.register(uploadImageRoute)
server.register(healthCheckRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(async () => {
  const values = await vault.read('secret/data/widget-server-stg')
  console.log(values.data.data);
  
  console.log('HTTP server running!')  
  log.info('HTTP server running!')
})