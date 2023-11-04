import { useState } from 'react'
import GenreList from '../components/GenreList'
const HomePage = () => {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-aside-main lg:grid-rows-main">

      <div className="lg:col-span-aside lg:row-span-main lg:px-5">
        <GenreList />  
      </div>

      {/* <div className="col-span-main row-span-main px-2">
        <GameHeading />

        <div className="flex mb-5">
          <div className="mr-5">
            <PlatformSelector />
          </div>
          <SortSelector />  
        </div>

        <GameGrid />
      </div> */}

    </div>
  )
}

export default HomePage