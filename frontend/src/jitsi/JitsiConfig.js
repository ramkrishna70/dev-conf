import { getVideoHeight } from "../constants/ResolutionLevels";

export const adaptJitsiConfig = (roomId, parentNode, meetingSettings) => {
  const resolution = parseInt(meetingSettings.resolution, 10);

  const config = {
    roomName: `${roomId}-${window.location.hostname}`,
    width: "100%",
    height: "100%",
    parentNode,
    configOverwrite: {
      startWithAudioMuted: !meetingSettings.micEnabled,
      startWithVideoMuted: !meetingSettings.videoEnabled,
      resolution,
      constraints: {
        video: {
          aspectRatio: 16 / 9,
          height: getVideoHeight(resolution)
        }
      },
      testing: {
        // Enables experimental simulcast support on Firefox.
        enableFirefoxSimulcast: meetingSettings.enableFirefoxSimulcast
      }
    },
    interfaceConfigOverwrite: {
      APP_NAME: 'BithostIn Meet',
      SHOW_JITSI_WATERMARK: true,
      SHOW_WATERMARK_FOR_GUESTS: true,
      SHOW_BRAND_WATERMARK: true,
      BRAND_WATERMARK_LINK: "",
      DEFAULT_LOGO_URL: "https://dev-conf.herokuapp.com/images/logo.svg",
      DEFAULT_WELCOME_PAGE_LOGO_URL: "https://dev-conf.herokuapp.com/images/logo.svg",
      JITSI_WATERMARK_LINK: "https://www.bithost.in",
      OPTIMAL_BROWSERS: [ 'chrome', 'chromium', 'firefox', 'nwjs', 'electron', 'safari' ],
      PROVIDER_NAME: "BithostIn",
      SHOW_CHROME_EXTENSION_BANNER: false,
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
      ],

    }
  };

  return config;
};
