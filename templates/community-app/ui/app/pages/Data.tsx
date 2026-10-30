// Adapted from Dynatrace/dt-app-templates (Apache-2.0). See NOTICE.
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Paragraph } from "@dynatrace/strato-components/typography";
import {
  RunQueryButton,
  type QueryStateType,
} from "@dynatrace/strato-components/buttons";
import {
  TimeseriesChart,
  convertToTimeseries,
} from "@dynatrace/strato-components/charts";
import { DQLEditor } from "@dynatrace/strato-components/editors";
import Colors from "@dynatrace/strato-design-tokens/colors";
import { CriticalIcon } from "@dynatrace/strato-icons";
import { useDql } from "@dynatrace-sdk/react-hooks";

const initialQuery = "fetch logs \n| summarize count(), by:{bin(timestamp, 1m)}";

export const Data = () => {
  const [editorQueryString, setEditorQueryString] = useState<string>(initialQuery);
  const [queryString, setQueryString] = useState<string>(initialQuery);

  const { data, error, isLoading, cancel, refetch } = useDql({ query: queryString });

  function onClickQuery() {
    if (isLoading) {
      void cancel();
    } else if (queryString !== editorQueryString) {
      setQueryString(editorQueryString);
    } else {
      void refetch();
    }
  }

  let queryState: QueryStateType;
  if (error) queryState = "error";
  else if (isLoading) queryState = "loading";
  else if (data) queryState = "success";
  else queryState = "idle";

  const hasRecords = (data?.records?.length ?? 0) > 0;

  return (
    <Flex flexDirection="column" padding={32} gap={16}>
      <Heading level={2}>
        <FormattedMessage
          id="data.title"
          defaultMessage="Explore the data in your environment with the Dynatrace Query Language"
        />
      </Heading>
      <Paragraph>
        <FormattedMessage
          id="data.hint"
          defaultMessage="Use a query that returns time series data:"
        />
      </Paragraph>
      <DQLEditor value={queryString} onChange={(value) => setEditorQueryString(value)} />
      <Flex justifyContent={error ? "space-between" : "flex-end"}>
        {error && (
          <Flex alignItems="center" style={{ color: Colors.Text.Critical.Default }}>
            <CriticalIcon />
            <Paragraph>{error.message}</Paragraph>
          </Flex>
        )}
        <RunQueryButton onClick={onClickQuery} queryState={queryState} />
      </Flex>
      {hasRecords && data?.records && (
        <TimeseriesChart
          data={convertToTimeseries(data.records, data.types)}
          gapPolicy="connect"
          variant="line"
        />
      )}
      {/* Empty state (guided interaction): never leave a blank page */}
      {data && !hasRecords && (
        <Paragraph>
          <FormattedMessage
            id="data.empty"
            defaultMessage="No data found. Check that data is ingested, or widen the timeframe."
          />
        </Paragraph>
      )}
    </Flex>
  );
};
