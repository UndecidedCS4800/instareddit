export interface Teammate {
    id: number,
    name: string,
}

export interface User {
    id: number, // Primary key for User
    username: string,
    email: string,
    password_hash: string,
  }

export type UserResponse = Omit<User, "email" | "password_hash">
export interface UserInfo {
    user: number,
    first_name: string | null,
    last_name: string | null,
    date_of_birth: string | null,
    profile_picture: string | null,
  }

export interface Post {
  id: number, // Primary key for Post
  user: number, // Foreign key to the user
  username: string,
  text: string,
  image: string | null,
  datetime: string,
  community: number, // Foreign key to the community
  community_name: string,
  comments?: Comment[]
}

export interface Comment {
  id: number, // primary key for Comment
  user: number, // reference to the user who made the comment
  username: string,
  post: number, // reference to the associated Post
  text: string, // the content of the comment
  datetime: string, // timestamp of the comment
}

export interface Community {
  id: number, //primary key for Community
  name: string,
  description: string,
  picture: string | null,
  owner: number,
  num_members: number,
}


export interface RecentActivity {
  id: number, // Primary key for Recent Activity
  user: number,
  username: string,
  type: string,
  datetime: string,
}

export interface Like {
  id: number, //primary key for like
  user: number, //Foreign key for the User
  username: string,
  post: number, //Foreign key for the Post
  datetime: string,
}

export interface Dislike {
  id: number, //primary key for like
  user: number, //Foreign key for the User
  username: string,
  post: number, //Foreign key for the Post
  datetime: string,
}

export interface Friendship {
  id: number,
  userid: number,
  friendid: number,
}

export interface CommunityMembers {
  id: number,
  communityid: number,
  userid: number,
}

export interface JWTTokenResponse {
  username: string,
  token: string,
  id: number,
}

export interface PaginationResponse<T> {
  count: number,
  next: string | null,
  prev: string | null,
  results: T[],
}

export interface FriendResponse {
  userId: number,
  friends: Friend[]
}

export type Friend = Pick<User, "id" | "username">

export type ServerError = {
  error: string
}
export interface ChatMessage {
  from: number,
  to: number,
  message: string
}

export interface FriendRequest {
  id: number,
  from_user: number,
  from_username: string,
  to_user: number,
  to_username: string,
}

export interface PostNotifications {
  username: string,
  post_id: number,
  community_id: number,
  when: number,
}

export interface LikeNotifications {
  username: string,
  post_id: number,
  community_id: number,
  when: number,
}

export type Notification = {type: "like" | "comment" } & (PostNotifications | LikeNotifications)

export type ChatHistory = Record<number, ChatMessage[]>
export type UserMeta = Omit<UserInfo, "user">
export type PostRequest = Pick<Post, "text" | "community">
export const isError = <T>(obj: T | ServerError): obj is ServerError => {
  return obj && (obj as ServerError).error !== undefined
}

