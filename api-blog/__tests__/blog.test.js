import { describe, expect, it, jest } from '@jest/globals';
import { GET, POST, PUT, DELETE } from '../app/api/blog/route';

describe('Blog API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (method, body = null, params = null) => ({
    method,
    json: () => Promise.resolve(body),
    url: `http://localhost:3000/api/blog${params ? '?' + params : ''}`
  });

  // Test 1: GET - Fetch all posts
  it('should fetch all blog posts successfully', async () => {
    const response = await GET();
    const posts = await response.json();

    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0].data).toHaveProperty('title');
    expect(posts[0].data).toHaveProperty('content');
  });

  // Test 2: POST - Create new post
  it('should create a new blog post successfully', async () => {
    const newPost = {
      slugId: 'test-post',
      title: 'Test Blog Post',
      content: 'This is a test blog post content'
    };

    const request = createRequest('POST', newPost);
    const response = await POST(request);
    const result = await response.json();

    expect(result).toHaveProperty('id');
    expect(result.data).toMatchObject(newPost);
  });

  // Test 3: POST - Validation error
  it('should return error when creating post without required fields', async () => {
    const invalidPost = {
      title: 'Incomplete Post'
    };

    const request = createRequest('POST', invalidPost);
    const response = await POST(request);
    const result = await response.json();

    expect(result).toHaveProperty('error');
  });

  // Test 4: PUT - Update post
  it('should update an existing blog post successfully', async () => {
    const updates = {
      title: 'Updated Title',
      content: 'Updated content'
    };

    const request = createRequest('PUT', updates, 'id=1');
    const response = await PUT(request);
    const result = await response.json();

    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('post');
  });

  // Test 5: DELETE - Delete post
  it('should delete a blog post successfully', async () => {
    const request = createRequest('DELETE', null, 'id=1');
    const response = await DELETE(request);
    const result = await response.json();

    expect(result).toHaveProperty('message');
  });

  // Test 6: DELETE - Not found error
  it('should handle deleting non-existent post', async () => {
    const request = createRequest('DELETE', null, 'id=999');
    const response = await DELETE(request);
    const result = await response.json();

    expect(result).toHaveProperty('error');
  });
}); 