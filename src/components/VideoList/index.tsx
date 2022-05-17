import { Box, Message, Table } from '@alifd/next';
import React from 'react';
import TokenStateMessage from '@site/src/components/TokenStateMessage';
import { useLocalStorageState } from 'ahooks';
import api from '@site/src/api';
import { VideoListItem } from '@site/src/api/engine';
import BrowserOnly from '@docusaurus/BrowserOnly';

function VideoList() {
  const [token] = useLocalStorageState<string>('se-token', { defaultValue: '' });
  const [videoListData, setVideoListData] = React.useState<VideoListItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (token) {
      setLoading(true);
      api.engine.getVideoList().then(res => {
        setVideoListData(res.reverse());
      }).catch((error)=>{
        Message.error(error?.message || 'get video list error');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [token]);
  return (
    <Box spacing={12}>
      <TokenStateMessage />
      <div>
        <Table
          dataSource={videoListData}
          emptyContent={<div>No videos</div>}
          tableLayout={'auto'}
          hasBorder={false}
          loading={loading}
        >
          <Table.Column title="Id" dataIndex="video_id" width={160} />
          <Table.Column title="Status" dataIndex="status" width={100} />
          <Table.Column title="Video" dataIndex="video_url" cell={(value) => <a href={value} target="_blank">{value}</a>} />
        </Table>
      </div>
    </Box>
  );
}

export default () => (
  <BrowserOnly>
    {() => <VideoList />}
  </BrowserOnly>
);
