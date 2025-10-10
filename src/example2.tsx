import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import {
  makeStyles,
  Caption1,
  Text,
  Label,
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
  Skeleton,
  SkeletonItem,
  Theme,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  MenuDivider,
  Button,
  shorthands,
  Dropdown,
  Option,
  Input,
  TeachingPopover,
  TeachingPopoverTrigger,
  TeachingPopoverSurface,
  TeachingPopoverHeader,
  TeachingPopoverBody,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
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
  ArrowSortUpRegular,
  ArrowSortDownRegular,
  ChevronDownRegular,
  FilterRegular,
  DismissRegular,
} from '@fluentui/react-icons';

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
  estimateQuantity: {
    backgroundColor: 'red',
  },
  filterOperatorDropdown: {
    '& [role="listbox"]': {
      maxHeight: '400px',
      overflowY: 'auto'
    }
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

const renderRow1: RowRenderer<Item> = (
  { item, rowId },
  style,
  _,
  isScrolling
) => (
  <DataGridRow<Item> key={rowId} style={style}>
    {({ renderCell }) => (
      <DataGridCell style={{ minWidth: '175px' }} focusMode="group">
        {isScrolling ? <CellShimmer /> : renderCell(item)}
      </DataGridCell>
    )}
  </DataGridRow>
);

// Filter and sort types
type FilterOperator =
  | 'equals'
  | 'does-not-equal'
  | 'contains'
  | 'does-not-contain'
  | 'begins-with'
  | 'does-not-begin-with'
  | 'ends-with'
  | 'does-not-end-with'
  | 'contains-data'
  | 'does-not-contain-data'
  | 'greater-than'
  | 'greater-than-or-equal-to'
  | 'less-than'
  | 'less-than-or-equal-to'
  // Date operators
  | 'on'
  | 'on-or-after'
  | 'on-or-before'
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'this-week'
  | 'this-month'
  | 'this-year'
  | 'this-fiscal-period'
  | 'this-fiscal-year'
  | 'next-week'
  | 'next-7-days'
  | 'next-month'
  | 'next-year'
  | 'next-fiscal-period'
  | 'next-fiscal-year'
  | 'next-x-hours'
  | 'next-x-days'
  | 'next-x-weeks'
  | 'next-x-months'
  | 'next-x-years'
  | 'next-x-fiscal-periods'
  | 'next-x-fiscal-years'
  | 'last-week'
  | 'last-7-days'
  | 'last-month'
  | 'last-year'
  | 'last-fiscal-period'
  | 'last-fiscal-year'
  | 'last-x-hours'
  | 'last-x-days'
  | 'last-x-weeks'
  | 'last-x-months'
  | 'last-x-years'
  | 'last-x-fiscal-periods'
  | 'last-x-fiscal-years'
  | 'older-than-x-minutes'
  | 'older-than-x-hours'
  | 'older-than-x-days'
  | 'older-than-x-weeks'
  | 'older-than-x-months'
  | 'older-than-x-years'
  | 'in-fiscal-year'
  | 'in-fiscal-period'
  | 'in-fiscal-period-and-year'
  | 'in-or-after-fiscal-period-and-year'
  | 'in-or-before-fiscal-period-and-year'
  | 'contains-data-any-time'
  | 'does-not-contain-data';

type FilterCondition = {
  operator: FilterOperator;
  value: string;
};

type ColumnFilters = Record<string, FilterCondition | null>;

export const Orientation: React.FC<ContentProps> = (props): JSXElement => {
  const styles = useStyles();
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });

  // Track which column's header-menu is open; null = none
  const [openCol, setOpenCol] = React.useState<string | null>(null);

  // Track which filter popover is open
  const [filterPopoverOpen, setFilterPopoverOpen] = React.useState<string | null>(null);

  // Filter form state
  const [filterOperator, setFilterOperator] = React.useState('equals');
  const [filterValue, setFilterValue] = React.useState('');
  const [filterError, setFilterError] = React.useState('');

  // Sort state - only one column can be sorted at a time
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null);

  // Filter state - track filters for each column
  const [columnFilters, setColumnFilters] = React.useState<ColumnFilters>({});

  // Initialize filter form when opening filter popover
  React.useEffect(() => {
    if (filterPopoverOpen) {
      const currentFilter = columnFilters[filterPopoverOpen];
      if (currentFilter) {
        setFilterOperator(currentFilter.operator);
        setFilterValue(currentFilter.value);
      } else {
        // Default to 'on' for date columns, 'equals' for other columns
        const defaultOperator = isDateColumn(filterPopoverOpen) ? 'on' : 'equals';
        setFilterOperator(defaultOperator);
        setFilterValue('');
      }
      setFilterError('');
    }
  }, [filterPopoverOpen, columnFilters]);

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
      setOpenCol(null);
    } else if (action === "sort-desc") {
      // Clear any existing sort and set new sort
      setSortColumn(columnId);
      setSortDirection("desc");
      setOpenCol(null);
    } else if (action === "clear-sort") {
      setSortColumn(null);
      setSortDirection(null);
      setOpenCol(null);
    } else if (action === "filter") {
      setOpenCol(null);
      setFilterPopoverOpen(columnId);
    }
    console.log(`Action on ${columnId}: ${action}`, { columnId });
  };

  // Apply filtering logic
  const applyFilter = (value: string, filter: FilterCondition): boolean => {
    const lowerValue = value.toLowerCase();
    const lowerFilterValue = filter.value.toLowerCase();

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
        return value.trim() !== '';
      case 'does-not-contain-data':
        return value.trim() === '';
      case 'greater-than':
        const numValue1 = parseFloat(value);
        const numFilter1 = parseFloat(filter.value);
        return !isNaN(numValue1) && !isNaN(numFilter1) && numValue1 > numFilter1;
      case 'greater-than-or-equal-to':
        const numValue2 = parseFloat(value);
        const numFilter2 = parseFloat(filter.value);
        return !isNaN(numValue2) && !isNaN(numFilter2) && numValue2 >= numFilter2;
      case 'less-than':
        const numValue3 = parseFloat(value);
        const numFilter3 = parseFloat(filter.value);
        return !isNaN(numValue3) && !isNaN(numFilter3) && numValue3 < numFilter3;
      case 'less-than-or-equal-to':
        const numValue4 = parseFloat(value);
        const numFilter4 = parseFloat(filter.value);
        return !isNaN(numValue4) && !isNaN(numFilter4) && numValue4 <= numFilter4;

      // Date operators
      case 'on':
        // Extract date parts from strings more robustly to avoid timezone issues
        const itemDateStr = value.split(' ')[0]; // Get just the date part (2025-09-09)
        const filterDateStr = filter.value.split('T')[0]; // Handle both '2025-09-09' and '2025-09-09T00:00:00'

        // Compare the date strings directly for exact matching
        return itemDateStr === filterDateStr;

      case 'on-or-after':
        // Extract date parts to avoid timezone issues
        const itemDateStr2 = value.split(' ')[0]; // Get just the date part
        const filterDateStr2 = filter.value.split('T')[0];

        // Convert to comparable date objects using local time
        const itemDateAfter = new Date(itemDateStr2 + 'T00:00:00');
        const filterDateAfter = new Date(filterDateStr2 + 'T00:00:00');

        if (isNaN(itemDateAfter.getTime()) || isNaN(filterDateAfter.getTime())) {
          return false;
        }

        return itemDateAfter.getTime() >= filterDateAfter.getTime();

      case 'on-or-before':
        // Extract date parts to avoid timezone issues
        const itemDateStr3 = value.split(' ')[0]; // Get just the date part
        const filterDateStr3 = filter.value.split('T')[0];

        // Convert to comparable date objects using local time
        const itemDateBefore = new Date(itemDateStr3 + 'T00:00:00');
        const filterDateBefore = new Date(filterDateStr3 + 'T00:00:00');

        if (isNaN(itemDateBefore.getTime()) || isNaN(filterDateBefore.getTime())) {
          return false;
        }

        return itemDateBefore.getTime() <= filterDateBefore.getTime();

      case 'today':
        const today = new Date();
        const todayStr = today.getFullYear() + '-' +
                        String(today.getMonth() + 1).padStart(2, '0') + '-' +
                        String(today.getDate()).padStart(2, '0');
        const itemTodayStr = value.split(' ')[0]; // Get just the date part

        return itemTodayStr === todayStr;

      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const itemDate2 = new Date(value);

        // Check if item date is valid
        if (isNaN(itemDate2.getTime())) {
          return false;
        }

        // Compare only the date parts
        return itemDate2.getFullYear() === yesterday.getFullYear() &&
               itemDate2.getMonth() === yesterday.getMonth() &&
               itemDate2.getDate() === yesterday.getDate();

      case 'tomorrow':
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const itemDate3 = new Date(value);

        // Check if item date is valid
        if (isNaN(itemDate3.getTime())) {
          return false;
        }

        // Compare only the date parts
        return itemDate3.getFullYear() === tomorrow.getFullYear() &&
               itemDate3.getMonth() === tomorrow.getMonth() &&
               itemDate3.getDate() === tomorrow.getDate();

      case 'this-week':
        const thisWeekStart = new Date();
        const thisWeekEnd = new Date();
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
        thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
        const weekItemDate = new Date(value);

        // Check if item date is valid
        if (isNaN(weekItemDate.getTime())) {
          return false;
        }

        // Create date-only versions for comparison
        const weekItemDateOnly = new Date(weekItemDate.getFullYear(), weekItemDate.getMonth(), weekItemDate.getDate());
        const weekStartOnly = new Date(thisWeekStart.getFullYear(), thisWeekStart.getMonth(), thisWeekStart.getDate());
        const weekEndOnly = new Date(thisWeekEnd.getFullYear(), thisWeekEnd.getMonth(), thisWeekEnd.getDate());

        return weekItemDateOnly.getTime() >= weekStartOnly.getTime() && weekItemDateOnly.getTime() <= weekEndOnly.getTime();

      case 'this-month':
        const thisMonth = new Date();
        const monthItemDate = new Date(value);

        // Check if item date is valid
        if (isNaN(monthItemDate.getTime())) {
          return false;
        }

        return monthItemDate.getMonth() === thisMonth.getMonth() &&
               monthItemDate.getFullYear() === thisMonth.getFullYear();

      case 'this-year':
        const thisYear = new Date();
        const yearItemDate = new Date(value);

        // Check if item date is valid
        if (isNaN(yearItemDate.getTime())) {
          return false;
        }

        return yearItemDate.getFullYear() === thisYear.getFullYear();

      // Add more date cases as needed
      case 'contains-data-any-time':
        return value.trim() !== '';

      default:
        return true;
    }
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

    // Apply filters
    Object.entries(columnFilters).forEach(([columnId, filter]) => {
      if (filter) {
        result = result.filter(item => {
          const value = String(item[columnId as keyof Item]);
          return applyFilter(value, filter);
        });
      }
    });

    // Apply sorting
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Item];
        const bValue = b[sortColumn as keyof Item];

        const comparison = String(aValue).localeCompare(String(bValue));
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [sortColumn, sortDirection, columnFilters]);

  // Helper to render a header cell with menu functionality
  const renderHeaderWithMenu = (
    columnId: string,
    title: string
  ): React.ReactNode => {
    return (
      <TeachingPopover
        open={filterPopoverOpen === columnId}
        onOpenChange={(_, data) => {
          if (!data.open) {
            setFilterPopoverOpen(null);
            setFilterError('');
          }
        }}
        positioning={{
          position: 'below',
          align: 'start',
          offset: { crossAxis: 0, mainAxis: 12 },
          arrowPadding: 150
        }}
        withArrow={true}
      >
        <TeachingPopoverTrigger>
          <div style={{ display: 'inline-block', width: '100%' }}>
            <Menu
              open={openCol === columnId}
              onOpenChange={(_, data) => {
                console.log('Menu onOpenChange:', data.open, 'columnId:', columnId);
                if (data.open) {
                  setOpenCol(columnId);
                } else {
                  setOpenCol(null);
                }
              }}
            >
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance="subtle"
                  size="medium"
                  style={{
                    padding: '6px',
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                  onClick={() => setOpenCol(openCol === columnId ? null : columnId)}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    columnGap: '6px',
                    width: '100%',
                    fontWeight: 'bold',
                  }}>
                    <span>{title}</span>
                    <span>
                      {columnFilters[columnId] && <FilterRegular style={{ color: '#0078d4' }} />}
                      {sortColumn === columnId && sortDirection === "asc" && <ArrowSortUpRegular />}
                      {sortColumn === columnId && sortDirection === "desc" && <ArrowSortDownRegular />}
                      {(sortColumn !== columnId || !sortDirection) && !columnFilters[columnId] && <span />}
                    </span>
                    <span>
                      <ChevronDownRegular />
                    </span>
                  </span>
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    icon={<ArrowSortUpRegular />}
                    onClick={() => handleColumnAction(columnId, 'sort-asc')}
                    disabled={sortColumn === columnId && sortDirection === 'asc'}
                  >
                    A to Z
                  </MenuItem>
                  <MenuItem
                    icon={<ArrowSortDownRegular />}
                    onClick={() => handleColumnAction(columnId, 'sort-desc')}
                    disabled={sortColumn === columnId && sortDirection === 'desc'}
                  >
                    Z to A
                  </MenuItem>
                  {sortColumn === columnId && sortDirection && (
                    <MenuItem
                      icon={<DismissRegular />}
                      onClick={() => handleColumnAction(columnId, 'clear-sort')}
                    >
                      Clear Sort
                    </MenuItem>
                  )}
                  <MenuDivider />
                  <MenuItem
                    icon={<FilterRegular />}
                    onClick={() => handleColumnAction(columnId, 'filter')}
                  >
                    Filter
                  </MenuItem>
                  {columnFilters[columnId] && (
                    <MenuItem
                      icon={<FilterRegular />}
                      onClick={() => {
                        // Clear the filter for this column
                        setColumnFilters(prev => ({
                          ...prev,
                          [columnId]: null
                        }));
                        setOpenCol(null);
                      }}
                    >
                      Clear Filter
                    </MenuItem>
                  )}
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </TeachingPopoverTrigger>
        <TeachingPopoverSurface>
          <TeachingPopoverHeader icon={null}>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>Filter by</div>
          </TeachingPopoverHeader>
          <TeachingPopoverBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '240px', padding: '8px 0' }}>
              {/* Filter operator section */}
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#323130'
                }}>
                  Filter by operator
                </div>
                <Dropdown
                  placeholder="Select filter type"
                  value={getOperatorDisplayText(filterOperator)}
                  onOptionSelect={(_, data) => {
                    setFilterOperator(data.optionValue as string);
                    setFilterError('');
                  }}
                  style={{ width: '100%' }}
                  className={styles.filterOperatorDropdown}
                  positioning={{
                    position: 'below',
                    align: (() => {
                      // Check if this is the last column (rightmost)
                      const columnIds = ['name', 'committedQty', 'committedCost', 'estimatedQty', 'estimatedCost', 'usedQty', 'usedCost', 'billingAmount', 'lineStatus', 'createdOn'];
                      const currentColumnIndex = columnIds.indexOf(filterPopoverOpen || '');
                      const isLastColumn = currentColumnIndex === columnIds.length - 1;
                      return isLastColumn ? 'end' : 'start';
                    })()
                  }}
                >
                  {isDateColumn(filterPopoverOpen || '') ? (
                    <>
                      <Option value="on">On</Option>
                      <Option value="on-or-after">On or after</Option>
                      <Option value="on-or-before">On or before</Option>
                      <Option value="today">Today</Option>
                      <Option value="yesterday">Yesterday</Option>
                      <Option value="tomorrow">Tomorrow</Option>
                      <Option value="this-week">This week</Option>
                      <Option value="this-month">This month</Option>
                      <Option value="this-year">This year</Option>
                      <Option value="this-fiscal-period">This fiscal period</Option>
                      <Option value="this-fiscal-year">This fiscal year</Option>
                      <Option value="next-week">Next week</Option>
                      <Option value="next-7-days">Next 7 days</Option>
                      <Option value="next-month">Next month</Option>
                      <Option value="next-year">Next year</Option>
                      <Option value="next-fiscal-period">Next fiscal period</Option>
                      <Option value="next-fiscal-year">Next fiscal year</Option>
                      <Option value="last-week">Last week</Option>
                      <Option value="last-7-days">Last 7 days</Option>
                      <Option value="last-month">Last month</Option>
                      <Option value="last-year">Last year</Option>
                      <Option value="last-fiscal-period">Last fiscal period</Option>
                      <Option value="last-fiscal-year">Last fiscal year</Option>
                      <Option value="contains-data-any-time">Contains data (any time)</Option>
                      <Option value="does-not-contain-data">Does not contain data</Option>
                    </>
                  ) : isNumericColumn(filterPopoverOpen || '') ? (
                    <>
                      <Option value="equals">Equals</Option>
                      <Option value="does-not-equal">Does not equal</Option>
                      <Option value="contains-data">Contains data</Option>
                      <Option value="does-not-contain-data">Does not contain data</Option>
                      <Option value="greater-than">Greater than</Option>
                      <Option value="greater-than-or-equal-to">Greater than or equal to</Option>
                      <Option value="less-than">Less than</Option>
                      <Option value="less-than-or-equal-to">Less than or equal to</Option>
                    </>
                  ) : (
                    <>
                      <Option value="equals">Equals</Option>
                      <Option value="does-not-equal">Does not equal</Option>
                      <Option value="contains-data">Contains data</Option>
                      <Option value="does-not-contain-data">Does not contain data</Option>
                      <Option value="contains">Contains</Option>
                      <Option value="does-not-contain">Does not contain</Option>
                      <Option value="begins-with">Begins with</Option>
                      <Option value="does-not-begin-with">Does not begin with</Option>
                      <Option value="ends-with">Ends with</Option>
                      <Option value="does-not-end-with">Does not end with</Option>
                    </>
                  )}
                </Dropdown>
              </div>

              {/* Filter value section - only show if operator requires input */}
              {!shouldHideValueInput(filterOperator) && (
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#323130'
                  }}>
                    Filter by value
                  </div>
                  {requiresDatePicker(filterOperator) ? (
                  <DatePicker
                    placeholder="Select a date"
                    value={filterValue ? new Date(filterValue + 'T00:00:00') : null}
                    onSelectDate={(date) => {
                      setFilterValue(date ? date.toISOString().split('T')[0] : '');
                      setFilterError('');
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        // Validate input for operators that require values
                        if (!shouldHideValueInput(filterOperator) && !filterValue.trim()) {
                          setFilterError('Please enter a value');
                          return;
                        }

                        // Apply the filter (same logic as Apply button)
                        setColumnFilters(prev => ({
                          ...prev,
                          [filterPopoverOpen!]: {
                            operator: filterOperator as FilterOperator,
                            value: filterValue
                          }
                        }));

                        setFilterPopoverOpen(null);
                        setFilterError('');
                      }
                    }}
                    style={{
                      width: '100%',
                      border: filterError ? '2px solid #d13438' : undefined
                    }}
                  />
                ) : requiresNumericInput(filterOperator) ? (
                  <Input
                    type="number"
                    placeholder="Enter number"
                    value={filterValue}
                    onChange={(_, data) => {
                      setFilterValue(data.value);
                      setFilterError('');
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        // Validate input for operators that require values
                        if (!shouldHideValueInput(filterOperator) && !filterValue.trim()) {
                          setFilterError('Please enter a value');
                          return;
                        }

                        // Apply the filter (same logic as Apply button)
                        setColumnFilters(prev => ({
                          ...prev,
                          [filterPopoverOpen!]: {
                            operator: filterOperator as FilterOperator,
                            value: filterValue
                          }
                        }));

                        setFilterPopoverOpen(null);
                        setFilterError('');
                      }
                    }}
                    style={{
                      width: '100%',
                      border: filterError ? '2px solid #d13438' : undefined
                    }}
                  />
                ) : (
                  <Input
                    placeholder=""
                    value={filterValue}
                    onChange={(_, data) => {
                      setFilterValue(data.value);
                      setFilterError('');
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        // Validate input for operators that require values
                        if (!shouldHideValueInput(filterOperator) && !filterValue.trim()) {
                          setFilterError('Please enter a value');
                          return;
                        }

                        // Apply the filter (same logic as Apply button)
                        setColumnFilters(prev => ({
                          ...prev,
                          [filterPopoverOpen!]: {
                            operator: filterOperator as FilterOperator,
                            value: filterValue
                          }
                        }));

                        setFilterPopoverOpen(null);
                        setFilterError('');
                      }
                    }}
                    style={{
                      width: '100%',
                      border: filterError ? '2px solid #d13438' : undefined
                    }}
                  />
                )}
                {filterError && (
                  <div style={{
                    color: '#d13438',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {filterError}
                  </div>
                )}
              </div>
              )}

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}>
                <Button
                  size="large"
                  appearance="primary"
                  shape="square"
                  onClick={() => {
                    // Validate input for operators that require values
                    if (!shouldHideValueInput(filterOperator) && !filterValue.trim()) {
                      setFilterError('Please enter a value');
                      return;
                    }

                    // Apply the filter
                    setColumnFilters(prev => ({
                      ...prev,
                      [columnId]: {
                        operator: filterOperator as FilterOperator,
                        value: filterValue
                      }
                    }));

                    setFilterPopoverOpen(null);
                    setFilterError('');
                  }}
                >
                  Apply
                </Button>
                <Button
                  size="large"
                  appearance="secondary"
                  shape="square"
                  onClick={() => {
                    setFilterValue('');
                    setFilterError('');
                    setFilterPopoverOpen(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </TeachingPopoverBody>
        </TeachingPopoverSurface>
      </TeachingPopover>
    );
  };

  // Define columns inside component so they can access renderHeaderWithMenu
  const columns = [
    createTableColumn<Item>({
      columnId: 'name',
      compare: (a, b) => {
        return a.name.localeCompare(b.name);
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('name', 'Name')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell style={{ minWidth: '150px' }}>{item.name}</DataGridCell>,
    }),
    createTableColumn<Item>({
      columnId: 'committedQty',
      compare: (a, b) => {
        return a.committedQty - b.committedQty;
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('committedQty', 'Committed Qty')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell style={{ minWidth: '150px' }}>{item.committedQty}</DataGridCell>,
    }),
    createTableColumn<Item>({
      columnId: 'committedCost',
      compare: (a, b) => {
        return a.committedCost - b.committedCost;
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('committedCost', 'Committed Cost')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell style={{ minWidth: '150px' }}>{item.committedCost}</DataGridCell>,
    }),
    createTableColumn<Item>({
      columnId: 'estimatedQty',
      compare: (a, b) => {
        return a.estimatedQty - b.estimatedQty;
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('estimatedQty', 'Estimated Qty')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => {
        if (item.estimatedQty === 0) return <DataGridCell style={{ minWidth: '150px' }}>{item.estimatedQty}</DataGridCell>;
        else {
          return <DataGridCell style={{ minWidth: '150px' }}><div>{item.estimatedQty}</div></DataGridCell>;
        }
      },
    }),
    createTableColumn<Item>({
      columnId: 'estimatedCost',
      compare: (a, b) => {
        return a.estimatedCost - b.estimatedCost;
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('estimatedCost', 'Estimated Cost')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell style={{ minWidth: '150px' }}>{item.estimatedCost}</DataGridCell>,
    }),
    createTableColumn<Item>({
      columnId: 'usedQty',
      compare: (a, b) => {
        return a.usedQty - b.usedQty;
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('usedQty', 'Used Qty')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell style={{ minWidth: '150px' }}>{item.usedQty}</DataGridCell>,
    }),
    createTableColumn<Item>({
      columnId: 'usedCost',
      compare: (a, b) => {
        return a.usedCost - b.usedCost;
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('usedCost', 'Used Cost')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell style={{ minWidth: '150px' }}>{item.usedCost}</DataGridCell>,
    }),
    createTableColumn<Item>({
      columnId: 'billingAmount',
      compare: (a, b) => {
        return a.billingAmount - b.billingAmount;
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('billingAmount', 'Billing Amount')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell style={{ minWidth: '150px' }}>{item.billingAmount}</DataGridCell>,
    }),
    createTableColumn<Item>({
      columnId: 'lineStatus',
      compare: (a, b) => {
        return a.lineStatus.localeCompare(b.lineStatus);
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('lineStatus', 'Line Status')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell style={{ minWidth: '150px' }}>{item.lineStatus}</DataGridCell>,
    }),
    createTableColumn<Item>({
      columnId: 'createdOn',
      compare: (a, b) => {
        return a.createdOn.localeCompare(b.createdOn);
      },
      renderHeaderCell: () => (
        <DataGridHeaderCell style={{ minWidth: '150px' }}>
          {renderHeaderWithMenu('createdOn', 'Created On')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell style={{ minWidth: '150px' }}>{item.createdOn}</DataGridCell>,
    }),
  ];

  const toolbarStyle = {
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box' as const,
  };

  function getEstimateQtyStyle(qty: number) {
    if (qty >= 10) {
      return styles.estimateQuantity;
    } else {
      return '';
    }
  }

  const renderRow = React.useMemo<RowRenderer<Item>>(
    () =>
      ({ item, rowId }, style, _, isScrolling) =>
        (
          <DataGridRow<Item> key={rowId} style={style}>
            {({ renderCell, columnId }) => {
              const isEstQtyColumn = columnId === 'estimatedQty';
              const backgroundClass =
                isEstQtyColumn && !isScrolling
                  ? getEstimateQtyStyle(item.estimatedQty)
                  : '';
              return (
                <DataGridCell
                  className={backgroundClass}
                  focusMode="group"
                  style={{ width: '175px' }}
                >
                  {isScrolling ? <CellShimmer /> : renderCell(item)}
                </DataGridCell>
              );
            }}
          </DataGridRow>
        ),
    []
  );

  return (
    <FluentProvider theme={props.currentTheme}>
      <div className={styles.main}>
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
              resizableColumns
              resizableColumnsOptions={{
                autoFitColumns: false,
              }}
              subtleSelection
            >
              <DataGridHeader style={{ paddingRight: scrollbarWidth }}>
                <DataGridRow>
                  {({ renderHeaderCell }) => (
                    <DataGridHeaderCell style={{ minWidth: '175px', height: '50px' }}>
                      {renderHeaderCell()}
                    </DataGridHeaderCell>
                  )}
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
