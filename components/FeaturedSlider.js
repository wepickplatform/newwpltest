// components/FeaturedSlider.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/FeaturedSlider.module.css';

export default function FeaturedSlider({ posts }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [posts.length]);
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };
  
  if (!posts || posts.length === 0) {
    return <div className={styles.noSlides}>추천 게시물이 없습니다.</div>;
  }
  
  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        {posts.map((post, index) => {
          const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
          
          return (
            <div
              key={post.id}
              className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            >
              <Link href={`/post/${post.slug}`}>
                <a className={styles.slideLink}>
                  {featuredMedia && featuredMedia.source_url ? (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={featuredMedia.source_url}
                        alt={post.title.rendered}
                        layout="fill"
                        objectFit="cover"
                        priority={index === currentSlide}
                      />
                    </div>
                  ) : (
                    <div className={styles.noImage}>이미지 없음</div>
                  )}
                  <div className={styles.slideContent}>
                    <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  </div>
                </a>
              </Link>
            </div>
          );
        })}
      </div>
      
      <button className={styles.prevButton} onClick={prevSlide}>
        <span>&lt;</span>
      </button>
      <button className={styles.nextButton} onClick={nextSlide}>
        <span>&gt;</span>
      </button>
      
      <div className={styles.indicators}>
        {posts.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
