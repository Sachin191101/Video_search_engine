import { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Vidoes from "./Videos";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { useParams } from "react-router-dom";
import axios from "axios";

function SearchFeed() {
  const [videos, setVideos] = useState([]);
  const [videosToSave, setVideosToSave] = useState([]);
  const { searchTerm } = useParams();

  useEffect(() => {
    fetchFromAPI(`search?part=snippet&q=${searchTerm}`)
    .then((data) =>
      setVideos(data.items)
    );
  }, [searchTerm]);

  console.log(videos)

  useEffect(() => {
    // console.log(videoDetail);
    if(videos !== null) {
      const url = "http://localhost:3001/api";
      setVideosToSave(videos.slice(0, 20));
      const data = {videos: videosToSave,
        searchText: searchTerm
      }
      console.log(videosToSave)
      axios.post(`${url}/search`, data);
    }

  }, [videos])

  return (
    <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        sx={{
          color: "white",
        }}
      >
        Search Results for: <span style={{ color: "#FC1503" }}>{searchTerm}</span> videos
        </Typography>
      <Vidoes videos={videosToSave} />
    </Box>
  );
}

export default SearchFeed;
