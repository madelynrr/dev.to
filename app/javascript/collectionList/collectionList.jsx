import { h, Component } from 'preact';
import { ItemListItem } from '../src/components/ItemList/ItemListItem';
import { PropTypes } from 'preact-compat';

export class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state={articles: []}
  }

  componentDidMount() {
    this.setState({articles: JSON.parse(this.props.articles)});
  }

  findItemsToRender = () => {
    const { articles } = this.state;
    return articles.length ? articles.map(article => {
      article.publishedDate = this.formatDate(article.published_at);
      return <ItemListItem item={article} updateReadProperty={this.updateReadProperty}></ItemListItem>
    }) : '';
  }

  formatDate = articleDate => {
    const formattedDate = articleDate.split('').splice(0, 10);
    const months = ['January ', 'February ', 'March ', 'April ', 'May ', 'June ', 'July ', 'August ', 'September ', 'October ', 'November ', 'December ']
    let y = formattedDate.splice(0, 4).join('');
    let m = formattedDate.splice(1, 2).join('');
    let d = formattedDate.splice(2, 3).join('') + ', ';
    m = months[Number(m) - 1]
    return (m + d + y);
  }

  updateReadProperty = title => {
    let parsedArticles = JSON.parse(this.props.articles);
    let readArticle = parsedArticles.find(article => article.title === title)
    readArticle.read = true;
    this.setState({articles: parsedArticles})
  }

  render() {
    const { name } = this.props;
    return (
      <div className="item-list-container collection-list-page" >
        <div className="items-container collection-list-page" >
        <div className="results results--loaded">
          <div className="results-header">{name} Articles</div>
          {!this.state.articles.length ? <p> No articles match the selected tags :(</p> : this.findItemsToRender()}
          </div>
          <a className="collection-back-btn" href={"/readinglist"}>Back</a>
        </div>
      </div>
    )
  }
}

CollectionList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
};
