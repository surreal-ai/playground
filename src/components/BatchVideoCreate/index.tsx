import { Box, Button, Dialog, Icon, Message, Progress, Upload } from '@alifd/next';
import { useLocalStorageState } from 'ahooks';
import React from 'react';
import TokenStateMessage from '@site/src/components/TokenStateMessage';
import api from '@site/src/api';
import * as XLSX from 'xlsx';

interface GenerateData {
  pose_id: string;
  voice_name: string;
  text: string;
}

function BatchVideoCreate() {
  const [token] = useLocalStorageState<string>('se-token', { defaultValue: '' });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [generateData, setGenerateData] = React.useState<GenerateData[] | null>(null);
  const [startGenerate, setStartGenerate] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);

  const handleFileParse = React.useCallback(async (file: File) => {
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json<GenerateData>(sheet);
      const vaildSheetData = sheetData.filter((item) => {
        return item.pose_id && item.voice_name && item.text;
      })
      if(vaildSheetData.length > 0) {
        setGenerateData(vaildSheetData);
        Message.success('File parse success');
      } else {
        throw new Error('No vaild data');
      }
    } catch(e) {
      Message.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (startGenerate) {
      let stop = false;
      let success = 0;
      let fail = 0;
      let complete = false;

      (async () => {
        for (let i = 0; i < generateData?.length; i++) {
          if (stop) {
            break;
          }
          setProgress(Math.floor((i + 1) / generateData?.length * 100));
          const item = generateData[i];
          try {
            await postRowDataToGenerateVideo(item);
            success++;
          } catch (e) {
            Message.error(`Video ${i + 1} submit error: ` + e.message);
            fail++;
          }
        }
        complete = true;
        Message.success(`Submit success: ${success}, fail: ${fail}`);
        setStartGenerate(false);
      })();

      return () => {
        stop = true;
        if (!complete) {
          Message.warning('Submit canceled');
        }
      }
    }
  }, [generateData, startGenerate]);

  const handleFileSelect = React.useCallback((files: any[]) => {
    if(files.length > 0) {
      handleFileParse(files[0].originFileObj);
    } else {
      setGenerateData(null);
    }
    return true;
  },[handleFileParse]);

  const handleSubmit = React.useCallback(async () => {
    if (loading || !generateData) {
      Message.error('Please select file first');
      return;
    }

    setStartGenerate(true);
  }, [loading, generateData]);

  return (
    <Box spacing={12}>
      <TokenStateMessage />
      <Upload.Dragger
        listType="text"
        accept=".xlsx, .xls, .csv"
        autoUpload={false}
        onChange={handleFileSelect}
        limit={1}
      >
        <div className="next-upload-drag">
          <p className="next-upload-drag-icon">
            <Icon type="upload" />
          </p>
          <p className="next-upload-drag-text">
            Click or drag file here
          </p>
          <p className="next-upload-drag-hint">Supports .xlsx, .xls, .csv </p>
        </div>
      </Upload.Dragger>
      {
        loading ? (
          <Message type="loading" title="waiting file parse" />
        ): null
      }
      {
        (!loading && generateData?.length) ? (
          <div>generate data number: {generateData.length}</div>
        ) : null
      }
      <div>
        <Button
          size={'large'}
          type="primary"
          disabled={!token}
          onClick={handleSubmit}
        >To Generate Video</Button>
      </div>
      <div>
        <Dialog v2
          title="Video Generate Data Submit"
          visible={startGenerate}
          footerActions={['cancel']}
          cancelProps={{ children: 'Cancel' }}
          onClose={() => {
            setStartGenerate(false);
          }}
        >
          <Box>
            <div>Data Submiting, close this dialog will stop submit</div>
            <div>
              <Progress percent={progress} />
            </div>
          </Box>
        </Dialog>
      </div>
    </Box>
  );
}

const postRowDataToGenerateVideo = async (data: GenerateData) => {
  const { text, voice_name, pose_id } = data;
  const audioResult = await api.engine.voiceGenerate({ text, voice_name });
  const videoResult = await api.engine.videoGenerate({
    audio_url: audioResult.url,
    pose_id,
  });
  return videoResult;
}

export default BatchVideoCreate;
