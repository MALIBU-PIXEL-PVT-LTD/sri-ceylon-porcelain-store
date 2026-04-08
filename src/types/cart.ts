/** One row in the cart — enough to render line UI without full Product. */
export type CartLine = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};
