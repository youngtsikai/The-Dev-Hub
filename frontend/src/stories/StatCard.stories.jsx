import React from "react";
import StatCard from "../components/StatCard";
import { FaGitAlt, FaBug } from "react-icons/fa";

export default {
  title: "Dashboard/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "select", options: ["mint", "purple", "blue", "yellow"] },
  },
};

const Template = (args) => <StatCard {...args} />;

export const Commits = Template.bind({});
Commits.args = {
  title: "Commits",
  value: 113,
  subtext: "Gamified Total",
  color: "mint",
  icon: <FaGitAlt />,
};

export const BugsFixed = Template.bind({});
BugsFixed.args = {
  title: "Bugs Fixed",
  value: 24,
  subtext: "Last 90 Days",
  color: "blue",
  icon: <FaBug />,
};
