export interface Teammate {
    id: number,
    name: string,
}

export interface user {
    id: number, // Primary key for User
    username: string,
    email: string,
    password_hash: string,
  }

export interface userinfo {
    user: number,
    first_name: string,
    last_name: string,
    date_of_birth: string,
    profile_picture: string,
  }

export interface post {
  id: number, // Primary key for Post
  user: number, // Foreign key to the user
  text: string,
  image: string,
  datetime: string,
  community: number, // Foreign key to the community
}

export interface comment {
  id: number, // primary key for Comment
  user: number, // reference to the user who made the comment
  post: number, // reference to the associated Post
  text: string, // the content of the comment
  datetime: string, // timestamp of the comment
}

export interface community {
  id: number, //primary key for Community
  name: string,
  description: string,
  picture: string,
  owner: number,
}

export interface recentactivity {
  id: number, // Primary key for Recent Activity
  userid: number, // Foreign key for the User
  postid: number, //Foreign key for the Post
  type: string,
  datetime: string,
}

export interface like {
  id: number, //primary key for like
  user: number, //Foreign key for the User
  post: number, //Foreign key for the Post
  datetime: string,
}

export interface dislike {
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
  token: string,
}