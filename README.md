<h1 align="center">#matrix</h1>

<p align="center">Online open-source workplace for distributed teams.</p>

<p align="center">
  <a href="https://codeclimate.com/github/ResultadosDigitais/matrix/maintainability"><img src="https://api.codeclimate.com/v1/badges/a41e6e73f69c94d8b9c5/maintainability" /></a>
  <a href="https://circleci.com/gh/ResultadosDigitais/matrix"><img alt="CircleCI Status" src="https://img.shields.io/circleci/project/github/babel/babel/master.svg?label=CircleCI&maxAge=43200"></a>
</p>

## Welcome to the **#matrix**

The objective of **#matrix** project is to offer a virtual environment office, as nice as physical offices. When we are working in a physical office is very common entering in discussion threads in many different environments, for example: on coffee, on lunch and others.

When we are working remotely there are no conversations like in a physical office. The **#matrix** project was born as a proposal to better that experience. The idea is to create a lot of virtual rooms where people can see and enter these rooms to participate.

**#matrix** produces a virtual office for remote teams. In this project, you can run a virtual office to simulate the physical environment. Read more on [this post in Medium](https://medium.com/rd-shipit/matrix-d4cfc4ad4c75).

![Matrix Home Screenshot](docs/img/matrix-morpheus.png)

## Authentication

The login is so simple. You only need to create a google client id and configure the environment variable `GOOGLE_CREDENTIAL=xxxxxxxxxxx.apps.googleusercontent.com`. Follow [this step by step](/docs/GOOGLE-CREDENTIAL-STEP-BY-STEP.md) to configure your own google client key.

|                                 Login                                 |                                   Login in Dark Mode                                    |
| :-------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: |
| <img src="docs/img/matrix-login.png" title="Login page" width="100%"> | <img src="docs/img/matrix-dark-login.png" title="Login page in Dark Mode" width="100%"> |

## The rooms Inside of #matrix
 
The inside of **#matrix** there are some rooms. In this rooms is possible to see others colleagues and if they are talking or in a meeting in the avatar will appear a head set icon. (eg. In the image the guys in the Platform-Email room are in a meeting)  

|                              Office Page                               |                                     With Sidebar                                     |
| :--------------------------------------------------------------------: | :----------------------------------------------------------------------------------: |
| <img src="docs/img/matrix-rooms.png" title="Office page" width="100%"> | <img src="docs/img/matrix-online.png" title="Office page with Sidebar" width="100%"> |

## The meeting room

You can only enter in a room to show for the other that you are available there through the `ENTER ROOM` button or enter in a meeting through the button `ENTER MEETING`. 

|                                Meeting Room                                |                                          With Sidebar                                           |
| :------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
| <img src="docs/img/matrix-meet-room.png" title="Office page" width="100%"> | <img src="docs/img/matrix-meet-room-sidebar.png" title="Office page with Sidebar" width="100%"> |

## Getting Started

If you want run the **#matrix**, you need follow steps:

1. We are using Google to authorizations, you need create a credential [here](/docs/GOOGLE-CREDENTIAL-STEP-BY-STEP.md) you can follow step by step

2. Run application with docker compose:

		$ docker-compose up

3. Open your browser and access: 

		http://localhost:8080/

4. When you finish, you can run:

		$ docker-compose down
		

## On GCP 
If you prefer, you can run **#matrix** on GCP:

[![Run on Google Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run?git_repo=https://github.com/ResultadosDigitais/matrix&revision=gcp-deploy-button)


## On Heroku
If you prefer, you can run **#matrix** in Heroku: 

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/MelissaSouza/ReuniaoMatrix)


## Environments

The **#matrix** project has some environments that important to define.

1. We are using Google to authorizations, you need create a credential [here](https://developers.google.com/identity/sign-in/web/sign-in) and before define this:

		GOOGLE_CREDENTIAL=${573684003355-suis8cf0h1e0941h2cl75g7o18k559gv.apps.googleusercontent.com}

2. If you are running with ssl It's important to configure SSL, to define this:

		ENFORCE_SSL=true

3. The **#matrix** needs to know, where it get rooms definitions:

		ROOMS_SOURCE=ENVIRONMENT

4. There is a config that define the rooms of The **#matrix**, if you prefer you can generate the unique id per room [here](https://www.uuidgenerator.net), to define this:


		ROOMS_DATA=[
		   {
		      "id":"${UUID}",
		      "name":"Lounge",
		      "disableMeeting":true
		   },
		   {
		      "id":"${UUID}",
		      "name":"WAR ROOM CDP"
		   },
		   {
		      "id":"${UUID}",
		      "name":"Data Services",
			  "externalMeetUrl": "https://external-url-room/key-room"
		   }
		 ]


### External Meet
The default video conferencing in meetings is [Jitsi](https://jitsi.org/jitsi-meet/), but you can change that in any room, using [Meet](https://meet.google.com/) or [Zoom](https://zoom.us/). For that, you just need provide the parameter `externalMeetUrl` in your room config:
```
ROOMS_DATA=[
		   {
		      "id":"${UUID}",
		      "name":"Meeting External",
			  "externalMeetUrl": "https://external-url-room/key-room"
		   }
		 ]
```

# Running in Production
If you will run in production we strongly recomend to you close your environmen using an internal VPN. In this solution everybody with the link and a valid google credential can enter in your virtual office. Because of this is important to you mantain your environment closed. Or you can help us implementing to define a whitelist domains with environment variable. 


# Contributing
We encourage you to contribute to The **#matrix**!

Everyone interacting in **#matrix** codebase, issue trackers, chat rooms, and mailing lists is expected to follow [code of conduct](docs/CODE_OF_CONDUCT.md).


## License
The **#matrix** is released under the [MIT License](docs/LICENSE)

## Demo

https://dev-conf.herokuapp.com/

`"The answer is out there, Neo, and it's looking for you, and it will find you if you want it to."`
