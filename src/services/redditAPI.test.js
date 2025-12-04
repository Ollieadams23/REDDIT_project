/**
 * Reddit API Service Tests
 * 
 * Tests for the Reddit API integration layer
 */

import * as redditAPI from './redditAPI';

// Mock the global fetch function
global.fetch = jest.fn();

describe('Reddit API Service', () => {
  beforeEach(() => {
    // Clear fetch mock before each test
    fetch.mockClear();
  });

  describe('fetchSubredditPosts', () => {
    it('should fetch posts successfully', async () => {
      const mockResponse = {
        data: {
          children: [
            {
              data: {
                id: '1',
                title: 'Test Post',
                author: 'testuser',
                score: 100,
                num_comments: 50,
                created_utc: 1234567890,
                subreddit: 'reactjs',
                thumbnail: 'https://example.com/thumb.jpg',
                url: 'https://reddit.com/r/reactjs/test',
                selftext: 'Test content',
                is_video: false,
              },
            },
          ],
          after: 'abc123',
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await redditAPI.fetchSubredditPosts('reactjs', 'hot', 'day');

      expect(result).toHaveProperty('posts');
      expect(result).toHaveProperty('after');
      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].title).toBe('Test Post');
      expect(result.after).toBe('abc123');
    });

    it('should handle API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

      await expect(
        redditAPI.fetchSubredditPosts('reactjs', 'hot', 'day')
      ).rejects.toThrow('Reddit API error: 403 Forbidden');
    });

    it('should support pagination with after token', async () => {
      const mockResponse = {
        data: {
          children: [],
          after: 'next_page_token',
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await redditAPI.fetchSubredditPosts(
        'reactjs',
        'hot',
        'day',
        'previous_token'
      );

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('after=previous_token'),
        expect.any(Object)
      );
      expect(result.after).toBe('next_page_token');
    });
  });

  describe('searchPosts', () => {
    it('should search posts successfully', async () => {
      const mockResponse = {
        data: {
          children: [
            {
              data: {
                id: '2',
                title: 'Search Result',
                author: 'searcher',
                score: 200,
              },
            },
          ],
          after: 'search_token',
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await redditAPI.searchPosts('react hooks', 'reactjs', 'relevance', 'all');

      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].title).toBe('Search Result');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search.json'),
        expect.any(Object)
      );
    });

    it('should support search pagination', async () => {
      const mockResponse = {
        data: {
          children: [],
          after: null,
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await redditAPI.searchPosts('test', 'all', 'relevance', 'all', 'after_token');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('after=after_token'),
        expect.any(Object)
      );
    });
  });

  describe('fetchPostWithComments', () => {
    it('should fetch post with comments', async () => {
      const mockResponse = [
        {
          data: {
            children: [
              {
                data: {
                  id: 'post1',
                  title: 'Test Post with Comments',
                  selftext: 'Post body',
                },
              },
            ],
          },
        },
        {
          data: {
            children: [
              {
                kind: 't1',
                data: {
                  id: 'comment1',
                  author: 'commenter',
                  body: 'Great post!',
                  score: 10,
                  created_utc: 1234567890,
                  replies: '',
                },
              },
            ],
          },
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await redditAPI.fetchPostWithComments('reactjs', 'abc123');

      expect(result).toHaveProperty('post');
      expect(result).toHaveProperty('comments');
      expect(result.post.title).toBe('Test Post with Comments');
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0].body).toBe('Great post!');
    });
  });
});
