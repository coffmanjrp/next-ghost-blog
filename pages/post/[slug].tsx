import Link from 'next/link';

const Post: React.FC = (props) => {
  return (
    <>
      <div>
        <Link href="/">
          <a>Go Back</a>
        </Link>
        <h1>My Blog Post</h1>
      </div>
    </>
  );
};

export default Post;
