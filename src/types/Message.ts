export interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}
