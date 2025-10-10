import * as React from 'react';
import {
  // DataGrid,
  // DataGridBody,
  // DataGridHeader,
  // DataGridHeaderCell,
  // DataGridRow,
  // DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  makeStyles,
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
  ArrowSortUpRegular,
  ArrowSortDownRegular,
  ChevronDownRegular,
  FilterRegular,
  DismissRegular,
} from '@fluentui/react-icons';

// ---------- Styles (optional) ----------
const useStyles = makeStyles({
  headerButton: {
    ...shorthands.padding('6px'),
    width: '100%',
    justifyContent: 'flex-start',
  },
  headerCell: {
    // make header look clickable
    cursor: 'pointer',
  },
  headerContent: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: '6px',
    width: '100%',
    fontWeight: 'bold',
  },
  filterContainer: {
    ...shorthands.padding('12px'),
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '280px',
  },
  filterActions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
  },
  filterTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  errorText: {
    color: '#d13438',
    fontSize: '12px',
    marginTop: '4px',
  },
});

// ---------- Types & mock data ----------

type Person = {
  id: number;
  first: string;
  last: string;
  role: string;
};

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
  | 'does-not-contain-data';

type FilterCondition = {
  operator: FilterOperator;
  value: string;
};

type ColumnFilters = Record<string, FilterCondition | null>;

const rows: Person[] = [
  { id: 1, first: 'Ada', last: 'Lovelace', role: 'Mathematician' },
  { id: 2, first: 'Grace', last: 'Hopper', role: 'Computer Scientist' },
  { id: 3, first: 'Alan', last: 'Turing', role: 'Researcher' },
];



// ---------- Component ----------

export default function DataGridHeaderMenuDemo() {
  const classes = useStyles();

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
        setFilterOperator('equals');
        setFilterValue('');
      }
      setFilterError('');
    }
  }, [filterPopoverOpen, columnFilters]);

  // Persist sort and filter state to localStorage
  React.useEffect(() => {
    const savedSort = localStorage.getItem('dataGridSort');
    const savedFilters = localStorage.getItem('dataGridFilters');

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
      localStorage.setItem('dataGridSort', JSON.stringify({
        column: sortColumn,
        direction: sortDirection
      }));
    } else {
      localStorage.removeItem('dataGridSort');
    }
  }, [sortColumn, sortDirection]);

  // Save filter state when it changes
  React.useEffect(() => {
    localStorage.setItem('dataGridFilters', JSON.stringify(columnFilters));
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
      default:
        return true;
    }
  };



  // Filter and sort the data
  const filteredAndSortedRows = React.useMemo(() => {
    let result = [...rows];

    // Apply filters
    Object.entries(columnFilters).forEach(([columnId, filter]) => {
      if (filter) {
        result = result.filter(row => {
          const value = String(row[columnId as keyof Person]);
          return applyFilter(value, filter);
        });
      }
    });

    // Apply sorting
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Person];
        const bValue = b[sortColumn as keyof Person];

        const comparison = String(aValue).localeCompare(String(bValue));
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [sortColumn, sortDirection, columnFilters]);



  // Helper to render a header cell whose whole header is a menu trigger
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
        {/*
          Use disableButtonEnhancement so non-Button triggers are OK.
          Here we still use Button to get Fluent visuals & focus styles.
        */}
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            size="small"
            // icon={<ChevronDownRegular />}
            // iconPosition="after"
            className={classes.headerButton}
            onClick={() => setOpenCol(openCol === columnId ? null : columnId)}
          >
            <span className={classes.headerContent}>
              <span>{title}</span>
                <span>
                  {sortColumn === columnId && sortDirection === "asc" && <ArrowSortUpRegular />}
                  {sortColumn === columnId && sortDirection === "desc" && <ArrowSortDownRegular />}
                  {columnFilters[columnId] && <FilterRegular style={{ color: '#0078d4' }} />}
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
          <TeachingPopoverHeader>
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
                  value={filterOperator === 'equals' ? 'Equals' :
                        filterOperator === 'contains' ? 'Contains' :
                        filterOperator === 'does-not-equal' ? 'Does not equal' :
                        filterOperator === 'begins-with' ? 'Begins with' :
                        filterOperator === 'ends-with' ? 'Ends with' : 'Contains'}
                  onOptionSelect={(_, data) => {
                    setFilterOperator(data.optionValue as string);
                    setFilterError('');
                  }}
                  style={{ width: '100%' }}
                >
                  <Option value="equals">Equals</Option>
                  <Option value="does-not-equal">Does not equal</Option>
                  <Option value="contains">Contains</Option>
                  <Option value="does-not-contain">Does not contain</Option>
                  <Option value="begins-with">Begins with</Option>
                  <Option value="does-not-begin-with">Does not begin with</Option>
                  <Option value="ends-with">Ends with</Option>
                  <Option value="does-not-end-with">Does not end with</Option>
                  <Option value="contains-data">Contains data</Option>
                  <Option value="does-not-contain-data">Does not contain data</Option>
                </Dropdown>
              </div>

              {/* Filter value section */}
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#323130'
                }}>
                  Filter by value
                </div>
                <Input
                  placeholder=""
                  value={filterValue}
                  onChange={(_, data) => {
                    setFilterValue(data.value);
                    setFilterError('');
                  }}
                  style={{
                    width: '100%',
                    border: filterError ? '2px solid #d13438' : undefined
                  }}
                />
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

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}>
                {/* Clear Filter - only show if filter exists */}
                {columnFilters[columnId] && (
                  <Button
                    size="large"
                    appearance="secondary"
                    shape="square"
                    onClick={() => {
                      // Clear the filter for this column
                      setColumnFilters(prev => ({
                        ...prev,
                        [columnId]: null
                      }));
                      setFilterValue('');
                      setFilterError('');
                      setFilterPopoverOpen(null);
                    }}
                  >
                    Clear Filter
                  </Button>
                )}
                <Button
                  size="large"
                  appearance="primary"
                  shape="square"
                  onClick={() => {
                    // Validate input for operators that require values
                    const needsValue = !['contains-data', 'does-not-contain-data'].includes(filterOperator);
                    if (needsValue && !filterValue.trim()) {
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

  const columns: TableColumnDefinition<Person>[] = [
    createTableColumn<Person>({
      columnId: 'first',
      renderHeaderCell: () => (
        <DataGridHeaderCell
          className={classes.headerCell}
          style={{ minWidth: '275px' }}
        >
          {renderHeaderWithMenu('first', 'First name')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell>{item.first}</DataGridCell>,
    }),
    createTableColumn<Person>({
      columnId: 'last',
      renderHeaderCell: () => (
        <DataGridHeaderCell
          className={classes.headerCell}
          style={{ minWidth: '275px' }}
        >
          {renderHeaderWithMenu('last', 'Last name')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell>{item.last}</DataGridCell>,
    }),
    createTableColumn<Person>({
      columnId: 'role',
      renderHeaderCell: () => (
        <DataGridHeaderCell
          className={classes.headerCell}
          style={{ minWidth: '275px' }}
        >
          {renderHeaderWithMenu('role', 'Role')}
        </DataGridHeaderCell>
      ),
      renderCell: (item) => <DataGridCell>{item.role}</DataGridCell>,
    }),
  ];

  const renderRow = React.useMemo<RowRenderer<Person>>(
    () =>
      ({ item, rowId }, style) =>
        (
          <DataGridRow<Person> key={rowId} style={style}>
            {({ renderCell }) => (
              <DataGridCell focusMode="group" style={{ minWidth: '275px' }}>
                {renderCell(item)}
              </DataGridCell>
            )}
          </DataGridRow>
        ),
    []
  );

  // const gridProps: DataGridProps<Person> = {
  //   items: rows,
  //   columns,
  // };

  return (
    <div style={{ maxWidth: 1640 }}>
      <DataGrid items={filteredAndSortedRows} columns={columns}>
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => renderHeaderCell()}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<Person> itemSize={50} height={500}>
          {renderRow}
          {/* {({ item }) => (
            <DataGridRow<Person>>
              <DataGridCell>{item.first}</DataGridCell>
              <DataGridCell>{item.last}</DataGridCell>
              <DataGridCell>{item.role}</DataGridCell>
            </DataGridRow>
          )} */}
        </DataGridBody>
      </DataGrid>


    </div>
  );
}
