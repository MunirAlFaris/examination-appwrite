import * as React from "react";
import type { ChangeEvent } from "react";
import type { IChatUser, IRecusiveChat, IUser } from "../../../universal/model";
import { useState, useMemo } from "react";
import { ChatTypeEnum, UserRole } from "../../../universal/enums";
import {
  formatDateByHourAndPeriod,
  getUserImgSrc,
} from "../../ui_helpers/utils";
import { Form, InputGroup } from "react-bootstrap";
import UserImg from "./UserImg";
import MultiSelect from "./MultiSelect";
import clsx from "clsx";

export default function ChatInfo(props: {
  chat: IRecusiveChat;
  users: IChatUser[];
  user: IUser;
  handleShowChatInfo: () => void;
  userIsAdmin?: boolean;
}) {
  const [propmtType, setPromptType] = useState<
    "DESC" | "NAME" | "MEBMER" | false
  >(false);
  const userIsOwner =
    props.user._id === props.chat.createdBy ||
    props.user.profile.role === UserRole.isAdmin
    || props.userIsAdmin;
  const { time, period } = formatDateByHourAndPeriod(props.chat.createdAt);
  const ChatUsers =
    props.users && props.chat.accessList
      ? props.users.filter(
          (x) =>
            x._id !== props.user._id && props.chat.accessList?.includes(x._id)
        )
      : undefined;
  const usersSelectOptions = useMemo(() => {
    const fillteredUsers = props.users.filter(
      (x) => {
        if(props.chat.type === ChatTypeEnum.private) {
          return x._id !== props.user._id && !props.chat.accessList?.includes(x._id)
        } else if(props.chat.type === ChatTypeEnum.specificClass) {
          return x._id !== props.user._id && !props.chat.accessList?.includes(x._id)
          && x.profile.role === UserRole.isTeacher
        } else {
          return x._id !== props.user._id && (
            props.chat.accessList ? !props.chat.accessList.includes(x._id)
            : true
          )
        }
      }
    );
    return fillteredUsers.map((user) => {
      return {
        label: user.username,
        value: user._id,
        role: user.profile.role,
        img: getUserImgSrc(user.profile.role, user.profile.gender),
      };
    });
  }, [props.users]);
  const handleSetPromptType = (type: "DESC" | "NAME" | "MEBMER" | false) => {
    setPromptType(type);
  };
  const handleUpdateDesc = (text: string) => {
    Meteor.call("editChatInfo", props.chat._id, { description: text });
    setPromptType(false);
  };
  const handleUpdateName = (text: string) => {
    if (text.trim() !== "") {
      Meteor.call("editChatInfo", props.chat._id, { name: text });
    }
    setPromptType(false);
  };
  const toggleAllowMessage = (e: ChangeEvent<HTMLInputElement>) => {
    Meteor.call("toggleAllowMessage", props.chat._id, !!e.target.checked);
  };
  const toggleAddRemoveAdmin = (userId: string) => {
    if(props.chat.adminsList) {
      if(props.chat.adminsList.includes(userId)) {
        Meteor.call(
          'updateChatAdmin',
          props.chat._id,
          userId,
          'REMOVE',
        )
      } else {
        Meteor.call(
          'updateChatAdmin',
          props.chat._id,
          userId,
          'ADD',
        )
      }
    } else {
      Meteor.call(
        'updateChatAdmin',
        props.chat._id,
        userId,
        'ADD',
      )
    }
  }
  const userInAdminList = (userId: string) => {
    return (
      props.chat.adminsList ?
      props.chat.adminsList.includes(userId)
      : false
    )
  }
  return (
    <div className="chat-info-container">
      <div className="chat-info-sticky-header">
        <span className="icon-close mx-3" onClick={props.handleShowChatInfo} />
        <h2>معلومات المحادثة</h2>
      </div>
      <div style={{overflow: 'auto', maxHeight: '100%'}}>
        <div className="chat-info-header chat-info-card">
          <img src={props.chat.imgSrc} alt="chat-image" />
          {propmtType !== "NAME" ? (
            <h3 className="my-2">
              {props.chat.name}
              {userIsOwner && (
                <button
                  className="icon-pencil tool-button info-icon-color"
                  style={{
                    display: "inline-block",
                    marginLeft: "-20px",
                  }}
                  onClick={() => handleSetPromptType("NAME")}
                />
              )}
            </h3>
          ) : (
            <div style={{width: '100%'}}>
              <PromptForText
                defaultText={props.chat.name}
                onSave={handleUpdateName}
                centered
              />
            </div>
          )}
          {props.chat.type === ChatTypeEnum.private && props.chat.accessList && (
            <span>{`محادثة - ${props.chat.accessList.length} أعضاء`}</span>
          )}
        </div>
        <div className="chat-info-card">
          <div>
            <span>
              {propmtType !== "DESC" ? (
                <>
                  {props.chat.description
                    ? props.chat.description
                    : userIsOwner && (
                        <span
                          className="info-icon-color"
                          style={{ cursor: "pointer" }}
                        >
                          Add chat description
                        </span>
                      )}
                  {userIsOwner && (
                    <button
                      className="icon-pencil tool-button info-icon-color"
                      style={{ display: "inline-block" }}
                      onClick={() => handleSetPromptType("DESC")}
                    />
                  )}
                </>
              ) : (
                <PromptForText
                  defaultText={
                    props.chat.description ? props.chat.description : ""
                  }
                  onSave={handleUpdateDesc}
                />
              )}
            </span>
          </div>
          <span className="mt-3">{`أنشأ المحادثة ${
            props.chat.creatorName
          }، بتاريخ ${props.chat.createdAt.toLocaleDateString()} في ${time} ${period}`}</span>
          {userIsOwner && (
            <Form.Check
              className="mt-3"
              type="switch"
              id="allow-check"
              checked={props.chat.allowMessages}
              label="السماح للمستخدمين بارسال الرسائل"
              onChange={toggleAllowMessage}
            />
          )}
        </div>
        {(ChatUsers || userIsOwner) && (
          <div className="chat-info-card">
            {props.chat.accessList && (
              <div>{`${props.chat.accessList.length} ${props.chat.type === ChatTypeEnum.private ? 'أعضاء' : 'مشرفين'}`}</div>
            )}
            {propmtType !== "MEBMER" && userIsOwner ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: '10px',
                  padding: "10px",
                  cursor: "pointer",
                }}
                onClick={() => handleSetPromptType("MEBMER")}
              >
                <span className="icon-user-plus chat-member-image" />
                {props.chat.type === ChatTypeEnum.private
                  ? "إضافة أعضاء"
                  : props.chat.type === ChatTypeEnum.public ?
                  'إضافة مشرفين'
                  : "إضافة أساتذة"}
              </div>
            ) : (
              userIsOwner && (
                <AddMebmer
                  options={usersSelectOptions}
                  chatId={props.chat._id}
                  onHide={() => setPromptType(false)}
                  addAdmins={props.chat.type === ChatTypeEnum.public}
                />
              )
            )}
            <div className="user-item">
              <div className="flex-center-g10">
                <UserImg
                  userRole={props.user.profile.role}
                  userGender={props.user.profile.gender}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                  }}
                />
                <div className="d-flex">
                  أنت
                  {(userInAdminList(props.user._id) || props.user.profile.role === UserRole.isAdmin) && (
                    <div className="user-admin-label mx-3">مشرف</div>
                  )}
                </div>
              </div>
            </div>
            {ChatUsers && (
              <div>
                {ChatUsers.map((user) => (
                  <div
                    key={user._id}
                    className={clsx({
                      "user-item": true,
                      hover: userIsOwner,
                    })}
                  >
                    <div className="flex-center-g10">
                      <UserImg
                        userRole={user.profile.role}
                        userGender={user.profile.gender}
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: "50%",
                        }}
                      />
                      <div className="d-flex">
                        {user.username}
                        {userInAdminList(user._id) && (
                          <div className="user-admin-label mx-3">مشرف</div>
                        )}
                      </div>
                    </div>
                    {userIsOwner && user.profile.role !== UserRole.isAdmin && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          className={clsx({
                            "tool-button": true,
                            'icon-star-o': !userInAdminList(user._id),
                            'icon-star': userInAdminList(user._id)
                          })}
                          style={{ color: "yellow" }}
                          onClick={() => toggleAddRemoveAdmin(user._id)}
                        />
                        <span
                          className="icon-close tool-button"
                          style={{ color: "#aebac1" }}
                          onClick={() => {
                            Meteor.call(
                              "removeUserFromChat",
                              props.chat._id,
                              user._id
                            );
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PromptForText(props: {
  defaultText: string;
  onSave: (text: string) => void;
  centered?: boolean;
}) {
  const [text, setText] = React.useState<string>(props.defaultText);
  return (
    <InputGroup className="prompt-input-wrapper" style={{flexWrap: 'nowrap', justifyContent: props.centered ? 'center' : 'start'}}>
      <input
        style={{maxWidth: '100%'}}
        className="prompt-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <InputGroup.Text
        className="propmt-btn"
        onClick={() => props.onSave(text)}
      >
        <span className="icon-check"></span>
      </InputGroup.Text>
    </InputGroup>
  );
}

function AddMebmer(props: {
  options: any[];
  chatId: string;
  onHide: () => void;
  addAdmins?: boolean;
}) {
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const onSave = () => {
    if (selectedUsers.length !== 0) {
      console.log('there is usrs')
      if(props.addAdmins) {
        Meteor.call(
          'updateChatAdmin',
          props.chatId,
          selectedUsers[0].value,
          'ADD'
        )
      } else {
        Meteor.call(
          "addUsersToChat",
          props.chatId,
          selectedUsers.map((x) => x.value),
          (error: Meteor.Error) => {
            if(error) console.log(error)
            else console.log('added')
          }
        );
      }
    }
    props.onHide();
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: "10px",
      }}
    >
      <div style={{ flex: "1" }}>
        <MultiSelect
          options={props.options}
          value={selectedUsers}
          onChange={(e) => setSelectedUsers(props.addAdmins ? [e[e.length - 1]] : e)}
          isForUsers
        />
      </div>
      <span
        className="icon-close tool-button"
        style={{ color: "#aebac1" }}
        onClick={props.onHide}
      />
      <span
        className="icon-check tool-button info-icon-color"
        style={{ fontSize: "30px" }}
        onClick={onSave}
      />
    </div>
  );
}
