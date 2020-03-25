// Item list item
import { h } from 'preact';
import { PropTypes } from 'preact-compat';
// creates functional component ItemListItem with item and children passed down as props
export const ItemListItem = ({ item, children }) => {
  // creates adaptedItem object using information from item prop
  const adaptedItem = {
    path: item.article_path || item.searchable_reactable_path,
    title: item.article_title || item.searchable_reactable_title,
    user: item.article_user || item.reactable_user,
    publishedDate: item.reactable_published_date,
    visitedDate: item.readable_visited_at,
    readingTime: item.article_reading_time || item.reading_time,
    tags: item.article_tags || item.reactable_tags,
  };

  // update readingTime to 1 min if the reading time is less than 1 min
  adaptedItem.readingTime = Math.max(1, adaptedItem.readingTime || null);
  // 30: provides a wrapper to group the single item jsx together
  // 31: displays a link to read the item
  // 32: displays the item title
  // 34: displays item user's info: username (is this the author?), and profile pic
  // 36: displays visited date, or if it hasn't been visited, the published date
  // 40: displays the time it takes to read the item
  // 46: adds a link for each of the item's tags if it has tags
  // 55: displays children - unclear what this represents or how this is updated as it starts off as an empty object
  return (
    <div className="item-wrapper">
      <a className="item" href={adaptedItem.path}>
        <div className="item-title">{adaptedItem.title}</div>

        <div className="item-details">
          <a className="item-user" href={`/${adaptedItem.user.username}`}>
            <img src={adaptedItem.user.profile_image_90} alt="Profile Pic" />
            {`${adaptedItem.user.name}・`}
            {adaptedItem.visitedDate
              ? `visited on ${adaptedItem.visitedDate}・`
              : `${adaptedItem.publishedDate}・`}
            {`${adaptedItem.readingTime} min read・`}
          </a>

          {adaptedItem.tags.length > 0 ? (
            <span className="item-tags">
              {adaptedItem.tags.map(tag => (
                <a className="item-tag" href={`/t/${tag}`}>
                  {`#${tag}`}
                </a>
              ))}
            </span>
          ) : (
            ''
          )}

          {children}
        </div>
      </a>
    </div>
  );
};
// defines data type shape for a prop item that is a historyItem
const historyItemPropTypes = PropTypes.shape({
  article_path: PropTypes.string.isRequired,
  article_title: PropTypes.string.isRequired,
  article_user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile_image_90: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  article_reading_time: PropTypes.number.isRequired,
  readable_visited_at: PropTypes.string.isRequired,
  article_tags: PropTypes.arrayOf(PropTypes.string).isRequired,
});
// defines data type shape for a prop item that is a readingListItem
const readingListItemPropTypes = PropTypes.shape({
  searchable_reactable_path: PropTypes.string.isRequired,
  searchable_reactable_title: PropTypes.string.isRequired,
  reactable_user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile_image_90: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  reading_time: PropTypes.number.isRequired,
  reactable_published_date: PropTypes.string.isRequired,
  reactable_tags: PropTypes.arrayOf(PropTypes.string).isRequired,
});

// checks that the children prop is an empty object
ItemListItem.defaultProps = {
  children: {},
};
// checks that the item passed in as a prop follows either the historyItem or readingListItem data type pattern
ItemListItem.propTypes = {
  item: PropTypes.oneOfType([historyItemPropTypes, readingListItemPropTypes])
    .isRequired,
  children: PropTypes.element,
};
