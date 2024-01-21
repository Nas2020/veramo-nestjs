// file: didcomm.service.ts
// location: src/didcomm
import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IIdentifier } from '@veramo/core';
import { AppModule } from '../app.module.js';
import { DIDCommMessageMediaType, createMediateRequestMessage, createV3MediateRequestMessage } from '@veramo/did-comm';
import { v4 } from 'uuid'

@Injectable()
export class VeramoAgentService {


    async sendingMessages(recipientDid: string, messageBody: string, senderAlias: string): Promise<any> {

        const app = await NestFactory.create(AppModule);
        const veramoAgent = app.get('VERAMO_AGENT');

        const senderIdentifier: IIdentifier = await veramoAgent.didManagerFind({ alias: senderAlias });

        if (!senderIdentifier) {
            throw new Error('Sender identifier not found');
        }


        const BASIC_MESSAGE_TYPE = 'https://didcomm.org/basicmessage/1.0/message'
        const msgId = v4()
        // Construct the message
        const message = {
            type: BASIC_MESSAGE_TYPE,
            to: recipientDid,
            from: senderIdentifier[0].did,
            id: msgId,
            body: { text: messageBody },
        };
        try {
            const packedMessage = await veramoAgent.packDIDCommMessage({
                packing: 'authcrypt', // Change to 'none' if you want plain text authcrypt
                message: message,
            });
            // Send the message
            const response = await veramoAgent.sendDIDCommMessage({
                messageId: msgId,
                packedMessage,
                recipientDidUrl: recipientDid,
            });

            return { status: 'sent', message: packedMessage, response };
        } catch (error) {
            // Handle any errors during packing or sending
            console.error('Error sending DIDComm message:', error);
        }
    }

    async handleIncomingDIDCommMessage(packedMessage: any): Promise<{ text?: string, error?: string }> {

        try {
            const app = await NestFactory.create(AppModule);
            const veramoAgent = app.get('VERAMO_AGENT');
            const unpackedMessage = await veramoAgent.unpackDIDCommMessage(packedMessage);
            if (!unpackedMessage) {
                console.error("Failed to unpack message: ", packedMessage);
                return { error: "Error unpacking the message!" };
            }

            const text = unpackedMessage.message.body.text;
            console.log("text message:", text)
            return text;
        } catch (error) {
            console.error("Error processing message: ", error);
            return { error: "An error occurred while processing the message." };
        }
    }

    async sendMessageThroughMediator(recipientDid: string, messageBody: string, senderAlias: string, mediatorDid: string): Promise<any> {

        const app = await NestFactory.create(AppModule);
        const veramoAgent = app.get('VERAMO_AGENT');
        // Sender Identifier
        const senderIdentifier: IIdentifier = await veramoAgent.didManagerFind({ alias: senderAlias });
        if (!senderIdentifier) {
            throw new Error('Sender identifier not found');
        }
        // 1. Coordinate mediation
        const mediateRequestMessage = await createMediateRequestMessage(senderIdentifier[0].did, mediatorDid)

        try {
            const FORWARD_MESSAGE_TYPE = 'https://didcomm.org/routing/2.0/forward'
            const BASIC_MESSAGE_TYPE = 'https://didcomm.org/basicmessage/1.0/message'
            const mediateRequestMessageContents = { packing: 'authcrypt', message: mediateRequestMessage } as const
            const packedMediateRequestMessage = await veramoAgent.packDIDCommMessage(mediateRequestMessageContents)
            await veramoAgent.sendDIDCommMessage({
                messageId: mediateRequestMessage.id,
                packedMessage: packedMediateRequestMessage,
                recipientDidUrl: mediatorDid,
            });
            const innerMsgId = v4()
            // 2. Construct and forward message
            const innerMessage = await veramoAgent.packDIDCommMessage({
                packing: 'authcrypt',
                message: {
                    type: BASIC_MESSAGE_TYPE,
                    to: recipientDid,
                    from: senderIdentifier[0].did,
                    id: innerMsgId,
                    body: { 'text': messageBody },
                },
            })
            const msgId = v4()
            const packedForwardMessage = await veramoAgent.packDIDCommMessage({
                packing: 'anoncrypt',
                message: {
                    type: FORWARD_MESSAGE_TYPE,
                    to: mediatorDid,
                    id: msgId,
                    body: {
                        next: recipientDid,
                    },
                    attachments: [
                        { media_type: DIDCommMessageMediaType.ENCRYPTED, data: { json: JSON.parse(innerMessage.message) } },
                    ],
                },
            })
            const response = await veramoAgent.sendDIDCommMessage({
                messageId: msgId,
                packedMessage: packedForwardMessage,
                recipientDidUrl: mediatorDid,
            })

            return { status: 'message forwarded', messageId: msgId, response };

        } catch (error) {
            console.error('Error sending message through mediator:', error);
            return { error: 'Failed to send message through mediator' };
        }
    }
}