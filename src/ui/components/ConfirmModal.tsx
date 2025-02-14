import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { Alert, Modal } from 'react-bootstrap';

export default function ConfirmModal(props: {
  show: boolean,
  onHide: () => void,
  onConfirm: () => void,
  title: string,
  description: string,
  hasAlert?: boolean,
  alertVariant?: string,
  alertMassage?: string,
  hasShadow?: boolean,
  modalSize?: 'sm' | 'lg' | 'xl' | 'md'
  modalClassName?: string,
  backdropClassName?: string,
}) {
  return(
    <Modal
      show={props.show}
      onHide={props.onHide}
      size={props.modalSize ? props.modalSize : 'lg'}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName={props.hasShadow ? 'modal-shadow' : ''}
      {...(props.modalClassName ? {className: props.modalClassName} : {})}
      {...(props.backdropClassName ? {backdropClassName: props.backdropClassName} : {})}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{flex: '1'}}>
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{paddingBottom: '5px'}}>{props.description}</div>
        {props.hasAlert &&(
          <Alert style={{padding: '8px', margin: '0'}} variant={props.alertVariant}>{props.alertMassage}</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant='secondary'>
          أغلق
        </Button>
        <Button onClick={props.onConfirm} variant='success'>
          نعم
        </Button>
      </Modal.Footer>
    </Modal>
  )
}