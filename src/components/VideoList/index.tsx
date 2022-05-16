import { Box, Table } from '@alifd/next';
import React from 'react';
import TokenStateMessage from '@site/src/components/TokenStateMessage';

function VideoList() {
  return (
    <Box spacing={12}>
      <TokenStateMessage />
      <div>
        <Table
          dataSource={[]}
          emptyContent={<div>No videos</div>}
          tableLayout={'auto'}
          hasBorder={false}
        >
          <Table.Column title="Id" dataIndex="id" />
          <Table.Column title="Title" dataIndex="title" />
          <Table.Column title="123" dataIndex="we"/>
        </Table>
      </div>
    </Box>
  );
}

export default VideoList;
