
export interface ChatMessage {
  id: string | number;
  sender: 'user' | 'coach';
  text: string;
}
