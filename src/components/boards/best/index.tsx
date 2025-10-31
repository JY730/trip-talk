"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import useBestBoardsBinding from "./hooks/index.binding.hook";
import type { BestBoardItem } from "./hooks/index.binding.hook";
import styles from "./styles.module.css";

const DEFAULT_THUMBNAIL = "/images/best_image01.png";
const DEFAULT_PROFILE_IMAGE = "/images/profile_default.svg";
const STORAGE_BASE_URL = "https://storage.googleapis.com/";

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}.${month}.${day}`;
};

const getDateTimeAttribute = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

export default function BestBoards() {
  const router = useRouter();
  const { bestBoards, loading, errorMessage, refetch } = useBestBoardsBinding();

  const getBoardThumbnail = (board: BestBoardItem): string => {
    const candidates =
      board.images
        ?.map((src) => (typeof src === "string" ? src.trim() : ""))
        .filter((src) => Boolean(src)) ?? [];

    if (candidates.length === 0) {
      return DEFAULT_THUMBNAIL;
    }

    const primary = candidates[0];
    
    // 빈 문자열이나 유효하지 않은 경우 기본 이미지 반환
    if (!primary || primary.length === 0) {
      return DEFAULT_THUMBNAIL;
    }
    
    // 이미 절대 URL인 경우 그대로 사용
    if (primary.startsWith("http://") || primary.startsWith("https://")) {
      return primary;
    }
    
    // 로컬 경로인 경우 그대로 사용
    if (primary.startsWith("/")) {
      return primary;
    }
    
    // codecamp-file-storage로 시작하는 상대 경로를 Google Storage URL로 변환
    if (primary.includes("codecamp-file-storage") || !primary.startsWith("http")) {
      return `${STORAGE_BASE_URL}${primary}`;
    }

    // 예외 상황: 기본 이미지 반환
    return DEFAULT_THUMBNAIL;
  };

  const handleCardClick = (boardId: string) => {
    router.push(`/boards/${boardId}`);
  };

  const handleRetry = () => {
    void refetch().catch(() => {
      // refetch 실패 시 상태는 훅에서 관리됨
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <p className={styles.statusMessage} data-testid="best-board-loading">
          로딩 중입니다.
        </p>
      );
    }

    if (errorMessage) {
      return (
        <div className={styles.errorContainer} role="alert">
          <p className={styles.errorMessage} data-testid="best-board-error">
            {errorMessage}
          </p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={handleRetry}
            data-testid="best-board-retry"
          >
            다시 시도
          </button>
        </div>
      );
    }

    if (bestBoards.length === 0) {
      return (
        <p className={styles.statusMessage} data-testid="best-board-empty">
          베스트 게시글이 없습니다.
        </p>
      );
    }

    return (
      <ul className={styles.cardList} role="list" data-testid="best-board-list">
        {bestBoards.map((board) => (
          <li key={board._id} className={styles.card}>
              <button
                type="button"
                className={styles.cardButton}
                onClick={() => handleCardClick(board._id)}
                data-testid="best-board-card"
              >
                <div className={styles.thumbnailWrapper}>
                  <Image
                    src={getBoardThumbnail(board)}
                    alt={`${board.title} 대표 이미지`}
                    width={112}
                    height={152}
                    className={styles.thumbnailImage}
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== DEFAULT_THUMBNAIL) {
                        target.src = DEFAULT_THUMBNAIL;
                      }
                    }}
                  />
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle} data-testid="best-board-title">
                    {board.title}
                  </h3>

                  <div className={styles.profileRow}>
                    <div className={styles.profileImageWrapper}>
                      <Image
                        src={DEFAULT_PROFILE_IMAGE}
                        alt={`${board.writer} 프로필 이미지`}
                        width={24}
                        height={24}
                        className={styles.profileImage}
                      />
                    </div>
                    <span className={styles.profileName} data-testid="best-board-writer">
                      {board.writer}
                    </span>
                  </div>

                  <div className={styles.metaRow}>
                    <div className={styles.likes}>
                      <Image src="/icons/good.svg" alt="좋아요" width={24} height={24} />
                      <span className={styles.likeCount} data-testid="best-board-like-count">
                        {board.likeCount}
                      </span>
                    </div>
                    <time
                      className={styles.date}
                      dateTime={getDateTimeAttribute(board.createdAt)}
                      data-testid="best-board-created-at"
                    >
                      {formatDate(board.createdAt)}
                    </time>
                  </div>
                </div>
              </button>
            </li>
        ))}
      </ul>
    );
  };

  return (
    <section
      className={styles.container}
      aria-labelledby="best-talks-heading"
      data-testid="best-board-section"
    >
      <div className={styles.header}>
        <h2 id="best-talks-heading" className={styles.title}>
          오늘 핫한 트립토크
        </h2>
      </div>

      {renderContent()}
    </section>
  );
}

