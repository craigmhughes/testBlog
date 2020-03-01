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

        console.log(userName);

        const response = await fetch(!userName ? "Posts" : `Posts/User/${userName}`, {
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

                    let date = post.postedAt.split("T");
                    date = date[0].split("-");
                    date = `${date[2]}/${date[1]}/${date[0]}`;

                    console.log(date);

                    return (
                        <article className="card" key={post.id}>
                            <section className="card-body">
                                <h2 className="card-title">{post.title}</h2>
                                <p className="card-text">{`Posted at: ${date} by ${post.author}`}</p>
                                <p className="card-text">{post.description}</p>
                            </section>
                        </article>
                    );
                })}
            </section>
        );
    }

    async switchPostsView() {

        // Reset Posts
        this.setState({
            posts: null,
            loading: true,
            usersPosts: !this.state.usersPosts
        });

        let user = await authService.getUser();

        // Repopulate posts
        this.populatePosts(this.state.usersPosts ? user.name : null);

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
