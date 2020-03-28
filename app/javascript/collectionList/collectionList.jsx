import { h } from 'preact';
import { PropTypes } from 'preact-compat';
import { ItemListItem } from '../src/components/ItemList/ItemListItem';

export const CollectionList = ({ articles, name }) => {
  const parsedData = JSON.parse(articles);

  const itemsToRender = parsedData.map(article => {
    return <ItemListItem item={article} />;
  });

  return (
    <div className="item-list-container collection-list-page">
      <div className="items-container collection-list-page">
        <div className="results results--loaded">
          <div className="results-header">
            {name}
            {' '}
            Articles
          </div>
          {!parsedData.length ? (
            <p>No articles match the selected tags :(</p>
          ) : (
            itemsToRender
          )}
        </div>
        <a className="collection-back-btn" href="/readinglist">
          Back
        </a>
      </div>
    </div>
  );
};

CollectionList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
};
