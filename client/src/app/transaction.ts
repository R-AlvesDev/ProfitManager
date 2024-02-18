export interface Transaction {
    // Define the properties of a transaction
    amount: number;
    category: string;
    type: string;
    date: string; // or Date depending on how you handle dates
}
