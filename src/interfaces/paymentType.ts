export interface subaccount {
  business_name: string;
  settlement_bank: string;
  account_number: string;
  percentage_charge: number;
}

export interface bankType {
  //for the bank list in the admin page
  name: string;
  code: number;
  id: number;
}
