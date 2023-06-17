import type { NextApiRequest, NextApiResponse } from 'next'

// Request:
//   message: what the user send through SMS to us
//   phone: the phone number that the user use to send us the SMS

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Call the open ai api route


  // Send back the response of the open ai
  res.status(200).json({ OpenAIResponse: 'John Doe' })
}
