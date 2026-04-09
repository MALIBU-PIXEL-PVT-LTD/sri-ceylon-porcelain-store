import { CheckoutFormField } from "./CheckoutFormField";
import { CheckoutFormSection } from "./CheckoutFormSection";

type ContactFormProps = {
  className?: string;
};

export function ContactForm({ className = "" }: ContactFormProps) {
  return (
    <CheckoutFormSection title="Contact" className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <CheckoutFormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <CheckoutFormField
          id="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          required
        />
      </div>
    </CheckoutFormSection>
  );
}
