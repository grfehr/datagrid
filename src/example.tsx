import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import {
  makeStyles,
  Caption1,
  Text,
  tokens,
  TableColumnDefinition,
  createTableColumn,
  useFluent,
  useScrollbarWidth,
  FluentProvider,
  webLightTheme,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
} from '@fluentui/react-components';
import { Card, CardHeader } from '@fluentui/react-components';
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
  RowRenderer,
} from '@fluentui-contrib/react-data-grid-react-window';
import {
  DocumentBulletListMultipleRegular,
  ArrowClockwise20Regular,
  ArrowLeft20Regular,
} from '@fluentui/react-icons';

const appId = 'Gary';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: '10px',
    width: 'fit-content',
  },
  box: {
    flex: '1',
    padding: '1px',
    textAlign: 'center',
  },
  main: {
    gap: '10px',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },

  card: {
    width: '175px',
    maxWidth: '100%',
    height: 'fit-content',
  },

  section: {
    // width: 'fit-content',
    width: '100%',
  },

  title: { margin: '0 0 12px' },

  horizontalCardImage: {
    width: '32px',
    height: '32px',
  },

  headerImage: {
    borderRadius: '4px',
    maxWidth: '44px',
    maxHeight: '44px',
  },

  caption: {
    color: tokens.colorNeutralForeground3,
  },

  text: { margin: '0' },
});

type Item = {
  dimension: string;
  type: string;
  committedCost: number;
  estimatedCost: number;
  usedCost: number;
  billingAmount: number;
};

const baseItems = [
  {
    dimension: 'Inventory',
    type: 'Product',
    committedCost: 3500,
    estimatedCost: 0,
    usedCost: 0,
    billingAmount: 5000,
  },
  {
    dimension: 'Non-Inventory',
    type: 'Product',
    committedCost: 0,
    estimatedCost: 2000,
    usedCost: 0,
    billingAmount: 3000,
  },
  {
    dimension: 'Labor - Technician',
    type: 'Service',
    committedCost: 0,
    estimatedCost: 0,
    usedCost: 400,
    billingAmount: 600,
  },
  {
    dimension: 'Labor - Dispatcher',
    type: 'Service',
    committedCost: 0,
    estimatedCost: 0,
    usedCost: 350,
    billingAmount: 550,
  },
];

const items = new Array(120)
  .fill(0)
  .map((_, i) => ({ ...baseItems[i % baseItems.length], index: i }));

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'dimension',
    compare: (a, b) => {
      return a.dimension.localeCompare(b.dimension);
    },
    renderHeaderCell: () => {
      return 'Dimension';
    },
    renderCell: (item) => {
      return item.dimension;
    },
  }),
  createTableColumn<Item>({
    columnId: 'type',
    compare: (a, b) => {
      return a.type.localeCompare(b.type);
    },
    renderHeaderCell: () => {
      return 'Type';
    },
    renderCell: (item) => {
      return item.type;
    },
  }),
  createTableColumn<Item>({
    columnId: 'committedCost',
    compare: (a, b) => {
      return a.committedCost - b.committedCost;
    },
    renderHeaderCell: () => {
      return 'Committed Cost';
    },
    renderCell: (item) => {
      return item.committedCost;
    },
  }),
  createTableColumn<Item>({
    columnId: 'esitmatedCost',
    compare: (a, b) => {
      return (a.estimatedCost = b.estimatedCost);
    },
    renderHeaderCell: () => {
      return 'Esitmated Cost';
    },
    renderCell: (item) => {
      return item.estimatedCost;
    },
  }),
  createTableColumn<Item>({
    columnId: 'usedCost',
    compare: (a, b) => {
      return a.usedCost - b.usedCost;
    },
    renderHeaderCell: () => {
      return 'Used Cost';
    },
    renderCell: (item) => {
      return item.usedCost;
    },
  }),
  createTableColumn<Item>({
    columnId: 'billingAmount',
    compare: (a, b) => {
      return a.billingAmount - b.billingAmount;
    },
    renderHeaderCell: () => {
      return 'Billing Amount';
    },
    renderCell: (item) => {
      return item.billingAmount;
    },
  }),
];

const renderRow: RowRenderer<Item> = ({ item, rowId }, style) => (
  <DataGridRow<Item> key={rowId} style={style}>
    {({ renderCell }) => (
      <DataGridCell focusMode="group">{renderCell(item)}</DataGridCell>
    )}
  </DataGridRow>
);

export const Orientation = (): JSXElement => {
  const styles = useStyles();
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });

  const toolbarStyle = {
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box' as const,
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.main}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.box}>
              <Card className={styles.card} orientation="horizontal">
                <CardHeader
                  header={<Text weight="semibold">Committed Cost</Text>}
                  description={
                    <Caption1 className={styles.caption}>$3,000.00</Caption1>
                  }
                />
              </Card>
            </div>
            <div className={styles.box}>
              <Card className={styles.card} orientation="horizontal">
                <CardHeader
                  header={<Text weight="semibold">Estimated Cost</Text>}
                  description={
                    <Caption1 className={styles.caption}>$0.00</Caption1>
                  }
                />
              </Card>
            </div>
            <div className={styles.box}>
              <Card className={styles.card} orientation="horizontal">
                <CardHeader
                  header={<Text weight="semibold">Used Cost</Text>}
                  description={
                    <Caption1 className={styles.caption}>$2,342.53</Caption1>
                  }
                />
              </Card>
            </div>
            <div className={styles.box}>
              <Card className={styles.card} orientation="horizontal">
                <CardHeader
                  header={<Text weight="semibold">Billed Amount</Text>}
                  description={
                    <Caption1 className={styles.caption}>$12,342.53</Caption1>
                  }
                />
              </Card>
            </div>
          </div>
          <div style={{ paddingTop: '50px' }}>
            <Toolbar style={toolbarStyle}>
              <div
                id={`${appId}-toolbar-buttons`}
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  gap: tokens.spacingHorizontalS,
                  paddingRight: '20px',
                }}
              >
                <ToolbarButton
                  appearance="primary"
                  icon={<DocumentBulletListMultipleRegular />}
                  title="View details for selected item"
                >
                  View Details
                </ToolbarButton>
                <ToolbarButton
                  appearance="primary"
                  icon={<ArrowClockwise20Regular />}
                >
                  Refresh
                </ToolbarButton>
              </div>
            </Toolbar>
            <DataGrid
              items={items}
              columns={columns}
              focusMode="cell"
              sortable
              selectionMode="single"
            >
              <DataGridHeader style={{ paddingRight: scrollbarWidth }}>
                <DataGridRow>
                  {({ renderHeaderCell }) => (
                    <DataGridHeaderCell>
                      {renderHeaderCell()}
                    </DataGridHeaderCell>
                  )}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<Item> itemSize={40} height={300}>
                {renderRow}
              </DataGridBody>
            </DataGrid>
          </div>
        </section>
      </div>
    </FluentProvider>
  );
};
