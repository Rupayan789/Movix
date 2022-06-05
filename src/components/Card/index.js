import React from 'react'
import { useNavigate } from 'react-router-dom';

const Card = (props) => {
  const {details} = props;
  const navigate = useNavigate();

  return (
    <div className="mx-10 w-4/5 mx-auto w-fit md:w-4/5 hover:scale-110 transition-all ease-in-out delay-50  mb-4 md:mb-0 bg-regal-violet pt-4 px-4 pb-4" onClick={()=>navigate(`/movie/${details.imdbID}`)}>
      <img className="" src={details.Poster} alt="movie-poster"/>
      <div className="text-white text-center mt-1 text-sm">{details.Title}</div>
    </div>
  )
}

export default Card