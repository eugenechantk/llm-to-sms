


import type { NextApiRequest, NextApiResponse } from 'next'
import { Twilio } from "twilio";
import axios from 'axios'
const BASE_URL = 'http://localhost:3000/api/twilio'
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    try {
        const uuid = req?.body?.uuid
        const SERVER_URL = req.body.SERVER
        // Look for a valid number
        let number = (await axios.get(`${BASE_URL}/number/get`)).data.number;
        let resp = `${number} is available for client ${uuid}`
        console.log(`Start provisioning the number [ ${number} ] for client ${uuid}`);
        try {
            // Provision/claim the number
            let provision = (await axios.get(`${BASE_URL}/number/provision`))
            if (provision.data.status == 'in-use' && provision.status === 200) {
                console.log(`${number} is provisioned for client ${uuid}`)
            } else {
                console.log(`${number} is not provisioned for client ${uuid}`);
            }
            // Create a service in Twilio with the number   
            let createService = (await axios.post(`${BASE_URL}/service/create`, {
                serviceName: uuid,
            }))
            if (createService.status === 200) {
                console.log(`Service ${uuid} created successfully`);
            }
            else {
                console.log(`Service ${uuid} failed`);
                res.status(400).json({ status: 'Failed to create service' })
            }
            // Add the number to the service
            let addNumber = (await axios.post(`${BASE_URL}/service/add`, {
                serviceName: uuid,
                phoneNumberSid: provision.data.sid
            }))
            if (addNumber.status === 200) {
                console.log(`Number ${number} added to service ${uuid}`);
            }
            else {
                console.log(`Number ${number} failed to add to service ${uuid}`);
                res.status(400).json({ status: 'Failed to add number to service' })
            }
            // Update service webhook
            let updateService = (await axios.post(`${BASE_URL}/service/update`, {
                serviceName: uuid,
                inboundRequestUrl: `${SERVER_URL}/api/twilio/messages/send?uuid=${uuid}`,
                inboundMethod: 'POST',
                fallbackUrl: `${SERVER_URL}/api/twilio/messages/send?uuid=${uuid}`,
                fallbackMethod: 'POST',
                useInboundWebhookOnNumber: true,
            }))
            if (updateService.status === 200) {
                console.log(`Service ${uuid} updated updated successfully`);
            }
            else {
                console.log(`Service ${uuid} failed to update`);
                res.status(400).json({ status: 'Failed to update service' })
            }

            res.status(200).json({ status: 'success' })

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'error' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error' })
    }
}

