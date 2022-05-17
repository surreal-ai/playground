import { Message } from '@alifd/next';
import { useLocalStorageState } from 'ahooks';
import React from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

function TokenStateMessage() {
  const [token] = useLocalStorageState<string>('se-token', { defaultValue: '' });
  const { withBaseUrl } = useBaseUrlUtils();

  return (
    !token ? (
      <Message
        type="error"
        title={<div>Please <a href={withBaseUrl('/docs/get-token')}>get token and save</a> first</div>}
      />
    ) : null
  );
}

export default TokenStateMessage;
