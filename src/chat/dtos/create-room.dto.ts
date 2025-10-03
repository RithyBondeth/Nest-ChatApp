export class CreateRoomDTO {
    name: string
    type: 'private' | 'group'
    participants: string[]
}