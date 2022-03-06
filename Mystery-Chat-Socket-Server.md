# Mystery-Chat-Socket-Server


## Header <auth>

- ~~~ json
  {
    "authorization" : "<jwt token>"
  }

---

## Emits

- **recentConnects** 

  - used to fetch recent connects 

  - >Payload
    >
    >```json
    >{
    >  "search" : "<search string>"
    >}
    >```

- **message** 

  - used to send message to specific user

  - >
    >
    >```json
    >{
    >  "message" : "<string message>",
    >  "toUserId" : "<uuid>"
    >}
    >```

- **recentChats** 

  - used to fetch user chat history

  - >
    >
    >```json
    >{
    >  "userId" : "<uuid>",
    >  "page" : "<number>",
    >  "limit" : "<number>"
    >}
    >```

## Listeners

- success
- createChat
- message
- chatHistory
- recentConnects
- recentChats
- error
- onlineUsers
- reconnected
- disconnected





