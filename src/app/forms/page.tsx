import InputField from "@/components/InputField"

export default function FormsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Form Components</h1>

      <InputField
    label="First Name"
    type="text"
    required
    className="w-full md:w-1/2 lg:w-1/3"
  />

  <InputField
    label="Last Name"
    type="text"
    required
    className="w-full md:w-1/2 lg:w-1/3"
  />

  <InputField
    label="Email"
    type="email"
    className="w-full md:w-1/2"
  />

      <InputField
        label="Password"
        type="password"
        name="password"
        placeholder="Enter password"
    className="w-full md:w-1/2"
        required
      />
      <InputField
        label="Mobile Number"
        type="tel"
        name="mobile"
        placeholder="Enter mobile number"
    className="w-full md:w-1/2"
        required
      />
    </div>
  )
}