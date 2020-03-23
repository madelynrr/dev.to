// Shared behavior between the reading list and history pages
// imports setupAlgoliaIndex which is connected to the algolia search api
import setupAlgoliaIndex from '../src/utils/algolia';

// Provides the initial state for the component
export function defaultState(options) {
  const state = {
    query: '',
    index: null,

    page: 0,
    hitsPerPage: 80,
    totalCount: 0,

    items: [],
    itemsLoaded: false,

    availableTags: [],
    selectedTags: [],

    showLoadMoreButton: false,
  };
  return Object.assign({}, state, options);
}

// Starts the search when the user types in the search box
export function onSearchBoxType(event) {
  // assigns keyword this to the component using this function
  const component = this;

  // assigns query to the value of the search input
  const query = event.target.value;
  // destructures selectedTags and statusView from state
  const { selectedTags, statusView } = component.state;

  // resets page to 0 in state
  component.setState({ page: 0 });
  // calls the search function that is also in this file to run the actual search using selectedTags
  component.search(query, { tags: selectedTags, statusView });
}

// adds or removes a tag from state's selectedTags
export function toggleTag(event, tag) {
  // prevents automatic refresh before event can be recorded
  event.preventDefault();

  // assigns keyword this to the component using this function
  const component = this;
  // destructures query, selectedTags, and statusView from state
  const { query, selectedTags, statusView } = component.state;
  // assigns newTags to selectedTags from state
  const newTags = selectedTags;
  // checking to see if the tag passed in as an argument is included in newTags
  if (newTags.indexOf(tag) === -1) {
    // if its not included, the tag is pushed in to the newTags array
    newTags.push(tag);
  } else {
    // if it is already included, it is removed from newTags
    newTags.splice(newTags.indexOf(tag), 1);
  }
  // state's selectedTags is reset with newTags
  component.setState({ selectedTags: newTags, page: 0, items: [] });
  // calls the search function that is also in this file to run the actual search using newTags
  component.search(query, { tags: newTags, statusView });
}

// resets all currently selected tags
export function clearSelectedTags(event) {
  // prevents automatic refresh before event can be recorded
  event.preventDefault();

  // assigns keyword this to the component using this function
  const component = this;
  // destructures query and statusView from state
  const { query, statusView } = component.state;
  // creates newTags as an empty array
  const newTags = [];
  // sets state with selectedTags as an empty array (effectively clearing out all selected tags)
  component.setState({ selectedTags: newTags, page: 0, items: [] });
  // calls the search function that is also in this file to run the actual search using newTags
  component.search(query, { tags: newTags, statusView });
}

// Perform the initial search
export function performInitialSearch({
  containerId,
  indexName,
  searchOptions = {},
}) {
  // assigns keyword this to the component using this function
  const component = this;
  // destructures hitsPerPage from state
  const { hitsPerPage } = component.state;

  // sets up the index to be searched by calling imported setupAlgoliaIndex function
  const index = setupAlgoliaIndex({ containerId, indexName });

  // calls on the seaech function from this file to search the index and then sets state using info from search results
  index.search('', searchOptions).then(result => {
    component.setState({
      items: result.hits,
      totalCount: result.nbHits,
      index, // set the index in the component state, to be retrieved later
      itemsLoaded: true,
      // show the button if the number of total results is greater
      // than the number of results for the current page
      showLoadMoreButton: result.nbHits > hitsPerPage,
    });
  });
}

// Main search function
export function search(query, { page, tags, statusView }) {
  // assigns keyword this to the component using this function
  const component = this;

  // allow the page number to come from the calling function
  // we check `undefined` because page can be 0
  const newPage = page === undefined ? component.state.page : page;

  // destructures index, hitsPerPage, and items from state
  const { index, hitsPerPage, items } = component.state;

  // creates filters object with hitsPerPage and page number
  const filters = { hitsPerPage, page: newPage };
  // if there are tags to search, adds the tags to the filter object with key 'tags'
  if (tags && tags.length > 0) {
    filters.tagFilters = tags;
  }

  // sets key of filters to the filter object using statusView
  if (statusView) {
    filters.filters = `status:${statusView}`;
  }
  // uses the search function from this file to search the index with the query passed in as an argument
  index.search(query, filters).then(result => {
    // then appends new items to the end of the current items in state
    const allItems =
      page === undefined ? result.hits : [...items, ...result.hits];
    // sets state with search results - items now includes new items from search
    component.setState({
      query,
      page: newPage,
      items: result.hits,
      totalCount: allItems.length,
      // show the button if the number of items is lower than the number
      // of available results
      showLoadMoreButton: allItems.length < result.nbHits,
    });
  });
}

// Retrieve the results in the next page
export function loadNextPage() {
  // assigns keyword this to the component using this function
  const component = this;

  // destructures query, selectedTags, page, and statusView from state
  const { query, selectedTags, page, statusView } = component.state;
  // increments the current page in state
  component.setState({ page: page + 1 });
  // calls the search function from this page with selectedTags
  component.search(query, { tags: selectedTags, statusView });
}
