import React from "react";
import { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { IUser } from "../../../../universal/model";
import { UserRole } from "../../../../universal/enums";
import { Offcanvas, Nav } from "react-bootstrap";
import StudentExamItem from "../../components/StudentExamItem";
import UserGeneralInfoCard from "../../components/UserGeneralInfoCard";
import EmptyPageMessage from "../../components/EmptyPageMessage";

export default function Profile() {
  const user = useTracker(() => Meteor.user() as IUser)
  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const handleShowCanvas = () => {
    setShowCanvas(!showCanvas)
  }
  if(!user) {
    return <EmptyPageMessage />
  }
  const {exams} = user.profile;
  return (
    <>
      <div className="mt-3">
        <div className="row">
          <div className="col left-canvas" style={{paddingLeft: '0'}}>
            <div className="left-canvas-wrapper">
              <Offcanvas show={showCanvas} onHide={handleShowCanvas} responsive="md" scroll>
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title style={{flex: '1'}}>
                    معلومات عامة
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body style={{paddingRight: '0'}}>
                  <UserGeneralInfoCard user={user} isInCanvas/>
                </Offcanvas.Body>
              </Offcanvas>
            </div>
          </div>
          <div className="col" style={{paddingRight: '0'}}>
            <Nav variant="tabs" defaultActiveKey='exams'>
              <Nav.Item>
                <Nav.Link className="canvas-button" onClick={handleShowCanvas}>المعلومات العامة</Nav.Link>
              </Nav.Item>
              {user.profile.role === UserRole.isStudent && (
                <Nav.Item>
                  <Nav.Link eventKey='exams'>الإمتحانات</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            <ul className="exams-list">
            { exams && exams.length > 0 ? (
              exams.map(exam => 
                <StudentExamItem key={exam.examId} exam={exam}/>
              )
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '30px',
                  color: '#777',
                  marginTop: '100px'
                }}
              >
                لم تقم بتقديم أي إمتحانات
              </div>
            )}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
