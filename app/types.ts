export interface SafeUser {
    id:             string
    firstName:      string
    lastName:       string
    fullName:       string
    email:          string
    hashedPassword: string
    createdAt:      Date
    updatedAt:      Date
    avatarUrl?:     any
    following:      Array<string>
    followers:      Array<string>

    isActive:       boolean
    messages?:      SafeMessages

    notification?:   SafeNotification | any


    posts?:         SafePosts | any
    comments?:      SafeComment | any
}


export interface SafeConversation {
    id:            string 
    users:         Array<string>
    createdAt:     Date
    updatedAt:     Date
    messages?:     SafeMessages | any


    user?:         SafeUser | any
}


export interface SafeMessages {
    id:              string
    message:         string
    conversationId:  string
    conversation:   SafeConversation
    userId:          string
    user:           SafeUser 
    seen:           boolean
    images:         Array<String>

    createdAt:     Date
    updatedAt:     Date
}



export interface SafeNotification {
    id:              string
    userId:          string
    user:            SafeUser
    content:         String

    senderUserId:    String
    senderUser:      SafeUser
    link:            string

    createdAt:     Date
    updatedAt:     Date
}


export interface SafePosts {
    id:         string
    userId:      string
    user:        SafeUser
    images:      Array<string>
    title?:      string

    likes:      Array<string>

    createdAt: Date
    updatedAt: Date
}

export interface SafeComment {
    id:         string
    userId:      string
    user:        SafeUser
    content:     string

    likes:      Array<string>

    postId:     string
    post:       SafePosts

    createdAt: Date
    updatedAt: Date
}