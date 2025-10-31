"use client";

/**
 * Best Boards Component
 * Design Source: Figma Node ID 285:33460
 * Last Updated: 2025-10-31
 */

import Image from "next/image";
import styles from "./styles.module.css";

type BestTalk = {
  id: number;
  title: string;
  author: string;
  thumbnail: string;
  profile: string;
  likes: number;
  date: string;
};

const BEST_TALKS: BestTalk[] = [
  {
    id: 1,
    title: "제주 살이 1일차 청산별곡이 생각나네요",
    author: "홍길동",
    thumbnail: "/images/best_image01.png",
    profile: "/images/profile01.svg",
    likes: 24,
    date: "2024.11.11",
  },
  {
    id: 2,
    title: "길 걷고 있었는데 고양이한테 간택 받았어요",
    author: "홍길동",
    thumbnail: "/images/best_image02.png",
    profile: "/images/profile02.svg",
    likes: 24,
    date: "2024.11.11",
  },
  {
    id: 3,
    title: "강릉 여름바다 보기 좋네요 서핑하고 싶어요!",
    author: "홍길동",
    thumbnail: "/images/best_image03.png",
    profile: "/images/profile03.svg",
    likes: 24,
    date: "2024.11.11",
  },
  {
    id: 4,
    title: "누가 양양 핫하다고 했어 나밖에 없는데?",
    author: "홍길동",
    thumbnail: "/images/best_image04.png",
    profile: "/images/profile04.svg",
    likes: 24,
    date: "2024.11.11",
  },
];

const formatDateTime = (date: string): string => {
  return date.replace(/\./g, "-");
};

export default function BestBoards() {
  return (
    <section className={styles.container} aria-labelledby="best-talks-heading">
      <div className={styles.header}>
        <h2 id="best-talks-heading" className={styles.title}>
          오늘 핫한 트립토크
        </h2>
      </div>

      <ul className={styles.cardList} role="list">
        {BEST_TALKS.map(({ id, title, author, thumbnail, profile, likes, date }) => (
          <li key={id} className={styles.card}>
            <div className={styles.thumbnailWrapper}>
              <Image
                src={thumbnail}
                alt={`${title} 대표 이미지`}
                width={112}
                height={152}
                className={styles.thumbnailImage}
              />
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{title}</h3>

              <div className={styles.profileRow}>
                <div className={styles.profileImageWrapper}>
                  <Image
                    src={profile}
                    alt={`${author} 프로필 이미지`}
                    width={24}
                    height={24}
                    className={styles.profileImage}
                  />
                </div>
                <span className={styles.profileName}>{author}</span>
              </div>

              <div className={styles.metaRow}>
                <div className={styles.likes}>
                  <Image src="/icons/good.svg" alt="좋아요" width={24} height={24} />
                  <span className={styles.likeCount}>{likes}</span>
                </div>
                <time className={styles.date} dateTime={formatDateTime(date)}>
                  {date}
                </time>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

