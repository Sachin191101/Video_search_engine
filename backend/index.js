
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const db = require('./db.js');
const moment = require("moment");
const { default: axios } = require("axios");

const app = express();

// middlewares
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(express.json());  

const options = {
    params: {
        maxResults: '50'
    },
    headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
    }
};

const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

app.post("/api/search", (req, res) => {
    const searchText = req.body.searchText;
    const data = req.body.videos;
    try {
        db.query('BEGIN');
        data.forEach(async (item) => {

            const { id, snippet } = item; 
            let { publishedAt, title, description, channelTitle, channelId } = snippet;
            const { videoId } = id;

            const videoData = await axios.get(`${BASE_URL}/videos?part=snippet,statistics&id=${videoId}`, options);
            const videoDetail = videoData.data.items[0];
            const vTitle = videoDetail.snippet.title;
            const vDesc = videoDetail.snippet.description;
            const vChannelTitle = videoDetail.snippet.channelTitle;
            let vPublishedAt = videoDetail.snippet.publishedAt;
            let vTags = videoDetail.snippet.tags;
            const vLike = videoDetail.statistics.likeCount;
            const vView = videoDetail.statistics.viewCount;
            const vComment = videoDetail.statistics.commentCount;
            if(vTags != undefined)
                vTags = vTags.toString();
            else 
                vTags = "";
            
            if(vPublishedAt === null) {
                vPublishedAt = new Date();
            }
            const vFormattedDate = moment(publishedAt).format('YYYY-MM-DD HH:mm:ss');

            const channelData = await axios.get(`${BASE_URL}/channels?part=snippet&id=${channelId}`, options);
            const channelDetail = channelData.data.items[0];            
            const cTitle = channelDetail.brandingSettings.channel.title;
            const cDesc = channelDetail.brandingSettings.channel.description;
            let cTags = channelDetail.brandingSettings.channel.keywords;
            if(cTags != undefined)
                cTags = cTags.toString();
            else 
                cTags = "";
            let cPublishedAt = channelDetail.snippet.publishedAt;
            const cSubscribers = channelDetail.statistics.subscriberCount;
            const cVideo = channelDetail.statistics.videoCount;
            const cView = channelDetail.statistics.viewCount;
            if(cPublishedAt === null) {
                cPublishedAt = new Date();
            }
            const cFormattedDate = moment(publishedAt).format('YYYY-MM-DD HH:mm:ss');
            if(publishedAt === null) {
                publishedAt = new Date();
            }
            const formattedDate = moment(publishedAt).format('YYYY-MM-DD HH:mm:ss');
            
            // console.log(searchText, videoId, publishedAt, channelId);
            const qSearch = "INSERT INTO search_results (`search text`, `video title`, `video description`, `upload date`, `channel name`) VALUES (?)";
            const submitData = [searchText, title, description, formattedDate, channelTitle]
            const qVideo = "insert into video_details (`title`, `description`, `upload date`, `tags`, `channel details`, `number of views`, `number of likes`, `number of comments`) values (?)";
            const vData = [vTitle, vDesc, vFormattedDate, vTags, vChannelTitle, vView, vLike, vComment];
            const qChannel = "insert into channel_information (`channel name`, `description`, `number of subscribers`, `total number of videos`, `channel creation date`, `channel tags`, `channel statistics`) values (?)";
            const cData = [cTitle, cDesc, cSubscribers, cVideo, cFormattedDate, cTags,  cView];
            db.query(qSearch, [submitData]);
            db.query(qVideo, [vData]);
            db.query(qChannel, [cData]);
        });
        db.query('COMMIT');
        console.log("done")
        return res.status(200).json("data saved successful");

    } catch (err) {
        db.query('ROLLBACK');
        console.log(err)
        res.status(500).json({error: err.message});
    }
})

app.post("/api/video", (req, res) => {
    const { title, description, publishedAt, tagss, channelTitle, viewCount, likeCount, commentCount } = req.body;
    const formattedDate = moment(publishedAt).format('YYYY-MM-DD HH:mm:ss', "MM-DD-YYYY HH:mm:ss");
    const values = [title, description, formattedDate, tagss, channelTitle, viewCount, likeCount, commentCount];
    const q = "insert into video_details (`title`, `description`, `upload date`, `tags`, `channel details`, `number of views`, `number of likes`, `number of comments`) values (?)";

    db.query(q, [values], (data, err) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json("video data saved successful");
    })
})

app.post("/api/channel", (req, res) => {
    const { title, description, subscriberCount, videoCount, publishedAt, keywordss, viewCount } = req.body;
    const formattedDate = moment(publishedAt).format('YYYY-MM-DD HH:mm:ss');
    const values = [title, description, subscriberCount, videoCount, formattedDate, keywordss, viewCount];
    const q = "insert into channel_information (`channel name`, `description`, `number of subscribers`, `total number of videos`, `channel creation date`, `channel tags`, `channel statistics`) values (?)";

    db.query(q, [values], (data, err) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json("channel data saved successful");
    })
})

const port = process.env.port || 3001;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
})