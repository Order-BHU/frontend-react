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

export interface banksType {
  active: string;
  code: string;
  country: string;
  createdAt: string;
  currency: string;
  gateway: string;
  id: number;
  is_deleted: boolean;
  longcode: string;
  name: string;
  pay_with_bank: boolean;
  slug: string;
  supports_transfer: boolean;
  type: string;
  updatedAt: string;
}
