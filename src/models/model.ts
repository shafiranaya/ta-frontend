interface Model {
  [index: number]: ModelItem;
}

interface ModelItem {
  [key: string]: number;
}

interface Mapping {
  [key: string]: string;
}

export interface RiskScoreModel {
  model: Model;
  features: string[];
  features_alias: string[];
  features_description: string[];
  mapping: Mapping;
}
