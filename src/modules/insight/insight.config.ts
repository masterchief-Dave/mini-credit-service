export type NecessityBucket =
  | "food_groceries"
  | "transport"
  | "housing_rent"
  | "utilities_power_water"
  | "telecom_airtime_data"
  | "healthcare"
  | "education"
  | "others";

export const NECESSITY_RULES: [NecessityBucket, RegExp[]][] = [
  [
    "food_groceries",
    [/food|meal|restaurant|eatery|supermarket|shoprite|spar|grocer|market/i],
  ],
  [
    "transport",
    [/uber|bolt|taxi|transport|brt|bus|petrol|fuel|filling\s*station/i],
  ],
  [
    "housing_rent",
    [/rent|landlord|accommodation|housing|estate|service\s*charge/i],
  ],
  [
    "utilities_power_water",
    [/phcn|ikeja|eko|nepa|power|electric|water\s*bill|waste|lawma/i],
  ],
  [
    "telecom_airtime_data",
    [/airtime|data|mtn|glo|airtel|9mobile|etisalat|recharge/i],
  ],
  ["healthcare", [/hospital|clinic|pharmacy|drug|lab|medical|hmo/i]],
  [
    "education",
    [/school|tuition|university|polytechnic|college|exam|waec|jamb/i],
  ],
  ["others", [/./]],
];

export function bucketFor(desc: string): NecessityBucket {
  for (const [key, patterns] of NECESSITY_RULES) {
    if (patterns.some((rx) => rx.test(desc))) return key;
  }
  return "others";
}
