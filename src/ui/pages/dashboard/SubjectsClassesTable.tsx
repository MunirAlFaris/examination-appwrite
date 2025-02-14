import { Meteor } from "meteor/meteor";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useSettingsContext } from "../../../ui_helpers/contexts";
import { EditingOptionsEnum, SettingsEnum } from "../../../../universal/enums";
import { useTracker } from "meteor/react-meteor-data";
import { IRecusiveSetting, ISetting, IUser } from "../../../../universal/model";
import { showToast } from "../../../ui_helpers/utils";
import ConfirmModal from "../../components/ConfirmModal";

export default function SubjectsPostsTable(props: {
}) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<EditingOptionsEnum | false>();
  const [selectedSetting, setSelectedSetting] = useState<IRecusiveSetting | undefined>(undefined);
  const settings = useSettingsContext();
  const classes = settings.filter(x => x.type === SettingsEnum.Class);
  const subjects = settings.filter(x => x.type === SettingsEnum.Subject)
  const handleShowModal = (type: EditingOptionsEnum, selectedSetting?: IRecusiveSetting) => {
    setShowModal(true);
    setModalType(type)
    setSelectedSetting(selectedSetting);
  }
  const handleHideModal = () => {
    setShowModal(false);
    setModalType(false)
    setSelectedSetting(undefined);
  }
  const handleDeleteSetting = () => {
    if(!selectedSetting) return
    Meteor.call(
      'removeSettings',
      selectedSetting._id,
      (error: Meteor.Error) => {
        if(error) showToast('error', 'لم نتمكن من حذف المدخل');
        else {
          showToast('success', 'تم حذف المدخل بنجاح');
          handleHideModal();
        }
      }
    )
  }
  return (
    <div>
      <Button
        className="mt-2"
        variant="primary"
        onClick={() => handleShowModal(EditingOptionsEnum.Add)}
      >
        إضافة صف/مادة
      </Button>
      <div className="settings-table-container">
        <div className="mt-3 table-container">
          <Table bordered striped hover>
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th scope="col">اسم المادة</th>
                <th scope="col">المنشئ</th>
                <th scope="col">ID المنشئ</th>
                <th scope="col">خيارات</th>
              </tr>
            </thead>
            <tbody>
              { subjects.length > 0 && subjects.map((subject, index) =>
                <tr key={subject._id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-ell">{subject.name}</td>
                  <td>{subject.creatorName}</td>
                  <td>{subject.createdBy}</td>
                  <td style={{display: 'flex'}}>
                    <button
                      className='tool-button'
                      onClick={() => handleShowModal(EditingOptionsEnum.Edit, subject)}
                    >
                      <span className='icon-pencil'/>
                    </button>
                    <button
                      className='tool-button'
                      style={{color: 'tomato'}}
                      onClick={() => handleShowModal(EditingOptionsEnum.Remove, subject)}
                    >
                      <span className='icon-trash-o'/>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className="mt-3 table-container">
          <Table bordered striped hover>
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th scope="col">الصف</th>
                <th scope="col">المنشئ</th>
                <th scope="col">ID المنشئ</th>
                <th scope="col">خيارات</th>
              </tr>
            </thead>
            <tbody>
              { classes.length > 0 && classes.map((classe, index) =>
                <tr key={classe._id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-ell">{classe.name}</td>
                  <td>{classe.creatorName}</td>
                  <td>{classe.createdBy}</td>
                  <td style={{display: 'flex'}}>
                    <button
                      className='tool-button'
                      onClick={() => handleShowModal(EditingOptionsEnum.Edit, classe)}
                    >
                      <span className='icon-pencil'/>
                    </button>
                    <button
                      className='tool-button'
                      style={{color: 'tomato'}}
                      onClick={() => handleShowModal(EditingOptionsEnum.Remove, classe)}
                    >
                      <span className='icon-trash-o'/>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <ConfirmModal
        show={showModal && modalType === EditingOptionsEnum.Remove}
        onHide={handleHideModal}
        title="حذف مدخل"
        description="هل أنت متأكد من حذف المدخل ؟"
        onConfirm={handleDeleteSetting}
      />
      <AddSettingsModal
        show={showModal && modalType !== EditingOptionsEnum.Remove}
        onHide={handleHideModal}
        {...(
          modalType === EditingOptionsEnum.Edit && selectedSetting ?
          {
            isForEdit: true,
            setting: selectedSetting,
          } : {}
        )}
      />
    </div>
  )
}

function AddSettingsModal(props: {
  show: boolean;
  onHide: () => void;
  isForEdit?: boolean;
  setting?: IRecusiveSetting;
}) {
  const user = useTracker(() => Meteor.user()) as IUser;
  const [type, setType] = useState<SettingsEnum | undefined>(undefined);
  const [text, setText] = useState<string>('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!user || text.length === 0 || !type) return
    const setting: ISetting = {
      name: text,
      createdBy: user._id,
      creatorName: user.username,
      type: type,
    }
    if(props.setting && props.isForEdit) {
      Meteor.call(
        'editSettings',
        props.setting._id,
        type,
        text,
        (error: Meteor.Error) => {
          if(error) showToast('error', 'لم يتم تعديل المدخل');
          else {
            showToast('success', 'تم تعديل المدخل بنجاح');
            setType(undefined);
            setText('');
          }
        }
      )
    } else {
      Meteor.call(
        'addSettings',
        setting,
        (error: Meteor.Error) => {
          if(error) showToast('error', 'لم تتم إضافة المدخل');
          else {
            showToast('success', 'تمت الإضافة بنجاح');
            setType(undefined);
            setText('');
          }
        }
      )
    }
  }
  useEffect(() => {
    if(!props.isForEdit || !props.setting) return
    setText(props.setting?.name)
    setType(props.setting?.type)
  }, [props.isForEdit, props.setting])
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ flex: '1'}}>
          {`${props.isForEdit ? 'تعديل' : 'إضافة'} صف/مادة`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Label>أختر النوع:</Form.Label>
          <Form.Group className="d-flex flex-wrap gap-2">
            <Form.Check
              id="sub"
              type="radio"
              name="type"
              label='صف'
              checked={type === SettingsEnum.Class}
              onChange={() => setType(SettingsEnum.Class)}
            />
            <Form.Check
              id="cla"
              type="radio"
              name="type"
              label='مادة'
              checked={type === SettingsEnum.Subject}
              onChange={() => setType(SettingsEnum.Subject)}
            />
          </Form.Group>
          <Form.Group controlId="name" className="mt-3">
            <Form.Label>
              {`اسم ${type === SettingsEnum.Subject ? 'المادة' : 'الصف'}:`}
            </Form.Label>
            <Form.Control
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="mt-3"
            type="submit"
          >
            {props.isForEdit ? 'تعديل' : 'أصف'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
