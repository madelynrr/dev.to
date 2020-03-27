// Tells babel to use h for JSX, brings in Component to build out a class component
import { h, render } from 'preact';
// Imports getUserDataAndCsrfToken function
import { getUserDataAndCsrfToken } from '../chat/util';
// Imports ReadingList component
import { ReadingList } from '../readingList/readingList';
// A function that renders the ReadingList component based on data returned from the getUserDataAndCsrfToken function
function loadElement() {
  // calls getUserDataAndCsrfToken and then uses the currentUser info that is returned from that function
  getUserDataAndCsrfToken().then(({ currentUser }) => {
    // assigns root to the the element that has an id of reading-list
    const root = document.getElementById('reading-list');

    // checks to see that there is an element on the document with the reading-list id
    if (root) {
      // if there is, renders the ReadingList component with availableTags(specific to the current user) and statusView passed down as props
      render(
        <ReadingList
          collections={root.dataset.collections}
          availableTags={currentUser.followed_tag_names}
          statusView={root.dataset.view}
        />,
        root,
        root.firstElementChild,
      );
    }
  });
}
// this application is using InstantClick - a js library that speeds up your site, when this is triggered on the window, loadElement is called
window.InstantClick.on('change', () => {
  loadElement();
});
// invokes loadElement
loadElement();
