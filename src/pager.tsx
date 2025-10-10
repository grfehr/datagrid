import * as React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  TableColumnDefinition,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  makeStyles,
  Label,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import type { DropdownProps } from '@fluentui/react-components';

import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { RxPinLeft, RxPinRight } from 'react-icons/rx';

const useStyles = makeStyles({
  toolbar: {
    justifyContent: 'space-between',
    borderTop: '1px solid grey',
  },
  dropdownbox: {
    // width: '80px',
    minWidth: '110px',
  },
});

export type Person = {
  id: string;
  name: string;
  role: string;
  location: string;
};

const columns: TableColumnDefinition<Person>[] = [
  {
    columnId: 'name',
    compare: (a, b) => {
      return a.name.localeCompare(b.name);
    },
    renderHeaderCell: () => 'Name',
    renderCell: (item) => item.name,
  },
  {
    columnId: 'role',
    compare: (a, b) => {
      return a.role.localeCompare(b.role);
    },
    renderHeaderCell: () => 'Role',
    renderCell: (item) => item.role,
  },
  {
    columnId: 'location',
    compare: (a, b) => {
      return a.location.localeCompare(b.location);
    },
    renderHeaderCell: () => 'Location',
    renderCell: (item) => item.location,
  },
];

export default function PeopleGrid({
  rows,
  props,
}: {
  rows: Person[];
  props: Partial<DropdownProps>;
}) {
  const styles = useStyles();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedOptions, setSelectedOptions] = React.useState(['1']);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = React.useMemo(
    () => rows.slice(start, end),
    [rows, start, end]
  );

  const pageArray = Array(pageCount)
    .fill(0)
    .map((_, i) => {
      return i + 1;
    });

  // keep page in bounds if data or pageSize changes
  React.useEffect(() => {
    if (page > pageCount) setPage(pageCount);
    if (page < 1) setPage(1);
  }, [page, pageCount]);

  const onOptionSelect: (typeof props)['onOptionSelect'] = (ev, data) => {
    setPage(Number(data.optionValue));
    setSelectedOptions(data.selectedOptions);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* DataGrid receives only the current page of items */}
      <DataGrid
        items={pageItems}
        columns={columns}
        getRowId={(item) => item.id} // helpful if you also do selection/sorting
        sortable
        selectionMode="single"
        focusMode="cell"
        resizableColumns={false}
        resizableColumnsOptions={{
          autoFitColumns: false,
        }}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<Person>>
          {({ item }) => (
            <DataGridRow<Person>>
              {({ renderCell }) => (
                <DataGridCell style={{ width: '200px' }}>
                  {renderCell(item)}
                </DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <Toolbar className={styles.toolbar}>
        <ToolbarGroup>
          <div>
            <Label>{`${start + 1}-${Math.min(end, rows.length)} of ${
              rows.length
            }`}</Label>
          </div>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => setPage(1)}
            disabled={page === 1}
            aria-label="First page"
            icon={<RxPinLeft />}
            appearance="transparent"
          />
          <ToolbarButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            icon={<BsArrowLeftShort />}
            appearance="transparent"
          />
          <Label>Page {page}</Label>
          <ToolbarButton
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            aria-label="Next page"
            icon={<BsArrowRightShort />}
            appearance="transparent"
          />
          <ToolbarButton
            onClick={() => setPage(pageCount)}
            disabled={page === pageCount}
            aria-label="Last page"
            icon={<RxPinRight />}
            appearance="transparent"
          />
        </ToolbarGroup>
      </Toolbar>
      <Toolbar className={styles.toolbar}>
        <ToolbarGroup>
          <div>
            <Label>{`${start + 1}-${Math.min(end, rows.length)} of ${
              rows.length
            }`}</Label>
          </div>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => setPage(1)}
            disabled={page === 1}
            aria-label="First page"
            icon={<RxPinLeft />}
            appearance="transparent"
          />
          <ToolbarButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            icon={<BsArrowLeftShort />}
            appearance="transparent"
          />
          {pageCount === 1 ? (
            <Label>Page 1</Label>
          ) : (
            <Dropdown
              id={'dropdownPageSelector'}
              appearance="filled-darker"
              value={`Page ${page.toString()}`}
              defaultValue={`Page ${page.toString()}`}
              selectedOptions={selectedOptions}
              onOptionSelect={onOptionSelect}
              className={styles.dropdownbox}
              positioning="below-start"
            >
              {pageArray.map((option) => (
                <Option
                  key={option}
                  value={option.toString()}
                  text={`Page ${option.toString()}`}
                >
                  {`Page ${option}`}
                </Option>
              ))}
            </Dropdown>
          )}
          <ToolbarButton
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            aria-label="Next page"
            icon={<BsArrowRightShort />}
            appearance="transparent"
          />
          <ToolbarButton
            onClick={() => setPage(pageCount)}
            disabled={page === pageCount}
            aria-label="Last page"
            icon={<RxPinRight />}
            appearance="transparent"
          />
        </ToolbarGroup>
      </Toolbar>
    </div>
  );
}
