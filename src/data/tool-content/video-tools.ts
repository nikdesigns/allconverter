import type { ToolCopyMap } from "./types";

export const videoToolsCopy: ToolCopyMap = {
  "video-audio-extractor": {
    intro:
      "Video to Audio Extractor pulls the soundtrack out of a video file and saves it as a WebM audio file encoded with Opus. Drop in an MP4, WebM or MOV and the tool plays the video silently in the background while recording its audio track.\n\nBecause it records playback, extraction happens in real time: a five-minute video takes about five minutes. Nothing is uploaded. The output is WebM, not MP3; it plays in browsers and VLC, and can be converted with the audio tools on this site if you need another format.",
    steps: [
      ["Drop a video file", "MP4, WebM, MOV and other formats your browser can play."],
      ["Extract", "Keep the tab open while it runs in real time."],
      ["Download the audio", "Saved as a .webm audio file."],
    ],
    faqs: [
      ["Why does it take as long as the video?", "The browser captures audio as the video plays; it cannot go faster than playback."],
      ["Can I get an MP3?", "The output is WebM Opus. Convert it afterwards if you need MP3."],
      ["Why does it say no audio track was found?", "The video is silent, or uses an audio codec your browser cannot decode."],
    ],
    uses: [
      "Saving the audio of a recorded lecture",
      "Pulling a voice track for transcription",
      "Getting music or sound from your own footage",
    ],
  },
  "video-trimmer": {
    intro:
      "Video Trimmer cuts a clip out of a longer video. Enter a start and end time in minutes and seconds, and the tool plays that section and records it to a new WebM file at the video's own resolution.\n\nThe selected portion is re-encoded in real time in your browser, so a 30-second clip takes about 30 seconds to produce and nothing leaves your device. Output is WebM with VP8 video and Opus audio, which plays in all modern browsers.",
    steps: [
      ["Drop a video", "MP4, WebM or MOV."],
      ["Set start and end", "In m:ss format, for example 0:15 to 0:45."],
      ["Trim and download", "Wait for real-time processing to finish."],
    ],
    faqs: [
      ["Is the output MP4?", "No. Browsers can record to WebM only. Convert afterwards if a platform needs MP4."],
      ["Is quality lost?", "Yes, slightly. The clip is re-encoded, not cut losslessly."],
      ["How long a clip can I make?", "There is no fixed limit, but the tab must stay open for the full length of the clip."],
    ],
    uses: [
      "Cutting a highlight from a screen recording",
      "Removing dead time from the start of a video",
      "Making a short clip to share in chat",
    ],
  },
  "video-compressor": {
    intro:
      "Video Compressor makes a video file smaller by re-recording it at a lower resolution and bitrate. Three presets are offered: 360p at about 0.5 Mbps, 480p at 1 Mbps and 720p at 2.5 Mbps.\n\nThe video is drawn frame by frame and encoded in your browser as it plays, so compression runs in real time and the file is never uploaded. Output is WebM. Expect large savings on phone and screen recordings, which are usually stored at very high bitrates.",
    steps: [
      ["Drop a video", "The file stays on your device."],
      ["Choose a resolution", "Lower means smaller."],
      ["Compress and download", "Processing takes as long as the video lasts."],
    ],
    faqs: [
      ["How much smaller will the file be?", "Roughly bitrate times duration: one minute is about 4 MB at 360p, 8 MB at 480p and 19 MB at 720p."],
      ["Why is the output WebM?", "It is the format browsers can encode natively."],
      ["Can I compress a long video?", "Yes, but it takes the full running time and the tab must remain open and visible."],
    ],
    uses: [
      "Getting a clip under an email or chat size limit",
      "Shrinking a screen recording before sharing",
      "Reducing upload time on a slow connection",
    ],
  },
  "mp4-to-gif": {
    intro:
      "MP4 to GIF Converter turns a short section of a video into an animated GIF. Choose the start time, a duration of up to 10 seconds, the frame rate and the output width; the tool shows how many frames that will produce before you convert.\n\nFrames are captured in your browser and encoded with an optimised 256-colour palette. GIF is an inefficient format, so file size grows quickly: keep clips short, around 10 frames per second and 480 pixels wide for a result that is easy to share.",
    steps: [
      ["Drop a video clip", "MP4, WebM or MOV."],
      ["Set start, duration, FPS and width", "Watch the estimated frame count."],
      ["Convert and download", "The GIF is built on your device."],
    ],
    faqs: [
      ["Why is there a 10-second limit?", "GIFs become very large very quickly; longer clips are better shared as video."],
      ["How do I make the GIF smaller?", "Lower the width first, then the frame rate, then the duration."],
      ["Does the GIF have sound?", "No. The GIF format cannot carry audio."],
    ],
    uses: [
      "Showing a bug or UI interaction in an issue tracker",
      "Making a reaction GIF from your own footage",
      "Adding a short demo to documentation or a README",
    ],
  },
  "video-thumbnail": {
    intro:
      "Video Thumbnail Extractor saves a single frame of a video as a PNG image. Load a video, enter the time you want in minutes and seconds, and the frame at that moment is captured at the video's full resolution and downloaded.\n\nYou can seek to another time and capture again as often as you like. Everything is done with the browser's own video decoder, so the file is not uploaded and there is no quality loss beyond the video's own compression.",
    steps: [
      ["Drop a video", "MP4, WebM, MOV and other playable formats."],
      ["Enter a timestamp", "For example 1:23."],
      ["Capture", "The PNG downloads automatically."],
    ],
    faqs: [
      ["What resolution is the image?", "The same as the video's native resolution."],
      ["Why is the captured frame slightly off?", "Browsers seek to the nearest decodable frame, which can differ by a fraction of a second."],
      ["Can I export JPG?", "Frames are saved as PNG. Convert with an image tool if you need JPG."],
    ],
    uses: [
      "Creating a cover image for a video upload",
      "Grabbing a still for a presentation",
      "Capturing a frame as evidence or reference",
    ],
  },
  "screen-recorder": {
    intro:
      "Screen Recorder captures your whole screen, one application window or a single browser tab, using the browser's built-in screen-sharing feature. You can optionally add your microphone so your voice is recorded with the picture.\n\nPress Start, choose what to share in the browser prompt, and press Stop when you are finished. The recording is held in your browser and downloaded as a WebM file; nothing is uploaded. It works in Chrome, Edge and Firefox on desktop. Safari and mobile browsers are not supported.",
    steps: [
      ["Choose whether to include the microphone", "Tick the option before starting."],
      ["Start and pick a source", "Screen, window or tab."],
      ["Stop and download", "Save the WebM file."],
    ],
    faqs: [
      ["Can it record system sound?", "Chrome and Edge can include tab audio, and on Windows system audio, when you tick the share-audio box in the prompt."],
      ["Is there a time limit?", "No, but the recording is held in memory, so very long sessions can exhaust it."],
      ["How do I get an MP4?", "The file is WebM. Convert it with a video converter if a platform requires MP4."],
    ],
    uses: [
      "Recording a bug to send to a developer",
      "Making a quick how-to for a colleague",
      "Capturing a presentation with narration",
    ],
  },
};
