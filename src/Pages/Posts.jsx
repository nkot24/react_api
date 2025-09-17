import { useEffect, useState } from 'react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // Form states for creating a post
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('You must be logged in to view posts.');
        } else {
          setError('Failed to load posts');
        }
        return;
      }

      const data = await res.json();
      setPosts(data);
      setError('');
    } catch (err) {
      setError('An error occurred while fetching posts.');
      console.error(err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!title.trim() || !body.trim()) {
      setFormError('Title and body are required');
      return;
    }

    try {
      // Ensure CSRF cookie is set before sending POST request
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

      const res = await fetch('/api/posts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        if (res.status === 422) {
          const errorData = await res.json();
          const messages = errorData.errors ? Object.values(errorData.errors).flat().join(' ') : errorData.message;
          setFormError(messages);
        } else if (res.status === 401) {
          setFormError('You must be logged in to create posts.');
        } else {
          setFormError('Failed to create post');
        }
        return;
      }

      const newPost = await res.json();
      setPosts([newPost, ...posts]); // Add new post at the top
      setFormSuccess('Post created successfully!');
      setTitle('');
      setBody('');
    } catch (err) {
      setFormError('An error occurred while creating the post.');
      console.error(err);
    }
  };

  return (
    <>
      <h1>Posts</h1>

      {/* Create post form */}
      <form onSubmit={handleCreatePost} style={{ marginBottom: '2rem' }}>
        <h2>Create New Post</h2>
        {formError && <p style={{ color: 'red' }}>{formError}</p>}
        {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: 'block', marginBottom: '1rem', width: '300px' }}
        />
        <textarea
          placeholder="Body"
          value={body}
          required
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          style={{ display: 'block', marginBottom: '1rem', width: '300px' }}
        />
        <button type="submit">Create Post</button>
      </form>

      {/* Error fetching posts */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Posts list */}
      {posts.length === 0 && !error && <p>No posts available.</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
