import Head from 'next/head';
import styles from '../styles/Home.module.scss';

const BLOG_URL = 'https://next-ghost-blog-backend.herokuapp.com';
const CONTENT_API_KEY = 'bbe57347cf4334b9455cae967f';

type Post = {};

async function getPost() {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}`
  ).then((res) => res.json());

  const titles = res.posts.map((post) => post.title);

  console.log(titles);

  return titles;
}

export const getStaticProps = async ({ params }) => {
  const posts = await getPost();

  return {
    props: { posts },
  };
};

const Home: React.FC<{ posts: string[] }> = ({ posts }) => {
  return (
    <div className={styles.container}>
      <h1>Hello to my blog</h1>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>{post}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
