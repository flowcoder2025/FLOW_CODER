'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  ImageIcon,
  FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback, useImperativeHandle, forwardRef, useRef } from 'react';

/**
 * Tiptap 리치 텍스트 에디터 컴포넌트
 *
 * 기능:
 * - 굵게, 기울임, 코드, 링크
 * - 제목 (H1, H2)
 * - 리스트 (순서 있음, 순서 없음)
 * - 코드 블록, 인용
 * - 이미지 업로드 (파일 선택)
 * - HTML/마크다운 직접 입력 모드
 * - 외부에서 이미지 삽입 가능 (ref.insertImageUrl)
 *
 * @see https://tiptap.dev/docs/editor/introduction
 */

export interface EditorProps {
  /** 초기 콘텐츠 (HTML) */
  content?: string;
  /** 콘텐츠 변경 핸들러 */
  onChange?: (html: string) => void;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 편집 가능 여부 */
  editable?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /**
   * 이미지 업로드 핸들러
   * 툴바에서 이미지 아이콘 클릭 시 파일을 전달
   * 부모 컴포넌트에서 이미지를 처리하고 insertImageUrl로 삽입
   */
  onImageUpload?: (file: File) => void;
}

/**
 * Editor ref에서 호출 가능한 메서드
 */
export interface EditorRef {
  /** 이미지 URL을 본문에 삽입 */
  insertImageUrl: (url: string, alt?: string) => void;
  /** 현재 HTML 가져오기 */
  getHTML: () => string;
}

/**
 * 마크다운 이미지 문법을 HTML로 변환
 * ![alt](url) → <img src="url" alt="alt">
 */
function convertMarkdownImagesToHtml(text: string): string {
  // 마크다운 이미지: ![alt text](url)
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  return text.replace(markdownImageRegex, '<img src="$2" alt="$1">');
}

/**
 * 이미지 URL 유효성 검사
 * http://, https://, blob: (로컬 업로드), data: (base64) 허용
 */
function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'blob:', 'data:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export const Editor = forwardRef<EditorRef, EditorProps>(function Editor({
  content = '',
  onChange,
  placeholder = '내용을 입력하세요...',
  editable = true,
  className = '',
  onImageUpload,
}, ref) {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceContent, setSourceContent] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        // StarterKit에 포함된 link 비활성화 (별도 Link extension 사용)
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
        allowBase64: true,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // ref를 통해 외부에서 호출 가능한 메서드 노출
  useImperativeHandle(ref, () => ({
    insertImageUrl: (url: string, alt?: string) => {
      if (editor && isValidImageUrl(url)) {
        editor.chain().focus().setImage({ src: url, alt: alt || '' }).run();
      }
    },
    getHTML: () => {
      return editor?.getHTML() || '';
    },
  }), [editor]);

  // content prop 변경 시 에디터 업데이트
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // 소스 모드 진입 시 현재 HTML 가져오기
  useEffect(() => {
    if (isSourceMode && editor) {
      setSourceContent(editor.getHTML());
    }
  }, [isSourceMode, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL을 입력하세요:', previousUrl);

    // 취소한 경우
    if (url === null) {
      return;
    }

    // 빈 문자열인 경우 링크 제거
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // 링크 설정
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // 이미지 버튼 클릭
  const handleImageClick = useCallback(() => {
    if (onImageUpload) {
      // 파일 선택 다이얼로그 열기
      imageInputRef.current?.click();
    } else {
      // fallback: URL 입력 방식
      if (!editor) return;
      const url = window.prompt('이미지 URL을 입력하세요:');
      if (!url) return;
      if (!isValidImageUrl(url)) {
        alert('유효한 이미지 URL을 입력해주세요.');
        return;
      }
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor, onImageUpload]);

  // 파일 선택 시 처리
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 최대 5MB까지 가능합니다.');
      return;
    }

    // 부모에게 파일 전달
    onImageUpload?.(file);

    // input 초기화 (같은 파일 다시 선택 가능하도록)
    e.target.value = '';
  }, [onImageUpload]);

  const toggleSourceMode = useCallback(() => {
    if (!editor) return;

    if (isSourceMode) {
      // 소스 모드 → 비주얼 모드: 마크다운 이미지 변환 후 적용
      const convertedContent = convertMarkdownImagesToHtml(sourceContent);
      editor.commands.setContent(convertedContent);
      onChange?.(convertedContent);
    } else {
      // 비주얼 모드 → 소스 모드: 현재 HTML 가져오기
      setSourceContent(editor.getHTML());
    }

    setIsSourceMode(!isSourceMode);
  }, [editor, isSourceMode, sourceContent, onChange]);

  const handleSourceChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceContent(e.target.value);
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* 숨겨진 파일 input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Toolbar */}
      {editable && (
        <div className="bg-muted border-b p-2 flex flex-wrap gap-1 items-center">
          {/* 텍스트 스타일 */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run() || isSourceMode}
            className={editor.isActive('bold') ? 'bg-primary text-primary-foreground' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run() || isSourceMode}
            className={editor.isActive('italic') ? 'bg-primary text-primary-foreground' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run() || isSourceMode}
            className={editor.isActive('code') ? 'bg-primary text-primary-foreground' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            disabled={isSourceMode}
            className={editor.isActive('link') ? 'bg-primary text-primary-foreground' : ''}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* 제목 */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            disabled={isSourceMode}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : ''}
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={isSourceMode}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : ''}
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* 리스트 */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={isSourceMode}
            className={editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : ''}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={isSourceMode}
            className={editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* 코드 블록 & 인용 */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={isSourceMode}
            className={editor.isActive('codeBlock') ? 'bg-primary text-primary-foreground' : ''}
          >
            <Code2 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={isSourceMode}
            className={editor.isActive('blockquote') ? 'bg-primary text-primary-foreground' : ''}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* 이미지 삽입 */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImageClick}
            disabled={isSourceMode}
            title="이미지 업로드"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          {/* 소스 코드 모드 토글 */}
          <div className="w-px h-6 bg-border mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleSourceMode}
            className={isSourceMode ? 'bg-primary text-primary-foreground' : ''}
            title="HTML/마크다운 직접 입력"
          >
            <FileCode className="h-4 w-4" />
          </Button>

          {isSourceMode && (
            <span className="text-xs text-muted-foreground ml-2">
              HTML 또는 마크다운 이미지 (![alt](url)) 입력 가능
            </span>
          )}
        </div>
      )}

      {/* Editor / Source Mode */}
      {isSourceMode ? (
        <textarea
          value={sourceContent}
          onChange={handleSourceChange}
          className="w-full min-h-[300px] p-4 font-mono text-sm bg-background focus:outline-none resize-y"
          placeholder="HTML 또는 마크다운 이미지 문법을 직접 입력하세요.&#10;&#10;예시:&#10;- HTML: <img src=&quot;https://example.com/image.jpg&quot; alt=&quot;설명&quot;>&#10;- 마크다운: ![이미지 설명](https://example.com/image.jpg)"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
});
