import { Meta, StoryObj } from "@storybook/react";

import { List } from "./List";

const meta = {
  title: "components/common/List",
  component: List,
} as Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;
const items = [
  <>
    <div className="flex min-w-0 gap-x-4">
      <img
        className="h-12 w-12 flex-none rounded-full bg-gray-50"
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
      <div className="min-w-0 flex-auto">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          Leslie Alexander
        </p>
        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
          leslie.alexander@example.com
        </p>
      </div>
    </div>
    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
      <p className="text-sm leading-6 text-gray-900">Co-Founder / CEO</p>
      <p className="mt-1 text-xs leading-5 text-gray-500">
        Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time>
      </p>
    </div>
  </>,
  <>
    <div className="flex min-w-0 gap-x-4">
      <img
        className="h-12 w-12 flex-none rounded-full bg-gray-50"
        src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
      <div className="min-w-0 flex-auto">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          Michael Foster
        </p>
        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
          michael.foster@example.com
        </p>
      </div>
    </div>
    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
      <p className="text-sm leading-6 text-gray-900">Co-Founder / CTO</p>
      <p className="mt-1 text-xs leading-5 text-gray-500">
        Last seen <time dateTime="2023-01-23T13:23Z">3h ago</time>
      </p>
    </div>
  </>,
];

export const Default: Story = {
  args: {
    children: items.map((item, i) => <List.Item key={i}>{item}</List.Item>),
  },
};

export const Action: Story = {
  args: {
    children: items.map((item, i) => (
      <List.Item key={i} action>
        {item}
      </List.Item>
    )),
  },
};

