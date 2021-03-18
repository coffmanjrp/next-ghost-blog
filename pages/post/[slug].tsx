import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
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
    revalidate: 10,
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
  const [enableLoadComments, setEnableLoadComments] = useState<boolean>(true);

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  function loadComments() {
    setEnableLoadComments(false);

    (window as any).disqus_config = function () {
      this.page.url = window.location.href;
      this.page.identifier = post.slug;
    };

    const script = document.createElement('script');
    script.src = 'https://next-ghost-blog.disqus.com/embed.js';
    script.setAttribute('data-timestamp', Date.now().toString());

    document.body.appendChild(script);
  }

  return (
    <>
      <Head>
        <title>Next Ghost Blog | {post.title}</title>
      </Head>
      <div className={styles.container}>
        <Link href="/">
          <a className={styles.links}>Go Back</a>
        </Link>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        {enableLoadComments && (
          <p className={styles.links} onClick={loadComments}>
            Load Comments
          </p>
        )}
        <div id="disqus_thread" className="disqus_thread"></div>
      </div>
    </>
  );
};

export default Post;
