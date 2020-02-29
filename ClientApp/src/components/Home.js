import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            posts: null,
            loading: true
        };
    }

    /**
     *  On load, populate posts to then render.
     * */
    componentDidMount() {
        this.populatePosts();
    }

    /**
     *  GET Requests to populate posts state. Sets loading state to false on
     *  completion.
     * */
    async populatePosts() {

        const response = await fetch("Posts", {
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


    render() {

        let content = this.state.loading ? <p>Loading...</p> :
            this.renderPostsElements(this.state.posts);

        return (
            <main>
                <h1>Hello, world!</h1>
                {content}
            </main>
        );
    }
}
