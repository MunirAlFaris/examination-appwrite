import * as React from 'react';
import type { ChangeEvent } from 'react';
import type { IMultiSelectOption } from '../../../universal/model';
import { InputGroup, Form } from 'react-bootstrap';

export default function FilterButton(props: {
  value: string;
  onSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: IMultiSelectOption[];
}) {
  return (
    <InputGroup style={{width: 'fit-content', height: 'fit-content'}}>
      <InputGroup.Text>
        <span className='icon-filter' />
      </InputGroup.Text>
      <Form.Select
        value={props.value}
        onChange={props.onSelect}
      >
        {props.options.map(op => 
          <option key={op.value} value={op.value}>{op.label}</option>
        )}
      </Form.Select>
    </InputGroup>
  )
}