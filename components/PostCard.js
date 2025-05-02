// components/PostCard.js
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/ko';
import styles from '../styles/PostCard.module.css';

export default function PostCard({ post }) {
  moment.locale('ko');
  const formattedDate = moment(post.date).format('YYYY년 MM월 DD일');
  
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.['author']?.[0];
  
  return (
    <div className={styles.card}>
      <Link href={`/post/${post.slug}`}>
        <a className={styles.cardLink}>
          {featuredMedia && featuredMedia.source_url && (
            <div className={styles.imageContainer}>
              <Image
                src={featuredMedia.source_url}
                alt={post.title.rendered}
                width={300}
                height={200}
                layout="responsive"
                className={styles.image}
              />
            </div>
          )}
          
          <div className={styles.cardContent}>
            <h3 
              className={styles.cardTitle}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
            />
            
            <div className={styles.cardMeta}>
              {author && <span>작성자: {author.name}</span>}
              <span>작성일: {formattedDate}</span>
            </div>
            
            <div 
              className={styles.cardExcerpt}
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
            
            <span className={styles.readMore}>자세히 보기</span>
          </div>
        </a>
      </Link>
    </div>
  );
}
