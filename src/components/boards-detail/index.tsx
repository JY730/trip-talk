'use client';

/**
 * BoardsDetail Component (UI Implementation)
 * Design Source: Figma Node IDs 285:32577, 285:32604, 285:32608, 285:32615
 * Last Updated: 2025-10-22
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/commons/components/button';
import styles from './styles.module.css';

/**
 * BoardsDetail 컴포넌트
 * 게시글 상세 페이지를 보여줍니다.
 */
export default function BoardsDetail() {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  return (
    <div className={styles.container}>
      {/* Gap: 1168 * 40 */}
      <div className={styles.gap40}></div>

      {/* Detail Title Section */}
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          살어리 살어리랏다 쳥산(靑山)애 살어리랏다멀위랑 ᄃᆞ래랑 먹고 쳥산(靑山)애 살어리랏다얄리얄리 얄랑셩 얄라리 얄라
        </h1>
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Meta Data Section */}
      <div className={styles.metadataSection}>
        <div className={styles.metadataProfile}>
          <div className={styles.profileInfo}>
            <Image
              src="/images/profile_default.svg"
              alt="프로필"
              width={24}
              height={24}
              className={styles.profileImage}
            />
            <span className={styles.profileName}>홍길동</span>
          </div>
          <span className={styles.profileDate}>2024.11.11</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.metadataIcons}>
          <button className={styles.iconButton}>
            <Image src="/icons/link.svg" alt="링크" width={24} height={24} />
          </button>
          <button className={styles.iconButton}>
            <Image src="/icons/location.svg" alt="위치" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Content Image */}
      <div className={styles.contentImage}>
        <Image
          src="/images/detail_image.png"
          alt="상세 이미지"
          width={400}
          height={531}
          className={styles.image}
        />
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Content Text */}
      <div className={styles.contentText}>
        <p>
          살겠노라 살겠노라. 청산에 살겠노라.<br />
          머루랑 다래를 먹고 청산에 살겠노라.<br />
          얄리얄리 얄랑셩 얄라리 얄라<br />
          <br />
          우는구나 우는구나 새야. 자고 일어나 우는구나 새야.<br />
          너보다 시름 많은 나도 자고 일어나 우노라.<br />
          얄리얄리 얄라셩 얄라리 얄라<br />
          <br />
          갈던 밭(사래) 갈던 밭 보았느냐. 물 아래(근처) 갈던 밭 보았느냐<br />
          이끼 묻은 쟁기를 가지고 물 아래 갈던 밭 보았느냐.<br />
          얄리얄리 얄라셩 얄라리 얄라<br />
          <br />
          이럭저럭 하여 낮일랑 지내 왔건만<br />
          올 이도 갈 이도 없는 밤일랑 또 어찌 할 것인가.<br />
          얄리얄리 얄라셩 얄라리 얄라<br />
          <br />
          어디다 던지는 돌인가 누구를 맞히려던 돌인가.<br />
          미워할 이도 사랑할 이도 없이 맞아서 우노라.<br />
          얄리얄리 얄라셩 얄라리 얄라<br />
          <br />
          살겠노라 살겠노라. 바다에 살겠노라.<br />
          나문재, 굴, 조개를 먹고 바다에 살겠노라.<br />
          얄리얄리 얄라셩 얄라리 얄라<br />
          <br />
          가다가 가다가 듣노라. 에정지(미상) 가다가 듣노라.<br />
          사슴(탈 쓴 광대)이 솟대에 올라서 해금을 켜는 것을 듣노라.<br />
          얄리얄리 얄라셩 얄라리 얄라<br />
          <br />
          가다 보니 배불룩한 술독에 독한 술을 빚는구나.<br />
          조롱박꽃 모양 누룩이 매워 (나를) 붙잡으니 내 어찌 하리이까.[1]<br />
          얄리얄리 얄라셩 얄라리 얄라
        </p>
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Content Youtube Preview */}
      <div className={styles.youtubePreview}>
        <Image
          src="/images/youtube_preview.png"
          alt="유튜브 미리보기"
          width={1280}
          height={512}
          className={styles.youtubeImage}
        />
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Content Like or Dislike */}
      <div className={styles.likeDislikeSection}>
        <div className={styles.likeDislikeButtons}>
          <button className={styles.likeButton} onClick={handleDislike}>
            <Image
              src={isDisliked ? '/icons/thumb-down-fill.svg' : '/icons/thumb-down-line.svg'}
              alt="싫어요"
              width={24}
              height={24}
            />
            <span className={`${styles.count} ${isDisliked ? styles.active : ''}`}>24</span>
          </button>
          <button className={styles.likeButton} onClick={handleLike}>
            <Image
              src={isLiked ? '/icons/thumb-up-fill.svg' : '/icons/thumb-up-line.svg'}
              alt="좋아요"
              width={24}
              height={24}
            />
            <span className={`${styles.count} ${isLiked ? styles.active : ''}`}>12</span>
          </button>
        </div>
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Footer Buttons */}
      <div className={styles.detailFooter}>
        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            styleType="outline"
            size="large"
            theme="light"
            shape="rectangle"
            leftIcon={<Image src="/icons/menu.svg" alt="목록" width={24} height={24} />}
            className={styles.footerButton}
          >
            목록으로
          </Button>
          <Button
            variant="secondary"
            styleType="outline"
            size="large"
            theme="light"
            shape="rectangle"
            leftIcon={<Image src="/icons/edit.svg" alt="수정" width={24} height={24} />}
            className={styles.footerButton}
          >
            수정하기
          </Button>
        </div>
      </div>

      {/* Gap: 1168 * 40 */}
      <div className={styles.gap40}></div>

      {/* Retrospect Input: 1168 * 304 */}
      <div className={styles.retrospectInput}>Retrospect Input</div>

      {/* Gap: 1168 * 40 */}
      <div className={styles.gap40}></div>

      {/* Retrospect List: 1168 * 392 */}
      <div className={styles.retrospectList}>Retrospect List</div>
    </div>
  );
}

