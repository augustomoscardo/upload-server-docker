import type { FastifyInstance } from "fastify";
import { log } from "../infra/logger";

export async function healthCheckRoute(app: FastifyInstance) {
  app.get('/health', async (request, reply) => {
    log.error('Acessei a rota /health e deu certo!')
    await reply.status(200).send({ message: 'OK!' })
  })
}