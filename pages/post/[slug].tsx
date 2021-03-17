import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/Home.module.scss';

const { BLOG_URL, CONTENT_API_KEY } = process.env;

type Post = {
  title: string;
  slug: string;
  html: string;
};

async function getPost(slug: string) {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html`
  ).then((res) => res.json());

  const posts = res.posts;

  return posts[0];
}

export const getStaticProps = async ({ params }) => {
  const post = await getPost(params.slug);

  return {
    props: { post },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

const Post: React.FC<{ post: Post }> = ({ post }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className={styles.container}>
        <Link href="/">
          <a>Go Back</a>
        </Link>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </>
  );
};

export default Post;
