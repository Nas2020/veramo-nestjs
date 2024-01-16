// send-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiProperty({ example: "did:peer:2.Ez6LSiy8TJXSGk152TNWYqVtiNTdqwTvJxwpoXGGSempYTDj2.Vz6Mki5PRbDgWXU1kUPDDmviU2BX1dG7eqRZEmYph6MpQ6S1a.SeyJpZCI6IjEyMzQ0IiwidCI6ImRtIiwicyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9kaWRjb21tL21lc3NhZ2UiLCJkZXNjcmlwdGlvbiI6ImFuIGVuZHBvaW50In0", description: 'Recipient DID' })
    recipientDid: string;

    @ApiProperty({ example: 'hello, message from veramo veridid', description: 'Message to send' })
    message: string;

    @ApiProperty({ example: 'didcomm-peer-did', description: 'Sender alias to obtain sender agent DiD' })
    senderAlias: string;
}
