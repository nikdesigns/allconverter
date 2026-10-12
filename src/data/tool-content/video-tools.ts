import type { ToolCopyMap } from "./types";

export const videoToolsCopy: ToolCopyMap = {
  "video-audio-extractor": {
    intro:
      "Video to Audio Extractor pulls the soundtrack out of a video and saves it as MP3, M4A or WAV. Choose the format and, for MP3 and M4A, a bitrate from 128 to 320 kbps. The work is done by FFmpeg, the engine behind most professional video software, running inside your browser.\n\nNothing is uploaded, so it is safe for recorded meetings and personal footage. The engine is a download of about 30 MB the first time you use a video tool and is cached after that. Extraction is usually much faster than the length of the video.",
    steps: [
      ["Drop a video file", "MP4, MOV, WebM, MKV, AVI and most other formats."],
      ["Choose format and bitrate", "MP3 at 192 kbps suits most uses. WAV is lossless and large."],
      ["Extract and download", "Keep the tab open while it runs."],
    ],
    faqs: [
      ["Which format should I choose?", "MP3 plays everywhere. M4A is slightly better quality at the same size and suits Apple devices. WAV is uncompressed, for editing."],
      ["Why does the first run take longer?", "The FFmpeg engine, about 30 MB, has to download once. After that it loads from your browser's cache."],
      ["Why does it say no audio was produced?", "The video has no audio track, or the file is damaged."],
    ],
    uses: [
      "Saving the audio of a recorded lecture or meeting",
      "Pulling a voice track for transcription",
      "Getting music or sound from your own footage",
    ],
  },
  "video-trimmer": {
    intro:
      "Video Trimmer cuts a section out of a longer video. Enter a start and end time and choose one of two methods. Precise re-encodes the selection so the cut lands exactly where you asked and saves a standard MP4 (H.264 video, AAC audio) that plays on any device. Fast copies the original streams without re-encoding: it finishes in seconds and loses no quality, but it can only start at the nearest keyframe, so the cut may be off by a second or two.\n\nBoth methods use FFmpeg running in your browser, and the video is never uploaded.",
    steps: [
      ["Drop a video", "MP4, MOV, WebM, MKV and most other formats."],
      ["Set start and end", "In m:ss format, for example 0:15 to 0:45, and pick Precise or Fast."],
      ["Trim and download", "Precise takes longer on long or high-resolution clips."],
    ],
    faqs: [
      ["Precise or Fast: which should I use?", "Precise when the exact frame matters or you need an MP4. Fast when you want a quick, lossless cut and a second either way does not matter."],
      ["Why does my Fast cut start earlier than I set?", "Video can only be copied from a keyframe, so the cut moves back to the nearest one. Use Precise for an exact start."],
      ["Is quality lost?", "Not with Fast. Precise re-encodes at high quality; the difference is not normally visible."],
    ],
    uses: [
      "Cutting a highlight from a screen recording",
      "Removing dead time from the start and end of a video",
      "Making a short clip to share in chat",
    ],
  },
  "video-compressor": {
    intro:
      "Video Compressor makes a video file smaller by re-encoding it to MP4 with the H.264 codec, the format every phone, browser and messaging app plays. Choose an output resolution, from keeping the original down to 360p, and one of three quality levels. It never enlarges a video: a 720p clip stays 720p even if you select 1080p.\n\nEncoding is done by FFmpeg in your browser, so the video is not uploaded. Phone and screen recordings are stored at very high bitrates and often shrink to a fraction of their size. Encoding is demanding: expect roughly the length of the video for 720p on a modern laptop, longer on phones.",
    steps: [
      ["Drop a video", "The file stays on your device."],
      ["Choose resolution and quality", "720p Balanced is a good default for sharing."],
      ["Compress and download", "Keep the tab open. The result shows how much smaller the file is."],
    ],
    faqs: [
      ["How much smaller will it get?", "It depends on the source. Phone footage commonly shrinks by 60 to 90 percent at 720p Balanced. A file that is already compressed may barely change."],
      ["Which setting should I use for WhatsApp or email?", "480p or 720p on Balanced. Drop to Smallest only if the file is still over the limit."],
      ["Why is it slow?", "Video encoding is heavy work, and it runs on your device instead of a server. Lower resolutions encode much faster."],
      ["Is there a file size limit?", "About 700 MB, because the video has to fit in the browser's memory."],
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
