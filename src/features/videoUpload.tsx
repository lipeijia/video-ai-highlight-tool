'use client';

import { useState, useRef } from 'react';
import { formatFileSize } from '@/lib/utils';
import { useVideoUpload } from '@/hooks/useVideos';
import { VideoHighlight } from '@/types/video';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UploadProgress } from '@/components';
import { CloudUpload, FileVideo } from 'lucide-react';

/**
 * 影片上傳元件的 Props 介面
 */
interface VideoUploadProps {
  /** 影片處理完成後的回調函數 */
  onVideoProcessed?: (data: VideoHighlight) => void;
}

function VideoUpload({ onVideoProcessed }: VideoUploadProps = {}) {
  /* State 狀態管理 */
  
  // 用戶選擇的影片檔案
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 拖拽狀態，用於高亮拖拽區域
  const [dragActive, setDragActive] = useState(false);
  
  // 隱藏的檔案輸入元素的 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Custom Hook 自定義鉤子 */
  
  // 影片上傳相關的狀態和方法
  const {
    mutate: uploadVideo,    // 上傳函數
    isPending,             // 上傳中狀態
    uploadProgress,        // 上傳進度資訊
    error                  // 錯誤訊息
  } = useVideoUpload();

  /* Functions 檔案處理相關 */
  
  /**
   * 處理檔案選擇
   * 驗證檔案類型是否為影片格式，如果有效則設置為選中檔案
   * @param file 用戶選擇的檔案
   */
  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
        toast.error('請選擇有效的影片檔案', {
          description: '支援的格式：MP4, AVI, MOV, WMV',
          duration: 2000,
          position: 'top-center',
          style: {
            background: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive-foreground))',
            border: '1px solid hsl(var(--destructive))'
          }
        });
    }
  };

  /**
   * 移除選中的檔案
   * 清空選中檔案並重置檔案輸入元素的值
   */
  const handleRemoveFile = () => {
    setSelectedFile(null);
    // 清空 input 的 value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 觸發檔案選擇對話框
   * 程式化點擊隱藏的檔案輸入元素
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  /* Drag & Drop 拖拽事件處理 */
  
  /**
   * 處理拖拽懸停事件
   * 當檔案被拖拽到上傳區域上方時，啟用拖拽狀態
   * @param e 拖拽事件
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  /**
   * 處理拖拽離開事件
   * 當檔案離開上傳區域時，停用拖拽狀態
   * @param e 拖拽事件
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  /**
   * 處理拖拽放置事件
   * 當檔案被放置到上傳區域時，獲取第一個檔案並處理
   * @param e 拖拽事件
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /* Upload 上傳處理 */
  
  /**
   * 開始上傳檔案
   * 觸發影片上傳流程，並在成功時通知父元件
   */
  const handleUpload = () => {
    if (!selectedFile) return;

    uploadVideo(selectedFile, {
      onSuccess: (data) => {
        // 上傳成功後，將處理完成的影片資料傳遞給父元件
        if (onVideoProcessed) {
          onVideoProcessed(data);
        }
        // 清空選中的檔案
        setSelectedFile(null);
      }
    });
  };


  return (
    <div className='w-full max-w-2xl mx-auto space-y-6'>
      {/* 拖拽上傳區域 - 支援點擊選擇和拖拽上傳 */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${
            isPending
              ? 'pointer-events-none opacity-50'
              : 'hover:border-emerald-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CloudUpload className='mx-auto h-20 w-20 text-emerald-400 mb-4' />
        <p className='text-lg font-semibold text-gray-700 mb-2'>
          將影片檔案拖拽到此處
        </p>
        <p className='text-gray-500 mb-4'>或者點擊選擇檔案</p>

        {/* 隱藏的檔案輸入元素 */}
        <input
          ref={fileInputRef}
          type='file'
          accept='video/*'
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className='hidden'
          disabled={isPending}
        />

        <Button
          variant='secondary'
          onClick={handleButtonClick}
          disabled={isPending}
        >
          選擇影片檔案
        </Button>
      </div>

      {/* 選中檔案的詳細資訊顯示 */}
      {selectedFile && (
        <div className='bg-gray-50 rounded-lg p-4'>
          <div className='flex items-center space-x-3'>
            <FileVideo className='h-8 w-8 text-blue-500' />
            <div className='flex-1'>
              <p className='font-medium text-gray-900'>{selectedFile.name}</p>
              <p className='text-sm text-gray-500'>
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            {/* 只在非上傳中狀態顯示移除按鈕 */}
            {!isPending && (
              <Button onClick={handleRemoveFile} variant='ghost' size='sm'>
                移除
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 上傳按鈕 - 只在有選中檔案且非上傳中時顯示 */}
      {selectedFile && !isPending && (
        <Button onClick={handleUpload} className='w-full' size='lg'>
          開始上傳並處理
        </Button>
      )}

      {/* 上傳進度顯示元件 */}
      {uploadProgress && (
        <UploadProgress
          progress={uploadProgress.progress}
          stage={uploadProgress.stage}
          message={uploadProgress.message}
        />
      )}
    

      {/* 錯誤訊息顯示 - 使用 toast 通知 */}
      {error &&
        toast.error('上傳失敗！', {
          description: error.message || '請稍後再試',
          duration: 2000,
          position: 'top-center',
          style: {
            background: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive-foreground))',
            border: '1px solid hsl(var(--destructive))'
          }
        })}
    </div>
  );
}


export default VideoUpload;