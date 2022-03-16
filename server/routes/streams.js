const express = require("express"),
  router = express.Router(),
  User = require("../database/Schema").User,
  ffmpegInstaller = require("@ffmpeg-installer/ffmpeg"),
  ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

router.get(
  "/info",
  require("connect-ensure-login").ensureLoggedIn(),
  (req, res) => {
    if (req.query.streams) {
      let streams = JSON.parse(req.query.streams);
      let query = { $or: [] };
      for (let stream in streams) {
        if (!streams.hasOwnProperty(stream)) continue;
        query.$or.push({ stream_key: stream });
      }

      User.find(query, (err, users) => {
        if (err) return;
        if (users) {
          res.json(users);
        }
      });
    }
  }
);

// https://trac.ffmpeg.org/wiki/StreamingGuide
router.post(
  "/merge",
  require("connect-ensure-login").ensureLoggedIn(),
  async (req, res) => {
    const { input1, input2, output } = req.body;

    if (input1 && input2) {
      let query = { $or: [{ stream_key: input1 }, { stream_key: input2 }] };
      User.find(query, (err, users) => {
        if (err) return;
        if (users) {
          console.log(`Merge 2 stream to : ${output}`);
          ffmpeg(`${input1}`) // input 0 ex: rtmp://127.0.0.1:1935/live/stream_key
            .addInput(`${input2}`) // inpput 1
            .addOptions([
              // stack 2 video in horizontal and merge audio
              "-filter_complex [0:v][1:v]xstack=inputs=2[v];[0:a][1:a]amerge=inputs=2[a]",
              "-map [v]",
              "-map [a]",

              "-c:a aac", // standard codec for audio
              "-c:v h264", // standard codec for video via rtmp
              "-f flv", // attitude to write to rtmp
            ])
            .output(`${output}`)
            .on("progress", function (progress) {
              console.log(
                progress,
                "Processing: " + progress.percent + "% done"
              );
            })
            .on("end", function (err, stdout, stderr) {
              console.log("Finished processing!", "err:", err);
            })
            .run();
          res.json(users);
        }
      });
    }
  }
);
module.exports = router;
