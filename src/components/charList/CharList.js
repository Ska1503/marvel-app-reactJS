import { useState, useEffect, useRef } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMassage/ErrorMessage'
import MarvelService from '../../services/MarvelServices'

import './charList.scss';
import hero from '../../resources/img/marvel.jpg'



const CharList = (props) => {

    const [charList, setCharList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)


    const marvelService = new MarvelService()

    // После вставки компонента в DOM, делаем сетевой звпрос
    useEffect(() => {
        onRequest()
    }, [])

    // Пагинация данных (досагрузка персонажей при клике на кнопку "LOAD MORE")
    const onRequest = (offset) => {
        onCharListLoading()
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true)
    }

    const onCharListLoaded = (newCharList) => {
        setCharList(charList => [...charList, ...newCharList]) // Наполняем массив charList данными персонажей
        setLoading(false)
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
    }

    //Устранение ошибки при запросе
    const onError = () => {
        setLoading(false)
        setError(true)
    }

    const itemRefs = useRef([])

    const focusOnItems = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[id].classList.add('char__item_selected')
    }

    function renderItems(arr) {
        const items = arr.map((card, i) => {
            // Если отсутствует превью, ставим заглушку
            if (card.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || card.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
                return (
                    <li className="char__item"
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => {
                            props.onCharSelected(card.id)
                            focusOnItems(i)
                        }}
                        key={card.id} >
                        <img src={hero} alt={hero} />
                        <div className="char__name">{card.name}</div>
                    </li>
                )
            }

            return (
                <li className="char__item"
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(card.id)
                        focusOnItems(i)
                    }}
                    key={card.id} >
                    <img src={card.thumbnail} alt={card.name} />
                    <div className="char__name">{card.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    const items = renderItems(charList)

    const errorMessage = error && <ErrorMessage />
    const spinner = loading && <Spinner />
    const content = !(loading || error) && items

    return (
        <div className="char__list">
            {content}
            {errorMessage}
            {spinner}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

export default CharList;