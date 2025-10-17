'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/pagination';

// 커스텀 스타일
import styles from './styles.module.css';

const bannerImages = [
  '/images/banner01.png',
  '/images/banner02.png',
  '/images/banner03.png',
];

export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: styles.swiperBullet,
          bulletActiveClass: styles.swiperBulletActive,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className={styles.swiper}
      >
        {bannerImages.map((image, index) => (
          <SwiperSlide key={index} className={styles.swiperSlide}>
            <div className={styles.imageWrapper}>
              <Image
                src={image}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                className={styles.bannerImage}
                sizes="100vw"
              />
              <div className={styles.overlay} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

