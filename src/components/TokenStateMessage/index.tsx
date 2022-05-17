import { Message } from '@alifd/next';
import { useLocalStorageState } from 'ahooks';
import React from 'react';

function TokenStateMessage() {
  const [token] = useLocalStorageState<string>('se-token', { defaultValue: '' });

  return (
    !token ? (
      <Message type="error" title={<div>Please <a href={'get-token'}>get token and save</a> first</div>} />
    ) : null
  );
}

export default TokenStateMessage;
