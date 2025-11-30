export interface Ticket {
  id: number;
  created_at: string;
  customer_name: string;
  channel: string;
  subject: string;
  status: string;
  priority: string;
}

export interface Metrics {
  [key: string]: any; // Adjust based on actual metrics
}