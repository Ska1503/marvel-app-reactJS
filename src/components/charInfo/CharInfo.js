import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMassage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'

import './charInfo.scss';


const CharInfo = ({ charId }) => {

    const [char, setChar] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const marvelService = new MarvelService()

    useEffect(() => {
        updateChar()
    }, [charId])

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props.charId !== prevProps.charId) {
    //         this.updateChar()
    //     }
    // }

    const updateChar = () => {
        // const { charId } = props
        if (!charId) {
            return
        }

        onCharLoading()

        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError)
    }

    function onCharLoading() {

        setLoading(true)
    }

    //Записываем даные в состояние после запроса
    const onCharLoaded = (char) => {
        setChar(char)
        setLoading(false)
    }

    //Устранение ошибки при запросе
    const onError = () => {
        setLoading(false)
        setError(true)
    }

    const skeleton = char || loading || error ? null : <Skeleton />
    const errorMessage = error && <ErrorMessage />
    const spinner = loading && <Spinner />
    const content = !(loading || error || !char) && <View char={char} />

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} />  
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 && 'Comics not found'}
                {comics.map((item, i) => {
                    return (
                        <li key={i} className="char__comics-item">
                            {item.name}
                        </li>
                    )
                })}

            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;