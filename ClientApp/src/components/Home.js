import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            posts: null,
            loading: true,
            usersPosts: false,
            isLoggedIn: false
        };
    }

    /**
     *  On load, populate posts to then render.
     * */
    async componentDidMount() {
        this.populatePosts();

        // Get auth status & dependent on status, change auth state.
        if (await authService.isAuthenticated()) {
            this.setState({
                isLoggedIn: true
            });
        }
    }

    /**
     *  GET Requests to populate posts state. Sets loading state to false on
     *  completion.
     * */
    async populatePosts(userName) {

        const response = await fetch(!userName ? "Posts" : `Posts/${userName}`, {
            method: 'GET'
        }).then(res => res.json());

        const data = await response.posts;
        console.log(data);
        this.setState({ posts: data, loading: false });
    }

    /**
     * Render elements to fill body content.
     * @param {Array} posts
     */
    renderPostsElements(posts) {

        // Let user know there are no posts.
        if (posts.length < 1) {
            return <p>No posts to show</p>;
        }

        return (
            <section>
                {posts.map(post => {
                    return <article key={post.Id}>
                        <p>{post.Title}</p>
                        <p>`Posted at: ${post.PostedAt} by ${post.Author}`</p>
                        <p>{post.Description}</p>
                        <p>{post.Body}</p>
                    </article>
                })}
            </section>
        );
    }

    switchPostsView() {

        // Reset Posts
        this.setState({
            posts: null,
            loading: true,
            usersPosts: !this.state.usersPosts
        });

        // Repopulate posts
        this.populatePosts(!this.state.usersPosts ? authService.getUser.name : null);

    }


    render() {

        // Decide content on loading state
        let content = this.state.loading ? <p>Loading...</p> :
            this.renderPostsElements(this.state.posts);

        // Button will not exist for non authed users
        let viewSwitch = this.state.isLoggedIn ?
            <button onClick={() => { this.switchPostsView(); }}>{`${this.state.usersPosts ? "All Posts" : "My Posts"}`}</button>
            : null;

        return (
            <main>
                <h1>Blog Posts</h1>
                {viewSwitch}
                {content}
            </main>
        );
    }
}
