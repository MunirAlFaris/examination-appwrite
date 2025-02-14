import * as React from 'react';
import { Dropdown } from 'react-bootstrap';

export default function ToolsMenu(props: {
  removeFloating?: boolean,
  handleEditQuestion: () => void,
  handleDeleteQuestion: () => void,
}) {
  return(
    <Dropdown>
      <Dropdown.Toggle
        className='tool-button'
        style={{
          backgroundColor: 'transparent',
          color: 'transparent',
          ...(!props.removeFloating ? {position: 'absolute'} : {}),
          right: '0',
          top: '0'
        }}
      >
        <span className='icon-pencil' style={{color: 'lightgreen'}}/>
      </Dropdown.Toggle>
      <Dropdown.Menu as={'ul'}>
        <Dropdown.Item as={'li'} className='cursor-pointer' onClick={props.handleEditQuestion}>
          تعديل
        </Dropdown.Item>
        <Dropdown.Item as={'li'} className='cursor-pointer' onClick={props.handleDeleteQuestion}>
          حذف
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}