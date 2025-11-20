import React from 'react';
import type { FC } from 'react';

import { ACTION_TYPES } from '../../../constants';
import { ChipRenderer } from '../utils/ChipRenderer';

const COLUMNS = [
  {
    action: ACTION_TYPES['1ST_COLUMN'],
    label: '2 a 1'
  },
  {
    action: ACTION_TYPES['2ND_COLUMN'],
    label: '2 a 1'
  },
  {
    action: ACTION_TYPES['3RD_COLUMN'],
    label: '2 a 1'
  },
]

export const Columns: FC = () => {

  return (
    <>
      {COLUMNS.map(x => (
        <ChipRenderer
          cName='column-item'
          action={x.action}
          highlight={x.action}
          betLabel={x.label}
          chipPosition='center'
          key={x.action}
        />
      ))}
    </>
  );
};
