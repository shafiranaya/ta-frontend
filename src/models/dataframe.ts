export interface Dataframe {
  account_id: string;
  email: string;
  feature_score: { [key: string]: number };
  total_score: number;
  risk_percentage: string;
  label: string;
}
