import * as React from 'react';
import {
  Card,
  CardHeader,
  makeStyles,
  Caption1,
  Text,
  Label,
  tokens,
  TableColumnSizingOptions,
  createTableColumn,
  useFluent,
  useScrollbarWidth,
  FluentProvider,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Skeleton,
  SkeletonItem,
  Theme,
} from '@fluentui/react-components';
import { DataGridBody, DataGrid, DataGridRow, DataGridHeader, DataGridCell, DataGridHeaderCell, RowRenderer } from '@fluentui-contrib/react-data-grid-react-window';
import {
  DocumentBulletListMultipleRegular,
  ArrowClockwise20Regular,
  ArrowLeft20Regular,
} from '@fluentui/react-icons';

import { HeaderCell } from './HeaderCell';
import { GlobalFilterPanel, FilterCondition, ColumnFilters } from './GlobalFilterPanel';

export interface ContentProps {
  lightTheme: Theme;
  darkTheme: Theme;
  currentTheme: Theme;
}

const appId = 'Gary';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: '10px',
    width: 'fit-content',
    flexWrap: 'wrap',
  },

  main: {
    gap: '10px',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },

  box: {
    flex: '1',
    padding: '1px',
    textAlign: 'center',
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
  gridCell: {
    padding: '0 8px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'visible',
  },
  estimateQuantity: {
    padding: '0 8px',
    boxSizing: 'border-box',
    backgroundColor: 'red',
  },
  filterOperatorDropdownListBox: {
    maxHeight: '100px',
    overflowY: 'auto',
  },
});

type Item = {
  name: string;
  committedQty: number;
  committedCost: number;
  estimatedQty: number;
  estimatedCost: number;
  usedQty: number;
  usedCost: number;
  billingAmount: number;
  lineStatus: string;
  createdOn: string;
};

const baseItems = [
  {
    name: 'Boiler 2000',
    committedQty: 1,
    committedCost: 3500,
    estimatedQty: 0,
    estimatedCost: 0,
    usedQty: 0,
    usedCost: 0,
    billingAmount: 5000,
    lineStatus: 'Committed',
    createdOn: '2025-09-09 11:00:00 AM',
  },
  {
    name: 'HVAC - Ceiling',
    committedQty: 1,
    committedCost: 3500,
    estimatedQty: 0,
    estimatedCost: 0,
    usedQty: 0,
    usedCost: 0,
    billingAmount: 5000,
    lineStatus: 'Committed',
    createdOn: '2025-09-09 11:00:00 AM',
  },
  {
    name: 'Boiler 2500',
    committedQty: 0,
    committedCost: 0,
    estimatedQty: 10,
    estimatedCost: 5000,
    usedQty: 0,
    usedCost: 0,
    billingAmount: 5000,
    lineStatus: 'Estimate',
    createdOn: '2025-09-09 11:00:00 AM',
  },
  {
    name: 'Damper',
    committedQty: 0,
    committedCost: 0,
    estimatedQty: 0,
    estimatedCost: 0,
    usedQty: 1,
    usedCost: 500,
    billingAmount: 1000,
    lineStatus: 'Used',
    createdOn: '2025-09-09 11:00:00 AM',
  },
];

const items = new Array(120)
  .fill(0)
  .map((_, i) => ({ ...baseItems[i % baseItems.length], index: i }));

// Column sizing options applied to all columns instead of inline minWidth styles
const columnSizingOptions: TableColumnSizingOptions = {
  name: {
    minWidth: 175,
    idealWidth: 200,
    defaultWidth: 200
  },
  committedQty: {
    minWidth: 150,
    idealWidth: 175,
    defaultWidth: 175
  },
  committedCost: {
    minWidth: 150,
    idealWidth: 175,
    defaultWidth: 175
  },
  estimatedQty: {
    minWidth: 150,
    idealWidth: 175,
    defaultWidth: 175
  },
  estimatedCost: {
    minWidth: 150,
    idealWidth: 175,
    defaultWidth: 175
  },
  usedQty: {
    minWidth: 150,
    idealWidth: 175,
    defaultWidth: 175
  },
  usedCost: {
    minWidth: 150,
    idealWidth: 175,
    defaultWidth: 175
  },
  billingAmount: {
    minWidth: 150,
    idealWidth: 175,
    defaultWidth: 175
  },
  lineStatus: {
    minWidth: 150,
    idealWidth: 175,
    defaultWidth: 175
  },
  createdOn: {
    minWidth: 175,
    idealWidth: 175,
    defaultWidth: 175
  },
};

const listProps = { useIsScrolling: true };
const CellShimmer = React.memo(function CellShimmer() {
  return (
    <Skeleton style={{ width: '100%' }}>
      <SkeletonItem
        shape="rectangle"
        animation="pulse"
        appearance="translucent"
      />
    </Skeleton>
  );
});

// Removed legacy renderRow1 with inline minWidth in favor of column sizing options

// FilterOperator and FilterCondition types imported from GlobalFilterPanel

// ColumnFilters type imported from GlobalFilterPanel

export const Orientation: React.FC<ContentProps> = (props): JSX.Element => {
  const styles = useStyles();
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });


  // Track which filter popover is open
  const [filterPopoverOpen, setFilterPopoverOpen] = React.useState<string | null>(null);
  // Anchor rect for filter panel (portal positioning)
  const [filterAnchor, setFilterAnchor] = React.useState<DOMRect | null>(null);

  // Filter form state
  // Filter operator/value state moved inside GlobalFilterPanel component

  // Sort state - only one column can be sorted at a time
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null);

  // Filter state - track filters for each column
  const [columnFilters, setColumnFilters] = React.useState<ColumnFilters>({});

  // (Filter operator/value initialization now handled inside GlobalFilterPanel)

  // Capture anchor rect for global filter panel when opening
  React.useEffect(() => {
    if (filterPopoverOpen) {
      const el = targetDocument?.querySelector(`[data-column-id="${filterPopoverOpen}"]`) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        setFilterAnchor(rect);
      } else {
        setFilterAnchor(null);
      }
    } else {
      setFilterAnchor(null);
    }
  }, [filterPopoverOpen, targetDocument]);

  // Persist sort and filter state to localStorage
  React.useEffect(() => {
    const savedSort = localStorage.getItem('example2GridSort');
    const savedFilters = localStorage.getItem('example2GridFilters');

    if (savedSort) {
      const { column, direction } = JSON.parse(savedSort);
      setSortColumn(column);
      setSortDirection(direction);
    }

    if (savedFilters) {
      setColumnFilters(JSON.parse(savedFilters));
    }
  }, []);

  // Save sort state when it changes
  React.useEffect(() => {
    if (sortColumn && sortDirection) {
      localStorage.setItem('example2GridSort', JSON.stringify({
        column: sortColumn,
        direction: sortDirection
      }));
    } else {
      localStorage.removeItem('example2GridSort');
    }
  }, [sortColumn, sortDirection]);

  // Save filter state when it changes
  React.useEffect(() => {
    localStorage.setItem('example2GridFilters', JSON.stringify(columnFilters));
  }, [columnFilters]);

  // Handler for column sorting and filtering actions
  const handleColumnAction = (columnId: string, action: string) => {
    if (action === "sort-asc") {
      // Clear any existing sort and set new sort
      setSortColumn(columnId);
      setSortDirection("asc");
  // menu auto-closes by Fluent; no state needed
    } else if (action === "sort-desc") {
      // Clear any existing sort and set new sort
      setSortColumn(columnId);
      setSortDirection("desc");
  // menu auto-closes
    } else if (action === "clear-sort") {
      setSortColumn(null);
      setSortDirection(null);
  // menu auto-closes
    } else if (action === "filter") {
  // menu auto-closes
      setFilterPopoverOpen(columnId);
    }
  };

  // Clean, restored filtering logic
  const applyFilter = (columnId: string, value: string, filter: FilterCondition): boolean => {
    const raw = value ?? '';
    const lowerValue = raw.toLowerCase();
    const filterVal = filter.value ?? '';
    const lowerFilterValue = filterVal.toLowerCase();

    const isEmpty = (v: string) => v.trim() === '';

    // Text operators
    switch (filter.operator) {
      case 'equals':
        return lowerValue === lowerFilterValue;
      case 'does-not-equal':
        return lowerValue !== lowerFilterValue;
      case 'contains':
        return lowerValue.includes(lowerFilterValue);
      case 'does-not-contain':
        return !lowerValue.includes(lowerFilterValue);
      case 'begins-with':
        return lowerValue.startsWith(lowerFilterValue);
      case 'does-not-begin-with':
        return !lowerValue.startsWith(lowerFilterValue);
      case 'ends-with':
        return lowerValue.endsWith(lowerFilterValue);
      case 'does-not-end-with':
        return !lowerValue.endsWith(lowerFilterValue);
      case 'contains-data':
        return !isEmpty(raw);
      case 'does-not-contain-data':
        return isEmpty(raw);
      case 'contains-data-any-time':
        return !isEmpty(raw);
    }

    // Numeric operators (attempt parse)
  if (isNumericColumn(columnId)) {
      const numericVal = parseFloat(raw);
      const numericFilter = parseFloat(filterVal);
      if (isNaN(numericVal)) return false;
      switch (filter.operator) {
        case 'greater-than':
          return numericVal > numericFilter;
        case 'greater-than-or-equal-to':
          return numericVal >= numericFilter;
        case 'less-than':
          return numericVal < numericFilter;
        case 'less-than-or-equal-to':
          return numericVal <= numericFilter;
      }
    }

    // Date handling: we treat the incoming value as 'YYYY-MM-DD ...'
  if (isDateColumn(columnId)) {
      const datePart = raw.split(' ')[0];
      if (!datePart) return false;
      const itemDate = new Date(datePart + 'T00:00:00');
      if (isNaN(itemDate.getTime())) return false;

      const makeDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const today = makeDateOnly(new Date());
      const compareItem = makeDateOnly(itemDate);

      const parseFilterDate = () => {
        if (!filterVal) return null;
        const base = filterVal.split('T')[0];
        return new Date(base + 'T00:00:00');
      };

      switch (filter.operator) {
        case 'on': {
          const fd = parseFilterDate();
            return !!fd && compareItem.getTime() === makeDateOnly(fd).getTime();
        }
        case 'on-or-after': {
          const fd = parseFilterDate();
          return !!fd && compareItem.getTime() >= makeDateOnly(fd).getTime();
        }
        case 'on-or-before': {
          const fd = parseFilterDate();
          return !!fd && compareItem.getTime() <= makeDateOnly(fd).getTime();
        }
        case 'today':
          return compareItem.getTime() === today.getTime();
        case 'yesterday': {
          const y = new Date(today);
          y.setDate(y.getDate() - 1);
          return compareItem.getTime() === y.getTime();
        }
        case 'tomorrow': {
          const t = new Date(today);
          t.setDate(t.getDate() + 1);
          return compareItem.getTime() === t.getTime();
        }
        case 'this-week': {
          const start = new Date(today);
          start.setDate(start.getDate() - start.getDay());
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          return compareItem.getTime() >= start.getTime() && compareItem.getTime() <= end.getTime();
        }
        case 'last-week': {
          const start = new Date(today);
          start.setDate(start.getDate() - start.getDay() - 7);
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          return compareItem.getTime() >= start.getTime() && compareItem.getTime() <= end.getTime();
        }
        case 'next-week': {
          const start = new Date(today);
          start.setDate(start.getDate() - start.getDay() + 7);
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          return compareItem.getTime() >= start.getTime() && compareItem.getTime() <= end.getTime();
        }
        case 'this-month': {
          return compareItem.getFullYear() === today.getFullYear() && compareItem.getMonth() === today.getMonth();
        }
        case 'last-month': {
          const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          return compareItem.getFullYear() === prev.getFullYear() && compareItem.getMonth() === prev.getMonth();
        }
        case 'next-month': {
          const nxt = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          return compareItem.getFullYear() === nxt.getFullYear() && compareItem.getMonth() === nxt.getMonth();
        }
        case 'this-year':
          return compareItem.getFullYear() === today.getFullYear();
        case 'last-year':
          return compareItem.getFullYear() === today.getFullYear() - 1;
        case 'next-year':
          return compareItem.getFullYear() === today.getFullYear() + 1;
      }
    }

    return true; // Fallback
  };

  // Helper function to determine if a column contains numeric data
  const isNumericColumn = (columnId: string): boolean => {
    const numericColumns = [
      'committedQty', 'committedCost', 'estimatedQty', 'estimatedCost',
      'usedQty', 'usedCost', 'billingAmount'
    ];
    return numericColumns.includes(columnId);
  };

  // Helper function to determine if a column contains date data
  const isDateColumn = (columnId: string): boolean => {
    const dateColumns = ['createdOn'];
    return dateColumns.includes(columnId);
  };

  // Helper function to check if operator requires a date picker
  const requiresDatePicker = (operator: string): boolean => {
    return ['on', 'on-or-after', 'on-or-before'].includes(operator);
  };

  // Helper function to check if operator requires a numeric input
  const requiresNumericInput = (operator: string): boolean => {
    return operator.includes('next-x-') || operator.includes('last-x-') || operator.includes('older-than-x-');
  };

  // Helper function to check if operator should hide the value input
  const shouldHideValueInput = (operator: string): boolean => {
    const hideValueOperators = [
      'today', 'yesterday', 'tomorrow', 'this-week', 'this-month', 'this-year',
      'this-fiscal-period', 'this-fiscal-year', 'next-week', 'next-7-days', 'next-month',
      'next-year', 'next-fiscal-period', 'next-fiscal-year', 'last-week', 'last-7-days',
      'last-month', 'last-year', 'last-fiscal-period', 'last-fiscal-year', 'in-fiscal-year',
      'in-fiscal-period', 'in-fiscal-period-and-year', 'in-or-after-fiscal-period-and-year',
      'in-or-before-fiscal-period-and-year'
    ];
    return hideValueOperators.includes(operator);
  };

  // Helper function to get display text for filter operator
  const getOperatorDisplayText = (operator: string): string => {
    const operatorMap: Record<string, string> = {
      'equals': 'Equals',
      'does-not-equal': 'Does not equal',
      'contains-data': 'Contains data',
      'does-not-contain-data': 'Does not contain data',
      'greater-than': 'Greater than',
      'greater-than-or-equal-to': 'Greater than or equal to',
      'less-than': 'Less than',
      'less-than-or-equal-to': 'Less than or equal to',
      'contains': 'Contains',
      'does-not-contain': 'Does not contain',
      'begins-with': 'Begins with',
      'does-not-begin-with': 'Does not begin with',
      'ends-with': 'Ends with',
      'does-not-end-with': 'Does not end with',
      'on': 'On',
      'on-or-after': 'On or after',
      'on-or-before': 'On or before',
      'today': 'Today',
      'yesterday': 'Yesterday',
      'tomorrow': 'Tomorrow',
      'this-week': 'This week',
      'this-month': 'This month',
      'this-year': 'This year',
      'this-fiscal-period': 'This fiscal period',
      'this-fiscal-year': 'This fiscal year',
      'next-week': 'Next week',
      'next-7-days': 'Next 7 days',
      'next-month': 'Next month',
      'next-year': 'Next year',
      'next-fiscal-period': 'Next fiscal period',
      'next-fiscal-year': 'Next fiscal year',
      'last-week': 'Last week',
      'last-7-days': 'Last 7 days',
      'last-month': 'Last month',
      'last-year': 'Last year',
      'last-fiscal-period': 'Last fiscal period',
      'last-fiscal-year': 'Last fiscal year',
      'contains-data-any-time': 'Contains data (any time)',
    };
    return operatorMap[operator] || 'Equals';
  };

  // Filter and sort the data
  const filteredAndSortedItems = React.useMemo(() => {
    let result = [...items];

    // Apply each active column filter
    Object.entries(columnFilters).forEach(([colId, cond]) => {
      if (cond) {
        result = result.filter(item => {
          const val = (item as any)[colId];
          return applyFilter(colId, val != null ? String(val) : '', cond);
        });
      }
    });

    // Apply sorting
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aVal = (a as any)[sortColumn];
        const bVal = (b as any)[sortColumn];

        // Numeric sort if both numbers
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        // Date sort if date column
        if (isDateColumn(sortColumn)) {
          const aTime = new Date(String(aVal)).getTime();
          const bTime = new Date(String(bVal)).getTime();
            return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
        }

        // Fallback string compare
        const comp = String(aVal).localeCompare(String(bVal));
        return sortDirection === 'asc' ? comp : -comp;
      });
    }

    return result;
  }, [items, columnFilters, sortColumn, sortDirection]);

  // Column order state and persistence
  const defaultColumnOrder = [
    'name',
    'committedQty',
    'committedCost',
    'estimatedQty',
    'estimatedCost',
    'usedQty',
    'usedCost',
    'billingAmount',
    'lineStatus',
    'createdOn',
  ];
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() => {
    const saved = localStorage.getItem('example2GridColumnOrder');
    return saved ? JSON.parse(saved) : defaultColumnOrder;
  });
  React.useEffect(() => {
    localStorage.setItem('example2GridColumnOrder', JSON.stringify(columnOrder));
  }, [columnOrder]);

  // Map of columnId to column config
  const columnConfig: Record<string, { title: string; compare: (a: Item, b: Item) => number; renderCell: (item: Item) => React.ReactNode }> = {
    name: {
      title: 'Name',
      compare: (a, b) => a.name.localeCompare(b.name),
      renderCell: (item) => <DataGridCell>{item.name}</DataGridCell>,
    },
    committedQty: {
      title: 'Committed Qty',
      compare: (a, b) => a.committedQty - b.committedQty,
      renderCell: (item) => <DataGridCell>{item.committedQty}</DataGridCell>,
    },
    committedCost: {
      title: 'Committed Cost',
      compare: (a, b) => a.committedCost - b.committedCost,
      renderCell: (item) => <DataGridCell>{item.committedCost}</DataGridCell>,
    },
    estimatedQty: {
      title: 'Estimated Qty',
      compare: (a, b) => a.estimatedQty - b.estimatedQty,
      renderCell: (item) => <DataGridCell>{item.estimatedQty}</DataGridCell>,
    },
    estimatedCost: {
      title: 'Estimated Cost',
      compare: (a, b) => a.estimatedCost - b.estimatedCost,
      renderCell: (item) => <DataGridCell>{item.estimatedCost}</DataGridCell>,
    },
    usedQty: {
      title: 'Used Qty',
      compare: (a, b) => a.usedQty - b.usedQty,
      renderCell: (item) => <DataGridCell>{item.usedQty}</DataGridCell>,
    },
    usedCost: {
      title: 'Used Cost',
      compare: (a, b) => a.usedCost - b.usedCost,
      renderCell: (item) => <DataGridCell>{item.usedCost}</DataGridCell>,
    },
    billingAmount: {
      title: 'Billing Amount',
      compare: (a, b) => a.billingAmount - b.billingAmount,
      renderCell: (item) => <DataGridCell>{item.billingAmount}</DataGridCell>,
    },
    lineStatus: {
      title: 'Line Status',
      compare: (a, b) => a.lineStatus.localeCompare(b.lineStatus),
      renderCell: (item) => {
        let bg = '', color = '';
        if (item.lineStatus === 'Committed') {
          bg = '#ffe066'; color = '#333';
        } else if (item.lineStatus === 'Estimate') {
          bg = '#ffb347'; color = '#333';
        } else if (item.lineStatus === 'Used') {
          bg = '#5cb85c'; color = '#fff';
        }
        return (
          <DataGridCell style={{ background: bg, color, fontWeight: 600, borderRadius: 4 }}>{item.lineStatus}</DataGridCell>
        );
      },
    },
    createdOn: {
      title: 'Created On',
      compare: (a, b) => a.createdOn.localeCompare(b.createdOn),
      renderCell: (item) => <DataGridCell>{item.createdOn}</DataGridCell>,
    },
  };



  // DebugMenu removed after verification

  // Stable column definitions to prevent width reset during header interaction
  const columns = React.useMemo(() =>
    columnOrder.map((colId) =>
      createTableColumn<Item>({
        columnId: colId,
        compare: columnConfig[colId].compare,
        renderHeaderCell: () => (
          <DataGridHeaderCell className={styles.gridCell}>
            <HeaderCell
              columnId={colId}
              title={columnConfig[colId].title}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              columnFilters={columnFilters}
              handleColumnAction={handleColumnAction}
              setColumnFilters={setColumnFilters}
              tokens={tokens}
            />
          </DataGridHeaderCell>
        ),
        renderCell: columnConfig[colId].renderCell,
      })
    ),
    [columnOrder, sortColumn, sortDirection, columnFilters]
  );

  const toolbarStyle = {
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box' as const,
  };

  // Removed getEstimateQtyStyle and all background coloring for estimatedQty

  // Insert DebugMenu in JSX return (search for DataGrid usage below)

  const renderRow = React.useMemo<RowRenderer<Item>>(
    () =>
      ({ item, rowId }, style, _, isScrolling) =>
        (
          <DataGridRow<Item> key={rowId} style={style}>
            {({ renderCell }) => (
              <DataGridCell className={styles.gridCell} focusMode="group">
                {isScrolling ? <CellShimmer /> : renderCell(item)}
              </DataGridCell>
            )}
          </DataGridRow>
        ),
    []
  );

  return (
    <FluentProvider theme={props.currentTheme}>
      <div className={styles.main}>
  {/* DebugMenu removed */}
        <GlobalFilterPanel
          openColumnId={filterPopoverOpen}
          anchorRect={filterAnchor}
          setOpenColumnId={setFilterPopoverOpen}
          columnFilters={columnFilters as any}
          setColumnFilters={setColumnFilters as any}
          isDateColumn={isDateColumn}
          isNumericColumn={isNumericColumn}
          getOperatorDisplayText={getOperatorDisplayText}
          requiresDatePicker={requiresDatePicker}
          requiresNumericInput={requiresNumericInput}
          shouldHideValueInput={shouldHideValueInput}
        />
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.box}>
              <Card className={styles.card} orientation="horizontal">
                <CardHeader
                  header={<Text weight="semibold">Committed</Text>}
                  description={
                    <>
                      <div>
                        <Caption1 className={styles.caption}>
                          <div>
                            <Label size="small">Quantity: 3</Label>
                          </div>
                          <div>
                            <Label size="small">Cost: $3,000.00</Label>
                          </div>
                        </Caption1>
                      </div>
                    </>
                  }
                />
              </Card>
            </div>
            <div className={styles.box}>
              <Card className={styles.card} orientation="horizontal">
                <CardHeader
                  header={<Text weight="semibold">Estimated</Text>}
                  description={
                    <Caption1 className={styles.caption}>
                      <div>
                        <Label size="small">Quantity: 0</Label>
                      </div>
                      <div>
                        <Label size="small">Cost $0.00</Label>
                      </div>
                    </Caption1>
                  }
                />
              </Card>
            </div>
            <div className={styles.box}>
              <Card className={styles.card} orientation="horizontal">
                <CardHeader
                  header={<Text weight="semibold">Used</Text>}
                  description={
                    <Caption1 className={styles.caption}>
                      <div>
                        <Label size="small">Quantity: 5</Label>
                      </div>
                      <div>
                        <Label size="small">Cost: $2,342.53</Label>
                      </div>
                    </Caption1>
                  }
                />
              </Card>
            </div>
            <div className={styles.box}>
              <Card className={styles.card} orientation="horizontal">
                <CardHeader
                  header={<Text weight="semibold">Billing Amount</Text>}
                  description={
                    <Caption1 className={styles.caption}>
                      <div>
                        <Label size="small">$12,342.53</Label>
                      </div>
                      <div>
                        <Label size="small">&nbsp;</Label>
                      </div>
                    </Caption1>
                  }
                />
              </Card>
            </div>
          </div>
          <div style={{ paddingTop: '50px' }}>
            <Toolbar style={toolbarStyle}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ToolbarButton
                  appearance="subtle"
                  icon={<ArrowLeft20Regular />}
                />
              </div>
              <ToolbarDivider />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}
              >
                <span style={{ fontWeight: tokens.fontWeightSemibold }}>
                  Total number of items
                </span>
              </div>
              <ToolbarDivider />
              <div
                id={`${appId}-detail-toolbar-buttons`}
                style={{
                  display: 'flex',
                  gap: tokens.spacingHorizontalS,
                  paddingRight: '20px',
                }}
              >
                <ToolbarButton
                  appearance="primary"
                  icon={<DocumentBulletListMultipleRegular />}
                  title="Open the selected entity in Dataverse in a new window"
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
              items={filteredAndSortedItems}
              columns={columns}
              focusMode="cell"
              // sortable
              selectionMode="single"
              // resizableColumns={false}
              resizableColumns={true}
              resizableColumnsOptions={{
                autoFitColumns: false,
              }}
              columnSizingOptions={columnSizingOptions}
              subtleSelection
            >
              <DataGridHeader style={{ paddingRight: scrollbarWidth }}>
                <DataGridRow>
                  {({ renderHeaderCell }) => renderHeaderCell()}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<Item>
                itemSize={50}
                height={420}
                listProps={listProps}
              >
                {renderRow}
              </DataGridBody>
            </DataGrid>
          </div>
        </section>
      </div>
    </FluentProvider>
  );
};
