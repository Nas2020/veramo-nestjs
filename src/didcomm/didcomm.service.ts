// file: didcomm.service.ts
// location: src/didcomm
import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IIdentifier } from '@veramo/core';
import { AppModule } from '../app.module.js';


@Injectable()
export class VeramoAgentService {


    async sendingMessages(recipientDid: string, messageBody: string, senderAlias: string): Promise<any> {

        const app = await NestFactory.create(AppModule);
        const veramoAgent = app.get('VERAMO_AGENT');

        const senderIdentifier: IIdentifier = await veramoAgent.didManagerFind({ alias: senderAlias });

        if (!senderIdentifier) {
            throw new Error('Sender identifier not found');
        }

        // Construct the message
        const message = {
            type: 'test',
            to: recipientDid,
            from: senderIdentifier[0].did,
            id: 'test',
            body: { text: messageBody },
        };
        try {
            // Pack the message with encryption
            // Pack the message with appropriate encryption. You can use 'none' for plain text,
            // or other methods like 'authcrypt' for encrypted messages based on the use case
            const packedMessage = await veramoAgent.packDIDCommMessage({
                packing: 'authcrypt', // Change to 'none' if you want plain text authcrypt
                message: message,
            });

            // Send the message
            const response = await veramoAgent.sendDIDCommMessage({
                messageId: '#didcommmessaging-0',
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
            console.log("unpackedMessage", unpackedMessage)
            if (!unpackedMessage) {
                console.error("Failed to unpack message: ", packedMessage);
                return { error: "Error unpacking the message!" };
            }

            const text = unpackedMessage.message.body.text;
            console.log("text message:",text)
            return text;
        } catch (error) {
            console.error("Error processing message: ", error);
            return { error: "An error occurred while processing the message." };
        }
    }

}
