import {CheckCircle} from 'lucide-react';
import {Progress} from '@/components/ui/progress';
import { UploadProgressProps  } from '@/types/video';

function UploadProgress(props: UploadProgressProps) {
  const { stage, message, progress } = props;
  const getStageText = (stage: string) => {
    const stages = {
      uploading: '檔案上傳',
      processing: 'AI 分析',
      generating_transcript: '生成字幕',
      identifying_highlights: '識別重點',
      completed: '處理完成'
    };
    return stages[stage as keyof typeof stages] || stage;
  };

  return (
    <div className='space-y-4'>
      <div className='bg-white border rounded-lg p-6'>
        <div className='flex items-center space-x-3 mb-4'>
          {stage === 'completed' ? (
            <CheckCircle className='h-6 w-6 text-green-500' />
          ) : (
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500' />
          )}
          <div>
            <p className='font-medium text-gray-900'>{message}</p>
            <p className='text-sm text-gray-500'>階段: {getStageText(stage)}</p>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>進度</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className='h-2' />
        </div>
      </div>
    </div>
  );
}

export default UploadProgress;
