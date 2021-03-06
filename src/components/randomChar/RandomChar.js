import { useState, useEffect } from 'react';
import MarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMassage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import hero from '../../resources/img/hero-not-found.jpg';


const RandomChar = () => {

    const [char, setChar] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const marvelService = new MarvelService()
    useEffect(() => {
        updateChar()
    }, [])


    function onCharLoading() {
        setLoading(true)
    }

    const onCharLoaded = (char) => {
        setChar(char)
        setLoading(false)
    }

    //Устранение ошибки при запросе
    const onError = () => {
        setLoading(false)
        setError(true)
    }


    const updateChar = () => {
        //Отображение рандом персонажа
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
        onCharLoading()
        //Запрос на сервер
        marvelService
            .getCharacter(id)
            .then(onCharLoaded)
            .catch(onError)
    }


    const errorMessage = error && <ErrorMessage />
    const spinner = loading && <Spinner />
    const content = !(loading || error || !char) && <View char={char} />
    return (
        <div className="randomchar" >
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )

}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char

    return (
        <div className="randomchar__block">
            {
                thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                    || thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif'
                    ? <img
                        className="randomchar__img"
                        src={hero} alt="hero" />
                    : <img src={thumbnail}
                        alt="Random character"
                        className="randomchar__img" />
            }
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;