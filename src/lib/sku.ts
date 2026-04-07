const skuByProductAndSize: Record<string, Record<string, string>> = {
  "classic-porcelain-plate": {
    '8"': "CLAPORPLAWHI08-001",
    '10"': "CLAPORPLAWHI10-002",
    '12"': "CLAPORPLAWHI12-003",
  },
  "premium-porcelain-cup": {
    "200ml": "PREPORCUPBLA200-004",
    "250ml": "PREPORCUPWHI250-005",
    "300ml": "PREPORCUPYEL300-006",
  },
};

export function getSkuForProductSize(slug: string, size?: string) {
  if (!size) return undefined;
  return skuByProductAndSize[slug]?.[size];
}
