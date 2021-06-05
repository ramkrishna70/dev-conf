import "bootstrap/dist/css/bootstrap.css";
import "./office.css";

import { init as sentryInit } from "@sentry/browser";
import MatrixProfile from "./profile";
import OfficeEvents from "./office-events";
import renderHeader from "./header";

import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/modal";

import "./context-menu/context-menu";
import "./initialize/jquery.initialize";

$(() => {
  sentryInit({
    dsn: "https://fdd252e52a934accafa0242e906dc254@o435014.ingest.sentry.io/5392750",
  });

  renderHeader();

  const matrixProfile = new MatrixProfile();

  if (matrixProfile.isProfileStored()) {
    initOffice(matrixProfile);
  } else {
    redirectToHome();
  }

  function removeUser(userId) {
    $(`#${userId}`).remove();
  }

  function showUserInRoom(user, room) {
    let userView = $(`#${user.id}`);

    if (userView.length) {
      userView.detach();
    } else {
      userView = $(
        `<div id="${
          user.id
        }" class="thumbnail user-room rounded-circle" user-presence><img class="rounded-circle" style="margin:2px;display:flex;" user-id="${
          user.id
        }" title="${user.name}" width="50px" src="${decodeURIComponent(user.imageUrl)}"></div>`,
      );
    }

    userInRoomDecorator(user, room);
    userInMeetDecorator(user, userView);

    $(`#${room}`).append(userView);
  }

  function initGetUserMenu(officeEvents) {
    $.initialize("[user-presence]", function () {
      $(this).contextMenu({
        menuSelector: "#getUserMenu",
        menuSelected(invokedOn) {
          const userId = $(invokedOn).attr("user-id");
          const roomId = getLastRoom(matrixProfile);
          officeEvents.callUserForMyRoom(userId, roomId);
        },
      });
    });
  }

  function userInMeetDecorator(user, userView) {
    const userInMeet = user.inMeet === true;

    if (userInMeet) {
      userView.attr("title", user.name);
    }

    userView.toggleClass("user-in-call", userInMeet);
    userView.toggleClass("user-not-in-call", !userInMeet);
  }

  function userInRoomDecorator(user, room) {
    if (user.id === matrixProfile.loadStoredProfile().id) {
      setDefaultRoomStyles();
      const roomElement = $(`#room_card-${room}`);
      roomElement.attr("class", "card active-room");

      const btnElement = $(`#room_btn_enter-${room}`);
      btnElement.attr("class", "card-link btn-enter-in-room-active float-left");

      const roomTitle = $(`#room_card_title-${room}`);
      roomTitle.attr("class", "room-title-active float-left");
    }
  }

  function setDefaultRoomStyles() {
    const oldRoom = $(".active-room");
    if (oldRoom.length > 0) {
      oldRoom.attr("class", "card room");
    }

    let btnEnterInRoom;

    btnEnterInRoom = $(".btn-enter-in-room-active");
    if (btnEnterInRoom.length > 0) {
      btnEnterInRoom.attr("class", "card-link btn-enter-in-room float-left");
    }

    btnEnterInRoom = $(".room-title-active");
    if (btnEnterInRoom.length > 0) {
      btnEnterInRoom.attr("class", "room-title float-left");
    }
  }

  function redirectToHome() {
    window.location.href = "./";
  }

  function getMeetingOptions(roomId) {
    return {
      roomName: `${roomId}-${window.location.hostname}`,
      width: "100%",
      height: "100%",
      parentNode: document.querySelector("#meet"),
      configOverwrite: {
                    resolution: 180,
                    constraints: {
                        video: {
                            aspectRatio: 16 / 9,
                            height: {
                                ideal: 180,
                                max: 180,
                                min: 180
                            }
                        }
                    },
                 },
      interfaceConfigOverwrite: {
        APP_NAME: "BithostIn",
        BRAND_WATERMARK_LINK: "https://www.bithost.in",
        DEFAULT_LOGO_URL: "https://dev-conf.herokuapp.com/images/logo.svg",
        DEFAULT_WELCOME_PAGE_LOGO_URL: "https://dev-conf.herokuapp.com/images/logo.svg",
        ENABLE_DIAL_OUT: true,
        PROVIDER_NAME: "BithostIn",
        SETTINGS_SECTIONS: [ 'devices', 'language', 'moderator', 'profile', 'calendar' ],
        SHOW_BRAND_WATERMARK: true,
        SHOW_JITSI_WATERMARK: false,
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
        ],
        VIDEO_LAYOUT_FIT: 'both',
        filmStripOnly: false,
      },
    };
  }

  function isUserInVideoConference() {
    const dataModal = $("#meetModal").data("bs.modal");

    if (dataModal) {
      return dataModal._isShown;
    }

    return false;
  }

  function startJitsiMeet(roomId){
      console.log("startJitsiMeet");
      const domain = "meet.jit.si";
      const options = getMeetingOptions(roomId);
      const api = new JitsiMeetExternalAPI(domain, options);
      console.log("############## Start Jeetsi meet ################");
      console.log(api);
      
      api.executeCommand("displayName", matrixProfile.loadStoredProfile().name);
      api.executeCommand(
        "avatarUrl",
        matrixProfile.loadStoredProfile().imageUrl,
      );
      api.addEventListener('participantRoleChanged', function (event) {
        if(event.role === 'moderator') {
          api.executeCommand('toggleLobby', true);
          console.log("@@@@@@@@@@@ My Custom Run @@@@@@@@@@@@");
        }
        console.log("@@@@@@@@@@@ My Custom Run1 @@@@@@@@@@@@");
      });
      
      return {
        dispose:function(){
          api.dispose();
        }
      }

  }

  function startExternalMeet(externalMeetURL){
      const externalMeetFrame = $("#externalMeeting");
      externalMeetFrame.attr("src",externalMeetURL+"&userName="+matrixProfile.loadStoredProfile().name);
      externalMeetFrame.show();

      return {
        dispose:function(){
          externalMeetFrame.attr("src","");
          externalMeetFrame.hide();
        }
      }
  }

  function startVideoConference(roomId, name, officeEvents) {
    setTimeout(() => {
      const meetModal = $("#meetModal");

      meetModal.modal("hide");
      meetModal.modal("dispose");
    
      var meet = null;
      const externalMeetURL = getExternalMeetUrl(roomId);
      console.log(externalMeetURL);
      if(externalMeetURL!=""){
        meet = startExternalMeet(externalMeetURL);
      }else{
        meet = startJitsiMeet(roomId);
      }
      officeEvents.startMeet();

      meetModal.modal("show");
      meetModal.on("hidden.bs.modal", () => {
        officeEvents.leftMeet();
        meet.dispose();
      });

      meetModal.on("shown.bs.modal", function () {
        $(this)
          .find(".modal-title")
          .text(name);
      });
    }, 300);
  }

  function notifyRoomEnter(user, roomId) {
    const options = {
      icon: user.imageUrl,
    };

    const loggedUserId = matrixProfile.loadStoredProfile().id;
    const loggedUserRoomId = getLastRoom(matrixProfile);

    if (loggedUserRoomId === roomId && loggedUserId !== user.id) {
      const roomTitle = getRoomName(roomId);
      notify(`${user.name} entered into the room ${roomTitle}`, options);
    }
  }

  function notify(text, options) {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    } else {
      new Notification(text, options);
    }
  }

  function getRoomName(roomId) {
    return $(`[room-id="${roomId}"]`).attr("room-name");
  }

  function getExternalMeetUrl(roomId) {
    return $(`[room-id="${roomId}"]`).attr("external-meet-url");
  }

  function getLastRoom(matrixProfile) {
    let lastRoom = getUrlRoom();

    if (!isValidRoom(lastRoom)) {
      lastRoom = matrixProfile.loadStoredRoom();

      if (!isValidRoom(lastRoom)) {
        lastRoom = getDefaultRoom();
      }
    }

    console.log("lastRoom", lastRoom);

    return lastRoom;
  }

  function isValidRoom(room) {
    return !(room === null || room === undefined || room === "undefined");
  }

  function getDefaultRoom() {
    return $($("[enter-room]")[0]).attr("room-id");
  }

  function getUrlRoom() {
    const currentRoom = location.hash;

    if (currentRoom === null || currentRoom === undefined) {
      return null;
    }
    return currentRoom.split("#")[1];
  }

  function syncOffice(usersInRoom) {
    for (const key in usersInRoom) {
      const userInRoom = usersInRoom[key];
      showUserInRoom(userInRoom.user, userInRoom.room);
    }
  }

  function confirmRoomEnter(user, roomId, officeEvents) {
    const options = {
      icon: user.imageUrl,
    };

    const text = `${user.name} is calling you to join in ${getRoomName(
      roomId,
    )}`;
    notify(text, options);
    setTimeout(() => {
      const isConfirmed = confirm(text);
      if (isConfirmed) {
        officeEvents.enterInRoom(roomId);
        startVideoConference(roomId, getRoomName(roomId), officeEvents);
      }
    }, 300);
  }

  function initEnterRoomButton(officeEvents) {
    const enterRoom = $("[enter-room]");
    enterRoom.on("click", (e) => {
      const roomId = $(e.target).attr("room-id");
      const disableMeeting = new Boolean(
        $(e.target).attr("room-disable-meeting")=="true",
      );

      officeEvents.enterInRoom(roomId);
      matrixProfile.storeRoom(roomId);

      if (disableMeeting == true) return;

      startVideoConference(roomId, getRoomName(roomId), officeEvents);
    });
  }

  function initOffice(matrixProfile) {
    const domain = `${window.location.protocol}//${window.location.host}`;
    const currentUser = matrixProfile.loadStoredProfile();

    const officeEvents = new OfficeEvents({
      domain,
      currentUser,
      currentRoom: getLastRoom(matrixProfile),
    });

    initEnterRoomButton(officeEvents);
    initGetUserMenu(officeEvents);

    officeEvents.onParticipantStartedMeet(showUserInRoom);
    officeEvents.onParticipantLeftMeet(showUserInRoom);
    officeEvents.onDisconnect(removeUser);

    officeEvents.onParticipantJoined((user, roomId) => {
      showUserInRoom(user, roomId);
      notifyRoomEnter(user, roomId);
    });

    officeEvents.onSyncOffice((usersInRoom) => {
      syncOffice(usersInRoom);
      if (isUserInVideoConference()) {
        officeEvents.startMeet();
      }
    });

    officeEvents.onParticipantIsCalled((user, roomId) => {
      confirmRoomEnter(user, roomId, officeEvents);
    });
  }
});

window.onload = function () {
  gapi.load("auth2", () => {
    gapi.auth2.init();
  });
};
