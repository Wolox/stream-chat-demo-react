import React, { useEffect, useCallback, useRef } from 'react';
import { Widget } from 'react-chat-widget';
import { StreamChat } from 'stream-chat';

import 'react-chat-widget/lib/styles.css';

function App() {  
  const client = new StreamChat("bey6ehctvy7x");
  const userToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiamxhaGV5In0.Qk1yqCbWliqAZrbWWWmmSTufMNbboxn5XCP0SHcrGx1";
  const channel = useRef(null);
  const state = useRef(null);

  const setUser = useCallback(async () => {
    await client.setUser(
      {
          id: 'jlahey',
          name: 'Jim Lahey'
      },
      userToken
    );
  }, [client]);

  const setChannel = useCallback(async () => {
    channel.current = client.channel('messaging', 'travel', {
      name: 'Awesome channel about traveling',
    });

    state.current = await channel.current.watch();
  }, [client]);

  const handleNewUserMessage = useCallback(async message =>
    await channel.current.sendMessage({
      text: message,
      customField: '123',
    }), []);

  useEffect(() => {
    setUser();
    setChannel();
  }, [setUser, setChannel]);

  return (
    <div className="App">
      <Widget handleNewUserMessage={handleNewUserMessage}/>
    </div>
  );
}

export default App;
