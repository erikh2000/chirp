# Chirp

*Chirp* is a tool for voice actors (VAs) and people that receive and use speech recordings from VAs. It's meant to greatly reduce time around editing for both parties, and facilitate automated workflows where speech recordings are matched up neatly to asset files used in games, visual novels, and other multimedia projects.

## Core Features

* Works as a "prompter" to present a script for VA to read.
* VA can review their speech recording and exclude takes they don't like.
* A delivery file is generated that includes selected takes in a well-organized sequence.

## Additional Features

* See just the lines in script belonging to one selected character.
* Scripts of the standard Fountain format are supported. (https://fountain.io)
* Recording is handled separately by whatever DAW/recorder the VA normally uses. (Chirp doesn't record audio itself.)
* VA can pause and unpause during recording to mark non-performance audio that will be excluded.
* Automatic trimming of silence from takes.
* Marker files for Audacity, Reaper, and Adobe Audition are generated automatically. 
* No installation required. Runs entirely from a web browser.
* Completely private and safe to use. (See "Security" section below.)

## Security

I am morally opposed to harvesting personal information without your consent. More than that - I don't even like when the consent is tucked neatly away inside of a privacy policy that a user will never read.

Chirp is used as a tool for creating recordings that can be precious to their creators. I want you to have confidence that data stays on your device/computer and doesn't go anyplace else.

So this software is completely open source. And after you've loaded it into your browser, it runs completely local. Meaning, once you see Chirp open in your browser, you could turn off your Internet connection and it would work without issue.

The open source release of the software means somebody else could use this source to create their own evil fork of Chirp that has no privacy guarantees. To avoid problems with that, I offer two suggestions:

* Just use the version of Chirp hosted from the Seespace Labs website. (TODO--add link)

...or...

* Run Chirp locally from your computer. (See "Running Chirp Locally")

## Running Chirp Locally

1. `git clone git@github.com:erikh2000/chirp.git`
2. `cd chirp` Change to the Chirp folder created in Step 1.
3. `npm install`
4. `npm start`
5. If there weren't any problems reported in any of the steps above, browse to http://localhost:3000

This should give you a personally-hosted Chirp server.

## Reporting Bugs / Requesting Features

Use the "Issues" feature of Github for that. I can't promise I'll get to things in a hurry, but I do appreciate your help in making Chirp better.

## Contributing Pull Requests

I am interested in collaborating with others, but I want to take a little care so that we don't waste each others time.

If you've got a small bugfix or minor update (e.g. <10 lines of code), a PR is fine. But otherwise, it's probably best to propose the change in advance of sending it.

Chirp's UI and featureset are carefully chosen to keep the tool simple to use with uncluttered, tablet-friendly UI. Even an obviously good feature likely needs some discussion.

## Who is Plundy?

Plundy is a big, talking bird and the mascot of Chirp. He first appeared in _The Godkiller: Chapter 1_ game also created by Seespace Labs. This game contained over 2 hours of finished audio from 40 voice actors. Chirp was inspired by the need to put a lot of speech audio into an indie game efficiently.
