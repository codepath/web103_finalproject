import { useState, useEffect } from 'react'
import axios from 'axios'
import GenreList from '../components/GenreList'
import { Game } from '../types'
import GameCard from '../components/GameCard'

const HomePage = () => {
    const [games, setGames] = useState<Game[]>([])

    useEffect(() => {
        const getData = async () => {
            const res = await axios.get('http://localhost:3000/games')
            const data = res.data
            console.log(games)
            setGames(data)
        }

        getData()
    }, [])

    return (
        <div className="grid grid-cols-8 lg:grid-cols-aside-main lg:grid-rows-main gap-4">
            <div className="sm:hidden md:grid md:col-start-1">
                <GenreList />
            </div>

            <div className="p-4 md:col-start-2 md:col-span-7 row-start-1 grid grid-cols-6 gap-4 sm:col-span-2 ">
                {games.map((game) => (
                    <GameCard game={game} />
                ))}
            </div>
        </div>
    )
}

export default HomePage
