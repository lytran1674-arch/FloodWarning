export interface RescueRequest {
  location: string;
  peopleCount: number;
  conditions: string[];
  phone?: string;
  description: string;
}