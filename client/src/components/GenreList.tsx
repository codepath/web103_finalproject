import { useState } from 'react'
import useGameQueryStore from '../store'

const GenreList = () => {

//   const { data, isLoading, error } = useGenres()

//   const selectedGenreId = useGameQueryStore(s => s.gameQuery.genreId)
//   const setSelectedGenreId = useGameQueryStore(s => s.setGenreId)

//   if (error) return null

//   if (isLoading) return <div className="spinner"></div> 
const data = [
    {
      id: 1, 
      name: 'Action',
      image_background: 'https://example.com/action.jpg'
    },
    {
      id: 2,
      name: 'Adventure', 
      image_background: 'https://example.com/adventure.jpg'
    },
    {
      id: 3,
      name: 'RPG',
      image_background: 'https://example.com/rpg.jpg'
    },
    {
      id: 4,
      name: 'Strategy',
      image_background: 'https://example.com/strategy.jpg' 
    },
    {
      id: 5,
      name: 'Shooter',
      image_background: 'https://example.com/shooter.jpg'
    }
  ]
  return (
    <>
      <h2 className="text-2xl text-white mt-9 mb-3">Genres</h2>

      <ul>
        {data?.map(genre => (
          <li key={genre.id} className="py-2 text-white">
            <div className="flex">
              {/* <img 
                className="w-8 h-8 rounded-md object-cover"
                src={getCroppedImageUrl(genre.image_background)} 
              /> */}

              <button
                className={`text-left normal-case`}
                onClick={() => console.log('hi')}
              >
                {genre.name}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )

}

export default GenreList