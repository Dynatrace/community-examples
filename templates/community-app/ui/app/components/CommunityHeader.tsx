/**
 * Shared header for Dynatrace Community Apps.
 *
 * Built from documented Strato AppHeader slots:
 *   Navigation (logo + tabs) | Menus (optional settings) | HelpMenu
 * The Community chip next to the app name is Strato's release-phase chip on the logo, with its label
 * overridden to "Community" (see COMMUNITY_CHIP_OVERRIDE_ID below).
 *
 * What it guarantees (checked by `npm run check:repo`):
 *  - "Community" chip + tooltip: the app is NOT officially supported by Dynatrace
 *  - HelpMenu: What's new, Get started, Documentation, Share feedback (platform overlay),
 *    Report issue (GitHub issues), About this app (shows the disclaimer)
 */
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FormattedMessage, IntlProvider, useIntl } from "react-intl";
import { getAppName, getAppVersion } from "@dynatrace-sdk/app-environment";
import { Button } from "@dynatrace/strato-components/buttons";
import { AppHeader, Flex, HelpMenu } from "@dynatrace/strato-components/layouts";
import { Menu } from "@dynatrace/strato-components/navigation";
import { Modal, Tooltip } from "@dynatrace/strato-components/overlays";
import { Paragraph } from "@dynatrace/strato-components/typography";
import {
  BugReportIcon,
  ExternalLinkIcon,
  InformationIcon,
  SettingIcon,
} from "@dynatrace/strato-icons";
import { community, issuesUrl } from "../community.config";

/**
 * Strato renders the logo's release-phase chip with a translated label. The "Preview" label has this
 * message id in @dynatrace/strato-components 3.16.x (content/release-phase-indicator/messages).
 * We override that one message so the chip next to the app name reads "Community".
 * If a Strato update changes the id, the chip falls back to "Preview": `npm test` catches this.
 */
export const COMMUNITY_CHIP_OVERRIDE_ID = "92og/kC9Mmwxmmg0";

export type CommunityHeaderProps = {
  /** Top-level tabs. Omit if the app has a single primary flow. */
  tabs?: { label: string; to: string }[];
  /** Renders a settings button (left of the help menu) when set. */
  settingsHref?: string;
  /** Optional help links. */
  getStartedUrl?: string;
  documentationUrl?: string;
};

export const CommunityHeader = ({
  tabs = [],
  settingsHref,
  getStartedUrl = `${community.repoUrl}#readme`,
  documentationUrl = `${community.repoUrl}#readme`,
}: CommunityHeaderProps) => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const [aboutOpen, setAboutOpen] = useState(false);

  const chipLabel = intl.formatMessage({ id: "header.community.chip", defaultMessage: "Community" });
  const chipTooltip = intl.formatMessage({
    id: "header.community.tooltip",
    defaultMessage:
      "Built by the Dynatrace community. Not officially supported by Dynatrace. Use Report issue in the help menu to reach the maintainers.",
  });
  const messages = useMemo(
    () => ({ ...intl.messages, [COMMUNITY_CHIP_OVERRIDE_ID]: chipLabel }),
    [intl.messages, chipLabel]
  );

  // The logo cannot be wrapped in a Tooltip (AppHeader.Navigation needs the Logo as a direct child),
  // so the chip gets a native browser tooltip.
  useEffect(() => {
    document
      .querySelector('[data-dt-component="ReleasePhaseIndicator"]')
      ?.setAttribute("title", chipTooltip);
  });

  return (
    <>
      <IntlProvider
        locale={intl.locale}
        defaultLocale={intl.defaultLocale}
        messages={messages}
        onError={intl.onError}
      >
      <AppHeader>
        {/* Logo + app name come from app.config.json (getAppName). The dev server appends " (dev)"; we hide it. */}
        <AppHeader.Navigation>
          <AppHeader.Logo
            as={Link}
            to="/"
            appName={getAppName().replace(" (dev)", "")}
            releasePhase="preview" // label is overridden to "Community" via IntlProvider messages
          />
          {tabs.map((tab) => (
            <AppHeader.NavigationItem
              key={tab.to}
              as={Link}
              to={tab.to}
              isSelected={pathname === tab.to}
            >
              {tab.label}
            </AppHeader.NavigationItem>
          ))}
        </AppHeader.Navigation>

        {settingsHref && (
          <AppHeader.Menus>
            <Tooltip text={intl.formatMessage({ id: "header.settings", defaultMessage: "Settings" })}>
              <Button
                as="a"
                href={settingsHref}
                aria-label={intl.formatMessage({ id: "header.settings", defaultMessage: "Settings" })}
              >
                <Button.Prefix>
                  <SettingIcon />
                </Button.Prefix>
              </Button>
            </Tooltip>
          </AppHeader.Menus>
        )}

        <HelpMenu
          entries={{
            whatsNew: "default",
            getStarted: { href: getStartedUrl },
            documentation: { href: documentationUrl },
            feedback: "default", // opens the in-product feedback overlay
          }}
        >
          {/* Children render after the built-in entries, in this order */}
          <Menu.Link href={issuesUrl} target="_blank" rel="noopener noreferrer">
            <Menu.Prefix>
              <BugReportIcon />
            </Menu.Prefix>
            <Flex justifyContent="space-between" width="inherit">
              <FormattedMessage id="header.reportIssue" defaultMessage="Report issue" />
              <ExternalLinkIcon style={{ flexShrink: 0 }} />
            </Flex>
          </Menu.Link>
          <Menu.Item onSelect={() => setAboutOpen(true)}>
            <Menu.Prefix>
              <InformationIcon />
            </Menu.Prefix>
            <FormattedMessage id="header.about" defaultMessage="About this app" />
          </Menu.Item>
        </HelpMenu>
      </AppHeader>
      </IntlProvider>

      <Modal
        title={intl.formatMessage({ id: "about.title", defaultMessage: "About" })}
        show={aboutOpen}
        onDismiss={() => setAboutOpen(false)}
      >
        <Flex flexDirection="column" gap={12}>
          <Paragraph>
            {getAppName().replace(" (dev)", "")} {getAppVersion()}
          </Paragraph>
          <Paragraph>
            <FormattedMessage
              id="about.disclaimer"
              defaultMessage="This app is not officially supported by Dynatrace. It was built and is maintained by the community and is provided as is."
            />
          </Paragraph>
          <Paragraph>
            <a href={issuesUrl} target="_blank" rel="noopener noreferrer">
              <FormattedMessage id="about.reportIssue" defaultMessage="Report issue on GitHub" />
            </a>
          </Paragraph>
        </Flex>
      </Modal>
    </>
  );
};
