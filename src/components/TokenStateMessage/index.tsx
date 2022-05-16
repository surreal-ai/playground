import { Message } from '@alifd/next';
import { useLocalStorageState } from 'ahooks';
import React from 'react';

function TokenStateMessage() {
  const [token] = useLocalStorageState<string>('se-token', { defaultValue: '' });

  return (
    !token ? (
      <Message type="error" title="Please get token and save first" />
    ) : null
  );
}

export default TokenStateMessage;
