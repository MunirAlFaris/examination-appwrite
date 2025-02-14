import * as React from 'react';
import type { IUser } from '../../../universal/model';
import { EditingOptionsEnum } from '../../../universal/enums';
import { Modal } from 'react-bootstrap';
import UserForm from '../pages/users/UserForm';

export default function AddEditUserModal(props: {
  show: boolean;
  onHide: () => void;
  user?: IUser;
  type?: EditingOptionsEnum | false;
}) {
  return (
    <Modal show={props.show} onHide={props.onHide} fullscreen={'sm-down'}>
      <Modal.Header closeButton>
        <Modal.Title style={{flex: '1'}}>
          {props.type === EditingOptionsEnum.Add ? 
            'إضافة مستخدم'
            : props.type === EditingOptionsEnum.Edit ?
            'تعديل المستخدم' : ''
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UserForm
          {...(
            props.user ?
            {
              isForEidt: true,
              userData: props.user
            } : {}
          )}
          onUpdate={props.onHide}
        />
      </Modal.Body>
    </Modal>
  )
}