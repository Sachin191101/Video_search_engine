import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box } from '@mui/material'
import Videos from './Videos'
import ChannelCard from './ChannelCard'
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { ViewWeek } from '@mui/icons-material'
import axios from 'axios'


const ChannelDetail = () => {
  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState([])

  const { id } = useParams();

  useEffect(() => {
    fetchFromAPI(`channels?part=snippet&id=${id}`)
    .then((data)  => setChannelDetail(data?.items[0]));

    fetchFromAPI(`search?channelId=${id}&part=snippet&order=date`)
    .then((data)  => setVideos(data?.items));
  }, [id])

  useEffect(() => {
    console.log(channelDetail);
    if(channelDetail !== null) {
      const { brandingSettings, snippet, statistics } = channelDetail;

      const { title, description, keywords } = brandingSettings.channel;
      const { publishedAt } = snippet;
      const { subscriberCount, videoCount, viewCount } = statistics;
      const url = "http://localhost:3001/api";
      const keywordss = keywords.toString();
      const data = {title, description, subscriberCount, videoCount, publishedAt, keywordss, viewCount };
      axios.post(`${url}/channel`, data);
    }

  }, [channelDetail])

  return (
    <Box minHeight="95vh">
      <Box>
        <div
          style={{
            background: 'linear-gradient(184deg, rgba(241,254,254,1) 0%, rgba(3,0,255,1) 100%)',
            zIndex: 10,
            height: '300px'
          }}
        />
          <ChannelCard channelDetail={channelDetail} marginTop="-125px" />
      </Box>
      <Box display="flex" p="2">
          <Box sx={{ mr: { sm: '100px' } }} />
            <Videos videos={videos} />
      </Box>
    </Box>
  )
}

export default ChannelDetail