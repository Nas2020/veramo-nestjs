
// didcomm.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { VeramoAgentService } from './didcomm.service.js';
import { ApiOperation, ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger';
import { SendMessageDto } from './dtos/send-message.dto.js';
import { SendMessageThroughMediatorDto } from './dtos/send-message-mediator.dto.js';

@Controller('didcomm')
export class DidCommController {
    constructor(private readonly veramoAgentService: VeramoAgentService) { }

    @Post('/send')
    @ApiOperation({ summary: 'Send a message to a specified DID' })
    @ApiBody({ type: SendMessageDto })
    async sendMessage(@Body() body: SendMessageDto): Promise<any> {
        const { recipientDid, message, senderAlias } = body;
        return this.veramoAgentService.sendingMessages(recipientDid, message, senderAlias);
    }

    @Post('/send-through-mediator')
    @ApiOperation({ summary: 'Send a message to a reciever DID through mediator' })
    @ApiBody({ type: SendMessageThroughMediatorDto })
    async sendMessageThroughMediator(@Body() body: SendMessageThroughMediatorDto): Promise<any> {
        const { recipientDid, message, senderAlias, mediatorDid } = body;
        return this.veramoAgentService.sendMessageThroughMediator(recipientDid, message, senderAlias, mediatorDid);
    }

    @Post('/message')
    @ApiExcludeEndpoint() // Use ApiExclude decorator to exclude this endpoint
    async handleIncomingDIDCommMessage(@Body() body: string): Promise<any> {
        // console.log("Received plain text body:", body);
        const packedMessage = { "message": body }
        // console.log("packedMessage", packedMessage)
        return this.veramoAgentService.handleIncomingDIDCommMessage(packedMessage);
    }

}
