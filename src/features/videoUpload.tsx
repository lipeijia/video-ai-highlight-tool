// src/components/video-upload.tsx
'use client';

import { useState, useRef } from 'react';
import { formatFileSize } from '@/lib/utils';
import { useVideoUpload } from '@/hooks/useVideos';
import { VideoHighlight } from '@/types/video';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UploadProgress } from '@/components';
import { CloudUpload, FileVideo } from 'lucide-react';

interface VideoUploadProps {
  onVideoProcessed?: (data: VideoHighlight) => void;
}

function VideoUpload({ onVideoProcessed }: VideoUploadProps = {}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    mutate: uploadVideo,
    isPending,
    uploadProgress,
    error
  } = useVideoUpload();

  //
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


  const handleRemoveFile = () => {
    setSelectedFile(null);
    // 清空 input 的 value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 處理拖拽進入事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  // 處理拖拽放置事件
  // 注意：這裡的 e.dataTransfer.files 只會包含一個
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadVideo(selectedFile, {
      onSuccess: (data) => {
        // 往父層傳遞處理完成的影片
        if (onVideoProcessed) {
          onVideoProcessed(data);
        }
        setSelectedFile(null);
      }
    });
  };


  return (
    <div className='w-full max-w-2xl mx-auto space-y-6'>
      {/* 拖拽上傳區域 */}
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

      {/* 選中的檔案資訊 */}
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
            {!isPending && (
              <Button onClick={handleRemoveFile} variant='ghost' size='sm'>
                移除
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 上傳按鈕 */}
      {selectedFile && !isPending && (
        <Button onClick={handleUpload} className='w-full' size='lg'>
          開始上傳並處理
        </Button>
      )}

      {/* 上傳進度顯示 */}
      {uploadProgress && (
        <UploadProgress
          progress={uploadProgress.progress}
          stage={uploadProgress.stage}
          message={uploadProgress.message}
        />
      )}
    

      {/* 錯誤訊息 */}
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