import * as React from 'react';
import type { ChangeEvent } from 'react';
import { InputGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export default function SearchInput(props: {
  value: string;
  placeHolder?: string;
  onChange: (text: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <InputGroup>
      <InputGroup.Text>
        <span className='icon-search' />
      </InputGroup.Text>
      <Form.Control
        value={props.value}
        placeholder={props.placeHolder ? props.placeHolder : 'ابحث هنا...'}
        onChange={props.onChange}
      />
    </InputGroup>
  )
}