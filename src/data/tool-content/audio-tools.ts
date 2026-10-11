import type { ToolCopyMap } from "./types";

export const audioToolsCopy: ToolCopyMap = {
  "mp3-cutter": {
    intro:
      "MP3 Cutter trims an audio file down to the section you want. Load an MP3, WAV, M4A or OGG file, set the start and end times to a tenth of a second, and press Preview to hear exactly what will be kept before you commit.\n\nThe file is decoded and cut in your browser, so nothing is uploaded. The trimmed clip is saved as a WAV file. WAV is uncompressed, which means no further quality is lost in the cut, but the file will be larger than an MP3 of the same length.",
    steps: [
      ["Load an audio file", "Drop it in or browse."],
      ["Set start and end times", "Use Preview to check the selection."],
      ["Cut and download", "The clip is saved as WAV."],
    ],
    faqs: [
      ["Why is the output WAV and not MP3?", "Browsers can decode MP3 but have no built-in MP3 encoder. WAV keeps full quality."],
      ["Why is the cut file bigger than I expected?", "WAV is uncompressed, about 10 MB per minute of stereo audio."],
      ["Can I cut out the middle and keep both ends?", "Not in one pass. Cut each part separately, then merge them with the Audio Joiner."],
    ],
    uses: [
      "Making a ringtone from a song you own",
      "Trimming silence from the start of a recording",
      "Extracting one answer from a long interview",
    ],
  },
  "audio-joiner": {
    intro:
      "Audio Joiner merges several audio files into one continuous track. Add two or more MP3, WAV, M4A or OGG files, arrange them with the move up and move down buttons, and the tool plays them end to end into a single file.\n\nFiles are decoded and combined in your browser without uploading. The result is downloaded as joined_audio.wav. Tracks are joined back to back with no crossfade or gap, so trim any silence beforehand if you want tight transitions.",
    steps: [
      ["Add audio files", "Select several at once or add more later."],
      ["Put them in order", "Use the arrow buttons."],
      ["Join and download", "Saved as a single WAV file."],
    ],
    faqs: [
      ["Can I mix different formats?", "Yes. Each file is decoded to raw audio before joining."],
      ["Is there a crossfade?", "No. Each track starts as the previous one ends."],
      ["What if the files have different sample rates?", "They are joined at the rate of the audio context, so mismatched files are resampled."],
    ],
    uses: [
      "Combining voice memo segments into one recording",
      "Stitching chapters of an audiobook",
      "Assembling an intro, main section and outro for a podcast",
    ],
  },
  "audio-compressor": {
    intro:
      "Audio Compressor applies dynamic range compression: it turns down the loud parts of a recording so the overall level is more even. This is the studio effect, not file-size compression, and the output file will not be smaller.\n\nTwo controls shape the result. Threshold, from -60 to 0 dB, sets the level above which compression begins. Ratio, from 1:1 to 20:1, sets how strongly louder sounds are reduced. The processed audio is rendered in your browser and saved as WAV.",
    steps: [
      ["Load an audio file", "MP3, WAV, M4A or OGG."],
      ["Set threshold and ratio", "Start around -24 dB and 4:1."],
      ["Process and download", "Output is a WAV file."],
    ],
    faqs: [
      ["Will this make my file smaller?", "No. It changes loudness dynamics, not file size. Use an MP3 or AAC encoder for smaller files."],
      ["What ratio should I use for speech?", "3:1 to 4:1 gives natural-sounding control. Above 10:1 acts as a limiter."],
      ["Why does it sound quieter afterwards?", "Compression lowers peaks. Follow it with the Volume Booster or Normalizer to bring the level back up."],
    ],
    uses: [
      "Evening out a podcast where one speaker is louder",
      "Taming sudden peaks in a recording",
      "Making dialogue easier to hear on small speakers",
    ],
  },
  "audio-volume-booster": {
    intro:
      "Audio Volume Booster makes a quiet recording louder by multiplying every sample by a factor from 1× to 5×. Doubling the multiplier adds about 6 dB.\n\nSamples that would exceed the maximum level are held at the limit so the file never overflows. Be aware that heavy boosting of audio that is already fairly loud flattens the peaks, which is heard as distortion; if that happens, use a lower multiplier. Processing is local and the result is saved as WAV.",
    steps: [
      ["Load an audio file", "Drop it into the tool."],
      ["Choose a multiplier", "2× is a good first try."],
      ["Process and download", "Listen, and reduce the gain if it distorts."],
    ],
    faqs: [
      ["How much louder is 2×?", "About 6 dB, which most people hear as clearly louder but not double."],
      ["Why does the boosted audio sound harsh?", "The loudest peaks have hit the ceiling and been flattened. Use less gain, or compress first."],
      ["Does boosting add noise?", "It raises everything equally, so existing background noise becomes louder too."],
    ],
    uses: [
      "Rescuing a voice memo recorded too far from the microphone",
      "Raising the level of a quiet lecture recording",
      "Matching a soft clip to louder ones before joining",
    ],
  },
  "audio-speed-changer": {
    intro:
      "Audio Speed Changer plays a recording back faster or slower, from 0.25× to 4×, and saves the result as a new WAV file. At 2× a ten-minute file becomes five minutes long.\n\nThe change is made by resampling, the same way a tape or record behaves when its speed changes, so pitch moves with speed: faster audio sounds higher and slower audio sounds deeper. It does not use pitch-preserving time-stretching.",
    steps: [
      ["Load an audio file", "MP3, WAV, M4A or OGG."],
      ["Set the speed", "Below 1× slows down, above 1× speeds up."],
      ["Process and download", "Saved as WAV."],
    ],
    faqs: [
      ["Does the pitch stay the same?", "No. Pitch rises when you speed up and drops when you slow down."],
      ["How much does pitch change at 2×?", "It rises by one octave. At 0.5× it falls by one octave."],
      ["How can I keep the pitch constant?", "Use an editor with time-stretching, such as Audacity's Change Tempo effect."],
    ],
    uses: [
      "Slowing a musical passage to learn it by ear",
      "Shortening a long recording for review",
      "Creating sped-up or slowed-down effects for a video",
    ],
  },
  "m4a-to-mp3": {
    intro:
      "M4A to MP3 converts M4A and AAC audio, the format used by iPhone voice memos and Apple Music downloads, into MP3 files that play on practically every device. The file is decoded in your browser and re-encoded with the LAME MP3 encoder; nothing is uploaded.\n\nChoose a bitrate from 128 to 320 kbps. 192 kbps is a good balance for music, and 128 kbps is plenty for speech. Because both formats are lossy, converting between them cannot improve the sound, so keep the original if you may need it again.",
    steps: [
      ["Drop an M4A or AAC file", "Voice memos and music files both work."],
      ["Choose a bitrate", "192 kbps suits most uses."],
      ["Convert and download", "A real .mp3 file is saved."],
    ],
    faqs: [
      ["Will the MP3 sound as good as the M4A?", "Very nearly at 192 kbps or above, but a second lossy encode always loses a little."],
      ["Will it open a protected iTunes purchase?", "No. Older DRM-protected .m4p files cannot be decoded."],
      ["Which bitrate should I pick for voice memos?", "128 kbps keeps speech clear at about 1 MB per minute."],
    ],
    uses: [
      "Playing an iPhone voice memo on a car stereo",
      "Sending a recording to someone whose player rejects M4A",
      "Uploading audio to a platform that accepts only MP3",
    ],
  },
  "wav-to-mp3": {
    intro:
      "WAV to MP3 compresses uncompressed WAV audio into MP3. A WAV file takes about 10 MB per minute of stereo sound; the same minute as a 192 kbps MP3 is about 1.4 MB, small enough to email or upload quickly.\n\nEncoding is done on your device with the LAME encoder, at a bitrate you choose between 128 and 320 kbps. WAV files at unusual sample rates, such as 96 kHz studio recordings, are converted to 44.1 kHz first because MP3 does not support higher rates.",
    steps: [
      ["Drop a WAV file", "Any bit depth your browser can decode."],
      ["Choose a bitrate", "320 kbps for the best quality, 128 kbps for the smallest file."],
      ["Convert and download", "The MP3 is saved to your device."],
    ],
    faqs: [
      ["How much smaller is the MP3?", "At 192 kbps it is roughly one seventh of a CD-quality WAV; at 128 kbps about one eleventh."],
      ["Can people hear the difference from WAV?", "At 256 to 320 kbps most listeners cannot on normal equipment."],
      ["Should I keep the WAV?", "Yes. Keep it as your master and make MP3 copies for sharing."],
    ],
    uses: [
      "Sharing a recording by email or chat",
      "Uploading a podcast episode",
      "Putting studio exports on a phone or music player",
    ],
  },
  "mp3-to-wav": {
    intro:
      "MP3 to WAV decodes an MP3 and saves it as uncompressed 16-bit PCM WAV. That is the format audio editors, DAWs, samplers and many hardware devices expect, and it avoids a second round of lossy compression when you edit and export.\n\nDecoding happens in your browser and the file is not uploaded. Converting to WAV does not improve the sound: detail removed when the MP3 was made is gone for good. The WAV will be about ten times the size of a typical MP3.",
    steps: [
      ["Drop an MP3", "Or click to browse."],
      ["Convert", "The audio is decoded locally."],
      ["Download the WAV", "Ready for editing."],
    ],
    faqs: [
      ["Does WAV sound better than the MP3 it came from?", "No. It is an exact copy of the decoded MP3."],
      ["How big will the WAV be?", "About 10 MB per minute for stereo at 44.1 kHz."],
      ["Why convert at all?", "For compatibility with software that needs WAV, and to avoid re-compressing during editing."],
    ],
    uses: [
      "Importing a track into a DAW or video editor",
      "Loading samples into hardware that reads only WAV",
      "Burning an audio CD",
    ],
  },
  "mp4-to-mp3": {
    intro:
      "MP4 to MP3 takes the soundtrack from an MP4 video and saves it as an MP3 file. The video is read on your device, only its audio track is decoded, and the result is encoded to MP3 with the LAME encoder at the bitrate you select.\n\nBecause nothing is uploaded, it is suitable for private recordings such as meetings and lectures. Decoding the audio track directly is much quicker than playing the video through, though long videos need enough free memory to hold the decoded sound.",
    steps: [
      ["Drop an MP4 file", "The video stays on your device."],
      ["Choose a bitrate", "128 kbps for speech, 192 kbps or more for music."],
      ["Convert and download", "An audio-only .mp3 is saved."],
    ],
    faqs: [
      ["Why did decoding fail?", "The video may have no audio track or use a codec your browser cannot decode. Very large files can also exceed available memory."],
      ["Can I extract audio from a YouTube link?", "No. The tool works on files you already have."],
      ["How big will the MP3 be?", "About 1 MB per minute at 128 kbps and 1.4 MB per minute at 192 kbps."],
    ],
    uses: [
      "Saving the audio of a recorded meeting",
      "Listening to a lecture video as audio",
      "Pulling music from your own video footage",
    ],
  },
  "video-to-audio": {
    intro:
      "Video to Audio Converter extracts the audio track from a video file and saves it as WAV. It accepts MP4, WebM and MOV, and will also try MKV and AVI, though whether those decode depends on your browser's codec support.\n\nThe whole file is decoded directly, so extraction is usually much faster than real time, and the video never leaves your computer. Output is 16-bit PCM WAV, which preserves the decoded sound exactly.",
    steps: [
      ["Drop a video file", "MP4, WebM or MOV work most reliably."],
      ["Convert", "Audio is decoded in the browser."],
      ["Download the WAV", "Lossless audio."],
    ],
    faqs: [
      ["Which video formats work?", "Anything your browser can decode. MP4 with AAC audio and WebM are the most reliable."],
      ["Why won't my MKV or AVI convert?", "Browsers often lack the codecs used in those containers."],
      ["How large a video can I use?", "The file is loaded into memory, so files over a few hundred megabytes may fail on low-memory devices."],
    ],
    uses: [
      "Turning a recorded webinar into something to listen to",
      "Extracting dialogue for subtitling",
      "Saving the sound from a phone video",
    ],
  },
  "audio-to-text": {
    intro:
      "Audio to Text transcribes speech from your microphone as you talk. Pick a language, press Start Recording, and words appear in the transcript, with provisional text shown while the recogniser is still deciding. Thirteen language options are offered, including English, Hindi, Spanish, French, German, Japanese and Arabic.\n\nIt uses the Web Speech API built into Chrome, Edge and Safari; Firefox is not supported. In Chrome your speech is sent to Google's recognition service for processing. The tool listens live and cannot transcribe an uploaded audio file.",
    steps: [
      ["Choose a language", "Match the language you will speak."],
      ["Start recording and allow the microphone", "Speak clearly at a steady pace."],
      ["Stop and copy", "Copy the transcript when you finish."],
    ],
    faqs: [
      ["Can I upload a recording to transcribe?", "No. It works with live microphone input only."],
      ["Is my speech processed on my device?", "Usually not. Chrome sends audio to Google's servers for recognition."],
      ["How do I add punctuation?", "Recognition adds little punctuation automatically; edit the transcript after copying."],
    ],
    uses: [
      "Dictating notes or a first draft",
      "Capturing ideas hands-free",
      "Getting a rough transcript of something you read aloud",
    ],
  },
  "text-to-speech": {
    intro:
      "Text to Speech reads your text aloud using the voices installed in your browser and operating system. Paste or type the text, choose a voice, and adjust the speed and pitch sliders before pressing Speak.\n\nThe list of voices comes from your device, so it differs between Windows, macOS, Android and iOS, and between browsers. Speech is played through your speakers; the tool does not create an audio file to download.",
    steps: [
      ["Enter text", "Type or paste what you want read."],
      ["Choose a voice, speed and pitch", "English voices are listed first."],
      ["Press Speak", "Stop at any time."],
    ],
    faqs: [
      ["Can I download the speech as MP3?", "No. Browsers' speech synthesis plays audio but does not expose it as a file."],
      ["Why do I see so few voices?", "The voices are supplied by your operating system. You can add more in its language or accessibility settings."],
      ["Does it work offline?", "With locally installed voices, yes. Some browser voices need a connection."],
    ],
    uses: [
      "Proof-listening to a draft to catch mistakes",
      "Hearing how a word or sentence is pronounced",
      "Resting your eyes while reviewing a long document",
    ],
  },
  "mp3-to-aac": {
    intro:
      "MP3 to AAC re-encodes MP3 audio as AAC, saved as a standard .aac file. Encoding uses the AAC encoder built into your browser, which is available in Chrome, Edge and recent versions of Safari; if your browser has no AAC encoder the tool tells you instead of producing a mislabelled file.\n\nAAC is the format Apple devices, YouTube and most streaming services use, and it sounds a little better than MP3 at the same bitrate. Converting an existing MP3 cannot add quality back, so this is for compatibility, not improvement.",
    steps: [
      ["Drop an MP3", "It stays on your device."],
      ["Choose a bitrate", "Match or slightly exceed the MP3's own bitrate."],
      ["Convert and download", "Saved as a .aac file."],
    ],
    faqs: [
      ["Which browsers can do this?", "Chrome and Edge on desktop, and recent Safari. Firefox currently cannot encode AAC."],
      ["Does converting MP3 to AAC improve quality?", "No. Each lossy re-encode loses a little."],
      ["Is .aac the same as .m4a?", "The audio is the same AAC. An .m4a file wraps it in an MP4 container; .aac is the raw stream, which most players also accept."],
    ],
    uses: [
      "Preparing audio for a device or app that prefers AAC",
      "Matching the format of an existing AAC library",
      "Testing AAC playback in a project",
    ],
  },
  "aac-to-mp3": {
    intro:
      "AAC to MP3 converts AAC and M4A audio into MP3, the format that every player, car stereo and editing program understands. The file is decoded in your browser and encoded with the LAME MP3 encoder, so it is never uploaded.\n\nPick a bitrate between 128 and 320 kbps. AAC is the more efficient codec, so to keep the sound close to the original choose an MP3 bitrate somewhat higher than the AAC file's own.",
    steps: [
      ["Drop an AAC or M4A file", "Processed locally."],
      ["Choose a bitrate", "192 kbps or higher for music."],
      ["Convert and download", "A real .mp3 file is saved."],
    ],
    faqs: [
      ["What MP3 bitrate matches a 128 kbps AAC?", "Around 192 kbps is a safe choice."],
      ["Will tags such as title and artist carry over?", "No. The audio is converted; add tags afterwards in your music app."],
      ["Why is the MP3 larger than the AAC?", "You chose a higher bitrate than the source used. Size depends only on bitrate and length."],
    ],
    uses: [
      "Playing downloaded audio on an older MP3 player",
      "Importing audio into software that rejects AAC",
      "Standardising a mixed music folder on MP3",
    ],
  },
  "flac-to-mp3": {
    intro:
      "FLAC to MP3 turns lossless FLAC audio into MP3. A FLAC album is perfect for archiving but large, and many phones, cars and portable players will not play it; an MP3 copy at 256 or 320 kbps is a fraction of the size and sounds the same to most listeners.\n\nYour browser decodes the FLAC and the LAME encoder writes the MP3, all on your device. High-resolution files above 48 kHz are converted to 44.1 kHz because MP3 does not support higher sample rates.",
    steps: [
      ["Drop a FLAC file", "It is decoded on your device."],
      ["Choose a bitrate", "320 kbps keeps the most detail."],
      ["Convert and download", "A real .mp3 file is saved."],
    ],
    faqs: [
      ["How much smaller is the result?", "A 320 kbps MP3 is typically a third of the FLAC's size; 192 kbps about a fifth."],
      ["Should I keep the FLAC?", "Yes. Keep the lossless original as your master and make lossy copies from it."],
      ["Does it handle 24-bit FLAC?", "Yes. It is decoded and encoded at 16-bit precision, which is all MP3 can use."],
    ],
    uses: [
      "Making a compact copy of a lossless album for a phone",
      "Playing a FLAC collection in a car that reads only MP3",
      "Sharing a track without sending a huge file",
    ],
  },
  "mp3-to-flac": {
    intro:
      "MP3 to FLAC decodes an MP3 and stores the result in a genuine FLAC file, written by a FLAC encoder that runs in your browser. The output is 16-bit lossless audio that any FLAC player or editor will open.\n\nBe clear about what this achieves. FLAC preserves exactly what the MP3 decodes to, but the detail discarded when the MP3 was made cannot be recovered, so the file gets several times larger without sounding better. Convert when a program or device requires FLAC input, not to improve quality.",
    steps: [
      ["Drop an MP3", "Processed locally."],
      ["Convert", "Encoding takes a few seconds."],
      ["Download the FLAC", "A standard .flac file."],
    ],
    faqs: [
      ["Does MP3 to FLAC improve sound quality?", "No. Lost detail cannot be recreated."],
      ["Why is the FLAC so much bigger?", "It stores every decoded sample exactly, typically at 50 to 70 percent of WAV size."],
      ["When is this conversion useful?", "When software or hardware accepts only FLAC, or to stop further quality loss while editing."],
    ],
    uses: [
      "Feeding audio to a tool that only accepts FLAC",
      "Editing without another round of lossy compression",
      "Keeping a consistent format in a FLAC library",
    ],
  },
  "audio-noise-reducer": {
    intro:
      "Audio Noise Reducer cleans up a recording with two processing stages. A high-pass filter at 80 Hz removes low rumble such as mains hum, handling noise and traffic, and a dynamics processor then acts on the level you set with the noise threshold slider, from a gentle -60 dB to an aggressive -20 dB.\n\nThis is simple filtering, not AI or spectral noise removal: it helps with low-frequency rumble and uneven levels, but it will not remove hiss, keyboard clatter or voices in the background. Output is WebM audio and processing runs in real time.",
    steps: [
      ["Load a recording", "MP3, WAV, OGG or M4A."],
      ["Set the noise threshold", "Start at -40 dB."],
      ["Apply and download", "Preview before saving the .webm file."],
    ],
    faqs: [
      ["Will it remove background hiss?", "Not well. Constant broadband hiss needs spectral noise reduction, as found in Audacity."],
      ["What does the 80 Hz filter do?", "It cuts frequencies below normal speech, where hum and rumble live, without thinning voices."],
      ["Why does my audio sound pumped?", "The threshold is too aggressive. Move it towards -60 dB."],
    ],
    uses: [
      "Reducing hum on a voice recording",
      "Cleaning rumble from audio recorded outdoors",
      "Tidying a quick recording before sharing",
    ],
  },
  "audio-normalizer": {
    intro:
      "Audio Normalizer raises or lowers the volume of a whole recording so that its loudest peak lands on a target level. Choose the target between -12 and 0 dBFS; -1 dBFS is the usual choice, leaving a small safety margin. The tool measures the current peak and reports the gain it applied in decibels.\n\nPeak normalisation changes overall level only. Quiet and loud passages keep the same relationship to each other, so it will not fix a recording where one speaker is much quieter than another; use the Audio Compressor first for that. Output is WebM audio.",
    steps: [
      ["Load an audio file", "MP3, WAV, OGG or M4A."],
      ["Choose the target peak", "-1 dBFS is a safe default."],
      ["Normalize and download", "The applied gain is shown."],
    ],
    faqs: [
      ["What is dBFS?", "Decibels relative to full scale. 0 dBFS is the loudest level a digital file can hold."],
      ["Is this the same as loudness (LUFS) normalisation?", "No. This matches peaks. Two files with equal peaks can still sound different in loudness."],
      ["Why did my file barely change?", "It already has a peak near the target, perhaps from one loud click or pop."],
    ],
    uses: [
      "Bringing a quiet recording up to a usable level",
      "Giving a set of clips the same peak level",
      "Preparing audio before uploading to a video",
    ],
  },
};
