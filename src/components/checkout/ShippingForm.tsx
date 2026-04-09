import { CheckoutFormField } from "./CheckoutFormField";
import { CheckoutFormSection } from "./CheckoutFormSection";

type ShippingFormProps = {
  className?: string;
};

export function ShippingForm({ className = "" }: ShippingFormProps) {
  return (
    <CheckoutFormSection title="Shipping address" className={className}>
      <CheckoutFormField
        id="fullName"
        label="Full name"
        autoComplete="name"
        required
      />
      <CheckoutFormField
        id="address1"
        label="Address line 1"
        autoComplete="address-line1"
        required
      />
      <CheckoutFormField
        id="address2"
        label="Address line 2 (optional)"
        autoComplete="address-line2"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <CheckoutFormField
          id="city"
          label="City"
          autoComplete="address-level2"
          required
        />
        <CheckoutFormField
          id="postal"
          label="Postal code"
          autoComplete="postal-code"
          required
        />
      </div>
      <CheckoutFormField
        id="country"
        label="Country / region"
        autoComplete="country"
        required
      />
    </CheckoutFormSection>
  );
}
