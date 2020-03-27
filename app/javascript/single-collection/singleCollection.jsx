import { h} from 'preact';
// import { PropTypes } from 'preact-compat';

export const SingleCollection = ({ name }) => {
  return (
    <article className="single-collection-preview">
      <h2>{name}</h2>
    </article>
  );
};
