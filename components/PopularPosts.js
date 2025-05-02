// components/PopularPosts.js
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/PopularPosts.module.css';

export default function PopularPosts({ posts }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  if (!posts || posts.length === 0) {
    return <div className={styles.noPosts}>인기 게시물이 없습니다.</div>;
  }
  
  // 게시물을 5개씩 나누어 슬라이드 생성
  const slidesCount = Math.ceil(posts.length / 5);
  const slides = Array.from({ length: slidesCount }, (_, i) => 
    posts.slice(i * 5, (i + 1) * 5)
  );
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slidesCount - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slidesCount - 1 : prev - 1));
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.titleBar}>
        <h2 className={styles.title}>오늘의 인기 아티클</h2>
        <div className={styles.slideControls}>
          <span className={styles.slideIndicator}>
            {currentSlide + 1}/{slidesCount}
          </span>
          <button 
            className={styles.slideButton} 
            onClick={prevSlide}
            aria-label="이전 페이지"
          >
            &lt;
          </button>
          <button 
            className={styles.slideButton} 
            onClick={nextSlide}
            aria-label="다음 페이지"
          >
            &gt;
          </button>
        </div>
      </div>
      
      <div className={styles.slideContainer}>
        {slides.map((slideItems, slideIndex) => (
          <div
            key={slideIndex}
            className={`${styles.slide} ${slideIndex === currentSlide ? styles.activeSlide : ''}`}
          >
            <ul className={styles.postList}>
              {slideItems.map((post) => (
                <li key={post.ID} className={styles.postItem}>
                  <Link href={`/post/${post.slug}`}>
                    <a className={styles.postLink}>
                      <div className={styles.postNumber}>{post.post_number}</div>
                      <div className={styles.postInfo}>
                        <h3 
                          className={styles.postTitle}
                          dangerouslySetInnerHTML={{ __html: post.post_title }}
                        />
                      </div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
