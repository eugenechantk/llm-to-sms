import type { NextApiRequest, NextApiResponse } from 'next'
import MODEL from './1'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        console.log(req.body.query);
        const data = await MODEL(req.body.query)
        console.log(data);
        res.status(200).json({ status: 'success', response: data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}
