// send-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageThroughMediatorDto {
    @ApiProperty({ example: "did:peer:2.Ez6LSiy8TJXSGk152TNWYqVtiNTdqwTvJxwpoXGGSempYTDj2.Vz6Mki5PRbDgWXU1kUPDDmviU2BX1dG7eqRZEmYph6MpQ6S1a.SeyJpZCI6IjEyMzQ0IiwidCI6ImRtIiwicyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9kaWRjb21tL21lc3NhZ2UiLCJkZXNjcmlwdGlvbiI6ImFuIGVuZHBvaW50In0", description: 'Recipient DID' })
    recipientDid: string;

    @ApiProperty({ example: "did:peer:2.Ez6LSiPb6jm4Rgemst6L14egBRkRktaWKqFcskWm1fEyZNxUH.Vz6Mkuf1pzXzJkohyYp2uENcTiBCAFWvBpT2K2jUpWBspNf1d.SeyJpZCI6IjEyMzQ0IiwidCI6ImRtIiwicyI6Imh0dHA6Ly8zLjk4LjEyMC4yODozMDAwL2RpZGNvbW0vbWVzc2FnZSIsImRlc2NyaXB0aW9uIjoiYW4gZW5kcG9pbnQifQ", description: 'Mediator DID' })
    mediatorDid: string;

    @ApiProperty({ example: 'hello, message from veramo veridid', description: 'Message to send' })
    message: string;

    @ApiProperty({ example: 'didcomm-peer-did', description: 'Sender alias to obtain sender agent DiD' })
    senderAlias: string;
}
