import React from "react";
import { FormattedMessage } from "react-intl";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Paragraph } from "@dynatrace/strato-components/typography";

export const Home = () => (
  <Flex flexDirection="column" padding={32} gap={16}>
    <Heading level={1}>
      <FormattedMessage id="home.title" defaultMessage="Overview" />
    </Heading>
    <Paragraph>
      <FormattedMessage
        id="home.intro"
        defaultMessage="Replace this page with your app. Use Strato components and design tokens, wrap all user-facing text in react-intl, and show a helpful message when there is no data."
      />
    </Paragraph>
  </Flex>
);
