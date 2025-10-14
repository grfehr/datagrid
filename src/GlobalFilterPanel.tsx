import * as React from 'react';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Dropdown, Option, Input, Button, tokens } from '@fluentui/react-components';

// Types reused from example2 (consider moving to a shared types file if reused elsewhere)
export type FilterOperator =
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
  | 'on'
  | 'on-or-after'
  | 'on-or-before'
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'this-week'
  | 'this-month'
  | 'this-year'
  | 'next-week'
  | 'next-month'
  | 'next-year'
  | 'last-week'
  | 'last-month'
  | 'last-year'
  | 'contains-data-any-time';

export interface FilterCondition { operator: FilterOperator; value: string; }

export interface GlobalFilterPanelProps {
  openColumnId: string | null;
  anchorRect: DOMRect | null;
  setOpenColumnId: (id: string | null) => void;
  columnFilters: Record<string, FilterCondition | null>;
  setColumnFilters: React.Dispatch<React.SetStateAction<Record<string, FilterCondition | null>>>;
  isDateColumn: (id: string) => boolean;
  isNumericColumn: (id: string) => boolean;
  getOperatorDisplayText: (op: string) => string;
  requiresDatePicker: (op: string) => boolean;
  requiresNumericInput: (op: string) => boolean;
  shouldHideValueInput: (op: string) => boolean;
}

export const GlobalFilterPanel: React.FC<GlobalFilterPanelProps> = ({
  openColumnId: filterPopoverOpen,
  anchorRect: filterAnchor,
  setOpenColumnId: setFilterPopoverOpen,
  columnFilters,
  setColumnFilters,
  isDateColumn,
  isNumericColumn,
  getOperatorDisplayText,
  requiresDatePicker,
  requiresNumericInput,
  shouldHideValueInput,
}) => {
  const [filterOperator, setFilterOperator] = React.useState<string>('equals');
  const [filterValue, setFilterValue] = React.useState('');
  const [filterError, setFilterError] = React.useState('');
  const valueInputRef = React.useRef<HTMLInputElement | HTMLDivElement | null>(null);

  // Derive column context (safe defaults when closed)
  const columnId = filterPopoverOpen ?? '';
  const columnIds = React.useMemo(
    () => ['name', 'committedQty', 'committedCost', 'estimatedQty', 'estimatedCost', 'usedQty', 'usedCost', 'billingAmount', 'lineStatus', 'createdOn'],
    []
  );
  const currentColumnIndex = columnIds.indexOf(columnId);
  const isLastColumn = currentColumnIndex === columnIds.length - 1;

  React.useEffect(() => {
    if (filterPopoverOpen) {
      const currentFilter = columnFilters[filterPopoverOpen];
      if (currentFilter) {
        setFilterOperator(currentFilter.operator);
        setFilterValue(currentFilter.value);
      } else {
        setFilterOperator(isDateColumn(filterPopoverOpen) ? 'on' : 'equals');
        setFilterValue('');
      }
      setFilterError('');
    }
  }, [filterPopoverOpen, columnFilters, isDateColumn]);

  React.useEffect(() => {
    if (filterPopoverOpen && !shouldHideValueInput(filterOperator) && valueInputRef.current) {
      const el = (valueInputRef.current as HTMLElement).querySelector?.('input') as HTMLInputElement | null;
      (el ?? (valueInputRef.current as HTMLInputElement | null))?.focus();
      (el ?? (valueInputRef.current as HTMLInputElement | null))?.setSelectionRange?.(filterValue.length, filterValue.length);
    }
  }, [filterPopoverOpen, filterOperator, filterValue, shouldHideValueInput]);

  const commitFilter = React.useCallback(() => {
    if (!shouldHideValueInput(filterOperator) && !filterValue.trim()) {
      setFilterError('Please enter a value');
      return;
    }
    if (!columnId) return; // safety
    setColumnFilters(prev => ({ ...prev, [columnId]: { operator: filterOperator as FilterOperator, value: filterValue } }));
    setFilterPopoverOpen(null);
    setFilterError('');
  }, [columnId, filterOperator, filterValue, shouldHideValueInput, setColumnFilters, setFilterPopoverOpen]);

  const onKeyDownRoot: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitFilter();
    } else if (e.key === 'Escape') {
      setFilterPopoverOpen(null);
    }
  };

  if (!filterPopoverOpen || !filterAnchor) return null;

  return (
    <div onKeyDown={onKeyDownRoot} style={{ position: 'fixed', top: filterAnchor.bottom + 4, left: isLastColumn ? undefined : filterAnchor.left, right: isLastColumn ? (window.innerWidth - filterAnchor.right) : undefined, zIndex: 3000, background: '#fff', border: `1px solid ${tokens.colorNeutralStroke1}`, boxShadow: tokens.shadow16, borderRadius: 4, padding: 12, minWidth: 260 }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Filter by</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 240 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#323130' }}>Filter by operator</div>
          <Dropdown
            placeholder="Select filter type"
            value={getOperatorDisplayText(filterOperator)}
            onOptionSelect={(_, data) => {
              setFilterOperator(data.optionValue as string);
              setFilterError('');
            }}
            style={{ width: '100%' }}
            listbox={{ className: 'filter-operator-dropdown-listbox' }}
            positioning={{ position: 'below', align: isLastColumn ? 'end' : 'start' }}
          >
            {isDateColumn(columnId) ? (
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
                <Option value="next-week">Next week</Option>
                <Option value="next-month">Next month</Option>
                <Option value="next-year">Next year</Option>
                <Option value="last-week">Last week</Option>
                <Option value="last-month">Last month</Option>
                <Option value="last-year">Last year</Option>
                <Option value="contains-data-any-time">Contains data (any time)</Option>
                <Option value="does-not-contain-data">Does not contain data</Option>
              </>
            ) : isNumericColumn(columnId) ? (
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
        {!shouldHideValueInput(filterOperator) && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#323130' }}>Filter by value</div>
            {requiresDatePicker(filterOperator) ? (
              <DatePicker
                ref={valueInputRef as any}
                placeholder="Select a date"
                value={filterValue ? new Date(filterValue + 'T00:00:00') : null}
                onSelectDate={(date) => {
                  setFilterValue(date ? date.toISOString().split('T')[0] : '');
                  setFilterError('');
                }}
                style={{ width: '100%', border: filterError ? '2px solid #d13438' : undefined }}
              />
            ) : requiresNumericInput(filterOperator) ? (
              <Input
                type="number"
                placeholder="Enter number"
                value={filterValue}
                onChange={(_, data) => { setFilterValue(data.value); setFilterError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitFilter(); } }}
                ref={valueInputRef as any}
                style={{ width: '100%', border: filterError ? '2px solid #d13438' : undefined }}
              />
            ) : (
              <Input
                placeholder=""
                value={filterValue}
                onChange={(_, data) => { setFilterValue(data.value); setFilterError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitFilter(); } }}
                ref={valueInputRef as any}
                style={{ width: '100%', border: filterError ? '2px solid #d13438' : undefined }}
              />
            )}
            {filterError && <div style={{ color: '#d13438', fontSize: 12, marginTop: 4 }}>{filterError}</div>}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button size="large" appearance="primary" shape="square" onClick={commitFilter}>Apply</Button>
          <Button size="large" appearance="secondary" shape="square" onClick={() => { setFilterValue(''); setFilterError(''); setFilterPopoverOpen(null); }}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};
