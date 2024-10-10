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

export interface UserInfo {
    user: number,
    first_name: string,
    last_name: string,
    date_of_birth: string,
    profile_picture: string,
  }

export interface Post {
  id: number, // Primary key for Post
  user: number, // Foreign key to the user
  text: string,
  image: string | null,
  datetime: string,
  community: number, // Foreign key to the community
  comments?: Comment[]
}

export interface Comment {
  id: number, // primary key for Comment
  user: number, // reference to the user who made the comment
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
  userid: number, // Foreign key for the User
  postid: number, //Foreign key for the Post
  type: string,
  datetime: string,
}

export interface Like {
  id: number, //primary key for like
  user: number, //Foreign key for the User
  post: number, //Foreign key for the Post
  datetime: string,
}

export interface Dislike {
  id: number, //primary key for like
  user: number, //Foreign key for the User
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
}

export interface PaginationResponse<T> {
  count: number,
  next: string | null,
  prev: string | null,
  results: T[],
}

export type Friend = number;

export type ServerError = {
  error: string
}

export type PostRequest = Pick<Post, "text" | "community">
export const isError = <T>(obj: T | ServerError): obj is ServerError => {
  return (obj as ServerError).error !== undefined
}

