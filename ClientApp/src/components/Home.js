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
            isLoggedIn: false,
            name: null
        };
    }

    /**
     *  On load, populate posts to then render.
     * */
    async componentDidMount() {
        // Get auth status & dependent on status, change auth state.
        if (await authService.isAuthenticated()) {
            this.setState({
                isLoggedIn: true,
            });
        }

        let user = await authService.getUser();

        this.populatePosts(false, user.name);
    }

    /**
     * GET Requests to populate posts state. Sets loading state to false on
     * completion.
     * 
     * @param {any} getUser
     * @param {any} userName
     */
    async populatePosts(getUser, userName) {

        console.log(getUser);

        const response = await fetch(!getUser ? "Posts" : `Posts/User/${userName}`, {
            method: 'GET'
        }).then(res => res.json());

        const data = await response.posts;
        console.log(data);
        this.setState({ posts: data, loading: false, name: userName });
    }

    /**
     * DELETE Post based on passed id
     * 
     * @param {any} post
     */
    async deletePost(post) {
        const token = await authService.getAccessToken();

        const response = await fetch(`Posts/${post.id}`, {
            method: 'DELETE',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post),
        }).then(res => res.json());

        console.log(response);
        this.populatePosts(false, this.state.name);
    }

    /**
     * Render elements to fill body content.
     * @param {Array} posts
     */
    renderPostsElements(posts, user) {

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

                    console.log(this.state.userName);

                    let ownerMenu = user !== post.author ? null :
                        <div className="btn-group float-right" role="group" aria-label="Edit post menu">
                            <button type="button" className="btn btn-outline-secondary">Edit</button>
                            <button type="button" onClick={() => { this.deletePost(post) }} className="btn btn-outline-secondary">Delete</button>
                        </div>

                    return (
                        <article className="card mb-2" key={post.id}>
                            <section className="card-body row">
                                <section className="col-sm">
                                    <h2 className="card-title">{post.title}</h2>
                                    <p className="card-text">{`Posted at: ${date} by ${post.author}`}</p>
                                    <p className="card-text">{post.description}</p>
                                </section>
                        
                                <section className="col-sm">
                                    {ownerMenu}
                                </section>
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
        this.populatePosts(this.state.usersPosts, user.name);

    }


    render() {

        // Decide content on loading state
        let content = this.state.loading ? <p>Loading...</p> :
            this.renderPostsElements(this.state.posts, this.state.name);

        // Button will not exist for non authed users
        let viewSwitch = this.state.isLoggedIn ?
            <button className="btn btn-primary float-right" onClick={() => { this.switchPostsView(); }}>{`${this.state.usersPosts ? "All Posts" : "My Posts"}`}</button>
            : null;

        return (
            <main>
                <section className="row mb-4 pt-3">
                    <h1 className="col">Blog Posts</h1>
                    <div className="col">
                        {viewSwitch}
                    </div>
                </section>
                
                {content}
            </main>
        );
    }
}
