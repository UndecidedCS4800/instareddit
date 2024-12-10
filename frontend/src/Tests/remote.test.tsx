import {
    registerUser,
    loginUser,
    getCommunities,
    createPost,
    postComment,
} from "../remote";
import { ServerError, JWTTokenResponse, Post, Comment } from "../schema";

const mockFetch = global.fetch = jest.fn();

describe("Remote API functions", () => {
    
    beforeEach(() => {
        mockFetch.mockClear();
    });

    describe("registerUser", () => {
        it("should register a user successfully", async () => {
            const mockResponse: JWTTokenResponse = {
                token: "mockToken",
                username: "",
                id: 0
            };
            mockFetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await registerUser("username", "email@example.com", "password");
            expect(result).toEqual(mockResponse);
        });

        it("should return error when registration fails", async () => {
            const mockError: ServerError = { error: "Registration failed" };
            mockFetch.mockResolvedValue({
                ok: false,
                json: jest.fn().mockResolvedValue(mockError),
            });

            const result = await registerUser("username", "email@example.com", "password");
            expect(result).toEqual(mockError);
        });
    });

    describe("loginUser", () => {
        it("should log in a user successfully", async () => {
            const mockResponse: JWTTokenResponse = {
                token: "mockToken",
                username: "",
                id: 0
            };
            mockFetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await loginUser("username", "password");
            expect(result).toEqual(mockResponse);
        });

        it("should return error when login fails", async () => {
            const mockError: ServerError = { error: "Login failed" };
            mockFetch.mockResolvedValue({
                ok: false,
                json: jest.fn().mockResolvedValue(mockError),
            });

            const result = await loginUser("username", "password");
            expect(result).toEqual(mockError);
        });
    });

    describe("getCommunities", () => {
        // it("should get a list of communities", async () => {
        //     const mockresponse: paginationresponse<community> = {
        //         count: 1,
        //         next: null,
        //         prev: null,
        //         results: [{ id: 1, name: "community 1", description: "description", picture: null, owner: 0, num_members: 100 }],
        //     };
        //     mockfetch.mockresolvedvalue({
        //         ok: true,
        //         json: jest.fn().mockresolvedvalue(mockresponse),
        //     });

        //     const result = await getcommunities();
        //     expect(result).toequal(mockresponse);
        // });

        it("should return error if fetching communities fails", async () => {
            const mockError: ServerError = { error: "Fetch failed" };
            mockFetch.mockResolvedValue({
                ok: false,
                json: jest.fn().mockResolvedValue(mockError),
            });

            const result = await getCommunities();
            expect(result).toEqual(mockError);
        });
    });

    describe("createPost", () => {
        it("should create a post successfully", async () => {
            const mockToken = "mockToken";
            const postData = { text: "New post", community: 1 };
            const mockResponse: Post = {
                id: 1, text: "New post", community: 1,
                user: 0,
                username: "",
                image: null,
                datetime: "",
                community_name: ""
            };

            mockFetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await createPost(mockToken, postData);
            expect(result).toEqual(mockResponse);
        });

        it("should return error when creating post fails", async () => {
            const mockToken = "mockToken";
            const postData = { text: "New post", community: 1 };
            const mockError: ServerError = { error: "Create post failed" };

            mockFetch.mockResolvedValue({
                ok: false,
                json: jest.fn().mockResolvedValue(mockError),
            });

            const result = await createPost(mockToken, postData);
            expect(result).toEqual(mockError);
        });
    });

    describe("postComment", () => {
        it("should post a comment successfully", async () => {
            const mockToken = "mockToken";
            const commentText = "Great post!";
            const postId = 1;
            const mockResponse: Comment = { id: 1, text: commentText, post: postId, user: 0, username: "", datetime: "" };

            mockFetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await postComment(mockToken, commentText, postId);
            expect(result).toEqual(mockResponse);
        });

        it("should return error when posting comment fails", async () => {
            const mockToken = "mockToken";
            const commentText = "Great post!";
            const postId = 1;
            const mockError: ServerError = { error: "Post comment failed" };

            mockFetch.mockResolvedValue({
                ok: false,
                json: jest.fn().mockResolvedValue(mockError),
            });

            const result = await postComment(mockToken, commentText, postId);
            expect(result).toEqual(mockError);
        });
    });

    // Add similar tests for `sendFriendRequest`, `modifyProfile`, and `acceptFriendRequest`
});
