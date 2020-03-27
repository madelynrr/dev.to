import { h } from 'preact';
import render from 'preact-render-to-json';
import { shallow } from 'preact-render-spy';
import { JSDOM } from 'jsdom';
import { ReadingList } from '../readingList';
import algoliasearch from '../_mocks_/algoliamock';

const getReadingList = () => (
  <ReadingList
    collections={[{ name: 'Best of JS', tag_list: ['javascript'] }]}
    availableTags={['javascript', 'react']}
    statusView="valid"
  />
);

describe('<ReadingList />', () => {
  beforeEach(() => {
    const doc = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = doc;
    global.window = doc.defaultView;

    global.document.body.createTextRange = function createTextRange() {
      return {
        setEnd() {},
        setStart() {},
        getBoundingClientRect() {
          return { right: 0 };
        },
        getClientRects() {
          return {
            length: 0,
            left: 0,
            right: 0,
          };
        },
      };
    };

    global.document.body.innerHTML = "<div id='reading-list'></div>";

    global.window.algoliasearch = algoliasearch;

    localStorage.clear();
    /* eslint-disable-next-line no-underscore-dangle */
    localStorage.__STORE__ = {};
  });

  it('renders properly', () => {
    const tree = render(<ReadingList availableTags={['discuss']} />);
    expect(tree).toMatchSnapshot();
  });

  it('should receive props', () => {
    const list = shallow(getReadingList());
    expect(list.text()).toBe('my tagsView ArchiveArticles (empty)Collections');
  });

  it('should have a button to view the archive if user is viewing non-archived articles', () => {
    const list = shallow(getReadingList());
    expect(
      list.find('.status-view-toggle').contains('View Archive'),
    ).toBeTruthy();
  });

  it('toggles help on help button press', () => {
    const list = shallow(getReadingList());
    const expected = ['javascript', 'react'];
    expect(list.state().availableTags).toEqual(expected);
  });
});
