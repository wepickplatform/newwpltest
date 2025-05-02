// components/PopularPosts.js
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/PopularPosts.module.css';

export default function PopularPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return <div className={styles.noPosts}>인기 게시물이 없습니다.</div>;
  }
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>오늘의 인기 아티클</h2>
      <ul className={styles.postList}>
        {posts.map((post) => (
          <li key={post.ID} className={styles.postItem}>
            <Link href={`/post/${post.ID}`}>
              <a className={styles.postLink}>
                <div className={styles.postNumber}>{post.post_number}</div>
                <div className={styles.postInfo}>
                  <h3 className={styles.postTitle}>{post.post_title}</h3>
                </div>
                {post.featured_image && (
                  <div className={styles.imageContainer}>
                    <Image 
                      src={post.featured_image}
                      alt={post.post_title}
                      width={60}
                      height={60}
                      className={styles.image}
                    />
                  </div>
                )}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
