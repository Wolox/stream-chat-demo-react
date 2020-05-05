import React, { useEffect, useCallback, useRef } from 'react';
import { Widget } from 'react-chat-widget';
import { StreamChat } from 'stream-chat';

// Import default styles for the react-chat-widget
import 'react-chat-widget/lib/styles.css';

import { DEFAULT_USER } from './constants';

// Use our API secret from env file 
const STREAM_API = process.env.REACT_APP_STREAM_API_SECRET;

function WidgetChat({ user }) {  
  // Create client variable from StreamChat using the api
  const client = new StreamChat(STREAM_API);
  const { id, name } = user;

  const channel = useRef(null);
  const state = useRef(null);

  // Method - Set the user with the strean chat client variable 
  const setUser = useCallback(async () => {
    await client.setUser(
      { id, name },
      client.devToken(id)
    );
  }, [client, id, name]);

  // Method - Set the channel, in this case we are setting a messaging
  // default chat provided by StreamChat
  const setChannel = useCallback(async () => {
    channel.current = client.channel('messaging', 'wolox-support', {
      name: 'Wolox customer support',
    });

    state.current = await channel.current.watch();
  }, [client]);

  // Method - We make use of chat-widget "handleNewUserMessage" prop to update 
  // the chat and send the message to the channel
  const handleNewUserMessage = useCallback(async message =>
    await channel.current.sendMessage({
      text: message
    }), []);

  // Effect - Set the user and channel on first render
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

WidgetChat.defaultProps = {
  user: DEFAULT_USER
};

export default WidgetChat;
