import type { Meta, StoryObj } from "@storybook/nextjs";
import ResultCard from "@/components/shared/ResultCard";
import { Sun, Zap } from "lucide-react";

const meta: Meta<typeof ResultCard> = {
  title: "Components/ResultCard",
  component: ResultCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ResultCard>;

export const Info: Story = {
  args: {
    title: "Aantal panelen",
    value: 12,
    unit: "stuks",
    icon: <Sun className="w-8 h-8" />,
    variant: "info",
  },
};

export const Success: Story = {
  args: {
    title: "Jaarlijkse besparing",
    value: 850,
    unit: "€",
    icon: <Zap className="w-8 h-8" />,
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    title: "Jaarlijkse kosten",
    value: 1200,
    unit: "€",
    variant: "warning",
  },
};
