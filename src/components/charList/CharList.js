import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMassage/ErrorMessage'
import MarvelService from '../../services/MarvelServices'

import './charList.scss';
import hero from '../../resources/img/marvel.jpg'



class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210
    }

    marvelService = new MarvelService()

    // После вставки компонента в DOM, делаем сетевой звпрос
    componentDidMount() {
        this.onRequest()
    }

    // Пагинация данных (досагрузка персонажей при клике на кнопку "LOAD MORE")
    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.OnError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newCharList], // Наполняем массив charList данными персонажей
            loading: false,
            newItemLoading: false,
            offset: offset + 9
        }))
    }

    //Устранение ошибки при запросе
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = []

    setRef = ref => {
        this.itemRefs.push(ref)
    }

    focusOnItems = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
    }

    renderItems(arr) {
        const items = arr.map((card, i) => {
            // Если отсутствует превью, ставим заглушку
            if (card.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || card.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
                return (
                    <li className="char__item"
                        ref={this.setRef}
                        onClick={() => {
                            this.props.onCharSelected(card.id)
                            this.focusOnItems(i)
                        }}
                        key={card.id} >
                        <img src={hero} alt={hero} />
                        <div className="char__name">{card.name}</div>
                    </li>
                )
            }

            return (
                <li className="char__item"
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(card.id)
                        this.focusOnItems(i)
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

    render() {
        const { charList, loading, error, offset, newItemLoading } = this.state
        const items = this.renderItems(charList)

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
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;