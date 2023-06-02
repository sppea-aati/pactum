export class Message {
    type: MessageType;
    message: string;
}

export enum MessageType {
    Success,
    Error,
    Info,
    Warning
}
