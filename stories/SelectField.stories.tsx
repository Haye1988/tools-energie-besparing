import type { Meta, StoryObj } from "@storybook/nextjs";
import SelectField from "@/components/shared/SelectField";

const meta: Meta<typeof SelectField> = {
  title: "Components/SelectField",
  component: SelectField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SelectField>;

export const Default: Story = {
  args: {
    label: "Woningtype",
    name: "woningType",
    value: "tussenwoning",
    onChange: () => {},
    options: [
      { value: "appartement", label: "Appartement" },
      { value: "tussenwoning", label: "Tussenwoning" },
      { value: "hoekwoning", label: "Hoekwoning" },
      { value: "2-onder-1-kap", label: "2-onder-1-kap" },
      { value: "vrijstaand", label: "Vrijstaand" },
    ],
  },
};

export const Required: Story = {
  args: {
    label: "Dakoriëntatie",
    name: "dakOrientatie",
    value: "zuid",
    onChange: () => {},
    required: true,
    options: [
      { value: "zuid", label: "Zuid (optimaal)" },
      { value: "zuidoost", label: "Zuidoost" },
      { value: "zuidwest", label: "Zuidwest" },
      { value: "oost", label: "Oost" },
      { value: "west", label: "West" },
      { value: "noord", label: "Noord" },
    ],
  },
};
