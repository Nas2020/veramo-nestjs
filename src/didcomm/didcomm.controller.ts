
// didcomm.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { VeramoAgentService } from './didcomm.service.js';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { SendMessageDto } from './dtos/send-message.dto.js';

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


    @Post('/message')
    @ApiOperation({ summary: 'Receive a message from a specified DID' })
    async handleIncomingDIDCommMessage(@Body() body: string): Promise<any> {
        // console.log("Received plain text body:", body);
        const packedMessage = { "message": body }
        // console.log("packedMessage", packedMessage)
        return this.veramoAgentService.handleIncomingDIDCommMessage(packedMessage);
    }

}
