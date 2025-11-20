'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

/**
 * 업로드된 이미지 정보
 */
export interface UploadedImage {
  url: string;
  alt?: string;
  isFeatured: boolean;
  file?: File; // 업로드 전 로컬 파일
}

interface ImageUploaderProps {
  /**
   * 이미지 목록 변경 핸들러
   */
  onChange: (images: UploadedImage[]) => void;
  /**
   * 초기 이미지 목록 (수정 시)
   */
  initialImages?: UploadedImage[];
  /**
   * 최대 업로드 가능 이미지 수
   */
  maxImages?: number;
}

/**
 * 이미지 업로더 컴포넌트
 *
 * 기능:
 * - 다중 이미지 선택 (드래그앤드롭 + 버튼)
 * - 이미지 미리보기
 * - 대표 이미지 선택 (별표 아이콘)
 * - 개별 이미지 삭제
 * - 클라이언트 측 유효성 검증
 */
export function ImageUploader({
  onChange,
  initialImages = [],
  maxImages = 10,
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 이미지 추가 처리
   */
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      // 최대 이미지 수 확인
      if (images.length + files.length > maxImages) {
        alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
        return;
      }

      setUploading(true);

      try {
        const newImages: UploadedImage[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // 파일 타입 검증
          if (!file.type.startsWith('image/')) {
            alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
            continue;
          }

          // 파일 크기 검증 (5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert(`${file.name}의 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.`);
            continue;
          }

          // 로컬 미리보기 URL 생성
          const url = URL.createObjectURL(file);
          newImages.push({
            url,
            isFeatured: images.length === 0 && i === 0, // 첫 이미지는 자동으로 대표 이미지
            file,
          });
        }

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onChange(updatedImages);
      } catch (error) {
        console.error('이미지 추가 실패:', error);
        alert('이미지 추가 중 오류가 발생했습니다.');
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onChange]
  );

  /**
   * 드래그 앤 드롭 핸들러
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  /**
   * 파일 선택 버튼 클릭
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * 이미지 삭제
   */
  const handleRemove = (index: number) => {
    const removedImage = images[index];

    // Object URL 해제
    if (removedImage.file) {
      URL.revokeObjectURL(removedImage.url);
    }

    const updatedImages = images.filter((_, i) => i !== index);

    // 대표 이미지를 삭제한 경우, 첫 번째 이미지를 대표로 설정
    if (removedImage.isFeatured && updatedImages.length > 0) {
      updatedImages[0].isFeatured = true;
    }

    setImages(updatedImages);
    onChange(updatedImages);
  };

  /**
   * 대표 이미지 변경
   */
  const handleSetFeatured = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isFeatured: i === index,
    }));
    setImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <Label>이미지 (선택사항, 최대 {maxImages}개)</Label>

      {/* 이미지 업로드 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          이미지를 드래그 앤 드롭하거나 버튼을 클릭하세요
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          JPG, PNG, GIF, WebP (최대 5MB)
        </p>
        <Button type="button" variant="outline" onClick={handleButtonClick} disabled={uploading}>
          {uploading ? '업로드 중...' : '이미지 선택'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </div>

      {/* 이미지 미리보기 그리드 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={image.url}
                  alt={image.alt || `이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* 대표 이미지 배지 */}
                {image.isFeatured && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    대표
                  </div>
                )}

                {/* 호버 시 액션 버튼 */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isFeatured && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetFeatured(index)}
                      className="gap-1"
                    >
                      <Star className="h-3 w-3" />
                      대표 설정
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {images.length}/{maxImages}개 이미지 • 별표를 클릭하여 대표 이미지를 설정하세요
        </p>
      )}
    </div>
  );
}
