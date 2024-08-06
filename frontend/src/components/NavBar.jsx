import React from 'react'
import { Stack } from '@mui/material'
import { Link } from 'react-router-dom'

import { logo } from '../utils/constants';

import SearchBar from './SearchBar';

const NavBar = () => (

  <Stack direction="row"
         alignItems="center"
        p={2} 
        sx={{ position: 'sticky', background: '#0f0f0f', top: 0, justifyContent: 'space-between' }}
  >
    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
      <img class="logo" src={logo} alt="logo" height={45}/>
      <h1>Video Search Engine</h1>
    </Link>
    <SearchBar/>
  </Stack>

);

export default NavBar