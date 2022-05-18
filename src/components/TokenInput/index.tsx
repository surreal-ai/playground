import React from 'react';
import { Box, Button, Input, Message } from '@alifd/next';
import { useLocalStorageState } from 'ahooks';

function TokenInput() {
  const [token, setToken] = useLocalStorageState<string>('se-token', { defaultValue: '' });
  const [inputValue, setInputValue] = React.useState<string>(token);

  const handleClick = React.useCallback(() => {
    Message.success('token saved');
    setToken(inputValue);
  }, [inputValue, setToken]);

  return (
    <Box direction="row" spacing={12}>
      <Input.Password
        size="large"
        style={{ width: 300 }}
        value={inputValue}
        onChange={setInputValue}
      />
      <Button
        type="primary"
        size={'large'}
        onClick={handleClick}
      >Save</Button>
    </Box>
  );
}

export default TokenInput;
