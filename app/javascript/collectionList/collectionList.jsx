import { h } from 'preact';
import { ItemListItem } from '../src/components/ItemList/ItemListItem';
import { PropTypes } from 'preact-compat';

export const CollectionList = ({ articles, name }) => {

  let parsedData = JSON.parse(articles)

  const itemsToRender = parsedData.map(article => {
    const formattedDate = article.published_at.split('').splice(0, 10);
    const months = ['January ', 'February ', 'March ', 'April ', 'May ', 'June ', 'July ', 'August ', 'September ', 'October ', 'November ', 'December ']
    let y = formattedDate.splice(0, 4).join('');
    let m = formattedDate.splice(1, 2).join('');
    let d = formattedDate.splice(2, 3).join('') + ', ';
    m = months[Number(m) - 1]
    article.publishedDate = (m + d + y);
    return <ItemListItem item={article}></ItemListItem>
  })

  return (
    <div className="item-list-container collection-list-page" >
      <div className="items-container collection-list-page" >
      <div className="results results--loaded">
        <div className="results-header">{name} Articles</div>
        {!parsedData.length ? <p>No articles match the selected tags :(</p> : itemsToRender}
        </div>
        <a className="collection-back-btn" href={"/readinglist"}>Back</a>
      </div>
    </div>
  )
}

CollectionList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
};
