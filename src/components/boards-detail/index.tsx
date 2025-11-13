'use client';

/**
 * BoardsDetail Component (UI Implementation)
 * Design Source: Figma Node IDs 285:32577, 285:32604, 285:32608, 285:32615
 * Last Updated: 2025-01-27
 */

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Button } from '@/commons/components/button';
import { Comments, Comment } from './comments';
import useBoardDetail from './hooks/index.binding.hook';
import styles from './styles.module.css';
import { urls } from '@/commons/constants/url';

const STORAGE_BASE_URL = 'https://storage.googleapis.com/';

const normalizeBoardImageUrl = (source: string): string | null => {
  if (typeof source !== 'string') return null;

  const trimmed = source.trim();

  if (!trimmed) {
    return null;
  }

  const isAbsolute = /^https?:\/\//i.test(trimmed);
  if (isAbsolute) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  if (trimmed.toLowerCase().startsWith('storage.googleapis.com')) {
    return `https://${trimmed}`;
  }

  const sanitized = trimmed.replace(/^\/+/, '');
  return `${STORAGE_BASE_URL}${sanitized}`;
};

/**
 * 날짜 포맷팅 함수
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '');
  } catch {
    return '';
  }
};

/**
 * BoardsDetail 컴포넌트
 * 게시글 상세 페이지를 보여줍니다.
 */
export default function BoardsDetail() {
  // 게시글 데이터 조회
  const { data, loading, error } = useBoardDetail();
  const router = useRouter();
  const imageUrls = useMemo(() => {
    if (!Array.isArray(data?.images)) {
      return [];
    }

    const normalized = data.images
      .map((image) => (typeof image === 'string' ? normalizeBoardImageUrl(image) : null))
      .filter((value): value is string => Boolean(value));

    return Array.from(new Set(normalized));
  }, [data?.images]);
  
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: '홍길동',
      profileImage: '/images/profile05.svg',
      rating: 5,
      content: '살겠노라 살겠노라. 청산에 살겠노라.\n머루랑 다래를 먹고 청산에 살겠노라.\n얄리얄리 얄랑셩 얄라리 얄라',
      date: '2024.11.11',
      isOwner: true
    },
    {
      id: '2',
      author: '애슐리',
      profileImage: '/images/profile04.svg',
      rating: 4,
      content: '살겠노라 살겠노라. 청산에 살겠노라.\n머루랑 다래를 먹고 청산에 살겠노라.\n얄리얄리 얄랑셩 얄라리 얄라',
      date: '2024.11.11',
      isOwner: false
    }
  ]);

  // 게시글 데이터가 로드되면 좋아요/싫어요 상태 초기화
  useEffect(() => {
    if (data?.likeCount !== undefined && data?.dislikeCount !== undefined) {
      // 초기 상태는 false로 유지 (사용자 액션에 따라 변경)
    }
  }, [data]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleCommentSubmit = (content: string, rating: number) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: '새로운 사용자',
      profileImage: '/images/profile_default.svg',
      rating,
      content,
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '.').replace(/\s/g, ''),
      isOwner: true
    };
    setComments(prev => [newComment, ...prev]);
  };

  // 에러 처리: 콘솔에 에러 출력
  useEffect(() => {
    if (error) {
      console.error('게시글 조회 실패:', error);
    }
  }, [error]);

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className={styles.container} data-testid="board-detail-page">
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>불러오는 중…</div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error || !data) {
    return (
      <div className={styles.container} data-testid="board-detail-page">
        <div className={styles.errorContainer}>
          <div className={styles.errorText}>게시글 정보를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid="board-detail-page" data-board-id={data?._id}>
      {/* Gap: 1168 * 40 */}
      <div className={styles.gap40}></div>

      {/* Detail Title Section */}
      <div className={styles.titleSection}>
        <h1 className={styles.title} data-testid="board-title">
          {data?.title || ''}
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
            <span className={styles.profileName} data-testid="board-writer">
              {data?.writer || data?.user?.name || '익명'}
            </span>
          </div>
          <span className={styles.profileDate}>{formatDate(data?.createdAt)}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.metadataIcons}>
          <button className={styles.iconButton}>
            <Image src="/icons/link.svg" alt="링크" width={24} height={24} />
          </button>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className={styles.iconButton} data-testid="board-address-icon">
                  <Image src="/icons/location.svg" alt="위치" width={24} height={24} className="cursor-pointer" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  className={styles.addressTooltip}
                  sideOffset={5}
                >
                  {data?.boardAddress?.address || '주소 정보 없음'}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Content Images */}
      {imageUrls.length > 0 && (
        <div className={styles.imageList}>
          {imageUrls.map((imageUrl, index) => (
            <div className={styles.imageWrapper} key={`${imageUrl}-${index}`}>
              <Image
                src={imageUrl}
                alt={`게시글 이미지 ${index + 1}`}
                width={1168}
                height={656}
                className={styles.image}
                data-testid="board-image"
              />
            </div>
          ))}
        </div>
      )}

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Content Text */}
      <div className={styles.contentText}>
        <p data-testid="board-contents">
          {data?.contents || ''}
        </p>
      </div>

      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>

      {/* Detail Content Youtube Preview */}
      {data?.youtubeUrl && (
        <div className={styles.youtubePreview}>
          <Image
            src="/images/youtube_preview.png"
            alt="유튜브 미리보기"
            width={1280}
            height={512}
            className={styles.youtubeImage}
          />
        </div>
      )}

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
            <span className={`${styles.count} ${isDisliked ? styles.active : ''}`}>
              {data?.dislikeCount || 0}
            </span>
          </button>
          <button className={styles.likeButton} onClick={handleLike}>
            <Image
              src={isLiked ? '/icons/thumb-up-fill.svg' : '/icons/thumb-up-line.svg'}
              alt="좋아요"
              width={24}
              height={24}
            />
            <span className={`${styles.count} ${isLiked ? styles.active : ''}`}>
              {data?.likeCount || 0}
            </span>
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
            onClick={() => router.push(urls.boards.list())}
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
            data-testid="board-edit-button"
            onClick={() => {
              if (!data?._id) return;
              router.push(urls.boards.edit(data._id));
            }}
          >
            수정하기
          </Button>
        </div>
      </div>

      {/* Gap: 1168 * 40 */}
      <div className={styles.gap40}></div>

      {/* Comments Section */}
      <Comments
        comments={comments}
        onSubmit={handleCommentSubmit}
        boardId={data?._id}
      />
    </div>
  );
}

