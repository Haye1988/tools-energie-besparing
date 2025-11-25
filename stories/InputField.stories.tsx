import type { Meta, StoryObj } from "@storybook/nextjs";
import InputField from "@/components/shared/InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: "Jaarlijks verbruik",
    name: "verbruik",
    type: "number",
    value: 3500,
    onChange: () => {},
    unit: "kWh/jaar",
  },
};

export const WithHelpText: Story = {
  args: {
    label: "Stroomprijs",
    name: "stroomPrijs",
    type: "number",
    value: 0.3,
    onChange: () => {},
    unit: "€/kWh",
    helpText: "Gemiddelde stroomprijs in Nederland",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: "E-mailadres",
    name: "email",
    type: "email",
    value: "",
    onChange: () => {},
    placeholder: "jouw@email.nl",
    required: true,
  },
};
