import { Redis } from '@upstash/redis'
import { NextApiRequest, NextApiResponse } from 'next';


const db_url = 'https://massive-ostrich-38534.upstash.io'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const redis = new Redis({
    url: db_url,
    token: 'AZaGACQgNWFhNTk4YWUtZGI1NC00ZTRmLTg4NjktMDg1MDhhZGM4OGQyYzRiNWI1ZDhhNWY1NGViYTk0NDVkYTJhODJlNWJkOTY=',
  })

  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  
  const body = req.body

  await redis.del(body.number);

  res.status(200).json({data: "success"})
}