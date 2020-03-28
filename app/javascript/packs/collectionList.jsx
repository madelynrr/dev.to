import { h, render } from 'preact';
import { getUserDataAndCsrfToken } from '../chat/util';
import { CollectionList } from '../collectionList/collectionList';

function loadElement() {
  getUserDataAndCsrfToken().then(() => {
    const root = document.getElementById('collectionlist');
    if (root) {
      render(
        <CollectionList
          articles={root.dataset.article_lists}
          name={root.dataset.name}
        />,
        root,
        root.firstElementChild,
      );
    }
  });
}

window.InstantClick.on('change', () => {
  loadElement();
});

loadElement();
