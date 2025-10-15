import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  Button,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@fluentui/react-components';
import {
  ArrowSortUpRegular,
  ArrowSortDownRegular,
  ChevronDownRegular,
  DismissRegular,
  ArrowLeftRegular,
  ArrowRightRegular,
} from '@fluentui/react-icons';
import { TbFilter as TbFilterIcon, TbFilterMinus as TbFilterMinusIcon } from 'react-icons/tb';

// Wrappers to ensure proper JSX.Element return type under current TS/React versions
const FilterIcon: React.FC<{ color?: string; size?: number }> = ({ color, size = 16 }) => (
  <span style={{ lineHeight: 0, display: 'inline-flex' }}>
    <TbFilterIcon size={size as any} color={color} />
  </span>
);
const FilterMinusIcon: React.FC<{ color?: string; size?: number }> = ({ color, size = 16 }) => (
  <span style={{ lineHeight: 0, display: 'inline-flex' }}>
    <TbFilterMinusIcon size={size as any} color={color} />
  </span>
);

interface HeaderCellProps {
  columnId: string;
  title: string;
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  columnFilters: Record<string, any>;
  handleColumnAction: (columnId: string, action: string) => void;
  setColumnFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  tokens: any;
}

export const HeaderCell: React.FC<HeaderCellProps> = ({
  columnId,
  title,
  columnOrder,
  setColumnOrder,
  sortColumn,
  sortDirection,
  columnFilters,
  handleColumnAction,
  setColumnFilters,
  tokens,
}) => {
  const idx = columnOrder.indexOf(columnId);
  const canMoveLeft = idx > 0;
  const canMoveRight = idx < columnOrder.length - 1;
  const moveColumn = (dir: -1 | 1) => {
    const newOrder = [...columnOrder];
    const swapIdx = idx + dir;
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    setColumnOrder(newOrder);
  };
  return (
    <div data-column-id={columnId} style={{ width: '100%', height: '100%', display: 'flex' }}>
      <Menu positioning={{ position: 'below', align: 'start' }}>
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            size="medium"
            style={{ padding: '6px', width: '100%', height: '100%', justifyContent: 'flex-start', display: 'flex' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', width: '100%', fontWeight: 'bold', gap: 8, justifyContent: 'flex-start' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span>{title}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: tokens.colorNeutralForeground1 }}>
                {sortColumn === columnId && sortDirection === 'asc' && <ArrowSortUpRegular aria-label="Sorted ascending" />}
                {sortColumn === columnId && sortDirection === 'desc' && <ArrowSortDownRegular aria-label="Sorted descending" />}
                {columnFilters[columnId] && <FilterIcon color={tokens.colorPaletteBlueForeground2} />}
                {!(sortColumn === columnId && sortDirection) && !columnFilters[columnId] && (
                  <span style={{ width: 16, height: 16, display: 'inline-block' }} />
                )}
                <ChevronDownRegular />
              </span>
            </span>
          </Button>
        </MenuTrigger>
        <MenuPopover style={{ zIndex: 1000, background: 'rgba(255,255,255,0.95)' }}>
          <MenuList>
            <MenuItem icon={<ArrowSortUpRegular />} onClick={() => handleColumnAction(columnId, 'sort-asc')} disabled={sortColumn === columnId && sortDirection === 'asc'}>A to Z</MenuItem>
            <MenuItem icon={<ArrowSortDownRegular />} onClick={() => handleColumnAction(columnId, 'sort-desc')} disabled={sortColumn === columnId && sortDirection === 'desc'}>Z to A</MenuItem>
            {sortColumn === columnId && sortDirection && (
              <MenuItem icon={<DismissRegular />} onClick={() => handleColumnAction(columnId, 'clear-sort')}>Clear Sort</MenuItem>
            )}
            <MenuDivider />
            <MenuItem icon={<FilterIcon />} onClick={() => handleColumnAction(columnId, 'filter')}>Filter</MenuItem>
            {columnFilters[columnId] && (
              <MenuItem
                icon={<FilterMinusIcon />}
                onClick={() => {
                  setColumnFilters(prev => ({ ...prev, [columnId]: null }));
                }}
              >
                Clear Filter
              </MenuItem>
            )}
            <MenuDivider />
            {canMoveLeft && (
              <MenuItem icon={<ArrowLeftRegular />} onClick={() => moveColumn(-1)}>Move Left</MenuItem>
            )}
            {canMoveRight && (
              <MenuItem icon={<ArrowRightRegular />} onClick={() => moveColumn(1)}>Move Right</MenuItem>
            )}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
